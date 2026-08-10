import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const session = await requireAuth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any)?.id;
    const db = getDb();
    const rows = db
      .prepare(
        "SELECT * FROM pipeline_executions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
      )
      .all(userId) as any[];
    const pipelines = rows.map((r) => ({
      id: r.id,
      goal: r.goal,
      status: r.status,
      started_at: r.started_at,
      completed_at: r.completed_at,
      total_duration_ms: r.total_duration_ms,
      error: r.error,
      ko_id: r.ko_id,
      package_id: r.package_id,
    }));
    return NextResponse.json({ pipelines });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
