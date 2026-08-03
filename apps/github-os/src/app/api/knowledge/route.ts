import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const packages = db
    .prepare(
      "SELECT id, title, category, quality_score FROM knowledge_packages ORDER BY created_at DESC LIMIT 10",
    )
    .all();

  return NextResponse.json({ packages });
}
