// Idempotency Module
// Prevents duplicate execution. Tracks what has already been done.
// If an event is replayed or a workflow restarted, the runtime knows:
// - whether the task has already completed
// - whether it should resume
// - or whether it should execute again

import type {
  ExecutionId,
  IdempotencyKey,
  ExecutionRecord,
  ExecutionState,
} from "../types/index.js";
import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

export interface IdempotencyConfig {
  root: string;
  ttlMs?: number; // Time to live for keys (default: 1 hour)
}

/**
 * Normalise a persisted timestamp to epoch milliseconds.
 *
 * The store writes Date objects, which JSON serialises to ISO-8601 strings;
 * a value read back from disk is therefore a string. Comparing a Date with a
 * string coerces the string to NaN, so the comparison is always false and an
 * expiry check silently stops working after a reload — which is exactly the
 * situation a resumed runner meets.
 *
 * An unparseable value yields undefined. Callers treat that as "no expiry is
 * known" rather than "expired", so a corrupt field can never cause a
 * duplicate execution; the entry is retained instead.
 */
function toMillis(value: unknown): number | undefined {
  if (value === undefined || value === null) return undefined;
  if (value instanceof Date) {
    const time = value.getTime();
    return Number.isFinite(time) ? time : undefined;
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

/**
 * Coerce a persisted timestamp to a Date so the in-memory value matches the
 * declared type. An unparseable value becomes an Invalid Date, which
 * `toMillis` reports as "no expiry known".
 */
function toDate(value: unknown): Date {
  const millis = toMillis(value);
  return millis === undefined ? new Date(NaN) : new Date(millis);
}

export class Idempotency {
  private config: IdempotencyConfig;
  private keys = new Map<string, IdempotencyKey>();
  private records = new Map<ExecutionId, ExecutionRecord>();
  private storeDir: string;

  constructor(config: IdempotencyConfig) {
    this.config = config;
    this.storeDir = resolve(config.root, ".kernel/idempotency");
  }

  async initialize(): Promise<void> {
    if (!existsSync(this.storeDir)) {
      mkdirSync(this.storeDir, { recursive: true });
    }
    await this.loadAll();
  }

  private async loadAll(): Promise<void> {
    const keysFile = resolve(this.storeDir, "keys.json");
    if (existsSync(keysFile)) {
      try {
        const data = JSON.parse(readFileSync(keysFile, "utf-8"));
        for (const [key, value] of Object.entries(data)) {
          const entry = value as IdempotencyKey;
          // The persisted form is an ISO-8601 string; restore Date values so
          // the in-memory representation matches the declared type.
          this.keys.set(key, {
            ...entry,
            createdAt: toDate(entry.createdAt),
            ...(entry.completedAt !== undefined
              ? { completedAt: toDate(entry.completedAt) }
              : {}),
            ...(entry.expiresAt !== undefined
              ? { expiresAt: toDate(entry.expiresAt) }
              : {}),
          });
        }
      } catch {
        /* ignore */
      }
    }

    const recordsFile = resolve(this.storeDir, "records.json");
    if (existsSync(recordsFile)) {
      try {
        const data = JSON.parse(readFileSync(recordsFile, "utf-8"));
        for (const [id, value] of Object.entries(data)) {
          this.records.set(id, value as ExecutionRecord);
        }
      } catch {
        /* ignore */
      }
    }
  }

  private async saveAll(): Promise<void> {
    const keysObj = Object.fromEntries(this.keys);
    writeFileSync(
      resolve(this.storeDir, "keys.json"),
      JSON.stringify(keysObj, null, 2),
    );

    const recordsObj = Object.fromEntries(this.records);
    writeFileSync(
      resolve(this.storeDir, "records.json"),
      JSON.stringify(recordsObj, null, 2),
    );
  }

  // Check if a key has already been executed
  async check(
    key: string,
  ): Promise<{ exists: boolean; status?: string; result?: unknown }> {
    const entry = this.keys.get(key);
    if (!entry) return { exists: false };

    // Check expiry. The comparison always goes through `toMillis` so that a
    // key loaded from disk (an ISO-8601 string) expires exactly like one
    // held in memory (a Date).
    const expiry = toMillis(entry.expiresAt);
    if (expiry !== undefined && Date.now() > expiry) {
      this.keys.delete(key);
      return { exists: false };
    }

    return {
      exists: true,
      status: entry.status,
      result: entry.result,
    };
  }

  // Register a key as pending
  async register(key: string, executionId: ExecutionId): Promise<void> {
    this.keys.set(key, {
      key,
      executionId,
      status: "pending",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + (this.config.ttlMs ?? 3600000)),
    });
    await this.saveAll();
  }

  // Mark a key as completed
  async complete(key: string, result?: unknown): Promise<void> {
    const entry = this.keys.get(key);
    if (entry) {
      entry.status = "completed";
      entry.result = result;
      entry.completedAt = new Date();
      await this.saveAll();
    }
  }

  // Mark a key as failed
  async fail(key: string, error?: string): Promise<void> {
    const entry = this.keys.get(key);
    if (entry) {
      entry.status = "failed";
      entry.result = { error };
      entry.completedAt = new Date();
      await this.saveAll();
    }
  }

  // Check if execution should proceed
  async shouldExecute(
    key: string,
  ): Promise<{ proceed: boolean; reason: string }> {
    const check = await this.check(key);
    if (!check.exists) {
      return { proceed: true, reason: "key_not_found" };
    }
    if (check.status === "completed") {
      return { proceed: false, reason: "already_completed" };
    }
    if (check.status === "failed") {
      return { proceed: true, reason: "retry_after_failure" };
    }
    if (check.status === "pending") {
      return { proceed: false, reason: "already_in_progress" };
    }
    return { proceed: true, reason: "unknown_status" };
  }

  // Record an execution
  async recordExecution(execution: ExecutionRecord): Promise<void> {
    this.records.set(execution.executionId, execution);
    await this.saveAll();
  }

  // Update execution state
  async updateExecution(
    executionId: ExecutionId,
    state: ExecutionState,
    output?: unknown,
  ): Promise<void> {
    const record = this.records.get(executionId);
    if (record) {
      record.status = state;
      record.output = output as Record<string, unknown>;
      if (state === "completed" || state === "failed") {
        record.completedAt = new Date();
      }
      await this.saveAll();
    }
  }

  // Get execution record
  async getExecution(
    executionId: ExecutionId,
  ): Promise<ExecutionRecord | undefined> {
    return this.records.get(executionId);
  }

  // Get all executions
  async getAllExecutions(): Promise<ExecutionRecord[]> {
    return Array.from(this.records.values());
  }

  // Get executions by state
  async getExecutionsByState(
    state: ExecutionState,
  ): Promise<ExecutionRecord[]> {
    return Array.from(this.records.values()).filter((r) => r.status === state);
  }

  // Cleanup expired keys
  async cleanup(): Promise<number> {
    const now = Date.now();
    let cleaned = 0;
    for (const [key, entry] of this.keys) {
      const expiry = toMillis(entry.expiresAt);
      if (expiry !== undefined && now > expiry) {
        this.keys.delete(key);
        cleaned++;
      }
    }
    if (cleaned > 0) await this.saveAll();
    return cleaned;
  }

  async shutdown(): Promise<void> {
    await this.saveAll();
    this.keys.clear();
    this.records.clear();
  }
}
