import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const versionId = request.nextUrl.searchParams.get("versionId");
    if (!versionId) {
      return NextResponse.json(
        { error: "versionId required" },
        { status: 400 },
      );
    }
    return NextResponse.json({ versionId, reproducible: true, steps: [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
