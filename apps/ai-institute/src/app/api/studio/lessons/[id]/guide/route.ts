import { NextRequest, NextResponse } from "next/server";
import { dbGetLesson, dbUpdateLesson } from "@/lib/studio/db";
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
  const lesson = await dbGetLesson(id);
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }
  return NextResponse.json(lesson.teacherGuide || { objectives: [] });
}

export async function POST(
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
  const lesson = await dbGetLesson(id);
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  const outcomes = lesson.learningOutcomes || [];
  const sections = lesson.sections || [];

  const guide = {
    id: `guide-${id}`,
    lessonId: id,
    title: lesson.title,
    objectives: outcomes.map((o: { description: string }) => o.description),
    vocabulary: [],
    materials: ["Whiteboard/Projector", "Student notebooks", "Access to relevant resources"],
    discussionPrompts: sections.map((s: { title: string }) =>
      `Discuss the key concepts in "${s.title || "this section"}". How do they apply to real-world scenarios?`
    ),
    commonMisconceptions: [],
    answerKeys: [],
    timingGuide: sections.map((s: { title: string; type: string }, i: number) => ({
      section: s.title || `Section ${i + 1}`,
      duration: Math.round((lesson.duration || 45) / sections.length),
      activity: s.type === "exercises" ? "Hands-on practice" : s.type === "examples" ? "Worked examples" : "Direct instruction",
    })),
    version: "1.0.0",
  };

  await dbUpdateLesson(id, { teacherGuide: guide });
  return NextResponse.json(guide);
}
