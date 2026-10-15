import { NextRequest, NextResponse } from "next/server";
import { getCurriculumModule } from "@/lib/curriculum";
import { getAsyncDb } from "@/lib/db";
import { requireAuth, extractCorrelationId } from "@/lib/auth";
import { createLogger, RateLimits, checkRateLimit } from "@/lib/logger";
import { recordAuditEvent } from "@/lib/audit";

interface StudentProfile {
  lessonsCompleted: string | null;
  moduleQuizScores: string | null;
}

function isValidModuleId(id: string): boolean {
  return /^[a-z0-9-]+$/.test(id);
}

export async function POST(request: NextRequest) {
  const correlationId = extractCorrelationId(request);
  const log = createLogger("student:progress", correlationId);

  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const rateLimit = checkRateLimit(`progress:${user.id}`, RateLimits.default);
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
    const { action, ...data } = body;

    const db = getAsyncDb();
    let student: StudentProfile | null = await db.get<StudentProfile>(
      "SELECT * FROM student_profiles WHERE user_id = ?",
      user.id,
    );

    if (!student) {
      student = await db.get<StudentProfile>(
        "SELECT * FROM student_profiles WHERE user_id = ?",
        user.id,
      );
    }

    if (!student) {
      await db.run(
        `INSERT INTO student_profiles (user_id, lessonsCompleted, moduleQuizScores, createdAt, updatedAt)
         VALUES (?, '[]', '{}', datetime('now'), datetime('now'))`,
        user.id,
      );
      student = await db.get<StudentProfile>(
        "SELECT * FROM student_profiles WHERE user_id = ?",
        user.id,
      );
    }

    switch (action) {
      case "lesson-complete": {
        if (!data.moduleId || !data.lessonId) {
          return NextResponse.json(
            { error: "moduleId and lessonId required" },
            { status: 400 },
          );
        }

        const mod = getCurriculumModule(data.moduleId);
        if (!mod) {
          return NextResponse.json(
            { error: "Module not found" },
            { status: 404 },
          );
        }

        if (!student) {
          return NextResponse.json(
            { error: "Student profile not found" },
            { status: 404 },
          );
        }

        const lessonsCompleted = student.lessonsCompleted
          ? JSON.parse(student.lessonsCompleted)
          : [];

        if (!lessonsCompleted.includes(data.lessonId)) {
          lessonsCompleted.push(data.lessonId);
          student = await updateStudent(user.id, {
            lessonsCompleted: JSON.stringify(lessonsCompleted),
          });
        }

        await recordAuditEvent({
          action: "lesson-complete",
          actorId: user.id,
          resource: "lesson",
          resourceId: data.lessonId,
          metadata: { moduleId: data.moduleId, lessonId: data.lessonId },
        });

        log.info("Lesson completed", {
          userId: user.id,
          moduleId: data.moduleId,
          lessonId: data.lessonId,
        });
        break;
      }
      case "module-quiz-submit": {
        if (!isValidModuleId(data.moduleId)) {
          return NextResponse.json(
            { error: "Invalid moduleId" },
            { status: 400 },
          );
        }

        if (!student) {
          return NextResponse.json(
            { error: "Student profile not found" },
            { status: 404 },
          );
        }

        const moduleQuizScores = student.moduleQuizScores
          ? JSON.parse(student.moduleQuizScores)
          : {};
        const updatedStudent = await updateStudent(user.id, {
          moduleQuizScores: {
            ...moduleQuizScores,
            [data.moduleId]: {
              quizId: data.quizId,
              score: data.score,
              submittedAt: new Date().toISOString(),
            },
          },
        });

        await recordAuditEvent({
          action: "module-quiz-submit",
          actorId: user.id,
          resource: "curriculum-module-quiz",
          resourceId: data.moduleId,
          metadata: { quizId: data.quizId, score: data.score },
        });

        log.info("Module quiz submitted", {
          userId: user.id,
          moduleId: data.moduleId,
          quizId: data.quizId,
          score: data.score,
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
    log.error("Error updating progress", err as Error, { error: String(err) });
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 },
    );
  }
}

async function updateStudent(
  userId: string,
  updates: Record<string, unknown>,
): Promise<StudentProfile | null> {
  const db = getAsyncDb();
  const setClause = Object.keys(updates)
    .map((k) => `${k} = ?`)
    .join(", ");
  const values = [...Object.values(updates), userId];

  await db.run(
    `UPDATE student_profiles SET ${setClause}, updatedAt = datetime('now') WHERE user_id = ?`,
    values,
  );

  return db.get("SELECT * FROM student_profiles WHERE user_id = ?", userId);
}
