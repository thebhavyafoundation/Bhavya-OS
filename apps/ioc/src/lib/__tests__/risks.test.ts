import { describe, expect, it, beforeAll } from "vitest";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { migrate } from "@bhavya/database";
import { createRisk, updateRiskStatus, getRiskSummary } from "../risks";

/**
 * Risk aggregation specifications, run against a temporary SQLite database.
 *
 * getRiskSummary decides, on the dashboard, how many open critical and high
 * risks the institution carries. The buckets are keyed on status = 'open',
 * so a lost status filter or double-counting would silently hide the most
 * dangerous risks — exactly the failure nobody discovers until a review.
 */

let scratchDir: string;

beforeAll(async () => {
  scratchDir = mkdtempSync(join(tmpdir(), "bhavya-ioc-risks-"));
  process.env.BHAVYA_DB_PATH = join(scratchDir, "ioc.db");

  // The app's getDb() calls migrate("ioc") without awaiting it. Await it in
  // the test against this scratch database instead of changing the app.
  await migrate("ioc");
});

describe("risk aggregation", () => {
  let criticalId = "";
  let highId = "";
  let mediumId = "";

  it("counts open risks by severity and ignores mitigated ones", () => {
    criticalId = createRisk({
      title: "Turso production database has test data in it",
      severity: "critical",
    }).id;
    highId = createRisk({
      title: "Backups have not been verified in 90 days",
      severity: "high",
    }).id;
    mediumId = createRisk({
      title: "Curriculum page copy is outdated",
      severity: "medium",
    }).id;

    const summary = getRiskSummary();

    expect(summary.total).toBe(3);
    expect(summary.open).toBe(3);
    expect(summary.critical).toBe(1);
    expect(summary.high).toBe(1);
    expect(summary.medium).toBe(1);
    expect(summary.low).toBe(0);
    expect(summary.mitigated).toBe(0);
    expect(summary.closed).toBe(0);
  });

  it("stops counting a risk against critical when it is mitigated", () => {
    updateRiskStatus(criticalId, "mitigated");

    const summary = getRiskSummary();

    expect(summary.mitigated).toBe(1);
    expect(summary.open).toBe(2);
    expect(summary.critical).toBe(0);
    expect(summary.high).toBe(1);
  });

  it("counts a risk against closed when it is closed", () => {
    updateRiskStatus(mediumId, "closed");

    const summary = getRiskSummary();

    expect(summary.closed).toBe(1);
    expect(summary.open).toBe(1);
    expect(summary.high).toBe(1);
  });
});
