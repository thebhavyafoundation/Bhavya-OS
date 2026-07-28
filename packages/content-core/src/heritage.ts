import {
  Mission, Site,
  MissionStatus,
  ForestStats,
} from "./models";
import { readJSON, writeJSON, listDir, ensureDir } from "./io";
import { publishFieldReport, publishSurveyResult, publishMonitoringLog, publishImpactReport } from "./publish";

// ── Heritage Domain ────────────────────────────────────────

export type AssetType =
  | "temple" | "shrine" | "monument" | "archaeological"
  | "cave" | "fort" | "palace" | "garden" | "waterbody" | "other";

export type AssetCondition = "excellent" | "good" | "fair" | "poor" | "critical" | "ruins";

export interface HeritageAsset {
  id: string;
  missionId: string;
  siteId: string;
  name: string;
  description: string;
  assetType: AssetType;
  condition: AssetCondition;
  era?: string;
  historicalSignificance?: string;
  assessmentIds: string[];
  documentationIds: string[];
  monitoringIds: string[];
  created: string;
  updated: string;
}

export type AssessmentType =
  | "structural" | "environmental" | "archaeological" | "artistic" | "comprehensive";

export interface ConditionAssessment {
  id: string;
  assetId: string;
  siteId: string;
  missionId: string;
  type: AssessmentType;
  title: string;
  description: string;
  assessedBy: string;
  assessedDate: string;
  condition: AssetCondition;
  findings: string[];
  urgentIssues: string[];
  photos: string[];
  documentId?: string;
  created: string;
}

export type DocumentationType =
  | "photography" | "3d-scan" | "drawing" | "inscription" | "oral-history" | "archive";

export interface Documentation {
  id: string;
  assetId: string;
  siteId: string;
  missionId: string;
  type: DocumentationType;
  title: string;
  description: string;
  conductedBy: string;
  conductedDate: string;
  fileRefs: string[];
  documentId?: string;
  created: string;
}

export type ConservationStatus = "planned" | "in-progress" | "completed" | "monitoring";

export interface ConservationPlan {
  id: string;
  assetId: string;
  siteId: string;
  missionId: string;
  title: string;
  description: string;
  status: ConservationStatus;
  scope: string[];
  estimatedCost?: number;
  startDate: string;
  endDate?: string;
  findings: string[];
  documentId?: string;
  created: string;
  updated: string;
}

export interface HeritageImpact {
  id: string;
  missionId: string;
  title: string;
  summary: string;
  assetsRestored: number;
  totalAssets: number;
  areaDocumentedHectares: number;
  inscriptionsRecorded: number;
  communityMembers?: number;
  period: string;
  documentId?: string;
  created: string;
}

export type HeritageMissionStatus = MissionStatus;

export interface HeritageMission {
  id: string;
  name: string;
  description: string;
  status: HeritageMissionStatus;
  region: string;
  startDate: string;
  endDate?: string;
  goals: string[];
  tags: string[];
  siteIds: string[];
  created: string;
  updated: string;
}

export interface HeritageSite {
  id: string;
  missionId: string;
  name: string;
  description: string;
  latitude?: number;
  longitude?: number;
  areaHectares?: number;
  heritageType?: string;
  assetIds: string[];
  created: string;
  updated: string;
}

export interface HeritageStats {
  totalMissions: number;
  missionsByStatus: Record<HeritageMissionStatus, number>;
  totalSites: number;
  totalAssets: number;
  assetsByType: Record<string, number>;
  assetsByCondition: Record<string, number>;
  totalAssessments: number;
  totalDocumentations: number;
  totalConservationPlans: number;
  totalImpactReports: number;
}

// ── Data Directory ─────────────────────────────────────────

const HERITAGE_DIR = "content/heritage";

function genId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

function loadFiles<T>(pattern: string, cache: T[] | null, setter: (v: T[]) => void): T[] {
  if (cache) return cache;
  ensureDir(HERITAGE_DIR);
  const files = listDir(HERITAGE_DIR).filter(
    (f) => f.startsWith(pattern) && f.endsWith(".json"),
  );
  const items = files
    .map((f) => readJSON<T>(`${HERITAGE_DIR}/${f}`, {} as T))
    .filter((item) => (item as Record<string, unknown>).id);
  setter(items);
  return items;
}

