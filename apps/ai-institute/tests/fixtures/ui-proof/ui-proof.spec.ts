import { expect, test } from "playwright/test";
import type { Page } from "playwright/test";
import type { ProofRecord } from "./proof-types";

/**
 * Runtime verification of the shared Dialog and Sheet components.
 *
 * The fixture renders the real components from @bhavya/platform-ui. Every
 * assertion below is made against an observed effect: what received focus,
 * what was clicked, what the browser computed, or what the component
 * reported. An element merely existing is never treated as a pass.
 */

interface Surface {
  key: "dialog" | "sheet";
  /** Accessible name of the trigger button. */
  triggerName: string;
  /** Accessible name of the overlay. */
  overlayName: string;
  /** aria-label of the overlay's own close control. */
  closeLabel: string;
  /** id of the focusable control inside the overlay body. */
  innerActionId: string;
  /** id of the control that opens the surface from outside its trigger. */
  programmaticToggleId: string;
  /** The Sheet keeps its panel mounted while closed; the Dialog does not. */
  staysMounted: boolean;
  /** Whether opening the surface adds an element to the document. */
  addsElement: boolean;
}

const DIALOG: Surface = {
  key: "dialog",
  triggerName: "Open Dialog",
  overlayName: "Dialog",
  closeLabel: "Close modal",
  innerActionId: "dialog-inner-action",
  programmaticToggleId: "programmatic-toggle-dialog",
  staysMounted: false,
  addsElement: true,
};

const SHEET: Surface = {
  key: "sheet",
  triggerName: "Open Sheet",
  overlayName: "Sheet",
  closeLabel: "Close sheet",
  innerActionId: "sheet-inner-action",
  programmaticToggleId: "programmatic-toggle-sheet",
  staysMounted: true,
  addsElement: false,
};

type ProofSnapshot = Pick<ProofRecord, "clicks" | "transitions">;

/** Every element that carries the dialog role, open or not. */
function rawOverlays(page: Page) {
  return page.locator('[role="dialog"]');
}

/** The overlays that are exposed to assistive technology right now. */
function liveOverlays(page: Page) {
  return page.locator('[role="dialog"]:not([aria-hidden="true"])');
}

async function readProof(page: Page): Promise<ProofSnapshot> {
  const snapshot = await page.evaluate(() => {
    const record = window.__proof;
    if (!record) return null;
    return { clicks: record.clicks, transitions: record.transitions };
  });
  expect(snapshot, "the fixture must publish its record").not.toBeNull();
  return snapshot as ProofSnapshot;
}

function triggerOf(page: Page, surface: Surface) {
  return page.getByRole("button", { name: surface.triggerName, exact: true });
}

function overlayOf(page: Page, surface: Surface) {
  return page.getByRole("dialog", { name: surface.overlayName });
}

async function expectClosed(page: Page, surface: Surface, baseline: number) {
  await expect(overlayOf(page, surface)).toHaveCount(0);
  await expect(liveOverlays(page)).toHaveCount(0);
  await expect(rawOverlays(page)).toHaveCount(baseline);
  if (surface.staysMounted) {
    await expect(rawOverlays(page)).toHaveAttribute("aria-hidden", "true");
    await expect(rawOverlays(page)).toHaveAttribute("inert", "");
  }
}

async function openSurface(page: Page, surface: Surface, baseline: number) {
  await triggerOf(page, surface).click();
  const overlay = overlayOf(page, surface);
  await expect(overlay).toBeVisible();
  await expect(liveOverlays(page)).toHaveCount(1);
  await expect(rawOverlays(page)).toHaveCount(
    baseline + (surface.addsElement ? 1 : 0),
  );
  return overlay;
}

async function bodyOverflow(page: Page) {
  return page.evaluate(() => document.body.style.overflow);
}

