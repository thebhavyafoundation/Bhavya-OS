import fs from "fs";
import path from "path";

const ROOT = path.resolve(process.cwd(), "../..");
const DATA_DIR = path.join(ROOT, "content/research");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function readJSON<T>(filePath: string, fallback: T): T {
  try {
    const full = path.isAbsolute(filePath)
      ? filePath
      : path.join(ROOT, filePath);
    if (fs.existsSync(full)) return JSON.parse(fs.readFileSync(full, "utf8"));
  } catch {
    /* fallback */
  }
  return fallback;
}

function writeJSON(filePath: string, data: unknown) {
  ensureDataDir();
  const full = path.join(DATA_DIR, filePath);
  fs.writeFileSync(full, JSON.stringify(data, null, 2));
}

function listDir(dirPath: string): string[] {
  try {
    const full = path.join(ROOT, dirPath);
    if (fs.existsSync(full))
      return fs.readdirSync(full).filter((f) => !f.startsWith("."));
  } catch {
    /* fallback */
  }
  return [];
}

// ── Types ─────────────────────────────────────────────────

export type ResearchStatus =
  | "idea"
  | "proposal"
  | "active"
  | "analysis"
  | "draft"
  | "review"
  | "revision"
  | "approval"
  | "published"
  | "archived";

export type SourceType =
  | "pdf"
  | "markdown"
  | "image"
  | "video"
  | "website"
  | "government"
  | "internal"
  | "dataset";
export type EvidenceStrength = "strong" | "moderate" | "weak" | "anecdotal";
export type ReviewDecision = "approve" | "revise" | "reject";

export interface ResearchProject {
  id: string;
  title: string;
  principalInvestigator: string;
  status: ResearchStatus;
  mission: string;
  tags: string[];
  startDate: string;
  endDate?: string;
  objectives: string[];
  deliverables: string[];
  sourceIds: string[];
  evidenceIds: string[];
  findings: string[];
  recommendations: string[];
  created: string;
  updated: string;
}

export interface Source {
  id: string;
  name: string;
  type: SourceType;
  url?: string;
  author?: string;
  publishedDate?: string;
  credibility: number;
  status: "raw" | "indexed" | "verified";
  tags: string[];
  projectId: string;
  created: string;
}

export interface Evidence {
  id: string;
  claim: string;
  sourceId: string;
  excerpt: string;
  strength: EvidenceStrength;
  confidence: number;
  notes: string;
  projectId: string;
  created: string;
}

export interface Review {
  id: string;
  projectId: string;
  reviewer: string;
  decision: ReviewDecision;
  comments: string;
  created: string;
}

// ── Data Layer ────────────────────────────────────────────

let _projectsCache: ResearchProject[] | null = null;
let _sourcesCache: Source[] | null = null;
let _evidenceCache: Evidence[] | null = null;
let _reviewsCache: Review[] | null = null;

function loadProjects(): ResearchProject[] {
  if (_projectsCache) return _projectsCache;
  ensureDataDir();
  const files = listDir("content/research").filter(
    (f) => f.startsWith("project-") && f.endsWith(".json"),
  );
  _projectsCache = files
    .map((f) =>
      readJSON<ResearchProject>(`content/research/${f}`, {} as ResearchProject),
    )
    .filter((p) => p.id);
  return _projectsCache;
}

function loadSources(): Source[] {
  if (_sourcesCache) return _sourcesCache;
  ensureDataDir();
  const files = listDir("content/research").filter(
    (f) => f.startsWith("source-") && f.endsWith(".json"),
  );
  _sourcesCache = files
    .map((f) => readJSON<Source>(`content/research/${f}`, {} as Source))
    .filter((s) => s.id);
  return _sourcesCache;
}

function loadEvidence(): Evidence[] {
  if (_evidenceCache) return _evidenceCache;
  ensureDataDir();
  const files = listDir("content/research").filter(
    (f) => f.startsWith("evidence-") && f.endsWith(".json"),
  );
  _evidenceCache = files
    .map((f) => readJSON<Evidence>(`content/research/${f}`, {} as Evidence))
    .filter((e) => e.id);
  return _evidenceCache;
}

function loadReviews(): Review[] {
  if (_reviewsCache) return _reviewsCache;
  ensureDataDir();
  const files = listDir("content/research").filter(
    (f) => f.startsWith("review-") && f.endsWith(".json"),
  );
  _reviewsCache = files
    .map((f) => readJSON<Review>(`content/research/${f}`, {} as Review))
    .filter((r) => r.id);
  return _reviewsCache;
}

function saveProject(project: ResearchProject) {
  writeJSON(`project-${project.id}.json`, project);
  _projectsCache = null;
}

function saveSource(source: Source) {
  writeJSON(`source-${source.id}.json`, source);
  _sourcesCache = null;
}

function saveEvidence(evidence: Evidence) {
  writeJSON(`evidence-${evidence.id}.json`, evidence);
  _evidenceCache = null;
}

function saveReview(review: Review) {
  writeJSON(`review-${review.id}.json`, review);
  _reviewsCache = null;
}

function genId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

// ── Public API ────────────────────────────────────────────

export function getProjects(): ResearchProject[] {
  return loadProjects();
}

export function getProject(id: string): ResearchProject | undefined {
  return loadProjects().find((p) => p.id === id);
}

export function getProjectsByStatus(status: ResearchStatus): ResearchProject[] {
  return loadProjects().filter((p) => p.status === status);
}

export function getProjectsByMission(mission: string): ResearchProject[] {
  return loadProjects().filter((p) => p.mission === mission);
}

