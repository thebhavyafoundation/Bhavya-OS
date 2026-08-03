import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-guard";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const session = await requireAuth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = (session.user as any).id;
  const { searchParams } = new URL(req.url);
  const planId = searchParams.get("planId");
  const db = getDb();

  if (planId) {
    const row = db
      .prepare("SELECT * FROM pipeline_executions WHERE id = ? AND user_id = ?")
      .get(planId, userId) as any;
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
      planId: row.id,
      goal: row.goal,
      status: row.status,
      startedAt: row.started_at,
      completedAt: row.completed_at,
      totalDurationMs: row.total_duration_ms,
      error: row.error,
      nodeResults: JSON.parse(row.node_results || "[]"),
      events: JSON.parse(row.events || "[]").slice(-20),
      metrics: row.metrics ? JSON.parse(row.metrics) : null,
      trace: row.trace ? JSON.parse(row.trace) : null,
    });
  }

  const rows = db
    .prepare(
      "SELECT * FROM pipeline_executions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
    )
    .all(userId) as any[];
  const pipelines = rows.map((r) => ({
    planId: r.id,
    goal: r.goal,
    status: r.status,
    startedAt: r.started_at,
    completedAt: r.completed_at,
    totalDurationMs: r.total_duration_ms,
  }));
  return NextResponse.json({ pipelines });
}
