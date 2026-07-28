import {
  ResearchProject,
  Source,
  Evidence,
  Review,
  ResearchStatus,
  SourceType,
  SourceStatus,
  EvidenceStrength,
  ReviewDecision,
  ResearchStats,
} from "./models";
import { readJSON, writeJSON, listDir, ensureDir } from "./io";

const RESEARCH_DIR = "content/research";

// ── Research Repository ────────────────────────────────────

let _projectsCache: ResearchProject[] | null = null;
let _sourcesCache: Source[] | null = null;
let _evidenceCache: Evidence[] | null = null;
let _reviewsCache: Review[] | null = null;

function genId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

function loadFiles<T>(
  pattern: string,
  cache: T[] | null,
  setter: (v: T[]) => void,
): T[] {
  if (cache) return cache;
  ensureDir(RESEARCH_DIR);
  const files = listDir(RESEARCH_DIR).filter(
    (f) => f.startsWith(pattern) && f.endsWith(".json"),
  );
  const items = files
    .map((f) => readJSON<T>(`${RESEARCH_DIR}/${f}`, {} as T))
    .filter((item) => (item as Record<string, unknown>).id);
  setter(items);
  return items;
}

function saveItem<T extends { id: string }>(
  dir: string,
  prefix: string,
  item: T,
): void {
  ensureDir(dir);
  writeJSON(dir, `${prefix}-${item.id}.json`, item);
}

// ── Projects ───────────────────────────────────────────────

export function getProjects(): ResearchProject[] {
  return loadFiles("project-", _projectsCache, (v) => {
    _projectsCache = v;
  });
}

export function getProject(id: string): ResearchProject | undefined {
  return getProjects().find((p) => p.id === id);
}

export function getProjectsByStatus(status: ResearchStatus): ResearchProject[] {
  return getProjects().filter((p) => p.status === status);
}

export function getProjectsByMission(mission: string): ResearchProject[] {
  return getProjects().filter((p) => p.mission === mission);
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
    entityIds: [],
    documentIds: [],
    findings: [],
    recommendations: [],
    created: now,
    updated: now,
  };
  saveItem(RESEARCH_DIR, "project", project);
  _projectsCache = null;
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
  saveItem(RESEARCH_DIR, "project", updated);
  _projectsCache = null;
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

// ── Sources ────────────────────────────────────────────────

export function getSources(): Source[] {
  return loadFiles("source-", _sourcesCache, (v) => {
    _sourcesCache = v;
  });
}

export function getSourcesByProject(projectId: string): Source[] {
  return getSources().filter((s) => s.projectId === projectId);
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
    status: "raw" as SourceStatus,
    tags: data.tags || [],
    metadata: {},
    created: now,
  };
  saveItem(RESEARCH_DIR, "source", source);
  _sourcesCache = null;
  return source;
}

// ── Evidence ───────────────────────────────────────────────

export function getEvidence(): Evidence[] {
  return loadFiles("evidence-", _evidenceCache, (v) => {
    _evidenceCache = v;
  });
}

export function getEvidenceByProject(projectId: string): Evidence[] {
  return getEvidence().filter((e) => e.projectId === projectId);
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
  saveItem(RESEARCH_DIR, "evidence", evidence);
  _evidenceCache = null;
  return evidence;
}

// ── Reviews ────────────────────────────────────────────────

export function getReviews(): Review[] {
  return loadFiles("review-", _reviewsCache, (v) => {
    _reviewsCache = v;
  });
}

export function getReviewsByProject(projectId: string): Review[] {
  return getReviews().filter((r) => r.projectId === projectId);
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
  saveItem(RESEARCH_DIR, "review", review);
  _reviewsCache = null;

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

// ── Research Stats ─────────────────────────────────────────

export function getResearchStats(): ResearchStats {
  const projects = getProjects();
  const sources = getSources();
  const evidence = getEvidence();
  const reviews = getReviews();

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
