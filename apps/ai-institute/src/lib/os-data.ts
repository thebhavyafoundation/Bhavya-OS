import fs from "fs";
import path from "path";
import { getReadonlyDatabase } from "@bhavya/database";
import type { DatabaseName } from "@bhavya/database";

const ROOT = path.resolve(process.cwd(), "../../..");

/**
 * Get a read-only database connection via the shared adapter.
 * Returns null if the database file doesn't exist on disk.
 */
function getForeignDb(name: DatabaseName) {
  return getReadonlyDatabase(name);
}

/**
 * Resolve bhavya-ai-lab/ path: app-local first, then workspace root fallback.
 */
function resolveLab(...segments: string[]): string {
  const appLocal = path.join(process.cwd(), "bhavya-ai-lab", ...segments);
  if (fs.existsSync(appLocal)) return appLocal;
  return path.join(ROOT, "bhavya-ai-lab", ...segments);
}

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

/**
 * List a bhavya-ai-lab/ directory: app-local first, then root fallback.
 */
function listLabDir(subdir: string): string[] {
  const appLocal = path.join(process.cwd(), "bhavya-ai-lab", subdir);
  if (fs.existsSync(appLocal)) {
    return fs
      .readdirSync(appLocal)
      .filter((f) => !f.startsWith("_") && !f.startsWith("."));
  }
  return listDir(path.join("bhavya-ai-lab", subdir));
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
  try {
    const koDir = resolveLab("knowledge", "objects");
    if (!fs.existsSync(koDir)) return [];
    return fs
      .readdirSync(koDir)
      .filter((f) => f.endsWith(".json"))
      .map((f) => {
        try {
          return JSON.parse(
            fs.readFileSync(path.join(koDir, f), "utf-8"),
          ) as KnowledgeObject;
        } catch {
          return null;
        }
      })
      .filter((item): item is KnowledgeObject => item !== null);
  } catch {
    return [];
  }
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

// --- Financials ---

export interface FinancialReport {
  id: string;
  title: string;
  period: string;
  status: string;
  approved: string;
  type: string;
  totalRevenue: number;
  totalExpenditure: number;
  notes: string;
}

export async function getFinancials(): Promise<FinancialReport[]> {
  const files = listDir("content/financials");
  return files
    .filter((f) => f.endsWith(".json"))
    .map((f) => readJSON(`content/financials/${f}`))
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
  const runtimePath = resolveLab("runtime.json");
  if (!fs.existsSync(runtimePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(runtimePath, "utf-8"));
  } catch {
    return null;
  }
}

// --- Builders ---

export async function getBuilders() {
  const dirs = listLabDir("builders");
  const builders = [];
  for (const dir of dirs) {
    const configPath = resolveLab("builders", dir, "builder.json");
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
        if (config) builders.push(config);
      } catch {
        /* skip corrupted */
      }
    }
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

// --- GitHub OS ---

export interface GitHubRepository {
  id: string;
  name: string;
  slug: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  license: string;
  health_score: number;
  technology_score: number;
  bhavya_score: number;
  engineering_maturity: string;
  architecture_summary: string;
  why_bhavya_cares: string;
  learning_difficulty: string;
  recommendation_type: string;
  tech_stack: string;
  topics: string;
}

export interface GitHubActivityEvent {
  id: string;
  type: string;
  entity_type: string;
  entity_id: string;
  title: string;
  description: string;
  created_at: string;
}

export interface GitHubTechRadarItem {
  id: string;
  name: string;
  category: string;
  ring: string;
  description: string;
  score: number;
}

export interface GitHubRecommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: string;
  status: string;
}

export interface GitHubEngineeringHealth {
  id: string;
  repository_id: string;
  overall_score: number;
  documentation_score: number;
  test_coverage_score: number;
  dependency_freshness_score: number;
  release_cadence_score: number;
  architecture_consistency_score: number;
}

export interface GitHubReview {
  id: string;
  repository_id: string;
  review_type: string;
  overall_score: number;
  architecture_score: number;
  code_organization_score: number;
  documentation_score: number;
  testing_score: number;
  strengths: string;
  weaknesses: string;
  verdict: string;
}

export interface GitHubTechnicalDebt {
  id: string;
  repository_id: string;
  category: string;
  title: string;
  description: string;
  severity: string;
  status: string;
}

export interface GitHubADR {
  id: string;
  repository_id: string;
  number: number;
  title: string;
  status: string;
  context: string;
  decision: string;
  consequences: string;
}

