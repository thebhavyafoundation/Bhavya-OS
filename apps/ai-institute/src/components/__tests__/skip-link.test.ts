import { describe, expect, it, vi } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "fs";
import { join } from "path";

import { SkipLink } from "@/components/SkipLink";

// Render the real root layout with the font loaders mocked. The point is not
// to re-test the fonts; the point is to verify that the skip link is the
// first focusable element before the header, which is an accessibility
// contract, not a source-shape preference.
vi.mock("next/font/google", () => ({
  Inter: () => ({ variable: "--font-sans", className: "font-sans" }),
  Playfair_Display: () => ({ variable: "--font-display", className: "font-display" }),
}));

vi.mock("next/font/google/shared-font-utils.js", () => ({}));

import RootLayout from "@/app/layout";

/**
 * The skip link guards WCAG 2.4.1 (Bypass Blocks).
 *
 * The styles for it existed in `globals.css` while the link itself was never
 * rendered, so the class was dead code and the behaviour was missing on every
 * page. A missing element cannot fail a type check or a build, which is why
 * this is a regression test rather than a comment.
 */

const SRC_ROOT = join(__dirname, "../..");
const globalStyles = readFileSync(join(SRC_ROOT, "app/globals.css"), "utf-8");

describe("skip link", () => {
  it("renders a link to the main content", () => {
    const markup = renderToStaticMarkup(createElement(SkipLink));

    expect(markup).toContain('href="#main-content"');
    expect(markup).toContain('class="skip-link"');
    expect(markup).toContain("Skip to content");
  });

  it("renders the link before the site's navigation in the root layout", () => {
    const markup = renderToStaticMarkup(
      createElement(RootLayout, { children: createElement("p", null, "content") }),
    );

    const skipLinkAt = markup.indexOf('class="skip-link"');
    const navAt = markup.indexOf("<nav");
    const mainAt = markup.indexOf('<main id="main-content">');

    expect(skipLinkAt, "root layout renders the skip link").toBeGreaterThan(-1);
    expect(navAt, "root layout renders the site navigation").toBeGreaterThan(-1);
    expect(mainAt, "root layout renders the main content landmark").toBeGreaterThan(-1);
    expect(skipLinkAt).toBeLessThan(navAt);
    expect(skipLinkAt).toBeLessThan(mainAt);
  });

  it("points at an element that exists", () => {
    const markup = renderToStaticMarkup(
      createElement(RootLayout, { children: createElement("p", { id: "main-content-child" }, "content") }),
    );
    expect(markup).toMatch(/<main\s+id="main-content"/);
  });

  it("is revealed when it takes focus", () => {
    // The link is positioned off-screen until focused; without the focus rule
    // it would never become visible.
    expect(globalStyles).toMatch(/\.skip-link\s*\{/);
    expect(globalStyles).toMatch(/\.skip-link:focus\s*\{/);
  });
});
