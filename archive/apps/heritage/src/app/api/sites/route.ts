import { NextRequest, NextResponse } from "next/server";
import { createHeritageSite, getHeritageMission } from "@/lib/data";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const mission = getHeritageMission(data.missionId);
  if (!mission) return NextResponse.json({ error: "Mission not found" }, { status: 404 });
  const site = createHeritageSite(data);
  return NextResponse.json(site, { status: 201 });
}