export interface GitHubData {
  repositories: GitHubRepository[];
  recentActivity: GitHubActivityEvent[];
  techRadar: GitHubTechRadarItem[];
  recommendations: GitHubRecommendation[];
  totalRepos: number;
  avgHealthScore: number;
  avgBhavyaScore: number;
  languageDistribution: Record<string, number>;
}

export function getGitHubData(): GitHubData {
  const db = getForeignDb("github-os");
  if (!db) {
    return {
      repositories: [],
      recentActivity: [],
      techRadar: [],
      recommendations: [],
      totalRepos: 0,
      avgHealthScore: 0,
      avgBhavyaScore: 0,
      languageDistribution: {},
    };
  }

  try {
    const repositories = db
      .prepare(
        `SELECT id, name, slug, description, language, stars, forks, license,
         health_score, technology_score, bhavya_score, engineering_maturity,
         architecture_summary, why_bhavya_cares, learning_difficulty,
         recommendation_type, tech_stack, topics
         FROM repositories ORDER BY bhavya_score DESC`,
      )
      .all() as GitHubRepository[];

    const recentActivity = db
      .prepare(
        `SELECT id, type, entity_type, entity_id, title, description, created_at
         FROM activity_events ORDER BY created_at DESC LIMIT 20`,
      )
      .all() as GitHubActivityEvent[];

    const techRadar = db
      .prepare(
        `SELECT id, name, category, ring, description, score
         FROM technology_radar ORDER BY score DESC`,
      )
      .all() as GitHubTechRadarItem[];

    const recommendations = db
      .prepare(
        `SELECT id, type, title, description, priority, status
         FROM recommendations ORDER BY
         CASE priority WHEN 'critical' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END`,
      )
      .all() as GitHubRecommendation[];

    const stats = db
      .prepare(
        `SELECT COUNT(*) as total,
         AVG(health_score) as avg_health,
         AVG(bhavya_score) as avg_bhavya
         FROM repositories`,
      )
      .get() as { total: number; avg_health: number; avg_bhavya: number };

    const langRows = db
      .prepare(
        `SELECT language, COUNT(*) as count FROM repositories WHERE language IS NOT NULL GROUP BY language`,
      )
      .all() as { language: string; count: number }[];

    const languageDistribution: Record<string, number> = {};
    langRows.forEach((r) => {
      languageDistribution[r.language] = r.count;
    });

    return {
      repositories,
      recentActivity,
      techRadar,
      recommendations,
      totalRepos: stats?.total || 0,
      avgHealthScore: Math.round((stats?.avg_health || 0) * 10) / 10,
      avgBhavyaScore: Math.round((stats?.avg_bhavya || 0) * 10) / 10,
      languageDistribution,
    };
  } catch {
    return {
      repositories: [],
      recentActivity: [],
      techRadar: [],
      recommendations: [],
      totalRepos: 0,
      avgHealthScore: 0,
      avgBhavyaScore: 0,
      languageDistribution: {},
    };
  }
}

export function getGitHubRepository(id: string): GitHubRepository | null {
  const db = getForeignDb("github-os");
  if (!db) return null;

  try {
    const repo = db
      .prepare(
        `SELECT id, name, slug, description, language, stars, forks, license,
         health_score, technology_score, bhavya_score, engineering_maturity,
         architecture_summary, why_bhavya_cares, learning_difficulty,
         recommendation_type, tech_stack, topics
         FROM repositories WHERE id = ? OR slug = ?`,
      )
      .get(id, id) as GitHubRepository | undefined;

    return repo || null;
  } catch {
    return null;
  }
}

export function getGitHubRepoHealth(
  repositoryId: string,
): GitHubEngineeringHealth | null {
  const db = getForeignDb("github-os");
  if (!db) return null;

  try {
    const health = db
      .prepare(
        `SELECT id, repository_id, overall_score, documentation_score,
         test_coverage_score, dependency_freshness_score,
         release_cadence_score, architecture_consistency_score
         FROM engineering_health WHERE repository_id = ?
         ORDER BY calculated_at DESC LIMIT 1`,
      )
      .get(repositoryId) as GitHubEngineeringHealth | undefined;

    return health || null;
  } catch {
    return null;
  }
}

export function getGitHubRepoReviews(repositoryId: string): GitHubReview[] {
  const db = getForeignDb("github-os");
  if (!db) return [];

  try {
    const reviews = db
      .prepare(
        `SELECT id, repository_id, review_type, overall_score,
         architecture_score, code_organization_score, documentation_score,
         testing_score, strengths, weaknesses, verdict
         FROM engineering_reviews WHERE repository_id = ?
         ORDER BY reviewed_at DESC`,
      )
      .all(repositoryId) as GitHubReview[];

    return reviews;
  } catch {
    return [];
  }
}

