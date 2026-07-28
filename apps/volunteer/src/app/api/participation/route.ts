import { NextRequest, NextResponse } from "next/server";
import { getParticipations, createParticipation } from "@/lib/data";

export async function GET() {
  return NextResponse.json(getParticipations());
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const participation = createParticipation(data);
  return NextResponse.json(participation, { status: 201 });
}
