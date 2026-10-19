import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, resolve } from "path";

/**
 * Brand token integrity guards.
 *
 * These exist because the defects they catch were real and invisible. A
 * `bg-accent-blue` class referenced a token defined nowhere in the repository:
 * it generated no CSS, so the element rendered unstyled, and nothing failed —
 * no type error, no build error, no test. A `var(--color-status-error,
 * #ef4444)` fallback silently masked a missing semantic token with a colour
 * from a different brand.
 *
 * Reading the canonical source and the components is the only way to catch
 * either, because both are text-level facts about names rather than types.
 */

const REPO_ROOT = resolve(__dirname, "../../../../..");
const TOKEN_SOURCE = join(
  REPO_ROOT,
  "packages/platform-ui/src/styles/tokens.css",
);
const PLATFORM_UI = join(REPO_ROOT, "packages/platform-ui/src");
const AI_INSTITUTE = join(REPO_ROOT, "apps/ai-institute/src");

const tokenSource = readFileSync(TOKEN_SOURCE, "utf-8");

/** Tokens declared inside the light `@theme` block. */
function declaredTokens(): Set<string> {
  const set = new Set<string>();
  for (const match of tokenSource.matchAll(/--color-([a-z0-9-]+)\s*:/g)) {
    set.add(`--color-${match[1]}`);
  }
  return set;
}

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (entry === "node_modules" || entry === ".next") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(tsx|ts|css)$/.test(full)) out.push(full);
  }
  return out;
}

const declared = declaredTokens();
const componentFiles = [...walk(PLATFORM_UI), ...walk(AI_INSTITUTE)]
  // This file quotes the broken patterns it forbids, so scanning itself would
  // always fail. Skip it.
  .filter((file) => !file.includes("tokens.css") && !file.endsWith(".test.ts"));

describe("canonical token source", () => {
  it("declares every status role as a complete fg/bg/border triple", () => {
    const roles = ["success", "warning", "caution", "error", "info", "neutral"];
    for (const role of roles) {
      expect(declared, `status role "${role}"`).toContain(
        `--color-status-${role}`,
      );
      expect(declared, `status role "${role}"`).toContain(
        `--color-status-${role}-fg`,
      );
      expect(declared, `status role "${role}"`).toContain(
        `--color-status-${role}-bg`,
      );
      expect(declared, `status role "${role}"`).toContain(
        `--color-status-${role}-border`,
      );
    }
  });

  it("overrides every status foreground for dark mode", () => {
    const dark = tokenSource.slice(tokenSource.indexOf(".dark {"));
    for (const role of [
      "success",
      "warning",
      "caution",
      "error",
      "info",
      "neutral",
    ]) {
      expect(
        dark,
        `dark mode must override --color-status-${role}-fg`,
      ).toContain(`--color-status-${role}-fg`);
    }
  });

  it("declares callout component tokens that resolve to semantic tokens", () => {
    for (const tone of ["note", "tip", "caution"]) {
      for (const slot of ["fg", "bg", "rule"]) {
        expect(tokenSource).toContain(`--color-callout-${tone}-${slot}`);
      }
    }
    // A component token must point at a semantic token, never a literal —
    // otherwise a palette rebalance stops reaching it.
    const calloutBlock = tokenSource.slice(
      tokenSource.indexOf("@theme inline"),
    );
    const literals = calloutBlock.match(
      /--color-callout-[a-z-]+:\s*#[0-9a-f]/gi,
    );
    expect(literals).toBeNull();
  });

  it("provides a forced-colors layer so every app inherits one", () => {
    expect(tokenSource).toContain("@media (forced-colors: active)");
    expect(tokenSource).toContain("Highlight");
  });
});

describe("components only reference tokens that exist", () => {
  it("contains no unresolvable --color-* reference", () => {
    const offenders: string[] = [];
    for (const file of componentFiles) {
      const text = readFileSync(file, "utf-8");
      for (const match of text.matchAll(/var\(\s*(--color-[a-z0-9-]+)/g)) {
        if (!declared.has(match[1])) {
          offenders.push(`${file.replace(REPO_ROOT, "")}: ${match[1]}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("contains no hardcoded hex fallback inside a token reference", () => {
    // A fallback like `var(--color-status-error, #ef4444)` hides a missing
    // semantic token behind a colour drawn from somewhere else entirely.
    const offenders: string[] = [];
    for (const file of componentFiles) {
      const text = readFileSync(file, "utf-8");
      for (const match of text.matchAll(
        /var\(\s*--color-[a-z0-9-]+\s*,\s*#[0-9a-fA-F]{3,8}\s*\)/g,
      )) {
        offenders.push(`${file.replace(REPO_ROOT, "")}: ${match[0]}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("uses no Tailwind colour utilities for palette names the theme lacks", () => {
    // `accent-blue` and friends were used across 36 files and resolved to
    // nothing. The role names that do exist are the only ones allowed.
    const offenders: string[] = [];
    const forbidden =
      /\b(?:bg|text|border|from|to|via|ring|fill|stroke)-accent-(red|yellow|blue|purple|pink|emerald|amber)\b/;
    for (const file of componentFiles) {
      const text = readFileSync(file, "utf-8");
      const lines = text.split("\n");
      lines.forEach((line, index) => {
        // Comments are allowed to name the old tokens when explaining a fix.
        if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;
        if (forbidden.test(line)) {
          offenders.push(
            `${file.replace(REPO_ROOT, "")}:${index + 1}: ${line.trim()}`,
          );
        }
      });
    }
    expect(offenders).toEqual([]);
  });
});
