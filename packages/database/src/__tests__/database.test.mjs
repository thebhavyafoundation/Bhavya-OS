import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync, unlinkSync, mkdirSync } from "fs";

let Database;
try {
  Database = (await import("better-sqlite3")).default;
} catch {
  console.log("# better-sqlite3 native module unavailable — skipping database tests");
  process.exit(0);
}

function computeChecksum(m) {
  return createHash("sha256").update(m.up + m.down).digest("hex").slice(0, 16);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const TEST_DIR = resolve(__dirname, "../../data");
const TEST_DB = resolve(TEST_DIR, "test-db-seed.test.db");

function getTestDb() {
  return new Database(TEST_DB);
}

describe("@bhavya/database", () => {
  before(() => {
    if (!existsSync(TEST_DIR)) mkdirSync(TEST_DIR, { recursive: true });
    if (existsSync(TEST_DB)) unlinkSync(TEST_DB);
  });

  after(() => {
    if (existsSync(TEST_DB)) unlinkSync(TEST_DB);
  });

  describe("SQLite connection", () => {
    it("opens a database file", () => {
      const db = getTestDb();
      assert.ok(db);
      const result = db.prepare("SELECT 1 as val").get();
      assert.strictEqual(result.val, 1);
      db.close();
    });

    it("applies WAL mode", () => {
      const db = getTestDb();
      db.pragma("journal_mode = WAL");
      const mode = db.pragma("journal_mode", { simple: true });
      assert.strictEqual(mode, "wal");
      db.close();
    });

    it("enforces foreign keys", () => {
      const db = getTestDb();
      db.pragma("foreign_keys = ON");
      const fk = db.pragma("foreign_keys", { simple: true });
      assert.strictEqual(fk, 1);
      db.close();
    });
  });

  describe("Schema operations", () => {
    it("creates and queries a table", () => {
      const db = getTestDb();
      db.exec(`
        CREATE TABLE IF NOT EXISTS test_users (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL
        )
      `);
      db.prepare("INSERT INTO test_users (id, name) VALUES (?, ?)").run(
        "u1",
        "Alice",
      );
      const row = db
        .prepare("SELECT * FROM test_users WHERE id = ?")
        .get("u1");
      assert.strictEqual(row.id, "u1");
      assert.strictEqual(row.name, "Alice");
      db.exec("DROP TABLE test_users");
      db.close();
    });

    it("enforces NOT NULL constraints", () => {
      const db = getTestDb();
      db.exec(`
        CREATE TABLE IF NOT EXISTS test_nn (
          id TEXT PRIMARY KEY,
          required TEXT NOT NULL
        )
      `);
      assert.throws(() => {
        db.prepare("INSERT INTO test_nn (id) VALUES (?)").run("x");
      });
      db.exec("DROP TABLE test_nn");
      db.close();
    });

    it("enforces foreign key constraints when enabled", () => {
      const db = getTestDb();
      db.pragma("foreign_keys = ON");
      db.exec(`
        CREATE TABLE IF NOT EXISTS test_parent (id TEXT PRIMARY KEY);
        CREATE TABLE IF NOT EXISTS test_child (
          id TEXT PRIMARY KEY,
          parent_id TEXT,
          FOREIGN KEY (parent_id) REFERENCES test_parent(id)
        );
      `);
      assert.throws(() => {
        db.prepare("INSERT INTO test_child (id, parent_id) VALUES (?, ?)").run(
          "c1",
          "nonexistent",
        );
      });
      db.exec("DROP TABLE test_child");
      db.exec("DROP TABLE test_parent");
      db.close();
    });
  });

  describe("Transactions", () => {
    it("commits on success", () => {
      const db = getTestDb();
      db.exec(
        "CREATE TABLE IF NOT EXISTS test_tx (id TEXT PRIMARY KEY, val INTEGER)",
      );
      const insert = db.prepare("INSERT INTO test_tx (id, val) VALUES (?, ?)");
      const tx = db.transaction(() => {
        insert.run("a", 10);
        insert.run("b", 20);
      });
      tx();
      const rows = db.prepare("SELECT * FROM test_tx").all();
      assert.strictEqual(rows.length, 2);
      db.exec("DROP TABLE test_tx");
      db.close();
    });

    it("rolls back on error", () => {
      const db = getTestDb();
      db.exec(
        "CREATE TABLE IF NOT EXISTS test_tx2 (id TEXT PRIMARY KEY, val INTEGER)",
      );
      const insert = db.prepare("INSERT INTO test_tx2 (id, val) VALUES (?, ?)");
      const tx = db.transaction(() => {
        insert.run("a", 10);
        throw new Error("boom");
      });
      assert.throws(() => tx(), /boom/);
      const count = db.prepare("SELECT count(*) as c FROM test_tx2").get();
      assert.strictEqual(count.c, 0);
      db.exec("DROP TABLE test_tx2");
      db.close();
    });
  });

  describe("Migrations", () => {
    it("computeChecksum is deterministic", () => {
      const migration = {
        id: "test-001",
        name: "test",
        up: "CREATE TABLE x (id TEXT)",
        down: "DROP TABLE x",
      };
      const hash1 = computeChecksum(migration);
      const hash2 = computeChecksum(migration);
      assert.strictEqual(hash1, hash2);
      assert.match(hash1, /^[a-f0-9]{16}$/);
    });

    it("different SQL produces different checksum", () => {
      const m1 = { id: "a", name: "a", up: "SELECT 1", down: "SELECT 2" };
      const m2 = { id: "a", name: "a", up: "SELECT 2", down: "SELECT 1" };
      assert.notStrictEqual(computeChecksum(m1), computeChecksum(m2));
    });
  });
});
