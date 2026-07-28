// ── Document ───────────────────────────────────────────────

export type DocumentCategory =
  | "governance"
  | "policy"
  | "standard"
  | "adr"
  | "rfc"
  | "release"
  | "research"
  | "report"
  | "project"
  | "content"
  | "financial"
  | "source"
  | "evidence";

export type DocumentStatus =
  "draft" | "review" | "approved" | "published" | "archived";

export interface Document {
  id: string;
  title: string;
  category: DocumentCategory;
  path: string;
  content: string;
  summary: string;
  tags: string[];
  status: DocumentStatus;
  owner?: string;
  mission?: string;
  created?: string;
  updated?: string;
  readingTime: number;
  version: number;
  links: string[];
  citations: string[];
  entityIds: string[];
  metadata: Record<string, string>;
}

// ── Collection ─────────────────────────────────────────────

export interface Collection {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: DocumentCategory;
  documentIds: string[];
  created: string;
}

// ── Entity ─────────────────────────────────────────────────

export type EntityType =
  | "person"
  | "organization"
  | "location"
  | "species"
  | "project"
  | "grant"
  | "policy"
  | "law"
  | "event"
  | "concept"
  | "technology"
  | "standard"
  | "release"
  | "document";

export interface Entity {
  id: string;
  name: string;
  type: EntityType;
  description: string;
  properties: Record<string, string>;
  aliases: string[];
  documentIds: string[];
  mentions: number;
  created: string;
  updated: string;
}

// ── Relationship ───────────────────────────────────────────

export type RelationshipType =
  | "mentions"
  | "authored_by"
  | "located_in"
  | "funds"
  | "governs"
  | "implements"
  | "depends_on"
  | "related_to"
  | "cites"
  | "supersedes"
  | "part_of"
  | "targets";

export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  weight: number;
  properties: Record<string, string>;
  created: string;
}

// ── Citation ───────────────────────────────────────────────

export interface Citation {
  id: string;
  sourceDocumentId: string;
  targetDocumentId: string;
  quote?: string;
  context?: string;
  page?: number;
  created: string;
}

// ── Knowledge Graph ────────────────────────────────────────

export interface GraphNode {
  id: string;
  type: string;
  title: string;
  owner?: string;
  status?: string;
  created?: string;
  updated?: string;
  links?: string[];
}

// ── Source ─────────────────────────────────────────────────

export type SourceType =
  | "pdf"
  | "markdown"
  | "image"
  | "video"
  | "website"
  | "government"
  | "internal"
  | "dataset";

export type SourceStatus = "raw" | "indexed" | "verified" | "archived";

export interface Source {
  id: string;
  name: string;
  type: SourceType;
  url?: string;
  filePath?: string;
  author?: string;
  publishedDate?: string;
  accessedDate?: string;
  credibility: number;
  status: SourceStatus;
  tags: string[];
  projectId?: string;
  metadata: Record<string, string>;
  created: string;
}

// ── Evidence ───────────────────────────────────────────────

export type EvidenceStrength = "strong" | "moderate" | "weak" | "anecdotal";

export interface Evidence {
  id: string;
  claim: string;
  sourceId: string;
  excerpt: string;
  strength: EvidenceStrength;
  page?: number;
  confidence: number;
  notes: string;
  projectId: string;
  created: string;
}

// ── Research Project ───────────────────────────────────────

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
  entityIds: string[];
  documentIds: string[];
  findings: string[];
  recommendations: string[];
  created: string;
  updated: string;
}

// ── Review ─────────────────────────────────────────────────

export type ReviewDecision = "approve" | "revise" | "reject";

export interface Review {
  id: string;
  projectId: string;
  reviewer: string;
  decision: ReviewDecision;
  comments: string;
  created: string;
}

// ── Stats ──────────────────────────────────────────────────

export interface ContentStats {
  totalDocuments: number;
  documentsByCategory: Record<DocumentCategory, number>;
  totalGraphNodes: number;
  totalCollections: number;
  totalEntities: number;
  totalSearchResults: number;
  recentDocuments: Document[];
}

export interface ResearchStats {
  totalProjects: number;
  projectsByStatus: Record<ResearchStatus, number>;
  totalSources: number;
  sourcesByType: Record<string, number>;
  totalEvidence: number;
  evidenceByStrength: Record<EvidenceStrength, number>;
  totalReviews: number;
}

// ── Forest Domain ──────────────────────────────────────────

export type MissionStatus =
  "planning" | "active" | "monitoring" | "completed" | "on-hold" | "archived";

export interface Mission {
  id: string;
  name: string;
  description: string;
  status: MissionStatus;
  region: string;
  startDate: string;
  endDate?: string;
  goals: string[];
  tags: string[];
  siteIds: string[];
  created: string;
  updated: string;
}

export interface Site {
  id: string;
  missionId: string;
  name: string;
  description: string;
  latitude?: number;
  longitude?: number;
  areaHectares?: number;
  terrainType?: string;
  currentCondition?: string;
  surveyIds: string[];
  plantingIds: string[];
  created: string;
  updated: string;
}

export type SurveyType =
  "baseline" | "periodic" | "final" | "biodiversity" | "soil" | "water";

export interface Survey {
  id: string;
  siteId: string;
  missionId: string;
  type: SurveyType;
  title: string;
  description: string;
  conductedBy: string;
  conductedDate: string;
  findings: string[];
  speciesObserved: string[];
  conditionRating?: number;
  photos: string[];
  documentId?: string;
  created: string;
}

export type PlantingStatus =
  "planned" | "in-progress" | "completed" | "monitoring";

export interface Planting {
  id: string;
  siteId: string;
  missionId: string;
  name: string;
  status: PlantingStatus;
  species: string[];
  targetCount: number;
  plantedCount: number;
  survivalRate?: number;
  startDate: string;
  endDate?: string;
  notes: string;
  documentId?: string;
  created: string;
  updated: string;
}

export type MonitoringType =
  "growth" | "survival" | "biodiversity" | "soil" | "water" | "photo";

export interface Monitoring {
  id: string;
  plantingId?: string;
  siteId: string;
  missionId: string;
  type: MonitoringType;
  title: string;
  observations: string[];
  metrics: Record<string, number>;
  photos: string[];
  conductedBy: string;
  conductedDate: string;
  documentId?: string;
  created: string;
}

export interface Impact {
  id: string;
  missionId: string;
  title: string;
  summary: string;
  areaRestoredHectares: number;
  totalPlanted: number;
  survivalRate: number;
  speciesCount: number;
  biodiversityIndex?: number;
  carbonSequestrationTonnes?: number;
  communityMembers?: number;
  period: string;
  documentId?: string;
  created: string;
}

export interface ForestStats {
  totalMissions: number;
  missionsByStatus: Record<MissionStatus, number>;
  totalSites: number;
  totalSurveys: number;
  totalPlantings: number;
  totalMonitoring: number;
  totalImpactReports: number;
  totalAreaRestored: number;
  totalPlanted: number;
  averageSurvivalRate: number;
}
