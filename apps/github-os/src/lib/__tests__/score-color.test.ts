import { describe, it, expect } from "vitest";

import {
  scoreToColor,
  scoreToBg,
  scoreToBorder,
  severityToColor,
  priorityToColor,
} from "../score-color";

/**
 * Score-to-colour mapping guards.
 *
 * These values are read on pages that judge code quality, so a silently
 * off-by-one boundary would mis-signal health to the reader — for example a
 * score of exactly 80 must be "excellent", not "good".
 */

describe("scoreToColor", () => {
  const table: Array<[number, string]> = [
    [100, "var(--color-score-excellent)"],
    [80, "var(--color-score-excellent)"],
    [79.999, "var(--color-score-good)"],
    [60, "var(--color-score-good)"],
    [59.999, "var(--color-score-moderate)"],
    [40, "var(--color-score-moderate)"],
    [39.999, "var(--color-score-poor)"],
    [0, "var(--color-score-poor)"],
    [-1, "var(--color-score-poor)"],
  ];

  for (const [score, expected] of table) {
    it(`maps ${score} to ${expected}`, () => {
      expect(scoreToColor(score)).toBe(expected);
    });
  }
});

describe("scoreToBg", () => {
  it("uses the same tiers as the text colour", () => {
    expect(scoreToBg(80)).toBe("var(--color-score-excellent-bg)");
    expect(scoreToBg(60)).toBe("var(--color-score-good-bg)");
    expect(scoreToBg(40)).toBe("var(--color-score-moderate-bg)");
    expect(scoreToBg(0)).toBe("var(--color-score-poor-bg)");
  });
});

describe("scoreToBorder", () => {
  it("uses the same tiers as the text colour", () => {
    expect(scoreToBorder(80)).toBe("var(--color-score-excellent-border)");
    expect(scoreToBorder(60)).toBe("var(--color-score-good-border)");
    expect(scoreToBorder(40)).toBe("var(--color-score-moderate-border)");
    expect(scoreToBorder(0)).toBe("var(--color-score-poor-border)");
  });
});

describe("severityToColor", () => {
  it("maps the two error spellings to the error token", () => {
    expect(severityToColor("critical")).toBe("var(--color-status-error)");
    expect(severityToColor("error")).toBe("var(--color-status-error)");
  });

  it("maps the two warning spellings to the good token", () => {
    expect(severityToColor("major")).toBe("var(--color-score-good)");
    expect(severityToColor("warning")).toBe("var(--color-score-good)");
  });

  it("maps anything else to the excellent token", () => {
    expect(severityToColor("minor")).toBe("var(--color-score-excellent)");
    expect(severityToColor("info")).toBe("var(--color-score-excellent)");
    expect(severityToColor("")).toBe("var(--color-score-excellent)");
  });
});

describe("priorityToColor", () => {
  it("maps high to the error token, medium to good, and the rest to excellent", () => {
    expect(priorityToColor("high")).toBe("var(--color-status-error)");
    expect(priorityToColor("medium")).toBe("var(--color-score-good)");
    expect(priorityToColor("low")).toBe("var(--color-score-excellent)");
    expect(priorityToColor("")).toBe("var(--color-score-excellent)");
  });
});
