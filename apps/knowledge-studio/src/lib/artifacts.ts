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

export function saveArtifact(artifact: Artifact): void {
  const db = getDb();
  db.prepare(
    `
    INSERT INTO artifacts (id, type, data, capability_id, skill_id, agent_id, ko_id, package_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,
  ).run(
    artifact.id,
    artifact.type,
    JSON.stringify(artifact.data),
    artifact.capabilityId || null,
    artifact.skillId || null,
    artifact.agentId || null,
    artifact.koId || null,
    artifact.packageId || null,
  );
}

export function getArtifact(id: string): Artifact | null {
  const row = getDb()
    .prepare("SELECT * FROM artifacts WHERE id = ?")
    .get(id) as any;
  if (!row) return null;
  return { ...row, data: JSON.parse(row.data) };
}

export function listArtifacts(koId?: string, packageId?: string): Artifact[] {
  let query = "SELECT * FROM artifacts";
  const conditions: string[] = [];
  const params: any[] = [];
  if (koId) {
    conditions.push("ko_id = ?");
    params.push(koId);
  }
  if (packageId) {
    conditions.push("package_id = ?");
    params.push(packageId);
  }
  if (conditions.length) query += " WHERE " + conditions.join(" AND ");
  query += " ORDER BY created_at DESC";
  const rows = getDb()
    .prepare(query)
    .all(...params) as any[];
  return rows.map((r) => ({ ...r, data: JSON.parse(r.data) }));
}

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

export function savePipelineResult(result: PipelineResult): void {
  const db = getDb();
  db.prepare(
    `
    INSERT OR REPLACE INTO pipeline_executions
    (id, goal, status, started_at, completed_at, total_duration_ms, node_results, events, user_id, ko_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, '[]', 'system', 'unknown')
  `,
  ).run(
    result.planId,
    result.goal,
    result.status,
    result.startedAt,
    result.completedAt,
    result.totalDurationMs,
    JSON.stringify(result.nodeResults),
  );
}

export function listPipelineResults(): PipelineResult[] {
  const rows = getDb()
    .prepare(
      "SELECT * FROM pipeline_executions ORDER BY created_at DESC LIMIT 50",
    )
    .all() as any[];
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

export function getPipelineResult(planId: string): PipelineResult | null {
  const row = getDb()
    .prepare("SELECT * FROM pipeline_executions WHERE id = ?")
    .get(planId) as any;
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
