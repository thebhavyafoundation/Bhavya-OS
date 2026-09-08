import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { join } from "path";
import { existsSync, unlinkSync, mkdirSync } from "fs";
import { getAdaptedDatabase, migrate } from "@bhavya/database";

const TEST_DB_DIR = join(process.cwd(), "bhavya-ai-lab", "test");
const TEST_DB_PATH = join(TEST_DB_DIR, "test.db");

beforeAll(async () => {
  if (!existsSync(TEST_DB_DIR)) mkdirSync(TEST_DB_DIR, { recursive: true });
  await migrate("ai-institute");
});

afterAll(() => {
  try {
    const db = getAdaptedDatabase("ai-institute");
    db.close?.();
  } catch {
    /* ignore */
  }
  try {
    if (existsSync(TEST_DB_PATH)) unlinkSync(TEST_DB_PATH);
  } catch {
    /* ignore — may be locked */
  }
});

describe("Database", () => {
  it("should initialize and have tables", () => {
    const db = getAdaptedDatabase("ai-institute");
    const tables = db
      .prepare("SELECT name FROM sqlite_master WHERE type='table'")
      .all() as { name: string }[];
    const userTables = tables.filter((t) => !t.name.startsWith("_"));
    expect(userTables.length).toBeGreaterThanOrEqual(3);
  });

  it("should have users table with required columns", () => {
    const db = getAdaptedDatabase("ai-institute");
    const columns = db.prepare("PRAGMA table_info(users)").all() as {
      name: string;
    }[];
    const colNames = columns.map((c) => c.name);
    expect(colNames).toContain("id");
    expect(colNames).toContain("email");
    expect(colNames).toContain("name");
    expect(colNames).toContain("password_hash");
    expect(colNames).toContain("role");
  });

  it("should have sessions table", () => {
    const db = getAdaptedDatabase("ai-institute");
    const tables = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name = 'sessions'",
      )
      .all();
    expect(tables.length).toBe(1);
  });

  it("should have student_profiles table", () => {
    const db = getAdaptedDatabase("ai-institute");
    const tables = db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name = 'student_profiles'",
      )
      .all();
    expect(tables.length).toBe(1);
  });

  it("should support CRUD operations", () => {
    const db = getAdaptedDatabase("ai-institute");
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    db.prepare(
      `
      INSERT INTO users (id, email, name, password_hash, role, provider, onboarding_complete, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, 'local', 0, ?, ?)
    `,
    ).run(id, "test@test.com", "Test User", "hash", "student", now, now);

    const user = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    expect(user).toBeDefined();

    db.prepare("UPDATE users SET name = ? WHERE id = ?").run("Updated", id);
    const updated = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as {
      name: string;
    };
    expect(updated.name).toBe("Updated");

    db.prepare("DELETE FROM users WHERE id = ?").run(id);
    const deleted = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
    expect(deleted).toBeUndefined();
  });
});
