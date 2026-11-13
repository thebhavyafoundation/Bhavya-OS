import { describe, it, expect } from "vitest";

import { tokens } from "../tokens";

/**
 * Design-token integrity guards.
 *
 * These tests pin the structural invariants every token consumer relies on.
 * A missing scale step becomes a missing step in every button and badge, and
 * a malformed hex value silently renders as no-color. Source files, not
 * output, are the thing under test — this reads the canonical tokens object.
 */

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

/** Collect every leaf string value in a nested object. */
function leafStrings(node: unknown, path = ""): Array<{ path: string; value: string }> {
  const out: Array<{ path: string; value: string }> = [];
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    const here = path ? `${path}.${key}` : key;
    if (typeof value === "string") {
      out.push({ path: here, value });
    } else if (value && typeof value === "object") {
      out.push(...leafStrings(value, here));
    }
  }
  return out;
}

describe("design tokens", () => {
  it("has the core brand colour scales", () => {
    expect(tokens.colors.brand).toBeDefined();
    expect(tokens.colors.forest).toBeDefined();
    expect(tokens.colors.accent).toBeDefined();
    expect(tokens.colors.heritage).toBeDefined();
  });

  it("gives each of the core scales ten steps from 50 to 900", () => {
    for (const scale of ["brand", "forest", "accent", "heritage"] as const) {
      const steps = Object.keys(tokens.colors[scale]);
      for (const step of ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"]) {
        expect(steps, `${scale} is missing the ${step} step`).toContain(step);
      }
    }
  });

  it("only contains valid hex colour values", () => {
    const leaves = leafStrings(tokens.colors, "colors");
    expect(leaves.length).toBeGreaterThan(0);

    const invalid = leaves.filter(({ value }) => !HEX.test(value));
    expect(invalid.map(({ path }) => path)).toEqual([]);
  });
});
