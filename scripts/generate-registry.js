/* global require, __dirname, console */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const registryDir = path.join(rootDir, "registry");

if (!fs.existsSync(registryDir)) {
  fs.mkdirSync(registryDir, { recursive: true });
}

const NOTICE =
  "GENERATED ONLY. NEVER EDIT MANUALLY. Run 'pnpm registry:generate' to update.";
const GENERATOR = "scripts/generate-registry.js";

function readJSON(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

// Deterministic writer: registry output must be byte-stable when sources are
// unchanged (ADR-012). The timestamp is preserved unless the generated content
// actually changed.
function writeRegistry(file, data) {
  const strip = (obj) => {
    const copy = { ...obj };
    delete copy.generated_at;
    delete copy.generatedAt;
    return JSON.stringify(copy);
  };
  const existing = fs.existsSync(file) ? readJSON(file, null) : null;
  const stampField = "generated_at" in data ? "generated_at" : "generatedAt";
  if (existing && strip(existing) === strip(data)) {
    data[stampField] = existing[stampField];
  } else {
    data[stampField] = new Date().toISOString();
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
}

function parseAppManifest(appDir) {
  const manifestFile = path.join(appDir, "src", "app-manifest.ts");
  if (!fs.existsSync(manifestFile)) return null;
  const content = fs.readFileSync(manifestFile, "utf8");
  const grab = (key) => {
    const m = content.match(new RegExp(`${key}:\\s*["']([^"']+)["']`));
    return m ? m[1] : null;
  };
  return {
    id: grab("id"),
    name: grab("name"),
    version: grab("version"),
    owner: grab("owner"),
    mission: grab("mission"),
    visibility: grab("visibility"),
  };
}

function listDirs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => {
      try {
        return fs.statSync(path.join(dir, name)).isDirectory();
      } catch {
        return false;
      }
    })
    .sort();
}

function generateApps() {
  const appsDir = path.join(rootDir, "apps");
  const ports = readJSON(path.join(rootDir, "config", "ports.json"), {});
  const items = listDirs(appsDir).map((dirName) => {
    const manifest = parseAppManifest(path.join(appsDir, dirName));
    return {
      id: (manifest && manifest.id) || dirName,
      name: (manifest && manifest.name) || dirName,
      version: (manifest && manifest.version) || "0.5.0",
      owner: (manifest && manifest.owner) || "Platform",
      mission: (manifest && manifest.mission) || "General",
      visibility: (manifest && manifest.visibility) || "public",
      port: ports[dirName] || null,
      path: `apps/${dirName}`,
    };
  });
  writeRegistry(path.join(registryDir, "apps.json"), {
    _notice: NOTICE,
    registry_type: "apps",
    generated_at: null,
    generator: GENERATOR,
    items,
  });
}

function generatePackages() {
  const items = listDirs(path.join(rootDir, "packages")).map((name) => ({
    id: `pkg.${name}`,
    name,
    path: `packages/${name}`,
  }));
  writeRegistry(path.join(registryDir, "packages.json"), {
    _notice: NOTICE,
    registry_type: "packages",
    generated_at: null,
    generator: GENERATOR,
    items,
  });
}

// Agents live in the canonical .ai/agents/registry.yaml (the legacy
// .agents/*.agent.json store was retired).
function generateAgents() {
  const registryFile = path.join(rootDir, ".ai", "agents", "registry.yaml");
  const roles = [];
  if (fs.existsSync(registryFile)) {
    const content = fs.readFileSync(registryFile, "utf8");
    const section = content.split(/^agents:\s*$/m)[1] || "";
    for (const m of section.matchAll(/^ {2}([a-z0-9-]+):\s*$/gm))
      roles.push(m[1]);
  }
  const items = roles.sort().map((role) => ({
    id: `agent.${role}`,
    name: `${role.charAt(0).toUpperCase()}${role.slice(1)} Agent`,
    role,
    file: ".ai/agents/registry.yaml",
  }));
  writeRegistry(path.join(registryDir, "agents.json"), {
    _notice: NOTICE,
    registry_type: "agents",
    generated_at: null,
    generator: GENERATOR,
    items,
  });
}

function generateStandards() {
  const standardsDir = path.join(rootDir, "standards");
  const files = fs.existsSync(standardsDir)
    ? fs
        .readdirSync(standardsDir)
        .filter((f) => f.endsWith(".md"))
        .sort()
    : [];
  const items = files.map((file) => ({
    id: `std.${path.basename(file, ".md")}`,
    file: `standards/${file}`,
  }));
  writeRegistry(path.join(registryDir, "standards.json"), {
    _notice: NOTICE,
    registry_type: "standards",
    generated_at: null,
    generator: GENERATOR,
    items,
  });
}

function generateWorkflows() {
  const items = [
    {
      id: "wf.dev.feature",
      category: "Development",
      name: "Feature Development",
    },
    {
      id: "wf.ops.registry",
      category: "Operations",
      name: "Registry Synchronization",
    },
    { id: "wf.gov.adr", category: "Governance", name: "ADR Lifecycle" },
    { id: "wf.rel.bump", category: "Release", name: "Version Bump & Release" },
    {
      id: "wf.inc.failover",
      category: "Incident",
      name: "Gateway Provider Failover",
    },
    {
      id: "wf.know.ingest",
      category: "Knowledge",
      name: "MDX Knowledge Ingestion",
    },
  ];
  writeRegistry(path.join(registryDir, "workflows.json"), {
    _notice: NOTICE,
    registry_type: "workflows",
    generated_at: null,
    generator: GENERATOR,
    items,
  });
}

function generateServices() {
  const ports = readJSON(path.join(rootDir, "config", "ports.json"), {});
  const items = [
    {
      id: "svc.ai_gateway",
      name: "AI Gateway Proxy",
      endpoint: "http://localhost:8082",
      status: "active",
    },
    {
      id: "svc.website",
      name: "Bhavya Foundation Website",
      endpoint: `http://localhost:${ports.website || 3000}`,
      status: "active",
    },
    {
      id: "svc.admin_dashboard",
      name: "Engineering Dashboard",
      endpoint: `http://localhost:${ports.admin || 3001}`,
      status: "active",
    },
    {
      id: "svc.docs",
      name: "Knowledge Platform",
      endpoint: `http://localhost:${ports.docs || 3002}`,
      status: "active",
    },
    {
      id: "svc.transparency",
      name: "Transparency Portal",
      endpoint: `http://localhost:${ports.transparency || 3003}`,
      status: "active",
    },
    {
      id: "svc.openhuman_rpc",
      name: "OpenHuman Core RPC",
      endpoint: "http://127.0.0.1:7788/rpc",
      status: "configured",
    },
  ];
  writeRegistry(path.join(registryDir, "services.json"), {
    _notice: NOTICE,
    registry_type: "services",
    generated_at: null,
    generator: GENERATOR,
    items,
  });
}

generateApps();
generatePackages();
generateAgents();
generateStandards();
generateWorkflows();
generateServices();

console.log("OK: registry/*.json regenerated by scripts/generate-registry.js");
