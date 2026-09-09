/**
 * @bhavya/database — SQLite Abstraction
 *
 * Type-safe multi-database wrapper with WAL mode, foreign keys, and connection management.
 * Supports named databases for cross-app access.
 */

import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";

export interface DatabaseConfig {
  path: string;
  wal?: boolean;
  foreignKeys?: boolean;
  readonly?: boolean;
}

// ─── Named Connection Registry ────────────────────────────────────────────────

interface DatabaseEntry {
  db: Database.Database;
  config: DatabaseConfig;
}

const _connections: Map<string, DatabaseEntry> = new Map();

// Legacy singleton for backward compatibility
let _defaultDb: Database.Database | null = null;

/**
 * Get or create a named database connection.
 * Each name maps to one database file (singleton per name).
 */
export function getNamedDatabase(
  name: string,
  config: DatabaseConfig,
): Database.Database {
  const existing = _connections.get(name);
  if (existing) return existing.db;

  const dir = dirname(config.path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  const db = new Database(config.path, { readonly: config.readonly ?? false });
  if (config.wal !== false && !config.readonly) db.pragma("journal_mode = WAL");
  if (config.foreignKeys !== false && !config.readonly)
    db.pragma("foreign_keys = ON");
  if (!config.readonly) db.pragma("busy_timeout = 5000");

  _connections.set(name, { db, config });
  return db;
}

/**
 * Get a named database connection without creating it.
 * Returns null if the connection doesn't exist.
 */
export function getConnection(name: string): Database.Database | null {
  return _connections.get(name)?.db ?? null;
}

/**
 * Close a named database connection.
 */
export function closeNamedDatabase(name: string): void {
  const entry = _connections.get(name);
  if (entry) {
    entry.db.close();
    _connections.delete(name);
  }
}

/**
 * Close all database connections.
 */
export function closeAllDatabases(): void {
  for (const [name] of _connections) {
    closeNamedDatabase(name);
  }
  if (_defaultDb) {
    _defaultDb.close();
    _defaultDb = null;
  }
}

// ─── Default Connection (backward compatible) ────────────────────────────────

/**
 * Get or create the default database connection.
 * Prefer getNamedDatabase() for new code.
 */
export function getDatabase(config?: DatabaseConfig): Database.Database {
  if (_defaultDb) return _defaultDb;

  const dbPath = config?.path || "";
  if (!dbPath) {
    throw new Error(
      "Database not initialized. Call getDatabase({ path: '...' }) first.",
    );
  }

  const dir = dirname(dbPath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  _defaultDb = new Database(dbPath);
  if (config?.wal !== false) _defaultDb.pragma("journal_mode = WAL");
  if (config?.foreignKeys !== false) _defaultDb.pragma("foreign_keys = ON");

  return _defaultDb;
}

/**
 * Close the default database connection.
 */
export function closeDatabase(): void {
  if (_defaultDb) {
    _defaultDb.close();
    _defaultDb = null;
  }
}

/**
 * Execute a function within a transaction on the default connection.
 */
export function transaction<T>(fn: () => T): T {
  const db = _defaultDb;
  if (!db) throw new Error("Database not initialized");
  const tx = db.transaction(fn);
  return tx();
}

/**
 * Run raw SQL on the default connection (for migrations, admin operations).
 */
export function exec(sql: string): void {
  const db = _defaultDb;
  if (!db) throw new Error("Database not initialized");
  db.exec(sql);
}
