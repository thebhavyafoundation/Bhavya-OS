import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const repositories = db
    .prepare(
      "SELECT id, name, slug, description, language, stars, health_score, technology_score FROM repositories ORDER BY updated_at DESC",
    )
    .all();

  return NextResponse.json({ repositories });
}
