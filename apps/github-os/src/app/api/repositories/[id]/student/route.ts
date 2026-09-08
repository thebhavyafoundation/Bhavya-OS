import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { withAuth } from "@/lib/api-auth";

export const GET = withAuth(async (request, _user) => {
  const id = request.nextUrl.pathname.split("/").at(-2)!;
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
});
