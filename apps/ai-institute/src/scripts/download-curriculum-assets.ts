#!/usr/bin/env tsx
/**
 * Curriculum Asset Pipeline
 * Downloads 3D models, HDRI, textures for curriculum modules
 *
 * Sources:
 * - Poly Haven (CC0): HDRI, 3D models, textures
 * - AmbientCG (CC0): PBR textures
 * - Kenney (CC0): Low-poly game assets
 * - NASA 3D Resources (Public Domain): Space/science models
 * - Sketchfab (Free tier): Educational models
 */

import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createReadStream } from "fs";
import { pipeline } from "stream/promises";
import https from "https";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ASSETS_DIR = join(__dirname, "..", "..", "public", "assets");

interface Asset {
  id: string;
  url: string;
  destination: string;
  type: "model" | "hdri" | "texture" | "animation";
  source: string;
  license: string;
  moduleId?: string;
  band?: string;
}

const ASSET_MANIFEST: Asset[] = [
  // HDRI Environments (Poly Haven - CC0)
  {
    id: "venice-sunset-1k",
    url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/exr/1k/venice_sunset_1k.exr",
    destination: "hdri/venice_sunset_1k.exr",
    type: "hdri",
    source: "Poly Haven",
    license: "CC0",
  },
  {
    id: "studio-small-04-1k",
    url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/exr/1k/studio_small_04_1k.exr",
    destination: "hdri/studio_small_04_1k.exr",
    type: "hdri",
    source: "Poly Haven",
    license: "CC0",
  },
  {
    id: "forest-1k",
    url: "https://dl.polyhaven.org/file/ph-assets/HDRIs/exr/1k/forest_road_1k.exr",
    destination: "hdri/forest_road_1k.exr",
    type: "hdri",
    source: "Poly Haven",
    license: "CC0",
  },

  // 3D Models (Poly Haven - CC0)
  {
    id: "tree-pine-1k",
    url: "https://dl.polyhaven.org/file/ph-assets/models/gltf/1k/tree_pine.glb",
    destination: "models/tree_pine.glb",
    type: "model",
    source: "Poly Haven",
    license: "CC0",
    band: "junior-a",
  },
  {
    id: "rocks-1k",
    url: "https://dl.polyhaven.org/file/ph-assets/models/gltf/1k/rocks.glb",
    destination: "models/rocks.glb",
    type: "model",
    source: "Poly Haven",
    license: "CC0",
    band: "junior-b",
  },
  {
    id: "tree-oak-1k",
    url: "https://dl.polyhaven.org/file/ph-assets/models/gltf/1k/tree_oak.glb",
    destination: "models/tree_oak.glb",
    type: "model",
    source: "Poly Haven",
    license: "CC0",
    band: "0",
  },

  // Kenney Assets (CC0) - via GitHub
  {
    id: "kenney-nature-kit",
    url: "https://github.com/kenney-assets/kenney-nature-kit/raw/main/Models/GLTF/tree_pine.glb",
    destination: "models/kenney/tree_pine.glb",
    type: "model",
    source: "Kenney Assets",
    license: "CC0",
    band: "junior-a",
  },
  {
    id: "kenney-urban-kit",
    url: "https://github.com/kenney-assets/kenney-urban-kit/raw/main/Models/GLTF/building.glb",
    destination: "models/kenney/building.glb",
    type: "model",
    source: "Kenney Assets",
    license: "CC0",
    band: "0",
  },

  // PBR Textures (AmbientCG - CC0)
  {
    id: "wood-planks-1k",
    url: "https://ambientcg.com/api/v2/download?filename=WoodPlanks001_1K-JPG.zip",
    destination: "textures/wood_planks_1k.zip",
    type: "texture",
    source: "AmbientCG",
    license: "CC0",
  },
  {
    id: "metal-scratched-1k",
    url: "https://ambientcg.com/api/v2/download?filename=MetalScratched001_1K-JPG.zip",
    destination: "textures/metal_scratched_1k.zip",
    type: "texture",
    source: "AmbientCG",
    license: "CC0",
  },
  {
    id: "fabric-denim-1k",
    url: "https://ambientcg.com/api/v2/download?filename=FabricDenim001_1K-JPG.zip",
    destination: "textures/fabric_denim_1k.zip",
    type: "texture",
    source: "AmbientCG",
    license: "CC0",
  },

  // NASA 3D Resources (Public Domain)
  {
    id: "nasa-rover",
    url: "https://nasa3d.arc.nasa.gov/sites/default/files/models/rover.glb",
    destination: "models/nasa/rover.glb",
    type: "model",
    source: "NASA 3D Resources",
    license: "Public Domain",
    band: "1",
  },
  {
    id: "nasa-satellite",
    url: "https://nasa3d.arc.nasa.gov/sites/default/files/models/satellite.glb",
    destination: "models/nasa/satellite.glb",
    type: "model",
    source: "NASA 3D Resources",
    license: "Public Domain",
    band: "2",
  },

  // Educational Models (Sketchfab free tier - check license)
  {
    id: "cell-model",
    url: "https://github.com/bhavyafoundation/curriculum-assets/raw/main/models/cell.glb",
    destination: "models/education/cell.glb",
    type: "model",
    source: "Bhavya Foundation",
    license: "CC-BY-4.0",
    band: "0",
    moduleId: "ja-01",
  },
];

