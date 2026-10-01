import { describe, expect, it } from "vitest";
import { aiStandards } from "@/data/standards/ai-standards";
import { aiModules } from "@/data/curriculum/ai-module-registry";
import {
  getModuleById,
  getModulesByBand,
  getModulesByLevel,
  getPrerequisites,
  getStandardsForModule,
} from "../ai-registry";

const standardIds = new Set(aiStandards.map((s) => s.id));
const moduleIds = new Set(aiModules.map((m) => m.id));

describe("AI standards taxonomy", () => {
  it("has between 60 and 80 entries", () => {
    expect(aiStandards.length).toBeGreaterThanOrEqual(60);
    expect(aiStandards.length).toBeLessThanOrEqual(80);
  });

  it("covers all four sources", () => {
    const sources = new Set(aiStandards.map((s) => s.source));
    expect(sources).toEqual(
      new Set(["USA.CA.AI", "China.MOE.IT.AI", "UNESCO.AI", "OECD.AI"]),
    );
  });

  it("has unique standard ids", () => {
    expect(standardIds.size).toBe(aiStandards.length);
  });

  it("references only known prerequisites", () => {
    for (const s of aiStandards) {
      for (const p of s.prerequisites ?? []) {
        expect(standardIds.has(p), `${s.id} → ${p}`).toBe(true);
      }
    }
  });

  it("has non-empty descriptions", () => {
    for (const s of aiStandards) {
      expect(s.description.length, s.id).toBeGreaterThan(10);
    }
  });
});

describe("AI module registry", () => {
  it("has exactly 86 modules", () => {
    expect(aiModules.length).toBe(86);
  });

  it("has unique ids and slugs", () => {
    expect(moduleIds.size).toBe(86);
    expect(new Set(aiModules.map((m) => m.slug)).size).toBe(86);
  });

  it("distributes bands as designed", () => {
    expect(aiModules.filter((m) => m.band === "junior-a").length).toBe(10);
    expect(aiModules.filter((m) => m.band === "junior-b").length).toBe(8);
    expect(aiModules.filter((m) => m.band === "core").length).toBe(56);
    expect(aiModules.filter((m) => m.band === "advanced").length).toBe(12);
  });

  it("gives every core level exactly 8 modules across L0-L6", () => {
    for (const level of ["L0", "L1", "L2", "L3", "L4", "L5", "L6"] as const) {
      expect(getModulesByLevel(level).length, level).toBe(8);
    }
  });

  it("uses every standard at least once", () => {
    const used = new Set(aiModules.flatMap((m) => m.standards));
    const unused = [...standardIds].filter((id) => !used.has(id));
    expect(unused).toEqual([]);
  });

  it("maps every module to at least one existing standard", () => {
    for (const m of aiModules) {
      expect(m.standards.length, m.id).toBeGreaterThanOrEqual(1);
      for (const s of m.standards) {
        expect(standardIds.has(s), `${m.id} → ${s}`).toBe(true);
      }
    }
  });

  it("resolves every module prerequisite and avoids self-references", () => {
    for (const m of aiModules) {
      for (const p of m.prerequisites ?? []) {
        expect(moduleIds.has(p), `${m.id} → ${p}`).toBe(true);
        expect(p).not.toBe(m.id);
      }
    }
  });

  it("has an acyclic prerequisite graph", () => {
    const state = new Map<string, "visiting" | "done">();
    const visit = (id: string): void => {
      const s = state.get(id);
      if (s === "done") return;
      if (s === "visiting") throw new Error(`prerequisite cycle at ${id}`);
      state.set(id, "visiting");
      const mod = aiModules.find((m) => m.id === id);
      for (const p of mod?.prerequisites ?? []) visit(p);
      state.set(id, "done");
    };
    for (const m of aiModules) visit(m.id);
    expect(state.size).toBe(86);
  });

  it("uses positive estimated hours and non-empty topics", () => {
    for (const m of aiModules) {
      expect(m.estimatedHours, m.id).toBeGreaterThan(0);
      expect(m.topics.length, m.id).toBeGreaterThanOrEqual(1);
    }
  });
});

describe("registry helpers", () => {
  it("filters by band", () => {
    expect(getModulesByBand("core")).toHaveLength(56);
    expect(getModulesByBand("junior-a")).toHaveLength(10);
    expect(getModulesByBand("advanced")).toHaveLength(12);
  });

  it("filters by level", () => {
    expect(getModulesByLevel("L0")).toHaveLength(8);
    expect(getModulesByLevel("JA")).toHaveLength(10);
    expect(getModulesByLevel("ADV")).toHaveLength(12);
  });

  it("looks up by id and returns undefined for unknown ids", () => {
    const first = aiModules[0];
    expect(getModuleById(first.id)).toBe(first);
    expect(getModuleById("does-not-exist")).toBeUndefined();
  });

  it("resolves prerequisites to module objects", () => {
    const withPrereq = aiModules.find(
      (m) => (m.prerequisites ?? []).length > 0,
    );
    expect(withPrereq).toBeDefined();
    const resolved = getPrerequisites(withPrereq!.id);
    expect(resolved.length).toBe(withPrereq!.prerequisites!.length);
    for (const r of resolved) expect(moduleIds.has(r.id)).toBe(true);
    expect(getPrerequisites("does-not-exist")).toHaveLength(0);
  });

  it("resolves standards for a module", () => {
    const m = aiModules[0];
    const standards = getStandardsForModule(m.id);
    expect(standards.length).toBeGreaterThanOrEqual(1);
    for (const s of standards) expect(standardIds.has(s.id)).toBe(true);
    expect(getStandardsForModule("does-not-exist")).toHaveLength(0);
  });
});
