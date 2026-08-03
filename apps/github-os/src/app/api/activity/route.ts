import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const activities = db
    .prepare("SELECT * FROM activity_events ORDER BY created_at DESC LIMIT 20")
    .all();

  return NextResponse.json({ activities });
}
