import { NextRequest, NextResponse } from "next/server";
import { deleteSession } from "@/lib/api-auth";
import { createLogger, extractCorrelationId } from "@/lib/logger";

export async function POST(request: NextRequest) {
  const correlationId = extractCorrelationId(request);
  const log = createLogger("auth:logout", correlationId);

  const token = request.cookies.get("session-token")?.value;
  if (token) {
    deleteSession(token);
    log.info("Session deleted");
  }

  const response = NextResponse.json({ success: true }, {
    headers: { "X-Correlation-Id": correlationId },
  });
  response.cookies.set("session-token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });

  return response;
}
