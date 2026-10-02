import { aiModules } from "@/data/curriculum/ai-module-registry";
import { aiStandards } from "@/data/standards/ai-standards";
import type { AIBand, AILevel, AIModule, AIStandard } from "@/types/curriculum";

const modulesById = new Map(aiModules.map((m) => [m.id, m]));
const standardsById = new Map(aiStandards.map((s) => [s.id, s]));

export function getModulesByBand(band: AIBand): AIModule[] {
  return aiModules.filter((m) => m.band === band);
}

export function getModulesByLevel(level: AILevel): AIModule[] {
  return aiModules.filter((m) => m.level === level);
}

export function getModuleById(id: string): AIModule | undefined {
  return modulesById.get(id);
}

export function getPrerequisites(id: string): AIModule[] {
  const entry = modulesById.get(id);
  if (!entry) return [];
  const resolved: AIModule[] = [];
  for (const prereqId of entry.prerequisites ?? []) {
    const prereq = modulesById.get(prereqId);
    if (prereq) resolved.push(prereq);
  }
  return resolved;
}

export function getStandardsForModule(id: string): AIStandard[] {
  const entry = modulesById.get(id);
  if (!entry) return [];
  const resolved: AIStandard[] = [];
  for (const standardId of entry.standards) {
    const standard = standardsById.get(standardId);
    if (standard) resolved.push(standard);
  }
  return resolved;
}