export function getGitHubRepoDebt(repositoryId: string): GitHubTechnicalDebt[] {
  const db = getForeignDb("github-os");
  if (!db) return [];

  try {
    const debt = db
      .prepare(
        `SELECT id, repository_id, category, title, description, severity, status
         FROM technical_debt WHERE repository_id = ?
         ORDER BY
         CASE severity WHEN 'critical' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END`,
      )
      .all(repositoryId) as GitHubTechnicalDebt[];

    return debt;
  } catch {
    return [];
  }
}

export function getGitHubRepoADRs(repositoryId: string): GitHubADR[] {
  const db = getForeignDb("github-os");
  if (!db) return [];

  try {
    const adrs = db
      .prepare(
        `SELECT id, repository_id, number, title, status, context, decision, consequences
         FROM adrs WHERE repository_id = ?
         ORDER BY number DESC`,
      )
      .all(repositoryId) as GitHubADR[];

    return adrs;
  } catch {
    return [];
  }
}

// --- Social OS ---

export interface SocialPublication {
  id: string;
  title: string;
  content: string;
  status: string;
  priority: string;
  source_type: string;
  platform_content: string;
  scheduled_at: string;
  published_at: string;
  created_at: string;
  tags: string;
}

export interface SocialCampaign {
  id: string;
  name: string;
  description: string;
  type: string;
  status: string;
  channels: string;
  start_date: string;
  end_date: string;
  objectives: string;
  metrics: string;
  created_at: string;
}

export interface SocialCalendarEntry {
  id: string;
  campaign_id: string;
  type: string;
  title: string;
  description: string;
  platforms: string;
  scheduled_date: string;
  status: string;
  publication_id: string;
}

export interface SocialFeedback {
  id: string;
  source: string;
  classification: string;
  content: string;
  author: string;
  sentiment: number;
  created_at: string;
}

export interface SocialInstitutionMetric {
  id: string;
  name: string;
  category: string;
  value: number;
  unit: string;
  trend: string;
  change_percent: number;
  period: string;
  collected_at: string;
}

export interface SocialData {
  publications: SocialPublication[];
  campaigns: SocialCampaign[];
  calendar: SocialCalendarEntry[];
  feedback: SocialFeedback[];
  metrics: SocialInstitutionMetric[];
  totalPublications: number;
  publishedCount: number;
  draftCount: number;
  totalCampaigns: number;
  activeCampaigns: number;
}

export function getSocialData(): SocialData {
  const db = getForeignDb("social-os");
  if (!db) {
    return {
      publications: [],
      campaigns: [],
      calendar: [],
      feedback: [],
      metrics: [],
      totalPublications: 0,
      publishedCount: 0,
      draftCount: 0,
      totalCampaigns: 0,
      activeCampaigns: 0,
    };
  }

  try {
    const publications = db
      .prepare(
        `SELECT id, title, content, status, priority, source_type,
         platform_content, scheduled_at, published_at, created_at, tags
         FROM publications ORDER BY created_at DESC LIMIT 50`,
      )
      .all() as SocialPublication[];

    const campaigns = db
      .prepare(
        `SELECT id, name, description, type, status, channels,
         start_date, end_date, objectives, metrics, created_at
         FROM campaigns ORDER BY created_at DESC`,
      )
      .all() as SocialCampaign[];

    const calendar = db
      .prepare(
        `SELECT id, campaign_id, type, title, description, platforms,
         scheduled_date, status, publication_id
         FROM editorial_calendar ORDER BY scheduled_date DESC LIMIT 30`,
      )
      .all() as SocialCalendarEntry[];

    const feedback = db
      .prepare(
        `SELECT id, source, classification, content, author, sentiment, created_at
         FROM community_feedback ORDER BY created_at DESC LIMIT 20`,
      )
      .all() as SocialFeedback[];

    const metrics = db
      .prepare(
        `SELECT id, name, category, value, unit, trend, change_percent, period, collected_at
         FROM institution_metrics ORDER BY collected_at DESC LIMIT 20`,
      )
      .all() as SocialInstitutionMetric[];

    const pubStats = db
      .prepare(
        `SELECT COUNT(*) as total,
         SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published,
         SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft
         FROM publications`,
      )
      .get() as { total: number; published: number; draft: number };

    const campStats = db
      .prepare(
        `SELECT COUNT(*) as total,
         SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active
         FROM campaigns`,
      )
      .get() as { total: number; active: number };

    return {
      publications,
      campaigns,
      calendar,
      feedback,
      metrics,
      totalPublications: pubStats?.total || 0,
      publishedCount: pubStats?.published || 0,
      draftCount: pubStats?.draft || 0,
      totalCampaigns: campStats?.total || 0,
      activeCampaigns: campStats?.active || 0,
    };
  } catch {
    return {
      publications: [],
      campaigns: [],
      calendar: [],
      feedback: [],
      metrics: [],
      totalPublications: 0,
      publishedCount: 0,
      draftCount: 0,
      totalCampaigns: 0,
      activeCampaigns: 0,
    };
  }
}

