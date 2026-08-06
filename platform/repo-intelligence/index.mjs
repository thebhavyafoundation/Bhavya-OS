#!/usr/bin/env node
/**
 * Bhavya OS — Repository Intelligence Engine
 * Indexes the entire monorepo and outputs:
 *   - repository-index.json (folders, files, exports, imports, packages)
 *   - dependency-graph.json (workspace + npm dependencies)
 *   - route-map.json (all Next.js routes)
 *   - component-registry.json (all React components)
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, relative, basename, extname } from "path";
import { execSync } from "child_process";

const ROOT = "F:\\Bhavya Foundation";
const OUTPUT = join(ROOT, "platform", "repo-intelligence", "output");

// Ensure output dir exists
import { mkdirSync } from "fs";
mkdirSync(OUTPUT, { recursive: true });

// ── Utilities ────────────────────────────────────────────────

function walkDir(dir, depth = 0, maxDepth = 8) {
  if (depth > maxDepth) return [];
  const results = [];
  try {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === "node_modules" || entry.name === ".git" || entry.name === ".turbo") continue;
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push({ type: "dir", path: relative(ROOT, fullPath), name: entry.name });
        results.push(...walkDir(fullPath, depth + 1, maxDepth));
      } else if (entry.isFile()) {
        results.push({ type: "file", path: relative(ROOT, fullPath), name: entry.name, ext: extname(entry.name) });
      }
    }
  } catch (e) { /* skip inaccessible */ }
  return results;
}

function parsePackageJson(pkgPath) {
  try {
    const raw = readFileSync(pkgPath, "utf-8");
    return JSON.parse(raw);
  } catch { return null; }
}

function readFirstLines(filePath, n = 20) {
  try {
    const content = readFileSync(filePath, "utf-8");
    return content.split("\n").slice(0, n).join("\n");
  } catch { return ""; }
}

function extractExports(content) {
  const exports = [];
  const patterns = [
    /export\s+(?:default\s+)?(?:function|const|class|interface|type|enum)\s+(\w+)/g,
    /export\s+\{([^}]+)\}/g,
  ];
  for (const p of patterns) {
    let m;
    while ((m = p.exec(content))) {
      if (m[1]) exports.push(m[1].trim());
    }
  }
  return exports;
}

function extractImports(content) {
  const imports = new Set();
  const pattern = /from\s+["']([^"']+)["']/g;
  let m;
  while ((m = pattern.exec(content))) {
    imports.add(m[1]);
  }
  return [...imports];
}

// ── Index Repository ─────────────────────────────────────────

console.log("🔍 Scanning repository...");
const allFiles = walkDir(ROOT);
const files = allFiles.filter(f => f.type === "file");
const dirs = allFiles.filter(f => f.type === "dir");

console.log(`  Found ${files.length} files, ${dirs.length} directories`);

// ── Workspace Packages ───────────────────────────────────────

console.log("📦 Indexing workspace packages...");
const packages = [];

// Scan apps/
const appsDir = join(ROOT, "apps");
if (existsSync(appsDir)) {
  for (const name of readdirSync(appsDir)) {
    const pkgPath = join(appsDir, name, "package.json");
    const pkg = parsePackageJson(pkgPath);
    if (pkg) {
      packages.push({
        name: pkg.name || `@bhavya/${name}`,
        path: `apps/${name}`,
        version: pkg.version || "0.0.0",
        type: "app",
        dependencies: { ...pkg.dependencies, ...pkg.devDependencies },
        scripts: pkg.scripts || {},
      });
    }
  }
}

// Scan packages/
const packagesDir = join(ROOT, "packages");
if (existsSync(packagesDir)) {
  for (const name of readdirSync(packagesDir)) {
    const pkgPath = join(packagesDir, name, "package.json");
    const pkg = parsePackageJson(pkgPath);
    if (pkg) {
      packages.push({
        name: pkg.name || `@bhavya/${name}`,
        path: `packages/${name}`,
        version: pkg.version || "0.0.0",
        type: "package",
        dependencies: { ...pkg.dependencies, ...pkg.devDependencies },
        scripts: pkg.scripts || {},
      });
    }
  }
}

console.log(`  Indexed ${packages.length} packages`);

// ── Routes (Next.js) ─────────────────────────────────────────

console.log("🗺️  Mapping routes...");
const routes = [];

