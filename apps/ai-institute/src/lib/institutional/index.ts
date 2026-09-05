/**
 * Institutional Primitives — Shared Infrastructure
 *
 * Proven abstractions extracted from Knowledge and Forest domains.
 * These primitives are domain-agnostic and reusable across any institutional slice.
 *
 * ## Extracted Primitives
 *
 * ### EvidenceStore
 * Generic evidence storage with idempotency, immutable records, and
 * filesystem-backed persistence. Parameterized by directory and activity types.
 *
 * ### DriftDetector
 * Compares materialized metrics against canonical filesystem state.
 * Parameterized by directory and file prefixes.
 *
 * ## What Is NOT Here (Domain-Specific)
 *
 * Activity type enumerations stay in domain modules:
 * - `institutional-evidence.ts` → Knowledge activity types
 * - `forest-evidence.ts` → Forest activity types
 *
 * Metric shapes stay in domain modules:
 * - `knowledge-metrics.ts` → KnowledgeMetrics interface
 * - `forest-metrics.ts` → ForestMetrics interface
 *
 * ## Adding a New Domain
 *
 * To add a new institutional domain (e.g., Research):
 * 1. Create `research-evidence.ts` using `EvidenceStore`
 * 2. Create `research-metrics.ts` using `DriftDetector`
 * 3. Define domain-specific activity types and metric shapes
 * 4. Wire evidence recording into API routes after successful persistence
 */

export { EvidenceStore } from "./evidence-store";
export type { EvidenceRecord, EvidenceStoreConfig } from "./evidence-store";

export { DriftDetector } from "./drift-detector";
export type { DriftDetectorConfig, DriftCheck, DriftResult } from "./drift-detector";
