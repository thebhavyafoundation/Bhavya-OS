import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    const userId = (session?.user as any)?.id;
    const db = getDb();
    let query = "SELECT * FROM pipeline_executions";
    const params: any[] = [];
    if (userId) {
      query += " WHERE user_id = ?";
      params.push(userId);
    }
    query += " ORDER BY created_at DESC LIMIT 50";
    const rows = db.prepare(query).all(...params) as any[];
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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
