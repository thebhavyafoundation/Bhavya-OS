import { NextRequest, NextResponse } from "next/server";
import { dbGetLesson, dbUpdateLesson } from "@/lib/studio/db";
import { requireAuth } from "@/lib/api-auth";

export async function POST(
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
  const { target } = body;

  const lesson = await dbGetLesson(id);
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  if (target === "website") {
    await dbUpdateLesson(id, { status: "published", publishedAt: new Date().toISOString() });
    return NextResponse.json({
      success: true,
      path: `/courses/lessons/${id}`,
      message: "Lesson published to Academy",
    });
  }

  if (target === "draft") {
    await dbUpdateLesson(id, { status: "draft" });
    return NextResponse.json({ success: true, message: "Lesson reverted to draft" });
  }

  return NextResponse.json({ error: "Unknown target" }, { status: 400 });
}
