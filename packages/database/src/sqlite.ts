/**
 * @bhavya/database — SQLite Abstraction
 *
 * Type-safe SQLite wrapper with WAL mode, foreign keys, and connection management.
 */

import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "fs";
import { dirname } from "path";

export interface DatabaseConfig {
  path: string;
  wal?: boolean;
  foreignKeys?: boolean;
}

let _db: Database.Database | null = null;

/**
 * Get or create a SQLite database connection.
 */
export function getDatabase(config: DatabaseConfig): Database.Database {
  if (_db) return _db;

  const dir = dirname(config.path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  _db = new Database(config.path);
  if (config.wal !== false) _db.pragma("journal_mode = WAL");
  if (config.foreignKeys !== false) _db.pragma("foreign_keys = ON");

  return _db;
}

/**
 * Close the current database connection.
 */
export function closeDatabase(): void {
  if (_db) {
    _db.close();
    _db = null;
  }
}

/**
 * Execute a function within a transaction.
 */
export function transaction<T>(fn: () => T): T {
  const db = _db;
  if (!db) throw new Error("Database not initialized");
  const tx = db.transaction(fn);
  return tx();
}

/**
 * Run raw SQL (for migrations, admin operations).
 */
export function exec(sql: string): void {
  const db = _db;
  if (!db) throw new Error("Database not initialized");
  db.exec(sql);
}
