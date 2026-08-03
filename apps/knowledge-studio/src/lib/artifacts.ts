import { getDb } from "./db";

export interface Artifact {
  id: string;
  type: string;
  data: any;
  capabilityId?: string;
  skillId?: string;
  agentId?: string;
  koId?: string;
  packageId?: string;
  createdAt: string;
}

export { createArtifact as saveArtifact } from "./db";
export { listArtifacts, getArtifact } from "./db";

export interface PipelineResult {
  planId: string;
  goal: string;
  status: string;
  artifacts: Artifact[];
  startedAt: string;
  completedAt: string | null;
  totalDurationMs: number | null;
  nodeResults: any[];
}

export function savePipelineResult(
  result: PipelineResult,
  userId: string,
  koId: string,
): void {
  const db = getDb();
  db.prepare(
    `
    INSERT OR REPLACE INTO pipeline_executions
    (id, goal, status, started_at, completed_at, total_duration_ms, node_results, events, user_id, ko_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, '[]', ?, ?)
  `,
  ).run(
    result.planId,
    result.goal,
    result.status,
    result.startedAt,
    result.completedAt,
    result.totalDurationMs,
    JSON.stringify(result.nodeResults),
    userId,
    koId,
  );
}

export function listPipelineResults(userId?: string): PipelineResult[] {
  const db = getDb();
  let query = "SELECT * FROM pipeline_executions";
  const params: any[] = [];
  if (userId) {
    query += " WHERE user_id = ?";
    params.push(userId);
  }
  query += " ORDER BY created_at DESC LIMIT 50";
  const rows = db.prepare(query).all(...params) as any[];
  return rows.map((r) => ({
    planId: r.id,
    goal: r.goal,
    status: r.status,
    startedAt: r.started_at,
    completedAt: r.completed_at,
    totalDurationMs: r.total_duration_ms,
    nodeResults: JSON.parse(r.node_results || "[]"),
    artifacts: [],
  }));
}

export function getPipelineResult(
  planId: string,
  userId?: string,
): PipelineResult | null {
  const db = getDb();
  let query = "SELECT * FROM pipeline_executions WHERE id = ?";
  const params: any[] = [planId];
  if (userId) {
    query += " AND user_id = ?";
    params.push(userId);
  }
  const row = db.prepare(query).get(...params) as any;
  if (!row) return null;
  return {
    planId: row.id,
    goal: row.goal,
    status: row.status,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    totalDurationMs: row.total_duration_ms,
    nodeResults: JSON.parse(row.node_results || "[]"),
    artifacts: [],
  };
}
