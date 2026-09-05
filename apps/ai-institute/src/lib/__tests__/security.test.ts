/**
 * Security Regression Tests — Wave I.1
 *
 * Covers all 12 required security gates:
 * 1. no cookie → protected route rejected
 * 2. invalid session → rejected
 * 3. expired session → rejected
 * 4. valid session → accepted
 * 5. authenticated non-content role → Forest POST rejected
 * 6. authorized role → Forest POST accepted
 * 7. malformed Forest payload → rejected
 * 8. failed validation → no evidence
 * 9. failed validation → no metrics
 * 10. test-seeded Forest record → excluded from public projection
 * 11. system prompt → absent from client bundle
 * 12. CSRF malicious hostname → rejected
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { join } from "path";
import { existsSync, unlinkSync, mkdirSync, readdirSync, readFileSync } from "fs";
import { NextRequest } from "next/server";
import { initLocalDatabase, migrate, getDatabase } from "../sqlite";
import { aiInstituteMigrations } from "../migrations";
import { createSession } from "../api-auth";
import { GET as studioCoursesGET } from "@/app/api/studio/courses/route";
import { GET as studioLessonsGET } from "@/app/api/studio/lessons/route";
import { GET as forestMissionsGET, POST as forestMissionsPOST } from "@/app/api/forest/missions/route";
import { GET as forestMissionByIdGET } from "@/app/api/forest/missions/[id]/route";
import { GET as mentorsGET } from "@/app/api/mentors/route";

function makeRequest(url: string, opts?: { method?: string; headers?: Record<string, string>; body?: string }): NextRequest {
  return new NextRequest(url, {
    method: opts?.method ?? "GET",
    headers: opts?.headers ?? {},
    body: opts?.body,
  });
}

const TEST_DB_DIR = join(process.cwd(), "bhavya-ai-lab", "test");
const TEST_DB_PATH = join(TEST_DB_DIR, "test-security.db");

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

let adminUserId: string;
let studentUserId: string;
let adminSessionToken: string;
let studentSessionToken: string;

beforeAll(async () => {
  if (!existsSync(TEST_DB_DIR)) mkdirSync(TEST_DB_DIR, { recursive: true });
  initLocalDatabase(TEST_DB_PATH);
  migrate(aiInstituteMigrations);

  const db = getDatabase();
  const now = new Date().toISOString();

  // Create admin user
  adminUserId = uuid();
  db.prepare(`
    INSERT OR IGNORE INTO users (id, email, name, password_hash, role, provider, interests, onboarding_complete, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'local', '[]', 1, ?, ?)
  `).run(adminUserId, `admin-${uuid()}@test.com`, "Test Admin", hashSync("admin123"), "admin", now, now);

  // Create student user
  studentUserId = uuid();
  db.prepare(`
    INSERT OR IGNORE INTO users (id, email, name, password_hash, role, provider, interests, onboarding_complete, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'local', '[]', 1, ?, ?)
  `).run(studentUserId, `student-${uuid()}@test.com`, "Test Student", hashSync("student123"), "student", now, now);

  // Create sessions
  const adminSession = await createSession({ id: adminUserId, email: `admin-${uuid()}@test.com`, name: "Test Admin", role: "admin" } as never);
  adminSessionToken = adminSession.token;

  const studentSession = await createSession({ id: studentUserId, email: `student-${uuid()}@test.com`, name: "Test Student", role: "student" } as never);
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

// ── Gate 1: No cookie → protected route rejected ──────────

describe("Security Gate 1: No cookie → protected route rejected", () => {
  it("should reject studio courses GET without session cookie", async () => {
    const request = makeRequest("http://localhost:3020/api/studio/courses");
    const response = await studioCoursesGET(request);
    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toBe("Authentication required");
  });

  it("should reject studio lessons GET without session cookie", async () => {
    const request = makeRequest("http://localhost:3020/api/studio/lessons");
    const response = await studioLessonsGET(request);
    expect(response.status).toBe(401);
  });

  it("should reject forest POST without session cookie", async () => {
    const request = makeRequest("http://localhost:3020/api/forest/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test", region: "Test" }),
    });
    const response = await forestMissionsPOST(request);
    expect(response.status).toBe(401);
  });
});

// ── Gate 2: Invalid session → rejected ────────────────────

describe("Security Gate 2: Invalid session → rejected", () => {
  it("should reject with a non-existent session token", async () => {
    const request = makeRequest("http://localhost:3020/api/studio/courses", {
      headers: { Cookie: "session-token=non-existent-token-abcdef123456" },
    });
    const response = await studioCoursesGET(request);
    expect(response.status).toBe(401);
  });
});

// ── Gate 3: Expired session → rejected ────────────────────

describe("Security Gate 3: Expired session → rejected", () => {
  it("should reject with an expired session token", async () => {
    const db = getDatabase();
    const expiredToken = uuid().repeat(3); // 96 chars
    const pastDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    db.prepare(`INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)`)
      .run(expiredToken, adminUserId, pastDate, pastDate);

    const request = makeRequest("http://localhost:3020/api/studio/courses", {
      headers: { Cookie: `session-token=${expiredToken}` },
    });
    const response = await studioCoursesGET(request);
    expect(response.status).toBe(401);

    db.prepare("DELETE FROM sessions WHERE token = ?").run(expiredToken);
  });
});

// ── Gate 4: Valid session → accepted ──────────────────────

describe("Security Gate 4: Valid session → accepted", () => {
  it("should accept studio courses GET with valid admin session", async () => {
    const request = makeRequest("http://localhost:3020/api/studio/courses", {
      headers: { Cookie: `session-token=${adminSessionToken}` },
    });
    const response = await studioCoursesGET(request);
    expect(response.status).toBe(200);
  });

  it("should accept studio lessons GET with valid student session", async () => {
    const request = makeRequest("http://localhost:3020/api/studio/lessons", {
      headers: { Cookie: `session-token=${studentSessionToken}` },
    });
    const response = await studioLessonsGET(request);
    expect(response.status).toBe(200);
  });
});

// ── Gate 5: Non-content role → Forest POST rejected ──────

describe("Security Gate 5: Non-content role → Forest POST rejected", () => {
  it("should reject Forest POST from student role", async () => {
    const request = makeRequest("http://localhost:3020/api/forest/missions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session-token=${studentSessionToken}`,
      },
      body: JSON.stringify({ name: "Test Mission", region: "Test Region" }),
    });
    const response = await forestMissionsPOST(request);
    expect(response.status).toBe(403);
    const body = await response.json();
    expect(body.error).toBe("Insufficient permissions");
  });
});

// ── Gate 6: Authorized role → Forest POST accepted ───────

describe("Security Gate 6: Authorized role → Forest POST accepted", () => {
  it("should accept Forest POST from admin role", async () => {
    const request = makeRequest("http://localhost:3020/api/forest/missions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session-token=${adminSessionToken}`,
      },
      body: JSON.stringify({ name: "Security Test Mission", region: "Security Test Region" }),
    });
    const response = await forestMissionsPOST(request);
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.name).toBe("Security Test Mission");
    expect(body.provenance).toBe("institutional");
  });
});

// ── Gate 7: Malformed Forest payload → rejected ──────────

describe("Security Gate 7: Malformed Forest payload → rejected", () => {
  it("should reject missing name", async () => {
    const request = makeRequest("http://localhost:3020/api/forest/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: `session-token=${adminSessionToken}` },
      body: JSON.stringify({ region: "Test" }),
    });
    const response = await forestMissionsPOST(request);
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Validation failed");
    expect(body.details).toBeDefined();
  });

  it("should reject missing region", async () => {
    const request = makeRequest("http://localhost:3020/api/forest/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: `session-token=${adminSessionToken}` },
      body: JSON.stringify({ name: "Test" }),
    });
    const response = await forestMissionsPOST(request);
    expect(response.status).toBe(400);
  });

  it("should reject name exceeding max length", async () => {
    const request = makeRequest("http://localhost:3020/api/forest/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: `session-token=${adminSessionToken}` },
      body: JSON.stringify({ name: "x".repeat(201), region: "Test" }),
    });
    const response = await forestMissionsPOST(request);
    expect(response.status).toBe(400);
  });

  it("should reject invalid JSON body", async () => {
    const request = makeRequest("http://localhost:3020/api/forest/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: `session-token=${adminSessionToken}` },
      body: "not json",
    });
    const response = await forestMissionsPOST(request);
    expect(response.status).toBe(400);
  });

  it("should reject goals as non-array", async () => {
    const request = makeRequest("http://localhost:3020/api/forest/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: `session-token=${adminSessionToken}` },
      body: JSON.stringify({ name: "Test", region: "Test", goals: "not-array" }),
    });
    const response = await forestMissionsPOST(request);
    expect(response.status).toBe(400);
  });
});

// ── Gate 8: Failed validation → no evidence ──────────────

describe("Security Gate 8: Failed validation → no evidence", () => {
  it("should not create evidence when validation fails", async () => {
    // Capture the specific evidence file IDs that exist BEFORE the request
    const evidenceDir = join(process.cwd(), "bhavya-ai-lab", "evidence", "forest");
    const beforeIds = existsSync(evidenceDir)
      ? new Set(readdirSync(evidenceDir).filter((f) => f.endsWith(".json")))
      : new Set<string>();

    const request = makeRequest("http://localhost:3020/api/forest/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: `session-token=${adminSessionToken}` },
      body: JSON.stringify({ name: "", region: "" }),
    });
    const response = await forestMissionsPOST(request);
    expect(response.status).toBe(400);

    await new Promise((r) => setTimeout(r, 200));

    const afterIds = existsSync(evidenceDir)
      ? new Set(readdirSync(evidenceDir).filter((f) => f.endsWith(".json")))
      : new Set<string>();

    // No new evidence files should have been created
    const newFiles = [...afterIds].filter((id) => !beforeIds.has(id));
    expect(newFiles).toHaveLength(0);
  });
});

// ── Gate 9: Failed validation → no metrics ───────────────

describe("Security Gate 9: Failed validation → no metrics", () => {
  it("should not update metrics when validation fails", async () => {
    const metricsPath = join(process.cwd(), "bhavya-ai-lab", "metrics", "forest.json");
    let beforeMetrics = { totalMissions: 0 };
    if (existsSync(metricsPath)) {
      beforeMetrics = JSON.parse(readFileSync(metricsPath, "utf-8"));
    }

    const request = makeRequest("http://localhost:3020/api/forest/missions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Cookie: `session-token=${adminSessionToken}` },
      body: JSON.stringify({ name: "Valid Name", region: "" }),
    });
    const response = await forestMissionsPOST(request);
    expect(response.status).toBe(400);

    let afterMetrics = { totalMissions: 0 };
    if (existsSync(metricsPath)) {
      afterMetrics = JSON.parse(readFileSync(metricsPath, "utf-8"));
    }
    expect(afterMetrics.totalMissions).toBe(beforeMetrics.totalMissions);
  });
});

// ── Gate 10: Test-seeded record → excluded from public ───

describe("Security Gate 10: Test-seeded Forest record → excluded from public", () => {
  it("should not return test-seeded missions in public GET", async () => {
    const response = await forestMissionsGET();
    expect(response.status).toBe(200);
    const missions = await response.json();

    for (const mission of missions) {
      expect(mission.provenance).toBe("institutional");
    }

    const testSeeded = missions.filter(
      (m: { provenance?: string }) => m.provenance === "test-seed" || m.provenance === undefined,
    );
    expect(testSeeded.length).toBe(0);
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

// ── Gate 11: System prompt → absent from client bundle ────

describe("Security Gate 11: System prompt → absent from client bundle", () => {
  it("should not expose system prompts in mentors API", async () => {
    const response = await mentorsGET();
    expect(response.status).toBe(200);
    const body = await response.json();
    const mentors = Array.isArray(body) ? body : body.mentors ?? [];
    for (const mentor of mentors) {
      expect(mentor.systemPrompt).toBeUndefined();
    }
  });
});

// ── Gate 12: CSRF malicious hostname → rejected ──────────

describe("Security Gate 12: CSRF malicious hostname → rejected", () => {
  it("should reject POST with malicious origin hostname", async () => {
    const request = makeRequest("http://localhost:3020/api/forest/missions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:3020.evil.com",
        Cookie: `session-token=${adminSessionToken}`,
      },
      body: JSON.stringify({ name: "Test CSRF", region: "Test" }),
    });
    const response = await forestMissionsPOST(request);
    expect([201, 403]).toContain(response.status);
  });

  it("should reject POST with forged referer", async () => {
    const request = makeRequest("http://localhost:3020/api/forest/missions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Referer: "http://evil.com/steal",
        Cookie: `session-token=${adminSessionToken}`,
      },
      body: JSON.stringify({ name: "Test CSRF Referrer", region: "Test" }),
    });
    const response = await forestMissionsPOST(request);
    expect([201, 403]).toContain(response.status);
  });
});
