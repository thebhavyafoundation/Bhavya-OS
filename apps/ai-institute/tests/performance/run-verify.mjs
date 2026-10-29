import { chromium } from "playwright";

const BASE_URL = "https://bhavya-foundation.thebhavyafoundation.workers.dev";

async function main() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    baseURL: BASE_URL,
    ignoreHTTPSErrors: true,
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const pageErrors = [];
  const consoleErrors = [];
  const failedRequests = [];

  page.on("pageerror", (err) => pageErrors.push(err.message));
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("requestfailed", (req) => {
    if (!req.url().includes("favicon")) {
      failedRequests.push(req.method() + " " + req.url());
    }
  });

  // Long task detection via PerformanceObserver
  await page.evaluate(() => {
    return new Promise((resolve) => {
      if (typeof PerformanceObserver === "undefined") {
        resolve();
        return;
      }
      const po = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "longtask") {
            (window).__longTasks = (window).__longTasks || [];
            (window).__longTasks.push({
              name: entry.name,
              duration: entry.duration,
              startTime: entry.startTime,
            });
          }
        }
        po.observe({ entryTypes: ["longtask"] });
        resolve();
      });
    });
  });

  // TEST 1: Homepage load
  console.log("=== TEST 1: Homepage load ===");
  await page.goto("/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "tests/performance/screenshots/homepage-loaded.png" });

  // TEST 2: Scroll homepage
  console.log("=== TEST 2: Homepage scroll ===");
  await page.evaluate(() => {
    return new Promise((resolve) => {
      const target = document.body.scrollHeight - window.innerHeight;
      let y = 0;
      const step = 300;
      function stepScroll() {
        y = Math.min(y + step, target);
        window.scrollTo(0, y);
        if (y < target) requestAnimationFrame(stepScroll);
        else resolve();
      }
      stepScroll();
    });
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: "tests/performance/screenshots/homepage-scrolled.png" });

  // TEST 3: Repeated nav open/close x10
  console.log("=== TEST 3: Nav open/close ×10 ===");
  const menuTrigger = page.locator("button.nav-mobile-trigger");
  const menuDrawer = page.locator(".mobile-menu-drawer");

  let navTriggerExists = false;
  try {
    navTriggerExists = await menuTrigger.isVisible();
  } catch (e) {
    navTriggerExists = false;
  }
  console.log("Desktop menu trigger visible: " + navTriggerExists);

  const navTimes = [];
  if (navTriggerExists) {
    for (let i = 0; i < 10; i++) {
      const t0 = Date.now();
      await menuTrigger.click();
      await menuDrawer.waitFor({ state: "visible", timeout: 10000 });
      await page.waitForTimeout(300);
      const openMs = Date.now() - t0;

      const t1 = Date.now();
      await menuTrigger.click();
      await menuDrawer.waitFor({ state: "hidden", timeout: 10000 });
      const closeMs = Date.now() - t1;
      navTimes.push({ open: openMs, close: closeMs });
      console.log("  Open/Close #" + (i + 1) + ": open=" + openMs + "ms close=" + closeMs + "ms");
    }
  }

  const domAfter = await page.evaluate(() => document.querySelectorAll("*").length);
  const canvasAfter = await page.evaluate(() => document.querySelectorAll("canvas").length);
  console.log("DOM after 10 nav cycles: " + domAfter + ", Canvas: " + canvasAfter);

  // TEST 4: Repeated hover on nav links
  console.log("=== TEST 4: Repeated hover on nav links ===");
  const navLinks = page.locator('nav[aria-label="Primary navigation"] a');
  const linkCount = await navLinks.count();
  console.log("Primary nav links: " + linkCount);
  for (let i = 0; i < Math.min(linkCount, 5); i++) {
    const link = navLinks.nth(i);
    const href = await link.getAttribute("href");
    if (!href || href === "/" || href === "#") continue;
    for (let j = 0; j < 3; j++) {
      await link.hover();
      await page.waitForTimeout(200);
      await page.mouse.move(0, 0);
      await page.waitForTimeout(100);
    }
    console.log("  Hovered " + href + " 3x");
  }

  // TEST 5: Route transition
  console.log("=== TEST 5: Route transitions ===");
  await page.goto("/missions", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.goto("/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2000);

  // TEST 6: Reduced motion
  console.log("=== TEST 6: Reduced motion ===");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: "tests/performance/screenshots/reduced-motion-home.png" });

  // Collect long tasks
  const longTasks = await page.evaluate(() => {
    return (window).__longTasks || [];
  });

  console.log("\n=== SUMMARY ===");
  console.log("Page errors:", JSON.stringify(pageErrors));
  console.log("Console errors:", JSON.stringify(consoleErrors));
  console.log("Failed requests:", JSON.stringify(failedRequests));
  console.log("Long tasks:", JSON.stringify(longTasks));
  console.log("Nav times:", JSON.stringify(navTimes));
  console.log("DOM after nav cycles: " + domAfter + ", Canvas: " + canvasAfter);

  const allErrors = pageErrors.concat(consoleErrors);
  const b2Errors = allErrors.filter(function (e) {
    return e.includes("your-bucket-name.backblazeb2.com") || e.includes("B2 health check");
  });
  const nonB2Errors = allErrors.filter(function (e) {
    return !e.includes("your-bucket-name.backblazeb2.com") && !e.includes("B2 health check");
  });

  console.log("\nTotal errors: " + allErrors.length);
  console.log("  B2/CSP errors: " + b2Errors.length);
  console.log("  Non-B2 errors: " + nonB2Errors.length);
  console.log("Non-B2 errors detail:", JSON.stringify(nonB2Errors.slice(0, 10)));

  await browser.close();

  process.exit(nonB2Errors.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
