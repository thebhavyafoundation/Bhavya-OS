import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "fs";
import { join, resolve } from "path";

import { siteMetadata } from "@/lib/seo/site-metadata";

/**
 * The site metadata guards the homepage's asset references.
 *
 * The only console error on the production homepage was a `favicon.ico` 404:
 * `public/favicon.svg` existed, but nothing declared it, and the browser's
 * default request went to a path with nothing behind it. A missing icon link
 * cannot fail a type check or a build, which is why this is a test rather
 * than a comment.
 */

const APP_ROOT = resolve(__dirname, "../../../..");
const publicRoot = join(APP_ROOT, "public");

describe("site metadata", () => {
  it("declares the icon that already exists at public/favicon.svg", () => {
    const icons = siteMetadata.icons;
    expect(icons).toBeDefined();

    const iconRef = typeof icons === "string"
      ? icons
      : (icons as { icon?: unknown }).icon;
    expect(iconRef).toBe("/favicon.svg");

    expect(existsSync(join(publicRoot, "favicon.svg"))).toBe(true);
  });

  it("points the icon reference at a file that is an SVG", () => {
    const svg = readFileSync(join(publicRoot, "favicon.svg"), "utf-8");
    expect(svg).toMatch(/<svg[\s>]/i);
  });

  it("still carries the canonical title and description", () => {
    expect(siteMetadata.title).toBe(
      "Bhavya Foundation — For People. For Nature. For Generations.",
    );
    expect(typeof siteMetadata.description).toBe("string");
    expect(siteMetadata.description as string).toContain("Nature restored");
  });

  it("declares the icon with a leading slash so it resolves from the site root", () => {
    const iconRef = (siteMetadata.icons as { icon?: string }).icon;
    expect(iconRef).toBeDefined();
    expect(iconRef?.startsWith("/")).toBe(true);
  });
});
