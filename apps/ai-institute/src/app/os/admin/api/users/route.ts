import { NextRequest, NextResponse } from "next/server";
import { requireAuth, stripSensitive, type ApiUser } from "@/lib/api-auth";
import { getUserRepository } from "@/lib/repositories";
import { roleIsAllowed, type Role } from "@/lib/roles";

/**
 * Admin user directory. Admin role only.
 * Password hashes are never serialized (stripSensitive).
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

  const userRepo = getUserRepository();
  const users = await userRepo.findAll();
  const safe = users.map((u) => stripSensitive(u as unknown as ApiUser));

  const byRole: Record<string, number> = {};
  for (const u of safe) {
    byRole[u.role] = (byRole[u.role] ?? 0) + 1;
  }

  return NextResponse.json({ users: safe, total: safe.length, byRole });
}
