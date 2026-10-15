#!/usr/bin/env tsx
/**
 * Curriculum Asset Verification
 * Verifies all module assets exist and updates registry with correct URLs
 */

import { readFile, writeFile, readdir } from "fs/promises";
import { join, extname, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ASSETS_DIR = join(__dirname, "..", "..", "public", "assets");
const REGISTRY_PATH = join(
  __dirname,
  "..",
  "..",
  "data",
  "curriculum",
  "ai-module-registry.ts",
);

interface ModuleAssetInfo {
  moduleId: string;
  title: string;
  band: string;
  visualFormat: string;
  recommendedAssetUrl: string;
  localAssets: string[];
  status: "ok" | "missing" | "placeholder";
}

async function verifyAssets(): Promise<void> {
  console.log("Verifying Curriculum Assets\n");

  const registryContent = await readFile(REGISTRY_PATH, "utf-8");

  const moduleRegex =
    /id:\s*"([^"]+)",[\s\S]*?title:\s*"([^"]+)",[\s\S]*?band:\s*"([^"]+)",[\s\S]*?visualFormat:\s*"([^"]+)",[\s\S]*?recommendedAssetUrl:\s*"([^"]+)"/g;

  const modules: ModuleAssetInfo[] = [];
  let match;

  while ((match = moduleRegex.exec(registryContent)) !== null) {
    const [, id, title, band, visualFormat, recommendedAssetUrl] = match;
    modules.push({
      moduleId: id,
      title: title,
      band: band,
      visualFormat: visualFormat,
      recommendedAssetUrl: recommendedAssetUrl,
      localAssets: [],
      status: "placeholder",
    });
  }

  console.log("Found " + modules.length + " modules in registry\n");

  const assetFiles = await scanAssetsDir(ASSETS_DIR);
  console.log("Found " + assetFiles.length + " asset files\n");

  const moduleAssets = new Map<string, string[]>();

  assetFiles.forEach((file) => {
    const relativePath = file.replace(ASSETS_DIR + "/", "");
    const moduleId = guessModuleId(relativePath, modules);
    if (moduleId) {
      const existing = moduleAssets.get(moduleId);
      if (existing) {
        existing.push("/assets/" + relativePath);
      } else {
        moduleAssets.set(moduleId, ["/assets/" + relativePath]);
      }
    }
  });

  let okCount = 0;
  let missingCount = 0;
  const placeholderCount = 0;

  for (const module of modules) {
    const localAssets = moduleAssets.get(module.moduleId) || [];
    module.localAssets = localAssets;

    if (module.recommendedAssetUrl.includes("[to-be-downloaded]")) {
      if (localAssets.length > 0) {
        module.status = "ok";
        okCount++;
      } else {
        module.status = "missing";
        missingCount++;
      }
    } else {
      module.status = "ok";
      okCount++;
    }
  }

  console.log("\nAsset Verification Report");
  console.log("================================");
  console.log("OK: " + okCount);
  console.log("Placeholder: " + placeholderCount);
  console.log("Missing: " + missingCount);
  console.log("Total: " + modules.length + "\n");

  if (missingCount > 0) {
    console.log("\nModules with missing assets:");
    modules
      .filter((m) => m.status === "missing")
      .forEach((m) => {
        console.log("  - " + m.moduleId + ": " + m.title + " (" + m.band + ")");
      });
  }

  console.log("\nModules with local assets:");
  modules
    .filter((m) => m.status === "ok" && m.localAssets.length > 0)
    .forEach((m) => {
      console.log("  - " + m.moduleId + ": " + m.localAssets.join(", "));
    });

  await generateUpdatedRegistry(modules);
  await generateAssetReport(modules);
}

