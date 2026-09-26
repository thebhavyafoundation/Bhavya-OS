import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { isApprovedNumber } from "../claims";

// Marketing impact-stat patterns banned by spec D1.
const BANNED = [
  /\b\d[\d,.]*\s*\+\s*(years|members|students|learners|volunteers|donors|trees|villages|families|cities|events|articles|courses|schools|partners|contributors)\b/i,
  /\b(Over|More than|Up to)\s+\d[\d,.]*\s*\+?\s*(years|people|students|members|trees|families)\b/i,
  // Stat-chip declarations: value: "8+" / value: "10K+" (homepage-story style)
  /value:\s*"\d[\d,.]*[KkMm]?\+"/,
];

// Structural/factual contexts that are NOT impact stats (matched against
// surrounding text, not just the matched substring).
const ALLOW = [
  /Grade \d+\+/, // audience band, e.g. "Grade 9+ learners"
  /gaps? of \d+\+/, // factual content, e.g. AI-winter gaps of 5+ years
  /\d+\s*(weeks?|days?|hours?|minutes?)/, // durations
  /hands-?on/i,
];

function walk(dir: string, out: string[] = []): string[] {
  for (const e of readdirSync(dir)) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(tsx?|mdx?)$/.test(e) && !e.endsWith(".test.ts")) out.push(p);
  }
  return out;
}

describe("D1 — no invented impact numbers", () => {
  const roots = [
    join(process.cwd(), "src/app"),
    join(process.cwd(), "src/data"),
    join(process.cwd(), "src/lib"),
  ];
  const files = roots
    .flatMap((r) => walk(r))
    .filter((f) => !f.includes("__tests__"));

  it("scans a meaningful number of files", () => {
    expect(files.length).toBeGreaterThan(80);
  });

  it("no banned impact-stat pattern outside approved claims", () => {
    const offenders: string[] = [];
    for (const f of files) {
      const text = readFileSync(f, "utf8");
      for (const re of BANNED) {
        const rx = new RegExp(
          re.source,
          re.flags.includes("g") ? re.flags : `${re.flags}g`,
        );
        let m: RegExpExecArray | null;
        while ((m = rx.exec(text)) !== null) {
          if (isApprovedNumber(m[0])) continue;
          const ctx = text.slice(
            Math.max(0, m.index - 40),
            m.index + m[0].length + 20,
          );
          if (ALLOW.some((a) => a.test(ctx))) continue;
          offenders.push(`${f.replace(/\\/g, "/")}: ${m[0]}`);
        }
      }
    }
    expect(offenders, `\n${offenders.join("\n")}`).toEqual([]);
  });
});
