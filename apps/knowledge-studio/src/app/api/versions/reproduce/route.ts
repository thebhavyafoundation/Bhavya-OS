import { NextRequest, NextResponse } from "next/server";
import { VersionManager } from "../../../../../packages/bee/src/engines/version-manager.mjs";

const vm = new VersionManager();

export async function GET(request: NextRequest) {
  try {
    const versionId = request.nextUrl.searchParams.get("versionId");
    if (!versionId)
      return NextResponse.json(
        { error: "versionId required" },
        { status: 400 },
      );

    const plan = vm.getReproductionPlan(versionId);
    return NextResponse.json(plan);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
