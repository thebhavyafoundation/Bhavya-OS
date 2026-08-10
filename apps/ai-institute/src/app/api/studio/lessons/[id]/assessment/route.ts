import { NextRequest, NextResponse } from "next/server";
import { dbGetLesson, dbUpdateLesson } from "@/lib/studio/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
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
