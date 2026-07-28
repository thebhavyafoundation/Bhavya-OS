import { NextResponse } from "next/server";
import { addEvidence, getEvidenceByProject } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");
  if (!projectId)
    return NextResponse.json({ error: "projectId required" }, { status: 400 });
  return NextResponse.json(getEvidenceByProject(projectId));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const evidence = addEvidence(body);
    return NextResponse.json(evidence, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to add evidence" },
      { status: 400 },
    );
  }
}
