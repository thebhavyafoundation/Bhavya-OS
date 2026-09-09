// ─── Git OS Intelligence Engine ─────────────────────────────────────────────
// Unified pipeline: Discover → Ingest → Inspect → Score → Extract → Recommend
//
// This engine orchestrates the complete intelligence lifecycle.
// It connects the GitHub API, database, and all analysis modules.

import { getDb } from "./db";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface DiscoverOptions {
  query?: string;
  language?: string;
  topic?: string;
  minStars?: number;
  maxStars?: number;
  sort?: "stars" | "updated" | "created";
  limit?: number;
  period?: "daily" | "weekly" | "monthly";
}

export interface DiscoveredRepo {
  fullName: string;
  name: string;
  owner: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  license: string | null;
  createdAt: string;
  updatedAt: string;
  pushedAt: string;
  archived: boolean;
  openIssues: number;
}

export interface IngestedRepo extends DiscoveredRepo {
  readmeContent: string | null;
  readmeSummary: string | null;
  directoryStructure: Record<string, unknown> | null;
  defaultBranch: string;
  latestRelease: string | null;
  latestCommit: string | null;
  techStack: Record<string, unknown>;
  dependencyCount: number;
}

export interface InspectionResult {
  hasReadme: boolean;
  hasLicense: boolean;
  hasTests: boolean;
  hasCI: boolean;
  hasTypeScript: boolean;
  hasESLint: boolean;
  hasPrettier: boolean;
  hasDocumentation: boolean;
  hasExamples: boolean;
  hasChangelog: boolean;
  packageManager: string | null;
  framework: string | null;
  language: string | null;
  testFramework: string | null;
  buildSystem: string | null;
  folderStructure: string[];
  keyFiles: string[];
  architectureIndicators: string[];
  qualityIndicators: string[];
}

export interface ScoringResult {
  healthScore: number;
  technologyScore: number;
  bhavyaScore: number;
  engineeringMaturity: "emerging" | "developing" | "mature" | "exemplary";
  explanations: Record<string, string>;
}

export interface LicenseInfo {
  spdxId: string | null;
  isOsiApproved: boolean;
  isCopyleft: boolean;
  compatibilityNotes: string;
  confidence: "high" | "medium" | "low" | "unknown";
}

export interface SecurityAssessment {
  hasKnownVulnerabilities: boolean;
  dependencyRisk: "low" | "medium" | "high" | "unknown";
  supplyChainRisk: "low" | "medium" | "high" | "unknown";
  credentialExposure: boolean;
  suspiciousPatterns: string[];
  recommendations: string[];
}

export interface SkillExtraction {
  name: string;
  description: string;
  source: string;
  evidence: string[];
  applicability: string[];
  difficulty: "beginner" | "intermediate" | "advanced" | "expert";
  confidence: number;
  bhavyaRelevance: "high" | "medium" | "low";
}

export interface PatternExtraction {
  name: string;
  category: string;
  description: string;
  evidence: string;
  confidence: number;
  reusable: boolean;
}

export interface Recommendation {
  type: "adopt" | "study" | "reference" | "monitor" | "archive";
  reasoning: string;
  confidence: number;
  factors: {
    name: string;
    score: number;
    weight: number;
    explanation: string;
  }[];
}

// ─── GitHub API Client ──────────────────────────────────────────────────────

class GitHubClient {
  private token?: string;
  private baseUrl = "https://api.github.com";
  private requestCount = 0;
  private lastRequestTime = 0;

  constructor(token?: string) {
    this.token = token;
  }

