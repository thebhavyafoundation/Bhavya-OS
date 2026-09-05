/**
 * Forest Single Mission API
 *
 * GET: Returns a single Forest mission by ID.
 *
 * ## Visibility
 *
 * - Public callers: only institutional records (provenance="institutional")
 * - Authenticated content managers: all records
 *
 * ## Design
 *
 * Uses content-core's getMission() which resolves through the same path
 * as getMissions() — canonical workspace root content/forest/.
 */

import { NextRequest, NextResponse } from "next/server";
import { getMission } from "@bhavya/content-core";
import { requireAuth } from "@/lib/api-auth";
import { roleIsAllowed, CONTENT_MANAGEMENT_ROLES, type Role } from "@/lib/roles";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id || typeof id !== "string") {
    return NextResponse.json({ error: "Invalid mission ID" }, { status: 400 });
  }

  const mission = getMission(id);

  if (!mission) {
    return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  }

  // Public projection: only institutional records are visible
  if (mission.provenance !== "institutional") {
    // Check if caller is an authenticated content manager
    const user = await requireAuth(request);
    if (!user || !roleIsAllowed(user.role as Role, CONTENT_MANAGEMENT_ROLES)) {
      return NextResponse.json({ error: "Mission not found" }, { status: 404 });
    }
  }

  return NextResponse.json(mission);
}
