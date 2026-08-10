import { NextRequest, NextResponse } from "next/server";
import { dbListCourses, dbCreateCourse } from "@/lib/studio/db";
import { requireAuth } from "@/lib/api-auth";

export async function GET() {
  try {
    const courses = await dbListCourses();
    return NextResponse.json(courses);
  } catch {
    return NextResponse.json(
      { error: "Failed to list courses" },
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
    const id = `course-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const course = await dbCreateCourse({
      id,
      title: body.title,
      description: typeof body.description === "string" ? body.description : undefined,
      subject: typeof body.subject === "string" ? body.subject : undefined,
      grade: typeof body.grade === "number" ? body.grade : undefined,
    });
    return NextResponse.json(course, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 },
    );
  }
}
