import fs from "fs";
import path from "path";

const ROOT = path.resolve(process.cwd(), "../../..");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function readJSON(filePath: string): any | null {
  try {
    const full = path.join(ROOT, filePath);
    if (!fs.existsSync(full)) return null;
    return JSON.parse(fs.readFileSync(full, "utf-8"));
  } catch {
    return null;
  }
}

function readMD(filePath: string): string | null {
  try {
    const full = path.join(ROOT, filePath);
    if (!fs.existsSync(full)) return null;
    return fs.readFileSync(full, "utf-8");
  } catch {
    return null;
  }
}

function listDir(dirPath: string): string[] {
  try {
    const full = path.join(ROOT, dirPath);
    if (!fs.existsSync(full)) return [];
    return fs
      .readdirSync(full)
      .filter((f) => !f.startsWith("_") && !f.startsWith("."));
  } catch {
    return [];
  }
}

// --- Knowledge Objects ---

export interface KnowledgeObject {
  id: string;
  domain: string;
  title: string;
  description: string;
  grade: number;
  subject: string;
  concepts: { name: string; description: string; difficulty: string }[];
  definitions: { term: string; definition: string }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  examples: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  misconceptions: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exercises: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  references: any[];
}

export async function getKnowledgeObjects(): Promise<KnowledgeObject[]> {
  const files = listDir("bhavya-ai-lab/knowledge/objects");
  return files
    .filter((f) => f.endsWith(".json"))
    .map((f) => readJSON(`bhavya-ai-lab/knowledge/objects/${f}`))
    .filter(Boolean);
}

// --- Content Documents ---

export interface ContentDocument {
  id: string;
  title: string;
  category: string;
  content: string;
  summary: string;
  tags: string[];
  status: string;
  metadata?: { source: string; documentType: string };
}

export async function getContentDocuments(): Promise<ContentDocument[]> {
  const files = listDir("content/knowledge");
  return files
    .filter((f) => f.endsWith(".json"))
    .map((f) => readJSON(`content/knowledge/${f}`))
    .filter(Boolean);
}

// --- Forest Data ---

export interface ForestMission {
  id: string;
  name: string;
  status: string;
  region: string;
  startDate: string;
  goals: string[];
  tags: string[];
  siteIds: string[];
}

export async function getForestMissions(): Promise<ForestMission[]> {
  const files = listDir("content/forest");
  return files
    .filter((f) => f.startsWith("mission-") && f.endsWith(".json"))
    .map((f) => readJSON(`content/forest/${f}`))
    .filter(Boolean);
}

export async function getForestStats() {
  const missions = await getForestMissions();
  const sites = listDir("content/forest").filter((f) => f.startsWith("site-"));
  const plantings = listDir("content/forest").filter((f) =>
    f.startsWith("planting-"),
  );
  return {
    totalMissions: missions.length,
    activeMissions: missions.filter(
      (m) => m.status === "active" || m.status === "in-progress",
    ).length,
    totalSites: sites.length,
    totalPlantings: plantings.length,
  };
}

// --- Governance ---

export interface GovernanceDoc {
  id: string;
  title: string;
  type: string;
  status: string;
  ratified?: string;
  owner?: string;
  summary: string;
  sections: { heading: string; body: string }[];
}

export async function getGovernanceDocs(): Promise<GovernanceDoc[]> {
  const files = listDir("content/governance");
  return files
    .filter((f) => f.endsWith(".json"))
    .map((f) => readJSON(`content/governance/${f}`))
    .filter(Boolean);
}

// --- Policies ---

export interface Policy {
  id: string;
  title: string;
  status: string;
  icon?: string;
  description: string;
  sections: { heading: string; body: string }[];
}

export async function getPolicies(): Promise<Policy[]> {
  const files = listDir("content/policies");
  return files
    .filter((f) => f.endsWith(".json"))
    .map((f) => readJSON(`content/policies/${f}`))
    .filter(Boolean);
}

// --- Research ---

export interface ResearchProject {
  id: string;
  title: string;
  status: string;
  mission: string;
  objectives: string[];
  findings: string[];
  recommendations: string[];
}

