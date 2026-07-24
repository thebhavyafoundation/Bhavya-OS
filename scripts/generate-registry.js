const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const registryDir = path.join(rootDir, 'registry');

if (!fs.existsSync(registryDir)) {
  fs.mkdirSync(registryDir, { recursive: true });
}

function parseAppManifest(appDir) {
  const manifestFile = path.join(appDir, 'src', 'app-manifest.ts');
  if (fs.existsSync(manifestFile)) {
    const content = fs.readFileSync(manifestFile, 'utf8');
    const idMatch = content.match(/id:\s*["']([^"']+)["']/);
    const nameMatch = content.match(/name:\s*["']([^"']+)["']/);
    const versionMatch = content.match(/version:\s*["']([^"']+)["']/);
    const ownerMatch = content.match(/owner:\s*["']([^"']+)["']/);
    const missionMatch = content.match(/mission:\s*["']([^"']+)["']/);
    const visMatch = content.match(/visibility:\s*["']([^"']+)["']/);

    return {
      id: idMatch ? idMatch[1] : null,
      name: nameMatch ? nameMatch[1] : null,
      version: versionMatch ? versionMatch[1] : "0.5.0",
      owner: ownerMatch ? ownerMatch[1] : "Platform",
      mission: missionMatch ? missionMatch[1] : "General",
      visibility: visMatch ? visMatch[1] : "public"
    };
  }
  return null;
}

function generateApps() {
  const appsDir = path.join(rootDir, 'apps');
  const portsConfig = fs.existsSync(path.join(rootDir, 'config', 'ports.json'))
    ? JSON.parse(fs.readFileSync(path.join(rootDir, 'config', 'ports.json'), 'utf8'))
    : {};

  const dirs = fs.existsSync(appsDir) ? fs.readdirSync(appsDir).filter(d => fs.statSync(path.join(appsDir, d)).isDirectory()) : [];
  
  const items = dirs.map(dirName => {
    const appDir = path.join(appsDir, dirName);
    const manifest = parseAppManifest(appDir);
    const port = portsConfig[dirName] || null;

    return {
      id: manifest?.id || dirName,
      name: manifest?.name || dirName,
      version: manifest?.version || "0.5.0",
      owner: manifest?.owner || "Platform",
      mission: manifest?.mission || "General",
      visibility: manifest?.visibility || "public",
      port: port,
      path: `apps/${dirName}`
    };
  });

  const data = {
    _notice: "GENERATED ONLY. NEVER EDIT MANUALLY. Run 'pnpm registry:generate' to update.",
    registry_type: "apps",
    generated_at: new Date().toISOString(),
    generator: "scripts/generate-registry.js",
    items
  };
  fs.writeFileSync(path.join(registryDir, 'apps.json'), JSON.stringify(data, null, 2));
}

function generatePackages() {
  const packagesDir = path.join(rootDir, 'packages');
  const dirs = fs.existsSync(packagesDir) ? fs.readdirSync(packagesDir).filter(d => fs.statSync(path.join(packagesDir, d)).isDirectory()) : [];
  const items = dirs.map(name => ({ id: `pkg.${name}`, name, path: `packages/${name}` }));
  const data = {
    _notice: "GENERATED ONLY. NEVER EDIT MANUALLY. Run 'pnpm registry:generate' to update.",
    registry_type: "packages",
    generated_at: new Date().toISOString(),
    generator: "scripts/generate-registry.js",
    items
  };
  fs.writeFileSync(path.join(registryDir, 'packages.json'), JSON.stringify(data, null, 2));
}

