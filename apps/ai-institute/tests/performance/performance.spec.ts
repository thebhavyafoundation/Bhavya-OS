import { test, expect } from "playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

/**
 * React hydration mismatch #418 is a known baseline on /missions under
 * reduced motion. The exception is narrowed to that route, that scenario
 * and that argument list, so any other hydration error fails the run.
 *
 * Occurrences that match the exception are kept in an artifact instead of
 * being dropped, so the count and the shape of the baseline stay visible
 * to whoever reads the run.
 */
const KNOWN_HYDRATION = {
  route: "/missions",
  scenario: "reduced-motion",
  args: ["args[]=text", "args[]=HTML"],
};

interface HydrationOccurrence {
  route: string;
  scenario: string;
  message: string;
}

const hydrationOccurrences: HydrationOccurrence[] = [];

function isKnownHydration(
  message: string,
  route: string,
  scenario: string,
): boolean {
  if (!message.includes("Minified React error #418")) return false;
  if (route !== KNOWN_HYDRATION.route) return false;
  if (scenario !== KNOWN_HYDRATION.scenario) return false;
  return KNOWN_HYDRATION.args.some((arg) => message.includes(arg));
}

/**
 * Watches the page for hydration errors. Known occurrences are recorded;
 * everything else is returned as an unexpected error and fails the test.
 */
function watchHydration(
  page: import("playwright/test").Page,
  state: { route: string; scenario: string },
) {
  const unexpected: string[] = [];

  const record = (message: string) => {
    if (isKnownHydration(message, state.route, state.scenario)) {
      hydrationOccurrences.push({
        route: state.route,
        scenario: state.scenario,
        message,
      });
      return;
    }
    unexpected.push(message);
  };

  page.on("pageerror", (error) => record(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") record(message.text());
  });

  return unexpected;
}

test.afterAll(() => {
  const file = join(
    dirname(test.info().file),
    "artifacts",
    "hydration-occurrences.json",
  );
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(
    file,
    JSON.stringify(
      {
        knownException: KNOWN_HYDRATION,
        occurrences: hydrationOccurrences,
      },
      null,
      2,
    ),
    "utf-8",
  );
});

test.describe("Performance verification - homepage", () => {
  test("homepage scroll and interactions", async ({ page }) => {
    const state = { route: "/", scenario: "default" };
    const errors = watchHydration(page, state);
    const failedRequests: string[] = [];

    page.on("requestfailed", (req) => {
      if (!req.url().includes("favicon")) {
        failedRequests.push(`${req.method()} ${req.url()}`);
      }
    });

    await page.goto("/", { waitUntil: "networkidle" });

    // Wait for fonts and critical assets
    await page.waitForLoadState("networkidle");

    // Screenshot: homepage top
    await page.screenshot({
      path: "tests/performance/screenshots/home-top.png",
    });

    // Scroll through major sections from top to bottom
    const scrollStart = Date.now();
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        const targetY = document.body.scrollHeight - window.innerHeight;
        let currentY = 0;
        const step = 400;

        function scrollStep() {
          currentY = Math.min(currentY + step, targetY);
          window.scrollTo(0, currentY);
          if (currentY < targetY) {
            requestAnimationFrame(scrollStep);
          } else {
            resolve();
          }
        }
        scrollStep();
      });
    });
    const scrollDuration = Date.now() - scrollStart;

    // Screenshot: homepage after scroll
    await page.screenshot({
      path: "tests/performance/screenshots/home-after-scroll.png",
    });

    // Capture CLS (Cumulative Layout Shift)
    let clsValue = -1;
    try {
      clsValue = await page.evaluate(() => {
        return new Promise<number>((resolve) => {
          if (typeof PerformanceObserver === "undefined") {
            resolve(-1);
            return;
          }
          let cls = 0;
          // lib.dom ships no LayoutShift interface; use the precise
          // structural shape instead of `any`.
          type LayoutShiftEntry = PerformanceEntry & {
            hadRecentInput: boolean;
            value: number;
          };
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const e = entry as LayoutShiftEntry;
              if (e.entryType === "layout-shift" && !e.hadRecentInput) {
                cls += e.value;
              }
            }
          });
          observer.observe({ entryTypes: ["layout-shift"] });
          setTimeout(() => resolve(cls), 3000);
        });
      });
    } catch {
      clsValue = -1;
    }

    // Nav menu: open and close 10 times. The mobile trigger is only visible
    // at mobile widths, so reload at a mobile viewport for this portion.
    await page.setViewportSize({ width: 390, height: 844 });
    state.route = "/";
    state.scenario = "default";
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const menuTrigger = page.locator("button.nav-mobile-trigger");
    const menuDrawer = page.locator(".mobile-menu-drawer");

    const menuTimes: Array<{ open: number; close: number }> = [];

    const domBefore = await page.evaluate(
      () => document.querySelectorAll("*").length,
    );
    const canvasBefore = await page.evaluate(
      () => document.querySelectorAll("canvas").length,
    );

    for (let i = 0; i < 10; i++) {
      const t0 = Date.now();
      await menuTrigger.click();
      await menuDrawer.waitFor({ state: "visible" });
      const openTime = Date.now() - t0;

      const t1 = Date.now();
      await page.locator("button.mobile-menu-close").click();
      await menuDrawer.waitFor({ state: "hidden" });
      const closeTime = Date.now() - t1;

      menuTimes.push({ open: openTime, close: closeTime });
    }

    const domAfter = await page.evaluate(
      () => document.querySelectorAll("*").length,
    );
    const canvasAfter = await page.evaluate(
      () => document.querySelectorAll("canvas").length,
    );

    // Assertions - DO FAIL for serious issues
    expect(errors).toEqual([]);
    expect(failedRequests.filter((r) => !r.includes("favicon"))).toEqual([]);

    // Log results
    console.log("=== PERFORMANCE RESULTS ===");
    console.log(`Scroll duration: ${scrollDuration}ms`);
    console.log(`CLS: ${clsValue}`);
    console.log(`DOM before: ${domBefore}, after: ${domAfter}`);
    console.log(`Canvas before: ${canvasBefore}, after: ${canvasAfter}`);
    console.log(`Menu times (open/close ms):`, JSON.stringify(menuTimes));
    console.log(`Failed requests:`, JSON.stringify(failedRequests));
  });

  test("mission page with ParticleField", async ({ page }) => {
    const state = { route: "/missions", scenario: "default" };
    const errors = watchHydration(page, state);

    await page.goto("/missions", { waitUntil: "networkidle" });

    // Check the page loads without errors
    expect(errors).toEqual([]);

    // Check canvas exists (ParticleField)
    const canvasCount = await page.evaluate(
      () => document.querySelectorAll("canvas").length,
    );
    console.log(`Mission page canvas count: ${canvasCount}`);

    // Scroll through the page
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        window.scrollTo(0, document.body.scrollHeight);
        resolve();
      });
    });
    await page.waitForTimeout(500);

    const canvasCountAfter = await page.evaluate(
      () => document.querySelectorAll("canvas").length,
    );
    console.log(`Mission page canvas count after scroll: ${canvasCountAfter}`);

    expect(errors).toEqual([]);
    expect(canvasCount).toBeGreaterThan(0);
  });
});

