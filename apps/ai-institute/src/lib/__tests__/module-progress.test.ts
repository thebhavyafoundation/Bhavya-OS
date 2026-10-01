import { describe, it, expect, afterAll } from "vitest";
import {
  sanitizeCurriculumModuleIds,
  listCompletedModuleIds,
  replaceCompletedModules,
} from "@/lib/module-progress";
import { initDatabase } from "@/lib/db";
import { aiModules } from "@/data/curriculum/ai-module-registry";

const USER_ID = `module-progress-test-${Date.now()}`;

afterAll(async () => {
  await initDatabase();
  const { getAsyncDb } = await import("@/lib/db");
  await getAsyncDb().run(
    "DELETE FROM module_progress WHERE user_id = ?",
    USER_ID,
  );
});

describe("sanitizeCurriculumModuleIds", () => {
  it("returns null when the payload is not an array", () => {
    expect(sanitizeCurriculumModuleIds("l0-m1")).toBeNull();
    expect(sanitizeCurriculumModuleIds(undefined)).toBeNull();
    expect(sanitizeCurriculumModuleIds({ completed: true })).toBeNull();
  });

  it("keeps only registered module ids, deduplicated and ordered", () => {
    expect(
      sanitizeCurriculumModuleIds(["l0-m1", "nope", "l0-m1", "ja-01", 42]),
    ).toEqual(["l0-m1", "ja-01"]);
  });

  it("accepts an empty list", () => {
    expect(sanitizeCurriculumModuleIds([])).toEqual([]);
  });

  it("never emits more ids than the registry holds", () => {
    const all = aiModules.map((module) => module.id);
    const sanitized = sanitizeCurriculumModuleIds([...all, ...all]);
    expect(sanitized).not.toBeNull();
    expect(sanitized!.length).toBeLessThanOrEqual(aiModules.length);
  });
});

describe("module progress storage", () => {
  it("replaces and lists completed module ids", async () => {
    await initDatabase();
    await expect(
      replaceCompletedModules(USER_ID, ["l0-m1", "l0-m7"]),
    ).resolves.toEqual(["l0-m1", "l0-m7"]);
    await expect(listCompletedModuleIds(USER_ID)).resolves.toEqual([
      "l0-m1",
      "l0-m7",
    ]);
  });

  it("drops modules removed from the local list", async () => {
    await initDatabase();
    await replaceCompletedModules(USER_ID, ["ja-01"]);
    await expect(listCompletedModuleIds(USER_ID)).resolves.toEqual(["ja-01"]);
  });

  it("clears all rows for an empty list", async () => {
    await initDatabase();
    await replaceCompletedModules(USER_ID, []);
    await expect(listCompletedModuleIds(USER_ID)).resolves.toEqual([]);
  });
});
