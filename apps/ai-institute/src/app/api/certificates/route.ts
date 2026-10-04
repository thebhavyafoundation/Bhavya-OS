import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { randomUUID } from "node:crypto";
import { getAsyncDb } from "@/lib/db";
import { getStudentByUserId } from "@/lib/student-store";
import { getModule, getLessonsForModule } from "@/lib/curriculum/lessons";
import { checkRateLimit, RateLimits } from "@/lib/rate-limit";
import { createLogger, extractCorrelationId } from "@/lib/logger";
import { recordAuditEvent } from "@/lib/audit-repository";

async function getCertificateById(id: string) {
  const db = getAsyncDb();
  return db.get("SELECT * FROM certificates WHERE id = ?", id);
}

async function createCertificate(data: {
  id: string;
  learnerName: string;
  moduleId: string;
  userId: string;
  band: string;
  quizScore: number;
}) {
  const db = getAsyncDb();
  const now = new Date().toISOString();
  await db.run(
    `INSERT INTO certificates (id, learner_name, module_id, user_id, band, quiz_score, issued_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    data.id,
    data.learnerName,
    data.moduleId,
    data.userId,
    data.band,
    data.quizScore,
    now,
  );
  return data;
}

function generateCertificateId(): string {
  return `BVF-${randomUUID().slice(0, 12).toUpperCase()}`;
}

async function verifyModuleCompletion(
  userId: string,
  moduleId: string,
): Promise<{
  isComplete: boolean;
  quizScore: number | null;
  lessonCount: number;
}> {
  const module = getModule(moduleId);
  if (!module) return { isComplete: false, quizScore: null, lessonCount: 0 };

  const lessons = getLessonsForModule(moduleId);
  const db = getAsyncDb();
  const student = await db.get(
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

    const module = getModule(moduleId);
    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    const completion = await verifyModuleCompletion(user.id, moduleId);
    if (!completion.isComplete) {
      return NextResponse.json(
        {
          error:
            "Module not yet completed. Complete all lessons and pass the module quiz.",
        },
        { status: 400 },
      );
    }

    if (completion.quizScore === null || completion.quizScore < 80) {
      return NextResponse.json(
        {
          error:
            "Module quiz score below 80%. Retry the module quiz to qualify.",
        },
        { status: 400 },
      );
    }

    const student = await getStudentByUserId(user.id);
    if (!student) {
      return NextResponse.json(
        { error: "Student profile not found" },
        { status: 404 },
      );
    }

    const certificateId = `BVF-${randomUUID().slice(0, 12).toUpperCase()}`;
    const certificate = {
      id: `BVF-${randomUUID().slice(0, 12).toUpperCase()}`,
      learnerName: student.name,
      moduleId,
      userId: user.id,
      band: module.ageBand,
      quizScore: completion.quizScore,
      issuedAt: new Date().toISOString(),
    };

    const db = getAsyncDb();
    await db.run(
      `INSERT INTO certificates (id, learner_name, module_id, user_id, band, quiz_score, issued_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      certificate.id,
      certificate.learnerName,
      certificate.moduleId,
      certificate.userId,
      certificate.band,
      certificate.quizScore,
      certificate.issuedAt,
    );

    await recordAuditEvent({
      action: "certificate-issue",
      actorId: user.id,
      resource: "certificate",
      resourceId: certificate.id,
      metadata: { moduleId, quizScore: completion.quizScore },
    });

    log.info("Certificate issued", {
      userId: user.id,
      certificateId: certificate.id,
      moduleId,
      quizScore: completion.quizScore,
    });

    return NextResponse.json(
      { certificate },
      { headers: { "X-Correlation-Id": correlationId } },
    );
  } catch (err) {
    log.error(
      "Certificate issuance failed",
      err instanceof Error ? err : new Error(String(err)),
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
