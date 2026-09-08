/**
 * @bhavya/database — Schema Migration Framework
 *
 * Manages schema migrations across all named databases.
 * Migrations are tracked per-database in a _migrations table.
 *
 * Usage:
 *   import { migrate, getMigrationStatus } from "@bhavya/database/migrate";
 *   const result = await migrate("github-os");
 *   const status = await getMigrationStatus("github-os");
 */

import { createHash } from "crypto";
import { readdirSync, readFileSync } from "fs";
import { join, basename } from "path";
import type Database from "better-sqlite3";
import { getReadWriteDatabase } from "./registry";
import type { DatabaseName } from "./registry";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Migration {
  /** Unique identifier (e.g., "001_initial_schema") */
  id: string;
  /** Human-readable name */
  name: string;
  /** SQL to apply the migration */
  up: string;
  /** SQL to rollback the migration */
  down: string;
  /** Whether this migration is destructive (requires explicit opt-in) */
  destructive?: boolean;
}

export interface MigrationRecord {
  id: string;
  name: string;
  checksum: string;
  applied_at: string;
}

export interface MigrationResult {
  applied: string[];
  database: DatabaseName;
}

export interface MigrationStatus {
  database: DatabaseName;
  applied: MigrationRecord[];
  pending: Migration[];
  total: number;
}

// ─── Checksum ────────────────────────────────────────────────────────────────

/**
 * Compute a SHA-256 checksum of migration SQL content.
 * Used to detect modified migrations after they've been applied.
 */
export function computeChecksum(migration: Migration): string {
  const content = migration.up + migration.down;
  return createHash("sha256").update(content).digest("hex").slice(0, 16);
}

// ─── Metadata Table ──────────────────────────────────────────────────────────

const MIGRATIONS_TABLE = "_migrations";

function ensureMigrationsTable(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS ${MIGRATIONS_TABLE} (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      checksum TEXT NOT NULL,
      applied_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

/**
 * Get all applied migration records for a database.
 */
function getAppliedRecords(db: Database.Database): MigrationRecord[] {
  ensureMigrationsTable(db);
  return db
    .prepare(
      `SELECT id, name, checksum, applied_at FROM ${MIGRATIONS_TABLE} ORDER BY applied_at`,
    )
    .all() as MigrationRecord[];
}

function getAppliedIds(db: Database.Database): string[] {
  return getAppliedRecords(db).map((r) => r.id);
}

// ─── Migration Discovery ─────────────────────────────────────────────────────

/**
 * Load migration files from a database's migration directory.
 * Files must be named: <NNN>_<name>.ts where NNN is a zero-padded sequence number.
 *
 * Each file must export a default Migration object or a `migration` named export.
 */
function loadMigrationsFromDisk(dbName: DatabaseName): Migration[] {
  const migrationsDir = join(__dirname, "..", "migrations", dbName);

  try {
    const files = readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".ts") || f.endsWith(".js"))
      .sort(); // Alphabetical = numerical order due to NNN_ prefix

    const migrations: Migration[] = [];

    for (const file of files) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const mod = require(join(migrationsDir, file));
      const migration: Migration = mod.default || mod.migration;
      if (migration && migration.id && migration.up) {
        // Prefix migration ID with domain name for shared-DB uniqueness.
        // All domains export the same base ID (e.g. "001_baseline_schema");
        // prefixing ensures each domain tracks its own applied migrations
        // even when all share a single _migrations table (bhavya.db).
        migrations.push({
          ...migration,
          id: `${dbName}/${migration.id}`,
        });
      }
    }

    return migrations;
  } catch {
    // Directory doesn't exist or no migrations — return empty
    return [];
  }
}

// ─── Core Migration Engine ───────────────────────────────────────────────────

/**
 * Run all pending migrations for a named database.
 *
 * - Discovers migrations from packages/database/migrations/<dbName>/
 * - Skips already-applied migrations (by ID)
 * - Detects modified migrations (by checksum) — throws error
 * - Executes each migration in a transaction
 * - Records applied migrations in _migrations table
 *
 * @param dbName - Target database name
 * @param options.skipDestructive - Skip migrations marked as destructive
 * @returns Result with list of applied migration IDs
 */
