import { NextResponse } from "next/server";
import { createPlanting } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const planting = createPlanting(body);
    return NextResponse.json(planting, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create planting" },
      { status: 400 },
    );
  }
}
