import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const db = getDb();
    const rows = db
      .prepare(
        "SELECT id, version, status, title, created_at FROM knowledge_packages WHERE user_id = ? ORDER BY created_at DESC LIMIT 100",
      )
      .all(userId) as any[];
    return NextResponse.json({ versions: rows });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
