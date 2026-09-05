import { NextRequest, NextResponse } from "next/server";
import { getKO, updateKO, deleteKO } from "@/lib/knowledge-repository";
import { requireAuth } from "@/lib/api-auth";
import { roleIsAllowed, CONTENT_MANAGEMENT_ROLES, type Role } from "@/lib/roles";
import { recordEvidence, koEventKey } from "@/lib/institutional-evidence";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  const { id } = await params;
  const ko = getKO(id);
  if (!ko) {
    return NextResponse.json({ error: "Knowledge Object not found" }, { status: 404 });
  }
  return NextResponse.json(ko);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // 1. Authentication
  const user = await requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  // 2. Authorization
  if (!roleIsAllowed(user.role as Role, CONTENT_MANAGEMENT_ROLES)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  // 3. Parse body
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON", errors: [{ field: "body", message: "Request body must be valid JSON" }] },
      { status: 400 },
    );
  }

  // 4. Strip server-controlled fields (clients cannot overwrite these)
  const { id: _id, createdAt: _createdAt, provenance: _provenance, version: _version, ...safeBody } = body;

  // 5. Validate status if provided
  if (safeBody.status !== undefined && safeBody.status !== "draft" && safeBody.status !== "published") {
    return NextResponse.json(
      { error: "Invalid status", errors: [{ field: "status", message: "Status must be 'draft' or 'published'" }] },
      { status: 400 },
    );
  }

  // 6. Canonical mutation
  const { id } = await params;
  const ko = updateKO(id, safeBody);
  if (!ko) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 7. Record evidence (non-fatal)
  let evidenceRecorded = true;
  try {
    recordEvidence(
      "ko-updated",
      ko.id,
      `Knowledge Object "${ko.title}" updated`,
      { domain: ko.domain, title: ko.title, updatedBy: user.id },
      koEventKey(ko.id, "ko-updated"),
    );
  } catch {
    evidenceRecorded = false;
  }

  // 8. Return result with warnings if evidence failed
  const response: Record<string, unknown> = { ...ko };
  if (!evidenceRecorded) {
    response.warnings = ["Evidence recording failed"];
    response.partialProcessing = true;
  }

  return NextResponse.json(response);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // 1. Authentication
  const user = await requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  // 2. Authorization (admin only for deletion)
  if (!roleIsAllowed(user.role as Role, ["admin"])) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }

  // 3. Canonical deletion
  const { id } = await params;
  const deleted = deleteKO(id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // 4. Record evidence (non-fatal)
  // Note: metrics are intentionally NOT decremented — totalKos is a cumulative counter
  // (documents total creation events, not current inventory). This preserves the semantic
  // that metrics represent institutional activity volume, not current state.
  let evidenceRecorded = true;
  try {
    recordEvidence(
      "ko-deleted",
      id,
      `Knowledge Object "${id}" deleted`,
      { deletedBy: user.id },
      koEventKey(id, "ko-deleted"),
    );
  } catch {
    evidenceRecorded = false;
  }

  // 5. Return result with warnings if evidence failed
  const response: Record<string, unknown> = { success: true };
  if (!evidenceRecorded) {
    response.warnings = ["Evidence recording failed"];
    response.partialProcessing = true;
  }

  return NextResponse.json(response);
}