  private async rateLimitedFetch(url: string): Promise<Response> {
    // Respect rate limits: max 10 requests per minute for unauthenticated
    const now = Date.now();
    const elapsed = now - this.lastRequestTime;
    if (elapsed < 6000) {
      await new Promise((r) => setTimeout(r, 6000 - elapsed));
    }

    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
      "User-Agent": "BhavyaOS-GitOS/1.0",
    };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    this.lastRequestTime = Date.now();
    this.requestCount++;
    return fetch(url, { headers });
  }

  async searchRepos(
    query: string,
    options: { sort?: string; order?: string; per_page?: number } = {},
  ): Promise<DiscoveredRepo[]> {
    const params = new URLSearchParams({
      q: query,
      sort: options.sort || "stars",
      order: options.order || "desc",
      per_page: String(options.per_page || 20),
    });

    const res = await this.rateLimitedFetch(
      `${this.baseUrl}/search/repositories?${params}`,
    );
    if (!res.ok) return [];

    const data = (await res.json()) as {
      items: Array<{
        full_name: string;
        name: string;
        owner: { login: string };
        description: string;
        html_url: string;
        stargazers_count: number;
        forks_count: number;
        language: string;
        topics: string[];
        license: { spdx_id: string } | null;
        created_at: string;
        updated_at: string;
        pushed_at: string;
        archived: boolean;
        open_issues_count: number;
      }>;
    };

    return data.items.map((r) => ({
      fullName: r.full_name,
      name: r.name,
      owner: r.owner.login,
      description: r.description || "",
      url: r.html_url,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      topics: r.topics || [],
      license: r.license?.spdx_id || null,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      pushedAt: r.pushed_at,
      archived: r.archived,
      openIssues: r.open_issues_count,
    }));
  }

  async getRepo(owner: string, repo: string): Promise<DiscoveredRepo | null> {
    const res = await this.rateLimitedFetch(
      `${this.baseUrl}/repos/${owner}/${repo}`,
    );
    if (!res.ok) return null;

    const r = (await res.json()) as {
      full_name: string;
      name: string;
      owner: { login: string };
      description: string;
      html_url: string;
      stargazers_count: number;
      forks_count: number;
      language: string;
      topics: string[];
      license: { spdx_id: string } | null;
      created_at: string;
      updated_at: string;
      pushed_at: string;
      archived: boolean;
      open_issues_count: number;
      default_branch: string;
    };

    return {
      fullName: r.full_name,
      name: r.name,
      owner: r.owner.login,
      description: r.description || "",
      url: r.html_url,
      stars: r.stargazers_count,
      forks: r.forks_count,
      language: r.language,
      topics: r.topics || [],
      license: r.license?.spdx_id || null,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      pushedAt: r.pushed_at,
      archived: r.archived,
      openIssues: r.open_issues_count,
    };
  }

  async getReadme(owner: string, repo: string): Promise<string | null> {
    const res = await this.rateLimitedFetch(
      `${this.baseUrl}/repos/${owner}/${repo}/readme`,
    );
    if (!res.ok) return null;

    const data = (await res.json()) as { content: string; encoding: string };
    if (data.encoding === "base64") {
      return Buffer.from(data.content, "base64").toString("utf-8");
    }
    return data.content;
  }

  async getDirectory(
    owner: string,
    repo: string,
    path: string = "",
    ref: string = "main",
  ): Promise<{ name: string; type: string; path: string }[] | null> {
    const url = path
      ? `${this.baseUrl}/repos/${owner}/${repo}/contents/${path}?ref=${ref}`
      : `${this.baseUrl}/repos/${owner}/${repo}/contents?ref=${ref}`;

    const res = await this.rateLimitedFetch(url);
    if (!res.ok) return null;

    const data = (await res.json()) as Array<{
      name: string;
      type: string;
      path: string;
    }>;
    return data.map((item) => ({
      name: item.name,
      type: item.type,
      path: item.path,
    }));
  }

  async getTopics(owner: string, repo: string): Promise<string[]> {
    const res = await this.rateLimitedFetch(
      `${this.baseUrl}/repos/${owner}/${repo}/topics`,
    );
    if (!res.ok) return [];

    const data = (await res.json()) as { names: string[] };
    return data.names || [];
  }

  async getReleases(
    owner: string,
    repo: string,
    limit: number = 5,
  ): Promise<{ tag: string; name: string; publishedAt: string }[]> {
    const res = await this.rateLimitedFetch(
      `${this.baseUrl}/repos/${owner}/${repo}/releases?per_page=${limit}`,
    );
    if (!res.ok) return [];

    const data = (await res.json()) as Array<{
      tag_name: string;
      name: string;
      published_at: string;
      prerelease: boolean;
    }>;

    return data
      .filter((r) => !r.prerelease)
      .map((r) => ({
        tag: r.tag_name,
        name: r.name,
        publishedAt: r.published_at,
      }));
  }

  async getLanguages(
    owner: string,
    repo: string,
  ): Promise<Record<string, number>> {
    const res = await this.rateLimitedFetch(
      `${this.baseUrl}/repos/${owner}/${repo}/languages`,
    );
    if (!res.ok) return {};
    return (await res.json()) as Record<string, number>;
  }

  getRequestCount(): number {
    return this.requestCount;
  }
}

// ─── License Intelligence ───────────────────────────────────────────────────

const OSI_APPROVED = new Set([
  "MIT",
  "Apache-2.0",
  "GPL-2.0",
  "GPL-3.0",
  "LGPL-2.1",
  "LGPL-3.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "ISC",
  "MPL-2.0",
  "Unlicense",
  "0BSD",
  "CC0-1.0",
  "BSL-1.0",
  "PostgreSQL",
  "Python-2.0",
  "Python-3.0",
  "Zlib",
  "Artistic-2.0",
  "EPL-1.0",
  "EPL-2.0",
  "CDDL-1.0",
  "CDDL-1.1",
  "CPL-1.0",
]);

const COPYLEFT = new Set([
  "GPL-2.0",
  "GPL-3.0",
  "AGPL-3.0",
  "LGPL-2.1",
  "LGPL-3.0",
  "SSPL-1.0",
  "EUPL-1.1",
  "EUPL-1.2",
  "OSL-3.0",
]);

function analyzeLicense(spdxId: string | null): LicenseInfo {
  if (!spdxId || spdxId === "NOASSERTION" || spdxId === "UNLICENSED") {
    return {
      spdxId: null,
      isOsiApproved: false,
      isCopyleft: false,
      compatibilityNotes: "No license detected — cannot recommend for reuse",
      confidence: "unknown",
    };
  }

  const isOsi = OSI_APPROVED.has(spdxId);
  const isCopyleft = COPYLEFT.has(spdxId);

  let compatibilityNotes: string;
  if (
    spdxId === "MIT" ||
    spdxId === "ISC" ||
    spdxId === "BSD-2-Clause" ||
    spdxId === "BSD-3-Clause" ||
    spdxId === "Apache-2.0"
  ) {
    compatibilityNotes =
      "Permissive license — compatible with Bhavya Foundation usage";
  } else if (isCopyleft) {
    compatibilityNotes =
      "Copyleft license — requires careful integration review";
  } else if (isOsi) {
    compatibilityNotes = "OSI-approved license — review terms before reuse";
  } else {
    compatibilityNotes =
      "License not in standard catalog — manual review required";
  }

  return {
    spdxId,
    isOsiApproved: isOsi,
    isCopyleft,
    compatibilityNotes,
    confidence: isOsi ? "high" : "medium",
  };
}

