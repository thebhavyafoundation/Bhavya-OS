import type { Metadata } from "next";

/**
 * The site metadata for the root layout.
 *
 * Extracted from `src/app/layout.tsx` into a plain module so it can be
 * imported by regression tests. The layout calls `next/font`, which cannot
 * load outside the Next.js build, so the layout itself is not importable in a
 * test runner.
 *
 * The `icons` entry is the fix for the only console error the production
 * homepage produced: `favicon.ico` 404. The brand's favicon already existed
 * at `public/favicon.svg`, but nothing declared it, so the browser requested
 * its default `/favicon.ico`, which does not exist.
 */
export const siteMetadata: Metadata = {
  title: "Bhavya Foundation — For People. For Nature. For Generations.",
  description:
    "Nature restored. Knowledge opened. Heritage kept. Communities led from within. A public charitable trust building for generations.",
  icons: {
    icon: "/favicon.svg",
  },
};
