import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const db = getDb();

  const student = db
    .prepare("SELECT * FROM student_mode WHERE repository_id = ?")
    .get(id);

  if (!student) {
    return NextResponse.json(
      { error: "No student mode available" },
      { status: 404 },
    );
  }

  return NextResponse.json(student);
}
