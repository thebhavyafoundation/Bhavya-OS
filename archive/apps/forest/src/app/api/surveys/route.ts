import { NextResponse } from "next/server";
import { createSurvey } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const survey = createSurvey(body);
    return NextResponse.json(survey, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create survey" },
      { status: 400 },
    );
  }
}
