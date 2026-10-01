const PROGRESS_ENDPOINT = "/api/student/progress";

async function requestSync(
  completedModules?: readonly string[],
): Promise<string[] | null> {
  try {
    const response = await fetch(PROGRESS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "syncCurriculumProgress",
        data: completedModules
          ? { completedModules: [...completedModules] }
          : {},
      }),
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { completedModules?: unknown };
    const list = payload.completedModules;
    if (!Array.isArray(list)) return null;
    return list.filter((item): item is string => typeof item === "string");
  } catch {
    return null;
  }
}

export function fetchCurriculumProgress(): Promise<string[] | null> {
  return requestSync();
}

export function pushCurriculumProgress(
  completedModules: readonly string[],
): Promise<string[] | null> {
  return requestSync(completedModules);
}
