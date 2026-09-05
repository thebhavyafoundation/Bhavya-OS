import { NextRequest, NextResponse } from "next/server";
import {
  findUserByEmail,
  verifyPassword,
  createSession,
  stripSensitive,
} from "@/lib/api-auth";
import { checkRateLimit, RateLimits } from "@/lib/rate-limit";
import { createLogger, extractCorrelationId } from "@/lib/logger";
import { recordAuditEvent } from "@/lib/audit-repository";

export async function POST(request: NextRequest) {
  const correlationId = extractCorrelationId(request);
  const log = createLogger("auth:login", correlationId);

  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    const rateLimit = checkRateLimit(`login:${ip}`, RateLimits.login);
    if (rateLimit.limited) {
      log.warn("Rate limit exceeded", { ip });
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
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
    const { email, password } = body;

    if (!email || !password) {
      log.warn("Validation failed", {
        hasEmail: !!email,
        hasPassword: !!password,
      });
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400, headers: { "X-Correlation-Id": correlationId } },
      );
    }

    const user = await findUserByEmail(email);
    if (!user) {
      log.warn("Login failed — unknown email");
      await recordAuditEvent({
        actorEmail: email,
        action: "login",
        resource: "session",
        result: "failure",
      });
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401, headers: { "X-Correlation-Id": correlationId } },
      );
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      log.warn("Login failed — invalid password", { userId: user.id });
      await recordAuditEvent({
        actorId: user.id,
        actorEmail: user.email,
        action: "login",
        resource: "session",
        result: "failure",
      });
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401, headers: { "X-Correlation-Id": correlationId } },
      );
    }

    const session = await createSession(user);

    log.info("Login successful", { userId: user.id });
    await recordAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      action: "login",
      resource: "session",
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
      "Login failed",
      err instanceof Error ? err : new Error(String(err)),
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: { "X-Correlation-Id": correlationId } },
    );
  }
}