function saveItem<T extends { id: string }>(prefix: string, item: T): void {
  ensureDir(HERITAGE_DIR);
  writeJSON(HERITAGE_DIR, `${prefix}-${item.id}.json`, item);
}

// ── Missions ───────────────────────────────────────────────

let _missionsCache: HeritageMission[] | null = null;

function loadMissions(): HeritageMission[] {
  return loadFiles("mission-", _missionsCache, (v) => { _missionsCache = v; });
}

export function getHeritageMissions(): HeritageMission[] {
  return loadMissions();
}

export function getHeritageMission(id: string): HeritageMission | undefined {
  return loadMissions().find((m) => m.id === id);
}

export function createHeritageMission(data: {
  name: string;
  description: string;
  region: string;
  goals?: string[];
  tags?: string[];
}): HeritageMission {
  const now = new Date().toISOString();
  const mission: HeritageMission = {
    id: genId("hmis"),
    name: data.name,
    description: data.description,
    status: "planning",
    region: data.region,
    startDate: now,
    goals: data.goals || [],
    tags: data.tags || [],
    siteIds: [],
    created: now,
    updated: now,
  };
  saveItem("mission", mission);
  _missionsCache = null;
  publishFieldReport("heritage", "mission", mission.id, {
    title: mission.name,
    content: `Heritage Mission: ${mission.name} — ${mission.description}`,
    summary: `Region: ${mission.region}. Status: ${mission.status}.`,
    tags: mission.tags,
  });
  return mission;
}

// ── Sites ──────────────────────────────────────────────────

let _sitesCache: HeritageSite[] | null = null;

function loadSites(): HeritageSite[] {
  return loadFiles("site-", _sitesCache, (v) => { _sitesCache = v; });
}

export function getHeritageSites(): HeritageSite[] {
  return loadSites();
}

export function getHeritageSite(id: string): HeritageSite | undefined {
  return loadSites().find((s) => s.id === id);
}

export function getHeritageSitesByMission(missionId: string): HeritageSite[] {
  return loadSites().filter((s) => s.missionId === missionId);
}

export function createHeritageSite(data: {
  missionId: string;
  name: string;
  description: string;
  latitude?: number;
  longitude?: number;
  areaHectares?: number;
  heritageType?: string;
}): HeritageSite {
  const now = new Date().toISOString();
  const site: HeritageSite = {
    id: genId("hsite"),
    missionId: data.missionId,
    name: data.name,
    description: data.description,
    latitude: data.latitude,
    longitude: data.longitude,
    areaHectares: data.areaHectares,
    heritageType: data.heritageType,
    assetIds: [],
    created: now,
    updated: now,
  };
  saveItem("site", site);
  _sitesCache = null;

  const mission = getHeritageMission(data.missionId);
  if (mission) {
    const updated = { ...mission, siteIds: [...mission.siteIds, site.id], updated: now };
    saveItem("mission", updated);
    _missionsCache = null;
  }

  publishFieldReport("heritage", "site", site.id, {
    title: site.name,
    content: `Site: ${site.name} — ${site.description}`,
    summary: `Mission: ${mission?.name || data.missionId}. Heritage type: ${data.heritageType || "TBD"}.`,
  });
  return site;
}

// ── Assets ─────────────────────────────────────────────────

let _assetsCache: HeritageAsset[] | null = null;

function loadAssets(): HeritageAsset[] {
  return loadFiles("asset-", _assetsCache, (v) => { _assetsCache = v; });
}

export function getHeritageAssets(): HeritageAsset[] {
  return loadAssets();
}

export function getHeritageAsset(id: string): HeritageAsset | undefined {
  return loadAssets().find((a) => a.id === id);
}

export function getHeritageAssetsBySite(siteId: string): HeritageAsset[] {
  return loadAssets().filter((a) => a.siteId === siteId);
}

export function getHeritageAssetsByMission(missionId: string): HeritageAsset[] {
  return loadAssets().filter((a) => a.missionId === missionId);
}

