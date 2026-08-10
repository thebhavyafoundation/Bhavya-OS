import { NextRequest, NextResponse } from "next/server";
import { getAssessments, createAssessment } from "@/lib/data";

export async function GET() {
  return NextResponse.json(getAssessments());
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const assessment = createAssessment(data);
  return NextResponse.json(assessment, { status: 201 });
}
