/**
 * SQLite/Turso Evidence Repository Implementation
 *
 * Uses the async database adapter — works in both local (better-sqlite3)
 * and production (Turso/libSQL) modes.
 *
 * Append-only: records are never updated or deleted.
 */

import { createHash } from "crypto";
import { getAsyncDb } from "../db";
import type { EvidenceRepository, EvidenceRecord } from "./evidence-repository";

function generateId(): string {
  return `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function rowToEvidence(row: Record<string, unknown>): EvidenceRecord {
  return {
    id: row.id as string,
    activityType: row.activity_type as string,
    activityId: row.activity_id as string,
    timestamp: row.timestamp as string,
    description: row.description as string,
    metadata: JSON.parse((row.metadata as string) ?? "{}"),
    idempotencyKey: (row.idempotency_key as string) ?? undefined,
  };
}

export class SqliteEvidenceRepository implements EvidenceRepository {
  /**
   * Generate a deterministic idempotency key from activity type and ID.
   */
  static eventKey(entityId: string, eventType: string): string {
    return createHash("sha256")
      .update(`${eventType}:${entityId}`)
      .digest("hex")
      .slice(0, 16);
  }

  async record(
    activityType: string,
    activityId: string,
    description: string,
    metadata: Record<string, unknown> = {},
    idempotencyKey?: string,
  ): Promise<EvidenceRecord> {
    const db = getAsyncDb();

    // Idempotency check
    if (idempotencyKey) {
      const existing = await db.get<Record<string, unknown>>(
        "SELECT * FROM evidence_records WHERE idempotency_key = ? LIMIT 1",
        idempotencyKey,
      );
      if (existing) return rowToEvidence(existing);
    }

    const id = generateId();
    const timestamp = new Date().toISOString();

    await db.run(
      `INSERT INTO evidence_records (id, activity_type, activity_id, timestamp, description, metadata, idempotency_key)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      id,
      activityType,
      activityId,
      timestamp,
      description,
      JSON.stringify(metadata),
      idempotencyKey ?? null,
    );

    const row = await db.get<Record<string, unknown>>(
      "SELECT * FROM evidence_records WHERE id = ?",
      id,
    );
    return rowToEvidence(row!);
  }

  async list(limit: number = 50): Promise<EvidenceRecord[]> {
    const db = getAsyncDb();
    const rows = await db.all<Record<string, unknown>>(
      "SELECT * FROM evidence_records ORDER BY timestamp DESC LIMIT ?",
      limit,
    );
    return rows.map(rowToEvidence);
  }

  async listByType(activityType: string): Promise<EvidenceRecord[]> {
    const db = getAsyncDb();
    const rows = await db.all<Record<string, unknown>>(
      "SELECT * FROM evidence_records WHERE activity_type = ? ORDER BY timestamp DESC",
      activityType,
    );
    return rows.map(rowToEvidence);
  }

  async counts(): Promise<Record<string, number>> {
    const db = getAsyncDb();
    const rows = await db.all<{ activity_type: string; count: number }>(
      "SELECT activity_type, COUNT(*) as count FROM evidence_records GROUP BY activity_type",
    );
    const counts: Record<string, number> = {};
    for (const row of rows) {
      counts[row.activity_type] = row.count;
    }
    return counts;
  }

  async countByMonth(month: string): Promise<Record<string, number>> {
    const db = getAsyncDb();
    const rows = await db.all<{ activity_type: string; count: number }>(
      "SELECT activity_type, COUNT(*) as count FROM evidence_records WHERE timestamp LIKE ? GROUP BY activity_type",
      `${month}%`,
    );
    const counts: Record<string, number> = {};
    for (const row of rows) {
      counts[row.activity_type] = row.count;
    }
    return counts;
  }

  async countTotal(activityType: string): Promise<number> {
    const db = getAsyncDb();
    const row = await db.get<{ count: number }>(
      "SELECT COUNT(*) as count FROM evidence_records WHERE activity_type = ?",
      activityType,
    );
    return row?.count ?? 0;
  }
}
