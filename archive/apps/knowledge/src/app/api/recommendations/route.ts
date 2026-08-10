import { NextRequest, NextResponse } from "next/server";
import { getRecommendations } from "@bhavya/intelligence";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const type = searchParams.get("type") as "document" | "entity" | "mission";
  const limit = parseInt(searchParams.get("limit") || "5", 10);

  if (!id || !type) {
    return NextResponse.json({
      success: false,
      error: "Missing required parameters 'id' and 'type'",
    });
  }

  const insight = getRecommendations(id, type, limit);

  return NextResponse.json({
    success: true,
    data: insight,
  });
}
