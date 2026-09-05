/**
 * Forest Integration Tests — Wave J2d
 *
 * End-to-end integration tests for the Forest reference slice.
 * Tests the complete journey: auth → create → canonical → evidence → metrics → read.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { join, resolve } from "path";
import { existsSync, unlinkSync, mkdirSync, readdirSync, readFileSync } from "fs";
import { NextRequest } from "next/server";
import { initLocalDatabase, migrate, getDatabase } from "../sqlite";
import { aiInstituteMigrations } from "../migrations";
import { createSession } from "../api-auth";
import { GET as forestMissionsGET, POST as forestMissionsPOST } from "@/app/api/forest/missions/route";
import { GET as forestMissionByIdGET } from "@/app/api/forest/missions/[id]/route";
import { GET as forestStatsGET } from "@/app/api/forest/stats/route";

const TEST_DB_DIR = join(process.cwd(), "bhavya-ai-lab", "test");
const TEST_DB_PATH = join(TEST_DB_DIR, "test-forest-integration.db");

// Resolve workspace root for metrics path (production code uses resolveFromWorkspace)
function resolveWorkspaceRoot(): string {
  let dir = process.cwd();
  for (let i = 0; i < 5; i++) {
    const pkgPath = join(dir, "package.json");
    if (existsSync(pkgPath)) {
      try {
        const pkg = JSON.parse(readFileSync(pkgPath, "utf-8"));
        if (pkg.name === "bhavya-foundation" || pkg.name === "@bhavya/root") return dir;
      } catch { /* continue */ }
    }
    dir = join(dir, "..");
  }
  return resolve(process.cwd(), "..", "..");
}
const WORKSPACE_ROOT = resolveWorkspaceRoot();

function uuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function hashSync(password: string): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const bcrypt = require("bcryptjs");
  return bcrypt.hashSync(password, 12);
}

function makeRequest(url: string, opts?: { method?: string; headers?: Record<string, string>; body?: string }): NextRequest {
  return new NextRequest(url, {
    method: opts?.method ?? "GET",
    headers: opts?.headers ?? {},
    body: opts?.body,
  });
}

let adminSessionToken: string;
let studentSessionToken: string;
let createdMissionId: string;

beforeAll(async () => {
  if (!existsSync(TEST_DB_DIR)) mkdirSync(TEST_DB_DIR, { recursive: true });
  initLocalDatabase(TEST_DB_PATH);
  migrate(aiInstituteMigrations);

  const db = getDatabase();
  const now = new Date().toISOString();

  // Create admin user
  const adminId = uuid();
  db.prepare(`
    INSERT OR IGNORE INTO users (id, email, name, password_hash, role, provider, interests, onboarding_complete, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'local', '[]', 1, ?, ?)
  `).run(adminId, `admin-int-${uuid()}@test.com`, "Integration Admin", hashSync("admin123"), "admin", now, now);

  // Create student user
  const studentId = uuid();
  db.prepare(`
    INSERT OR IGNORE INTO users (id, email, name, password_hash, role, provider, interests, onboarding_complete, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'local', '[]', 1, ?, ?)
  `).run(studentId, `student-int-${uuid()}@test.com`, "Integration Student", hashSync("student123"), "student", now, now);

  // Create sessions
  const adminSession = await createSession({ id: adminId, email: `admin-int-${uuid()}@test.com`, name: "Integration Admin", role: "admin" } as never);
  adminSessionToken = adminSession.token;

  const studentSession = await createSession({ id: studentId, email: `student-int-${uuid()}@test.com`, name: "Integration Student", role: "student" } as never);
  studentSessionToken = studentSession.token;
}, 30000);

afterAll(() => {
  try {
    const db = getDatabase();
    db.close?.();
  } catch { /* ignore */ }
  try {
    if (existsSync(TEST_DB_PATH)) unlinkSync(TEST_DB_PATH);
  } catch { /* ignore */ }
});

// ── J1: Forest End-to-End Journey ────────────────────────

