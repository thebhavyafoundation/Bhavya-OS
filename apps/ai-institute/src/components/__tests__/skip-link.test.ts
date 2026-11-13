import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "fs";
import { join } from "path";

import { SkipLink } from "@/components/SkipLink";

/**
 * The skip link guards WCAG 2.4.1 (Bypass Blocks).
 *
 * The styles for it existed in `globals.css` while the link itself was never
 * rendered, so the class was dead code and the behaviour was missing on every
 * page. A missing element cannot fail a type check or a build, which is why
 * this is a regression test rather than a comment.
 */

const SRC_ROOT = join(__dirname, "../..");
const layoutSource = readFileSync(join(SRC_ROOT, "app/layout.tsx"), "utf-8");
const globalStyles = readFileSync(join(SRC_ROOT, "app/globals.css"), "utf-8");

describe("skip link", () => {
  it("renders a link to the main content", () => {
    const markup = renderToStaticMarkup(createElement(SkipLink));

    expect(markup).toContain('href="#main-content"');
    expect(markup).toContain('class="skip-link"');
    expect(markup).toContain("Skip to content");
  });

  it("renders the link before the site's navigation", () => {
    const skipLinkAt = layoutSource.indexOf("<SkipLink");
    const headerAt = layoutSource.indexOf("<SiteHeader");

    expect(skipLinkAt).toBeGreaterThan(-1);
    expect(headerAt).toBeGreaterThan(-1);
    expect(skipLinkAt).toBeLessThan(headerAt);
  });

  it("points at an element that exists", () => {
    // A skip link to a missing target does nothing when activated.
    expect(layoutSource).toMatch(/<main\s+id="main-content"/);
  });

  it("is revealed when it takes focus", () => {
    // The link is positioned off-screen until focused; without the focus rule
    // it would never become visible.
    expect(globalStyles).toMatch(/\.skip-link\s*\{/);
    expect(globalStyles).toMatch(/\.skip-link:focus\s*\{/);
  });
});
