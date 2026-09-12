/**
 * Audit event repository — append-only record of sensitive actions.
 *
 * Events: login, logout, register, role change, content/lesson
 * publication, administrative mutations. Each event carries actor,
 * action, resource, timestamp, and result. Rows are never updated or
 * deleted by application code.
 *
 * Server-only: imports the database layer. Never import from client
 * components — the admin audit UI reads through GET /os/admin/api/audit.
 */

import { getAsyncDb } from "./db";

export interface AuditEvent {
  id: string;
  actorId: string | null;
  actorEmail: string;
  action: string;
  resource: string;
  resourceId: string;
  result: "success" | "failure";
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface RecordAuditInput {
  actorId?: string | null;
  actorEmail?: string;
  action: string;
  resource?: string;
  resourceId?: string;
  result?: "success" | "failure";
  metadata?: Record<string, unknown>;
}

function generateId(): string {
  return `a_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function rowToEvent(row: Record<string, unknown>): AuditEvent {
  let metadata: Record<string, unknown> = {};
  try {
    metadata = JSON.parse((row.metadata as string) ?? "{}");
  } catch {
    metadata = {};
  }
  return {
    id: row.id as string,
    actorId: (row.actor_id as string) ?? null,
    actorEmail: (row.actor_email as string) ?? "",
    action: row.action as string,
    resource: (row.resource as string) ?? "",
    resourceId: (row.resource_id as string) ?? "",
    result: (row.result as string) === "failure" ? "failure" : "success",
    metadata,
    createdAt: row.created_at as string,
  };
}

export async function recordAuditEvent(input: RecordAuditInput): Promise<void> {
  try {
    const db = getAsyncDb();
    const now = new Date().toISOString();
    await db.run(
      `INSERT INTO audit_events (id, actor_id, actor_email, action, resource, resource_id, result, metadata, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      generateId(),
      input.actorId ?? null,
      input.actorEmail ?? "",
      input.action,
      input.resource ?? "",
      input.resourceId ?? "",
      input.result ?? "success",
      JSON.stringify(input.metadata ?? {}),
      now,
    );
  } catch {
    // Audit recording must never break the primary action.
  }
}

export async function listAuditEvents(limit = 100): Promise<AuditEvent[]> {
  const db = getAsyncDb();
  const rows = await db.all<Record<string, unknown>>(
    "SELECT * FROM audit_events ORDER BY created_at DESC LIMIT ?",
    Math.min(Math.max(limit, 1), 500),
  );
  return rows.map(rowToEvent);
}
