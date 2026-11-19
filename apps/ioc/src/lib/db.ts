import { getReadWriteDatabase } from "@bhavya/database";
import { computeChecksum } from "@bhavya/database/migrate";
import type Database from "better-sqlite3";

let db: Database.Database | null = null;

/**
 * A migration mirrored inside the application.
 *
 * `better-sqlite3` has no asynchronous surface, so the asynchronous migration
 * runner in `@bhavya/database/migrate` - which dynamic-imports the migration
 * files - cannot be awaited from this synchronous API. The two IOC migrations
 * are therefore mirrored here as plain strings.
 *
 * Mirroring is only safe if it cannot drift. Two things keep it honest:
 *
 *   - `db-migrations.spec.ts` reads the migration files and compares them with
 *     these strings, and fails when a migration is missing, extra, or does not
 *     match its file byte for byte;
 *   - the ids and checksums are the ones the shared runner records, so a
 *     database migrated by either engine is recognised by the other.
 *
 * Adding a migration? See `apps/ioc/docs/migration-procedure.md`.
 */

export interface EmbeddedMigration {
  /** Id recorded in the `_migrations` ledger. */
  id: string;
  /** Name recorded in the `_migrations` ledger. */
  name: string;
  /** The migration file this mirrors, relative to packages/database/migrations/ioc. */
  source: string;
  /** SQL that applies the migration. */
  up: string;
  /** SQL that rolls the migration back. */
  down: string;
}

const BASELINE_UP = `
-- Institutions
CREATE TABLE IF NOT EXISTS institutions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  mission TEXT NOT NULL,
  vision TEXT NOT NULL,
  departments TEXT DEFAULT '[]',
  created_at TEXT NOT NULL
);

-- Missions
CREATE TABLE IF NOT EXISTS missions (
  id TEXT PRIMARY KEY,
  statement TEXT NOT NULL,
  pillars TEXT DEFAULT '[]',
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);

-- Objectives
CREATE TABLE IF NOT EXISTS objectives (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  department TEXT,
  quarter TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'not_started',
  progress REAL NOT NULL DEFAULT 0,
  key_results TEXT DEFAULT '[]',
  initiatives TEXT DEFAULT '[]',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Milestones
CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  due_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'upcoming',
  related_objective_id TEXT,
  created_at TEXT NOT NULL
);

-- Risks
CREATE TABLE IF NOT EXISTS risks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  severity TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  category TEXT NOT NULL DEFAULT '',
  mitigation TEXT,
  owner TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Decisions
CREATE TABLE IF NOT EXISTS decisions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  context TEXT NOT NULL DEFAULT '',
  options TEXT DEFAULT '[]',
  selected_option TEXT,
  rationale TEXT,
  decided_by TEXT,
  decided_at TEXT,
  status TEXT NOT NULL DEFAULT 'proposed',
  created_at TEXT NOT NULL
);

-- Action items
CREATE TABLE IF NOT EXISTS action_items (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  assignee TEXT,
  due_date TEXT,
  priority TEXT NOT NULL DEFAULT 'normal',
  status TEXT NOT NULL DEFAULT 'pending',
  related_objective_id TEXT,
  created_at TEXT NOT NULL
);

-- Weekly reviews
CREATE TABLE IF NOT EXISTS weekly_reviews (
  id TEXT PRIMARY KEY,
  week_start TEXT NOT NULL,
  week_end TEXT NOT NULL,
  period TEXT NOT NULL DEFAULT 'weekly',
  summary TEXT DEFAULT '{}',
  metrics TEXT DEFAULT '[]',
  risks TEXT DEFAULT '[]',
  action_items TEXT DEFAULT '[]',
  next_week_plan TEXT DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TEXT NOT NULL
);

-- Alerts
CREATE TABLE IF NOT EXISTS alerts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  severity TEXT NOT NULL DEFAULT 'info',
  status TEXT NOT NULL DEFAULT 'active',
  source TEXT NOT NULL,
  acknowledged_by TEXT,
  acknowledged_at TEXT,
  resolved_at TEXT,
  created_at TEXT NOT NULL
);

-- Institution events
CREATE TABLE IF NOT EXISTS institution_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  source TEXT NOT NULL,
  payload TEXT DEFAULT '{}',
  created_at TEXT NOT NULL,
  aggregated INTEGER NOT NULL DEFAULT 0
);

-- Institution KPIs
CREATE TABLE IF NOT EXISTS institution_kpis (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  value REAL NOT NULL DEFAULT 0,
  unit TEXT NOT NULL DEFAULT '',
  target REAL,
  trend TEXT NOT NULL DEFAULT 'stable',
  change_percent REAL NOT NULL DEFAULT 0,
  period TEXT NOT NULL DEFAULT '',
  source TEXT NOT NULL,
  collected_at TEXT NOT NULL
);

-- System health
CREATE TABLE IF NOT EXISTS system_health (
  system TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'unknown',
  last_checked TEXT NOT NULL,
  api_available INTEGER NOT NULL DEFAULT 0,
  dashboard_available INTEGER NOT NULL DEFAULT 0,
  metrics_available INTEGER NOT NULL DEFAULT 0,
  events_produced INTEGER NOT NULL DEFAULT 0,
  events_consumed INTEGER NOT NULL DEFAULT 0,
  notes TEXT
);

-- Content packages (IoC production workflow)
CREATE TABLE IF NOT EXISTS ioc_content_packages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'L1',
  domain TEXT NOT NULL DEFAULT 'general',
  status TEXT NOT NULL DEFAULT 'draft',
  stage TEXT NOT NULL DEFAULT 'research',
  assignee TEXT,
  due_date TEXT,
  concepts INTEGER NOT NULL DEFAULT 0,
  published_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Media assets
CREATE TABLE IF NOT EXISTS ioc_media_assets (
  id TEXT PRIMARY KEY,
  kp_id TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  platform TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (kp_id) REFERENCES ioc_content_packages(id)
);

-- Community requests
CREATE TABLE IF NOT EXISTS ioc_community_requests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'pending',
  requested_by TEXT,
  created_at TEXT NOT NULL
);

-- Student feedback
CREATE TABLE IF NOT EXISTS ioc_student_feedback (
  id TEXT PRIMARY KEY,
  kp_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  comment TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (kp_id) REFERENCES ioc_content_packages(id)
);
  `;

