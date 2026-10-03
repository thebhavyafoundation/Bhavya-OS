import { describe, it, expect } from "vitest";
import { getAllModules } from "@/data/curriculum";
import { getStandards } from "@/data/curriculum/standards";

describe("curriculum standards (spec §3)", () => {
  it("every module id has standards", () => {
    const modules = getAllModules();
    for (const m of modules) {
      const s = getStandards(m.id);
      expect(s).toBeDefined();
    }
  });
  it("bigIdeas.length ≥ 1", () => {
    const modules = getAllModules();
    for (const m of modules) {
      const s = getStandards(m.id);
      expect(s.bigIdeas.length).toBeGreaterThanOrEqual(1);
      for (const bi of s.bigIdeas) {
        expect(["BI1", "BI2", "BI3", "BI4", "BI5"]).toContain(bi);
      }
    }
  });
  it("cnStage in 1–6", () => {
    const modules = getAllModules();
    for (const m of modules) {
      const s = getStandards(m.id);
      expect(s.cnStage).toBeGreaterThanOrEqual(1);
      expect(s.cnStage).toBeLessThanOrEqual(6);
    }
  });
  it("cnDim ∈ four dims", () => {
    const modules = getAllModules();
    const dims = ["认知", "技能", "思维", "价值观"] as const;
    for (const m of modules) {
      const s = getStandards(m.id);
      expect(dims).toContain(s.cnDim);
    }
  });
  it("csta codes match expected pattern when present", () => {
    const modules = getAllModules();
    const cstaPattern = /^(3[AB]-[A-Z]{2}-\d{2}|2-AP-\d{2}|1A-AP-\d{2})$/;
    for (const m of modules) {
      const s = getStandards(m.id);
      if (s.csta) {
        for (const code of s.csta) {
          expect(code).toMatch(cstaPattern);
        }
      }
    }
  });
});
