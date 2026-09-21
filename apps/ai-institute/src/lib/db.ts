/**
 * AI Institute — Database Initialization
 *
 * Handles both local (better-sqlite3 via @bhavya/database) and
 * production (Turso/libSQL) databases.
 *
 * IMPORTANT: This file imports from @bhavya/database/async-adapter
 * (not the barrel @bhavya/database) to avoid loading better-sqlite3
 * on Cloudflare Workers where native C++ addons are not supported.
 */

import {
  initAsyncAdapter,
  type AsyncDatabase,
} from "@bhavya/database/async-adapter";
import { isProduction } from "./sqlite";

let initialized = false;
let _asyncDb: AsyncDatabase | null = null;

// Cache for dynamically imported local-mode functions
let _getAdaptedDatabase: typeof import("@bhavya/database/registry").getAdaptedDatabase | null = null;
let _migrate: typeof import("@bhavya/database/migrate").migrate | null = null;

/**
 * Baseline schema SQL — applied to Turso on first init.
 * Kept in sync with packages/database/migrations/ai-institute/001_baseline_schema.ts
 */
const BASELINE_SCHEMA = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar TEXT,
  role TEXT NOT NULL DEFAULT 'student',
  provider TEXT NOT NULL DEFAULT 'email',
  interests TEXT NOT NULL DEFAULT '[]',
  onboarding_complete INTEGER NOT NULL DEFAULT 0,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

-- Audit events table (append-only)
CREATE TABLE IF NOT EXISTS audit_events (
  id TEXT PRIMARY KEY,
  actor_id TEXT,
  actor_email TEXT NOT NULL DEFAULT '',
  action TEXT NOT NULL,
  resource TEXT NOT NULL DEFAULT '',
  resource_id TEXT NOT NULL DEFAULT '',
  result TEXT NOT NULL DEFAULT 'success',
  metadata TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_audit_events_actor ON audit_events(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_action ON audit_events(action);
CREATE INDEX IF NOT EXISTS idx_audit_events_created ON audit_events(created_at);

-- _migrations table (tracks applied migrations)
CREATE TABLE IF NOT EXISTS _migrations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  checksum TEXT NOT NULL,
  applied_at TEXT DEFAULT (datetime('now'))
);
`;

/**
 * Load local-mode dependencies (better-sqlite3).
 * Cached after first call — only imported in non-production.
 */
async function loadLocalDeps() {
  if (!_getAdaptedDatabase) {
    const registry = await import("@bhavya/database/registry");
    _getAdaptedDatabase = registry.getAdaptedDatabase;
  }
  if (!_migrate) {
    const migrateMod = await import("@bhavya/database/migrate");
    _migrate = migrateMod.migrate;
  }
}

/**
 * Initialize database. Safe to call multiple times (idempotent).
 * - Local: opens via @bhavya/database (resolves path by name)
 * - Production: initializes remote Turso connection, applies schema
 */
export async function initDatabase(): Promise<void> {
  if (initialized) return;

  if (isProduction()) {
    // Production: use Turso. Dynamically import to avoid loading better-sqlite3.
    _asyncDb = await initAsyncAdapter("ai-institute", () => {
      throw new Error("getLocalDb should not be called in production");
    });

    // Apply baseline schema to Turso (IF NOT EXISTS makes this idempotent)
    await _asyncDb.exec(BASELINE_SCHEMA);
  } else {
    // Local: dynamically import better-sqlite3-dependent functions
    await loadLocalDeps();

    _asyncDb = await initAsyncAdapter("ai-institute", () => {
      return _getAdaptedDatabase!("ai-institute");
    });
    await _migrate!("ai-institute");
  }

  initialized = true;
}

/**
 * Get the async database adapter.
 * Works in both local and production modes.
 * Use this for all new code — it's compatible with Vercel serverless.
 */
export function getAsyncDb(): AsyncDatabase {
  if (!_asyncDb) {
    throw new Error("Database not initialized. Call initDatabase() first.");
  }
  return _asyncDb;
}

/**
 * Synchronous database access (for legacy code in request handlers after init).
 * Returns a better-sqlite3 connection via @bhavya/database.
 * Only valid for local mode — remote mode requires async access.
 *
 * @deprecated Use getAsyncDb() for new code. This method will not work
 * in Vercel serverless environments.
 */
export function getDb() {
  if (!_getAdaptedDatabase) {
    throw new Error("Local database not loaded. Call initDatabase() first.");
  }
  return _getAdaptedDatabase("ai-institute");
}
