import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();

  const library = db
    .prepare(
      "SELECT * FROM elite_engineering_library ORDER BY quality_score DESC",
    )
    .all();

  return NextResponse.json(library);
}
