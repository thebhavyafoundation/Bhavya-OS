/**
 * Institutional Evidence Store — Shared Primitive
 *
 * Generic evidence storage with idempotency, immutable records, and
 * filesystem-backed persistence. Used by both Knowledge and Forest domains.
 *
 * ## What Is Shared (Identical Semantics)
 * - Evidence record structure (id, activityType, activityId, timestamp, etc.)
 * - Idempotent recording (SHA256-based deduplication keys)
 * - Immutable file-per-record storage
 * - Listing and counting by type
 *
 * ## What Is Domain-Specific (NOT Shared)
 * - Activity type enumerations (Knowledge events vs Forest events)
 * - Evidence directory paths
 * - Metadata fields per domain
 *
 * ## Usage
 * ```typescript
 * const store = new EvidenceStore({
 *   dir: join(process.cwd(), "bhavya-ai-lab", "evidence"),
 *   activityTypes: ["ko-created", "ko-updated", "lesson-published"],
 * });
 *
 * store.record("ko-created", ko.id, `KO "${ko.title}" created`, { domain: ko.domain });
 * ```
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from "fs";
import { join } from "path";
import { createHash } from "crypto";

// ── Types ──────────────────────────────────────────────────────

export interface EvidenceRecord {
  id: string;
  activityType: string;
  activityId: string;
  timestamp: string;
  description: string;
  metadata: Record<string, unknown>;
  idempotencyKey?: string;
}

export interface EvidenceStoreConfig {
  /** Directory where evidence files are stored */
  dir: string;
  /** Activity types this store handles (for type safety) */
  activityTypes: readonly string[];
}

// ── Store ────────────────────────────────────────────────────

export class EvidenceStore {
  private dir: string;

  constructor(config: EvidenceStoreConfig) {
    this.dir = config.dir;
  }

  private ensureDir(): void {
    if (!existsSync(this.dir)) {
      mkdirSync(this.dir, { recursive: true });
    }
  }

  private readFile(filePath: string): EvidenceRecord | null {
    try {
      const raw = readFileSync(filePath, "utf-8");
      return JSON.parse(raw) as EvidenceRecord;
    } catch {
      return null;
    }
  }

  private writeFile(filePath: string, data: EvidenceRecord): void {
    writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  }

  /**
   * Generate a deterministic idempotency key from activity type and ID.
   */
  static eventKey(entityId: string, eventType: string): string {
    return createHash("sha256")
      .update(`${eventType}:${entityId}`)
      .digest("hex")
      .slice(0, 16);
  }

  /**
   * Find an existing record by idempotency key.
   * Returns the first match, or null if none found.
   */
  private findByKey(idempotencyKey: string): EvidenceRecord | null {
    try {
      const files = readdirSync(this.dir).filter((f) => f.endsWith(".json"));
      for (const f of files) {
        const entry = this.readFile(join(this.dir, f));
        if (entry && entry.idempotencyKey === idempotencyKey) {
          return entry;
        }
      }
    } catch {
      // Directory may not exist yet
    }
    return null;
  }

  /**
   * Record an evidence entry. Immutable once created.
   *
   * If `idempotencyKey` is provided and a record with that key already exists,
   * the existing record is returned without creating a duplicate.
   *
   * Evidence is recorded ONLY after successful canonical persistence.
   */
  record(
    activityType: string,
    activityId: string,
    description: string,
    metadata: Record<string, unknown> = {},
    idempotencyKey?: string,
  ): EvidenceRecord {
    this.ensureDir();

    // Idempotency check
    if (idempotencyKey) {
      const existing = this.findByKey(idempotencyKey);
      if (existing) return existing;
    }

    const id = `ev-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const timestamp = new Date().toISOString();

    const evidence: EvidenceRecord = {
      id,
      activityType,
      activityId,
      timestamp,
      description,
      metadata,
      idempotencyKey,
    };

    const filePath = join(this.dir, `${id}.json`);
    this.writeFile(filePath, evidence);
    return evidence;
  }

  /**
   * List all evidence entries, sorted by timestamp (newest first).
   */
  list(limit: number = 50): EvidenceRecord[] {
    this.ensureDir();
    try {
      const files = readdirSync(this.dir).filter((f) => f.endsWith(".json"));
      const entries = files
        .map((f) => this.readFile(join(this.dir, f)))
        .filter((e): e is EvidenceRecord => e !== null);

      return entries
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    } catch {
      return [];
    }
  }

  /**
   * Get evidence entries of a specific type.
   */
  listByType(activityType: string): EvidenceRecord[] {
    return this.list().filter((e) => e.activityType === activityType);
  }

  /**
   * Get evidence count by type.
   */
  counts(): Record<string, number> {
    const evidence = this.list();
    const counts: Record<string, number> = {};
    for (const e of evidence) {
      counts[e.activityType] = (counts[e.activityType] || 0) + 1;
    }
    return counts;
  }

  /**
   * Replay evidence log to count events in a given month.
   * Used for deterministic metric rebuild.
   */
  countByMonth(month: string): Record<string, number> {
    const counts: Record<string, number> = {};
    try {
      if (existsSync(this.dir)) {
        const files = readdirSync(this.dir).filter((f) => f.endsWith(".json"));
        for (const f of files) {
          try {
            const raw = readFileSync(join(this.dir, f), "utf-8");
            const entry = JSON.parse(raw) as { activityType: string; timestamp: string };
            if (entry.timestamp.slice(0, 7) === month) {
              counts[entry.activityType] = (counts[entry.activityType] || 0) + 1;
            }
          } catch { /* skip corrupted */ }
        }
      }
    } catch { /* directory may not exist */ }
    return counts;
  }

  /**
   * Replay evidence log to count cumulative events of a specific type.
   */
  countTotal(activityType: string): number {
    let count = 0;
    try {
      if (existsSync(this.dir)) {
        const files = readdirSync(this.dir).filter((f) => f.endsWith(".json"));
        for (const f of files) {
          try {
            const raw = readFileSync(join(this.dir, f), "utf-8");
            const entry = JSON.parse(raw) as { activityType: string };
            if (entry.activityType === activityType) count++;
          } catch { /* skip corrupted */ }
        }
      }
    } catch { /* directory may not exist */ }
    return count;
  }
}
