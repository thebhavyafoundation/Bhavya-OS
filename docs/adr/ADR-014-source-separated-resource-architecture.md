# ADR-014: Source-Separated External Resource Architecture

**Status:** Accepted | **Date:** 2026-09-18 | **Deciders:** Build-phase engineering (evidence: SOURCE_SEPARATION_MODEL.md)
**Source:** `.ai/audits/master-reconstruction/SOURCE_SEPARATION_MODEL.md`; `LESSONS_SOURCE_ANALYSIS.md`; `source-b-catalog.json`

## Context

Two curriculum authorities exist. Source A (Bhavya Academy, repo-owned) and
Source B (Raspberry Pi Foundation "Experience AI", external, CC BY-NC-ND 4.0).
The product must reference Source B without merging, ingesting bodies, or
presenting it as Bhavya-authored. No canonical authority type existed.

## Decision

1. `CurriculumSourceId` ("bhavya-academy" | "external-experience-ai") plus
   `ResourceSource`, `ExternalResourceRef`, `ResourceRelationship` live
   canonically in `@bhavya/shared` (extends, not duplicates, existing
   `SourceType`/`RecordProvenance` axes). Optional `source?` on shared
   Course/Lesson/CourseModuleLesson defaults to "bhavya-academy".
2. Source B is represented by catalog facts ONLY via deterministic generation:
   `scripts/generate-source-b-registry.mjs` reads the audit catalog and emits
   `apps/ai-institute/src/data/source-b-registry.generated.ts` (never hand-edited;
   `--check` mode for CI). No lesson bodies enter the repo.
3. UI surfaces Source B as attributed external references (provider + license),
   filterable separately from Bhavya content. Mapping rows (if ever built) are
   repo-owned `ResourceRelationship` records — endpoints stay identifiable.

## Alternatives Considered

- Ingesting full lesson bodies: rejected (license ND term + mission no-merge rule).
- Storing Source B in SQLite/content-core: rejected (same reason; metadata-only).
- New `@bhavya/curriculum` package now: deferred (declared owners in
  DOMAIN_OWNERSHIP.md don't exist yet; local mirrors follow existing precedent).

## Consequences

- Library serves 31 real external references with attribution (no more empty stub).
- Future Bhavya/external mapping has typed seams; merging stays structurally hard.
- Generator input (audit catalog) is currently untracked — promoting it to a
  tracked seed is future work requiring human approval.
