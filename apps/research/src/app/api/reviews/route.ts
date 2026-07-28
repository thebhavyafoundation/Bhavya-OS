import { NextResponse } from "next/server";
import { addReview, getReviewsByProject } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  if (!projectId)
    return NextResponse.json({ error: "projectId required" }, { status: 400 });
  return NextResponse.json(getReviewsByProject(projectId));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const review = addReview(body);
    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to add review" },
      { status: 400 },
    );
  }
}
