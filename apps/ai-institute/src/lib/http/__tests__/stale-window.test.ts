import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

/**
 * The shared-cache stale window.
 *
 * Next.js serves an ISR page with `s-maxage={revalidate}` and
 * `stale-while-revalidate={expireTime - revalidate}`, and defaults expireTime to
 * one year. The founder approved approximately 300-second revalidation, so a
 * year-long stale window would contradict it: a shared cache that honours it
 * may serve a year-old page while revalidating in the background.
 *
 * These specifications pin the arithmetic that produces the header, so the
 * window cannot silently grow back to a year.
 */

const SRC_ROOT = resolve(__dirname, "../../..");
const APP_ROOT = resolve(SRC_ROOT, "..");

const configSource = readFileSync(join(APP_ROOT, "next.config.mjs"), "utf-8");
const layoutSource = readFileSync(join(SRC_ROOT, "app/layout.tsx"), "utf-8");

/** Every page.tsx under src/app, so a route override cannot be missed. */
function pageSources(dir: string): Array<{ path: string; source: string }> {
  const found: Array<{ path: string; source: string }> = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      found.push(...pageSources(full));
    } else if (entry === "page.tsx") {
      found.push({ path: full, source: readFileSync(full, "utf-8") });
    }
  }
  return found;
}

describe("shared-cache stale window", () => {
  it("bounds the stale window to ten minutes", () => {
    const expireTime = Number(
      configSource.match(/expireTime:\s*(\d+)/)?.[1],
    );
    const revalidate = Number(
      layoutSource.match(/export const revalidate = (\d+)/)?.[1],
    );

    expect(Number.isFinite(expireTime)).toBe(true);
    expect(Number.isFinite(revalidate)).toBe(true);
    expect(revalidate).toBe(300);

    // Next.js emits `stale-while-revalidate = expireTime - revalidate`.
    const staleWindow = expireTime - revalidate;
    expect(staleWindow).toBe(600);
    expect(staleWindow).toBeLessThanOrEqual(900);
  });

  it("keeps the stale window from exceeding the revalidation period by a year", () => {
    const expireTime = Number(configSource.match(/expireTime:\s*(\d+)/)?.[1]);

    // The Next.js default is one year; anything near it would authorise a
    // year-long stale window.
    expect(expireTime).toBeLessThan(3600);
  });

  it("has no route overriding the revalidation window", () => {
    const overrides = pageSources(join(SRC_ROOT, "app"))
      .map(({ path, source }) => ({
        path,
        match: source.match(/export const revalidate = (\d+)/),
      }))
      .filter((entry) => entry.match !== null);

    for (const override of overrides) {
      expect(
        Number(override.match![1]),
        `${override.path} overrides the revalidation window`,
      ).toBe(300);
    }
  });
});
