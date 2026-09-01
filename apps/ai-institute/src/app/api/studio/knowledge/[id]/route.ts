import { NextRequest, NextResponse } from "next/server";
import { getKO, updateKO, deleteKO } from "@/lib/knowledge-repository";
import { requireAuth } from "@/lib/api-auth";
import { roleIsAllowed, CONTENT_MANAGEMENT_ROLES, type Role } from "@/lib/roles";

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
  const user = await requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (!roleIsAllowed(user.role as Role, CONTENT_MANAGEMENT_ROLES)) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }
  const { id } = await params;
  const body = await request.json();
  const ko = updateKO(id, body);
  if (!ko) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(ko);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (!roleIsAllowed(user.role as Role, ["admin"])) {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }
  const { id } = await params;
  const deleted = deleteKO(id);
  if (!deleted) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
