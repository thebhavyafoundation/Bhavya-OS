import { NextRequest, NextResponse } from "next/server";
import {
  requireAuth,
  verifyPassword,
  hashPassword,
  deleteAllSessionsForUser,
} from "@/lib/api-auth";
import { getUserRepository } from "@/lib/repositories";
import { checkRateLimit, RateLimits } from "@/lib/rate-limit";
import { recordAuditEvent } from "@/lib/audit-repository";
import { createLogger, extractCorrelationId } from "@/lib/logger";

/**
 * Change password for the authenticated user.
 * Requires the current password — knowledge of the session alone is
 * not sufficient to rotate credentials.
 */
export async function PUT(request: NextRequest) {
  const correlationId = extractCorrelationId(request);
  const log = createLogger("auth:password", correlationId);

  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const rateLimit = checkRateLimit(
      `password:${user.id}`,
      RateLimits.register,
    );
    if (rateLimit.limited) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body ?? {};
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current and new passwords are required" },
        { status: 400 },
      );
    }
    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const ok = await verifyPassword(currentPassword, user.passwordHash);
    if (!ok) {
      log.warn("Password change rejected: current password mismatch", {
        userId: user.id,
      });
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 403 },
      );
    }

    const userRepo = getUserRepository();
    await userRepo.updatePassword(user.id, await hashPassword(newPassword));
    await recordAuditEvent({
      action: "password-change",
      actorId: user.id,
    });

    // Invalidate ALL sessions for this user — prevents stolen session reuse
    await deleteAllSessionsForUser(user.id);

    log.info("Password changed and session invalidated", { userId: user.id });
    return NextResponse.json({ success: true });
  } catch (err) {
    log.error(
      "Password change failed",
      err instanceof Error ? err : new Error(String(err)),
    );
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
