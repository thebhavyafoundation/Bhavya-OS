import { describe, it, expect } from "vitest";
import { JUNIOR_MODULES } from "../junior";

describe("junior registry (spec D2)", () => {
  it("has exactly 12 modules: 6 junior-a + 6 junior-b", () => {
    expect(JUNIOR_MODULES.length).toBe(12);
    expect(JUNIOR_MODULES.filter((m) => m.level === "jr-a").length).toBe(6);
    expect(JUNIOR_MODULES.filter((m) => m.level === "jr-b").length).toBe(6);
  });
  it("ids follow jr-{a|b}-{n} and bands match spec D3", () => {
    for (const m of JUNIOR_MODULES) {
      expect(m.id).toMatch(/^jr-[ab]-\d$/);
      if (m.level === "jr-a") expect(m.ageBand).toBe("6-8");
      else expect(m.ageBand).toBe("9-11");
    }
  });
  it("has the exact 12 titles from spec §4.1", () => {
    const titles = JUNIOR_MODULES.map((m) => m.title);
    expect(titles).toEqual([
      "AI Around Me",
      "Smart Machines",
      "Human vs Machine",
      "Data Detectives",
      "Friendly Robots",
      "Kind Digital Citizen",
      "How Machines Learn",
      "Patterns & Predictions",
      "Sensors & Perception",
      "Talking with Machines",
      "Our AI Rules",
      "Mini Project: Build a Rule-Bot",
    ]);
  });
});
