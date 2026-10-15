import { getModuleById } from "./ai-registry";

export * from "./ai-registry";
export * from "./lessons";
export * from "./bands";
export * from "./ai-progress";
export * from "./ai-progress-sync";

export function getCurriculumModule(id: string) {
  return getModuleById(id);
}