describe("Forest E2E: Create → Canonical → Evidence → Metrics → Read", () => {
  it("should complete the full institutional mutation journey", async () => {
    // Step 1: Create an institutional mission via POST
    const createRequest = makeRequest("http://localhost:3020/api/forest/missions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session-token=${adminSessionToken}`,
      },
      body: JSON.stringify({
        name: "Integration Test Mission",
        description: "A mission created during integration testing",
        region: "Test Region",
        goals: ["Verify E2E journey", "Test all layers"],
        tags: ["integration", "test"],
      }),
    });
    const createResponse = await forestMissionsPOST(createRequest);
    expect(createResponse.status).toBe(201);

    const mission = await createResponse.json();
    createdMissionId = mission.id;
    expect(mission.name).toBe("Integration Test Mission");
    expect(mission.region).toBe("Test Region");
    expect(mission.provenance).toBe("institutional");
    expect(mission.status).toBe("planning");
    expect(mission.goals).toEqual(["Verify E2E journey", "Test all layers"]);
    expect(mission.tags).toEqual(["integration", "test"]);

    // Step 2: Verify canonical state — GET single mission
    const getRequest = makeRequest(`http://localhost:3020/api/forest/missions/${mission.id}`);
    const getResponse = await forestMissionByIdGET(getRequest, { params: Promise.resolve({ id: mission.id }) });
    expect(getResponse.status).toBe(200);
    const fetched = await getResponse.json();
    expect(fetched.id).toBe(mission.id);
    expect(fetched.name).toBe("Integration Test Mission");

    // Step 3: Verify evidence was created
    const evidenceDir = join(process.cwd(), "bhavya-ai-lab", "evidence", "forest");
    expect(existsSync(evidenceDir)).toBe(true);
    const evidenceFiles = readdirSync(evidenceDir).filter((f) => f.endsWith(".json"));
    const missionEvidence = evidenceFiles.filter((f) => {
      const content = JSON.parse(readFileSync(join(evidenceDir, f), "utf-8"));
      return content.activityId === mission.id;
    });
    expect(missionEvidence.length).toBeGreaterThanOrEqual(1);

    // Step 4: Verify metrics were updated
    const metricsPath = join(WORKSPACE_ROOT, "bhavya-ai-lab", "metrics", "forest.json");
    expect(existsSync(metricsPath)).toBe(true);
    const metrics = JSON.parse(readFileSync(metricsPath, "utf-8"));
    expect(metrics.totalMissions).toBeGreaterThanOrEqual(1);

    // Step 5: Verify public GET returns the mission
    const listResponse = await forestMissionsGET();
    expect(listResponse.status).toBe(200);
    const missions = await listResponse.json();
    const found = missions.find((m: { id: string }) => m.id === mission.id);
    expect(found).toBeDefined();
    expect(found.provenance).toBe("institutional");

    // Step 6: Verify stats API includes the mission
    const statsResponse = await forestStatsGET();
    expect(statsResponse.status).toBe(200);
    const stats = await statsResponse.json();
    expect(stats.totalMissions).toBeGreaterThanOrEqual(1);
  });
});

// ── Authorization Tests ─────────────────────────────────

describe("Forest Integration: Authorization", () => {
  it("should reject unauthorized user from creating mission", async () => {
    const request = makeRequest("http://localhost:3020/api/forest/missions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session-token=${studentSessionToken}`,
      },
      body: JSON.stringify({ name: "Unauthorized", region: "Test" }),
    });
    const response = await forestMissionsPOST(request);
    expect(response.status).toBe(403);
  });

  it("should reject unauthenticated request", async () => {
    const request = makeRequest("http://localhost:3020/api/forest/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Unauthenticated", region: "Test" }),
    });
    const response = await forestMissionsPOST(request);
    expect(response.status).toBe(401);
  });
});

// ── Validation Tests ────────────────────────────────────

