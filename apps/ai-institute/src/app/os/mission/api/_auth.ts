import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/api-auth";
import { roleIsAllowed, type Role } from "@/lib/roles";

/** Mission Control mutating + read APIs: operators (admin/staff) only. */
export async function requireMissionOperator(req: NextRequest) {
  const user = await requireAuth(req);
  if (!user) {
    return { error: NextResponse.json({ error: "Authentication required" }, { status: 401 }) as NextResponse };
  }
  if (!roleIsAllowed(user.role as Role, ["admin", "staff"])) {
    return { error: NextResponse.json({ error: "Insufficient permissions" }, { status: 403 }) as NextResponse };
  }
  return { user };
}

export function actorOf(user: { email?: string; id?: string }): string {
  return user.email || user.id || "unknown-operator";
}
