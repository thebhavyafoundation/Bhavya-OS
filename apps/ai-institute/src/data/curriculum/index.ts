import { CATALOG_MODULES } from "./catalog.generated";
import { JUNIOR_MODULES } from "./junior";
import type { AgeBand, CurriculumModule, LevelParam } from "./types";

export * from "./types";

const CORE_LEVELS = [0, 1, 2, 3, 4, 5, 6];
const ADV_LEVELS = [7, 8, 9, 10, 11, 12];

export function getAgeBandForLevel(level: number): AgeBand {
  return level >= 7 ? "advanced" : "12-15";
}

function toCurriculumModules(): CurriculumModule[] {
  return [
    ...CATALOG_MODULES.map((m) => ({
      id: m.id,
      level: String(m.level) as LevelParam,
      title: m.title,
      mission: m.mission,
      objectives: m.objectives,
      ageBand: getAgeBandForLevel(m.level),
      duration: m.duration,
      handsOnPercent: m.handsOnPercent,
      projects: m.projects,
      labs: m.labs,
      prerequisites: m.prerequisites,
      difficulty: m.difficulty,
      mentorLed: m.level >= 7 ? true : undefined,
    })),
    ...JUNIOR_MODULES,
  ];
}

const MODULES: CurriculumModule[] = toCurriculumModules();

export function getAllModules(): CurriculumModule[] {
  return MODULES;
}
export function getTotalModules(): number {
  return MODULES.length;
}

export function isLevelParam(s: string): s is LevelParam {
  return (
    s === "jr-a" ||
    s === "jr-b" ||
    (/^\d+$/.test(s) && Number(s) >= 0 && Number(s) <= 12)
  );
}

export function getModulesByLevel(level: LevelParam): CurriculumModule[] {
  return MODULES.filter((m) => m.level === level);
}

export function getModule(
  level: string,
  id: string,
): CurriculumModule | undefined {
  if (!isLevelParam(level)) return undefined;
  return MODULES.find((m) => m.level === level && m.id === id);
}

export const TRACKS = [
  {
    id: "jr-a",
    label: "Junior A — Sprouts",
    bandLabel: "Ages 6–8",
    levels: ["jr-a"] as LevelParam[],
  },
  {
    id: "jr-b",
    label: "Junior B — Explorers",
    bandLabel: "Ages 9–11",
    levels: ["jr-b"] as LevelParam[],
  },
  {
    id: "core",
    label: "Core",
    bandLabel: "Ages 12–15",
    levels: CORE_LEVELS.map(String) as LevelParam[],
  },
  {
    id: "advanced",
    label: "Advanced",
    bandLabel: "Ages 15+, mentor-led",
    levels: ADV_LEVELS.map(String) as LevelParam[],
  },
] as const;

export type TrackId = (typeof TRACKS)[number]["id"];

export function getTrackCount(trackId: TrackId): number {
  const t = TRACKS.find((x) => x.id === trackId)!;
  return t.levels.reduce((n, l) => n + getModulesByLevel(l).length, 0);
}

export function levelParams(): string[] {
  return ["jr-a", "jr-b", ...CORE_LEVELS, ...ADV_LEVELS].map(String);
}

export function moduleParams(): Array<{ level: string; module: string }> {
  return MODULES.map((m) => ({ level: m.level, module: m.id }));
}