function generateAgents() {
  const agentsDir = path.join(rootDir, '.agents');
  const files = fs.existsSync(agentsDir) ? fs.readdirSync(agentsDir).filter(f => f.endsWith('.agent.json')) : [];
  const items = files.map(file => {
    const content = JSON.parse(fs.readFileSync(path.join(agentsDir, file), 'utf8'));
    return { id: content.id, name: content.name, role: content.role, file: `.agents/${file}` };
  });
  const data = {
    _notice: "GENERATED ONLY. NEVER EDIT MANUALLY. Run 'pnpm registry:generate' to update.",
    registry_type: "agents",
    generated_at: new Date().toISOString(),
    generator: "scripts/generate-registry.js",
    items
  };
  fs.writeFileSync(path.join(registryDir, 'agents.json'), JSON.stringify(data, null, 2));
}

function generateStandards() {
  const standardsDir = path.join(rootDir, 'standards');
  const files = fs.existsSync(standardsDir) ? fs.readdirSync(standardsDir).filter(f => f.endsWith('.md')) : [];
  const items = files.map(file => ({ id: `std.${path.basename(file, '.md')}`, file: `standards/${file}` }));
  const data = {
    _notice: "GENERATED ONLY. NEVER EDIT MANUALLY. Run 'pnpm registry:generate' to update.",
    registry_type: "standards",
    generated_at: new Date().toISOString(),
    generator: "scripts/generate-registry.js",
    items
  };
  fs.writeFileSync(path.join(registryDir, 'standards.json'), JSON.stringify(data, null, 2));
}

function generateWorkflows() {
  const items = [
    { id: "wf.dev.feature", category: "Development", name: "Feature Development" },
    { id: "wf.ops.registry", category: "Operations", name: "Registry Synchronization" },
    { id: "wf.gov.adr", category: "Governance", name: "ADR Lifecycle" },
    { id: "wf.rel.bump", category: "Release", name: "Version Bump & Release" },
    { id: "wf.inc.failover", category: "Incident", name: "Gateway Provider Failover" },
    { id: "wf.know.ingest", category: "Knowledge", name: "MDX Knowledge Ingestion" }
  ];
  const data = {
    _notice: "GENERATED ONLY. NEVER EDIT MANUALLY. Run 'pnpm registry:generate' to update.",
    registry_type: "workflows",
    generated_at: new Date().toISOString(),
    generator: "scripts/generate-registry.js",
    items
  };
  fs.writeFileSync(path.join(registryDir, 'workflows.json'), JSON.stringify(data, null, 2));
}

function generateServices() {
  const portsConfig = fs.existsSync(path.join(rootDir, 'config', 'ports.json'))
    ? JSON.parse(fs.readFileSync(path.join(rootDir, 'config', 'ports.json'), 'utf8'))
    : {};

  const items = [
    { id: "svc.ai_gateway", name: "AI Gateway Proxy", endpoint: "http://localhost:8082", status: "active" },
    { id: "svc.website", name: "Bhavya Foundation Website", endpoint: `http://localhost:${portsConfig.website || 3000}`, status: "active" },
    { id: "svc.admin_dashboard", name: "Engineering Dashboard", endpoint: `http://localhost:${portsConfig.admin || 3001}`, status: "active" },
    { id: "svc.docs", name: "Knowledge Platform", endpoint: `http://localhost:${portsConfig.docs || 3002}`, status: "active" },
    { id: "svc.transparency", name: "Transparency Portal", endpoint: `http://localhost:${portsConfig.transparency || 3003}`, status: "active" },
    { id: "svc.openhuman_rpc", name: "OpenHuman Core RPC", endpoint: "http://127.0.0.1:7788/rpc", status: "configured" }
  ];
  const data = {
    _notice: "GENERATED ONLY. NEVER EDIT MANUALLY. Run 'pnpm registry:generate' to update.",
    registry_type: "services",
    generated_at: new Date().toISOString(),
    generator: "scripts/generate-registry.js",
    items
  };
  fs.writeFileSync(path.join(registryDir, 'services.json'), JSON.stringify(data, null, 2));
}

generateApps();
generatePackages();
generateAgents();
generateStandards();
generateWorkflows();
generateServices();

console.log("✓ Institutional Registry regenerated successfully in registry/");
