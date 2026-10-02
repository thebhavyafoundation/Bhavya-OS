import {
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join, sep } from "node:path";

import { aiModules } from "../data/curriculum/ai-module-registry";
import { LESSONS } from "../data/curriculum/lesson-registry";
import { BAND_AGES, BAND_LABELS } from "../lib/curriculum/bands";

interface ManifestAsset {
  kind: "module" | "lesson";
  id: string;
  title: string;
  band: string;
  ages: string;
  path: string;
  slug?: string;
  moduleId?: string;
}

interface Manifest {
  version: number;
  moduleCount: number;
  lessonCount: number;
  assets: ManifestAsset[];
}

interface CardInput {
  kind: "module" | "lesson";
  id: string;
  title: string;
  band: string;
  slug?: string;
  moduleId?: string;
  description?: string;
  topics?: readonly string[];
  context?: string;
}

const WIDTH = 1200;
const HEIGHT = 630;
const MARGIN = 64;
const TITLE_SIZES = [64, 56, 48, 42];

function fail(message: string): never {
  console.error(`asset generation failed: ${message}`);
  process.exit(1);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseTokens(css: string): Record<string, string> {
  const tokens: Record<string, string> = {};
  const re = /(--[a-z0-9-]+)\s*:\s*([^;]+);/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(css)) !== null) {
    tokens[match[1]] = match[2].trim();
  }
  return tokens;
}

function requireHex(tokens: Record<string, string>, name: string): string {
  const value = tokens[name];
  if (!value || !/^#[0-9a-fA-F]{6}$/.test(value)) {
    fail(
      `token ${name} missing or not a hex color (got: ${value ?? "undefined"})`,
    );
  }
  return value.toLowerCase();
}

function requireFont(tokens: Record<string, string>, name: string): string {
  const value = tokens[name];
  if (!value) fail(`token ${name} missing`);
  return value.replace(/\s+/g, " ").replace(/"/g, "'");
}

function greedyWrap(text: string, size: number, maxWidth: number): string[] {
  const perLine = Math.max(1, Math.floor(maxWidth / (size * 0.52)));
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(/\s+/)) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= perLine) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function wrapTitle(
  text: string,
  maxWidth: number,
  maxLines: number,
): { lines: string[]; size: number } {
  for (const size of TITLE_SIZES) {
    const lines = greedyWrap(text, size, maxWidth);
    if (lines.length <= maxLines) return { lines, size };
  }
  const size = TITLE_SIZES[TITLE_SIZES.length - 1];
  let lines = greedyWrap(text, size, maxWidth);
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    const last = lines[maxLines - 1];
    lines[maxLines - 1] = `${last.replace(/\s+\S*$/, "")}…`;
  }
  return { lines, size };
}

function wrapBody(
  text: string,
  size: number,
  maxWidth: number,
  maxLines: number,
): string[] {
  let lines = greedyWrap(text, size, maxWidth);
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    const last = lines[maxLines - 1];
    lines[maxLines - 1] = `${last.replace(/\s+\S*$/, "")}…`;
  }
  return lines;
}

function stripAgesSentence(description: string): string {
  return description.replace(/\s*For ages[^.]*\.\s*$/, "").trim();
}

