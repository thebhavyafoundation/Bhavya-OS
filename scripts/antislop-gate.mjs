#!/usr/bin/env node
/**
 * Anti-Slop Quality Gate
 *
 * Deterministic scanner for AI-generated content patterns in source code.
 * Checks code comments, prose, and file structure for common AI slop.
 *
 * Usage:
 *   node scripts/antislop-gate.mjs          # scan tracked source files
 *   node scripts/antislop-gate.mjs --staged # scan staged files only
 *
 * Exit 0 = clean, Exit 1 = slop detected.
 */

import { readFileSync } from "fs";
import { join, relative, extname } from "path";
import { execSync } from "child_process";

const ROOT = join(import.meta.dirname, "..");

// ── Scope: only source directories ──────────────────────────────────────────
const SOURCE_DIRS = ["packages/", "apps/"];
const SCAN_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);
const SCAN_MD_EXTS = new Set([".md", ".mdx"]);

// ── Patterns: code comment slop ─────────────────────────────────────────────

// Box-drawing double-line characters in comments (AI decorative headers: ═, ║, ╔, ╗, ╚, ╝)
const BOX_DRAWING_AI = /[═║╔╗╚╝╠╣╦╩╬]/;

// AI filler phrases in code comments (after stripping comment prefix)
const FILLER_PHRASES = [
  /^it'?s worth noting that/i,
  /^let'?s dive (?:in|deeper)/i,
  /^here'?s the thing/i,
  /^as (?:we|you) (?:can see|know|understand)/i,
  /^obviously/i,
  /^of course/i,
  /^needless to say/i,
  /^it goes without saying/i,
  /^as (?:mentioned|noted|stated|discussed) (?:above|previously|earlier)/i,
  /^in (?:summary|conclusion|essence),/i,
  /^the (?:bottom|top) line is/i,
  /^at the end of the day/i,
];

// Excessive consecutive comment lines (file headers are often 10-15 lines)
const MAX_CONSECUTIVE_COMMENTS = 15;

// ── Patterns: copywriting slop (markdown only) ──────────────────────────────
const MARKETING_SLOP = [
  /\bgame[- ]?changing\b/i,
  /\brevolutionary\b/i,
  /\bcutting[- ]?edge\b/i,
  /\bstate[- ]?of[- ]?the[- ]?art\b/i,
  /\bworld[- ]?class\b/i,
  /\bbest[- ]?in[- ]?class\b/i,
  /\bindustry[- ]?leading\b/i,
  /\bnext[- ]?generation\b/i,
  /\bunprecedented\b/i,
  /\bgroundbreaking\b/i,
  /\bparadigm shift\b/i,
  /\bseamless(?:ly)?\b/i,
  /bleverage(?:d|s)?\b/i,
  /\bsynerg(?:y|ies)\b/i,
  /\bdisrupt(?:ive|ion|ing)\b/i,
  /\bempower(?:ed|s|ing)?\b/i,
];

// ── Patterns: excessive emoji in code comments ──────────────────────────────
const EMOJI_IN_COMMENT = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u;

// ── Patterns: commented-out code ────────────────────────────────────────────
const COMMENTED_CODE =
  /^[ \t]*\/\/\s*(?:import|export|const|let|var|function|class|if|for|while|return|await|async)\b/;

// ── Collect files ───────────────────────────────────────────────────────────
function getFiles(staged) {
  const extArgs = SCAN_EXTS.size > 0
    ? [...SCAN_EXTS, ...SCAN_MD_EXTS].map((e) => `"*${e}"`).join(" ")
    : '"*.ts" "*.tsx" "*.js" "*.jsx" "*.mjs" "*.md" "*.mdx"';

  if (staged) {
    try {
      const output = execSync("git diff --cached --name-only --diff-filter=ACM", {
        cwd: ROOT,
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      });
      return output
        .split("\n")
        .filter((f) => f && (SCAN_EXTS.has(extname(f)) || SCAN_MD_EXTS.has(extname(f))))
        .filter((f) => SOURCE_DIRS.some((d) => f.startsWith(d)))
        .map((f) => join(ROOT, f));
    } catch {
      return [];
    }
  }

  try {
    const output = execSync(
      `git ls-files -- ${extArgs}`,
      { cwd: ROOT, encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] }
    );
    return output
      .split("\n")
      .filter((f) => f && SOURCE_DIRS.some((d) => f.startsWith(d)))
      .map((f) => join(ROOT, f));
  } catch {
    return [];
  }
}

