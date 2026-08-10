import { NextRequest, NextResponse } from "next/server";
import { findSessionByToken, findUserById } from "@/lib/api-auth";
import { getStudentByUserId, createStudent, updateStudent } from "@/lib/student-store";
import { checkRateLimit, RateLimits } from "@/lib/rate-limit";
import { createLogger, extractCorrelationId } from "@/lib/logger";

export async function GET(request: NextRequest) {
  const correlationId = extractCorrelationId(request);
  const log = createLogger("student:get", correlationId);

  try {
    const token = request.cookies.get("session-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const session = await findSessionByToken(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const user = await findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const rateLimit = checkRateLimit(`api:${user.id}`, RateLimits.api);
    if (rateLimit.limited) {
      log.warn("Rate limit exceeded", { userId: user.id });
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 },
      );
    }

    let student = await getStudentByUserId(user.id);
    if (!student) {
      student = await createStudent({
        userId: user.id,
        name: user.name,
        email: user.email,
        role: "student",
        interests: user.interests || [],
      });
      log.info("Student profile created", { userId: user.id });
    }

    return NextResponse.json({ student }, {
      headers: { "X-Correlation-Id": correlationId },
    });
  } catch (err) {
    log.error("Failed to get student", err instanceof Error ? err : new Error(String(err)));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const correlationId = extractCorrelationId(request);
  const log = createLogger("student:update", correlationId);

  try {
    const token = request.cookies.get("session-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const session = await findSessionByToken(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const user = await findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const rateLimit = checkRateLimit(`api:${user.id}`, RateLimits.api);
    if (rateLimit.limited) {
      log.warn("Rate limit exceeded", { userId: user.id });
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { name, interests } = body;
    const updated = await updateStudent(user.id, { name, interests });
    if (!updated) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    log.info("Student profile updated", { userId: user.id });

    return NextResponse.json({ student: updated }, {
      headers: { "X-Correlation-Id": correlationId },
    });
  } catch (err) {
    log.error("Failed to update student", err instanceof Error ? err : new Error(String(err)));
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
