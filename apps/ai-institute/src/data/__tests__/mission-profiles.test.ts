import { describe, it, expect } from "vitest";
import { MISSION_PROFILES, getMissionProfile } from "../mission-profiles";

describe("mission profiles", () => {
  it("covers exactly four missions", () => {
    expect(MISSION_PROFILES).toHaveLength(4);
    expect(getMissionProfile("knowledge").status).toBe("active");
    expect(getMissionProfile("forest").status).toBe("planning");
    expect(getMissionProfile("heritage").status).toBe("planning");
    expect(getMissionProfile("community").status).toBe("planning");
  });

  it("every mission cites verbatim mandates", () => {
    for (const m of MISSION_PROFILES) {
      expect(m.mandates.length).toBeGreaterThanOrEqual(1);
      for (const q of m.mandates) expect(q.source).toMatch(/constitution/i);
    }
  });

  it("roadmaps carry no digits (plans, not claims)", () => {
    for (const m of MISSION_PROFILES)
      for (const p of m.roadmap)
        expect(`${p.title}${p.intent}`).not.toMatch(/\d/);
  });

  it("one-liners and status copy carry no digits", () => {
    for (const m of MISSION_PROFILES) {
      expect(m.oneLiner).not.toMatch(/\d/);
      expect(m.statusCopy).not.toMatch(/\d/);
    }
  });

  it("planning missions publish the honest empty-accomplishments line", () => {
    for (const m of MISSION_PROFILES)
      if (m.status === "planning")
        expect(m.accomplishments).toContain("No accomplishments published yet");
  });

  it("roadmap phases are Now/Next/Later in order", () => {
    for (const m of MISSION_PROFILES)
      expect(m.roadmap.map((p) => p.phase)).toEqual(["Now", "Next", "Later"]);
  });
});
