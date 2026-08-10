import { NextResponse } from "next/server";
import { createMonitoring } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const entry = createMonitoring(body);
    return NextResponse.json(entry, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create monitoring entry" },
      { status: 400 },
    );
  }
}
