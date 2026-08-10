import { NextResponse } from "next/server";
import { createProject } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const project = createProject(body);
    return NextResponse.json(project, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 400 },
    );
  }
}