// ── Analyze a single file ───────────────────────────────────────────────────
function analyzeFile(filePath) {
  const findings = [];
  const rel = relative(ROOT, filePath).replace(/\\/g, "/");
  const isMd = /\.(md|mdx)$/.test(filePath);

  let content;
  try {
    content = readFileSync(filePath, "utf-8");
  } catch {
    return findings;
  }

  const lines = content.split("\n");
  let consecutiveComments = 0;
  let commentedCodeCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const lineNum = i + 1;

    if (!isMd) {
      const isComment =
        trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*");

      if (isComment) {
        consecutiveComments++;
        const commentText = trimmed.replace(/^\/\/\s?/, "").replace(/^\*\s?/, "");

        // Box-drawing in comments (AI decorative headers only: ═, ║, etc.)
        if (BOX_DRAWING_AI.test(commentText)) {
          findings.push({ type: "box-drawing", file: rel, line: lineNum,
            msg: "AI decorative header characters in comment (═, ║, etc.)" });
        }

        // Filler phrases
        for (const pattern of FILLER_PHRASES) {
          if (pattern.test(commentText)) {
            findings.push({ type: "filler", file: rel, line: lineNum,
              msg: `AI filler phrase detected` });
            break;
          }
        }

        // Emoji in comments
        if (EMOJI_IN_COMMENT.test(commentText)) {
          findings.push({ type: "emoji", file: rel, line: lineNum,
            msg: "Emoji in code comment" });
        }

        // Commented-out code
        if (COMMENTED_CODE.test(line)) {
          commentedCodeCount++;
        }
      } else {
        consecutiveComments = 0;
      }

      // Wall of comments
      if (consecutiveComments === MAX_CONSECUTIVE_COMMENTS + 1) {
        findings.push({ type: "wall-of-comments", file: rel, line: lineNum,
          msg: `${MAX_CONSECUTIVE_COMMENTS}+ consecutive comment lines` });
      }
    }

    // ── Copywriting slop (markdown only) ────────────────────────────────
    if (isMd && trimmed.length > 10) {
      for (const pattern of MARKETING_SLOP) {
        if (pattern.test(trimmed)) {
          findings.push({ type: "marketing-slop", file: rel, line: lineNum,
            msg: `Marketing slop: ${pattern.source.slice(0, 40)}` });
          break;
        }
      }
    }
  }

  // File-level: excessive commented-out code
  if (!isMd && commentedCodeCount > 10) {
    findings.push({ type: "commented-code", file: rel, line: 0,
      msg: `${commentedCodeCount} lines of commented-out code` });
  }

  return findings;
}

// ── Main ────────────────────────────────────────────────────────────────────
const staged = process.argv.includes("--staged");
const files = getFiles(staged);

if (files.length === 0) {
  console.log("Anti-Slop Gate: no files to scan.");
  process.exit(0);
}

console.log(`Anti-Slop Gate: scanning ${files.length} files${staged ? " (staged)" : ""}...\n`);

const allFindings = [];
for (const file of files) {
  allFindings.push(...analyzeFile(file));
}

// Deduplicate
const seen = new Set();
const unique = allFindings.filter((f) => {
  const key = `${f.file}:${f.line}:${f.type}`;
  if (seen.has(key)) return false;
  seen.add(key);
  return true;
});

unique.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);

if (unique.length === 0) {
  console.log("PASS — No AI slop patterns detected.");
  process.exit(0);
}

// Group by type
const byType = {};
for (const f of unique) {
  (byType[f.type] ??= []).push(f);
}

console.log(`FAIL — ${unique.length} AI slop pattern(s) detected:\n`);

for (const [type, items] of Object.entries(byType)) {
  console.log(`  [${type}] (${items.length})`);
  for (const item of items.slice(0, 15)) {
    const loc = item.line > 0 ? `:${item.line}` : "";
    console.log(`    ${item.file}${loc} — ${item.msg}`);
  }
  if (items.length > 15) {
    console.log(`    ... and ${items.length - 15} more`);
  }
  console.log();
}

process.exit(1);