// ============================================
// Download Functions
// ============================================

async function downloadFile(url: string, destination: string): Promise<void> {
  const dir = dirname(destination);
  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  if (existsSync(destination)) {
    console.log(`⏭  Skipping ${destination} (already exists)`);
    return;
  }

  console.log(`📥 Downloading ${url} -> ${destination}`);

  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const request = client.get(url, async (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }

      const { createWriteStream } = await import("fs");
      const fileStream = createWriteStream(destination);
      pipeline(response, fileStream)
        .then(() => {
          console.log(`✅ Downloaded ${destination}`);
          resolve();
        })
        .catch(reject);
    });

    request.on("error", reject);
    request.setTimeout(60000, () => reject(new Error("Download timeout")));
  });
}

async function downloadAsset(asset: Asset): Promise<void> {
  try {
    await downloadFile(asset.url, join(ASSETS_DIR, asset.destination));
  } catch (error) {
    console.error(`❌ Failed to download ${asset.id}:`, error);
  }
}

async function downloadAllAssets(): Promise<void> {
  console.log("🚀 Starting Curriculum Asset Pipeline");
  console.log(`📁 Assets directory: ${ASSETS_DIR}`);
  console.log(`📦 Total assets: ${ASSET_MANIFEST.length}\n`);

  // Create directories
  const dirs = [
    "models",
    "models/kenney",
    "models/nasa",
    "models/education",
    "hdri",
    "textures",
    "animations",
  ];

  for (const dir of dirs) {
    const fullPath = join(ASSETS_DIR, dir);
    if (!existsSync(fullPath)) {
      await mkdir(fullPath, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  }

  // Download with concurrency limit
  const CONCURRENCY = 3;
  for (let i = 0; i < ASSET_MANIFEST.length; i += CONCURRENCY) {
    const batch = ASSET_MANIFEST.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(downloadAsset));
    console.log(
      `📦 Completed batch ${Math.floor(i / CONCURRENCY) + 1}/${Math.ceil(ASSET_MANIFEST.length / CONCURRENCY)}`,
    );
  }

  // Generate manifest
  const manifest = ASSET_MANIFEST.map((asset) => ({
    ...asset,
    localPath: `/assets/${asset.destination}`,
    downloaded: true,
  }));

  await writeFile(
    join(ASSETS_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );

  console.log("\n✅ Asset pipeline complete!");
  console.log(`📋 Manifest written to ${ASSETS_DIR}/manifest.json`);
}

// ============================================
// Module-Specific Asset Mapping
// ============================================

function generateModuleAssetMap(): Record<string, string[]> {
  const map: Record<string, string[]> = {};

  ASSET_MANIFEST.forEach((asset) => {
    if (asset.moduleId) {
      if (!map[asset.moduleId]) map[asset.moduleId] = [];
      map[asset.moduleId].push(`/assets/${asset.destination}`);
    }
    if (asset.band) {
      if (!map[`band:${asset.band}`]) map[`band:${asset.band}`] = [];
      map[`band:${asset.band}`].push(`/assets/${asset.destination}`);
    }
  });

  return map;
}

async function generateAssetConfig(): Promise<void> {
  const moduleMap = generateModuleAssetMap();

  const config = {
    version: "1.0.0",
    generated: new Date().toISOString(),
    sources: [
      { name: "Poly Haven", url: "https://polyhaven.com", license: "CC0" },
      {
        name: "Kenney Assets",
        url: "https://kenney.nl/assets",
        license: "CC0",
      },
      { name: "AmbientCG", url: "https://ambientcg.com", license: "CC0" },
      {
        name: "NASA 3D Resources",
        url: "https://nasa3d.arc.nasa.gov",
        license: "Public Domain",
      },
      {
        name: "Bhavya Foundation",
        url: "https://bhavya.foundation",
        license: "CC-BY-4.0",
      },
    ],
    assets: ASSET_MANIFEST,
    moduleAssets: moduleMap,
    bandAssets: {
      "junior-a": ASSET_MANIFEST.filter((a) => a.band === "junior-a").map(
        (a) => a.destination,
      ),
      "junior-b": ASSET_MANIFEST.filter((a) => a.band === "junior-b").map(
        (a) => a.destination,
      ),
      "0": ASSET_MANIFEST.filter((a) => a.band === "0").map(
        (a) => a.destination,
      ),
    },
  };

  await writeFile(
    join(ASSETS_DIR, "asset-config.json"),
    JSON.stringify(config, null, 2),
  );

  console.log("📋 Asset config written to asset-config.json");
}

// ============================================
// Main
// ============================================

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--download")) {
    await downloadAllAssets();
  }

  if (args.includes("--config")) {
    await generateAssetConfig();
  }

  if (args.includes("--all") || args.length === 0) {
    await downloadAllAssets();
    await generateAssetConfig();
  }
}

main().catch(console.error);
