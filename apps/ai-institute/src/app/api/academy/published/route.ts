import { NextResponse } from "next/server";
import { dbListLessons } from "@/lib/studio/db";
import { projectLessons } from "@/lib/public-projection";

/**
 * Public API for published lessons.
 * Returns ONLY public-safe lesson data (no assessment, teacherGuide, workbook).
 */
export async function GET() {
  try {
    const lessons = await dbListLessons({ status: "published" });
    const publicLessons = projectLessons(lessons);
    return NextResponse.json(publicLessons);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
