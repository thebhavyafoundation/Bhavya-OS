import { NextRequest, NextResponse } from "next/server";
import { search } from "@bhavya/intelligence";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  const types = searchParams.get("types")?.split(",") || undefined;
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  if (!query) {
    return NextResponse.json({
      success: false,
      error: "Missing search query parameter 'q'",
    });
  }

  const insight = search({
    query,
    types: types as ("document" | "entity" | "mission")[] | undefined,
    limit,
    offset,
  });

  return NextResponse.json({
    success: true,
    data: insight,
  });
}
