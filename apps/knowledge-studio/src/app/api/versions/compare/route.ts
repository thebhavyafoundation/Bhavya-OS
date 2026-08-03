import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const packageId = request.nextUrl.searchParams.get("packageId");
    const v1 = request.nextUrl.searchParams.get("v1");
    const v2 = request.nextUrl.searchParams.get("v2");
    if (!packageId || !v1 || !v2) {
      return NextResponse.json(
        { error: "packageId, v1, v2 required" },
        { status: 400 },
      );
    }
    return NextResponse.json({
      packageId,
      v1,
      v2,
      changed: [],
      identical: true,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
