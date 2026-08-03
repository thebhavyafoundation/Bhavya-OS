import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const db = getDb();
    const rows = db
      .prepare(
        "SELECT id, version, status, title, created_at FROM knowledge_packages ORDER BY created_at DESC LIMIT 100",
      )
      .all() as any[];
    return NextResponse.json({ versions: rows });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
