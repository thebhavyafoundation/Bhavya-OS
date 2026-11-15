import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Database from "better-sqlite3";

import { applyMigrationsSync, IOC_MIGRATIONS } from "../db";

/**
 * Migration application safety.
 *
 * The migration runner that the app embeds must never leave a database in a
 * state that is neither "before" nor "after" a migration, and two processes
 * initialising the same database must not fight over it.
 */

let scratchDir: string;
let dbPath: string;

beforeEach(() => {
  scratchDir = mkdtempSync(join(tmpdir(), "bhavya-ioc-safety-"));
  dbPath = join(scratchDir, "ioc.db");
});

afterEach(() => {
  // The scratch database stays open inside the connection below; the operating
  // system reclaims the temporary directory.
});

function open(): Database.Database {
  return new Database(dbPath);
}

function tables(database: Database.Database): string[] {
  return (
    database
      .prepare(`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name`)
      .all() as Array<{ name: string }>
  ).map((row) => row.name);
}

describe("applyMigrationsSync", () => {
  it("applies every migration and records each one", () => {
    const database = open();

    const outcomes = applyMigrationsSync(database);

    expect(outcomes).toEqual(["applied", "applied"]);
    const recorded = database
      .prepare(`SELECT id FROM _migrations ORDER BY id`)
      .all() as Array<{ id: string }>;
    expect(recorded.map((row) => row.id)).toEqual([
      "ioc/001_baseline_schema",
      "ioc/002_add_fk_indexes",
    ]);
    expect(tables(database)).toContain("objectives");
    expect(tables(database)).toContain("risks");
    database.close();
  });

  it("is a no-op when the migrations are already applied", () => {
    const database = open();

    applyMigrationsSync(database);
    const second = applyMigrationsSync(database);

    expect(second).toEqual(["already-applied", "already-applied"]);
    const recorded = database
      .prepare(`SELECT id FROM _migrations`)
      .all() as Array<{ id: string }>;
    expect(recorded).toHaveLength(2);
    database.close();
  });

  it("leaves no partial state when a migration fails", () => {
    const database = open();
    const broken = {
      id: "ioc/999_broken",
      name: "999_broken",
      source: "999_broken.ts",
      // The first statement succeeds, the second does not.
      up: `CREATE TABLE IF NOT EXISTS half_applied (id TEXT PRIMARY KEY); THIS IS NOT SQL;`,
      down: `DROP TABLE IF EXISTS half_applied;`,
    };

    expect(() => applyMigrationsSync(database, [broken])).toThrow();

    // The table created before the failure was rolled back with the ledger row.
    expect(tables(database)).not.toContain("half_applied");
    const recorded = database
      .prepare(`SELECT id FROM _migrations`)
      .all() as Array<{ id: string }>;
    expect(recorded.map((row) => row.id)).not.toContain("ioc/999_broken");
    database.close();
  });

  it("keeps migrations that succeeded when a later one fails", () => {
    const database = open();
    const broken = {
      id: "ioc/999_broken",
      name: "999_broken",
      source: "999_broken.ts",
      up: `NOT SQL AT ALL;`,
      down: ``,
    };

    expect(() =>
      applyMigrationsSync(database, [IOC_MIGRATIONS[0], broken]),
    ).toThrow();

    const recorded = database
      .prepare(`SELECT id FROM _migrations ORDER BY id`)
      .all() as Array<{ id: string }>;
    expect(recorded.map((row) => row.id)).toEqual(["ioc/001_baseline_schema"]);
    database.close();
  });

  it("serialises a second initialiser against the same database", () => {
    const first = open();
    applyMigrationsSync(first);
    first.close();

    // A second connection stands in for a second process: it must recognise the
    // applied migrations instead of failing on the ledger's primary key.
    const second = open();
    const outcomes = applyMigrationsSync(second);

    expect(outcomes).toEqual(["already-applied", "already-applied"]);
    const recorded = second
      .prepare(`SELECT id FROM _migrations`)
      .all() as Array<{ id: string }>;
    expect(recorded).toHaveLength(2);
    second.close();
  });

  it("refuses to run when a recorded checksum does not match the migration", () => {
    const database = open();
    applyMigrationsSync(database);
    database
      .prepare(`UPDATE _migrations SET checksum = '0000000000000000' WHERE id = 'ioc/001_baseline_schema'`)
      .run();

    expect(() => applyMigrationsSync(database)).toThrow(/checksum/i);
    database.close();
  });
});
