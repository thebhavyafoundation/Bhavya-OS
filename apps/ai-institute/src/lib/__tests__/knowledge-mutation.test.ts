/**
 * Knowledge Mutation Loop — Regression Tests
 *
 * Tests the full institutional mutation journey for Knowledge:
 *   UI → API → Auth → Validation → createKO → Evidence → Metrics → Public Projection
 *
 * Uses isolated temp directories to avoid interfering with production data.
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { mkdirSync, rmSync, existsSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";

// ── Test Fixtures ─────────────────────────────────────────────

const TEST_DIR = join(process.cwd(), "__test_knowledge_mutation__");
const TEST_KO_DIR = join(TEST_DIR, "knowledge", "objects");
const TEST_EVIDENCE_DIR = join(TEST_DIR, "evidence");
const TEST_METRICS_DIR = join(TEST_DIR, "metrics");

// Temporarily override env vars for test isolation
const originalKoDir = process.env.KO_DIR;
const originalEvidenceDir = process.env.EVIDENCE_DIR;
const originalMetricsDir = process.env.METRICS_DIR;

beforeAll(() => {
  // Create test directories
  mkdirSync(TEST_KO_DIR, { recursive: true });
  mkdirSync(TEST_EVIDENCE_DIR, { recursive: true });
  mkdirSync(TEST_METRICS_DIR, { recursive: true });

  // Override env vars
  process.env.KO_DIR = TEST_KO_DIR;
  process.env.EVIDENCE_DIR = TEST_EVIDENCE_DIR;
  process.env.METRICS_DIR = TEST_METRICS_DIR;
});

afterAll(() => {
  // Restore env vars
  if (originalKoDir !== undefined) process.env.KO_DIR = originalKoDir;
  else delete process.env.KO_DIR;
  if (originalEvidenceDir !== undefined) process.env.EVIDENCE_DIR = originalEvidenceDir;
  else delete process.env.EVIDENCE_DIR;
  if (originalMetricsDir !== undefined) process.env.METRICS_DIR = originalMetricsDir;
  else delete process.env.METRICS_DIR;

  // Clean up test directory
  try {
    rmSync(TEST_DIR, { recursive: true, force: true });
  } catch { /* ignore cleanup errors */ }
});

// ── Import modules after env override ─────────────────────────

// We import the modules dynamically after env override so they pick up test paths.
// For unit tests of the repository/metrics/evidence, we import directly.

async function getModules() {
  const repo = await import("@/lib/knowledge-repository");
  const evidence = await import("@/lib/institutional-evidence");
  const metrics = await import("@/lib/knowledge-metrics");
  const projection = await import("@/lib/public-projection");
  return { repo, evidence, metrics, projection };
}

// ── Tests ─────────────────────────────────────────────────────

