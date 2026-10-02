import { randomUUID } from "node:crypto";
import { getAsyncDb } from "@/lib/db";
import { aiModules } from "@/data/curriculum/ai-module-registry";

export interface ModuleProgressRow {
  id: string;
  user_id: string;
  module_id: string;
  lessons_completed: string;
  quiz_score: number | null;
  completed_at: string | null;
  updated_at: string;
}

const REGISTERED_MODULE_IDS = new Set(aiModules.map((module) => module.id));

export function sanitizeCurriculumModuleIds(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const seen = new Set<string>();
  for (const item of value) {
    if (typeof item === "string" && REGISTERED_MODULE_IDS.has(item)) {
      seen.add(item);
    }
  }
  return [...seen];
}

export async function listCompletedModuleIds(
  userId: string,
): Promise<string[]> {
  const rows = await getAsyncDb().all<{ module_id: string }>(
    "SELECT module_id FROM module_progress WHERE user_id = ? AND completed_at IS NOT NULL ORDER BY rowid",
    userId,
  );
  return rows.map((row) => row.module_id);
}

export async function replaceCompletedModules(
  userId: string,
  moduleIds: readonly string[],
): Promise<string[]> {
  const sanitized = sanitizeCurriculumModuleIds([...moduleIds]) ?? [];
  const db = getAsyncDb();
  await db.run("DELETE FROM module_progress WHERE user_id = ?", userId);
  const now = new Date().toISOString();
  for (const moduleId of sanitized) {
    await db.run(
      `INSERT INTO module_progress (id, user_id, module_id, lessons_completed, quiz_score, completed_at, updated_at)
       VALUES (?, ?, ?, '[]', NULL, ?, ?)`,
      randomUUID(),
      userId,
      moduleId,
      now,
      now,
    );
  }
  return sanitized;
}
