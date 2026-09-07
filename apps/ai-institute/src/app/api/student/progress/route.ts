import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import {
  getStudentByUserId,
  updateStudent,
  completeLesson,
} from "@/lib/student-store";
import { checkRateLimit, RateLimits } from "@/lib/rate-limit";
import { createLogger, extractCorrelationId } from "@/lib/logger";
import { roleIsAllowed, type Role } from "@/lib/roles";
import { recordAuditEvent } from "@/lib/audit-repository";
import { getCourseById, courses } from "@/data/academy-courses";
import { labExercises } from "@/data/lab-exercises";

/** Check if a lesson ID exists in any course (globally unique lesson IDs). */
function isValidLessonId(lessonId: string): boolean {
  return courses.some((c) =>
    c.modules.some((m) => m.lessons.some((l) => l.id === lessonId)),
  );
}

export async function POST(request: NextRequest) {
  const correlationId = extractCorrelationId(request);
  const log = createLogger("student:progress", correlationId);

  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Only students and builders can submit progress
    if (!roleIsAllowed(user.role as Role, ["student", "builder"])) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    const rateLimit = checkRateLimit(
      `progress:${user.id}`,
      RateLimits.progress,
    );
    if (rateLimit.limited) {
      log.warn("Rate limit exceeded", { userId: user.id });
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
            ),
          },
        },
      );
    }

    const body = await request.json();
    const { action, data } = body;

    if (!action || typeof action !== "string") {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    let student = await getStudentByUserId(user.id);
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    switch (action) {
      case "completeLesson": {
        if (!data?.lessonId || !isValidLessonId(data.lessonId)) {
          return NextResponse.json(
            { error: "Invalid lesson ID" },
            { status: 400 },
          );
        }
        student = await completeLesson(user.id, data.lessonId);
        await recordAuditEvent({
          action: "lesson-complete",
          actorId: user.id,
          resource: "lesson",
          resourceId: data.lessonId,
        });
        log.info("Lesson completed", {
          userId: user.id,
          lessonId: data.lessonId,
        });
        break;
      }
      case "completeLab": {
        if (!data?.taskId || !labExercises.some((e) => e.id === data.taskId)) {
          return NextResponse.json(
            { error: "Invalid task ID" },
            { status: 400 },
          );
        }
        const completed = student.labTasksCompleted.includes(data.taskId)
          ? student.labTasksCompleted
          : [...student.labTasksCompleted, data.taskId];
        student = await updateStudent(user.id, {
          labTasksCompleted: completed,
        });
        log.info("Lab completed", { userId: user.id, taskId: data.taskId });
        break;
      }
      case "submitQuiz": {
        if (
          !data?.answers ||
          typeof data.score !== "number" ||
          data.score < 0 ||
          data.score > 100
        ) {
          return NextResponse.json(
            { error: "Invalid quiz data" },
            { status: 400 },
          );
        }
        student = await updateStudent(user.id, {
          knowledgeCheckAnswers: data.answers,
          knowledgeCheckScore: data.score,
        });
        await recordAuditEvent({
          action: "quiz-submit",
          actorId: user.id,
          resource: "quiz",
          resourceId: "knowledge-check",
        });
        log.info("Quiz submitted", { userId: user.id, score: data.score });
        break;
      }
      case "submitProject": {
        if (
          typeof data?.score !== "number" ||
          data.score < 0 ||
          data.score > 100
        ) {
          return NextResponse.json(
            { error: "Invalid project score" },
            { status: 400 },
          );
        }
        student = await updateStudent(user.id, {
          projectSubmitted: true,
          projectScore: data.score,
          badgeEarned: data.score >= 80,
        });
        await recordAuditEvent({
          action: "project-submit",
          actorId: user.id,
          resource: "project",
          resourceId: "final-project",
        });
        log.info("Project submitted", { userId: user.id, score: data.score });
        break;
      }
      case "enroll": {
        if (!data?.courseId || !getCourseById(data.courseId)) {
          return NextResponse.json(
            { error: "Invalid course ID" },
            { status: 400 },
          );
        }
        const enrolled = student.enrolledCourses.includes(data.courseId)
          ? student.enrolledCourses
          : [...student.enrolledCourses, data.courseId];
        student = await updateStudent(user.id, {
          enrolledCourses: enrolled,
          currentCourse: data.courseId,
        });
        await recordAuditEvent({
          action: "enroll",
          actorId: user.id,
          resource: "course",
          resourceId: data.courseId,
        });
        log.info("Course enrolled", {
          userId: user.id,
          courseId: data.courseId,
        });
        break;
      }
      case "addReflection": {
        if (
          !data?.lessonId ||
          !data?.content ||
          typeof data.content !== "string" ||
          data.content.length > 5000
        ) {
          return NextResponse.json(
            { error: "Invalid reflection data" },
            { status: 400 },
          );
        }
        const entry = {
          lessonId: data.lessonId,
          content: data.content,
          date: new Date().toISOString(),
        };
        student = await updateStudent(user.id, {
          reflectionEntries: [...student.reflectionEntries, entry],
        });
        log.info("Reflection added", {
          userId: user.id,
          lessonId: data.lessonId,
        });
        break;
      }
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    return NextResponse.json(
      { student },
      {
        headers: { "X-Correlation-Id": correlationId },
      },
    );
  } catch (err) {
    log.error(
      "Progress update failed",
      err instanceof Error ? err : new Error(String(err)),
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