export function createHeritageAsset(data: {
  missionId: string;
  siteId: string;
  name: string;
  description: string;
  assetType: AssetType;
  condition: AssetCondition;
  era?: string;
  historicalSignificance?: string;
}): HeritageAsset {
  const now = new Date().toISOString();
  const asset: HeritageAsset = {
    id: genId("hasset"),
    missionId: data.missionId,
    siteId: data.siteId,
    name: data.name,
    description: data.description,
    assetType: data.assetType,
    condition: data.condition,
    era: data.era,
    historicalSignificance: data.historicalSignificance,
    assessmentIds: [],
    documentationIds: [],
    monitoringIds: [],
    created: now,
    updated: now,
  };
  saveItem("asset", asset);
  _assetsCache = null;

  const site = getHeritageSite(data.siteId);
  if (site) {
    const updated = { ...site, assetIds: [...site.assetIds, asset.id], updated: now };
    saveItem("site", updated);
    _sitesCache = null;
  }

  publishFieldReport("heritage", "asset", asset.id, {
    title: asset.name,
    content: `Heritage Asset: ${asset.name} — ${asset.description}`,
    summary: `Type: ${asset.assetType}. Condition: ${asset.condition}. Era: ${asset.era || "TBD"}.`,
    tags: [asset.assetType, asset.condition],
  });
  return asset;
}

// ── Assessments ────────────────────────────────────────────

let _assessmentsCache: ConditionAssessment[] | null = null;

function loadAssessments(): ConditionAssessment[] {
  return loadFiles("assessment-", _assessmentsCache, (v) => { _assessmentsCache = v; });
}

export function getAssessments(): ConditionAssessment[] {
  return loadAssessments();
}

export function getAssessment(id: string): ConditionAssessment | undefined {
  return loadAssessments().find((a) => a.id === id);
}

export function getAssessmentsByAsset(assetId: string): ConditionAssessment[] {
  return loadAssessments().filter((a) => a.assetId === assetId);
}

export function createAssessment(data: {
  assetId: string;
  siteId: string;
  missionId: string;
  type: AssessmentType;
  title: string;
  description: string;
  assessedBy: string;
  assessedDate: string;
  condition: AssetCondition;
  findings?: string[];
  urgentIssues?: string[];
}): ConditionAssessment {
  const now = new Date().toISOString();
  const assessment: ConditionAssessment = {
    id: genId("hassess"),
    assetId: data.assetId,
    siteId: data.siteId,
    missionId: data.missionId,
    type: data.type,
    title: data.title,
    description: data.description,
    assessedBy: data.assessedBy,
    assessedDate: data.assessedDate,
    condition: data.condition,
    findings: data.findings || [],
    urgentIssues: data.urgentIssues || [],
    photos: [],
    created: now,
  };
  saveItem("assessment", assessment);
  _assessmentsCache = null;

  publishSurveyResult("heritage", "assessment", assessment.id, {
    title: assessment.title,
    content: `${assessment.type} assessment: ${assessment.title}`,
    summary: `Asset condition: ${assessment.condition}. Assessed by ${data.assessedBy}.`,
    tags: [assessment.type, assessment.condition],
  });
  return assessment;
}

// ── Documentation ──────────────────────────────────────────

let _documentationsCache: Documentation[] | null = null;

function loadDocumentations(): Documentation[] {
  return loadFiles("doc-", _documentationsCache, (v) => { _documentationsCache = v; });
}

export function getDocumentations(): Documentation[] {
  return loadDocumentations();
}

export function getDocumentation(id: string): Documentation | undefined {
  return loadDocumentations().find((d) => d.id === id);
}

export function getDocumentationsByAsset(assetId: string): Documentation[] {
  return loadDocumentations().filter((d) => d.assetId === assetId);
}

export function createDocumentation(data: {
  assetId: string;
  siteId: string;
  missionId: string;
  type: DocumentationType;
  title: string;
  description: string;
  conductedBy: string;
  conductedDate: string;
}): Documentation {
  const now = new Date().toISOString();
  const doc: Documentation = {
    id: genId("hdoc"),
    assetId: data.assetId,
    siteId: data.siteId,
    missionId: data.missionId,
    type: data.type,
    title: data.title,
    description: data.description,
    conductedBy: data.conductedBy,
    conductedDate: data.conductedDate,
    fileRefs: [],
    created: now,
  };
  saveItem("doc", doc);
  _documentationsCache = null;

  publishFieldReport("heritage", "documentation", doc.id, {
    title: doc.title,
    content: `${doc.type} documentation: ${doc.title}`,
    summary: `Conducted by ${data.conductedBy}. Type: ${doc.type}.`,
    tags: [doc.type],
  });
  return doc;
}

// ── Conservation Plans ─────────────────────────────────────

let _conservationCache: ConservationPlan[] | null = null;