for (const surface of [DIALOG, SHEET]) {
  test.describe(`${surface.key} runtime behaviour`, () => {
    let baseline = 0;
    let errors: string[] = [];

    test.beforeEach(async ({ page }) => {
      errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      await page.goto("/index.html", { waitUntil: "networkidle" });
      baseline = await rawOverlays(page).count();
    });

    test("the trigger is reachable with the keyboard", async ({ page }) => {
      const trigger = triggerOf(page, surface);
      await expect(trigger).toHaveAttribute("type", "button");
      await expect(trigger).toHaveAttribute("aria-expanded", "false");

      let reached = false;
      for (let press = 0; press < 12 && !reached; press += 1) {
        await page.keyboard.press("Tab");
        reached = await trigger.evaluate((el) => el === document.activeElement);
      }
      expect(reached, "the trigger must be reachable by pressing Tab").toBe(
        true,
      );
      await expect(trigger).toBeFocused();
    });

    test("opens by pointer and reports the right role and name", async ({
      page,
    }) => {
      const trigger = triggerOf(page, surface);
      const overlay = await openSurface(page, surface, baseline);

      await expect(overlay).toHaveAttribute("aria-modal", "true");
      await expect(overlay).toHaveAttribute("role", "dialog");
      await expect(overlay).toContainText("body content");
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
    });

    test("opens from the keyboard", async ({ page }) => {
      const trigger = triggerOf(page, surface);
      await trigger.focus();
      await page.keyboard.press("Enter");
      await expect(overlayOf(page, surface)).toBeVisible();
      await page.keyboard.press("Escape");
      await expectClosed(page, surface, baseline);

      await trigger.focus();
      await page.keyboard.press("Space");
      await expect(overlayOf(page, surface)).toBeVisible();
    });

    test("moves focus into the overlay and keeps it there", async ({
      page,
    }) => {
      const overlay = await openSurface(page, surface, baseline);
      const close = overlay.getByRole("button", { name: surface.closeLabel });
      const inner = page.locator(`#${surface.innerActionId}`);

      await expect(close).toBeFocused();
      await expect(inner).not.toBeFocused();

      await page.keyboard.press("Tab");
      await expect(inner).toBeFocused();

      await page.keyboard.press("Shift+Tab");
      await expect(close).toBeFocused();
    });

    test("traps Tab and Shift+Tab inside the overlay", async ({ page }) => {
      const overlay = await openSurface(page, surface, baseline);
      const close = overlay.getByRole("button", { name: surface.closeLabel });
      const inner = page.locator(`#${surface.innerActionId}`);

      await inner.focus();
      await page.keyboard.press("Tab");
      await expect(
        close,
        "Tab from the last control must wrap to the first one",
      ).toBeFocused();

      await page.keyboard.press("Shift+Tab");
      await expect(
        inner,
        "Shift+Tab from the first control must wrap to the last one",
      ).toBeFocused();
    });

    test("the background cannot be operated while the overlay is open", async ({
      page,
    }) => {
      await openSurface(page, surface, baseline);

      const background = page.locator("#background-action");
      const box = await background.boundingBox();
      expect(box).not.toBeNull();
      await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);

      const proof = await readProof(page);
      expect(
        proof.clicks.filter((click) => click.id === "background-action"),
        "the control behind the overlay must not receive the click",
      ).toHaveLength(0);
      expect(
        proof.clicks.some((click) => click.id === "nav-cta"),
        "the navigation must not receive the click either",
      ).toBe(false);
    });

    test("Escape closes the overlay", async ({ page }) => {
      await openSurface(page, surface, baseline);
      await page.keyboard.press("Escape");
      await expectClosed(page, surface, baseline);
    });

    test("the close control closes the overlay", async ({ page }) => {
      const overlay = await openSurface(page, surface, baseline);
      await overlay.getByRole("button", { name: surface.closeLabel }).click();
      await expectClosed(page, surface, baseline);
    });

    test("focus returns to the trigger after closing", async ({ page }) => {
      const trigger = triggerOf(page, surface);
      await trigger.click();
      await expect(overlayOf(page, surface)).toBeVisible();
      await page.keyboard.press("Escape");
      await expectClosed(page, surface, baseline);
      await expect(trigger).toBeFocused();
    });

    test("repeated open and close leaves one overlay and one handler", async ({
      page,
    }) => {
      const trigger = triggerOf(page, surface);
      const before = await readProof(page);

      for (let round = 0; round < 5; round += 1) {
        await trigger.click();
        await expect(liveOverlays(page)).toHaveCount(1);
        await expect(overlayOf(page, surface)).toBeVisible();
        await page.keyboard.press("Escape");
        await expectClosed(page, surface, baseline);
      }

      const after = await readProof(page);
      const added = after.transitions.slice(before.transitions.length);
      const expected = Array.from({ length: 5 }, () => [
        { surface: surface.key, open: true },
        { surface: surface.key, open: false },
      ]).flat();
      expect(
        added,
        "one state change per action, no duplicated handlers",
      ).toEqual(expected);
    });

    test("the body scroll lock is applied and released", async ({ page }) => {
      await openSurface(page, surface, baseline);
      await expect
        .poll(() => bodyOverflow(page), {
          message: "the page must not scroll while the overlay is open",
        })
        .toBe("hidden");

      await page.keyboard.press("Escape");
      await expect
        .poll(() => bodyOverflow(page), {
          message: "the scroll lock must be released when the overlay closes",
        })
        .toBe("");
    });

    test("unmounting while open leaves no scroll lock and no overlay", async ({
      page,
    }) => {
      await openSurface(page, surface, baseline);
      await expect.poll(() => bodyOverflow(page)).toBe("hidden");

      await page.evaluate(() => window.__proof?.unmount());

      await expect(rawOverlays(page)).toHaveCount(0);
      await expect
        .poll(() => bodyOverflow(page), {
          message: "unmounting must not leave the page scroll locked",
        })
        .toBe("");
    });

    test("the controlled state drives the surface", async ({ page }) => {
      const toggle = page.locator(`#${surface.programmaticToggleId}`);
      const before = await readProof(page);

      // The toggle is dispatched rather than clicked. While the surface is
      // open the overlay covers the page - that is the behaviour another
      // test in this file asserts - so a pointer click on a background
      // control is impossible by design. Dispatching the event still runs
      // the component's own handler, so the state path under test is the
      // real one.
      await toggle.dispatchEvent("click");
      await expect(overlayOf(page, surface)).toBeVisible();

      const opened = await readProof(page);
      expect(opened.transitions.slice(before.transitions.length)).toEqual([
        { surface: surface.key, open: true },
      ]);

      await toggle.dispatchEvent("click");
      await expectClosed(page, surface, baseline);

      const closed = await readProof(page);
      expect(closed.transitions.slice(before.transitions.length)).toEqual([
        { surface: surface.key, open: true },
        { surface: surface.key, open: false },
      ]);
    });

    test("the overlay sits above the fixed navigation", async ({ page }) => {
      const tokens = await page.evaluate(() => {
        const style = getComputedStyle(document.documentElement);
        return {
          zModal: style.getPropertyValue("--z-modal").trim(),
          zModalPanel: style.getPropertyValue("--z-modal-panel").trim(),
          overlay: style.getPropertyValue("--color-bg-overlay").trim(),
        };
      });
      expect(tokens.zModal, "--z-modal must reach the browser").not.toBe("");
      expect(
        tokens.zModalPanel,
        "--z-modal-panel must reach the browser",
      ).not.toBe("");
      expect(
        tokens.overlay,
        "--color-bg-overlay must reach the browser",
      ).not.toBe("");

      await openSurface(page, surface, baseline);

      const navZ = await page
        .locator("#proof-nav")
        .evaluate((el) => getComputedStyle(el).zIndex);
      // The Dialog stacks its backdrop, the Sheet stacks its panel, so the
      // layer that carries the stacking order is read from whichever of the
      // two actually holds a z-index.
      const overlayZ = await liveOverlays(page).evaluate((el) => {
        const own = getComputedStyle(el).zIndex;
        if (own && own !== "auto") return own;
        const parent = el.parentElement;
        return parent ? getComputedStyle(parent).zIndex : own;
      });
      expect(
        Number(overlayZ),
        "the overlay must sit above the navigation bar",
      ).toBeGreaterThan(Number(navZ));
    });

    test("the close control is not intercepted by the navigation", async ({
      page,
    }) => {
      await openSurface(page, surface, baseline);

      const close = page.locator(`[aria-label="${surface.closeLabel}"]`);
      await close.click();

      const proof = await readProof(page);
      expect(
        proof.clicks.some((click) => click.id === "nav-cta"),
        "the navigation must not swallow the click meant for the close control",
      ).toBe(false);
      expect(
        proof.clicks.at(-1)?.label,
        "the close control must be the element that received the click",
      ).toBe(surface.closeLabel);
      await expectClosed(page, surface, baseline);
    });

    test("the overlay stays usable on a mobile viewport", async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.reload({ waitUntil: "networkidle" });
      const mobileBaseline = await rawOverlays(page).count();

      const overlay = await openSurface(page, surface, mobileBaseline);
      const box = await overlay.boundingBox();
      expect(box).not.toBeNull();
      expect(
        box!.x + box!.width,
        "the overlay must fit the viewport width",
      ).toBeLessThanOrEqual(391);

      await overlay.getByRole("button", { name: surface.closeLabel }).click();
      await expectClosed(page, surface, mobileBaseline);
    });

    test("the overlay stays functional under reduced motion", async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.reload({ waitUntil: "networkidle" });
      const reducedBaseline = await rawOverlays(page).count();

      const overlay = await openSurface(page, surface, reducedBaseline);
      await expect(overlay).toBeVisible();

      if (surface.staysMounted) {
        const motion = await liveOverlays(page).evaluate((el) => {
          const computed = getComputedStyle(el);
          return {
            duration: computed.transitionDuration,
            inline: el.style.transition,
          };
        });

        // The component must disable its own transition when reduced motion
        // is asked for. This is the component's own declaration and is not
        // affected by anything a stylesheet does.
        expect(
          motion.inline,
          "the component must disable its own transition under reduced motion",
        ).toBe("none");

        // The computed duration is not literally "0s". The framework's own
        // reduced-motion rules force every transition to 0.01ms with
        // !important, which overrides the component's declaration. The
        // requirement is that no transition can play, not that the browser
        // prints a particular string, so the duration is compared as a
        // number against a threshold that no animation can cross.
        const durations = motion.duration
          .split(",")
          .map((value) => Number.parseFloat(value))
          .filter((value) => Number.isFinite(value));
        for (const duration of durations) {
          expect(
            duration,
            "reduced motion must leave no animatable transition",
          ).toBeLessThanOrEqual(0.00002);
        }
      }

      await page.keyboard.press("Escape");
      await expectClosed(page, surface, reducedBaseline);
    });

    test("the fixture runs without console or page errors", async ({
      page,
    }) => {
      await openSurface(page, surface, baseline);
      await page.keyboard.press("Escape");
      await expectClosed(page, surface, baseline);
      expect(errors).toEqual([]);
    });
  });
}
