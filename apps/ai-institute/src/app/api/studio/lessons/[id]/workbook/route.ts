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
  return NextResponse.json(lesson.workbook || { pages: [] });
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const lesson = await dbGetLesson(id);
  if (!lesson) {
    return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
  }

  const sections = lesson.sections || [];
  const pages = sections.map((s: { title: string; content: string }, i: number) => ({
    id: `page-${i + 1}`,
    title: s.title || `Page ${i + 1}`,
    content: s.content || "",
    exercises: [
      {
        type: "short-answer",
        prompt: `Describe the main idea of "${s.title || "this section"}" in your own words.`,
      },
      {
        type: "reflection",
        prompt: `How does "${s.title || "this section"}" connect to what you already know?`,
      },
    ],
  }));

  const workbook = {
    id: `wb-${id}`,
    lessonId: id,
    title: lesson.title,
    pages,
    version: "1.0.0",
  };

  await dbUpdateLesson(id, { workbook });
  return NextResponse.json(workbook);
}
