import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

import { aiModules } from "@/data/curriculum/ai-module-registry";
import { LESSONS } from "@/data/curriculum/lesson-registry";
import { BAND_AGES, BAND_LABELS } from "../bands";

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

const curriculumDir = join(process.cwd(), "public", "curriculum");
const tokensPath = join(
  process.cwd(),
  "..",
  "..",
  "packages",
  "platform-ui",
  "src",
  "styles",
  "tokens.css",
);
const logoPath = join(process.cwd(), "public", "brand", "logo.svg");

function loadManifest(): Manifest {
  const raw = readFileSync(join(curriculumDir, "manifest.json"), "utf8");
  return JSON.parse(raw) as Manifest;
}

function walkSvg(dir: string, base = dir, out: string[] = []): string[] {
  if (!statSync(dir, { throwIfNoEntry: false })) return out;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkSvg(full, base, out);
    else if (entry.endsWith(".svg"))
      out.push(full.slice(base.length + 1).replaceAll("\\", "/"));
  }
  return out;
}

function hexSet(text: string): Set<string> {
  const found = new Set<string>();
  for (const match of text.matchAll(/#[0-9a-fA-F]{6}\b/g)) {
    found.add(match[0].toLowerCase());
  }
  return found;
}

describe("curriculum asset pipeline", () => {
  const manifest = loadManifest();

  it("registry sanity bounds", () => {
    expect(aiModules.length).toBeGreaterThanOrEqual(80);
    expect(aiModules.length).toBeLessThanOrEqual(120);
    expect(LESSONS.length).toBeGreaterThanOrEqual(1);
  });

  it("manifest counts and version derive from the registries", () => {
    expect(manifest.version).toBe(1);
    expect(manifest.moduleCount).toBe(aiModules.length);
    expect(manifest.lessonCount).toBe(LESSONS.length);
    expect(manifest.assets.filter((a) => a.kind === "module").length).toBe(
      aiModules.length,
    );
    expect(manifest.assets.filter((a) => a.kind === "lesson").length).toBe(
      LESSONS.length,
    );
  });

  it("has exactly one asset per module with registry metadata", () => {
    const moduleAssets = manifest.assets.filter((a) => a.kind === "module");
    const ids = moduleAssets.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const mod of aiModules) {
      const asset = moduleAssets.find((a) => a.id === mod.id);
      expect(asset, `missing asset for module ${mod.id}`).toBeDefined();
      expect(asset!.title).toBe(mod.title);
      expect(asset!.band).toBe(mod.band);
      expect(asset!.slug).toBe(mod.slug);
      expect(asset!.ages).toBe(BAND_AGES[mod.band]);
      expect(BAND_LABELS[mod.band]).toBeDefined();
    }
  });

  it("has exactly one asset per lesson linked to its module", () => {
    const lessonAssets = manifest.assets.filter((a) => a.kind === "lesson");
    const ids = lessonAssets.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const lesson of LESSONS) {
      const asset = lessonAssets.find((a) => a.id === lesson.id);
      expect(asset, `missing asset for lesson ${lesson.id}`).toBeDefined();
      expect(asset!.title).toBe(lesson.title);
      expect(asset!.moduleId).toBe(lesson.moduleId);
      const mod = aiModules.find((m) => m.id === lesson.moduleId);
      expect(mod).toBeDefined();
      expect(asset!.band).toBe(mod!.band);
      expect(asset!.ages).toBe(BAND_AGES[mod!.band]);
    }
  });

  it("every manifest path exists and there are no orphan files", () => {
    for (const asset of manifest.assets) {
      const full = join(curriculumDir, asset.path.replace(/^curriculum\//, ""));
      expect(
        statSync(full, { throwIfNoEntry: false }),
        `missing file for ${asset.path}`,
      ).toBeDefined();
    }

    const onDisk = walkSvg(curriculumDir).map((rel) => `curriculum/${rel}`);
    const expected = new Set(manifest.assets.map((a) => a.path));
    expect(new Set(onDisk)).toEqual(expected);
    expect(onDisk.length).toBe(manifest.assets.length);
  });

  it("every card uses only tokens.css and brand logo colors", () => {
    const allowed = hexSet(readFileSync(tokensPath, "utf8"));
    for (const hex of hexSet(readFileSync(logoPath, "utf8"))) allowed.add(hex);
    expect(allowed.size).toBeGreaterThan(10);

    const offenders: string[] = [];
    for (const asset of manifest.assets) {
      const full = join(curriculumDir, asset.path.replace(/^curriculum\//, ""));
      const svg = readFileSync(full, "utf8");
      for (const hex of hexSet(svg)) {
        if (!allowed.has(hex)) offenders.push(`${asset.path}: ${hex}`);
      }
    }
    expect(offenders, `\n${offenders.join("\n")}`).toEqual([]);
  });

  it("every card carries the logo watermark and an accessibility title", () => {
    for (const asset of manifest.assets) {
      const full = join(curriculumDir, asset.path.replace(/^curriculum\//, ""));
      const svg = readFileSync(full, "utf8");
      expect(svg, `${asset.path} watermark`).toContain('id="watermark"');
      expect(svg, `${asset.path} title`).toContain("<title>");
      expect(svg, `${asset.path} dims`).toContain('width="1200" height="630"');
    }
  });
});
