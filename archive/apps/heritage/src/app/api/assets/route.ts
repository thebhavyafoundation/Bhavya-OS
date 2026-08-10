import { NextRequest, NextResponse } from "next/server";
import { getHeritageAssets, createHeritageAsset } from "@/lib/data";

export async function GET() {
  return NextResponse.json(getHeritageAssets());
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const asset = createHeritageAsset(data);
  return NextResponse.json(asset, { status: 201 });
}
