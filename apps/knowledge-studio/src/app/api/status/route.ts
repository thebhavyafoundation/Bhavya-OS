import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const planId = searchParams.get("planId");
  const db = getDb();

  if (planId) {
    const row = db
      .prepare("SELECT * FROM pipeline_executions WHERE id = ?")
      .get(planId) as any;
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
      "SELECT * FROM pipeline_executions ORDER BY created_at DESC LIMIT 50",
    )
    .all() as any[];
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
