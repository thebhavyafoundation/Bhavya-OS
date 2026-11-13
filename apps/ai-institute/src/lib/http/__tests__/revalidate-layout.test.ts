import { describe, expect, it } from "vitest";
import { readFileSync } from "fs";
import { join, resolve } from "path";

/**
 * Public-page revalidation guard.
 *
 * The root layout is the single point that gives every prerendered public
 * page a five-minute shared-cache window. If a change to the layout drops
 * or weakens that export, the homepage returns to permanent one-year caching
 * and no other test in the suite would notice.
 */

const APP_ROOT = resolve(__dirname, "../../..");
const layoutSource = readFileSync(
  join(APP_ROOT, "app", "layout.tsx"),
  "utf-8",
);

describe("public content revalidation", () => {
  it("exports a finite revalidate window on the root layout", () => {
    const match = layoutSource.match(/export\s+const\s+revalidate\s*=\s*(\d+)/);
    expect(match, "root layout exports a numeric revalidate").not.toBeNull();
    expect(Number(match![1])).toBe(300);
  });

  it("does not export a year-long or infinite revalidate window", () => {
    const match = layoutSource.match(/export\s+const\s+revalidate\s*=\s*(\d+)/);
    expect(Number(match![1])).toBeLessThan(3601);
    expect(match![1]).not.toBe("31536000");
  });

  it("does not export revalidate = false or revalidate = 0 on the root, which disables ISR", () => {
    expect(layoutSource).not.toMatch(/export\s+const\s+revalidate\s*=\s*false/);
    expect(layoutSource).not.toMatch(/export\s+const\s+revalidate\s*=\s*0\b/);
  });
});
