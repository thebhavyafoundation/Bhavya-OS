import { NextRequest, NextResponse } from "next/server";
import { dbGetKnowledge, dbUpdateKnowledge, dbDeleteKnowledge } from "@/lib/studio/db";
import { requireAuth } from "@/lib/api-auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const ko = await dbGetKnowledge(id);
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
  if (user.role !== "admin" && user.role !== "instructor") {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }
  const { id } = await params;
  const body = await request.json();
  const ko = await dbUpdateKnowledge(id, body);
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
  if (user.role !== "admin") {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }
  const { id } = await params;
  await dbDeleteKnowledge(id);
  return NextResponse.json({ success: true });
}
