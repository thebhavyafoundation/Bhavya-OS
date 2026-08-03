import { NextRequest, NextResponse } from "next/server";
import { listArtifacts, getArtifact } from "@/lib/artifacts";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const koId = searchParams.get("koId") || undefined;
    const packageId = searchParams.get("packageId") || undefined;

    if (id) {
      const artifact = getArtifact(id);
      if (!artifact)
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ artifact });
    }

    const artifacts = listArtifacts(koId, packageId);
    return NextResponse.json({ artifacts });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
