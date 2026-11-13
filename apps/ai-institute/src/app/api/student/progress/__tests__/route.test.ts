import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const dbState = vi.hoisted(() => ({
  row: null as Record<string, unknown> | null,
  getCalls: [] as Array<{ sql: string; args: unknown[] }>,
  runCalls: [] as Array<{ sql: string; args: unknown[] }>,
}));

vi.mock("@/lib/auth", () => ({
  requireAuth: vi.fn(),
  extractCorrelationId: vi.fn(() => "test-correlation-id"),
}));

vi.mock("@/lib/db", () => ({
  getAsyncDb: () => ({
    get: async (sql: string, ...args: unknown[]) => {
      dbState.getCalls.push({ sql, args });
      return dbState.row;
    },
    run: async (sql: string, ...args: unknown[]) => {
      dbState.runCalls.push({ sql, args });
      return { changes: 1 };
    },
  }),
}));

vi.mock("@/lib/audit", () => ({
  recordAuditEvent: vi.fn(async () => undefined),
}));

vi.mock("@/lib/logger", () => ({
  createLogger: () => ({
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }),
  RateLimits: { default: { limit: 1000, windowMs: 60_000 } },
  checkRateLimit: vi.fn(() => ({
    limited: false,
    resetAt: Date.now() + 60_000,
  })),
}));

import { requireAuth } from "@/lib/auth";
import { POST } from "../route";

const mockRequireAuth = vi.mocked(requireAuth);

type AuthUser = Awaited<ReturnType<typeof requireAuth>>;

function mockUser(role: string): AuthUser {
  return {
    id: "user-1",
    email: "parent@example.com",
    role,
  } as unknown as AuthUser;
}

function makeRequest(body: unknown): NextRequest {
  return new NextRequest("http://localhost/api/student/progress", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "content-type": "application/json" },
  });
}

describe("POST /api/student/progress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbState.row = null;
    dbState.getCalls = [];
    dbState.runCalls = [];
  });

  it("returns 401 when unauthenticated", async () => {
    mockRequireAuth.mockResolvedValue(null);
    const res = await POST(
      makeRequest({
        action: "completeLesson",
        data: { data: { lessonId: "lesson-1" } },
      }),
    );
    expect(res.status).toBe(401);
  });

  it("returns 403 for a disallowed role (camelCase action)", async () => {
    mockRequireAuth.mockResolvedValue(mockUser("parent"));
    const res = await POST(
      makeRequest({
        action: "completeLesson",
        data: { data: { lessonId: "lesson-1" } },
      }),
    );
    expect(res.status).toBe(403);
    await expect(res.json()).resolves.toEqual({
      error: "Insufficient permissions",
    });
  });

  it("returns 403 for a disallowed role (kebab-case action)", async () => {
    mockRequireAuth.mockResolvedValue(mockUser("parent"));
    const res = await POST(
      makeRequest({
        action: "complete-lesson",
        data: { data: { lessonId: "lesson-1" } },
      }),
    );
    expect(res.status).toBe(403);
    await expect(res.json()).resolves.toEqual({
      error: "Insufficient permissions",
    });
  });
});

describe("POST /api/student/progress - reading progress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbState.row = null;
    dbState.getCalls = [];
    dbState.runCalls = [];
    mockRequireAuth.mockResolvedValue(mockUser("student"));
  });

  /**
   * The defect: the profile row was created before the action was looked
   * at, so a page that only wanted to know what the server already held
   * could write to the database.
   */
  it("does not write anything when reading progress", async () => {
    dbState.row = { lessons_completed: JSON.stringify(["l0-m1"]) };

    const res = await POST(
      makeRequest({ action: "syncCurriculumProgress", data: {} }),
    );

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({
      completedModules: ["l0-m1"],
    });
    expect(dbState.runCalls).toEqual([]);
  });

  it("does not create a profile row when reading progress for a learner who has none", async () => {
    dbState.row = null;

    const res = await POST(
      makeRequest({ action: "syncCurriculumProgress", data: {} }),
    );

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ completedModules: [] });
    expect(dbState.runCalls).toEqual([]);
    expect(
      dbState.getCalls.some((call) => /INSERT/i.test(call.sql)),
      "a read must not insert a profile row",
    ).toBe(false);
  });

  it("still refuses a read from a caller who may not write", async () => {
    mockRequireAuth.mockResolvedValue(mockUser("parent"));

    const res = await POST(
      makeRequest({ action: "syncCurriculumProgress", data: {} }),
    );

    expect(res.status).toBe(403);
    expect(dbState.runCalls).toEqual([]);
  });
});

describe("POST /api/student/progress - syncing progress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    dbState.row = null;
    dbState.getCalls = [];
    dbState.runCalls = [];
    mockRequireAuth.mockResolvedValue(mockUser("student"));
  });

  it("records the modules the client completed", async () => {
    dbState.row = { lessons_completed: JSON.stringify([]) };

    const res = await POST(
      makeRequest({
        action: "syncCurriculumProgress",
        data: { completedModules: ["l0-m1", "l0-m2"] },
      }),
    );

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toMatchObject({
      completedModules: ["l0-m1", "l0-m2"],
    });
    expect(dbState.runCalls).toHaveLength(1);
    expect(dbState.runCalls[0].sql).toMatch(/UPDATE student_profiles/i);
  });

  it("merges with what the server already holds rather than replacing it", async () => {
    // The server knows about a completion the client has never seen - a
    // lesson completed on the lesson page is not in the curriculum
    // timeline's list. Replacing the stored list would drop it.
    dbState.row = { lessons_completed: JSON.stringify(["l4-m1"]) };

    const res = await POST(
      makeRequest({
        action: "syncCurriculumProgress",
        data: { completedModules: ["l0-m1"] },
      }),
    );

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toMatchObject({
      completedModules: ["l4-m1", "l0-m1"],
    });
  });

  it("does not duplicate a module that is already recorded", async () => {
    dbState.row = { lessons_completed: JSON.stringify(["l0-m1"]) };

    const res = await POST(
      makeRequest({
        action: "syncCurriculumProgress",
        data: { completedModules: ["l0-m1"] },
      }),
    );

    await expect(res.json()).resolves.toMatchObject({
      completedModules: ["l0-m1"],
    });
  });
});
