import { NextRequest, NextResponse } from "next/server";
import {
  findUserByEmail,
  createUser,
  hashPassword,
  createSession,
  stripSensitive,
} from "@/lib/api-auth";
import { checkRateLimit, RateLimits } from "@/lib/rate-limit";
import { createLogger, extractCorrelationId } from "@/lib/logger";
import { recordAuditEvent } from "@/lib/audit-repository";

export async function POST(request: NextRequest) {
  const correlationId = extractCorrelationId(request);
  const log = createLogger("auth:register", correlationId);

  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const rateLimit = checkRateLimit(`register:${ip}`, RateLimits.register);
    if (rateLimit.limited) {
      log.warn("Rate limit exceeded", { ip });
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((rateLimit.resetAt - Date.now()) / 1000),
            ),
            "X-Correlation-Id": correlationId,
          },
        },
      );
    }

    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      log.warn("Validation failed", {
        hasEmail: !!email,
        hasPassword: !!password,
        hasName: !!name,
      });
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400, headers: { "X-Correlation-Id": correlationId } },
      );
    }
    if (password.length < 8) {
      log.warn("Password too short");
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400, headers: { "X-Correlation-Id": correlationId } },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      log.warn("Invalid email format");
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400, headers: { "X-Correlation-Id": correlationId } },
      );
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      log.warn("Duplicate email registration attempt");
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409, headers: { "X-Correlation-Id": correlationId } },
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await createUser({ email, name, passwordHash });
    const session = await createSession(user);

    log.info("User registered", { userId: user.id });
    await recordAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      action: "register",
      resource: "user",
      resourceId: user.id,
      result: "success",
    });

    const response = NextResponse.json(
      {
        success: true,
        user: stripSensitive(user),
      },
      { headers: { "X-Correlation-Id": correlationId } },
    );

    response.cookies.set("session-token", session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (err) {
    log.error(
      "Registration failed",
      err instanceof Error ? err : new Error(String(err)),
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: { "X-Correlation-Id": correlationId } },
    );
  }
}
