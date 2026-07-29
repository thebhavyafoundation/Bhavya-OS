import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

// ── Institutional Resilience Types ─────────────────────────

export interface Dependency {
  id: string;
  sourceId: string;
  sourceType: "mission" | "role" | "policy" | "knowledge" | "process" | "system";
  targetId: string;
  targetType: "mission" | "role" | "policy" | "knowledge" | "process" | "system" | "person";
  type: "requires" | "supports" | "informs" | "governs";
  criticality: "critical" | "important" | "standard";
  description: string;
  created: string;
}

export interface ContinuityGap {
  id: string;
  category: "single-point-of-failure" | "undocumented-knowledge" | "missing-playbook" | "unowned-asset" | "skill-gap" | "dependency-risk";
  title: string;
  description: string;
  affectedEntity: string;
  affectedType: string;
  severity: "low" | "medium" | "high" | "critical";
  mitigation?: string;
  status: "identified" | "acknowledged" | "mitigating" | "resolved";
  identifiedDate: string;
  lastUpdated: string;
}

export interface ResilienceScore {
  overall: number;
  byCategory: Record<string, number>;
  gapsCount: number;
  criticalGaps: number;
  mitigatedGaps: number;
}

export interface DependencyMap {
  nodes: Array<{
    id: string;
    type: string;
    name: string;
    criticality: string;
  }>;
  edges: Array<{
    source: string;
    target: string;
    type: string;
    criticality: string;
  }>;
}

export interface ResilienceStats {
  totalDependencies: number;
  totalGaps: number;
  bySeverity: Record<string, number>;
  byCategory: Record<string, number>;
  byStatus: Record<string, number>;
  resilienceScore: number;
}

// ── Resilience Storage ─────────────────────────────────────

const DATA_DIR = join(import.meta.dirname, "..", "..", "data");
const DEPENDENCIES_FILE = join(DATA_DIR, "dependencies.json");
const GAPS_FILE = join(DATA_DIR, "continuity-gaps.json");

function readDependenciesData(): Dependency[] {
  if (!existsSync(DEPENDENCIES_FILE)) {
    return [];
  }
  return JSON.parse(readFileSync(DEPENDENCIES_FILE, "utf-8")) as Dependency[];
}

function writeDependenciesData(data: Dependency[]): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(DEPENDENCIES_FILE, JSON.stringify(data, null, 2));
}

function readGapsData(): ContinuityGap[] {
  if (!existsSync(GAPS_FILE)) {
    return [];
  }
  return JSON.parse(readFileSync(GAPS_FILE, "utf-8")) as ContinuityGap[];
}

function writeGapsData(data: ContinuityGap[]): void {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
  writeFileSync(GAPS_FILE, JSON.stringify(data, null, 2));
}

// ── Dependency CRUD ────────────────────────────────────────

export function createDependency(
  sourceId: string,
  sourceType: Dependency["sourceType"],
  targetId: string,
  targetType: Dependency["targetType"],
  type: Dependency["type"],
  criticality: Dependency["criticality"],
  description: string
): Dependency {
  const dependencies = readDependenciesData();
  const now = new Date().toISOString();

  const dependency: Dependency = {
    id: `dep-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    sourceId,
    sourceType,
    targetId,
    targetType,
    type,
    criticality,
    description,
    created: now,
  };

  dependencies.push(dependency);
  writeDependenciesData(dependencies);
  return dependency;
}

export function getDependencies(): Dependency[] {
  return readDependenciesData();
}

export function getDependencyById(id: string): Dependency | undefined {
  return readDependenciesData().find((d) => d.id === id);
}

export function getDependenciesBySource(sourceId: string): Dependency[] {
  return readDependenciesData().filter((d) => d.sourceId === sourceId);
}

export function getDependenciesByTarget(targetId: string): Dependency[] {
  return readDependenciesData().filter((d) => d.targetId === targetId);
}

export function getDependenciesByCriticality(criticality: Dependency["criticality"]): Dependency[] {
  return readDependenciesData().filter((d) => d.criticality === criticality);
}

export function deleteDependency(id: string): void {
  const dependencies = readDependenciesData();
  const filtered = dependencies.filter((d) => d.id !== id);
  writeDependenciesData(filtered);
}

// ── Continuity Gap CRUD ────────────────────────────────────

export function createContinuityGap(
  category: ContinuityGap["category"],
  title: string,
  description: string,
  affectedEntity: string,
  affectedType: string,
  severity: ContinuityGap["severity"],
  mitigation?: string
): ContinuityGap {
  const gaps = readGapsData();
  const now = new Date().toISOString();

  const gap: ContinuityGap = {
    id: `gap-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    category,
    title,
    description,
    affectedEntity,
    affectedType,
    severity,
    mitigation,
    status: "identified",
    identifiedDate: now,
    lastUpdated: now,
  };

  gaps.push(gap);
  writeGapsData(gaps);
  return gap;
}

