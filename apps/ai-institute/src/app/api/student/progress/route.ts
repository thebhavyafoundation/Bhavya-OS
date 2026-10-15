import { NextRequest, NextResponse } from "next/server";
import { requireAuth, extractCorrelationId } from "@/lib/auth";
import { createLogger, RateLimits, checkRateLimit } from "@/lib/logger";
import { recordAuditEvent } from "@/lib/audit";

/**
 * Row shape of the canonical `student_profiles` table
 * (packages/database/migrations/ai-institute/001_baseline_schema.ts).
 * Columns are snake_case; JSON columns are stored as TEXT.
 */
interface StudentRow {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
  interests: string;
  current_course: string;
  current_lesson_index: number;
  lessons_completed: string;
  assessment_score: number;
  assessment_completed: number;
  lab_tasks_completed: string;
  lab_score: number;
  knowledge_check_answers: string;
  knowledge_check_score: number;
  project_submitted: number;
  project_score: number;
  badge_earned: number;
  reflection_entries: string;
  streak: number;
  last_active_date: string;
  onboarding_complete: number;
  enrolled_courses: string;
  enrolled_at: string;
  updated_at: string;
}

/** Response shape consumed by components/AuthProvider.tsx. */
interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string;
  interests: string[];
  currentCourse: string;
  currentLessonIndex: number;
  lessonsCompleted: string[];
  assessmentScore: number;
  assessmentCompleted: boolean;
  labTasksCompleted: string[];
  labScore: number;
  knowledgeCheckAnswers: Record<string, string | number>;
  knowledgeCheckScore: number;
  projectSubmitted: boolean;
  projectScore: number;
  badgeEarned: boolean;
  reflectionEntries: { lessonId: string; content: string; date: string }[];
  streak: number;
  lastActiveDate: string;
  enrolledCourses: string[];
  onboardingComplete: boolean;
  enrolledAt: string;
  updatedAt: string;
}

/** Only students may mutate their own progress. */
const PROGRESS_WRITE_ROLES = new Set(["student"]);

function parseJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function toProfile(row: StudentRow): StudentProfile {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    email: row.email,
    role: row.role,
    interests: parseJson<string[]>(row.interests, []),
    currentCourse: row.current_course,
    currentLessonIndex: row.current_lesson_index,
    lessonsCompleted: parseJson<string[]>(row.lessons_completed, []),
    assessmentScore: row.assessment_score,
    assessmentCompleted: row.assessment_completed === 1,
    labTasksCompleted: parseJson<string[]>(row.lab_tasks_completed, []),
    labScore: row.lab_score,
    knowledgeCheckAnswers: parseJson<Record<string, string | number>>(
      row.knowledge_check_answers,
      {},
    ),
    knowledgeCheckScore: row.knowledge_check_score,
    projectSubmitted: row.project_submitted === 1,
    projectScore: row.project_score,
    badgeEarned: row.badge_earned === 1,
    reflectionEntries: parseJson<
      { lessonId: string; content: string; date: string }[]
    >(row.reflection_entries, []),
    streak: row.streak,
    lastActiveDate: row.last_active_date,
    enrolledCourses: parseJson<string[]>(row.enrolled_courses, []),
    onboardingComplete: row.onboarding_complete === 1,
    enrolledAt: row.enrolled_at,
    updatedAt: row.updated_at,
  };
}

