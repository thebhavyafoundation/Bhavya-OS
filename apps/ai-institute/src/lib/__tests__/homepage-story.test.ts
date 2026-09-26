import { describe, it, expect } from "vitest";
import { STORY_CHAPTERS, STORY_PROOF, HERO_BEATS } from "../homepage-story";

describe("homepage story data", () => {
  it("every proof point carries a source and an allowed verification state", () => {
    const allowed = ["verified", "reported", "pending"] as const;
    expect(STORY_PROOF.length).toBeGreaterThanOrEqual(1);
    for (const p of STORY_PROOF) {
      expect(p.source.length).toBeGreaterThan(0);
      expect(allowed).toContain(p.state);
      expect(p.state).toBe("verified");
    }
  });

  it("chapter hrefs are canonical internal routes", () => {
    for (const c of STORY_CHAPTERS) {
      expect(c.href).toMatch(
        /^\/(forest|knowledge|heritage|community|missions)$/,
      );
    }
  });

  it("chapter keys are unique and ordered 01..04", () => {
    const keys = STORY_CHAPTERS.map((c) => c.key);
    expect(new Set(keys).size).toBe(keys.length);
    expect(STORY_CHAPTERS.map((c) => c.index)).toEqual([
      "01",
      "02",
      "03",
      "04",
    ]);
  });

  it("hero beats cover the ten-beat order start (promise)", () => {
    expect(HERO_BEATS[0]).toBe("promise");
    expect(HERO_BEATS).toHaveLength(10);
  });
});
