import { NextRequest, NextResponse } from "next/server";
import { getModuleById, getLessonsForModule } from "@/lib/curriculum";
import { getAsyncDb } from "@/lib/db";
import { requireAuth, extractCorrelationId } from "@/lib/auth";
import { createLogger, RateLimits, checkRateLimit } from "@/lib/logger";

interface StudentProfile {
  lessonsCompleted: string | null;
  moduleQuizScores: string | null;
}

async function getModuleCompletion(
  userId: string,
  moduleId: string,
): Promise<{
  isComplete: boolean;
  quizScore: number | null;
  lessonCount: number;
}> {
  const mod = getModuleById(moduleId);
  if (!mod) return { isComplete: false, quizScore: null, lessonCount: 0 };

  const lessons = getLessonsForModule(moduleId);
  const db = getAsyncDb();
  const student = await db.get<StudentProfile>(
    "SELECT lessonsCompleted, moduleQuizScores FROM student_profiles WHERE user_id = ?",
    userId,
  );

  if (!student)
    return { isComplete: false, quizScore: null, lessonCount: lessons.length };

  const lessonsCompleted = student.lessonsCompleted
    ? JSON.parse(student.lessonsCompleted)
    : [];
  const moduleQuizScores = student.moduleQuizScores
    ? JSON.parse(student.moduleQuizScores)
    : {};

  const allLessonsDone = lessons.every((l) => lessonsCompleted.includes(l.id));
  const quizScore = moduleQuizScores[moduleId]?.score ?? null;

  return { isComplete: allLessonsDone, quizScore, lessonCount: lessons.length };
}

export async function POST(request: NextRequest) {
  const correlationId = extractCorrelationId(request);
  const log = createLogger("certificates:issue", correlationId);

  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const rateLimit = checkRateLimit(
      `certificates:${user.id}`,
      RateLimits.default,
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
    const { moduleId } = body;

    if (!moduleId || typeof moduleId !== "string") {
      return NextResponse.json({ error: "moduleId required" }, { status: 400 });
    }

    const mod = getModuleById(moduleId);
    if (!mod) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    const completion = await getModuleCompletion(user.id, moduleId);
    if (!completion.isComplete) {
      return NextResponse.json(
        { error: "Module not yet completed" },
        { status: 400 },
      );
    }

    // Issue certificate logic here
    return NextResponse.json({
      success: true,
      certificateId: `cert-${Date.now()}-${user.id.slice(0, 8)}`,
      moduleId,
      userId: user.id,
      issuedAt: new Date().toISOString(),
    });
  } catch (error) {
    log.error("Error issuing certificate", error as Error, {
      error: String(error),
    });
    return NextResponse.json(
      { error: "Failed to issue certificate" },
      { status: 500 },
    );
  }
}
