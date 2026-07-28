import {
  Mission,
  Site,
  Survey,
  Planting,
  Monitoring,
  Impact,
  MissionStatus,
  SurveyType,
  PlantingStatus,
  MonitoringType,
  ForestStats,
  Document,
} from "./models";
import { readJSON, writeJSON, listDir, ensureDir } from "./io";
import { getDocuments } from "./documents";

const FOREST_DIR = "content/forest";

// ── Helpers ────────────────────────────────────────────────

function genId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

function loadFiles<T>(
  pattern: string,
  cache: T[] | null,
  setter: (v: T[]) => void,
): T[] {
  if (cache) return cache;
  ensureDir(FOREST_DIR);
  const files = listDir(FOREST_DIR).filter(
    (f) => f.startsWith(pattern) && f.endsWith(".json"),
  );
  const items = files
    .map((f) => readJSON<T>(`${FOREST_DIR}/${f}`, {} as T))
    .filter((item) => (item as Record<string, unknown>).id);
  setter(items);
  return items;
}

function saveItem<T extends { id: string }>(prefix: string, item: T): void {
  ensureDir(FOREST_DIR);
  writeJSON(FOREST_DIR, `${prefix}-${item.id}.json`, item);
}

// ── Missions ───────────────────────────────────────────────

let _missionsCache: Mission[] | null = null;

function loadMissions(): Mission[] {
  return loadFiles("mission-", _missionsCache, (v) => {
    _missionsCache = v;
  });
}

export function getMissions(): Mission[] {
  return loadMissions();
}

export function getMission(id: string): Mission | undefined {
  return loadMissions().find((m) => m.id === id);
}

export function getMissionsByStatus(status: MissionStatus): Mission[] {
  return loadMissions().filter((m) => m.status === status);
}

