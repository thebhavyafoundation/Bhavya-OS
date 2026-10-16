import { getAsyncDb } from "./db";

export interface AuditEventInput {
  action: string;
  actorId: string;
  resource: string;
  resourceId: string;
  metadata?: Record<string, unknown>;
  result?: "success" | "failure";
  error?: string;
}

export async function recordAuditEvent(input: AuditEventInput): Promise<void> {
  const db = getAsyncDb();
  await db.run(
    `INSERT INTO audit_events (id, actor_id, actor_email, action, resource, resource_id, result, metadata, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))`,
    [
      crypto.randomUUID(),
      input.actorId,
      "", // actor_email - would need to fetch from user if needed
      input.action,
      input.resource,
      input.resourceId,
      input.result || "success",
      JSON.stringify(input.metadata || {}),
    ],
  );
}
