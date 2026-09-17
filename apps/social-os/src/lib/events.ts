import { v4 as uuidv4 } from "uuid";
import { getDb } from "../lib/db";

export interface SocialEvent {
  id: string;
  type: string;
  payload: Record<string, any>;
  createdAt: string;
  processed: boolean;
}

export type EventType =
  | "content.ready"
  | "publication.created"
  | "publication.approved"
  | "publication.rejected"
  | "publication.published"
  | "analytics.collected"
  | "analytics.feed"
  | "calendar.entry_created"
  | "communication.loop_completed"
  | "feedback.submitted"
  | "feedback.processed"
  | "campaign.created";

export function emitEvent(
  type: EventType,
  payload: Record<string, any>,
): SocialEvent {
  const db = getDb();
  const id = uuidv4();
  const now = new Date().toISOString();

  db.prepare(
    `
    INSERT INTO events (id, type, payload, created_at, processed)
    VALUES (?, ?, ?, ?, 0)
  `,
  ).run(id, type, JSON.stringify(payload), now);

  return { id, type, payload, createdAt: now, processed: false };
}

export function getUnprocessedEvents(type?: EventType): SocialEvent[] {
  const db = getDb();
  let query = "SELECT * FROM events WHERE processed = 0";
  const params: any[] = [];

  if (type) {
    query += " AND type = ?";
    params.push(type);
  }

  query += " ORDER BY created_at ASC";

  const rows = db.prepare(query).all(...params) as any[];
  return rows.map((row) => ({
    id: row.id,
    type: row.type,
    payload: JSON.parse(row.payload),
    createdAt: row.created_at,
    processed: row.processed === 1,
  }));
}

export function markEventProcessed(id: string): void {
  const db = getDb();
  db.prepare("UPDATE events SET processed = 1 WHERE id = ?").run(id);
}

export function getRecentEvents(limit: number = 50): SocialEvent[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM events ORDER BY created_at DESC LIMIT ?")
    .all(limit) as any[];
  return rows.map((row) => ({
    id: row.id,
    type: row.type,
    payload: JSON.parse(row.payload),
    createdAt: row.created_at,
    processed: row.processed === 1,
  }));
}