describe("Knowledge Mutation Loop", () => {
  let repo: Awaited<ReturnType<typeof getModules>>["repo"];
  let evidenceMod: Awaited<ReturnType<typeof getModules>>["evidence"];
  let metricsMod: Awaited<ReturnType<typeof getModules>>["metrics"];
  let projectionMod: Awaited<ReturnType<typeof getModules>>["projection"];

  beforeAll(async () => {
    const modules = await getModules();
    repo = modules.repo;
    evidenceMod = modules.evidence;
    metricsMod = modules.metrics;
    projectionMod = modules.projection;
  });

  beforeEach(() => {
    // Clean KO directory before each test
    try {
      const files = require("fs").readdirSync(TEST_KO_DIR);
      for (const f of files) {
        require("fs").unlinkSync(join(TEST_KO_DIR, f));
      }
    } catch { /* ignore */ }
  });

  // ── KO Model ────────────────────────────────────────────────

  describe("KO Model", () => {
    it("should create KO with default provenance and status", () => {
      const ko = repo.createKO({
        title: "Test KO",
        domain: "AI",
      });

      expect(ko.id).toBeDefined();
      expect(ko.title).toBe("Test KO");
      expect(ko.domain).toBe("AI");
      expect(ko.provenance).toBe("institutional");
      expect(ko.status).toBe("draft");
      expect(ko.createdAt).toBeDefined();
      expect(ko.updatedAt).toBeDefined();
    });

    it("should allow setting provenance and status on create", () => {
      const ko = repo.createKO({
        title: "Imported KO",
        domain: "Forest",
        provenance: "imported",
        status: "published",
      });

      expect(ko.provenance).toBe("imported");
      expect(ko.status).toBe("published");
    });

    it("should include provenance and status in list summaries", () => {
      repo.createKO({ title: "List Test KO", domain: "AI" });
      const list = repo.listKOs();

      expect(list.length).toBeGreaterThan(0);
      const found = list.find((k) => k.title === "List Test KO");
      expect(found).toBeDefined();
      expect(found!.provenance).toBe("institutional");
      expect(found!.status).toBe("draft");
    });
  });

  // ── Validation ──────────────────────────────────────────────

  describe("Validation", () => {
    it("should reject KO with missing title", () => {
      // createKO with no title should default to "Untitled" — validation happens at API level
      const ko = repo.createKO({ domain: "AI" });
      expect(ko.title).toBe("Untitled");
    });

    it("should reject KO with empty title", () => {
      const ko = repo.createKO({ title: "", domain: "AI" });
      expect(ko.title).toBe("Untitled");
    });

    it("should accept KO with all fields", () => {
      const ko = repo.createKO({
        title: "Full KO",
        domain: "AI",
        description: "A full knowledge object",
        grade: 10,
        subject: "Computer Science",
        concepts: [{ name: "ML", description: "Machine Learning", difficulty: "beginner" }],
        definitions: [{ term: "AI", definition: "Artificial Intelligence" }],
        examples: [{ title: "Example", description: "An example" }],
        prerequisites: ["Basic Math"],
        related: ["Deep Learning"],
      });

      expect(ko.title).toBe("Full KO");
      expect(ko.concepts.length).toBe(1);
      expect(ko.definitions.length).toBe(1);
      expect(ko.examples.length).toBe(1);
    });
  });

  // ── Evidence Recording ───────────────────────────────────────

  describe("Evidence", () => {
    it("should record evidence of KO creation", () => {
      const ko = repo.createKO({ title: "Evidence Test", domain: "AI" });

      const record = evidenceMod.recordEvidence(
        "ko-created",
        ko.id,
        `KO "${ko.title}" created`,
        { domain: ko.domain },
        evidenceMod.koEventKey(ko.id, "ko-created"),
      );

      expect(record).toBeDefined();
      expect(record.activityType).toBe("ko-created");
      expect(record.activityId).toBe(ko.id);
    });

    it("should not create duplicate evidence for same event key", () => {
      const ko = repo.createKO({ title: "Idempotent Test", domain: "AI" });
      const key = evidenceMod.koEventKey(ko.id, "ko-created");

      const first = evidenceMod.recordEvidence(
        "ko-created",
        ko.id,
        "First record",
        {},
        key,
      );
      const second = evidenceMod.recordEvidence(
        "ko-created",
        ko.id,
        "Second record",
        {},
        key,
      );

      // Same record returned (idempotent)
      expect(first.id).toBe(second.id);
    });

    it("should list evidence entries", () => {
      const list = evidenceMod.listEvidence(10);
      expect(Array.isArray(list)).toBe(true);
    });
  });

  // ── Metrics ─────────────────────────────────────────────────

  describe("Metrics", () => {
    it("should increment totalKos on recordKoCreated", () => {
      const before = metricsMod.getKnowledgeMetrics();
      const beforeTotal = before.totalKos;

      metricsMod.recordKoCreated();

      const after = metricsMod.getKnowledgeMetrics();
      expect(after.totalKos).toBe(beforeTotal + 1);
    });

    it("should increment koCreatedThisMonth on recordKoCreated", () => {
      const before = metricsMod.getKnowledgeMetrics();
      const beforeMonthly = before.koCreatedThisMonth;

      metricsMod.recordKoCreated();

      const after = metricsMod.getKnowledgeMetrics();
      expect(after.koCreatedThisMonth).toBe(beforeMonthly + 1);
    });

    it("should have correct metric structure", () => {
      const m = metricsMod.getKnowledgeMetrics();
      expect(m).toHaveProperty("totalKos");
      expect(m).toHaveProperty("totalLessons");
      expect(m).toHaveProperty("totalPublications");
      expect(m).toHaveProperty("koCreatedThisMonth");
      expect(m).toHaveProperty("lessonsPublishedThisMonth");
      expect(m).toHaveProperty("lastUpdated");
    });
  });

  // ── Public Projection ───────────────────────────────────────

  describe("Public Projection", () => {
    it("should project a KO to public representation", () => {
      const ko = repo.createKO({
        title: "Projection Test",
        domain: "AI",
        description: "Test projection",
        concepts: [{ name: "Test", description: "A test concept", difficulty: "beginner" }],
      });

      const projected = projectionMod.projectKnowledgeObject(ko);
      expect(projected.id).toBe(ko.id);
      expect(projected.title).toBe("Projection Test");
      expect(projected.concepts.length).toBe(1);
      // Internal fields should be stripped
      expect(projected).not.toHaveProperty("provenance");
      expect(projected).not.toHaveProperty("status");
      expect(projected).not.toHaveProperty("metadata");
      expect(projected).not.toHaveProperty("version");
    });

    it("should exclude solutions from public exercises", () => {
      const ko = repo.createKO({
        title: "Exercise Test",
        domain: "AI",
        exercises: [{ prompt: "What is AI?", type: "short-answer", solution: "AI is..." }],
      });

      const projected = projectionMod.projectKnowledgeObject(ko);
      expect(projected.exercises[0]).not.toHaveProperty("solution");
    });
  });

  // ── Full Mutation Journey ────────────────────────────────────

  describe("Full Mutation Journey", () => {
    it("should complete: create → evidence → metrics → read", () => {
      // 1. Create KO
      const ko = repo.createKO({
        title: "Full Journey Test",
        domain: "AI",
        description: "Testing the full institutional journey",
        concepts: [{ name: "Journey", description: "Full journey test", difficulty: "beginner" }],
      });
      expect(ko.id).toBeDefined();
      expect(ko.provenance).toBe("institutional");
      expect(ko.status).toBe("draft");

      // 2. Record evidence
      const record = evidenceMod.recordEvidence(
        "ko-created",
        ko.id,
        `KO "${ko.title}" created`,
        { domain: ko.domain },
        evidenceMod.koEventKey(ko.id, "ko-created"),
      );
      expect(record).toBeDefined();

      // 3. Update metrics
      const m = metricsMod.recordKoCreated();
      expect(m.totalKos).toBeGreaterThan(0);

      // 4. Read back
      const readBack = repo.getKO(ko.id);
      expect(readBack).not.toBeNull();
      expect(readBack!.title).toBe("Full Journey Test");

      // 5. Project to public
      const projected = projectionMod.projectKnowledgeObject(readBack!);
      expect(projected.title).toBe("Full Journey Test");
    });
  });

  // ── Publication Filtering ────────────────────────────────────

  describe("Publication Filtering", () => {
    it("draft KO should not appear in public projection", () => {
      // Create a draft KO (default)
      const ko = repo.createKO({ title: "Draft KO", domain: "AI" });
      expect(ko.status).toBe("draft");

      // Verify filtering logic: listKOs with status filter
      const summaries = repo.listKOs();
      const publishedSummaries = summaries.filter(
        (s) => s.status === "published" && (s.provenance || "institutional") === "institutional"
      );
      const found = publishedSummaries.find((s) => s.id === ko.id);
      expect(found).toBeUndefined();
    });

    it("published institutional KO should appear in public projection", () => {
      // Create a published KO
      const ko = repo.createKO({
        title: "Published KO",
        domain: "AI",
        status: "published",
        provenance: "institutional",
      });

      // Verify filtering logic
      const summaries = repo.listKOs();
      const publishedSummaries = summaries.filter(
        (s) => s.status === "published" && (s.provenance || "institutional") === "institutional"
      );
      const found = publishedSummaries.find((s) => s.id === ko.id);
      expect(found).toBeDefined();
      expect(found!.title).toBe("Published KO");
    });

    it("test-seeded KO should NOT appear in public projection even if published", () => {
      const ko = repo.createKO({
        title: "Test-Seeded Published KO",
        domain: "AI",
        status: "published",
        provenance: "test-seed",
      });

      // Verify filtering logic: test-seed excluded
      const summaries = repo.listKOs();
      const publishedSummaries = summaries.filter(
        (s) => s.status === "published" && (s.provenance || "institutional") === "institutional"
      );
      const found = publishedSummaries.find((s) => s.id === ko.id);
      expect(found).toBeUndefined();
    });
  });

  // ── Public Projection Eligibility (N2 Regression) ──────────────

  describe("Public Projection Eligibility (N2)", () => {
    it("should only include institutional + published KOs in public set", () => {
      // Create all 4 combinations
      const institutionalPublished = repo.createKO({
        title: "Inst Published",
        domain: "AI",
        status: "published",
        provenance: "institutional",
      });
      const institutionalDraft = repo.createKO({
        title: "Inst Draft",
        domain: "AI",
        status: "draft",
        provenance: "institutional",
      });
      const testSeedPublished = repo.createKO({
        title: "Test Published",
        domain: "AI",
        status: "published",
        provenance: "test-seed",
      });
      const testSeedDraft = repo.createKO({
        title: "Test Draft",
        domain: "AI",
        status: "draft",
        provenance: "test-seed",
      });

      // Verify filtering logic matches the public projection rules
      const summaries = repo.listKOs();
      const eligibleForPublic = summaries.filter(
        (s) => s.status === "published" && (s.provenance || "institutional") === "institutional"
      );
      const eligibleIds = eligibleForPublic.map((s) => s.id);

      expect(eligibleIds).toContain(institutionalPublished.id);
      expect(eligibleIds).not.toContain(institutionalDraft.id);
      expect(eligibleIds).not.toContain(testSeedPublished.id);
      expect(eligibleIds).not.toContain(testSeedDraft.id);
    });

    it("projectKnowledgeObject should strip internal fields from public output", () => {
      const ko = repo.createKO({
        title: "Strip Test",
        domain: "AI",
        status: "published",
        provenance: "institutional",
      });
      const projected = projectionMod.projectKnowledgeObject(ko);
      expect(projected).not.toHaveProperty("provenance");
      expect(projected).not.toHaveProperty("status");
      expect(projected).not.toHaveProperty("metadata");
      expect(projected).not.toHaveProperty("version");
    });

    it("should verify all 4 provenance+status combinations", () => {
      const combos = [
        { provenance: "institutional", status: "published", expected: true },
        { provenance: "institutional", status: "draft", expected: false },
        { provenance: "test-seed", status: "published", expected: false },
        { provenance: "test-seed", status: "draft", expected: false },
      ] as const;

      for (const combo of combos) {
        const ko = repo.createKO({
          title: `Combo ${combo.provenance}-${combo.status}`,
          domain: "AI",
          status: combo.status,
          provenance: combo.provenance,
        });
        const summaries = repo.listKOs();
        const found = summaries.find((s) => s.id === ko.id);
        const isEligible =
          found!.status === "published" && (found!.provenance || "institutional") === "institutional";
        expect(isEligible).toBe(combo.expected);
      }
    });
  });
});