export async function migrate(
  dbName: DatabaseName,
  options?: { skipDestructive?: boolean },
): Promise<MigrationResult> {
  const db = getReadWriteDatabase(dbName);
  ensureMigrationsTable(db);

  const appliedIds = getAppliedIds(db);
  const appliedRecords = getAppliedRecords(db);
  const appliedChecksums = new Map(
    appliedRecords.map((r) => [r.id, r.checksum]),
  );

  const allMigrations = loadMigrationsFromDisk(dbName);

  // Check for modified migrations
  for (const record of appliedRecords) {
    const current = allMigrations.find((m) => m.id === record.id);
    if (current) {
      const currentChecksum = computeChecksum(current);
      if (currentChecksum !== record.checksum) {
        throw new Error(
          `Migration "${record.id}" has been modified after being applied. ` +
            `Expected checksum ${record.checksum}, got ${currentChecksum}. ` +
            `Revert the migration file or create a new migration instead.`,
        );
      }
    }
  }

  // Filter to pending migrations
  const pending = allMigrations.filter((m) => {
    if (appliedIds.includes(m.id)) return false;
    if (options?.skipDestructive && m.destructive) return false;
    return true;
  });

  const appliedIds_: string[] = [];

  for (const migration of pending) {
    const txFn = db.transaction;
    if (txFn) {
      // Transactional execution
      txFn(() => {
        db.exec(migration.up);
        const checksum = computeChecksum(migration);
        db.prepare(
          `INSERT INTO ${MIGRATIONS_TABLE} (id, name, checksum) VALUES (?, ?, ?)`,
        ).run(migration.id, migration.name, checksum);
      })();
    } else {
      // Fallback: direct execution (no transaction support)
      db.exec(migration.up);
      const checksum = computeChecksum(migration);
      db.prepare(
        `INSERT INTO ${MIGRATIONS_TABLE} (id, name, checksum) VALUES (?, ?, ?)`,
      ).run(migration.id, migration.name, checksum);
    }

    appliedIds_.push(migration.id);
  }

  return { applied: appliedIds_, database: dbName };
}

/**
 * Rollback the last applied migration for a named database.
 *
 * @param dbName - Target database name
 * @returns The ID of the rolled-back migration, or null if nothing to rollback
 */
export async function rollback(dbName: DatabaseName): Promise<string | null> {
  const db = getReadWriteDatabase(dbName);
  ensureMigrationsTable(db);

  const records = getAppliedRecords(db);
  if (records.length === 0) return null;

  const lastRecord = records[records.length - 1];
  const allMigrations = loadMigrationsFromDisk(dbName);
  const migration = allMigrations.find((m) => m.id === lastRecord.id);

  if (!migration) {
    throw new Error(
      `Cannot rollback "${lastRecord.id}": migration file not found. ` +
        `Manual cleanup of _migrations table may be needed.`,
    );
  }

  if (migration.destructive) {
    throw new Error(
      `Cannot rollback destructive migration "${lastRecord.id}". ` +
        `Manual intervention required.`,
    );
  }

  const txFn = db.transaction;
  if (txFn) {
    txFn(() => {
      db.exec(migration.down);
      db.prepare(`DELETE FROM ${MIGRATIONS_TABLE} WHERE id = ?`).run(
        migration.id,
      );
    })();
  } else {
    db.exec(migration.down);
    db.prepare(`DELETE FROM ${MIGRATIONS_TABLE} WHERE id = ?`).run(
      migration.id,
    );
  }

  return migration.id;
}

/**
 * Get migration status for a named database.
 */
export async function getMigrationStatus(
  dbName: DatabaseName,
): Promise<MigrationStatus> {
  const db = getReadWriteDatabase(dbName);
  ensureMigrationsTable(db);

  const applied = getAppliedRecords(db);
  const allMigrations = loadMigrationsFromDisk(dbName);
  const appliedIds = new Set(applied.map((r) => r.id));
  const pending = allMigrations.filter((m) => !appliedIds.has(m.id));

  return {
    database: dbName,
    applied,
    pending,
    total: allMigrations.length,
  };
}

// ─── Legacy API (backward compatible) ────────────────────────────────────────

/**
 * Legacy migrate function — accepts an array of migrations.
 * Uses the default database connection.
 *
 * @deprecated Use migrate(dbName) instead for named-database support.
 */
export function migrateLegacy(migrations: Migration[]): { applied: string[] } {
  const db = getReadWriteDatabase("ai-institute");
  ensureMigrationsTable(db);
  const appliedIds = getAppliedIds(db);
  const pending = migrations.filter((m) => !appliedIds.includes(m.id));
  const appliedIds_: string[] = [];

  for (const migration of pending) {
    db.exec(migration.up);
    const checksum = computeChecksum(migration);
    db.prepare(
      `INSERT INTO ${MIGRATIONS_TABLE} (id, name, checksum) VALUES (?, ?, ?)`,
    ).run(migration.id, migration.name, checksum);
    appliedIds_.push(migration.id);
  }

  return { applied: appliedIds_ };
}

// Legacy re-exports are provided via index.ts for backward compatibility.