function appendUnique(list: string[], value: string): string[] {
  return list.includes(value) ? list : [...list, value];
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
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

    // Authorisation precedes action dispatch: a caller without the student
    // role must never learn whether an action name is valid.
    if (!user.role || !PROGRESS_WRITE_ROLES.has(user.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    const { getAsyncDb } = await import("@/lib/db");
    const db = getAsyncDb();

    const body = (await request.json()) as {
      action?: string;
      data?: Record<string, unknown>;
    };
    const action = body.action;
    const data = body.data ?? {};

    let row = await db.get<StudentRow>(
      "SELECT * FROM student_profiles WHERE user_id = ?",
      user.id,
    );

    if (!row) {
      await db.run(
        `INSERT INTO student_profiles (id, user_id, name, email, role)
         VALUES (?, ?, ?, ?, 'student')`,
        user.id,
        user.id,
        user.email || "",
        user.email || "",
      );
      row = await db.get<StudentRow>(
        "SELECT * FROM student_profiles WHERE user_id = ?",
        user.id,
      );
    }

    if (!row) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 },
      );
    }

    switch (action) {
      case "enroll": {
        const courseId = String(data.courseId ?? "");
        if (!courseId) {
          return NextResponse.json(
            { error: "courseId required" },
            { status: 400 },
          );
        }
        await db.run(
          `UPDATE student_profiles
              SET enrolled_courses = ?, updated_at = datetime('now')
            WHERE user_id = ?`,
          JSON.stringify(
            appendUnique(
              parseJson<string[]>(row.enrolled_courses, []),
              courseId,
            ),
          ),
          user.id,
        );
        break;
      }

      case "completeLesson": {
        const lessonId = String(data.lessonId ?? "");
        if (!lessonId) {
          return NextResponse.json(
            { error: "lessonId required" },
            { status: 400 },
          );
        }
        const lessons = appendUnique(
          parseJson<string[]>(row.lessons_completed, []),
          lessonId,
        );
        const lastActive = row.last_active_date;
        const streak =
          lastActive === today() ? row.streak : lastActive ? row.streak + 1 : 1;
        await db.run(
          `UPDATE student_profiles
              SET lessons_completed = ?, streak = ?, last_active_date = ?,
                  updated_at = datetime('now')
            WHERE user_id = ?`,
          JSON.stringify(lessons),
          streak,
          today(),
          user.id,
        );
        break;
      }

      case "completeLab": {
        const taskId = String(data.taskId ?? "");
        if (!taskId) {
          return NextResponse.json(
            { error: "taskId required" },
            { status: 400 },
          );
        }
        await db.run(
          `UPDATE student_profiles
              SET lab_tasks_completed = ?, updated_at = datetime('now')
            WHERE user_id = ?`,
          JSON.stringify(
            appendUnique(
              parseJson<string[]>(row.lab_tasks_completed, []),
              taskId,
            ),
          ),
          user.id,
        );
        break;
      }

      case "submitQuiz": {
        const score = Number(data.score ?? 0);
        const answers = (data.answers ?? {}) as Record<string, string | number>;
        await db.run(
          `UPDATE student_profiles
              SET knowledge_check_answers = ?, knowledge_check_score = ?,
                  updated_at = datetime('now')
            WHERE user_id = ?`,
          JSON.stringify(answers),
          score,
          user.id,
        );
        break;
      }

      case "submitProject": {
        const score = Number(data.score ?? 0);
        await db.run(
          `UPDATE student_profiles
              SET project_submitted = 1, project_score = ?,
                  updated_at = datetime('now')
            WHERE user_id = ?`,
          score,
          user.id,
        );
        break;
      }

      case "addReflection": {
        const lessonId = String(data.lessonId ?? "");
        const content = String(data.content ?? "");
        if (!lessonId || !content) {
          return NextResponse.json(
            { error: "lessonId and content required" },
            { status: 400 },
          );
        }
        const entries = parseJson<
          { lessonId: string; content: string; date: string }[]
        >(row.reflection_entries, []);
        await db.run(
          `UPDATE student_profiles
              SET reflection_entries = ?, updated_at = datetime('now')
            WHERE user_id = ?`,
          JSON.stringify([
            ...entries,
            { lessonId, content, date: new Date().toISOString() },
          ]),
          user.id,
        );
        break;
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    await recordAuditEvent({
      action: action ?? "unknown",
      actorId: user.id,
      resource: "student-progress",
      resourceId: user.id,
      metadata: { action },
    });

    const updated = await db.get<StudentRow>(
      "SELECT * FROM student_profiles WHERE user_id = ?",
      user.id,
    );

    log.info("Student progress updated", { userId: user.id, action });

    return NextResponse.json(
      { student: updated ? toProfile(updated) : null },
      { headers: { "X-Correlation-Id": correlationId } },
    );
  } catch (err) {
    log.error("Error updating progress", err as Error, { error: String(err) });
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 },
    );
  }
}
