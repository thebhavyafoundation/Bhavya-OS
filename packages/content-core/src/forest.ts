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
  RecordProvenance,
} from "./models";
import { readJSON, writeJSON, listDir, ensureDir } from "./io";
import {
  publishFieldReport,
  publishSurveyResult,
  publishMonitoringLog,
  publishImpactReport,
} from "./publish";
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

// ── Test isolation ─────────────────────────────────────────
// Clears all module-level caches so a worker that imported this module
// before BHAVYA_CONTENT_ROOT was redirected cannot serve production data
// from cache. Test setup files should call this after setting the env var.
// Production behavior is unchanged (caches simply repopulate on next read).
export function resetForestCachesForTests(): void {
  _missionsCache = null;
  _sitesCache = null;
  _surveysCache = null;
  _plantingsCache = null;
  _monitoringCache = null;
  _impactCache = null;
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
  provenance?: RecordProvenance;
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
    provenance: data.provenance || "institutional",
    created: now,
    updated: now,
  };
  saveItem("mission", mission);
  _missionsCache = null;
  publishFieldReport("forest", "mission", mission.id, {
    title: mission.name,
    content: `Mission: ${mission.name} — ${mission.description}`,
    summary: `Region: ${mission.region}. Status: ${mission.status}.`,
    tags: mission.tags,
  });
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
  provenance?: RecordProvenance;
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
    provenance: data.provenance,
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

  publishFieldReport("forest", "site", site.id, {
    title: site.name,
    content: `Site: ${site.name} — ${site.description}`,
    summary: `Mission: ${mission?.name || data.missionId}. Area: ${data.areaHectares || "unknown"} ha.`,
  });
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
  provenance?: RecordProvenance;
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
    provenance: data.provenance,
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

  publishSurveyResult("forest", "survey", survey.id, {
    title: survey.title,
    content: `${survey.type} survey: ${survey.title}`,
    summary: `Site: ${site?.name || data.siteId}. Conducted by ${data.conductedBy}.`,
    tags: survey.findings,
  });
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
  provenance?: RecordProvenance;
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
    provenance: data.provenance,
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

  publishFieldReport("forest", "planting", planting.id, {
    title: planting.name,
    content: `Planting: ${planting.name} — ${data.species.join(", ")}`,
    summary: `Target: ${data.targetCount} trees. Site: ${site?.name || data.siteId}.`,
    tags: data.species,
  });
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
  provenance?: RecordProvenance;
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
    provenance: data.provenance,
    created: now,
  };
  saveItem("monitoring", entry);
  _monitoringCache = null;

  publishMonitoringLog("forest", "monitoring", entry.id, {
    title: entry.title,
    content: `${entry.type} monitoring: ${entry.title}`,
    summary: `Conducted by ${data.conductedBy}. Observations: ${data.observations.length}.`,
  });
  return entry;
}

// ── Impact ─────────────────────────────────────────────────

let _impactCache: Impact[] | null = null;

function loadImpact(): Impact[] {
  return loadFiles("impact-", _impactCache, (v) => {
    _impactCache = v;
  });
}

export function getForestImpactReports(): Impact[] {
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
  provenance?: RecordProvenance;
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
    provenance: data.provenance,
    created: now,
  };
  saveItem("impact", impact);
  _impactCache = null;

  publishImpactReport("forest", "impact", impact.id, {
    title: impact.title,
    content: `Impact Report: ${impact.title}`,
    summary: `Area: ${data.areaRestoredHectares} ha. Planted: ${data.totalPlanted}. Survival: ${data.survivalRate}%.`,
  });
  return impact;
}

// ── Forest Stats ───────────────────────────────────────────

export function getForestStats(): ForestStats {
  const missions = getMissions();
  const sites = getSites();
  const surveys = getSurveys();
  const plantings = getPlantings();
  const monitoring = getMonitoring();
  const impacts = getForestImpactReports();

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
