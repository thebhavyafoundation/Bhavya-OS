import { NextRequest, NextResponse } from "next/server";
import { dbGetLesson, dbUpdateLesson, dbDeleteLesson } from "@/lib/studio/db";
import { requireAuth } from "@/lib/api-auth";
import {
  roleIsAllowed,
  CONTENT_MANAGEMENT_ROLES,
  type Role,
} from "@/lib/roles";
import { recordAuditEvent } from "@/lib/audit-repository";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAuth(request);
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }
  const { id } = await params;
  const lesson = await dbGetLesson(id);
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }
  return NextResponse.json(lesson);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAuth(request);
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 },
    );
  }
  if (!roleIsAllowed(user.role as Role, CONTENT_MANAGEMENT_ROLES)) {
    return NextResponse.json(
      { error: "Insufficient permissions" },
      { status: 403 },
    );
  }
  const { id } = await params;
  const body = await request.json();

  // Input validation: only allow specific fields
  const allowedFields = [
    "title",
    "description",
    "status",
    "content",
    "orderIndex",
  ];
  const validatedData: Record<string, unknown> = {};
  for (const field of allowedFields) {
    if (field in body) {
      validatedData[field] = body[field];
    }
  }

  // Validate status field if present
  if (
    "status" in validatedData &&
    validatedData.status !== "draft" &&
    validatedData.status !== "published"
  ) {
    return NextResponse.json(
      { error: "Status must be 'draft' or 'published'" },
      { status: 400 },
    );
  }

  const lesson = await dbUpdateLesson(id, validatedData);
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  // Record audit event for the update
  await recordAuditEvent({
    actorId: user.id,
    actorEmail: user.email,
    action: "lesson.update",
    resource: "lesson",
    resourceId: id,
    result: "success",
    metadata: { updatedFields: Object.keys(validatedData) },
  });

  return NextResponse.json(lesson);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await requireAuth(request);
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
  const { id } = await params;
  await dbDeleteLesson(id);
  return NextResponse.json({ success: true });
}
