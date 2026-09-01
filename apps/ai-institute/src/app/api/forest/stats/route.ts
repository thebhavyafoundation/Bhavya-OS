/**
 * Public Forest Stats API
 *
 * Returns real forest institutional metrics with drift detection.
 * Reads directly from content/forest/ filesystem.
 *
 * ## Test Data Separation
 *
 * Records are classified by `provenance` field:
 * - "institutional": Created via authorized API with evidence recording
 * - "test-seed": Created during development/testing
 * - "imported": Imported from external source
 *
 * The public projection shows ONLY institutional records.
 * Test-seeded records are counted separately and clearly labeled.
 */

import { NextResponse } from "next/server";
import { getMissions, getSites, getSurveys, getPlantings, getMonitoring, getForestImpactReports } from "@bhavya/content-core";
import { getForestMetrics, rebuildForestMetricsFromEvidence, detectForestMetricsDrift } from "@/lib/forest-metrics";
import { listForestEvidence, getForestEvidenceCounts } from "@/lib/forest-evidence";

function countByProvenance<T>(
  items: T[],
): { total: number; institutional: number; testSeed: number } {
  let institutional = 0;
  let testSeed = 0;
  for (const item of items) {
    const prov = (item as Record<string, unknown>).provenance;
    if (prov === "institutional") {
      institutional++;
    } else {
      testSeed++;
    }
  }
  return { total: items.length, institutional, testSeed };
}

export async function GET() {
  try {
    // Authoritative counts from content-core — same source as GET/POST
    const missions = countByProvenance(getMissions());
    const sites = countByProvenance(getSites());
    const plantings = countByProvenance(getPlantings());
    const surveys = countByProvenance(getSurveys());
    const monitoring = countByProvenance(getMonitoring());
    const impactReports = countByProvenance(getForestImpactReports());

    // Check for drift and rebuild from evidence if necessary
    const { drift } = detectForestMetricsDrift();
    const metrics = drift
      ? rebuildForestMetricsFromEvidence()
      : getForestMetrics();

    // Evidence summary
    const evidence = listForestEvidence(10);
    const evidenceCounts = getForestEvidenceCounts();

    return NextResponse.json({
      // Institutional counts — only records created via authorized API
      totalMissions: missions.institutional,
      totalSites: sites.institutional,
      totalPlantings: plantings.institutional,
      totalSurveys: surveys.institutional,
      totalMonitoring: monitoring.institutional,
      totalImpactReports: impactReports.institutional,

      // Test/seed counts — clearly separated
      testSeedRecords: {
        missions: missions.testSeed,
        sites: sites.testSeed,
        plantings: plantings.testSeed,
        surveys: surveys.testSeed,
        monitoring: monitoring.testSeed,
        impactReports: impactReports.testSeed,
        total: missions.testSeed + sites.testSeed + plantings.testSeed +
          surveys.testSeed + monitoring.testSeed + impactReports.testSeed,
      },

      // Monthly activity (from evidence — only institutional)
      missionsCreatedThisMonth: metrics.missionsCreatedThisMonth,
      plantingsCreatedThisMonth: metrics.plantingsCreatedThisMonth,

      // Evidence summary
      evidenceCounts,
      recentEvidence: evidence.map((e) => ({
        id: e.id,
        activityType: e.activityType,
        description: e.description,
        timestamp: e.timestamp,
      })),

      // Metadata
      lastUpdated: metrics.lastUpdated,
    });
  } catch {
    return NextResponse.json({
      totalMissions: 0,
      totalSites: 0,
      totalPlantings: 0,
      totalSurveys: 0,
      totalMonitoring: 0,
      totalImpactReports: 0,
      testSeedRecords: { total: 0 },
      missionsCreatedThisMonth: 0,
      plantingsCreatedThisMonth: 0,
      evidenceCounts: {},
      recentEvidence: [],
      lastUpdated: null,
    });
  }
}