for (const pkg of packages) {
  if (pkg.type !== "app") continue;
  const appDir = join(ROOT, pkg.path, "src", "app");
  if (!existsSync(appDir)) continue;

  const pkgPathNorm = pkg.path.replace(/\\/g, "/");
  const routeFiles = files.filter(f => {
    const fPath = f.path.replace(/\\/g, "/");
    return fPath.startsWith(`${pkgPathNorm}/src/app/`) &&
      (f.name === "page.tsx" || f.name === "page.ts" || f.name === "page.js" || f.name === "layout.tsx");
  });

  for (const f of routeFiles) {
    const fPath = f.path.replace(/\\/g, "/");
    const routePath = fPath
      .replace(`${pkgPathNorm}/src/app`, "")
      .replace(/\/page\.(tsx|ts|js)$/, "")
      .replace(/\/layout\.(tsx|ts|js)$/, "")
      || "/";

    routes.push({
      app: pkg.name,
      path: routePath,
      file: f.path,
      type: f.name.includes("layout") ? "layout" : "page",
    });
  }
}

console.log(`  Mapped ${routes.length} routes`);

// ── Components ───────────────────────────────────────────────

console.log("🧩 Registering components...");
const components = [];

const componentFiles = files.filter(f => {
  const fPath = f.path.replace(/\\/g, "/");
  return (f.ext === ".tsx" || f.ext === ".jsx") &&
    (fPath.includes("/components/") || fPath.includes("/ui/"));
});

for (const f of componentFiles) {
  const content = readFirstLines(join(ROOT, f.path), 50);
  const exports = extractExports(content);
  const imports = extractImports(content);
  const fPath = f.path.replace(/\\/g, "/");
  const parts = fPath.split("/");

  components.push({
    path: f.path,
    name: basename(f.path, f.ext),
    exports,
    imports: imports.filter(i => i.startsWith("@/") || i.startsWith("../")),
    package: parts[1] === "apps" ? parts[2] : parts[2],
  });
}

console.log(`  Registered ${components.length} components`);

// ── Dependency Graph ─────────────────────────────────────────

console.log("🔗 Building dependency graph...");
const dependencyGraph = {
  nodes: packages.map(p => ({ id: p.name, type: p.type, path: p.path })),
  edges: [],
};

for (const pkg of packages) {
  if (pkg.dependencies) {
    for (const [dep, version] of Object.entries(pkg.dependencies)) {
      if (dep.startsWith("@bhavya/")) {
        dependencyGraph.edges.push({
          from: pkg.name,
          to: dep,
          type: "workspace",
          version,
        });
      } else {
        dependencyGraph.edges.push({
          from: pkg.name,
          to: dep,
          type: "npm",
          version,
        });
      }
    }
  }
}

console.log(`  Mapped ${dependencyGraph.edges.length} dependencies`);

// ── Git History ──────────────────────────────────────────────

console.log("📜 Collecting git history...");
let gitHistory = [];
try {
  const log = execSync('git log --oneline -50 --format="%H|%s|%ai|%an"', { cwd: ROOT, encoding: "utf-8", shell: "powershell.exe" });
  gitHistory = log.trim().split("\n").filter(Boolean).map(line => {
    const [hash, message, date, author] = line.split("|");
    return { hash, message, date, author };
  });
} catch (e) { console.log("  ⚠️  Git history unavailable"); }

console.log(`  Collected ${gitHistory.length} commits`);

// ── Build Repository Index ───────────────────────────────────

console.log("📝 Building repository index...");
const repositoryIndex = {
  name: "bhavya-os",
  version: "0.1.0",
  indexedAt: new Date().toISOString(),
  stats: {
    totalFiles: files.length,
    totalDirs: dirs.length,
    totalPackages: packages.length,
    totalRoutes: routes.length,
    totalComponents: components.length,
    totalDependencies: dependencyGraph.edges.length,
    totalCommits: gitHistory.length,
  },
  packages,
  routes,
  components,
  gitHistory,
  fileTree: {
    apps: existsSync(appsDir) ? readdirSync(appsDir) : [],
    packages: existsSync(packagesDir) ? readdirSync(packagesDir) : [],
  },
};

// ── Write Outputs ────────────────────────────────────────────

console.log("💾 Writing outputs...");

writeFileSync(join(OUTPUT, "repository-index.json"), JSON.stringify(repositoryIndex, null, 2));
console.log("  ✅ repository-index.json");

writeFileSync(join(OUTPUT, "dependency-graph.json"), JSON.stringify(dependencyGraph, null, 2));
console.log("  ✅ dependency-graph.json");

writeFileSync(join(OUTPUT, "route-map.json"), JSON.stringify(routes, null, 2));
console.log("  ✅ route-map.json");

writeFileSync(join(OUTPUT, "component-registry.json"), JSON.stringify(components, null, 2));
console.log("  ✅ component-registry.json");

console.log("\n🎉 Repository Intelligence Engine complete!");
console.log(`   ${packages.length} packages | ${routes.length} routes | ${components.length} components | ${dependencyGraph.edges.length} dependencies`);
