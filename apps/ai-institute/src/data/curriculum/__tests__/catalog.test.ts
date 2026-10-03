import { describe, it, expect } from "vitest";
import { CATALOG_MODULES } from "../catalog.generated";

describe("catalog generator output", () => {
  it("has exactly 74 modules", () => {
    expect(CATALOG_MODULES.length).toBe(74);
  });
  it("has unique ids in lX-mY format", () => {
    const ids = CATALOG_MODULES.map((m) => m.id);
    expect(new Set(ids).size).toBe(74);
    for (const id of ids) expect(id).toMatch(/^l\d+-m\d+$/);
  });
  it("covers L0 with 2 modules and L1-L12 with 6 each", () => {
    const byLevel = new Map<number, number>();
    for (const m of CATALOG_MODULES)
      byLevel.set(m.level, (byLevel.get(m.level) ?? 0) + 1);
    expect(byLevel.get(0)).toBe(2);
    for (let l = 1; l <= 12; l++) expect(byLevel.get(l)).toBe(6);
  });
  it("every module has title, mission, objectives, duration, hands-on %", () => {
    for (const m of CATALOG_MODULES) {
      expect(m.title.length).toBeGreaterThan(0);
      expect(m.mission.length).toBeGreaterThan(0);
      expect(m.objectives.length).toBeGreaterThan(0);
      expect(m.duration.length).toBeGreaterThan(0);
      expect(m.handsOnPercent).toBeGreaterThan(0);
    }
  });
  it("does not expose industry-relevance / mission-alignment numbers", () => {
    const keys = Object.keys(CATALOG_MODULES[0]).sort();
    expect(keys).not.toContain("industryRelevance");
    expect(keys).not.toContain("missionAlignment");
  });
});
