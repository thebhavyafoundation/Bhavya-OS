import { NextRequest, NextResponse } from "next/server";
import { getHeritageMissions, createHeritageMission } from "@/lib/data";

export async function GET() {
  return NextResponse.json(getHeritageMissions());
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const mission = createHeritageMission(data);
  return NextResponse.json(mission, { status: 201 });
}
