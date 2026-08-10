import { NextResponse } from "next/server";
import { addSource, getSourcesByProject } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  if (!projectId)
    return NextResponse.json({ error: "projectId required" }, { status: 400 });
  return NextResponse.json(getSourcesByProject(projectId));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const source = addSource(body);
    return NextResponse.json(source, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to add source" },
      { status: 400 },
    );
  }
}
