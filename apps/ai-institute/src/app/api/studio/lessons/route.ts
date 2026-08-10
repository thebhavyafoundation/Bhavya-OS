import { NextRequest, NextResponse } from "next/server";
import { dbListLessons, dbCreateLesson } from "@/lib/studio/db";
import { requireAuth } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || undefined;
    const courseId = searchParams.get("courseId") || undefined;
    const lessons = await dbListLessons({ status, courseId });
    return NextResponse.json(lessons);
  } catch {
    return NextResponse.json(
      { error: "Failed to list lessons" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const user = await requireAuth(request);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (user.role !== "admin" && user.role !== "instructor") {
    return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  }
  try {
    const body = await request.json();
    if (!body.title || typeof body.title !== "string") {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    const id = `lesson-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const lesson = await dbCreateLesson({
      id,
      courseId: body.courseId,
      title: body.title,
      subject: body.subject,
      grade: body.grade,
      duration: body.duration,
      learningOutcomes: body.learningOutcomes,
      sections: body.sections,
    });
    return NextResponse.json(lesson, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create lesson" },
      { status: 500 },
    );
  }
}
