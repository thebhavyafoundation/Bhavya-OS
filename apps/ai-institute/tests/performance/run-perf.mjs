import { chromium } from "playwright";

const BASE_URL = "https://bhavya-foundation.thebhavyafoundation.workers.dev";
const results = {
  errors: [],
  consoleErrors: [],
  failedRequests: [],
  logs: [],
};

function log(...args) {
  results.logs.push(args.join(" "));
  console.log(...args);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    baseURL: BASE_URL,
    ignoreHTTPSErrors: true,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  page.on("pageerror", (err) => results.errors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") results.consoleErrors.push(msg.text());
  });
  page.on("requestfailed", (req) => {
    if (!req.url().includes("favicon")) {
      results.failedRequests.push(`${req.method()} ${req.url()}`);
    }
  });

  // === TEST 1: Homepage scroll ===
  log("\n=== TEST 1: Homepage scroll ===");
  await page.goto("/", { waitUntil: "networkidle", timeout: 60000 });
  await page.screenshot({ path: "tests/performance/screenshots/home-top.png" });

  const scrollStart = Date.now();
  await page.evaluate(() => {
    return new Promise((resolve) => {
      const targetY = document.body.scrollHeight - window.innerHeight;
      let currentY = 0;
      const step = 400;
      function scrollStep() {
        currentY = Math.min(currentY + step, targetY);
        window.scrollTo(0, currentY);
        if (currentY < targetY) requestAnimationFrame(scrollStep);
        else resolve();
      }
      scrollStep();
    });
  });
  const scrollDuration = Date.now() - scrollStart;
  log(`Scroll duration: ${scrollDuration}ms`);

  await page.screenshot({ path: "tests/performance/screenshots/home-after-scroll.png" });

  let clsValue = -1;
  try {
    clsValue = await page.evaluate(() => {
      return new Promise((resolve) => {
        if (typeof PerformanceObserver === "undefined") { resolve(-1); return; }
        let cls = 0;
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            const e = entry;
            if (e.entryType === "layout-shift" && !e.hadRecentInput) cls += e.value;
          }
        });
        observer.observe({ entryTypes: ["layout-shift"] });
        setTimeout(() => resolve(cls), 3000);
      });
    });
  } catch { clsValue = -1; }
  log(`CLS: ${clsValue}`);

  // Navigation interaction: click through top nav links 10 times each
  log("\n=== TEST: Navigation interaction (desktop nav) ===");
  const primaryNav = page.locator('nav[aria-label="Primary navigation"]');
  const navLinks = primaryNav.locator("a");
  const navTimes = [];
  const linkCount = await navLinks.count();
  log(`Primary nav links: ${linkCount}`);

  for (let i = 0; i < Math.min(linkCount, 6); i++) {
    const link = navLinks.nth(i);
    const href = await link.getAttribute("href");
    if (!href || href === "/" || href === "#") continue;
    const t0 = Date.now();
    try {
      await link.click();
      await page.waitForLoadState("networkidle", { timeout: 30000 });
    } catch (e) {
      log(`  Click failed for ${href}: ${e.message}`);
      await page.goto("/", { waitUntil: "networkidle", timeout: 30000 });
      continue;
    }
    const loadTime = Date.now() - t0;
    navTimes.push({ link: href, ms: loadTime });
    log(`  ${href}: ${loadTime}ms`);
    // Go back to homepage
    await page.goto("/", { waitUntil: "networkidle", timeout: 60000 });
  }

  const domBefore = await page.evaluate(() => document.querySelectorAll("*").length);
  const canvasBefore = await page.evaluate(() => document.querySelectorAll("canvas").length);
  log(`DOM elements: ${domBefore}, Canvas: ${canvasBefore}`);

  // === TEST 2: Mission page with ParticleField ===
  log("\n=== TEST 2: Mission page with ParticleField ===");
  await page.goto("/missions", { waitUntil: "networkidle", timeout: 60000 });
  const canvasCount = await page.evaluate(() => document.querySelectorAll("canvas").length);
  log(`Mission page canvas count: ${canvasCount}`);

  await page.evaluate(() => {
    return new Promise((resolve) => {
      window.scrollTo(0, document.body.scrollHeight);
      resolve();
    });
  });
  await page.waitForTimeout(500);
  const canvasCountAfter = await page.evaluate(() => document.querySelectorAll("canvas").length);
  log(`Mission page canvas count after scroll: ${canvasCountAfter}`);

  // === TEST 3: Route transition ===
  log("\n=== TEST 3: Route transition ===");
  await page.goto("/", { waitUntil: "networkidle", timeout: 60000 });
  await page.goto("/missions", { waitUntil: "networkidle", timeout: 60000 });
  await page.goto("/", { waitUntil: "networkidle", timeout: 60000 });

  // === TEST 4: Reduced motion ===
  log("\n=== TEST 4: Reduced motion ===");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle", timeout: 60000 });
  await page.evaluate(() => {
    return new Promise((resolve) => {
      window.scrollTo(0, document.body.scrollHeight);
      resolve();
    });
  });
  await page.screenshot({ path: "tests/performance/screenshots/reduced-motion-home.png" });
  await page.goto("/missions", { waitUntil: "networkidle", timeout: 60000 });
  await page.screenshot({ path: "tests/performance/screenshots/reduced-motion-mission.png" });

  // === Summary ===
  log("\n=== SUMMARY ===");
  log(`Errors:`, JSON.stringify(results.errors));
  log(`Console errors:`, JSON.stringify(results.consoleErrors));
  log(`Failed requests:`, JSON.stringify(results.failedRequests));
  log(`Scroll duration: ${scrollDuration}ms`);
  log(`CLS: ${clsValue}`);
  log(`DOM elements: ${domBefore}, Canvas elements: ${canvasBefore}`);
  log(`Nav times:`, JSON.stringify(navTimes));

  const allErrors = [...results.errors, ...results.consoleErrors];
  const allFailed = results.failedRequests.filter((r) => !r.includes("favicon"));

  log(`\nTotal errors: ${allErrors.length}`);
  log(`Total failed requests: ${allFailed.length}`);

  await browser.close();

  if (allErrors.length > 0 || allFailed.length > 0) {
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
