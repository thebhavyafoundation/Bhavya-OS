import { NextResponse } from "next/server";
import { createMission } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const mission = createMission(body);
    return NextResponse.json(mission, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create mission" },
      { status: 400 },
    );
  }
}