function loadConservation(): ConservationPlan[] {
  return loadFiles("conservation-", _conservationCache, (v) => { _conservationCache = v; });
}

export function getConservationPlans(): ConservationPlan[] {
  return loadConservation();
}

export function getConservationPlan(id: string): ConservationPlan | undefined {
  return loadConservation().find((c) => c.id === id);
}

export function getConservationPlansByAsset(assetId: string): ConservationPlan[] {
  return loadConservation().filter((c) => c.assetId === assetId);
}

export function createConservationPlan(data: {
  assetId: string;
  siteId: string;
  missionId: string;
  title: string;
  description: string;
  scope?: string[];
  estimatedCost?: number;
  startDate: string;
  endDate?: string;
}): ConservationPlan {
  const now = new Date().toISOString();
  const plan: ConservationPlan = {
    id: genId("hcon"),
    assetId: data.assetId,
    siteId: data.siteId,
    missionId: data.missionId,
    title: data.title,
    description: data.description,
    status: "planned",
    scope: data.scope || [],
    estimatedCost: data.estimatedCost,
    startDate: data.startDate,
    endDate: data.endDate,
    findings: [],
    created: now,
    updated: now,
  };
  saveItem("conservation", plan);
  _conservationCache = null;

  publishFieldReport("heritage", "conservation", plan.id, {
    title: plan.title,
    content: `Conservation Plan: ${plan.title} — ${plan.description}`,
    summary: `Status: ${plan.status}. Scope: ${plan.scope.length} items.`,
    tags: plan.scope,
  });
  return plan;
}

// ── Impact ─────────────────────────────────────────────────

let _impactCache: HeritageImpact[] | null = null;

function loadImpact(): HeritageImpact[] {
  return loadFiles("impact-", _impactCache, (v) => { _impactCache = v; });
}

export function getHeritageImpactReports(): HeritageImpact[] {
  return loadImpact();
}

export function getHeritageImpact(id: string): HeritageImpact | undefined {
  return loadImpact().find((i) => i.id === id);
}

export function createHeritageImpact(data: {
  missionId: string;
  title: string;
  summary: string;
  assetsRestored: number;
  totalAssets: number;
  areaDocumentedHectares: number;
  inscriptionsRecorded: number;
  communityMembers?: number;
  period: string;
}): HeritageImpact {
  const now = new Date().toISOString();
  const impact: HeritageImpact = {
    id: genId("himp"),
    missionId: data.missionId,
    title: data.title,
    summary: data.summary,
    assetsRestored: data.assetsRestored,
    totalAssets: data.totalAssets,
    areaDocumentedHectares: data.areaDocumentedHectares,
    inscriptionsRecorded: data.inscriptionsRecorded,
    communityMembers: data.communityMembers,
    period: data.period,
    created: now,
  };
  saveItem("impact", impact);
  _impactCache = null;

  publishImpactReport("heritage", "impact", impact.id, {
    title: impact.title,
    content: `Heritage Impact: ${impact.title}`,
    summary: `Restored: ${data.assetsRestored}/${data.totalAssets} assets. Documented: ${data.areaDocumentedHectares} ha.`,
  });
  return impact;
}

// ── Stats ──────────────────────────────────────────────────

export function getHeritageStats(): HeritageStats {
  const missions = loadMissions();
  const sites = loadSites();
  const assets = loadAssets();
  const assessments = loadAssessments();
  const documentations = loadDocumentations();
  const conservation = loadConservation();
  const impacts = loadImpact();

  const missionsByStatus: Record<HeritageMissionStatus, number> = {
    planning: 0, active: 0, monitoring: 0,
    completed: 0, "on-hold": 0, archived: 0,
  };
  missions.forEach((m) => missionsByStatus[m.status]++);

  const assetsByType: Record<string, number> = {};
  assets.forEach((a) => { assetsByType[a.assetType] = (assetsByType[a.assetType] || 0) + 1; });

  const assetsByCondition: Record<string, number> = {};
  assets.forEach((a) => { assetsByCondition[a.condition] = (assetsByCondition[a.condition] || 0) + 1; });

  return {
    totalMissions: missions.length,
    missionsByStatus,
    totalSites: sites.length,
    totalAssets: assets.length,
    assetsByType,
    assetsByCondition,
    totalAssessments: assessments.length,
    totalDocumentations: documentations.length,
    totalConservationPlans: conservation.length,
    totalImpactReports: impacts.length,
  };
}
