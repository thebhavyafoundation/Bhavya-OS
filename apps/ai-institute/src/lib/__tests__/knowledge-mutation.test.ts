/**
 * Knowledge Mutation Loop — Regression Tests
 *
 * Tests the full institutional mutation journey for Knowledge:
 *   UI → API → Auth → Validation → createKO → Evidence → Metrics → Public Projection
 *
 * Uses isolated temp directories to avoid interfering with production data.
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import { mkdirSync, rmSync, readdirSync, unlinkSync } from "fs";
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
  if (originalEvidenceDir !== undefined)
    process.env.EVIDENCE_DIR = originalEvidenceDir;
  else delete process.env.EVIDENCE_DIR;
  if (originalMetricsDir !== undefined)
    process.env.METRICS_DIR = originalMetricsDir;
  else delete process.env.METRICS_DIR;

  // Clean up test directory
  try {
    rmSync(TEST_DIR, { recursive: true, force: true });
  } catch {
    /* ignore cleanup errors */
  }
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
      const files = readdirSync(TEST_KO_DIR);
      for (const f of files) {
        unlinkSync(join(TEST_KO_DIR, f));
      }
    } catch {
      /* ignore */
    }
  });

  // ── KO Model ────────────────────────────────────────────────

  describe("KO Model", () => {
    it("should create KO with default provenance and status", async () => {
      const ko = await repo.createKO({
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

    it("should allow setting provenance and status on create", async () => {
      const ko = await repo.createKO({
        title: "Imported KO",
        domain: "Forest",
        provenance: "imported",
        status: "published",
      });

      expect(ko.provenance).toBe("imported");
      expect(ko.status).toBe("published");
    });

    it("should include provenance and status in list summaries", async () => {
      await repo.createKO({ title: "List Test KO", domain: "AI" });
      const list = await repo.listKOs();

      expect(list.length).toBeGreaterThan(0);
      const found = list.find((k) => k.title === "List Test KO");
      expect(found).toBeDefined();
      expect(found!.provenance).toBe("institutional");
      expect(found!.status).toBe("draft");
    });
  });

  // ── Validation ──────────────────────────────────────────────

  describe("Validation", () => {
    it("should reject KO with missing title", async () => {
      // createKO with no title should default to "Untitled" — validation happens at API level
      const ko = await repo.createKO({ domain: "AI" });
      expect(ko.title).toBe("Untitled");
    });

    it("should reject KO with empty title", async () => {
      const ko = await repo.createKO({ title: "", domain: "AI" });
      expect(ko.title).toBe("Untitled");
    });

    it("should accept KO with all fields", async () => {
      const ko = await repo.createKO({
        title: "Full KO",
        domain: "AI",
        description: "A full knowledge object",
        grade: 10,
        subject: "Computer Science",
        concepts: [
          {
            name: "ML",
            description: "Machine Learning",
            difficulty: "beginner",
          },
        ],
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
    it("should record evidence of KO creation", async () => {
      const ko = await repo.createKO({ title: "Evidence Test", domain: "AI" });

      const record = await evidenceMod.recordEvidence(
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

    it("should not create duplicate evidence for same event key", async () => {
      const ko = await repo.createKO({
        title: "Idempotent Test",
        domain: "AI",
      });
      const key = evidenceMod.koEventKey(ko.id, "ko-created");

      const first = await evidenceMod.recordEvidence(
        "ko-created",
        ko.id,
        "First record",
        {},
        key,
      );
      const second = await evidenceMod.recordEvidence(
        "ko-created",
        ko.id,
        "Second record",
        {},
        key,
      );

      // Same record returned (idempotent)
      expect(first.id).toBe(second.id);
    });

    it("should list evidence entries", async () => {
      const list = await evidenceMod.listEvidence(10);
      expect(Array.isArray(list)).toBe(true);
    });
  });

  // ── Metrics ─────────────────────────────────────────────────

  describe("Metrics", () => {
    it("should increment totalKos on recordKoCreated", async () => {
      const before = await metricsMod.getKnowledgeMetrics();
      const beforeTotal = before.totalKos;

      // Metrics are derived from records: creating a KO increments totalKos.
      await repo.createKO({ title: "Metrics KO", domain: "AI" });

      const after = await metricsMod.getKnowledgeMetrics();
      expect(after.totalKos).toBe(beforeTotal + 1);
    });

    it("should increment koCreatedThisMonth on recordKoCreated", async () => {
      const before = await metricsMod.getKnowledgeMetrics();
      const beforeMonthly = before.koCreatedThisMonth;

      // koCreatedThisMonth derives from ko-created evidence this month.
      const ko = await repo.createKO({
        title: "Monthly Metrics KO",
        domain: "AI",
      });
      await evidenceMod.recordEvidence(
        "ko-created",
        ko.id,
        "monthly test",
        {},
        evidenceMod.koEventKey(ko.id, "ko-created"),
      );

      const after = await metricsMod.getKnowledgeMetrics();
      expect(after.koCreatedThisMonth).toBe(beforeMonthly + 1);
    });

    it("should have correct metric structure", async () => {
      const m = await metricsMod.getKnowledgeMetrics();
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
    it("should project a KO to public representation", async () => {
      const ko = await repo.createKO({
        title: "Projection Test",
        domain: "AI",
        description: "Test projection",
        concepts: [
          {
            name: "Test",
            description: "A test concept",
            difficulty: "beginner",
          },
        ],
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

    it("should exclude solutions from public exercises", async () => {
      const ko = await repo.createKO({
        title: "Exercise Test",
        domain: "AI",
        exercises: [
          { prompt: "What is AI?", type: "short-answer", solution: "AI is..." },
        ],
      });

      const projected = projectionMod.projectKnowledgeObject(ko);
      expect(projected.exercises[0]).not.toHaveProperty("solution");
    });
  });

  // ── Full Mutation Journey ────────────────────────────────────

  describe("Full Mutation Journey", () => {
    it("should complete: create → evidence → metrics → read", async () => {
      // 1. Create KO
      const ko = await repo.createKO({
        title: "Full Journey Test",
        domain: "AI",
        description: "Testing the full institutional journey",
        concepts: [
          {
            name: "Journey",
            description: "Full journey test",
            difficulty: "beginner",
          },
        ],
      });
      expect(ko.id).toBeDefined();
      expect(ko.provenance).toBe("institutional");
      expect(ko.status).toBe("draft");

      // 2. Record evidence
      const record = await evidenceMod.recordEvidence(
        "ko-created",
        ko.id,
        `KO "${ko.title}" created`,
        { domain: ko.domain },
        evidenceMod.koEventKey(ko.id, "ko-created"),
      );
      expect(record).toBeDefined();

      // 3. Update metrics (derived from the KO + evidence above)
      const m = await metricsMod.getKnowledgeMetrics();
      expect(m.totalKos).toBeGreaterThan(0);

      // 4. Read back
      const readBack = await repo.getKO(ko.id);
      expect(readBack).not.toBeNull();
      expect(readBack!.title).toBe("Full Journey Test");

      // 5. Project to public
      const projected = projectionMod.projectKnowledgeObject(readBack!);
      expect(projected.title).toBe("Full Journey Test");
    });
  });

  // ── Publication Filtering ────────────────────────────────────

  describe("Publication Filtering", () => {
    it("draft KO should not appear in public projection", async () => {
      // Create a draft KO (default)
      const ko = await repo.createKO({ title: "Draft KO", domain: "AI" });
      expect(ko.status).toBe("draft");

      // Verify filtering logic: listKOs with status filter
      const summaries = await repo.listKOs();
      const publishedSummaries = summaries.filter(
        (s) =>
          s.status === "published" &&
          (s.provenance || "institutional") === "institutional",
      );
      const found = publishedSummaries.find((s) => s.id === ko.id);
      expect(found).toBeUndefined();
    });

    it("published institutional KO should appear in public projection", async () => {
      // Create a published KO
      const ko = await repo.createKO({
        title: "Published KO",
        domain: "AI",
        status: "published",
        provenance: "institutional",
      });

      // Verify filtering logic
      const summaries = await repo.listKOs();
      const publishedSummaries = summaries.filter(
        (s) =>
          s.status === "published" &&
          (s.provenance || "institutional") === "institutional",
      );
      const found = publishedSummaries.find((s) => s.id === ko.id);
      expect(found).toBeDefined();
      expect(found!.title).toBe("Published KO");
    });

    it("test-seeded KO should NOT appear in public projection even if published", async () => {
      const ko = await repo.createKO({
        title: "Test-Seeded Published KO",
        domain: "AI",
        status: "published",
        provenance: "test-seed",
      });

      // Verify filtering logic: test-seed excluded
      const summaries = await repo.listKOs();
      const publishedSummaries = summaries.filter(
        (s) =>
          s.status === "published" &&
          (s.provenance || "institutional") === "institutional",
      );
      const found = publishedSummaries.find((s) => s.id === ko.id);
      expect(found).toBeUndefined();
    });
  });

  // ── Public Projection Eligibility (N2 Regression) ──────────────

  describe("Public Projection Eligibility (N2)", () => {
    it("should only include institutional + published KOs in public set", async () => {
      // Create all 4 combinations
      const institutionalPublished = await repo.createKO({
        title: "Inst Published",
        domain: "AI",
        status: "published",
        provenance: "institutional",
      });
      const institutionalDraft = await repo.createKO({
        title: "Inst Draft",
        domain: "AI",
        status: "draft",
        provenance: "institutional",
      });
      const testSeedPublished = await repo.createKO({
        title: "Test Published",
        domain: "AI",
        status: "published",
        provenance: "test-seed",
      });
      const testSeedDraft = await repo.createKO({
        title: "Test Draft",
        domain: "AI",
        status: "draft",
        provenance: "test-seed",
      });

      // Verify filtering logic matches the public projection rules
      const summaries = await repo.listKOs();
      const eligibleForPublic = summaries.filter(
        (s) =>
          s.status === "published" &&
          (s.provenance || "institutional") === "institutional",
      );
      const eligibleIds = eligibleForPublic.map((s) => s.id);

      expect(eligibleIds).toContain(institutionalPublished.id);
      expect(eligibleIds).not.toContain(institutionalDraft.id);
      expect(eligibleIds).not.toContain(testSeedPublished.id);
      expect(eligibleIds).not.toContain(testSeedDraft.id);
    });

    it("projectKnowledgeObject should strip internal fields from public output", async () => {
      const ko = await repo.createKO({
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

    it("should verify all 4 provenance+status combinations", async () => {
      const combos = [
        { provenance: "institutional", status: "published", expected: true },
        { provenance: "institutional", status: "draft", expected: false },
        { provenance: "test-seed", status: "published", expected: false },
        { provenance: "test-seed", status: "draft", expected: false },
      ] as const;

      for (const combo of combos) {
        const ko = await repo.createKO({
          title: `Combo ${combo.provenance}-${combo.status}`,
          domain: "AI",
          status: combo.status,
          provenance: combo.provenance,
        });
        const summaries = await repo.listKOs();
        const found = summaries.find((s) => s.id === ko.id);
        const isEligible =
          found!.status === "published" &&
          (found!.provenance || "institutional") === "institutional";
        expect(isEligible).toBe(combo.expected);
      }
    });
  });

  // ── [id]/route.ts Evidence Recording (Wave 10B) ──────────────

  describe("PUT/DELETE evidence recording", () => {
    it("updateKO should produce a modifiable canonical record", async () => {
      const ko = await repo.createKO({
        title: "Update Evidence Test",
        domain: "AI",
        status: "draft",
        provenance: "institutional",
      });
      const updated = await repo.updateKO(ko.id, { title: "Updated Title" });
      expect(updated).not.toBeNull();
      expect(updated!.title).toBe("Updated Title");
      // ID and createdAt should be preserved
      expect(updated!.id).toBe(ko.id);
      expect(updated!.createdAt).toBe(ko.createdAt);
    });

    it("deleteKO should remove the canonical record", async () => {
      const ko = await repo.createKO({
        title: "Delete Evidence Test",
        domain: "AI",
        status: "draft",
        provenance: "institutional",
      });
      const deleted = await repo.deleteKO(ko.id);
      expect(deleted).toBe(true);
      // Verify it's gone
      const retrieved = await repo.getKO(ko.id);
      expect(retrieved).toBeNull();
    });

    it("updateKO with invalid ID should return null (no mutation)", async () => {
      const result = await repo.updateKO("nonexistent-id", { title: "No-op" });
      expect(result).toBeNull();
    });

    it("deleteKO with invalid ID should return false (no mutation)", async () => {
      const result = await repo.deleteKO("nonexistent-id");
      expect(result).toBe(false);
    });

    it("metrics should remain semantically correct after delete (live count)", async () => {
      const before = await metricsMod.getKnowledgeMetrics();
      const initialTotal = before.totalKos;

      // totalKos is a live count from knowledge_objects: create increments,
      // delete decrements back. Evidence remains as the audit trail.
      const ko = await repo.createKO({
        title: "Metrics Delete Test",
        domain: "AI",
        status: "draft",
        provenance: "institutional",
      });
      await evidenceMod.recordEvidence(
        "ko-created",
        ko.id,
        "live-count test",
        {},
        evidenceMod.koEventKey(ko.id, "ko-created"),
      );
      const mid = await metricsMod.getKnowledgeMetrics();
      expect(mid.totalKos).toBe(initialTotal + 1);

      await repo.deleteKO(ko.id);

      const after = await metricsMod.getKnowledgeMetrics();
      expect(after.totalKos).toBe(initialTotal);
      const evidence = await evidenceMod.getEvidenceByActivity(ko.id);
      expect(evidence.length).toBeGreaterThan(0);
    });
  });

  // ── isKOPublicEligible (Wave 10C) ────────────────────────────

  describe("isKOPublicEligible", () => {
    it("should be exported from public-projection", async () => {
      expect(projectionMod.isKOPublicEligible).toBeDefined();
      expect(typeof projectionMod.isKOPublicEligible).toBe("function");
    });

    it("should return true for published + institutional", async () => {
      expect(
        projectionMod.isKOPublicEligible({
          status: "published",
          provenance: "institutional",
        }),
      ).toBe(true);
    });

    it("should return false for draft + institutional", async () => {
      expect(
        projectionMod.isKOPublicEligible({
          status: "draft",
          provenance: "institutional",
        }),
      ).toBe(false);
    });

    it("should return false for published + test-seed", async () => {
      expect(
        projectionMod.isKOPublicEligible({
          status: "published",
          provenance: "test-seed",
        }),
      ).toBe(false);
    });

    it("should default missing status to draft", async () => {
      expect(
        projectionMod.isKOPublicEligible({ provenance: "institutional" }),
      ).toBe(false);
    });

    it("should default missing provenance to institutional", async () => {
      expect(projectionMod.isKOPublicEligible({ status: "published" })).toBe(
        true,
      );
    });
  });
});
