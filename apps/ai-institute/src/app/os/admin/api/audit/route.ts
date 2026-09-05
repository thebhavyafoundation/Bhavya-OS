import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { listAuditEvents } from "@/lib/audit-repository";
import { roleIsAllowed, type Role } from "@/lib/roles";

/**
 * Admin audit event listing. Admin role only.
 * Events are recorded by recordAuditEvent on sensitive actions
 * (login, logout, register, role change, publication).
 */
export async function GET(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }
  if (!roleIsAllowed(user.role as Role, ["admin"])) {
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 },
    );
  }

  const events = await listAuditEvents(200);
  return NextResponse.json({ events, total: events.length });
}
