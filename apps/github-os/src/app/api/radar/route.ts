import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const radar = db
    .prepare("SELECT * FROM technology_radar ORDER BY score DESC")
    .all();
  return NextResponse.json({ radar });
}
