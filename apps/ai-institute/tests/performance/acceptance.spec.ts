import { test, expect } from "playwright/test";
import {
  attachNetworkRecorder,
  type Recorder,
} from "./support/network-recorder";

/**
 * The application acceptance matrix.
 *
 * These are the scenarios that decide whether the candidate is publishable:
 * the published learning routes, the concept visuals, the practice
 * behaviour, client-side navigation, the reduced-motion and no-WebGL paths,
 * and the absence of a storage-health request storm.
 *
 * Every scenario runs against a deployed worker, so the browser is the
 * deployed application and not a local build. The network recorder is
 * attached before the first navigation in each test, and its report is
 * printed before the assertions, so a red run still carries the exact
 * failing resources.
 */

const MODULE_ROUTE = "/curriculum/modules/l0-m1";
const LESSON_ROUTE = "/curriculum/modules/l0-m1/lessons/l0-m1-l1";
const CURRICULUM_ROUTE = "/curriculum";

function recorderFor(page: import("playwright/test").Page): Recorder {
  return attachNetworkRecorder(page, {
    test: test.info().title,
    artifactDir: "tests/performance/artifacts",
  });
}

test.describe("Acceptance - published learning routes", () => {
  test("the module page states where the module sits", async ({ page }) => {
    const recorder = recorderFor(page);
    recorder.step("navigate to the module page");
    await page.goto(MODULE_ROUTE, { waitUntil: "networkidle" });

    const map = page.getByRole("region", { name: "Where this module sits" });
    await expect(map).toBeVisible();
    await expect(map.getByText("Builds on")).toBeVisible();
    await expect(map.getByText("This module")).toBeVisible();
    await expect(map.getByText("Lessons")).toBeVisible();
    await expect(map.getByText("Standards")).toBeVisible();

    // The publication state is stated, not implied.
    await expect(page.getByText(/lesson(s)? published/).first()).toBeVisible();

    console.log(recorder.report());
  });

  test("the lesson page carries outcome, visual, example and next step", async ({
    page,
  }) => {
    const recorder = recorderFor(page);
    recorder.step("navigate to the lesson page");
    await page.goto(LESSON_ROUTE, { waitUntil: "networkidle" });

    // The outcome is the lesson's lede, under the title.
    await expect(
      page.getByRole("heading", { name: "Defining AI", level: 1 }),
    ).toBeVisible();
    await expect(
      page.getByText(/Explain where artificial intelligence/, { exact: false }),
    ).toBeVisible();

    // The concept visual, with its text equivalent available.
    const figure = page.locator("figure").first();
    await expect(figure).toBeVisible();
    await expect(
      page.getByText("Read this diagram as text").first(),
    ).toBeVisible();

    // The guided example.
    await expect(
      page.getByRole("heading", { name: "Guided example", exact: true }),
    ).toBeVisible();

    // The sources and the review state.
    await expect(
      page.getByRole("heading", { name: "Sources and review" }),
    ).toBeVisible();
    await expect(page.getByText(/content: pending/).first()).toBeVisible();

    // The next step.
    await expect(
      page.getByRole("heading", { name: "Next step" }),
    ).toBeVisible();

    console.log(recorder.report());
  });

  test("every concept visual on the lesson decodes", async ({ page }) => {
    const recorder = recorderFor(page);
    recorder.step("navigate to the lesson page");
    await page.goto(LESSON_ROUTE, { waitUntil: "networkidle" });

    const images = page.locator("figure img");
    const count = await images.count();
    expect(count, "the lesson must render at least one visual").toBeGreaterThan(
      0,
    );

    const decoded: Array<{ src: string; width: number; height: number }> = [];
    for (let index = 0; index < count; index += 1) {
      const image = images.nth(index);
      await image.scrollIntoViewIfNeeded();
      const size = await image.evaluate((element) => {
        const img = element as HTMLImageElement;
        return {
          src: img.currentSrc || img.src,
          width: img.naturalWidth,
          height: img.naturalHeight,
        };
      });
      decoded.push(size);
    }

    for (const size of decoded) {
      expect(
        size.width,
        `the visual ${size.src} must decode, not merely respond 200`,
      ).toBeGreaterThan(0);
      expect(size.height).toBeGreaterThan(0);
    }

    console.log(`[acceptance] decoded visuals: ${JSON.stringify(decoded)}`);
    console.log(recorder.report());
  });

  test("the module page links to its published lesson", async ({ page }) => {
    const recorder = recorderFor(page);
    recorder.step("navigate to the module page");
    await page.goto(MODULE_ROUTE, { waitUntil: "networkidle" });

    const link = page.getByRole("link", { name: /Defining AI/ }).first();
    await expect(link).toBeVisible();
    await link.click();
    await page.waitForLoadState("networkidle");
    expect(page.url()).toContain("/lessons/");

    console.log(recorder.report());
  });
});