// --- Navigation ---

export async function getNavigation(name: string) {
  return readJSON(`navigation/${name}.json`);
}

// --- BBL Examples ---

export async function getBBLLessons() {
  const bblDir = resolveLab("bbl", "examples");
  if (!fs.existsSync(bblDir)) return [];
  return fs
    .readdirSync(bblDir)
    .filter((f) => f.endsWith(".bbl"))
    .map((f) => {
      try {
        const content = fs.readFileSync(path.join(bblDir, f), "utf-8");
        return { filename: f, content };
      } catch {
        return null;
      }
    })
    .filter((l): l is { filename: string; content: string } => l !== null);
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

// --- IOC (Institute of Compliance) ---

export interface IOCData {
  activeOKRs: number;
  openRisks: number;
  pendingReviews: number;
  actionsThisWeek: number;
  okrs: { id: string; title: string; status: string; progress: number }[];
  risks: { id: string; title: string; severity: string; status: string }[];
}

export interface IOCObjective {
  id: string;
  title: string;
  description: string;
  department: string;
  quarter: string;
  status: string;
  progress: number;
  key_results: string;
  initiatives: string;
}

export interface IOCRisk {
  id: string;
  title: string;
  description: string;
  severity: string;
  status: string;
  category: string;
  mitigation: string;
  owner: string;
}

export interface IOCActionItem {
  id: string;
  title: string;
  description: string;
  assignee: string;
  due_date: string;
  priority: string;
  status: string;
  related_objective_id: string;
}

export interface IOCWeeklyReview {
  id: string;
  week_start: string;
  week_end: string;
  period: string;
  summary: string;
  metrics: string;
  risks: string;
  action_items: string;
  next_week_plan: string;
  status: string;
  created_at: string;
}

export interface IOCAlert {
  id: string;
  title: string;
  message: string;
  severity: string;
  status: string;
  source: string;
  created_at: string;
}

export interface IOCEvent {
  id: string;
  type: string;
  source: string;
  payload: string;
  created_at: string;
}

export interface IOCKpi {
  id: string;
  name: string;
  category: string;
  value: number;
  unit: string;
  target: number;
  trend: string;
  change_percent: number;
  period: string;
  source: string;
}

export interface IOCSystemHealth {
  system: string;
  status: string;
  last_checked: string;
  api_available: number;
  dashboard_available: number;
  events_produced: number;
  events_consumed: number;
}

export interface IOCDecision {
  id: string;
  title: string;
  description: string;
  context: string;
  selected_option: string;
  rationale: string;
  decided_by: string;
  decided_at: string;
  status: string;
}

export interface IOCData {
  activeOKRs: number;
  openRisks: number;
  pendingReviews: number;
  actionsThisWeek: number;
  okrs: { id: string; title: string; status: string; progress: number }[];
  risks: { id: string; title: string; severity: string; status: string }[];
}

export function getIOCData(): IOCData {
  const db = getForeignDb("ioc");
  if (!db) {
    return {
      activeOKRs: 0,
      openRisks: 0,
      pendingReviews: 0,
      actionsThisWeek: 0,
      okrs: [],
      risks: [],
    };
  }

  try {
    const okrs = db
      .prepare(
        "SELECT id, title, status, progress FROM objectives WHERE status != 'completed' LIMIT 20",
      )
      .all() as {
      id: string;
      title: string;
      status: string;
      progress: number;
    }[];

    const risks = db
      .prepare(
        "SELECT id, title, severity, status FROM risks WHERE status = 'open' LIMIT 20",
      )
      .all() as {
      id: string;
      title: string;
      severity: string;
      status: string;
    }[];

    const pendingReviews = db
      .prepare(
        "SELECT COUNT(*) as count FROM weekly_reviews WHERE status = 'pending'",
      )
      .get() as { count: number } | undefined;

    const actionsThisWeek = db
      .prepare(
        "SELECT COUNT(*) as count FROM action_items WHERE created_at >= date('now', '-7 days')",
      )
      .get() as { count: number } | undefined;

    return {
      activeOKRs: okrs.length,
      openRisks: risks.length,
      pendingReviews: pendingReviews?.count || 0,
      actionsThisWeek: actionsThisWeek?.count || 0,
      okrs,
      risks,
    };
  } catch {
    return {
      activeOKRs: 0,
      openRisks: 0,
      pendingReviews: 0,
      actionsThisWeek: 0,
      okrs: [],
      risks: [],
    };
  }
}

function getIOCDb() {
  return getForeignDb("ioc");
}

export function getIOCObjectives(): IOCObjective[] {
  const db = getIOCDb();
  if (!db) return [];
  try {
    const rows = db
      .prepare(
        `SELECT id, title, description, department, quarter, status, progress,
         key_results, initiatives FROM objectives ORDER BY
         CASE status WHEN 'in_progress' THEN 0 WHEN 'not_started' THEN 1 ELSE 2 END`,
      )
      .all() as IOCObjective[];
    return rows;
  } catch {
    return [];
  }
}

export function getIOCRisks(): IOCRisk[] {
  const db = getIOCDb();
  if (!db) return [];
  try {
    return db
      .prepare(
        `SELECT id, title, description, severity, status, category, mitigation, owner
         FROM risks ORDER BY
         CASE severity WHEN 'critical' THEN 0 WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END`,
      )
      .all() as IOCRisk[];
  } catch {
    return [];
  }
}

export function getIOCActions(): IOCActionItem[] {
  const db = getIOCDb();
  if (!db) return [];
  try {
    return db
      .prepare(
        `SELECT id, title, description, assignee, due_date, priority, status, related_objective_id
         FROM action_items ORDER BY
         CASE status WHEN 'pending' THEN 0 WHEN 'in_progress' THEN 1 ELSE 2 END,
         CASE priority WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'normal' THEN 2 ELSE 3 END`,
      )
      .all() as IOCActionItem[];
  } catch {
    return [];
  }
}

export function getIOCReviews(): IOCWeeklyReview[] {
  const db = getIOCDb();
  if (!db) return [];
  try {
    return db
      .prepare(
        `SELECT id, week_start, week_end, period, summary, metrics, risks,
         action_items, next_week_plan, status, created_at
         FROM weekly_reviews ORDER BY created_at DESC LIMIT 20`,
      )
      .all() as IOCWeeklyReview[];
  } catch {
    return [];
  }
}

export function getIOCAlerts(): IOCAlert[] {
  const db = getIOCDb();
  if (!db) return [];
  try {
    return db
      .prepare(
        `SELECT id, title, message, severity, status, source, created_at
         FROM alerts WHERE status = 'active'
         ORDER BY
         CASE severity WHEN 'critical' THEN 0 WHEN 'warning' THEN 1 ELSE 2 END`,
      )
      .all() as IOCAlert[];
  } catch {
    return [];
  }
}

export function getIOCEvents(): IOCEvent[] {
  const db = getIOCDb();
  if (!db) return [];
  try {
    return db
      .prepare(
        `SELECT id, type, source, payload, created_at
         FROM institution_events ORDER BY created_at DESC LIMIT 50`,
      )
      .all() as IOCEvent[];
  } catch {
    return [];
  }
}

export function getIOCKpis(): IOCKpi[] {
  const db = getIOCDb();
  if (!db) return [];
  try {
    return db
      .prepare(
        `SELECT id, name, category, value, unit, target, trend, change_percent, period, source
         FROM institution_kpis ORDER BY collected_at DESC LIMIT 30`,
      )
      .all() as IOCKpi[];
  } catch {
    return [];
  }
}

export function getIOCHealth(): IOCSystemHealth[] {
  const db = getIOCDb();
  if (!db) return [];
  try {
    return db
      .prepare(
        `SELECT system, status, last_checked, api_available, dashboard_available,
         events_produced, events_consumed
         FROM system_health ORDER BY system`,
      )
      .all() as IOCSystemHealth[];
  } catch {
    return [];
  }
}

export function getIOCDecisions(): IOCDecision[] {
  const db = getIOCDb();
  if (!db) return [];
  try {
    return db
      .prepare(
        `SELECT id, title, description, context, selected_option, rationale,
         decided_by, decided_at, status
         FROM decisions ORDER BY created_at DESC`,
      )
      .all() as IOCDecision[];
  } catch {
    return [];
  }
}
