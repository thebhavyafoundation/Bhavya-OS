import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const recommendations = db
    .prepare("SELECT * FROM recommendations ORDER BY created_at DESC")
    .all();
  return NextResponse.json({ recommendations });
}
