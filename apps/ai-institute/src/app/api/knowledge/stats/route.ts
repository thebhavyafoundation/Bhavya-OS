/**
 * Public Knowledge Stats API
 *
 * Returns public-safe knowledge statistics with real institutional metrics.
 * Uses the canonical KnowledgeRepository (filesystem) and institutional evidence/metrics.
 *
 * ## Metric Definitions
 *
 * - totalKos: count of canonical KO JSON files in bhavya-ai-lab/knowledge/objects/
 * - totalLessons: count of lessons in Studio SQLite (canonical source)
 * - totalPublications: cumulative lesson publication events
 * - koCreatedThisMonth: KO creation events during current calendar month
 * - lessonsPublishedThisMonth: lesson publication events during current calendar month
 */

import { NextResponse } from "next/server";
import { listKOs } from "@/lib/knowledge-repository";
import { getKnowledgeMetrics } from "@/lib/knowledge-metrics";
import { listEvidence, getEvidenceCounts } from "@/lib/institutional-evidence";
import { isKOPublicEligible } from "@/lib/public-projection";

export async function GET() {
  try {
    const allKos = listKOs();

    // Filter to public-eligible only (shared predicate with public-projection.ts)
    const publicKos = allKos.filter(isKOPublicEligible);

    const metrics = getKnowledgeMetrics();

    const evidence = listEvidence(10); // Latest 10 evidence entries
    const evidenceCounts = getEvidenceCounts();

    return NextResponse.json({
      // Counts — derived from actual filesystem state where possible
      totalKos: publicKos.length, // Filtered: published + institutional only
      totalLessons: metrics.totalLessons,
      totalPublications: metrics.totalPublications,

      // Monthly activity
      koCreatedThisMonth: metrics.koCreatedThisMonth,
      lessonsPublishedThisMonth: metrics.lessonsPublishedThisMonth,

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
      totalKos: 0,
      totalLessons: 0,
      totalPublications: 0,
      koCreatedThisMonth: 0,
      lessonsPublishedThisMonth: 0,
      evidenceCounts: {},
      recentEvidence: [],
      lastUpdated: null,
    });
  }
}
