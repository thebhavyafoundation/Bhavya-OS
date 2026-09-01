import { NextRequest, NextResponse } from "next/server";
import { requireAuth, stripSensitive } from "@/lib/api-auth";
import { getStudentByUserId } from "@/lib/student-store";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const student = await getStudentByUserId(user.id);

    return NextResponse.json({
      user: stripSensitive(user),
      student,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