describe("Forest Integration: Validation", () => {
  it("should reject mission with missing name", async () => {
    const request = makeRequest("http://localhost:3020/api/forest/missions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session-token=${adminSessionToken}`,
      },
      body: JSON.stringify({ region: "Test" }),
    });
    const response = await forestMissionsPOST(request);
    expect(response.status).toBe(400);
  });

  it("should reject mission with missing region", async () => {
    const request = makeRequest("http://localhost:3020/api/forest/missions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session-token=${adminSessionToken}`,
      },
      body: JSON.stringify({ name: "Test" }),
    });
    const response = await forestMissionsPOST(request);
    expect(response.status).toBe(400);
  });

  it("should reject mission with name exceeding 200 chars", async () => {
    const request = makeRequest("http://localhost:3020/api/forest/missions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session-token=${adminSessionToken}`,
      },
      body: JSON.stringify({ name: "x".repeat(201), region: "Test" }),
    });
    const response = await forestMissionsPOST(request);
    expect(response.status).toBe(400);
  });
});

// ── Provenance Filtering Tests ──────────────────────────

describe("Forest Integration: Provenance Filtering", () => {
  it("should not return test-seeded missions in public GET", async () => {
    const response = await forestMissionsGET();
    expect(response.status).toBe(200);
    const missions = await response.json();
    for (const m of missions) {
      expect(m.provenance).toBe("institutional");
    }
  });

  it("should hide test-seeded mission from single-mission endpoint", async () => {
    const forestDir = join(process.cwd(), "..", "..", "content", "forest");
    if (!existsSync(forestDir)) return;

    const files = readdirSync(forestDir).filter(
      (f) => f.startsWith("mission-") && f.endsWith(".json"),
    );
    if (files.length === 0) return;

    const firstFile = JSON.parse(readFileSync(join(forestDir, files[0]), "utf-8"));
    if (firstFile.provenance !== "institutional") {
      const request = makeRequest(`http://localhost:3020/api/forest/missions/${firstFile.id}`);
      const response = await forestMissionByIdGET(request, { params: Promise.resolve({ id: firstFile.id }) });
      expect(response.status).toBe(404);
    }
  });
});

// ── OS Visibility Tests ─────────────────────────────────

describe("Forest Integration: OS Visibility", () => {
  it("should return stats with institutional and test-seed breakdown", async () => {
    const response = await forestStatsGET();
    expect(response.status).toBe(200);
    const stats = await response.json();
    expect(typeof stats.totalMissions).toBe("number");
    expect(typeof stats.testSeedRecords).toBe("object");
    expect(typeof stats.testSeedRecords.missions).toBe("number");
    expect(Array.isArray(stats.recentEvidence)).toBe(true);
  });
});

// ── Idempotency Tests ──────────────────────────────────

describe("Forest Integration: Idempotency", () => {
  it("should not create duplicate evidence for the same event key", async () => {
    // Use the EvidenceStore directly to test idempotency
    const { EvidenceStore } = await import("../institutional/evidence-store");
    const testDir = join(process.cwd(), "bhavya-ai-lab", "test", "idempotency-test");
    if (!existsSync(testDir)) mkdirSync(testDir, { recursive: true });

    const store = new EvidenceStore({
      dir: testDir,
      activityTypes: ["mission-created", "test-event"],
    });

    // Record first event
    const eventKey = EvidenceStore.eventKey("test-entity-1", "mission-created");
    const first = store.record("mission-created", "test-entity-1", "First record", {}, eventKey);
    expect(first).toBeDefined();

    // Record same event again — should return existing, not create duplicate
    const second = store.record("mission-created", "test-entity-1", "Second record", {}, eventKey);
    expect(second.id).toBe(first.id);

    // Only one file should exist
    const files = readdirSync(testDir).filter((f) => f.endsWith(".json"));
    expect(files).toHaveLength(1);

    // Cleanup
    try {
      const { readdirSync: rs, unlinkSync: us } = await import("fs");
      for (const f of rs(testDir)) us(join(testDir, f));
    } catch { /* ignore */ }
  });
});

// ── Drift Detection Tests ──────────────────────────────

describe("Forest Integration: Drift Detection", () => {
  it("should report healthy metrics after creation", async () => {
    const response = await forestStatsGET();
    expect(response.status).toBe(200);
    const stats = await response.json();

    // Metrics should be consistent (no drift)
    expect(typeof stats.lastUpdated).toBe("string");
    expect(stats.lastUpdated).not.toBeNull();

    // Total missions should be >= 1 (we created at least one in E2E test)
    expect(stats.totalMissions).toBeGreaterThanOrEqual(1);
  });
});
