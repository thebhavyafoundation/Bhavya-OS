#!/usr/bin/env node
/**
 * Bhavya OS — Engineering Knowledge Graph Generator
 * Reads repository-index.json and generates:
 *   - architecture-graph.json
 *   - application-graph.json
 *   - package-graph.json
 *   - component-graph.json
 *   - api-graph.json
 *   - deployment-graph.json
 *   - agent-graph.json
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";
import { mkdirSync } from "fs";

const ROOT = "F:\\Bhavya Foundation";
const INPUT = join(ROOT, "platform", "repo-intelligence", "output");
const OUTPUT = join(ROOT, "knowledge", "engineering-graphs");
mkdirSync(OUTPUT, { recursive: true });

// Load repository index
const repoIndex = JSON.parse(readFileSync(join(INPUT, "repository-index.json"), "utf-8"));
const depGraph = JSON.parse(readFileSync(join(INPUT, "dependency-graph.json"), "utf-8"));

console.log("📊 Generating Engineering Knowledge Graphs...\n");

// ── 1. Architecture Graph ────────────────────────────────────

console.log("🏛️  Architecture Graph...");
const architectureGraph = {
  name: "Architecture Graph",
  generatedAt: new Date().toISOString(),
  layers: {
    presentation: {
      description: "User-facing applications",
      nodes: repoIndex.packages.filter(p => p.type === "app").map(p => ({
        id: p.name,
        path: p.path,
        framework: p.scripts?.dev?.includes("next") ? "Next.js" : "unknown",
        routes: repoIndex.routes.filter(r => r.app === p.name).length,
      })),
    },
    platform: {
      description: "Shared platform packages",
      nodes: repoIndex.packages.filter(p => p.type === "package").map(p => ({
        id: p.name,
        path: p.path,
        purpose: inferPurpose(p),
      })),
    },
    infrastructure: {
      description: "Build, deploy, and tooling",
      nodes: [
        { id: "turbo", type: "build-system", config: "turbo.json" },
        { id: "pnpm", type: "package-manager", version: "10.17.1" },
        { id: "vercel", type: "deployment", platform: "Vercel" },
        { id: "husky", type: "git-hooks", config: ".husky/" },
        { id: "commitlint", type: "commit-convention", config: "commitlint.config.js" },
        { id: "lint-staged", type: "pre-commit", config: ".lintstagedrc.json" },
      ],
    },
    data: {
      description: "Knowledge objects and content",
      nodes: [
        { id: "knowledge-objects", path: "bhavya-ai-lab/knowledge/objects/" },
        { id: "institution-data", path: "bhavya-ai-lab/institution/" },
        { id: "constitution", path: "packages/constitution/" },
      ],
    },
  },
  connections: depGraph.edges.filter(e => e.type === "workspace").map(e => ({
    from: e.from,
    to: e.to,
    type: "depends-on",
  })),
};

writeFileSync(join(OUTPUT, "architecture-graph.json"), JSON.stringify(architectureGraph, null, 2));
console.log("  ✅ architecture-graph.json");

// ── 2. Application Graph ─────────────────────────────────────

console.log("📱 Application Graph...");
const applicationGraph = {
  name: "Application Graph",
  generatedAt: new Date().toISOString(),
  applications: repoIndex.packages.filter(p => p.type === "app").map(p => {
    const appRoutes = repoIndex.routes.filter(r => r.app === p.name);
    const appComponents = repoIndex.components.filter(c => c.package === p.name);
    return {
      id: p.name,
      path: p.path,
      version: p.version,
      framework: p.scripts?.dev?.includes("next") ? "Next.js" : "unknown",
      routes: appRoutes.map(r => ({ path: r.path, type: r.type })),
      components: appComponents.map(c => c.name),
      scripts: p.scripts,
      workspaceDependencies: depGraph.edges
        .filter(e => e.from === p.name && e.type === "workspace")
        .map(e => e.to),
    };
  }),
};

writeFileSync(join(OUTPUT, "application-graph.json"), JSON.stringify(applicationGraph, null, 2));
console.log("  ✅ application-graph.json");

// ── 3. Package Graph ─────────────────────────────────────────

console.log("📦 Package Graph...");
const packageGraph = {
  name: "Package Graph",
  generatedAt: new Date().toISOString(),
  packages: repoIndex.packages.map(p => ({
    id: p.name,
    path: p.path,
    version: p.version,
    type: p.type,
    dependencies: Object.keys(p.dependencies || {}),
    dependents: depGraph.edges
      .filter(e => e.to === p.name)
      .map(e => e.from),
  })),
  stats: {
    total: repoIndex.packages.length,
    apps: repoIndex.packages.filter(p => p.type === "app").length,
    libraries: repoIndex.packages.filter(p => p.type === "package").length,
  },
};

writeFileSync(join(OUTPUT, "package-graph.json"), JSON.stringify(packageGraph, null, 2));
console.log("  ✅ package-graph.json");

// ── 4. Component Graph ───────────────────────────────────────

console.log("🧩 Component Graph...");
const componentGraph = {
  name: "Component Graph",
  generatedAt: new Date().toISOString(),
  components: repoIndex.components.map(c => ({
    ...c,
    importCount: repoIndex.components.filter(other =>
      other.imports.some(imp => imp.includes(c.name))
    ).length,
  })),
  stats: {
    total: repoIndex.components.length,
    byPackage: groupBy(repoIndex.components, "package"),
  },
};

writeFileSync(join(OUTPUT, "component-graph.json"), JSON.stringify(componentGraph, null, 2));
console.log("  ✅ component-graph.json");

// ── 5. API Graph ─────────────────────────────────────────────

console.log("🔌 API Graph...");
const apiGraph = {
  name: "API Graph",
  generatedAt: new Date().toISOString(),
  endpoints: repoIndex.routes
    .filter(r => r.path.includes("/api/"))
    .map(r => ({
      path: r.path,
      app: r.app,
      file: r.file,
      method: inferMethod(r.path),
    })),
  serverActions: repoIndex.components
    .filter(c => {
      const content = readFileSync(join(ROOT, c.path), "utf-8").slice(0, 200);
      return content.includes('"use server"');
    })
    .map(c => ({ component: c.name, path: c.path })),
};

writeFileSync(join(OUTPUT, "api-graph.json"), JSON.stringify(apiGraph, null, 2));
console.log("  ✅ api-graph.json");

// ── 6. Deployment Graph ──────────────────────────────────────

console.log("🚀 Deployment Graph...");
const deploymentGraph = {
  name: "Deployment Graph",
  generatedAt: new Date().toISOString(),
  platforms: {
    vercel: {
      provider: "Vercel",
      projects: repoIndex.packages
        .filter(p => p.type === "app")
        .map(p => ({
          name: p.name,
          path: p.path,
          buildCommand: p.scripts?.build,
          framework: p.scripts?.dev?.includes("next") ? "nextjs" : "unknown",
        })),
    },
  },
  ci: {
    githubActions: existsSync(join(ROOT, ".github", "workflows"))
      ? readdirSync(join(ROOT, ".github", "workflows"))
      : [],
    turboPipeline: existsSync(join(ROOT, "turbo.json"))
      ? JSON.parse(readFileSync(join(ROOT, "turbo.json"), "utf-8"))
      : null,
  },
};

writeFileSync(join(OUTPUT, "deployment-graph.json"), JSON.stringify(deploymentGraph, null, 2));
console.log("  ✅ deployment-graph.json");

// ── 7. Agent Graph ───────────────────────────────────────────

console.log("🤖 Agent Graph...");
const agentGraph = {
  name: "Agent Graph",
  generatedAt: new Date().toISOString(),
  agents: [
    { id: "chief-architect", role: "Chief Architect", scope: "architecture", permissions: ["read", "write", "review"] },
    { id: "project-manager", role: "Project Manager", scope: "tasks", permissions: ["read", "write", "assign"] },
    { id: "repo-intelligence", role: "Repository Intelligence", scope: "indexing", permissions: ["read", "scan"] },
    { id: "frontend-engineer", role: "Frontend Engineer", scope: "apps/*", permissions: ["read", "write", "build"] },
    { id: "backend-engineer", role: "Backend Engineer", scope: "packages/*", permissions: ["read", "write", "build"] },
    { id: "design-system", role: "Design System", scope: "packages/platform-ui", permissions: ["read", "write", "review"] },
    { id: "qa-engineer", role: "QA Engineer", scope: "testing", permissions: ["read", "test", "report"] },
    { id: "security-engineer", role: "Security Engineer", scope: "security", permissions: ["read", "audit", "review"] },
    { id: "devops-engineer", role: "DevOps Engineer", scope: "deployment", permissions: ["read", "deploy", "monitor"] },
    { id: "documentation", role: "Documentation", scope: "docs", permissions: ["read", "write", "review"] },
  ],
  workflows: [
    { name: "feature-development", steps: ["plan", "implement", "test", "review", "document", "deploy"] },
    { name: "bug-fix", steps: ["diagnose", "fix", "test", "review", "deploy"] },
    { name: "architecture-review", steps: ["analyze", "propose", "review", "approve", "implement"] },
  ],
};

writeFileSync(join(OUTPUT, "agent-graph.json"), JSON.stringify(agentGraph, null, 2));
console.log("  ✅ agent-graph.json");

console.log("\n🎉 Engineering Knowledge Graph complete!");

// ── Helpers ──────────────────────────────────────────────────

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const val = item[key] || "unknown";
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});
}

function inferPurpose(pkg) {
  const name = pkg.name.toLowerCase();
  if (name.includes("platform-ui")) return "UI component library";
  if (name.includes("runtime")) return "Runtime engine";
  if (name.includes("constitution")) return "Governance & constitution";
  if (name.includes("impact")) return "Impact measurement";
  if (name.includes("learning")) return "Learning runtime";
  if (name.includes("content")) return "Content management";
  if (name.includes("project")) return "Project management";
  return "Shared library";
}

function inferMethod(path) {
  if (path.includes("health")) return "GET";
  if (path.includes("metrics")) return "GET";
  if (path.includes("ready")) return "GET";
  return "GET";
}
