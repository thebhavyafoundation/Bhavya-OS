import { NextRequest, NextResponse } from "next/server";
import { dbGetLesson, dbUpdateLesson } from "@/lib/studio/db";
import { requireAuth } from "@/lib/api-auth";
import {
  roleIsAllowed,
  CONTENT_MANAGEMENT_ROLES,
  type Role,
} from "@/lib/roles";
import { recordEvidence, koEventKey } from "@/lib/institutional-evidence";
import { recordLessonPublished } from "@/lib/knowledge-metrics";
import { recordAuditEvent } from "@/lib/audit-repository";

export async function POST(
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
  const { target } = body;

  const lesson = await dbGetLesson(id);
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  if (target === "website") {
    await dbUpdateLesson(id, {
      status: "published",
      publishedAt: new Date().toISOString(),
    });

    // Record evidence of lesson publication (with idempotency key)
    await recordEvidence(
      "lesson-published",
      id,
      `Lesson "${lesson.title || id}" published to Academy`,
      {
        lessonId: id,
        title: lesson.title,
        publishedAt: new Date().toISOString(),
      },
      koEventKey(id, "lesson-published"),
    );

    // Update knowledge metrics
    recordLessonPublished();

    await recordAuditEvent({
      actorId: user.id,
      actorEmail: user.email,
      action: "lesson-publish",
      resource: "lesson",
      resourceId: id,
      result: "success",
      metadata: { title: lesson.title },
    });

    return NextResponse.json({
      success: true,
      path: `/courses/lessons/${id}`,
      message: "Lesson published to Academy",
    });
  }

  if (target === "draft") {
    await dbUpdateLesson(id, { status: "draft" });

    // Record evidence of lesson revert (with idempotency key)
    await recordEvidence(
      "lesson-reverted",
      id,
      `Lesson "${lesson.title || id}" reverted to draft`,
      { lessonId: id, title: lesson.title },
      koEventKey(id, "lesson-reverted"),
    );

    return NextResponse.json({
      success: true,
      message: "Lesson reverted to draft",
    });
  }

  return NextResponse.json({ error: "Unknown target" }, { status: 400 });
}