export function getContinuityGaps(): ContinuityGap[] {
  return readGapsData();
}

export function getContinuityGapById(id: string): ContinuityGap | undefined {
  return readGapsData().find((g) => g.id === id);
}

export function getContinuityGapsByCategory(category: ContinuityGap["category"]): ContinuityGap[] {
  return readGapsData().filter((g) => g.category === category);
}

export function getContinuityGapsBySeverity(severity: ContinuityGap["severity"]): ContinuityGap[] {
  return readGapsData().filter((g) => g.severity === severity);
}

export function getContinuityGapsByStatus(status: ContinuityGap["status"]): ContinuityGap[] {
  return readGapsData().filter((g) => g.status === status);
}

export function updateContinuityGap(
  id: string,
  updates: Partial<Omit<ContinuityGap, "id" | "identifiedDate">>
): ContinuityGap {
  const gaps = readGapsData();
  const index = gaps.findIndex((g) => g.id === id);
  if (index === -1) {
    throw new Error(`Continuity gap not found: ${id}`);
  }

  gaps[index] = {
    ...gaps[index],
    ...updates,
    lastUpdated: new Date().toISOString(),
  };

  writeGapsData(gaps);
  return gaps[index];
}

export function mitigateGap(id: string, mitigation: string): ContinuityGap {
  return updateContinuityGap(id, {
    status: "mitigating",
    mitigation,
  });
}

export function resolveGap(id: string): ContinuityGap {
  return updateContinuityGap(id, { status: "resolved" });
}

// ── Dependency Map ─────────────────────────────────────────

export function buildDependencyMap(): DependencyMap {
  const dependencies = readDependenciesData();
  const nodeMap = new Map<string, { id: string; type: string; name: string; criticality: string }>();

  // Build nodes from dependencies
  dependencies.forEach((dep) => {
    if (!nodeMap.has(dep.sourceId)) {
      nodeMap.set(dep.sourceId, {
        id: dep.sourceId,
        type: dep.sourceType,
        name: `${dep.sourceType}: ${dep.sourceId}`,
        criticality: dep.criticality,
      });
    }
    if (!nodeMap.has(dep.targetId)) {
      nodeMap.set(dep.targetId, {
        id: dep.targetId,
        type: dep.targetType,
        name: `${dep.targetType}: ${dep.targetId}`,
        criticality: dep.criticality,
      });
    }
  });

  return {
    nodes: Array.from(nodeMap.values()),
    edges: dependencies.map((dep) => ({
      source: dep.sourceId,
      target: dep.targetId,
      type: dep.type,
      criticality: dep.criticality,
    })),
  };
}

// ── Resilience Analysis ────────────────────────────────────

export function assessResilience(): ResilienceScore {
  const dependencies = readDependenciesData();
  const gaps = readGapsData();

  // Count critical dependencies
  const criticalDeps = dependencies.filter((d) => d.criticality === "critical").length;
  const totalDeps = dependencies.length;
  const depScore = totalDeps > 0 ? Math.max(0, 100 - (criticalDeps / totalDeps) * 100) : 100;

  // Count gaps
  const criticalGaps = gaps.filter((g) => g.severity === "critical").length;
  const mitigatedGaps = gaps.filter((g) => g.status === "resolved" || g.status === "mitigating").length;
  const totalGaps = gaps.length;
  const gapScore = totalGaps > 0 ? Math.max(0, 100 - (criticalGaps / totalGaps) * 100) : 100;

  // Overall score
  const overall = Math.round((depScore * 0.6 + gapScore * 0.4));

  // By category
  const categories = ["single-point-of-failure", "undocumented-knowledge", "missing-playbook", "unowned-asset", "skill-gap", "dependency-risk"];
  const byCategory: Record<string, number> = {};
  categories.forEach((cat) => {
    const catGaps = gaps.filter((g) => g.category === cat);
    const criticalCatGaps = catGaps.filter((g) => g.severity === "critical").length;
    byCategory[cat] = catGaps.length > 0 ? Math.max(0, 100 - (criticalCatGaps / catGaps.length) * 100) : 100;
  });

  return {
    overall,
    byCategory,
    gapsCount: totalGaps,
    criticalGaps,
    mitigatedGaps,
  };
}

