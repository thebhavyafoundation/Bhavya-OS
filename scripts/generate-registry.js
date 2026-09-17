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
  const appsConfig = readJSON(path.join(rootDir, "config", "apps.json"), {});
  const configured = new Map(
    (appsConfig.apps || [])
      .filter((app) => app && app.id)
      .map((app) => [app.id, app]),
  );
  const items = listDirs(appsDir).map((dirName) => {
    const manifest = parseAppManifest(path.join(appsDir, dirName));
    const config = configured.get(dirName) || {};
    const pkg = readJSON(path.join(appsDir, dirName, "package.json"), {});
    return {
      id: (manifest && manifest.id) || dirName,
      name: (manifest && manifest.name) || config.name || pkg.name || dirName,
      version: (manifest && manifest.version) || pkg.version || "0.0.0",
      owner: (manifest && manifest.owner) || config.owner || "Platform",
      mission: (manifest && manifest.mission) || config.mission || "General",
      visibility:
        (manifest && manifest.visibility) || config.visibility || "public",
      port: ports[dirName] || config.port || null,
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

// Only directories that actually declare a package.json are workspace packages.
// The packages/ tree also contains legacy stub directories (for example
// packages/ioc/, packages/social-os/) that are not importable and must not be
// advertised as packages.
function generatePackages() {
  const items = listDirs(path.join(rootDir, "packages"))
    .filter((name) =>
      fs.existsSync(path.join(rootDir, "packages", name, "package.json")),
    )
    .map((name) => ({
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
        .filter((f) => f.endsWith(".md") && f !== "README.md")
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
  const appsConfig = readJSON(path.join(rootDir, "config", "apps.json"), {});
  const items = [
    {
      id: "svc.ai_gateway",
      name: "AI Gateway Proxy",
      endpoint: "http://localhost:8082",
      status: "active",
    },
    ...(appsConfig.apps || [])
      .filter((app) => app && app.id)
      .map((app) => ({
        id: `svc.${app.id}`,
        name: app.name || app.id,
        endpoint: `http://localhost:${ports[app.id] || app.port}`,
        status: app.status || "active",
      })),
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

// Page registry derived from the real apps/ tree. The previous hand-written
// file listed retired apps (website, forest, heritage, transparency, ...).
function generatePages() {
  const appsDir = path.join(rootDir, "apps");
  const appsConfig = readJSON(path.join(rootDir, "config", "apps.json"), {});
  const configured = new Map(
    (appsConfig.apps || [])
      .filter((app) => app && app.id)
      .map((app) => [app.id, app]),
  );
  const items = listDirs(appsDir).map((dirName) => {
    const config = configured.get(dirName) || {};
    const pkg = readJSON(path.join(appsDir, dirName, "package.json"), {});
    return {
      id: dirName,
      name: config.name || pkg.name || dirName,
      path: `apps/${dirName}`,
      status: "active",
    };
  });
  writeRegistry(path.join(registryDir, "pages.json"), {
    _notice: NOTICE,
    registry_type: "pages",
    generated_at: null,
    generator: GENERATOR,
    items,
  });
}

// Component registry derived from the canonical design system. The previous
// hand-written file pointed at apps/website/src/components/*.tsx (archived).
function generateComponents() {
  const componentsDir = path.join(
    rootDir,
    "packages",
    "platform-ui",
    "src",
    "components",
  );
  const files = fs.existsSync(componentsDir)
    ? fs
        .readdirSync(componentsDir)
        .filter((f) => f.endsWith(".tsx"))
        .sort()
    : [];
  const items = files.map((file) => ({
    id: path
      .basename(file, ".tsx")
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .toLowerCase(),
    name: path.basename(file, ".tsx"),
    path: `packages/platform-ui/src/components/${file}`,
    status: "active",
  }));
  writeRegistry(path.join(registryDir, "components.json"), {
    _notice: NOTICE,
    registry_type: "components",
    generated_at: null,
    generator: GENERATOR,
    items,
  });
}

// Index of the registry directory itself. Every entry is derived from what is
// actually on disk at generation time, so the index can never point at a
// removed store (the previous hand-written index referenced retired dot-dirs).
function generateIndex() {
  const pkg = readJSON(path.join(rootDir, "package.json"), {});
  const registries = {};
  for (const file of fs
    .readdirSync(registryDir)
    .filter((name) => name.endsWith(".json") && name !== "index.json")
    .sort()) {
    const data = readJSON(path.join(registryDir, file), {});
    const items = Array.isArray(data.items)
      ? data.items.length
      : Array.isArray(data.nodes)
        ? data.nodes.length
        : null;
    registries[path.basename(file, ".json")] = {
      path: `registry/${file}`,
      generated: Boolean(data.generator),
      generator: data.generator || null,
      items,
    };
  }

  const candidates = {
    startHere: ".ai/MASTER_CONTEXT.md",
    agents: ".ai/agents/registry.yaml",
    memory: "memory/",
    docs: "docs/",
    adrs: "docs/adr/",
    standards: "standards/",
    skills: ".opencode/skills/",
  };
  const discovery = {};
  for (const [key, rel] of Object.entries(candidates)) {
    if (fs.existsSync(path.join(rootDir, rel))) discovery[key] = rel;
  }

  writeRegistry(path.join(registryDir, "index.json"), {
    _notice: NOTICE,
    registry_type: "index",
    generated_at: null,
    generator: GENERATOR,
    version: pkg.version || "0.0.0",
    registries,
    discovery,
  });
}

generateApps();
generatePackages();
generatePages();
generateComponents();
generateAgents();
generateStandards();
generateWorkflows();
generateServices();
generateIndex();

console.log("OK: registry/*.json regenerated by scripts/generate-registry.js");
