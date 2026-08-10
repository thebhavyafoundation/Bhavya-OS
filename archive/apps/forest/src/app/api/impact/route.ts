import { NextResponse } from "next/server";
import { createImpact } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const impact = createImpact(body);
    return NextResponse.json(impact, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create impact report" },
      { status: 400 },
    );
  }
}
