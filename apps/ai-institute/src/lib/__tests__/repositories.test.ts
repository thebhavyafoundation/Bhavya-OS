import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { join } from "path";
import { existsSync, unlinkSync, mkdirSync } from "fs";
import { initLocalDatabase, migrate, getDatabase } from "../sqlite";
import { aiInstituteMigrations } from "../migrations";
import { SqliteUserRepository } from "../repositories/sqlite-user-repository";
import { SqliteSessionRepository } from "../repositories/sqlite-session-repository";

const TEST_DB_DIR = join(process.cwd(), "bhavya-ai-lab", "test");
const TEST_DB_PATH = join(TEST_DB_DIR, "test-repos.db");

beforeAll(() => {
  if (!existsSync(TEST_DB_DIR)) mkdirSync(TEST_DB_DIR, { recursive: true });
  initLocalDatabase(TEST_DB_PATH);
  migrate(aiInstituteMigrations);
});

afterAll(() => {
  try {
    const db = getDatabase();
    db.close?.();
  } catch { /* ignore */ }
  try {
    if (existsSync(TEST_DB_PATH)) unlinkSync(TEST_DB_PATH);
  } catch { /* ignore */ }
});

describe("SqliteUserRepository", () => {
  it("should create and find a user", async () => {
    const repo = new SqliteUserRepository();
    const user = await repo.create({
      email: `repo-test-${Date.now()}@test.com`,
      name: "Repo Test",
      passwordHash: "hashed",
      role: "student",
    });

    expect(user.id).toBeDefined();
    expect(user.email).toContain("repo-test");

    const found = await repo.findById(user.id);
    expect(found).not.toBeNull();
    expect(found!.name).toBe("Repo Test");

    const db = getDatabase();
    db.prepare("DELETE FROM users WHERE id = ?").run(user.id);
  });

  it("should find user by email", async () => {
    const email = `email-test-${Date.now()}@test.com`;
    const repo = new SqliteUserRepository();
    const user = await repo.create({
      email,
      name: "Email Test",
      passwordHash: "hashed",
    });

    const found = await repo.findByEmail(email);
    expect(found).not.toBeNull();
    expect(found!.id).toBe(user.id);

    const db = getDatabase();
    db.prepare("DELETE FROM users WHERE id = ?").run(user.id);
  });
});

describe("SqliteSessionRepository", () => {
  it("should create and find a session", async () => {
    const userRepo = new SqliteUserRepository();
    const sessionRepo = new SqliteSessionRepository();

    const user = await userRepo.create({
      email: `session-test-${Date.now()}@test.com`,
      name: "Session Test",
      passwordHash: "hashed",
    });

    const session = await sessionRepo.create(user.id);
    expect(session.token).toBeDefined();
    expect(session.expiresAt).toBeDefined();

    const found = await sessionRepo.findByToken(session.token);
    expect(found).not.toBeNull();
    expect(found!.userId).toBe(user.id);

    const db = getDatabase();
    db.prepare("DELETE FROM sessions WHERE user_id = ?").run(user.id);
    db.prepare("DELETE FROM users WHERE id = ?").run(user.id);
  });
});
