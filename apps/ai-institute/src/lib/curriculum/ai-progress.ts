export interface AIProgressState {
  readonly completedModules: readonly string[];
  readonly expandedModules: readonly string[];
}

export const AI_PROGRESS_STORAGE_KEY = "ai-institute-curriculum-progress";

const emptyState = (): AIProgressState => ({
  completedModules: [],
  expandedModules: [],
});

function stringItems(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  return value.filter((item): item is string => typeof item === "string");
}

function sanitize(value: unknown): AIProgressState {
  if (typeof value !== "object" || value === null) return emptyState();
  const record = value as Record<string, unknown>;
  const completedModules = stringItems(record.completedModules);
  const expandedModules = stringItems(record.expandedModules);
  if (!completedModules || !expandedModules) return emptyState();
  return { completedModules, expandedModules };
}

export function loadProgress(): AIProgressState {
  if (typeof window === "undefined") return emptyState();
  try {
    const stored = window.localStorage.getItem(AI_PROGRESS_STORAGE_KEY);
    if (!stored) return emptyState();
    return sanitize(JSON.parse(stored));
  } catch {
    return emptyState();
  }
}

export function saveProgress(state: AIProgressState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(AI_PROGRESS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    return;
  }
}

function toggleId(list: readonly string[], id: string): string[] {
  if (list.includes(id)) return list.filter((item) => item !== id);
  return [...list, id];
}

export function toggleModuleComplete(
  state: AIProgressState,
  id: string,
): AIProgressState {
  return {
    ...state,
    completedModules: toggleId(state.completedModules, id),
  };
}

export function toggleExpanded(
  state: AIProgressState,
  id: string,
): AIProgressState {
  return {
    ...state,
    expandedModules: toggleId(state.expandedModules, id),
  };
}

export function mergeAIProgress(
  primary: AIProgressState,
  secondary: AIProgressState,
): AIProgressState {
  const completedModules = [...primary.completedModules];
  for (const id of secondary.completedModules) {
    if (!completedModules.includes(id)) completedModules.push(id);
  }
  return {
    completedModules,
    expandedModules: [...primary.expandedModules],
  };
}