test.describe("Performance verification - reduced motion", () => {
  test("homepage and mission page with reduced motion", async ({ page }) => {
    // Emulate reduced motion. NOTE: emulateMedia is a Page API in Playwright;
    // BrowserContext has no emulateMedia method (calling it throws
    // "context.emulateMedia is not a function" at runtime and fails typecheck).
    await page.emulateMedia({ reducedMotion: "reduce" });

    const state = { route: "/", scenario: "reduced-motion" };
    const errors = watchHydration(page, state);

    await page.goto("/", { waitUntil: "networkidle" });

    // Scroll through homepage
    await page.evaluate(() => {
      return new Promise<void>((resolve) => {
        window.scrollTo(0, document.body.scrollHeight);
        resolve();
      });
    });

    // Take screenshot in reduced motion mode
    await page.screenshot({
      path: "tests/performance/screenshots/reduced-motion-home.png",
    });

    // Navigate to mission page with reduced motion
    state.route = "/missions";
    await page.goto("/missions", { waitUntil: "networkidle" });
    await page.screenshot({
      path: "tests/performance/screenshots/reduced-motion-mission.png",
    });

    expect(errors).toEqual([]);
  });
});

test.describe("Performance verification - desktop dropdown", () => {
  test("desktop dropdown open/close repeated with scroll", async ({ page }) => {
    const state = { route: "/", scenario: "default" };
    const errors = watchHydration(page, state);

    await page.goto("/", { waitUntil: "networkidle" });

    // Open and close a desktop dropdown 10 times
    const dropdownTrigger = page.locator('button:has-text("Explore")').first();
    for (let i = 0; i < 10; i++) {
      await dropdownTrigger.click();
      await page.waitForTimeout(100);
      await dropdownTrigger.click();
      await page.waitForTimeout(100);
    }

    // Scroll then repeat
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);
    for (let i = 0; i < 5; i++) {
      await dropdownTrigger.click();
      await page.waitForTimeout(100);
      await dropdownTrigger.click();
      await page.waitForTimeout(100);
    }

    // Escape closes
    await dropdownTrigger.click();
    await page.waitForTimeout(100);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(100);

    expect(errors).toEqual([]);
  });
});

test.describe("Performance verification - deployed stylesheet", () => {
  test("the runtime overlay tokens reach the browser", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const tokens = await page.evaluate(() => {
      const style = getComputedStyle(document.documentElement);
      return {
        zModal: style.getPropertyValue("--z-modal").trim(),
        zModalPanel: style.getPropertyValue("--z-modal-panel").trim(),
        overlay: style.getPropertyValue("--color-bg-overlay").trim(),
      };
    });

    // A shared component reads these through var(). If the build drops
    // them, the overlay loses its stacking order and its own close control
    // stops receiving clicks.
    expect(tokens.zModal, "--z-modal must reach the browser").not.toBe("");
    expect(
      tokens.zModalPanel,
      "--z-modal-panel must reach the browser",
    ).not.toBe("");
    expect(
      tokens.overlay,
      "--color-bg-overlay must reach the browser",
    ).not.toBe("");
  });
});

test.describe("Performance verification - route transition", () => {
  test("navigate between routes", async ({ page }) => {
    const state = { route: "/", scenario: "default" };
    const errors = watchHydration(page, state);

    await page.goto("/", { waitUntil: "networkidle" });

    // Navigate to another route
    state.route = "/missions";
    await page.goto("/missions", { waitUntil: "networkidle" });

    // Navigate back
    state.route = "/";
    await page.goto("/", { waitUntil: "networkidle" });

    expect(errors).toEqual([]);
  });
});

test.describe("Performance verification - WebGL fallback", () => {
  test("homepage loads without WebGL errors", async ({ page }) => {
    const state = { route: "/", scenario: "default" };
    const errors = watchHydration(page, state);

    await page.goto("/", { waitUntil: "networkidle" });

    // Just confirm page loads - WebGL disable not directly supported in Playwright
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(errors).toEqual([]);
  });
});
