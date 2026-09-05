import { NextRequest, NextResponse } from "next/server";
import {
  deleteSession,
  findSessionByToken,
  findUserById,
} from "@/lib/api-auth";
import { recordAuditEvent } from "@/lib/audit-repository";
import { createLogger, extractCorrelationId } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const correlationId = extractCorrelationId(request);
  const log = createLogger("auth:logout", correlationId);

  const token = request.cookies.get("session-token")?.value;
  if (token) {
    // Resolve the actor before destroying the session. Best-effort:
    // logout must succeed even if audit resolution fails.
    try {
      const session = await findSessionByToken(token);
      const actor = session ? await findUserById(session.userId) : null;
      if (actor) {
        await recordAuditEvent({
          actorId: actor.id,
          actorEmail: actor.email,
          action: "logout",
          resource: "session",
          result: "success",
        });
      }
    } catch {
      // fall through to session deletion
    }
    deleteSession(token);
    log.info("Session deleted");
  }

  const response = NextResponse.json(
    { success: true },
    {
      headers: { "X-Correlation-Id": correlationId },
    },
  );
  response.cookies.set("session-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}
