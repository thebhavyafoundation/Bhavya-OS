import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import Database from "better-sqlite3";

/**
 * IOC database bootstrap specifications.
 *
 * getDb() previously returned a handle on an unmigrated database: the caller
 * saw tables missing until an asynchronous fire-and-forget migration happened
 * to finish. These specifications pin the correct contract — every caller
 * gets a fully migrated handle, on every path, with no partial state.
 */

let scratch: string;

beforeEach(() => {
  scratch = mkdtempSync(join(tmpdir(), "bhavya-ioc-bootstrap-"));
  process.env.BHAVYA_DB_PATH = join(scratch, "ioc.db");
});

afterEach(() => {
  // The scratch database stays open inside the singleton for the duration of
  // the process; the OS reclaims the temporary directory.
  vi.resetModules();
});

/** Re-import db.ts against the scratch path, skipping the singleton. */
async function freshGetDb() {
  vi.resetModules();
  const { getDb } = await import("../db");
  return getDb;
}

describe("getDb", () => {
  it("applies every migration before the first read", async () => {
    const getDb = await freshGetDb();
    const db = getDb();

    const tables = db
      .prepare(`SELECT name FROM sqlite_master WHERE type='table'`)
      .all()
      .map((row) => (row as { name: string }).name);

    for (const expected of [
      "objectives",
      "risks",
      "decisions",
      "weekly_reviews",
      "action_items",
      "_migrations",
    ]) {
      expect(tables, `missing table ${expected}`).toContain(expected);
    }

    const applied = db
      .prepare(`SELECT id FROM _migrations`)
      .all() as Array<{ id: string }>;
    expect(applied.map((row) => row.id).sort()).toEqual([
      "ioc/001_baseline_schema",
      "ioc/002_add_fk_indexes",
    ]);
  });

  it("is a no-op on repeated access and restores the ledger after a wipe", async () => {
    const getDb = await freshGetDb();
    const first = getDb();
    expect(getDb()).toBe(first);

    first.close();
    const path = process.env.BHAVYA_DB_PATH!;
    const wiped = new Database(path);
    wiped.exec(`DROP TABLE _migrations`);
    wiped.close();

    const again = await freshGetDb();
    const db = again();

    // Tables still exist; the ledger is rebuilt exactly once.
    expect(db.prepare(`SELECT name FROM sqlite_master WHERE type='table'`).all().length).toBeGreaterThan(1);
    const rows = db.prepare(`SELECT id FROM _migrations`).all() as Array<{ id: string }>;
    expect(rows.map((row) => row.id).sort()).toEqual([
      "ioc/001_baseline_schema",
      "ioc/002_add_fk_indexes",
    ]);
    db.close();
  });

  it("refuses to run when a stored checksum does not match the migration content", async () => {
    const getDb = await freshGetDb();
    const db = getDb();
    db.close();

    const corrupt = new Database(process.env.BHAVYA_DB_PATH!);
    corrupt
      .prepare(
        `UPDATE _migrations SET checksum = '0000000000000000' WHERE id = 'ioc/001_baseline_schema'`,
      )
      .run();
    corrupt.close();

    const again = await freshGetDb();
    expect(() => again()).toThrow(/checksum/i);
  });

  it("creates a fresh schema on a pre-existing unmigrated scratch file", async () => {
    const path = process.env.BHAVYA_DB_PATH!;
    const placeholder = new Database(path);
    placeholder.exec(`CREATE TABLE scratch_marker (id TEXT PRIMARY KEY)`);
    placeholder.close();

    const getDb = await freshGetDb();
    const db = getDb();

    const tables = db
      .prepare(`SELECT name FROM sqlite_master WHERE type='table'`)
      .all()
      .map((row) => (row as { name: string }).name);

    expect(tables).toContain("objectives");
    expect(tables).toContain("_migrations");
    db.close();
  });
});
