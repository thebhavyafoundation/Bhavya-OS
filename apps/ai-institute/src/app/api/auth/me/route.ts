import { NextRequest, NextResponse } from "next/server";
import { findSessionByToken, findUserById, stripSensitive } from "@/lib/api-auth";
import { getStudentByUserId } from "@/lib/student-store";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("session-token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const session = await findSessionByToken(token);
    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const user = await findUserById(session.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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