function guessModuleId(
  filePath: string,
  modules: ModuleAssetInfo[],
): string | null {
  const fileName = filePath.toLowerCase();

  for (const module of modules) {
    if (filePath.includes(module.moduleId)) return module.moduleId;
  }

  for (const module of modules) {
    if (filePath.includes(module.band)) return module.moduleId;
  }

  const keywords = {
    "ja-01": ["listen", "voice", "microphone", "speaker"],
    "ja-02": ["see", "camera", "vision", "recognition"],
    "ja-03": ["rule", "algorithm", "decision"],
    "ja-04": ["sort", "match", "pattern"],
    "ja-05": ["home", "helpful", "safety"],
    "ja-06": ["data", "collection", "representation"],
    "ja-07": ["assistant", "voice", "question"],
    "ja-08": ["learning", "example", "practice", "ml"],
    "ja-09": ["fair", "unfair", "ethics", "bias"],
    "ja-10": ["agreement", "class", "policy"],
  };

  for (const [moduleId, keywordsList] of Object.entries(keywords)) {
    if (keywordsList.some((k) => fileName.includes(k))) {
      return moduleId;
    }
  }

  return null;
}

async function scanAssetsDir(dir: string): Promise<string[]> {
  const files: string[] = [];

  async function scan(currentDir: string): Promise<void> {
    const entries = await readdir(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);
      if (entry.isDirectory()) {
        await scan(fullPath);
      } else if (entry.isFile()) {
        const ext = extname(entry.name).toLowerCase();
        if (
          [
            ".glb",
            ".gltf",
            ".exr",
            ".hdr",
            ".jpg",
            ".png",
            ".webp",
            ".zip",
            ".json",
            ".lottie",
          ].includes(ext)
        ) {
          files.push(fullPath);
        }
      }
    }
  }

  await scan(dir);
  return files;
}

async function generateUpdatedRegistry(
  modules: ModuleAssetInfo[],
): Promise<void> {
  let content = await readFile(REGISTRY_PATH, "utf-8");

  for (const module of modules) {
    if (module.status === "ok" && module.localAssets.length > 0) {
      const preferredExt =
        module.visualFormat === "3d"
          ? ".glb"
          : module.visualFormat === "2d"
            ? ".png"
            : ".json";

      const matchingAsset = module.localAssets.find(
        (a: string) =>
          a.endsWith(preferredExt) || a.endsWith(".glb") || a.endsWith(".gltf"),
      );

      if (matchingAsset) {
        const oldUrl =
          'recommendedAssetUrl: "' + module.recommendedAssetUrl + '"';
        const newUrl = 'recommendedAssetUrl: "' + matchingAsset + '"';
        content = content.replace(oldUrl, newUrl);
        console.log(
          "Updated " +
            module.moduleId +
            ": " +
            module.recommendedAssetUrl +
            " -> " +
            matchingAsset,
        );
      }
    }
  }

  await writeFile(REGISTRY_PATH, content);
  console.log("\nUpdated registry with local asset URLs");
}

async function generateAssetReport(modules: ModuleAssetInfo[]): Promise<void> {
  const bands = [
    "junior-a",
    "junior-b",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
  ];
  const byBand: Record<string, ModuleAssetInfo[]> = {};
  bands.forEach((band) => {
    byBand[band] = modules.filter((m: ModuleAssetInfo) => m.band === band);
  });

  const report = {
    generated: new Date().toISOString(),
    summary: {
      totalModules: modules.length,
      ok: modules.filter((m) => m.status === "ok").length,
      missing: modules.filter((m) => m.status === "missing").length,
      placeholder: modules.filter((m) => m.status === "placeholder").length,
    },
    modules: modules.map((m: ModuleAssetInfo) => ({
      moduleId: m.moduleId,
      title: m.title,
      band: m.band,
      visualFormat: m.visualFormat,
      status: m.status,
      localAssets: m.localAssets,
      recommendedAssetUrl: m.recommendedAssetUrl,
    })),
    byBand: byBand,
  };

  const reportPath = join(
    __dirname,
    "..",
    "..",
    "..",
    "asset-verification-report.json",
  );
  await writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log("Asset report written to " + reportPath);
}

async function main(): Promise<void> {
  try {
    await verifyAssets();
  } catch (error) {
    console.error("Verification failed:", error);
    process.exit(1);
  }
}

main().catch(console.error);
