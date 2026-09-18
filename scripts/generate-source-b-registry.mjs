/**
 * Generate the Source B (Experience AI) metadata registry.
 *
 * Input : .ai/audits/master-reconstruction/source-b-catalog.json (audit artifact, facts only)
 * Output: apps/ai-institute/src/data/source-b-registry.generated.ts
 *
 * The registry carries CATALOG FACTS ONLY (slug, title, strand, age band,
 * file/format counts, word counts, license). No lesson bodies, no slide text,
 * no worksheet content — the corpus is CC BY-NC-ND 4.0 (no derivatives).
 *
 * Usage: node scripts/generate-source-b-registry.mjs [--check]
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalogPath = join(root, ".ai/audits/master-reconstruction/source-b-catalog.json");
const outPath = join(root, "apps/ai-institute/src/data/source-b-registry.generated.ts");

// Curated pack table. Titles are short factual identifiers for the pack;
// strands group packs for navigation. Age bands ONLY where the source
// filename states them — otherwise omitted (never invented).
const PACKS = [
  { slug: "ai-detectives-the-case-of-the-clever-claim-en-US", title: "AI Detectives: The Case of the Clever Claim", strand: "ai-and-society" },
  { slug: "ai-safety-manager-challenge-en-US", title: "AI Safety Manager Challenge", strand: "ai-safety" },
  { slug: "discovering-ai-14-16-en-US", title: "Discovering AI (14-16)", strand: "entry-point", ageBand: "14-16" },
  { slug: "discovering-ai-8-12-en-US", title: "Discovering AI (8-12)", strand: "entry-point", ageBand: "8-12" },
  { slug: "ecosystems-and-ai-11-14-en-US", title: "Ecosystems and AI", strand: "ai-and-science", ageBand: "11-14" },
  { slug: "large-language-models-llms-11-14-en-US", title: "Large Language Models", strand: "foundations", ageBand: "11-14" },
  { slug: "lesson-1-exploring-social-media-en-US", title: "Exploring Social Media", strand: "ai-and-society" },
  { slug: "lesson-1-what-is-a-flood-en-US", title: "What Is a Flood?", strand: "ai-and-environment" },
  { slug: "lesson-1-what-is-ai-en-US", title: "What Is AI?", strand: "foundations" },
  { slug: "lesson-2-ai-flood-detectives-en-US", title: "AI Flood Detectives", strand: "ai-and-environment" },
  { slug: "lesson-2-engagement-bait-en-US", title: "Engagement Bait", strand: "ai-and-society" },
  { slug: "lesson-2-how-computers-learn-from-data-en-US", title: "How Computers Learn from Data", strand: "foundations" },
  { slug: "lesson-3-bias-in-bias-out-en-US", title: "Bias In, Bias Out", strand: "foundations" },
  { slug: "lesson-3-designed-for-attention-en-US", title: "Designed for Attention", strand: "ai-and-society" },
  { slug: "lesson-3-using-ai-systems-to-predict-floods-en-US", title: "Using AI Systems to Predict Floods", strand: "ai-and-environment" },
  { slug: "lesson-4-ai-quests-market-marshes-en-US", title: "AI Quests: Market Marshes", strand: "ai-and-environment" },
  { slug: "lesson-4-decision-trees-en-US", title: "Decision Trees", strand: "foundations" },
  { slug: "lesson-5-how-to-solve-problems-with-machine-learning-models-en-US", title: "Solving Problems with ML Models", strand: "projects" },
  { slug: "lesson-6-model-cards-and-careers-en-US", title: "Model Cards and Careers", strand: "projects" },
  { slug: "media-literacy-in-the-age-of-ai-en-US", title: "Media Literacy in the Age of AI", strand: "ai-safety" },
  { slug: "module-1-lesson-1-what-is-ai-en-US", title: "Understanding AI: What Is AI?", strand: "module-1" },
  { slug: "module-1-lesson-2-machine-learning-en-US", title: "Understanding AI: Machine Learning", strand: "module-1" },
  { slug: "module-1-lesson-3-classification-en-US", title: "Understanding AI: Classification", strand: "module-1" },
  { slug: "module-1-lesson-4-bias-in-bias-out-en-US", title: "Understanding AI: Bias In, Bias Out", strand: "module-1" },
  { slug: "module-2-lesson-1-ai-around-you-en-US", title: "Solving Problems with AI: AI Around You", strand: "module-2" },
  { slug: "module-2-lesson-2-creating-ai-projects-en-US", title: "Solving Problems with AI: Creating AI Projects", strand: "module-2" },
  { slug: "module-2-lesson-3-solving-problems-with-ml-models-part-1-en-US", title: "Solving Problems with ML Models (Part 1)", strand: "module-2" },
  { slug: "module-2-lesson-4-solving-problems-with-ml-models-part-2-en-US", title: "Solving Problems with ML Models (Part 2)", strand: "module-2" },
  { slug: "module-2-lesson-5-model-cards-and-careers-en-US", title: "Solving Problems with AI: Model Cards and Careers", strand: "module-2" },
  { slug: "using-ai-tools-responsibly-en-US", title: "Using AI Tools Responsibly", strand: "ai-safety" },
  { slug: "your-data-and-ai-en-US", title: "Your Data and AI", strand: "ai-safety" },
];

const catalog = JSON.parse(readFileSync(catalogPath, "utf-8"));
const bySlug = new Map(catalog.catalog.map((p) => [p.slug, p]));

for (const pack of PACKS) {
  if (!bySlug.has(pack.slug)) throw new Error(`catalog missing pack: ${pack.slug}`);
}
if (bySlug.size !== PACKS.length) {
  throw new Error(`catalog drift: catalog has ${bySlug.size}, table has ${PACKS.length}`);
}

const lines = [];
lines.push(`/**`);
lines.push(` * Source B metadata registry — GENERATED FILE, do not hand-edit.`);
lines.push(` *`);
lines.push(` * Generated by scripts/generate-source-b-registry.mjs from`);
lines.push(` * .ai/audits/master-reconstruction/source-b-catalog.json.`);
lines.push(` *`);
lines.push(` * Raspberry Pi Foundation "Experience AI" (https://experience-ai.org).`);
lines.push(` * License: CC BY-NC-ND 4.0 (attribution, non-commercial, no derivatives).`);
lines.push(` * Catalog facts ONLY (slug/title/strand/counts) — no lesson bodies.`);
lines.push(` * Entry shapes mirror ExternalResourceRef in @bhavya/shared (kept local`);
lines.push(` * to avoid a new workspace dependency; see ADR-014).`);
lines.push(` *`);
lines.push(` * @module source-b-registry`);
lines.push(` */`);
lines.push(``);
lines.push(`export interface SourceBPackEntry {`);
lines.push(`  readonly slug: string;`);
lines.push(`  readonly title: string;`);
lines.push(`  readonly strand: string;`);
lines.push(`  readonly ageBand?: string;`);
lines.push(`  readonly files: number;`);
lines.push(`  readonly words: number;`);
lines.push(`  readonly sourceId: "external-experience-ai";`);
lines.push(`  readonly provider: string;`);
lines.push(`  readonly license: string;`);
lines.push(`}`);
lines.push(``);
lines.push(`export const SOURCE_B_PROVIDER = "Raspberry Pi Foundation";`);
lines.push(`export const SOURCE_B_LICENSE = "CC BY-NC-ND 4.0";`);
lines.push(`export const SOURCE_B_PROGRAM = "Experience AI";`);
lines.push(`export const SOURCE_B_URL = "https://experience-ai.org";`);
lines.push(``);
lines.push(`export const sourceBPacks: readonly SourceBPackEntry[] = [`);
for (const pack of PACKS) {
  const c = bySlug.get(pack.slug);
  const age = pack.ageBand ? `\n    ageBand: ${JSON.stringify(pack.ageBand)},` : "";
  lines.push(`  {`);
  lines.push(`    slug: ${JSON.stringify(pack.slug)},`);
  lines.push(`    title: ${JSON.stringify(pack.title)},`);
  lines.push(`    strand: ${JSON.stringify(pack.strand)},${age}`);
  lines.push(`    files: ${c.files.length},`);
  lines.push(`    words: ${c.words},`);
  lines.push(`    sourceId: "external-experience-ai",`);
  lines.push(`    provider: SOURCE_B_PROVIDER,`);
  lines.push(`    license: SOURCE_B_LICENSE,`);
  lines.push(`  },`);
}
lines.push(`];`);
lines.push(``);
lines.push(`export const sourceBPackCount = sourceBPacks.length;`);
lines.push(`export const sourceBFileCount = sourceBPacks.reduce((n, p) => n + p.files, 0);`);
lines.push(`export const sourceBWordCount = sourceBPacks.reduce((n, p) => n + p.words, 0);`);
lines.push(``);

const output = lines.join("\n");
if (process.argv.includes("--check")) {
  const current = readFileSync(outPath, "utf-8");
  if (current !== output) {
    console.error("source-b registry is stale — run node scripts/generate-source-b-registry.mjs");
    process.exit(1);
  }
  console.log("source-b registry is current.");
} else {
  writeFileSync(outPath, output);
  console.log(`wrote ${outPath} (${PACKS.length} packs)`);
}