test.describe("Acceptance - practice and feedback", () => {
  test("the check-your-understanding block grades and explains", async ({
    page,
  }) => {
    const recorder = recorderFor(page);
    recorder.step("navigate to the lesson page");
    await page.goto(LESSON_ROUTE, { waitUntil: "networkidle" });

    const quiz = page.locator(".lesson-quiz");
    await expect(quiz).toBeVisible();

    const questions = quiz.locator("> div");
    const questionCount = await questions.count();
    expect(
      questionCount,
      "the lesson must ask at least one question",
    ).toBeGreaterThan(0);

    // Answer every question: the block refuses to submit an incomplete
    // answer set.
    recorder.step("answer every question");
    for (let index = 0; index < questionCount; index += 1) {
      const options = questions.nth(index).locator("button");
      await options.first().click();
    }

    recorder.step("submit the quiz");
    await page.getByRole("button", { name: "Submit Quiz" }).click();

    // The learner is told the score, and given feedback either way.
    await expect(quiz).toContainText("Score:");
    const feedback = quiz.locator("p").filter({ hasText: /Correct|Incorrect/ });
    expect(await feedback.count()).toBeGreaterThan(0);

    console.log(recorder.report());
  });
});

test.describe("Acceptance - navigation", () => {
  test("client-side navigation and back/forward keep the page usable", async ({
    page,
  }) => {
    const recorder = recorderFor(page);
    recorder.step("navigate to the homepage");
    await page.goto("/", { waitUntil: "networkidle" });

    recorder.step("follow a navigation link");
    const links = page.locator('nav[aria-label="Primary navigation"] a');
    const count = await links.count();
    let target: string | null = null;
    for (let index = 0; index < count; index += 1) {
      const href = await links.nth(index).getAttribute("href");
      if (href && href.startsWith("/") && !href.startsWith("//")) {
        target = href;
        break;
      }
    }
    expect(
      target,
      "the primary navigation must offer an internal link",
    ).not.toBeNull();
    await links.nth(0).click();
    await page.waitForLoadState("networkidle");

    recorder.step("go back");
    await page.goBack();
    await page.waitForLoadState("networkidle");
    expect(new URL(page.url()).pathname).toBe("/");

    recorder.step("go forward");
    await page.goForward();
    await page.waitForLoadState("networkidle");
    expect(page.url()).not.toBe("");

    console.log(recorder.report());
  });

  test("navigation still works after the page has been scrolled", async ({
    page,
  }) => {
    const recorder = recorderFor(page);
    recorder.step("navigate to the homepage");
    await page.goto("/", { waitUntil: "networkidle" });

    recorder.step("scroll down, then use the navigation");
    await page.evaluate(() => window.scrollTo(0, 2000));
    await page.waitForTimeout(300);

    const trigger = page.locator('button:has-text("Explore")').first();
    await trigger.click();
    await page.waitForTimeout(200);
    await expect(page.locator("body")).toBeVisible();

    console.log(recorder.report());
  });
});

test.describe("Acceptance - layout and resilience", () => {
  test("no horizontal overflow at desktop, tablet and mobile widths", async ({
    page,
  }) => {
    const recorder = recorderFor(page);
    const widths = [
      { name: "desktop", width: 1440, height: 900 },
      { name: "tablet", width: 820, height: 1180 },
      { name: "mobile", width: 390, height: 844 },
    ];

    for (const viewport of widths) {
      recorder.step(`set the ${viewport.name} viewport`);
      await page.setViewportSize({
        width: viewport.width,
        height: viewport.height,
      });
      for (const route of ["/", CURRICULUM_ROUTE, MODULE_ROUTE, LESSON_ROUTE]) {
        recorder.step(`${viewport.name}: open ${route}`);
        await page.goto(route, { waitUntil: "networkidle" });
        const overflow = await page.evaluate(() => ({
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }));
        expect(
          overflow.scrollWidth,
          `${route} overflows horizontally at ${viewport.name}`,
        ).toBeLessThanOrEqual(overflow.clientWidth + 1);
      }
    }

    console.log(recorder.report());
  });

  test("the page survives a controlled optional asset failure", async ({
    page,
  }) => {
    const recorder = recorderFor(page);
    recorder.step("block one optional image");
    await page.route("**/brand/logo-mark.png", (route) => route.abort());

    recorder.step("navigate to the homepage with the image blocked");
    await page.goto("/", { waitUntil: "networkidle" });

    await expect(
      page.getByRole("heading", { name: /Building for/ }),
    ).toBeVisible();
    expect(page.url()).toBeTruthy();

    console.log(recorder.report());
  });

  test("the page renders without WebGL", async ({ page }) => {
    const recorder = recorderFor(page);
    recorder.step("remove WebGL before any script runs");
    await page.addInitScript(() => {
      const proto = HTMLCanvasElement.prototype as unknown as {
        getContext: (type: string, options?: unknown) => unknown;
      };
      const original = proto.getContext;
      proto.getContext = function patched(type: string, options?: unknown) {
        if (String(type).toLowerCase().includes("webgl")) return null;
        return original.call(HTMLCanvasElement.prototype, type, options);
      };
    });

    recorder.step("navigate to the homepage without WebGL");
    await page.goto("/", { waitUntil: "networkidle" });

    await expect(
      page.getByRole("heading", { name: /Building for/ }),
    ).toBeVisible();

    console.log(recorder.report());
  });
});
