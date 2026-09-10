/**
 * Post-build fixup for GitHub Pages subdirectory deployment.
 *
 * Next.js `basePath` prefixes `_next/` assets and navigation links,
 * but does NOT prefix <link> and <meta> references to public directory files
 * (favicon.svg, brand/*, manifest.json). This script patches the generated HTML
 * so those paths resolve correctly under /Bhavya-OS/.
 *
 * Run after `next build` completes.
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const OUT_DIR = join(import.meta.dirname, "..", "out");
const PREFIX = "/Bhavya-OS";

const PUBLIC_ASSETS = [
  "/favicon.svg",
  "/brand/icon.svg",
  "/brand/apple-touch-icon.svg",
  "/brand/og-image.svg",
  "/manifest.json",
];

function patchHtmlFiles(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      patchHtmlFiles(full);
      continue;
    }
    if (extname(entry) !== ".html") continue;

    let content = readFileSync(full, "utf-8");
    const original = content;

    for (const asset of PUBLIC_ASSETS) {
      // Match: href="/brand/icon.svg" or content="/brand/og-image.svg" or src="/favicon.svg"
      // but NOT if already prefixed with /Bhavya-OS
      const escaped = asset.replace(/\//g, "\\/");
      const alreadyPrefixed = new RegExp(`"(?:href|content|src)="${PREFIX}${escaped}"`);
      if (!alreadyPrefixed.test(content)) {
        const re = new RegExp(`(href|content|src)="${escaped}"`, "g");
        content = content.replace(re, `$1="${PREFIX}${asset}"`);
      }
    }

    if (content !== original) {
      writeFileSync(full, content, "utf-8");
      console.log(`  patched: ${full.replace(OUT_DIR, "out")}`);
    }
  }
}

console.log("Patching public asset paths for GitHub Pages basePath...");
patchHtmlFiles(OUT_DIR);
console.log("Done.");