function buildCard(
  input: CardInput,
  logoSvg: string,
  tokens: Record<string, string>,
): string {
  const forest = requireHex(tokens, "--color-brand-forest");
  const ivory = requireHex(tokens, "--color-brand-ivory");
  const gold = requireHex(tokens, "--color-brand-gold");
  const fontDisplay = requireFont(tokens, "--font-display");
  const fontSans = requireFont(tokens, "--font-sans");

  const bandLabel = BAND_LABELS[input.band as keyof typeof BAND_LABELS];
  const ages = BAND_AGES[input.band as keyof typeof BAND_AGES];
  if (!bandLabel || !ages) fail(`unknown band on ${input.id}: ${input.band}`);

  const chipText = `${bandLabel} · ${ages}`;
  const chipWidth = Math.round(chipText.length * 10.5) + 44;
  const kicker =
    input.kind === "lesson" && input.context
      ? `LESSON · ${input.context}`
      : "BHAVYA FOUNDATION";

  const titleBlock = wrapTitle(input.title, WIDTH - MARGIN * 2, 3);
  const lineStep = Math.round(titleBlock.size * 1.15);
  const linesAboveMid = Math.ceil(titleBlock.lines.length / 2);
  const centerY = 300;
  const titleY =
    centerY -
    Math.round((linesAboveMid - 0.5) * lineStep + titleBlock.size * 0.35);

  const titleNodes = titleBlock.lines
    .map(
      (line, i) =>
        `<text x="${MARGIN}" y="${titleY + i * lineStep}" font-family="${escapeXml(fontDisplay)}" font-size="${titleBlock.size}" fill="${ivory}">${escapeXml(line)}</text>`,
    )
    .join("");

  let belowY =
    titleY +
    (titleBlock.lines.length - 1) * lineStep +
    Math.round(titleBlock.size * 0.8);

  const body: string[] = [];
  if (input.description) {
    const desc = stripAgesSentence(input.description);
    if (desc) {
      const descLines = wrapBody(desc, 24, WIDTH - MARGIN * 2 - 160, 2);
      body.push(
        descLines
          .map(
            (line, i) =>
              `<text x="${MARGIN}" y="${belowY + i * 34}" font-family="${escapeXml(fontSans)}" font-size="24" fill="${ivory}" fill-opacity="0.82">${escapeXml(line)}</text>`,
          )
          .join(""),
      );
      belowY += descLines.length * 34 + 8;
    }
  }

  if (input.topics && input.topics.length > 0) {
    body.push(
      `<text x="${MARGIN}" y="${belowY}" font-family="${escapeXml(fontSans)}" font-size="18" letter-spacing="1" fill="${gold}">${escapeXml(input.topics.join("  ·  "))}</text>`,
    );
  }

  const watermarkWidth = 120;
  const watermarkHeight = Math.round((watermarkWidth * 480) / 400);
  const watermark = logoSvg.replace(
    /^<svg([^>]*?)>/,
    (_m: string, attrs: string) =>
      `<svg${attrs} x="${WIDTH - MARGIN - watermarkWidth}" y="${HEIGHT - 40 - watermarkHeight}" width="${watermarkWidth}" height="${watermarkHeight}" opacity="0.16" id="watermark">`,
  );

  const aria = `${input.title} — ${bandLabel}, ${ages}`;

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${escapeXml(aria)}">`,
    `<title>${escapeXml(aria)}</title>`,
    `<rect width="${WIDTH}" height="${HEIGHT}" fill="${forest}"/>`,
    `<rect width="${WIDTH}" height="6" fill="${gold}"/>`,
    `<text x="${MARGIN}" y="86" font-family="${escapeXml(fontSans)}" font-size="18" font-weight="600" letter-spacing="5" fill="${ivory}" fill-opacity="0.9">${escapeXml(kicker)}</text>`,
    `<rect x="${WIDTH - MARGIN - chipWidth}" y="58" width="${chipWidth}" height="40" rx="20" fill="${ivory}" fill-opacity="0.1" stroke="${gold}" stroke-opacity="0.7"/>`,
    `<text x="${WIDTH - MARGIN - Math.round(chipWidth / 2)}" y="84" text-anchor="middle" font-family="${escapeXml(fontSans)}" font-size="17" fill="${ivory}">${escapeXml(chipText)}</text>`,
    titleNodes,
    ...body,
    `<text x="${MARGIN}" y="${HEIGHT - 56}" font-family="${escapeXml(fontSans)}" font-size="17" letter-spacing="2" fill="${ivory}" fill-opacity="0.55">BHAVYA AI INSTITUTE</text>`,
    watermark,
    `</svg>`,
    ``,
  ].join("\n");
}

function walkFiles(dir: string, base = dir, out: string[] = []): string[] {
  if (!statSync(dir, { throwIfNoEntry: false })) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkFiles(full, base, out);
    else
      out.push(
        full
          .slice(base.length + 1)
          .split(sep)
          .join("/"),
      );
  }
  return out;
}

