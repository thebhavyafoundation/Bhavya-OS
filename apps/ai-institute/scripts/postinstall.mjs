/**
 * Post-install script to patch @libsql/isomorphic-ws@0.1.5
 * 
 * The package @libsql/isomorphic-ws@0.1.5 declares a "workerd" export
 * condition pointing to "./web.cjs", but this file does not exist in the
 * published package. This causes OpenNext/esbuild to fail with:
 * 
 *   Could not resolve "@libsql/isomorphic-ws"
 *   The module "./web.cjs" was not found on the file system
 * 
 * This script creates the missing web.cjs file in the installed package,
 * exporting the global WebSocket (available in Cloudflare Workers).
 */

import { existsSync, writeFileSync, readFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(dirname, "../..");

/**
 * Find the @libsql/isomorphic-ws package in the pnpm store.
 * In pnpm, packages are stored in node_modules/.pnpm/<name>@<version>/node_modules/<name>
 */
function findIsomorphicWsPackage() {
  // Try the standard pnpm store location
  const candidates = [
    // From ai-institute root
    join(__dirname, "..", "..", "node_modules", ".pnpm", "@libsql+isomorphic-ws@0.1.5", "node_modules", "@libsql", "isomorphic-ws"),
    // From repo root
    join(__dirname, "..", "..", "..", "node_modules", ".pnpm", "@libsql+isomorphic-ws@0.1.5", "node_modules", "@libsql", "isomorphic-ws"),
    // In the ai-institute node_modules
    join(__dirname, "..", "node_modules", "@libsql", "isomorphic-ws"),
    // Root node_modules
    resolve(__dirname, "..", "..", "..", "node_modules", "@libsql", "isomorphic-ws"),
  ];

  for (const dir of candidates) {
    if (existsSync(join(dir, "package.json"))) {
      const pkg = JSON.parse(readFileSync(join(dir, "package.json"), "utf8"));
      if (pkg.name === "@libsql/isomorphic-ws" && pkg.version === "0.1.5") {
        return dir;
      }
    }
  }
  return null;
}

function createWebCjs(packageDir) {
  const webCjsPath = join(dir, "web.cjs");
  
  if (existsSync(webCjsPath)) {
    console.log(`[postinstall] web.cjs already exists at ${webCjsPath}`);
    return;
  }

  // web.cjs for Cloudflare Workers workerd environment
  // Cloudflare Workers has a global WebSocket implementation
  const content = `// Patched by postinstall script - @libsql/isomorphic-ws@0.1.5 missing web.cjs
// Cloudflare Workers has a global WebSocket implementation
module.exports = { WebSocket: globalThis.WebSocket };
`;

  writeFileSync(webCjsPath, content);
  console.log(`[postinstall] Created missing web.cjs at ${webCjsPath}`);
}

function main() {
  console.log("[postinstall] Patching @libsql/isomorphic-ws@0.1.5...");

  const pkgDir = findIsomorphicWsPackage();
  if (!pkgDir) {
    console.warn("[postinstall] WARNING: Could not find @libsql/isomorphic-ws@0.1.5 package");
    console.warn("[postinstall] This may cause OpenNext build to fail.");
    console.warn("[postinstall] Skipping patch.");
    return;
  }

  console.log(`[postinstall] Found package at: ${pkgDir}`);
  createWebCjs(pkgDir);
  console.log("[postinstall] Patch complete.");
}

main();