export function createProject(data: {
  title: string;
  principalInvestigator: string;
  mission: string;
  tags?: string[];
  objectives?: string[];
  deliverables?: string[];
}): ResearchProject {
  const now = new Date().toISOString();
  const project: ResearchProject = {
    id: genId("proj"),
    title: data.title,
    principalInvestigator: data.principalInvestigator,
    status: "idea",
    mission: data.mission,
    tags: data.tags || [],
    startDate: now,
    objectives: data.objectives || [],
    deliverables: data.deliverables || [],
    sourceIds: [],
    evidenceIds: [],
    findings: [],
    recommendations: [],
    created: now,
    updated: now,
  };
  saveProject(project);
  return project;
}

export function updateProject(
  id: string,
  updates: Partial<ResearchProject>,
): ResearchProject | null {
  const project = getProject(id);
  if (!project) return null;
  const updated = {
    ...project,
    ...updates,
    id: project.id,
    created: project.created,
    updated: new Date().toISOString(),
  };
  saveProject(updated);
  return updated;
}

export function advanceProject(id: string): ResearchProject | null {
  const project = getProject(id);
  if (!project) return null;

  const transitions: Record<ResearchStatus, ResearchStatus> = {
    idea: "proposal",
    proposal: "active",
    active: "analysis",
    analysis: "draft",
    draft: "review",
    review: "approval",
    revision: "review",
    approval: "published",
    published: "published",
    archived: "archived",
  };

  const nextStatus = transitions[project.status];
  if (nextStatus === project.status) return null;

  return updateProject(id, { status: nextStatus });
}

export function getSources(): Source[] {
  return loadSources();
}

export function getSourcesByProject(projectId: string): Source[] {
  return loadSources().filter((s) => s.projectId === projectId);
}

export function addSource(data: {
  name: string;
  type: SourceType;
  projectId: string;
  url?: string;
  author?: string;
  credibility?: number;
  tags?: string[];
}): Source {
  const now = new Date().toISOString();
  const source: Source = {
    id: genId("src"),
    name: data.name,
    type: data.type,
    projectId: data.projectId,
    url: data.url,
    author: data.author,
    credibility: data.credibility ?? 0.5,
    status: "raw",
    tags: data.tags || [],
    created: now,
  };
  saveSource(source);
  return source;
}

export function getEvidence(): Evidence[] {
  return loadEvidence();
}

export function getEvidenceByProject(projectId: string): Evidence[] {
  return loadEvidence().filter((e) => e.projectId === projectId);
}

export function addEvidence(data: {
  claim: string;
  sourceId: string;
  excerpt: string;
  strength: EvidenceStrength;
  projectId: string;
  confidence?: number;
  notes?: string;
}): Evidence {
  const now = new Date().toISOString();
  const evidence: Evidence = {
    id: genId("ev"),
    claim: data.claim,
    sourceId: data.sourceId,
    excerpt: data.excerpt,
    strength: data.strength,
    confidence: data.confidence ?? 0.5,
    notes: data.notes || "",
    projectId: data.projectId,
    created: now,
  };
  saveEvidence(evidence);
  return evidence;
}

export function getReviews(): Review[] {
  return loadReviews();
}

export function getReviewsByProject(projectId: string): Review[] {
  return loadReviews().filter((r) => r.projectId === projectId);
}

export function addReview(data: {
  projectId: string;
  reviewer: string;
  decision: ReviewDecision;
  comments: string;
}): Review {
  const now = new Date().toISOString();
  const review: Review = {
    id: genId("rev"),
    projectId: data.projectId,
    reviewer: data.reviewer,
    decision: data.decision,
    comments: data.comments,
    created: now,
  };
  saveReview(review);

  // Auto-transition project based on review decision
  if (data.decision === "approve") {
    const project = getProject(data.projectId);
    if (project?.status === "review") {
      updateProject(data.projectId, { status: "approval" });
    }
  } else if (data.decision === "revise") {
    const project = getProject(data.projectId);
    if (project?.status === "review") {
      updateProject(data.projectId, { status: "revision" });
    }
  }

  return review;
}

// ── Stats ─────────────────────────────────────────────────

export interface ResearchStats {
  totalProjects: number;
  projectsByStatus: Record<ResearchStatus, number>;
  totalSources: number;
  sourcesByType: Record<string, number>;
  totalEvidence: number;
  evidenceByStrength: Record<EvidenceStrength, number>;
  totalReviews: number;
}

export function getResearchStats(): ResearchStats {
  const projects = loadProjects();
  const sources = loadSources();
  const evidence = loadEvidence();
  const reviews = loadReviews();

  const projectsByStatus: Record<ResearchStatus, number> = {
    idea: 0,
    proposal: 0,
    active: 0,
    analysis: 0,
    draft: 0,
    review: 0,
    revision: 0,
    approval: 0,
    published: 0,
    archived: 0,
  };
  projects.forEach((p) => projectsByStatus[p.status]++);

  const sourcesByType: Record<string, number> = {};
  sources.forEach((s) => {
    sourcesByType[s.type] = (sourcesByType[s.type] || 0) + 1;
  });

  const evidenceByStrength: Record<EvidenceStrength, number> = {
    strong: 0,
    moderate: 0,
    weak: 0,
    anecdotal: 0,
  };
  evidence.forEach((e) => evidenceByStrength[e.strength]++);

  return {
    totalProjects: projects.length,
    projectsByStatus,
    totalSources: sources.length,
    sourcesByType,
    totalEvidence: evidence.length,
    evidenceByStrength,
    totalReviews: reviews.length,
  };
}
