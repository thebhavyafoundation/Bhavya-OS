import { NextResponse } from "next/server";
import { createSite } from "@/lib/data";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const site = createSite(body);
    return NextResponse.json(site, { status: 201 });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to create site" },
      { status: 400 },
    );
  }
}