// ─── Security Assessment ────────────────────────────────────────────────────

const SUSPICIOUS_PATTERNS = [
  { pattern: /eval\s*\(/g, name: "eval() usage" },
  { pattern: /new\s+Function\s*\(/g, name: "new Function() usage" },
  { pattern: /child_process/g, name: "child_process usage" },
  { pattern: /exec\s*\(/g, name: "exec() usage" },
  { pattern: /process\.env/g, name: "environment variable access" },
  { pattern: /crypto\.createCipher\b/g, name: "deprecated crypto API" },
  { pattern: /__proto__/g, name: "prototype pollution risk" },
  { pattern: /innerHTML\s*=/g, name: "innerHTML assignment" },
  { pattern: /document\.write/g, name: "document.write usage" },
];

function assessSecurity(
  readme: string | null,
  files: string[],
): SecurityAssessment {
  const suspiciousPatterns: string[] = [];
  let hasCredentialExposure = false;

  // Check file names for suspicious patterns
  const dangerousFiles = [
    ".env",
    ".env.local",
    ".env.production",
    "id_rsa",
    "id_dsa",
    "*.pem",
    "credentials.json",
    "service-account.json",
  ];

  for (const file of files) {
    const fileName = file.split("/").pop() || file;
    if (dangerousFiles.some((d) => fileName.includes(d.replace("*", "")))) {
      hasCredentialExposure = true;
      suspiciousPatterns.push(`Potentially sensitive file: ${fileName}`);
    }
  }

  // Check README for suspicious patterns
  if (readme) {
    for (const { pattern, name } of SUSPICIOUS_PATTERNS) {
      const matches = readme.match(pattern);
      if (matches && matches.length > 3) {
        suspiciousPatterns.push(`${name} (${matches.length} occurrences)`);
      }
    }
  }

  const hasTests = files.some(
    (f) =>
      f.includes("test") ||
      f.includes("spec") ||
      f.includes("__tests__") ||
      f.includes("vitest") ||
      f.includes("jest"),
  );

  const hasCI = files.some(
    (f) =>
      f.includes(".github/workflows") ||
      f.includes(".circleci") ||
      f.includes(".travis") ||
      f.includes("Jenkinsfile"),
  );

  const recommendations: string[] = [];
  if (!hasTests) recommendations.push("Add test suite");
  if (!hasCI) recommendations.push("Add CI/CD pipeline");
  if (hasCredentialExposure)
    recommendations.push("Remove sensitive files from repository");
  if (suspiciousPatterns.length > 2)
    recommendations.push("Review flagged patterns for security concerns");

  return {
    hasKnownVulnerabilities: false, // Would need npm audit / Snyk integration
    dependencyRisk: hasTests && hasCI ? "low" : "medium",
    supplyChainRisk: "unknown",
    credentialExposure: hasCredentialExposure,
    suspiciousPatterns,
    recommendations,
  };
}

// ─── Repository Inspection ──────────────────────────────────────────────────

function inspectRepository(
  files: { name: string; type: string; path: string }[],
  readme: string | null,
  languages: Record<string, number>,
): InspectionResult {
  const fileNames = files.map((f) => f.path);
  const fileNamesStr = fileNames.join("\n").toLowerCase();

  const hasReadme = fileNames.some(
    (f) => f.endsWith("readme.md") || f.endsWith("readme"),
  );
  const hasLicense = fileNames.some(
    (f) => f === "license" || f === "license.md" || f === "license.txt",
  );
  const hasTests = fileNames.some(
    (f) =>
      f.includes("test") ||
      f.includes("spec") ||
      f.includes("__tests__") ||
      f.includes("vitest") ||
      f.includes("jest"),
  );
  const hasCI = fileNames.some(
    (f) =>
      f.includes(".github/workflows") ||
      f.includes(".circleci") ||
      f.includes(".travis"),
  );
  const hasTypeScript = fileNames.some(
    (f) => f.endsWith(".ts") || f.endsWith(".tsx") || f === "tsconfig.json",
  );
  const hasESLint = fileNames.some(
    (f) =>
      f.includes("eslint") ||
      f.includes(".eslintrc") ||
      f.includes("eslint.config"),
  );
  const hasPrettier = fileNames.some(
    (f) => f.includes("prettier") || f.includes(".prettierrc"),
  );
  const hasDocumentation = fileNames.some(
    (f) =>
      f.includes("docs/") || f.includes("documentation") || f.endsWith(".md"),
  );
  const hasExamples = fileNames.some(
    (f) => f.includes("example") || f.includes("demo") || f.includes("sample"),
  );
  const hasChangelog = fileNames.some(
    (f) =>
      f.includes("changelog") || f.includes("changes") || f.includes("history"),
  );

  // Detect package manager
  let packageManager: string | null = null;
  if (fileNames.some((f) => f === "pnpm-lock.yaml")) packageManager = "pnpm";
  else if (fileNames.some((f) => f === "yarn.lock")) packageManager = "yarn";
  else if (fileNames.some((f) => f === "package-lock.json"))
    packageManager = "npm";
  else if (fileNames.some((f) => f === "bun.lockb")) packageManager = "bun";

  // Detect framework
  let framework: string | null = null;
  if (fileNamesStr.includes("next.config")) framework = "Next.js";
  else if (fileNamesStr.includes("nuxt.config")) framework = "Nuxt";
  else if (fileNamesStr.includes("svelte.config")) framework = "SvelteKit";
  else if (fileNamesStr.includes("vite.config")) framework = "Vite";
  else if (fileNamesStr.includes("webpack.config")) framework = "Webpack";
  else if (fileNamesStr.includes("angular.json")) framework = "Angular";
  else if (fileNamesStr.includes("remix.config")) framework = "Remix";

  // Detect test framework
  let testFramework: string | null = null;
  if (fileNamesStr.includes("vitest")) testFramework = "Vitest";
  else if (fileNamesStr.includes("jest")) testFramework = "Jest";
  else if (fileNamesStr.includes("mocha")) testFramework = "Mocha";
  else if (fileNamesStr.includes("playwright")) testFramework = "Playwright";
  else if (fileNamesStr.includes("cypress")) testFramework = "Cypress";

  // Detect build system
  let buildSystem: string | null = null;
  if (fileNamesStr.includes("turbo.json")) buildSystem = "Turborepo";
  else if (fileNamesStr.includes("lerna.json")) buildSystem = "Lerna";
  else if (fileNamesStr.includes("nx.json")) buildSystem = "Nx";
  else if (fileNamesStr.includes("rush.json")) buildSystem = "Rush";

  // Detect language from file extensions
  const langFromExt: Record<string, number> = {};
  for (const f of fileNames) {
    const ext = f.split(".").pop()?.toLowerCase();
    if (ext) langFromExt[ext] = (langFromExt[ext] || 0) + 1;
  }

  const primaryLang =
    Object.entries(languages).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  // Architecture indicators
  const architectureIndicators: string[] = [];
  if (fileNames.some((f) => f.includes("src/app/")))
    architectureIndicators.push("Next.js App Router");
  if (fileNames.some((f) => f.includes("src/pages/")))
    architectureIndicators.push("Next.js Pages Router");
  if (fileNames.some((f) => f.includes("packages/")))
    architectureIndicators.push("Monorepo");
  if (fileNames.some((f) => f.includes("turbo.json")))
    architectureIndicators.push("Turborepo");
  if (fileNames.some((f) => f.includes("docker")))
    architectureIndicators.push("Docker");
  if (fileNames.some((f) => f.includes("prisma")))
    architectureIndicators.push("Prisma ORM");
  if (fileNames.some((f) => f.includes("drizzle")))
    architectureIndicators.push("Drizzle ORM");

  // Quality indicators
  const qualityIndicators: string[] = [];
  if (hasTests) qualityIndicators.push("has tests");
  if (hasCI) qualityIndicators.push("has CI/CD");
  if (hasTypeScript) qualityIndicators.push("TypeScript");
  if (hasESLint) qualityIndicators.push("ESLint");
  if (hasPrettier) qualityIndicators.push("Prettier");
  if (hasDocumentation) qualityIndicators.push("documented");
  if (hasChangelog) qualityIndicators.push("changelog");

  const folderStructure = files
    .filter((f) => f.type === "dir")
    .map((f) => f.path)
    .slice(0, 30);

  const keyFiles = files
    .filter((f) => {
      const name = f.name.toLowerCase();
      return (
        name === "package.json" ||
        name === "tsconfig.json" ||
        name === "readme.md" ||
        name === "license" ||
        name === "turbo.json" ||
        name === ".gitignore" ||
        name.endsWith("config.ts") ||
        name.endsWith("config.js")
      );
    })
    .map((f) => f.path)
    .slice(0, 20);

  return {
    hasReadme,
    hasLicense,
    hasTests,
    hasCI,
    hasTypeScript,
    hasESLint,
    hasPrettier,
    hasDocumentation,
    hasExamples,
    hasChangelog,
    packageManager,
    framework,
    language: primaryLang,
    testFramework,
    buildSystem,
    folderStructure,
    keyFiles,
    architectureIndicators,
    qualityIndicators,
  };
}

// ─── Scoring Engine ─────────────────────────────────────────────────────────

function calculateScores(
  repo: DiscoveredRepo,
  inspection: InspectionResult,
  license: LicenseInfo,
  security: SecurityAssessment,
): ScoringResult {
  // Health Score (0-100)
  let health = 50; // Base
  if (inspection.hasReadme) health += 10;
  if (inspection.hasLicense) health += 8;
  if (inspection.hasTests) health += 12;
  if (inspection.hasCI) health += 8;
  if (inspection.hasChangelog) health += 4;
  if (inspection.hasDocumentation) health += 5;
  if (repo.openIssues < 10) health += 3;
  health = Math.min(100, health);

  // Technology Score (0-100)
  let tech = 50;
  if (inspection.hasTypeScript) tech += 15;
  if (inspection.hasESLint) tech += 8;
  if (inspection.hasPrettier) tech += 5;
  if (inspection.framework) tech += 10;
  if (inspection.testFramework) tech += 10;
  if (inspection.buildSystem) tech += 5;
  if (inspection.packageManager) tech += 5;
  tech = Math.min(100, tech);

  // Bhavya Score (0-100) — relevance to Bhavya Foundation
  let bhavya = 40; // Base

  // Bonus for technologies Bhavya uses
  const bhavyaTechs = [
    "typescript",
    "next",
    "react",
    "tailwind",
    "sqlite",
    "vitest",
    "playwright",
    "pnpm",
    "turborepo",
  ];
  const repoTechStr = (
    inspection.framework +
    " " +
    inspection.packageManager +
    " " +
    inspection.buildSystem +
    " " +
    inspection.language
  ).toLowerCase();
  for (const tech of bhavyaTechs) {
    if (repoTechStr.includes(tech)) bhavya += 3;
  }

  // Bonus for quality indicators
  bhavya += inspection.qualityIndicators.length * 2;

  // Penalty for issues
  if (repo.openIssues > 50) bhavya -= 5;
  if (repo.archived) bhavya -= 20;

  // License bonus
  if (license.isOsiApproved && !license.isCopyleft) bhavya += 8;
  else if (license.isCopyleft) bhavya -= 5;

  // Security bonus
  if (!security.credentialExposure && security.suspiciousPatterns.length === 0)
    bhavya += 5;

  bhavya = Math.min(100, Math.max(0, bhavya));

  // Engineering Maturity
  let maturity: ScoringResult["engineeringMaturity"] = "emerging";
  if (health > 80 && tech > 80) maturity = "exemplary";
  else if (health > 65 && tech > 65) maturity = "mature";
  else if (health > 50 && tech > 50) maturity = "developing";

  const explanations: Record<string, string> = {
    health: `Score ${health}/100 based on README, license, tests, CI, docs, and issue health`,
    technology: `Score ${tech}/100 based on TypeScript, linting, formatting, frameworks, and build tools`,
    bhavya: `Score ${bhavya}/100 based on technology alignment, quality indicators, licensing, and security`,
  };

  return {
    healthScore: health,
    technologyScore: tech,
    bhavyaScore: bhavya,
    engineeringMaturity: maturity,
    explanations,
  };
}

// ─── Knowledge Graph Builder ────────────────────────────────────────────────

function buildKnowledgeGraph(
  repoId: string,
  repo: DiscoveredRepo,
  inspection: InspectionResult,
  skills: SkillExtraction[],
  patterns: PatternExtraction[],
): {
  nodes: { id: string; type: string; label: string }[];
  edges: { source: string; target: string; relationship: string }[];
} {
  const nodes: { id: string; type: string; label: string }[] = [];
  const edges: { source: string; target: string; relationship: string }[] = [];

  // Repository node
  nodes.push({ id: repoId, type: "repository", label: repo.fullName });

  // Language node
  if (repo.language) {
    const langId = `lang-${repo.language.toLowerCase()}`;
    nodes.push({ id: langId, type: "technology", label: repo.language });
    edges.push({ source: repoId, target: langId, relationship: "uses" });
  }

  // Framework node
  if (inspection.framework) {
    const fwId = `fw-${inspection.framework.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    nodes.push({ id: fwId, type: "framework", label: inspection.framework });
    edges.push({ source: repoId, target: fwId, relationship: "uses" });
  }

  // Skill nodes
  for (const skill of skills) {
    const skillId = `skill-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    nodes.push({ id: skillId, type: "pattern", label: skill.name });
    edges.push({ source: repoId, target: skillId, relationship: "implements" });
  }

  // Pattern nodes
  for (const pattern of patterns) {
    const patId = `pat-${pattern.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`;
    nodes.push({ id: patId, type: "pattern", label: pattern.name });
    edges.push({ source: repoId, target: patId, relationship: "implements" });
  }

  return { nodes, edges };
}

// ─── Main Intelligence Pipeline ─────────────────────────────────────────────

export class IntelligenceEngine {
  private client: GitHubClient;
  private db = getDb();

  constructor(githubToken?: string) {
    this.client = new GitHubClient(githubToken);
  }

  /**
   * STEP 1: DISCOVER — Find repositories matching criteria
   */
  async discover(options: DiscoverOptions = {}): Promise<DiscoveredRepo[]> {
    const {
      query = "stars:>50",
      language,
      topic,
      minStars,
      maxStars,
      sort = "stars",
      limit = 20,
    } = options;

    let searchQuery = query;
    if (language) searchQuery += ` language:${language}`;
    if (topic) searchQuery += ` topic:${topic}`;
    if (minStars) searchQuery += ` stars:>=${minStars}`;
    if (maxStars) searchQuery += ` stars:<=${maxStars}`;

    const repos = await this.client.searchRepos(searchQuery, {
      sort,
      per_page: limit,
    });

    // Filter out archived repos
    return repos.filter((r) => !r.archived);
  }

  /**
   * STEP 2: INGEST — Fetch detailed metadata for a repository
   */
  async ingest(repo: DiscoveredRepo): Promise<IngestedRepo> {
    const [owner, name] = repo.fullName.split("/");

    // Fetch README
    const readmeContent = await this.client.getReadme(owner, name);

    // Fetch directory structure (top level)
    const dirContents = await this.client.getDirectory(owner, name);
    const directoryStructure = dirContents
      ? { files: dirContents.map((f) => f.name), total: dirContents.length }
      : null;

    // Fetch releases
    const releases = await this.client.getReleases(owner, name);
    const latestRelease = releases.length > 0 ? releases[0].tag : null;

    // Fetch languages
    const languages = await this.client.getLanguages(owner, name);
    const techStack = {
      languages,
      totalBytes: Object.values(languages).reduce((a, b) => a + b, 0),
    };

    // Count dependencies
    let dependencyCount = 0;
    if (readmeContent) {
      const depMatches = readmeContent.match(/dependencies|packages|modules/gi);
      dependencyCount = depMatches ? depMatches.length : 0;
    }

    return {
      ...repo,
      readmeContent,
      readmeSummary: readmeContent
        ? readmeContent
            .slice(0, 500)
            .replace(/[#*_`]/g, "")
            .trim()
        : null,
      directoryStructure,
      defaultBranch: "main",
      latestRelease,
      latestCommit: null,
      techStack,
      dependencyCount,
    };
  }

  /**
   * STEP 3: INSPECT — Analyze repository structure and quality
   */
  async inspect(ingested: IngestedRepo): Promise<InspectionResult> {
    const [owner, name] = ingested.fullName.split("/");

    // Fetch top-level files for inspection
    const files = await this.client.getDirectory(owner, name);
    const fileList = files || [];

    // Fetch languages for language detection
    const languages = await this.client.getLanguages(owner, name);

    return inspectRepository(fileList, ingested.readmeContent, languages);
  }

  /**
   * STEP 4: SCORE — Calculate quality and relevance scores
   */
  score(
    repo: DiscoveredRepo,
    inspection: InspectionResult,
    license: LicenseInfo,
    security: SecurityAssessment,
  ): ScoringResult {
    return calculateScores(repo, inspection, license, security);
  }

  /**
   * STEP 5: EXTRACT SKILLS — Identify reusable engineering skills
   */
  extractSkills(
    repo: DiscoveredRepo,
    inspection: InspectionResult,
  ): SkillExtraction[] {
    const skills: SkillExtraction[] = [];

    if (inspection.hasTests) {
      skills.push({
        name: "Testing Strategy",
        description: `Repository demonstrates ${inspection.testFramework || "testing"} practices`,
        source: repo.fullName,
        evidence: [
          `Has test files, uses ${inspection.testFramework || "unknown"} framework`,
        ],
        applicability: ["Testing", "Quality Assurance"],
        difficulty: "intermediate",
        confidence: 0.8,
        bhavyaRelevance: "high",
      });
    }

    if (inspection.hasCI) {
      skills.push({
        name: "CI/CD Pipeline",
        description: "Repository has continuous integration configured",
        source: repo.fullName,
        evidence: ["CI/CD configuration files present"],
        applicability: ["DevOps", "Automation"],
        difficulty: "intermediate",
        confidence: 0.9,
        bhavyaRelevance: "high",
      });
    }

    if (inspection.hasTypeScript) {
      skills.push({
        name: "TypeScript Engineering",
        description: "Repository uses TypeScript for type safety",
        source: repo.fullName,
        evidence: ["TypeScript configuration and source files present"],
        applicability: ["TypeScript", "Frontend", "Backend"],
        difficulty: "beginner",
        confidence: 0.95,
        bhavyaRelevance: "high",
      });
    }

    if (inspection.buildSystem) {
      skills.push({
        name: "Monorepo Management",
        description: `Uses ${inspection.buildSystem} for monorepo orchestration`,
        source: repo.fullName,
        evidence: [`${inspection.buildSystem} configuration found`],
        applicability: ["Build Systems", "Monorepo"],
        difficulty: "advanced",
        confidence: 0.85,
        bhavyaRelevance: "medium",
      });
    }

    if (inspection.hasESLint && inspection.hasPrettier) {
      skills.push({
        name: "Code Quality Toolchain",
        description: "ESLint + Prettier for consistent code quality",
        source: repo.fullName,
        evidence: ["ESLint and Prettier configurations present"],
        applicability: ["Code Quality", "DX"],
        difficulty: "beginner",
        confidence: 0.9,
        bhavyaRelevance: "high",
      });
    }

    return skills;
  }

  /**
   * STEP 6: EXTRACT PATTERNS — Identify architectural patterns
   */
  extractPatterns(
    repo: DiscoveredRepo,
    inspection: InspectionResult,
    readme: string | null,
  ): PatternExtraction[] {
    const patterns: PatternExtraction[] = [];

    if (inspection.architectureIndicators.includes("Monorepo")) {
      patterns.push({
        name: "Monorepo Architecture",
        category: "architectural",
        description:
          "Multiple packages in a single repository with shared tooling",
        evidence: "Monorepo directory structure detected",
        confidence: 0.9,
        reusable: true,
      });
    }

    if (inspection.framework === "Next.js") {
      patterns.push({
        name: "Next.js App Router",
        category: "architectural",
        description: "File-based routing with React Server Components",
        evidence: "Next.js configuration and app directory detected",
        confidence: 0.95,
        reusable: true,
      });
    }

    if (inspection.hasTests && inspection.hasCI) {
      patterns.push({
        name: "Test-Driven CI",
        category: "operational",
        description: "Automated testing in CI pipeline",
        evidence: "Test files and CI configuration present",
        confidence: 0.85,
        reusable: true,
      });
    }

    if (readme) {
      if (readme.toLowerCase().includes("provider pattern")) {
        patterns.push({
          name: "Provider Pattern",
          category: "creational",
          description: "Abstract integrations behind provider interfaces",
          evidence: "Documented in README",
          confidence: 0.7,
          reusable: true,
        });
      }
      if (readme.toLowerCase().includes("event-driven")) {
        patterns.push({
          name: "Event-Driven Architecture",
          category: "behavioral",
          description: "Components communicate through domain events",
          evidence: "Documented in README",
          confidence: 0.7,
          reusable: true,
        });
      }
    }

    return patterns;
  }

  /**
   * STEP 7: ANALYZE LICENSE — Determine license compatibility
   */
  analyzeLicense(repo: DiscoveredRepo): LicenseInfo {
    return analyzeLicense(repo.license);
  }

  /**
   * STEP 8: ASSESS SECURITY — Evaluate security posture
   */
  async assessSecurity(
    repo: DiscoveredRepo,
    ingested: IngestedRepo,
  ): Promise<SecurityAssessment> {
    const [owner, name] = repo.fullName.split("/");
    const files = await this.client.getDirectory(owner, name);
    const fileList = files?.map((f) => f.path) || [];
    return assessSecurity(ingested.readmeContent, fileList);
  }

  /**
   * STEP 9: RECOMMEND — Generate adoption recommendation
   */
  recommend(
    repo: DiscoveredRepo,
    scores: ScoringResult,
    license: LicenseInfo,
    security: SecurityAssessment,
    inspection: InspectionResult,
  ): Recommendation {
    const factors: Recommendation["factors"] = [];

    // Factor: Health
    factors.push({
      name: "Repository Health",
      score: scores.healthScore / 10,
      weight: 0.2,
      explanation: `Health score: ${scores.healthScore}/100`,
    });

    // Factor: Technology
    factors.push({
      name: "Technology Quality",
      score: scores.technologyScore / 10,
      weight: 0.2,
      explanation: `Technology score: ${scores.technologyScore}/100`,
    });

    // Factor: Bhavya Relevance
    factors.push({
      name: "Bhavya Relevance",
      score: scores.bhavyaScore / 10,
      weight: 0.3,
      explanation: `Bhavya relevance: ${scores.bhavyaScore}/100`,
    });

    // Factor: License
    factors.push({
      name: "License Compatibility",
      score: license.isOsiApproved
        ? license.isCopyleft
          ? 5
          : 9
        : license.spdxId
          ? 4
          : 0,
      weight: 0.15,
      explanation: license.compatibilityNotes,
    });

    // Factor: Security
    factors.push({
      name: "Security Posture",
      score: security.credentialExposure
        ? 2
        : security.suspiciousPatterns.length > 2
          ? 5
          : 8,
      weight: 0.15,
      explanation: security.recommendations.join("; ") || "No issues detected",
    });

    const weightedScore =
      factors.reduce((sum, f) => sum + f.score * f.weight, 0) /
      factors.reduce((sum, f) => sum + 10 * f.weight, 0);

    let type: Recommendation["type"];
    let reasoning: string;

    if (weightedScore > 0.8 && license.isOsiApproved && !license.isCopyleft) {
      type = "adopt";
      reasoning =
        "High-quality repository with compatible licensing and strong Bhavya relevance";
    } else if (weightedScore > 0.6) {
      type = "study";
      reasoning =
        "Valuable repository worth studying for patterns and approaches";
    } else if (weightedScore > 0.4) {
      type = "reference";
      reasoning = "Useful as reference material for specific capabilities";
    } else if (weightedScore > 0.2) {
      type = "monitor";
      reasoning = "Worth monitoring for future developments";
    } else {
      type = "archive";
      reasoning = "Low relevance or significant concerns";
    }

    return {
      type,
      reasoning,
      confidence: Math.round(weightedScore * 100) / 100,
      factors,
    };
  }

  /**
   * PIPELINE: Run the complete intelligence pipeline on a repository
   */
  async analyzeRepository(repo: DiscoveredRepo): Promise<{
    ingested: IngestedRepo;
    inspection: InspectionResult;
    scores: ScoringResult;
    license: LicenseInfo;
    security: SecurityAssessment;
    skills: SkillExtraction[];
    patterns: PatternExtraction[];
    recommendation: Recommendation;
    knowledgeGraph: {
      nodes: { id: string; type: string; label: string }[];
      edges: { source: string; target: string; relationship: string }[];
    };
    provenance: {
      repository: string;
      url: string;
      analyzedAt: string;
      engineVersion: string;
    };
  }> {
    // Step 2: Ingest
    const ingested = await this.ingest(repo);

    // Step 3: Inspect
    const inspection = await this.inspect(ingested);

    // Step 4: Score
    const license = this.analyzeLicense(repo);
    const security = await this.assessSecurity(repo, ingested);
    const scores = this.score(repo, inspection, license, security);

    // Step 5: Extract Skills
    const skills = this.extractSkills(repo, inspection);

    // Step 6: Extract Patterns
    const patterns = this.extractPatterns(
      repo,
      inspection,
      ingested.readmeContent,
    );

    // Step 9: Recommend
    const recommendation = this.recommend(
      repo,
      scores,
      license,
      security,
      inspection,
    );

    // Build Knowledge Graph
    const repoId = repo.fullName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    const knowledgeGraph = buildKnowledgeGraph(
      repoId,
      repo,
      inspection,
      skills,
      patterns,
    );

    // Provenance
    const provenance = {
      repository: repo.fullName,
      url: repo.url,
      analyzedAt: new Date().toISOString(),
      engineVersion: "1.0.0",
    };

    return {
      ingested,
      inspection,
      scores,
      license,
      security,
      skills,
      patterns,
      recommendation,
      knowledgeGraph,
      provenance,
    };
  }

  /**
   * STORE: Persist analysis results to database
   */
  storeAnalysis(
    repo: DiscoveredRepo,
    analysis: Awaited<ReturnType<typeof this.analyzeRepository>>,
  ): string {
    const repoId = repo.fullName.toLowerCase().replace(/[^a-z0-9]/g, "-");

    // Upsert repository
    this.db
      .prepare(
        `
      INSERT OR REPLACE INTO repositories (
        id, name, slug, description, language, stars, forks, license, topics,
        health_score, technology_score, bhavya_score, engineering_maturity,
        architecture_summary, folder_structure, readme_content, readme_summary,
        tech_stack, patterns, dependencies, maintainers, latest_release,
        latest_commit, why_bhavya_cares, learning_difficulty, learning_prerequisites,
        learning_reading_order, mcp_recommendations, cli_recommendations,
        recommendation_type, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        repoId,
        repo.name,
        repo.fullName,
        repo.description,
        repo.language,
        repo.stars,
        repo.forks,
        repo.license,
        JSON.stringify(repo.topics),
        analysis.scores.healthScore,
        analysis.scores.technologyScore,
        analysis.scores.bhavyaScore,
        analysis.scores.engineeringMaturity,
        analysis.inspection.architectureIndicators.join("; "),
        JSON.stringify(analysis.inspection.folderStructure),
        analysis.ingested.readmeContent,
        analysis.ingested.readmeSummary,
        JSON.stringify(analysis.ingested.techStack),
        JSON.stringify(analysis.patterns.map((p) => p.name)),
        "[]",
        "[]",
        analysis.ingested.latestRelease,
        null,
        analysis.recommendation.reasoning,
        analysis.scores.engineeringMaturity === "exemplary"
          ? "advanced"
          : "intermediate",
        "[]",
        null,
        "[]",
        "[]",
        analysis.recommendation.type,
        new Date().toISOString(),
        new Date().toISOString(),
      );

    // Store knowledge graph nodes
    for (const node of analysis.knowledgeGraph.nodes) {
      this.db
        .prepare(
          `
        INSERT OR REPLACE INTO knowledge_graph_nodes (id, node_type, label, metadata)
        VALUES (?, ?, ?, ?)
      `,
        )
        .run(
          node.id,
          node.type,
          node.label,
          JSON.stringify({ source: repoId }),
        );
    }

    // Store knowledge graph edges
    for (const edge of analysis.knowledgeGraph.edges) {
      const edgeId = `edge-${edge.source}-${edge.target}-${edge.relationship}`;
      this.db
        .prepare(
          `
        INSERT OR REPLACE INTO knowledge_graph_edges (id, source_id, target_id, relationship, weight)
        VALUES (?, ?, ?, ?, 1)
      `,
        )
        .run(edgeId, edge.source, edge.target, edge.relationship);
    }

    // Store activity event
    this.db
      .prepare(
        `
      INSERT INTO activity_events (id, type, entity_type, entity_id, title, description, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
      )
      .run(
        `act-${Date.now()}`,
        "analysis",
        "repository",
        repoId,
        `Analyzed ${repo.fullName}`,
        `Health: ${analysis.scores.healthScore}, Tech: ${analysis.scores.technologyScore}, Bhavya: ${analysis.scores.bhavyaScore}`,
        new Date().toISOString(),
      );

    return repoId;
  }

  /**
   * DISCOVER + ANALYZE: Full pipeline — discover repos and analyze them
   */
  async discoverAndAnalyze(options: DiscoverOptions = {}): Promise<{
    discovered: number;
    analyzed: number;
    results: Awaited<ReturnType<IntelligenceEngine["analyzeRepository"]>>[];
    errors: string[];
  }> {
    const repos = await this.discover(options);
    const results: Awaited<
      ReturnType<IntelligenceEngine["analyzeRepository"]>
    >[] = [];
    const errors: string[] = [];

    for (const repo of repos) {
      try {
        const analysis = await this.analyzeRepository(repo);
        this.storeAnalysis(repo, analysis);
        results.push(analysis);
      } catch (err) {
        errors.push(
          `Failed to analyze ${repo.fullName}: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    }

    return {
      discovered: repos.length,
      analyzed: results.length,
      results,
      errors,
    };
  }
}
