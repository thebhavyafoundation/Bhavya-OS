import { beforeAll, describe, expect, it } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { migrate } from "@bhavya/database";
import { createObjective, addKeyResult, updateKeyResult, getObjective, getOKRSummary } from "../../okr/engine";

/**
 * OKR engine specifications, run against a temporary SQLite database.
 *
 * The engine stores objectives and key results as JSON text inside the row
 * and computes progress as the average of each key result's completion
 * ratio, capped at 100. These specifications pin that arithmetic and the
 * round trip through the JSON columns — the two places a silent corruption
 * would hide for weeks before anyone re-opened the OKR page.
 */

let scratchDir: string;
let scratchDb: string;

beforeAll(async () => {
  scratchDir = mkdtempSync(join(tmpdir(), "bhavya-ioc-okr-"));
  scratchDb = join(scratchDir, "ioc.db");
  process.env.BHAVYA_DB_PATH = scratchDb;

  // The app's getDb() calls migrate("ioc") without awaiting it, so a first
  // read can race the migration. The test awaits the same migration against
  // a scratch database instead of changing the app's runtime.
  await migrate("ioc");
});

describe("OKR engine", () => {
  let objectiveId = "";
  let firstKrId = "";
  let secondKrId = "";

  it("creates an objective with zero progress and no key results", () => {
    const created = createObjective({
      title: "Ship the learning platform",
      description: "Bring the platform to full curriculum coverage",
      department: "education",
      quarter: "2026-Q4",
    });

    expect(created.id).toBeTruthy();
    expect(created.progress).toBe(0);
    expect(created.status).toBe("not_started");
    expect(created.keyResults).toEqual([]);
    objectiveId = created.id;
  });

  it("adds key results and reads them back", () => {
    const kr1 = addKeyResult(objectiveId, {
      title: "Curriculum tracks live",
      metric: "tracks",
      targetValue: 10,
      unit: "tracks",
    });
    firstKrId = kr1.id;

    const kr2 = addKeyResult(objectiveId, {
      title: "Learners enrolled",
      metric: "learners",
      targetValue: 500,
      unit: "learners",
    });
    secondKrId = kr2.id;

    expect(firstKrId).not.toBe(secondKrId);

    const objective = getObjective(objectiveId);
    expect(objective).not.toBeNull();
    expect(objective!.keyResults).toHaveLength(2);
    expect(objective!.keyResults.map((kr) => kr.id)).toEqual(
      expect.arrayContaining([firstKrId, secondKrId]),
    );
  });

  it("computes progress as the average of the key-result ratios", () => {
    updateKeyResult(objectiveId, firstKrId, 5);
    updateKeyResult(objectiveId, secondKrId, 250);

    const objective = getObjective(objectiveId);
    expect(objective!.progress).toBe(50);

    const kr1 = objective!.keyResults.find((kr) => kr.id === firstKrId);
    const kr2 = objective!.keyResults.find((kr) => kr.id === secondKrId);
    expect(kr1!.status).toBe("on_track");
    expect(kr2!.status).toBe("on_track");
  });

  it("marks a key result completed when it reaches its target", () => {
    updateKeyResult(objectiveId, firstKrId, 10);

    const objective = getObjective(objectiveId);
    const kr1 = objective!.keyResults.find((kr) => kr.id === firstKrId);
    expect(kr1!.status).toBe("completed");
  });

  it("caps the objective progress at 100 even past the targets", () => {
    updateKeyResult(objectiveId, firstKrId, 10);
    updateKeyResult(objectiveId, secondKrId, 999);

    const objective = getObjective(objectiveId);
    expect(objective!.progress).toBe(100);
  });

  it("summarises OKRs across departments", () => {
    const summary = getOKRSummary();

    expect(summary.totalObjectives).toBeGreaterThanOrEqual(1);
    expect(Object.keys(summary.byDepartment)).toContain("education");
    expect(summary.byDepartment["education"].count).toBeGreaterThanOrEqual(1);
  });
});
