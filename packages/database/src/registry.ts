/**
 * @bhavya/database — Database Registry
 *
 * Maps app names to their database file paths.
 * Used by os-data.ts for cross-app reads and by apps for their own connections.
 */

import path from "path";
import { existsSync } from "fs";
import { getNamedDatabase } from "./sqlite";
import type BetterSqlite3 from "better-sqlite3";

// ─── Registry ────────────────────────────────────────────────────────────────

export type DatabaseName = "ai-institute" | "github-os" | "social-os" | "ioc";

interface DatabaseRegistryEntry {
  /** Relative path from workspace root */
  relativePath: string;
  /** Environment variable override (for production) */
  envKey?: string;
}

const REGISTRY: Record<DatabaseName, DatabaseRegistryEntry> = {
  "ai-institute": {
    relativePath: "packages/database/data/bhavya.db",
    envKey: "TURSO_DATABASE_URL",
  },
  "github-os": {
    relativePath: "packages/database/data/bhavya.db",
  },
  "social-os": {
    relativePath: "packages/database/data/bhavya.db",
  },
  ioc: {
    relativePath: "packages/database/data/bhavya.db",
  },
};

// ─── Path Resolution ─────────────────────────────────────────────────────────

/**
 * Resolve the absolute path for a named database.
 * Walks up from cwd to find the workspace root (where apps/ lives).
 */
function resolveWorkspaceRoot(): string {
  let dir = process.cwd();
  while (dir !== path.dirname(dir)) {
    if (
      existsSync(path.join(dir, "apps")) &&
      existsSync(path.join(dir, "packages"))
    ) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  // Fallback: assume 2 levels up from an app (apps/<name>/)
  return path.resolve(process.cwd(), "../..");
}

/**
 * Get the absolute path for a named database.
 */
export function getDatabasePath(name: DatabaseName): string {
  const entry = REGISTRY[name];
  if (entry.envKey && process.env[entry.envKey]) {
    return process.env[entry.envKey]!;
  }
  const root = resolveWorkspaceRoot();
  return path.join(root, entry.relativePath);
}

/**
 * Check if a named database file exists on disk.
 */
export function databaseExists(name: DatabaseName): boolean {
  const entry = REGISTRY[name];
  if (entry.envKey && process.env[entry.envKey]) return true;
  return existsSync(getDatabasePath(name));
}

// ─── Connection Accessors ────────────────────────────────────────────────────

/**
 * Get a read-only connection to a named database.
 * Safe for cross-app reads (os-data.ts).
 * Returns null if the database file doesn't exist.
 */
export function getReadonlyDatabase(
  name: DatabaseName,
): BetterSqlite3.Database | null {
  if (!databaseExists(name)) return null;

  const connName = `readonly:${name}`;
  const existing = getNamedDatabase(connName, {
    path: getDatabasePath(name),
    readonly: true,
    wal: false,
    foreignKeys: false,
  });
  return existing;
}

/**
 * Get a read-write connection to a named database.
 * Creates the database if it doesn't exist.
 */
export function getReadWriteDatabase(
  name: DatabaseName,
): BetterSqlite3.Database {
  return getNamedDatabase(name, {
    path: getDatabasePath(name),
    wal: true,
    foreignKeys: true,
  });
}

/**
 * Get an adapted database connection for a named database.
 * Convenience alias for getReadWriteDatabase() that communicates
 * "I want the canonical local adapter for this database."
 *
 * For remote/Turso connections, apps must handle the async remote
 * client separately — better-sqlite3 and @libsql/client have
 * incompatible APIs (sync vs async) that cannot share one interface.
 */
export function getAdaptedDatabase(name: DatabaseName): BetterSqlite3.Database {
  return getReadWriteDatabase(name);
}