// ── Resilience Stats ───────────────────────────────────────

export function getResilienceStats(): ResilienceStats {
  const dependencies = readDependenciesData();
  const gaps = readGapsData();

  const bySeverity: Record<string, number> = {
    low: 0,
    medium: 0,
    high: 0,
    critical: 0,
  };

  const byCategory: Record<string, number> = {
    "single-point-of-failure": 0,
    "undocumented-knowledge": 0,
    "missing-playbook": 0,
    "unowned-asset": 0,
    "skill-gap": 0,
    "dependency-risk": 0,
  };

  const byStatus: Record<string, number> = {
    identified: 0,
    acknowledged: 0,
    mitigating: 0,
    resolved: 0,
  };

  gaps.forEach((gap) => {
    bySeverity[gap.severity]++;
    byCategory[gap.category]++;
    byStatus[gap.status]++;
  });

  const score = assessResilience();

  return {
    totalDependencies: dependencies.length,
    totalGaps: gaps.length,
    bySeverity,
    byCategory,
    byStatus,
    resilienceScore: score.overall,
  };
}

// ── Gap Detection ──────────────────────────────────────────

export function detectSinglePointOfFailures(): ContinuityGap[] {
  const dependencies = readDependenciesData();
  const gaps: ContinuityGap[] = [];

  // Find entities that are only supported by one source
  const targetCounts = new Map<string, number>();
  dependencies.forEach((dep) => {
    targetCounts.set(dep.targetId, (targetCounts.get(dep.targetId) || 0) + 1);
  });

  targetCounts.forEach((count, targetId) => {
    if (count === 1) {
      const gap = createContinuityGap(
        "single-point-of-failure",
        `Single point of failure: ${targetId}`,
        `Entity ${targetId} depends on only one source`,
        targetId,
        "unknown",
        "medium"
      );
      gaps.push(gap);
    }
  });

  return gaps;
}

export function detectUndocumentedKnowledge(): ContinuityGap[] {
  // In a real implementation, this would check for knowledge without documentation
  return [];
}

export function detectMissingPlaybooks(): ContinuityGap[] {
  // In a real implementation, this would check for recurring work without playbooks
  return [];
}

// ── Default Dependencies ───────────────────────────────────

export function createDefaultDependencies(): Dependency[] {
  const dependencies: Dependency[] = [];

  // Mission dependencies
  dependencies.push(
    createDependency("forest-mission", "mission", "forest-manager", "role", "requires", "critical", "Forest mission requires a forest manager"),
    createDependency("forest-mission", "mission", "conservation-policy", "policy", "governs", "critical", "Forest mission governed by conservation policy"),
    createDependency("heritage-mission", "mission", "heritage-manager", "role", "requires", "critical", "Heritage mission requires a heritage manager"),
    createDependency("research-mission", "mission", "research-lead", "role", "requires", "critical", "Research mission requires a research lead")
  );

  // Knowledge dependencies
  dependencies.push(
    createDependency("knowledge-graph", "knowledge", "content-core", "system", "requires", "critical", "Knowledge graph requires content-core"),
    createDependency("search-index", "knowledge", "content-core", "system", "requires", "critical", "Search index requires content-core")
  );

  // Governance dependencies
  dependencies.push(
    createDependency("board-meetings", "process", "board-members", "role", "requires", "critical", "Board meetings require board members"),
    createDependency("policy-review", "process", "compliance-officer", "role", "requires", "important", "Policy review requires compliance officer")
  );

  return dependencies;
}
