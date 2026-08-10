import { NextRequest, NextResponse } from "next/server";
import { getSkills, createSkill } from "@/lib/data";

export async function GET() {
  return NextResponse.json(getSkills());
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const skill = createSkill(data);
  return NextResponse.json(skill, { status: 201 });
}
