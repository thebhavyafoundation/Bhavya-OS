import { NextResponse } from "next/server";
import { dbListLessons } from "@/lib/studio/db";

export async function GET() {
  try {
    const lessons = await dbListLessons({ status: "published" });
    return NextResponse.json(lessons);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
