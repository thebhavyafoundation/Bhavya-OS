import { NextRequest, NextResponse } from "next/server";
import { VersionManager } from "../../../../../packages/bee/src/engines/version-manager.mjs";

const vm = new VersionManager();

export async function GET(request: NextRequest) {
  try {
    const packageId = request.nextUrl.searchParams.get("packageId");
    if (!packageId)
      return NextResponse.json(
        { error: "packageId required" },
        { status: 400 },
      );

    const versions = vm.listVersions(packageId);
    return NextResponse.json({ versions, packageId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
