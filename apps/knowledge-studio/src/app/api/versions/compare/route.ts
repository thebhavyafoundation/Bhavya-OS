import { NextRequest, NextResponse } from "next/server";
import { VersionManager } from "../../../../../packages/bee/src/engines/version-manager.mjs";

const vm = new VersionManager();

export async function GET(request: NextRequest) {
  try {
    const packageId = request.nextUrl.searchParams.get("packageId");
    const v1 = request.nextUrl.searchParams.get("v1");
    const v2 = request.nextUrl.searchParams.get("v2");
    if (!packageId || !v1 || !v2)
      return NextResponse.json(
        { error: "packageId, v1, v2 required" },
        { status: 400 },
      );

    const comparison = vm.compareVersions(packageId, v1, v2);
    return NextResponse.json(comparison);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
