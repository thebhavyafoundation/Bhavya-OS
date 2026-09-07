// scripts/generate-file-map.mjs
// GENERATED INDEX — never hand-edit FILE-MAP.md. Rebuild with:
//   node scripts/generate-file-map.mjs
// Reads frontmatter + directory listing only. No dependencies.
import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "FILE-MAP.md");

function list(dir, depth = 0, maxDepth = 2) {
  const out = [];
  let entries = [];
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries.sort()) {
    if (name === "node_modules" || name === ".git" || name === ".next") continue;
    const full = join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    out.push(`${"  ".repeat(depth)}- \`${relative(ROOT, full)}\`${st.isDirectory() ? "/" : ""}`);
    if (st.isDirectory() && depth < maxDepth) out.push(...list(full, depth + 1, maxDepth));
  }
  return out;
}

function frontmatterStatus(file) {
  try {
    const text = readFileSync(file, "utf8");
    const m = text.match(/^---\n([\s\S]*?)\n---/);
    if (m) {
      const sm = m[1].match(/^status:\s*(.+)$/m);
      if (sm) return sm[1].trim();
    }
    const bm = text.match(/\*\*Status:\*\*\s*(.+)/);
    if (bm) return bm[1].replace(/\s+/g, " ").trim();
    const hm = text.match(/^## Status\s*\n+\s*(.+)$/m);
    return hm ? hm[1].trim() : "no-status";
  } catch {
    return "unreadable";
  }
}

const lines = [];
lines.push("# FILE-MAP — generated index");
lines.push("");
lines.push("> DO NOT HAND-EDIT. Rebuild with `node scripts/generate-file-map.mjs`.");
lines.push("> Output is byte-deterministic: regenerate → `git diff` must be empty when sources are unchanged.");
lines.push("");
lines.push("## Entry + routers");
lines.push("");
for (const f of ["AGENTS.md", "CONTEXT.md", "apps/CONTEXT.md", "apps/ai-institute/CONTEXT.md", "packages/CONTEXT.md", "docs/CONTEXT.md", ".ai/CONTEXT.md", "rfcs/CONTEXT.md", "_shared/factory-map.md", "_system/schema.md"]) {
  lines.push(`- \`${f}\` — ${existsSync(join(ROOT, f)) ? "present" : "MISSING"}`);
}
lines.push("");
lines.push("## RFC pipeline status (frontmatter scan)");
lines.push("");
try {
  for (const name of readdirSync(join(ROOT, "rfcs")).sort()) {
    if (!name.endsWith(".md") || name === "CONTEXT.md") continue;
    lines.push(`- \`rfcs/${name}\` — ${frontmatterStatus(join(ROOT, "rfcs", name))}`);
  }
} catch {
  lines.push("- (no rfcs/ directory)");
}
lines.push("");
lines.push("## Top-level tree (depth 2, generated)");
lines.push("");
lines.push(...list(ROOT, 0, 1));
lines.push("");
lines.push("## Canonical homes (links, not copies)");
lines.push("");
lines.push("- tokens: `packages/platform-ui/src/styles/tokens.css`");
lines.push("- components: `packages/platform-ui/src/components/`");
lines.push("- brand: `docs/brand/BRAND_GUIDE.md`");
lines.push("- routes: `docs/architecture/CANONICAL_ROUTE_MAP.md`");
lines.push("- ownership: `docs/architecture/DOMAIN_OWNERSHIP.md`");
lines.push("- constitution: `packages/constitution/` (SDK `@bhavya/constitution`)");
lines.push("");

writeFileSync(OUT, lines.join("\n"));
console.log(`wrote ${OUT} (${lines.length} lines)`);