function buildOutputs(): Map<string, string> {
  const cwd = process.cwd();
  const tokensPath = join(
    cwd,
    "..",
    "..",
    "packages",
    "platform-ui",
    "src",
    "styles",
    "tokens.css",
  );
  const logoPath = join(cwd, "public", "brand", "logo.svg");

  let tokensCss: string;
  let logoSvg: string;
  try {
    tokensCss = readFileSync(tokensPath, "utf8");
  } catch {
    fail(`cannot read tokens at ${tokensPath} (run from apps/ai-institute)`);
  }
  try {
    logoSvg = readFileSync(logoPath, "utf8")
      .replace(/^\uFEFF/, "")
      .replace(/\r\n/g, "\n")
      .replace(/<!--[\s\S]*?-->/g, "")
      .trim();
  } catch {
    fail(`cannot read logo at ${logoPath}`);
  }
  if (!/^<svg[\s>]/.test(logoSvg)) fail("logo.svg does not start with <svg");
  if (!logoSvg.endsWith("</svg>")) fail("logo.svg does not end with </svg>");

  const tokens = parseTokens(tokensCss);

  const moduleCards: CardInput[] = [...aiModules]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((m) => ({
      kind: "module" as const,
      id: m.id,
      title: m.title,
      band: m.band,
      slug: m.slug,
      description: m.description,
      topics: m.topics,
    }));

  const lessonCards: CardInput[] = [...LESSONS]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((l) => {
      const mod = aiModules.find((m) => m.id === l.moduleId);
      if (!mod) fail(`lesson ${l.id} references unknown module ${l.moduleId}`);
      return {
        kind: "lesson" as const,
        id: l.id,
        title: l.title,
        band: mod.band,
        moduleId: mod.id,
        context: mod.title,
      };
    });

  const cards = [...moduleCards, ...lessonCards];
  const assets: ManifestAsset[] = [];
  const outputs = new Map<string, string>();

  for (const card of cards) {
    const folder = card.kind === "module" ? "modules" : "lessons";
    const rel = `curriculum/${folder}/${card.id}.svg`;
    outputs.set(rel, buildCard(card, logoSvg, tokens));
    const asset: ManifestAsset = {
      kind: card.kind,
      id: card.id,
      title: card.title,
      band: card.band,
      ages: BAND_AGES[card.band as keyof typeof BAND_AGES],
      path: rel,
    };
    if (card.slug !== undefined) asset.slug = card.slug;
    if (card.moduleId !== undefined) asset.moduleId = card.moduleId;
    assets.push(asset);
  }

  const manifest: Manifest = {
    version: 1,
    moduleCount: aiModules.length,
    lessonCount: LESSONS.length,
    assets,
  };
  outputs.set(
    "curriculum/manifest.json",
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  return outputs;
}

function report(label: string, items: string[]): void {
  if (items.length === 0) return;
  console.error(`${label} (${items.length}):`);
  for (const item of items.slice(0, 25)) console.error(`  ${item}`);
  if (items.length > 25) console.error(`  ... and ${items.length - 25} more`);
}

function normalizeEol(text: string): string {
  return text.replace(/\r\n/g, "\n");
}

function checkOutputs(outputs: Map<string, string>, outRoot: string): void {
  const missing: string[] = [];
  const changed: string[] = [];
  const disk = new Set(walkFiles(join(outRoot, "curriculum")));

  for (const rel of [...outputs.keys()].sort()) {
    let content: string | undefined;
    try {
      content = normalizeEol(readFileSync(join(outRoot, rel), "utf8"));
    } catch {
      content = undefined;
    }
    if (content === undefined) missing.push(rel);
    else if (content !== normalizeEol(outputs.get(rel) ?? ""))
      changed.push(rel);
  }

  const stale: string[] = [];
  for (const rel of [...disk].sort()) {
    if (!outputs.has(`curriculum/${rel}`)) stale.push(`curriculum/${rel}`);
  }

  if (missing.length || changed.length || stale.length) {
    report("missing", missing);
    report("stale", stale);
    report("changed", changed);
    console.error(
      "run `pnpm --filter @bhavya/ai-institute assets:generate` and commit the result",
    );
    process.exit(1);
  }
  console.log(`assets up to date: ${outputs.size} files`);
}

function writeOutputs(outputs: Map<string, string>, outRoot: string): void {
  const written: string[] = [];
  for (const [rel, content] of [...outputs.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    const full = join(outRoot, rel);
    mkdirSync(join(full, ".."), { recursive: true });
    let current: string | undefined;
    try {
      current = readFileSync(full, "utf8");
    } catch {
      current = undefined;
    }
    if (current !== content) {
      writeFileSync(full, content, "utf8");
      written.push(rel);
    }
  }

  const curriculumDir = join(outRoot, "curriculum");
  const removed: string[] = [];
  for (const rel of walkFiles(curriculumDir)) {
    const key = `curriculum/${rel}`;
    if (!outputs.has(key)) {
      unlinkSync(join(curriculumDir, rel));
      removed.push(key);
    }
  }

  console.log(
    `assets: ${outputs.size} total, ${written.length} written, ${removed.length} removed`,
  );
}

function main(): void {
  const check = process.argv.includes("--check");
  const outRoot = join(process.cwd(), "public");
  const outputs = buildOutputs();
  if (check) checkOutputs(outputs, outRoot);
  else writeOutputs(outputs, outRoot);
}

main();
