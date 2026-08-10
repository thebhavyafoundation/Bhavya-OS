/**
 * @bhavya/database — Migrations
 *
 * Simple migration framework for SQLite databases.
 */

import { getDatabase } from "./sqlite";

export interface Migration {
  id: string;
  name: string;
  up: string;
  down: string;
}

/**
 * Ensure the migrations table exists.
 */
export function ensureMigrationsTable(): void {
  const db = getDatabase({ path: "" });
  db.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at TEXT DEFAULT (datetime('now'))
    );
  `);
}

/**
 * Get list of applied migration IDs.
 */
export function getAppliedMigrations(): string[] {
  const db = getDatabase({ path: "" });
  const rows = db
    .prepare("SELECT id FROM _migrations ORDER BY applied_at")
    .all() as { id: string }[];
  return rows.map((r) => r.id);
}

/**
 * Apply a single migration.
 */
export function applyMigration(migration: Migration): void {
  const db = getDatabase({ path: "" });
  const applied = getAppliedMigrations();
  if (applied.includes(migration.id)) return;

  db.exec(migration.up);
  db.prepare("INSERT INTO _migrations (id, name) VALUES (?, ?)").run(
    migration.id,
    migration.name,
  );
}

/**
 * Rollback a single migration.
 */
export function rollbackMigration(migration: Migration): void {
  const db = getDatabase({ path: "" });
  db.exec(migration.down);
  db.prepare("DELETE FROM _migrations WHERE id = ?").run(migration.id);
}

/**
 * Run all pending migrations.
 */
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