const BASELINE_DOWN = `
DROP TABLE IF EXISTS ioc_student_feedback;
DROP TABLE IF EXISTS ioc_community_requests;
DROP TABLE IF EXISTS ioc_media_assets;
DROP TABLE IF EXISTS ioc_content_packages;
DROP TABLE IF EXISTS system_health;
DROP TABLE IF EXISTS institution_kpis;
DROP TABLE IF EXISTS institution_events;
DROP TABLE IF EXISTS alerts;
DROP TABLE IF EXISTS weekly_reviews;
DROP TABLE IF EXISTS action_items;
DROP TABLE IF EXISTS decisions;
DROP TABLE IF EXISTS risks;
DROP TABLE IF EXISTS milestones;
DROP TABLE IF EXISTS objectives;
DROP TABLE IF EXISTS missions;
DROP TABLE IF EXISTS institutions;
  `;

const FK_UP = `
-- FK indexes for ioc_media_assets.kp_id -> ioc_content_packages(id)
CREATE INDEX IF NOT EXISTS idx_ioc_media_assets_kp ON ioc_media_assets(kp_id);

-- FK indexes for ioc_student_feedback.kp_id -> ioc_content_packages(id)
CREATE INDEX IF NOT EXISTS idx_ioc_student_feedback_kp ON ioc_student_feedback(kp_id);
`;

const FK_DOWN = `
DROP INDEX IF EXISTS idx_ioc_media_assets_kp;
DROP INDEX IF EXISTS idx_ioc_student_feedback_kp;
`;


export const IOC_MIGRATIONS: EmbeddedMigration[] = [
  {
    id: "ioc/001_baseline_schema",
    name: "001_baseline_schema",
    source: "001_baseline_schema.ts",
    up: BASELINE_UP,
    down: BASELINE_DOWN,
  },
  {
    id: "ioc/002_add_fk_indexes",
    name: "002_add_fk_indexes",
    source: "002_add_fk_indexes.ts",
    up: FK_UP,
    down: FK_DOWN,
  },
];

/** The checksum the shared migration runner records for a migration. */
export function migrationChecksum(migration: EmbeddedMigration): string {
  return computeChecksum(migration);
}

/**
 * Apply every pending migration to a database.
 *
 * The whole migration - its SQL and its ledger row - is applied inside one
 * transaction, so a failure leaves no partial state: the schema change is
 * rolled back with the ledger row.
 *
 * The ledger is re-read inside the transaction. The transaction takes its write
 * lock immediately, so a second process that started earlier and found the
 * migration missing will see it applied by the time it holds the lock, and skip
 * it instead of failing on the ledger's primary key.
 *
 * @returns one entry per migration: "applied", "already-applied" or "skipped".
 */
export function applyMigrationsSync(
  database: Database.Database,
  migrations: EmbeddedMigration[] = IOC_MIGRATIONS,
): Array<"applied" | "already-applied" | "skipped"> {
  database.exec(
    `CREATE TABLE IF NOT EXISTS _migrations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      checksum TEXT NOT NULL,
      applied_at TEXT DEFAULT (datetime('now'))
    );`,
  );

  const selectChecksum = database.prepare(
    `SELECT checksum FROM _migrations WHERE id = ?`,
  );
  const insert = database.prepare(
    `INSERT INTO _migrations (id, name, checksum) VALUES (?, ?, ?)`,
  );

  const outcomes: Array<"applied" | "already-applied" | "skipped"> = [];

  for (const migration of migrations) {
    const applyOne = database.transaction((pending: EmbeddedMigration) => {
      const expected = migrationChecksum(pending);
      // Re-read under the write lock: another process may have applied this
      // migration between our first read and this transaction.
      const existing = selectChecksum.get(pending.id) as
        | { checksum: string }
        | undefined;

      if (existing) {
        if (existing.checksum !== expected) {
          throw new Error(
            `ioc migration ${pending.id} has a checksum recorded in ` +
              `_migrations that does not match the migration content. ` +
              `Refusing to run against an edited migration. Restore the ` +
              `migration content or recreate the scratch database.`,
          );
        }
        return "already-applied" as const;
      }

      database.exec(pending.up);
      insert.run(pending.id, pending.name, expected);
      return "applied" as const;
    });

    // Immediate: take the write lock now, so two processes initialising the
    // same database serialise instead of racing.
    outcomes.push(applyOne.immediate(migration));
  }

  return outcomes;
}

/**
 * Get the read-write database handle, applying any pending IOC migrations
 * first.
 *
 * Initialization is synchronous and self-bootstrapping: a fresh database gets
 * every migration applied before this function returns; an existing one is a
 * pure no-op. No caller can observe a half-migrated schema, and the first read
 * cannot race migration application.
 */
export function getDb(): Database.Database {
  if (db) return db;

  const database = getReadWriteDatabase("ioc");
  applyMigrationsSync(database);
  db = database;
  return db;
}
