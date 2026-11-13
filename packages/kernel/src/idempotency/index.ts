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

/**
 * The status values a persisted entry may carry. An entry whose status is not
 * one of these cannot be interpreted, so it is treated as unusable rather
 * than guessed at.
 */
const ENTRY_STATUSES = ["pending", "completed", "failed"] as const;

/**
 * Whether a persisted value is a usable idempotency entry.
 *
 * A value that is not an object, or whose status is missing or unknown,
 * cannot be interpreted. Such an entry is not usable, but it is still a
 * record that work has been registered against, so it must not be treated as
 * if it were absent.
 */
function isUsableEntry(value: unknown): value is IdempotencyKey {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const status = (value as { status?: unknown }).status;
  return (
    typeof status === "string" &&
    (ENTRY_STATUSES as readonly string[]).includes(status)
  );
}

export class Idempotency {
  private config: IdempotencyConfig;
  private keys = new Map<string, IdempotencyKey>();
  private records = new Map<ExecutionId, ExecutionRecord>();
  /**
   * Persisted entries that could not be read, kept verbatim.
   *
   * A corrupt entry is not dropped. Dropping it would silently unblock the
   * key on the next start, which could run the same work twice, and it would
   * destroy the only evidence of the corruption. The entry stays on disk
   * exactly as it was found, the key is reported as existing so that no
   * duplicate execution is possible, and registering the key is the
   * deliberate way to run it again.
   */
  private corruptKeys = new Map<string, unknown>();
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
      const data = this.readJsonFile(keysFile);
      if (data && typeof data === "object" && !Array.isArray(data)) {
        for (const [key, value] of Object.entries(
          data as Record<string, unknown>,
        )) {
          if (!isUsableEntry(value)) {
            // Keep the unreadable entry and block the key. Discarding it
            // would let the work run again, and a throw here would discard
            // every entry that follows it.
            this.corruptKeys.set(key, value);
            continue;
          }
          // The persisted form is an ISO-8601 string; restore Date values so
          // the in-memory representation matches the declared type.
          this.keys.set(key, {
            ...value,
            createdAt: toDate(value.createdAt),
            ...(value.completedAt !== undefined
              ? { completedAt: toDate(value.completedAt) }
              : {}),
            ...(value.expiresAt !== undefined
              ? { expiresAt: toDate(value.expiresAt) }
              : {}),
          });
        }
      }
    }

    const recordsFile = resolve(this.storeDir, "records.json");
    if (existsSync(recordsFile)) {
      const data = this.readJsonFile(recordsFile);
      if (data && typeof data === "object" && !Array.isArray(data)) {
        for (const [id, value] of Object.entries(
          data as Record<string, unknown>,
        )) {
          this.records.set(id, value as ExecutionRecord);
        }
      }
    }
  }

  /**
   * Read and parse a JSON file.
   *
   * A file that cannot be read or parsed yields undefined rather than
   * throwing, so a damaged file never aborts the load of the others.
   */
  private readJsonFile(path: string): unknown {
    try {
      return JSON.parse(readFileSync(path, "utf-8"));
    } catch {
      return undefined;
    }
  }

  private async saveAll(): Promise<void> {
    // The corrupt entries are written back exactly as they were read, so a
    // later save cannot silently repair the file and unblock a key that an
    // operator has not looked at.
    const keysObj: Record<string, unknown> = {
      ...Object.fromEntries(this.keys),
    };
    for (const [key, raw] of this.corruptKeys) {
      if (!(key in keysObj)) keysObj[key] = raw;
    }
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
    if (!entry) {
      // A persisted entry that could not be read is still a record that work
      // was registered against. Reporting it as absent would let the same
      // work run again, so it is reported as existing instead.
      if (this.corruptKeys.has(key)) {
        return { exists: true, status: "corrupt" };
      }
      return { exists: false };
    }

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
    // Registering a key is the deliberate way to run it again, so it clears
    // the corrupt marker: the entry is replaced with a readable one.
    this.corruptKeys.delete(key);
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
    if (check.status === "corrupt") {
      // The persisted entry could not be read. Running the work now could
      // repeat it, so the key stays blocked until it is registered again.
      return { proceed: false, reason: "corrupt_entry" };
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
