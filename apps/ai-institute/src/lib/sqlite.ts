/**
 * AI Institute — Database Adapter
 *
 * Environment-aware database layer:
 *   - LOCAL: better-sqlite3 (file-based, synchronous)
 *   - PRODUCTION: @libsql/client (serverless, Turso/libSQL)
 *
 * The adapter is selected at runtime based on TURSO_DATABASE_URL.
 * Repository code calls getDatabase() — it never knows which adapter is used.
 */

import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Migration {
  id: string;
  name: string;
  up: string;
  down: string;
}

export interface DbRow {
  [key: string]: unknown;
}

export interface DatabaseAdapter {
  prepare(sql: string): { get(...params: unknown[]): DbRow | undefined; all(...params: unknown[]): DbRow[]; run(...params: unknown[]): void };
  exec(sql: string): void;
  pragma?(p: string): void;
  transaction?<T>(fn: () => T): T;
  close?(): void;
}

// ─── Provider Detection ──────────────────────────────────────────────────────

function isProduction(): boolean {
  return !!process.env.TURSO_DATABASE_URL;
}

// ─── Local Adapter (better-sqlite3) ─────────────────────────────────────────

let _localDb: DatabaseAdapter | null = null;

function getLocalDatabase(dbPath: string): DatabaseAdapter {
  if (_localDb) return _localDb;

  if (!dbPath) {
    throw new Error("Database not initialized. Call initDatabase() with a valid path first.");
  }

  const dir = dirname(dbPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  // Dynamic require to avoid webpack bundling the native module
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Database = require("better-sqlite3");
  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  _localDb = db;
  return db;
}

function closeLocalDatabase(): void {
  if (_localDb) {
    _localDb.close?.();
    _localDb = null;
  }
}

// ─── Production Adapter (libSQL/Turso) ───────────────────────────────────────

let _remoteDb: DatabaseAdapter | null = null;

async function getRemoteDatabase(): Promise<DatabaseAdapter> {
  if (_remoteDb) return _remoteDb;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) {
    throw new Error("TURSO_DATABASE_URL not set. Cannot initialize production database.");
  }

  // Dynamic import — only loaded when TURSO_DATABASE_URL is set
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require("@libsql/client");
  const client = createClient({ url, authToken });

  // Wrap libSQL client to match our DatabaseAdapter interface
  _remoteDb = {
    prepare(sql: string) {
      return {
        get(...params: unknown[]) {
          const stmt = client.prepare(sql);
          return stmt.get(...params) as DbRow | undefined;
        },
        all(...params: unknown[]) {
          const stmt = client.prepare(sql);
          return stmt.all(...params) as DbRow[];
        },
        run(...params: unknown[]) {
          const stmt = client.prepare(sql);
          stmt.run(...params);
        },
      };
    },
    exec(sql: string) {
      client.executeMultiple(sql);
    },
  };

  return _remoteDb;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Get database adapter. Sync for local, must be called after init for remote.
 * For remote: call initRemoteDatabase() first during startup.
 */
export function getDatabase(config?: { path?: string }): DatabaseAdapter {
  if (isProduction()) {
    if (!_remoteDb) {
      throw new Error("Remote database not initialized. Call initRemoteDatabase() first.");
    }
    return _remoteDb;
  }
  return getLocalDatabase(config?.path || "");
}

/**
 * Initialize remote database (async). Called once during module load in serverless.
 */
export async function initRemoteDatabase(): Promise<void> {
  if (!isProduction()) return;
  await getRemoteDatabase();
}

/**
 * Initialize local database (sync). Called once during startup.
 */
export function initLocalDatabase(dbPath: string): void {
  getLocalDatabase(dbPath);
}

export function closeDatabase(): void {
  if (isProduction()) {
    _remoteDb = null;
  } else {
    closeLocalDatabase();
  }
}

// ─── Migration Engine ────────────────────────────────────────────────────────

export function ensureMigrationsTable(): void {
  const db = getDatabase();
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

export function getAppliedMigrations(): string[] {
  const db = getDatabase();
  const rows = db.prepare("SELECT id FROM _migrations ORDER BY applied_at").all() as { id: string }[];
  return rows.map((r) => r.id);
}

export function applyMigration(migration: Migration): void {
  const db = getDatabase();
  const applied = getAppliedMigrations();
  if (applied.includes(migration.id)) return;

  db.exec(migration.up);
  db.prepare("INSERT INTO _migrations (id, name) VALUES (?, ?)").run(migration.id, migration.name);
}

export function migrate(migrations: Migration[]): { applied: string[] } {
  ensureMigrationsTable();
  const applied = getAppliedMigrations();
  const pending = migrations.filter((m) => !applied.includes(m.id));
  const appliedIds: string[] = [];

  for (const migration of pending) {
    applyMigration(migration);
    appliedIds.push(migration.id);
  }

  return { applied: appliedIds };
}

// ─── Transaction Helper ──────────────────────────────────────────────────────

export function transaction<T>(fn: () => T): T {
  const db = getDatabase();
  const txFn = db.transaction;
  if (txFn) {
    return txFn(fn);
  }
  // Fallback for adapters without transaction support
  return fn();
}
