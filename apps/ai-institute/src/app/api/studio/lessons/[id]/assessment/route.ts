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
  return NextResponse.json(lesson.assessment || { questions: [] });
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

  // Generate assessment from lesson content
  const sections = lesson.sections || [];
  const questions = [];

  // Generate MCQ from each section
  for (const section of sections.slice(0, 5)) {
    questions.push({
      id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: "mcq",
      prompt: `Based on "${section.title || "the section"}", which of the following is correct?`,
      options: [
        section.content?.slice(0, 80) || "Option A",
        "Option B",
        "Option C",
        "Option D",
      ],
      correctAnswer: section.content?.slice(0, 80) || "Option A",
      bloomLevel: "understand",
      difficulty: "medium",
    });
  }

  // Add reflection question
  questions.push({
    id: `q-${Date.now()}-reflect`,
    type: "reflection",
    prompt: "Reflect on what you learned in this lesson. How does it connect to your prior knowledge?",
    bloomLevel: "evaluate",
    difficulty: "medium",
  });

  const assessment = {
    id: `assess-${id}`,
    lessonId: id,
    questions,
    totalPoints: questions.length * 10,
    passingScore: Math.ceil(questions.length * 10 * 0.6),
    version: "1.0.0",
  };

  await dbUpdateLesson(id, { assessment });
  return NextResponse.json(assessment);
}