export async function getResearchProjects(): Promise<ResearchProject[]> {
  const files = listDir("content/research");
  return files
    .filter((f) => f.startsWith("project-") && f.endsWith(".json"))
    .map((f) => readJSON(`content/research/${f}`))
    .filter(Boolean);
}

// --- Projects ---

export interface Project {
  id: string;
  name: string;
  mission: string;
  budget: string;
  status: string;
  impact: string;
  sectors: {
    name: string;
    canopyDensity?: string;
    telemetry?: string;
    alerts?: number;
  }[];
}

export async function getProjects(): Promise<Project[]> {
  const files = listDir("content/projects");
  return files
    .filter((f) => f.endsWith(".json"))
    .map((f) => readJSON(`content/projects/${f}`))
    .filter(Boolean);
}

// --- Registry Data ---

export async function getRegistry(type: string) {
  return readJSON(`registry/${type}.json`);
}

export async function getApps() {
  const registry = await getRegistry("apps");
  return registry?.items || [];
}

export async function getServices() {
  const registry = await getRegistry("services");
  return registry?.items || [];
}

export async function getKnowledgeGraph() {
  return readJSON("registry/knowledge-graph.json");
}

export async function getStandards() {
  return readJSON("registry/standards.json");
}

export async function getWorkflows() {
  return readJSON("registry/workflows.json");
}

// --- Memory / Decisions ---

export async function getDecisions() {
  return readJSON("memory/decisions/_meta.json");
}

// --- Runtime ---

export async function getRuntime() {
  return readJSON("bhavya-ai-lab/runtime.json");
}

// --- Builders ---

export async function getBuilders() {
  const dirs = listDir("bhavya-ai-lab/builders");
  const builders = [];
  for (const dir of dirs) {
    const config = readJSON(`bhavya-ai-lab/builders/${dir}/builder.json`);
    if (config) builders.push(config);
  }
  return builders;
}

// --- MDX Content ---

export async function getMDXContent(name: string): Promise<string | null> {
  return readMD(`content/${name}.mdx`);
}

export function parseMDXFrontmatter(content: string) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };
  const meta: Record<string, string> = {};
  match[1].split("\n").forEach((line) => {
    const [key, ...rest] = line.split(":");
    if (key && rest.length)
      meta[key.trim()] = rest
        .join(":")
        .trim()
        .replace(/^["']|["']$/g, "");
  });
  return { meta, body: match[2] };
}

// --- Navigation ---

export async function getNavigation(name: string) {
  return readJSON(`navigation/${name}.json`);
}

// --- BBL Examples ---

export async function getBBLLessons() {
  const files = listDir("bhavya-ai-lab/bbl/examples");
  return files
    .filter((f) => f.endsWith(".bbl"))
    .map((f) => {
      const content = readMD(`bhavya-ai-lab/bbl/examples/${f}`);
      return { filename: f, content };
    })
    .filter((l) => l.content);
}

// --- Content Stats (for home page) ---

export async function getContentStats() {
  const [
    knowledgeObjects,
    contentDocs,
    forestMissions,
    governanceDocs,
    policies,
    researchProjects,
    projects,
    builders,
    apps,
    services,
    decisions,
    knowledgeGraph,
  ] = await Promise.all([
    getKnowledgeObjects(),
    getContentDocuments(),
    getForestMissions(),
    getGovernanceDocs(),
    getPolicies(),
    getResearchProjects(),
    getProjects(),
    getBuilders(),
    getApps(),
    getServices(),
    getDecisions(),
    getKnowledgeGraph(),
  ]);

  return {
    knowledgeObjects: knowledgeObjects.length,
    contentDocuments: contentDocs.length,
    forestMissions: forestMissions.length,
    governanceDocs: governanceDocs.length,
    policies: policies.length,
    researchProjects: researchProjects.length,
    projects: projects.length,
    builders: builders.length,
    apps: apps.length,
    services: services.length,
    decisions: decisions?.records?.length || 0,
    knowledgeGraphNodes: knowledgeGraph?.nodes?.length || 0,
  };
}
