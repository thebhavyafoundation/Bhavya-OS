/**
 * Institutional Drift Detection — Shared Primitive
 *
 * Compares materialized metrics against canonical filesystem state.
 * Used by both Knowledge and Forest domains.
 *
 * ## What Is Shared (Identical Semantics)
 * - Counting files by prefix in a directory
 * - Comparing materialized counts to filesystem counts
 * - Detecting drift (mismatch between counters and reality)
 *
 * ## What Is Domain-Specific (NOT Shared)
 * - Which directories to scan
 * - Which file prefixes to count
 * - What the materialized metrics look like
 *
 * ## Usage
 * ```typescript
 * const detector = new DriftDetector({
 *   canonicalDir: join(process.cwd(), "content", "forest"),
 *   prefixes: ["mission-", "site-", "planting-"],
 * });
 *
 * const drift = detector.detect([
 *   { name: "missions", materialized: metrics.totalMissions },
 *   { name: "sites", materialized: metrics.totalSites },
 * ]);
 * ```
 */

import { readdirSync, existsSync } from "fs";

// ── Types ──────────────────────────────────────────────────────

export interface DriftDetectorConfig {
  /** Directory containing canonical data files */
  canonicalDir: string;
}

export interface DriftCheck {
  name: string;
  prefix: string;
  materialized: number;
}

export interface DriftResult {
  name: string;
  prefix: string;
  materialized: number;
  canonical: number;
  drift: number;
}

// ── Detector ────────────────────────────────────────────────

export class DriftDetector {
  private canonicalDir: string;

  constructor(config: DriftDetectorConfig) {
    this.canonicalDir = config.canonicalDir;
  }

  /**
   * Count files in the canonical directory matching a prefix.
   */
  countFiles(prefix: string): number {
    try {
      if (existsSync(this.canonicalDir)) {
        return readdirSync(this.canonicalDir).filter(
          (f) => f.startsWith(prefix) && f.endsWith(".json"),
        ).length;
      }
    } catch { /* directory may not exist */ }
    return 0;
  }

  /**
   * Detect drift between materialized counts and filesystem state.
   */
  detect(checks: DriftCheck[]): DriftResult[] {
    return checks.map((check) => ({
      name: check.name,
      prefix: check.prefix,
      materialized: check.materialized,
      canonical: this.countFiles(check.prefix),
      drift: check.materialized - this.countFiles(check.prefix),
    }));
  }

  /**
   * Check if any drift exists.
   */
  hasDrift(checks: DriftCheck[]): boolean {
    return this.detect(checks).some((r) => r.drift !== 0);
  }
}
