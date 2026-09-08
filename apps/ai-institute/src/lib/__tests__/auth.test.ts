import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { join } from "path";
import { existsSync, unlinkSync, mkdirSync } from "fs";
import { getAdaptedDatabase, migrate } from "@bhavya/database";
import {
  hashPassword,
  verifyPassword,
  stripSensitive,
  ApiUser,
} from "../api-auth";

const TEST_DB_DIR = join(process.cwd(), "bhavya-ai-lab", "test");
const TEST_DB_PATH = join(TEST_DB_DIR, "test-auth.db");

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
    /* ignore */
  }
});

describe("Password Hashing", () => {
  it("should hash and verify a password", async () => {
    const hash = await hashPassword("test-password-123");
    expect(hash).toBeDefined();
    expect(hash).not.toBe("test-password-123");
    expect(hash.length).toBeGreaterThan(20);

    const valid = await verifyPassword("test-password-123", hash);
    expect(valid).toBe(true);

    const invalid = await verifyPassword("wrong-password", hash);
    expect(invalid).toBe(false);
  }, 15000);
});

describe("stripSensitive", () => {
  it("should remove passwordHash from user object", () => {
    const user = {
      id: "1",
      email: "test@test.com",
      name: "Test",
      passwordHash: "secret-hash",
      role: "student",
    };

    const safe = stripSensitive(user as ApiUser) as Record<string, unknown>;
    expect(safe.passwordHash).toBeUndefined();
    expect(safe.id).toBe("1");
    expect(safe.email).toBe("test@test.com");
  });
});
