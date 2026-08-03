import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();

  const health = db
    .prepare(
      `
      SELECT eh.*, r.name as repository_name
      FROM engineering_health eh
      JOIN repositories r ON eh.repository_id = r.id
      ORDER BY eh.overall_score DESC
    `,
    )
    .all();

  return NextResponse.json({ health });
}
