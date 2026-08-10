import { NextRequest, NextResponse } from "next/server";
import { getAssignments, createAssignment } from "@/lib/data";

export async function GET() {
  return NextResponse.json(getAssignments());
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const assignment = createAssignment(data);
  return NextResponse.json(assignment, { status: 201 });
}
