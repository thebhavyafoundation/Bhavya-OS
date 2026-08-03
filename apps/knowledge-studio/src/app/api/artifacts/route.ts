import { NextRequest, NextResponse } from "next/server";
import { listArtifacts, getArtifact } from "@/lib/artifacts";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const planId = searchParams.get("planId");

  if (id) {
    const artifact = getArtifact(id);
    if (!artifact)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(artifact);
  }

  const artifacts = listArtifacts(planId || undefined);
  return NextResponse.json({ artifacts, total: artifacts.length });
}