export function createMission(data: {
  name: string;
  description: string;
  region: string;
  goals?: string[];
  tags?: string[];
}): Mission {
  const now = new Date().toISOString();
  const mission: Mission = {
    id: genId("mis"),
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
  publishToKnowledge(
    "mission",
    mission.id,
    mission.name,
    `Mission: ${mission.name} — ${mission.description}`,
    `Region: ${mission.region}. Status: ${mission.status}.`,
    [...mission.tags, "forest", "mission"],
  );
  return mission;
}

export function updateMission(
  id: string,
  updates: Partial<Mission>,
): Mission | null {
  const mission = getMission(id);
  if (!mission) return null;
  const updated = {
    ...mission,
    ...updates,
    id: mission.id,
    created: mission.created,
    updated: new Date().toISOString(),
  };
  saveItem("mission", updated);
  _missionsCache = null;
  return updated;
}

// ── Sites ──────────────────────────────────────────────────

let _sitesCache: Site[] | null = null;

function loadSites(): Site[] {
  return loadFiles("site-", _sitesCache, (v) => {
    _sitesCache = v;
  });
}

export function getSites(): Site[] {
  return loadSites();
}

export function getSite(id: string): Site | undefined {
  return loadSites().find((s) => s.id === id);
}

export function getSitesByMission(missionId: string): Site[] {
  return loadSites().filter((s) => s.missionId === missionId);
}

export function createSite(data: {
  missionId: string;
  name: string;
  description: string;
  latitude?: number;
  longitude?: number;
  areaHectares?: number;
  terrainType?: string;
}): Site {
  const now = new Date().toISOString();
  const site: Site = {
    id: genId("site"),
    missionId: data.missionId,
    name: data.name,
    description: data.description,
    latitude: data.latitude,
    longitude: data.longitude,
    areaHectares: data.areaHectares,
    terrainType: data.terrainType,
    surveyIds: [],
    plantingIds: [],
    created: now,
    updated: now,
  };
  saveItem("site", site);
  _sitesCache = null;

  // Add site to mission
  const mission = getMission(data.missionId);
  if (mission) {
    updateMission(data.missionId, {
      siteIds: [...mission.siteIds, site.id],
    });
  }

  publishToKnowledge(
    "site",
    site.id,
    site.name,
    `Site: ${site.name} — ${site.description}`,
    `Mission: ${mission?.name || data.missionId}. Area: ${data.areaHectares || "unknown"} ha.`,
    ["forest", "site"],
  );
  return site;
}

// ── Surveys ────────────────────────────────────────────────

let _surveysCache: Survey[] | null = null;

function loadSurveys(): Survey[] {
  return loadFiles("survey-", _surveysCache, (v) => {
    _surveysCache = v;
  });
}

export function getSurveys(): Survey[] {
  return loadSurveys();
}

export function getSurvey(id: string): Survey | undefined {
  return loadSurveys().find((s) => s.id === id);
}

export function getSurveysBySite(siteId: string): Survey[] {
  return loadSurveys().filter((s) => s.siteId === siteId);
}

export function getSurveysByMission(missionId: string): Survey[] {
  return loadSurveys().filter((s) => s.missionId === missionId);
}

export function createSurvey(data: {
  siteId: string;
  missionId: string;
  type: SurveyType;
  title: string;
  description: string;
  conductedBy: string;
  conductedDate: string;
  findings?: string[];
  speciesObserved?: string[];
  conditionRating?: number;
}): Survey {
  const now = new Date().toISOString();
  const survey: Survey = {
    id: genId("surv"),
    siteId: data.siteId,
    missionId: data.missionId,
    type: data.type,
    title: data.title,
    description: data.description,
    conductedBy: data.conductedBy,
    conductedDate: data.conductedDate,
    findings: data.findings || [],
    speciesObserved: data.speciesObserved || [],
    conditionRating: data.conditionRating,
    photos: [],
    created: now,
  };
  saveItem("survey", survey);
  _surveysCache = null;

  // Add survey to site
  const site = getSite(data.siteId);
  if (site) {
    const updated = {
      ...site,
      surveyIds: [...site.surveyIds, survey.id],
      updated: now,
    };
    saveItem("site", updated);
    _sitesCache = null;
  }

  publishToKnowledge(
    "survey",
    survey.id,
    survey.title,
    `${survey.type} survey: ${survey.title}`,
    `Site: ${site?.name || data.siteId}. Conducted by ${data.conductedBy}.`,
    [...survey.findings, "forest", "survey"],
  );
  return survey;
}

// ── Plantings ──────────────────────────────────────────────

let _plantingsCache: Planting[] | null = null;

function loadPlantings(): Planting[] {
  return loadFiles("planting-", _plantingsCache, (v) => {
    _plantingsCache = v;
  });
}

export function getPlantings(): Planting[] {
  return loadPlantings();
}

export function getPlanting(id: string): Planting | undefined {
  return loadPlantings().find((p) => p.id === id);
}

export function getPlantingsBySite(siteId: string): Planting[] {
  return loadPlantings().filter((p) => p.siteId === siteId);
}

export function getPlantingsByMission(missionId: string): Planting[] {
  return loadPlantings().filter((p) => p.missionId === missionId);
}

export function createPlanting(data: {
  siteId: string;
  missionId: string;
  name: string;
  species: string[];
  targetCount: number;
  startDate: string;
  notes?: string;
}): Planting {
  const now = new Date().toISOString();
  const planting: Planting = {
    id: genId("plant"),
    siteId: data.siteId,
    missionId: data.missionId,
    name: data.name,
    status: "planned",
    species: data.species,
    targetCount: data.targetCount,
    plantedCount: 0,
    startDate: data.startDate,
    notes: data.notes || "",
    created: now,
    updated: now,
  };
  saveItem("planting", planting);
  _plantingsCache = null;

  // Add planting to site
  const site = getSite(data.siteId);
  if (site) {
    const updated = {
      ...site,
      plantingIds: [...site.plantingIds, planting.id],
      updated: now,
    };
    saveItem("site", updated);
    _sitesCache = null;
  }

  publishToKnowledge(
    "planting",
    planting.id,
    planting.name,
    `Planting: ${planting.name} — ${data.species.join(", ")}`,
    `Target: ${data.targetCount} trees. Site: ${site?.name || data.siteId}.`,
    [...data.species, "forest", "planting"],
  );
  return planting;
}

export function updatePlanting(
  id: string,
  updates: Partial<Planting>,
): Planting | null {
  const planting = getPlanting(id);
  if (!planting) return null;
  const updated = {
    ...planting,
    ...updates,
    id: planting.id,
    created: planting.created,
    updated: new Date().toISOString(),
  };
  saveItem("planting", updated);
  _plantingsCache = null;
  return updated;
}

// ── Monitoring ─────────────────────────────────────────────

let _monitoringCache: Monitoring[] | null = null;

function loadMonitoring(): Monitoring[] {
  return loadFiles("monitoring-", _monitoringCache, (v) => {
    _monitoringCache = v;
  });
}

export function getMonitoring(): Monitoring[] {
  return loadMonitoring();
}

export function getMonitoringEntry(id: string): Monitoring | undefined {
  return loadMonitoring().find((m) => m.id === id);
}

export function getMonitoringByPlanting(plantingId: string): Monitoring[] {
  return loadMonitoring().filter((m) => m.plantingId === plantingId);
}

export function getMonitoringByMission(missionId: string): Monitoring[] {
  return loadMonitoring().filter((m) => m.missionId === missionId);
}

export function createMonitoring(data: {
  plantingId?: string;
  siteId: string;
  missionId: string;
  type: MonitoringType;
  title: string;
  observations: string[];
  metrics?: Record<string, number>;
  conductedBy: string;
  conductedDate: string;
}): Monitoring {
  const now = new Date().toISOString();
  const entry: Monitoring = {
    id: genId("mon"),
    plantingId: data.plantingId,
    siteId: data.siteId,
    missionId: data.missionId,
    type: data.type,
    title: data.title,
    observations: data.observations,
    metrics: data.metrics || {},
    photos: [],
    conductedBy: data.conductedBy,
    conductedDate: data.conductedDate,
    created: now,
  };
  saveItem("monitoring", entry);
  _monitoringCache = null;

  publishToKnowledge(
    "monitoring",
    entry.id,
    entry.title,
    `${entry.type} monitoring: ${entry.title}`,
    `Conducted by ${data.conductedBy}. Observations: ${data.observations.length}.`,
    ["forest", "monitoring"],
  );
  return entry;
}

// ── Impact ─────────────────────────────────────────────────

let _impactCache: Impact[] | null = null;

function loadImpact(): Impact[] {
  return loadFiles("impact-", _impactCache, (v) => {
    _impactCache = v;
  });
}

export function getImpactReports(): Impact[] {
  return loadImpact();
}

export function getImpact(id: string): Impact | undefined {
  return loadImpact().find((i) => i.id === id);
}

export function getImpactByMission(missionId: string): Impact[] {
  return loadImpact().filter((i) => i.missionId === missionId);
}

export function createImpact(data: {
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
}): Impact {
  const now = new Date().toISOString();
  const impact: Impact = {
    id: genId("imp"),
    missionId: data.missionId,
    title: data.title,
    summary: data.summary,
    areaRestoredHectares: data.areaRestoredHectares,
    totalPlanted: data.totalPlanted,
    survivalRate: data.survivalRate,
    speciesCount: data.speciesCount,
    biodiversityIndex: data.biodiversityIndex,
    carbonSequestrationTonnes: data.carbonSequestrationTonnes,
    communityMembers: data.communityMembers,
    period: data.period,
    created: now,
  };
  saveItem("impact", impact);
  _impactCache = null;

  publishToKnowledge(
    "impact",
    impact.id,
    impact.title,
    `Impact Report: ${impact.title}`,
    `Area: ${data.areaRestoredHectares} ha. Planted: ${data.totalPlanted}. Survival: ${data.survivalRate}%.`,
    ["forest", "impact", "report"],
  );
  return impact;
}

// ── Publishing to Knowledge ────────────────────────────────

function publishToKnowledge(
  category: string,
  id: string,
  title: string,
  content: string,
  summary: string,
  tags: string[],
): void {
  const docId = `forest-${category}-${id}`;
  const now = new Date().toISOString();

  // Create a document entry in content-core's document system
  const doc = {
    id: docId,
    title,
    category: "report" as const,
    path: `/documents/${docId}`,
    content,
    summary,
    tags,
    status: "published" as const,
    created: now,
    readingTime: Math.max(1, Math.ceil(content.split(/\s+/).length / 200)),
    version: 1,
    links: [],
    citations: [],
    entityIds: [],
    metadata: { source: "forest", sourceId: id },
  };

  // Write to the knowledge documents directory
  ensureDir("content/knowledge");
  writeJSON("content/knowledge", `${docId}.json`, doc);
}

// ── Forest Stats ───────────────────────────────────────────

export function getForestStats(): ForestStats {
  const missions = getMissions();
  const sites = getSites();
  const surveys = getSurveys();
  const plantings = getPlantings();
  const monitoring = getMonitoring();
  const impacts = getImpactReports();

  const missionsByStatus: Record<MissionStatus, number> = {
    planning: 0,
    active: 0,
    monitoring: 0,
    completed: 0,
    "on-hold": 0,
    archived: 0,
  };
  missions.forEach((m) => missionsByStatus[m.status]++);

  const totalPlanted = plantings.reduce((sum, p) => sum + p.plantedCount, 0);
  const totalTarget = plantings.reduce((sum, p) => sum + p.targetCount, 0);
  const plantingsWithSurvival = plantings.filter(
    (p) => p.survivalRate !== undefined,
  );
  const averageSurvivalRate =
    plantingsWithSurvival.length > 0
      ? plantingsWithSurvival.reduce(
          (sum, p) => sum + (p.survivalRate || 0),
          0,
        ) / plantingsWithSurvival.length
      : 0;
  const totalAreaRestored = sites.reduce(
    (sum, s) => sum + (s.areaHectares || 0),
    0,
  );

  return {
    totalMissions: missions.length,
    missionsByStatus,
    totalSites: sites.length,
    totalSurveys: surveys.length,
    totalPlantings: plantings.length,
    totalMonitoring: monitoring.length,
    totalImpactReports: impacts.length,
    totalAreaRestored,
    totalPlanted,
    averageSurvivalRate,
  };
}
