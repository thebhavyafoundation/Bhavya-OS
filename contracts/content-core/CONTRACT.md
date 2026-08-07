# @bhavya/content-core — Contract v1.0.0

**Frozen:** 2026-08-07 | **Author:** Wave 4 Consolidation | **Status:** ACTIVE

## Exports

### Core Types
- `ContentPipeline` — Main pipeline orchestrator
- `ContentStage` — Pipeline stage interface
- `ContentArtifact` — Generated artifact (lesson, assessment, guide, workbook, video, website)
- `ContentConfig` — Pipeline configuration
- `ContentMetrics` — Performance metrics

### Validation
- `validateContent()` — Validates content against quality criteria
- `QualityCriteria` — Quality gate interface
- `ValidationResult` — Validation outcome

### Citation
- `CitationManager` — Manages source citations
- `Citation` — Citation interface
- `ReferenceStyle` — APA, MLA, Chicago, etc.

### Versioning
- `ContentVersion` — Version tracking
- `VersionHistory` — Change history
- `DiffResult` — Version comparison

### Review Workflow
- `ReviewStatus` — pending | in_review | approved | rejected
- `ReviewComment` — Review feedback
- `ReviewDecision` — Final decision

### Publish Gates
- `PublishGate` — Pre-publish validation
- `PublishResult` — Publish outcome
- `PublishConfig` — Publish settings

---

## Breaking Change Policy

1. **Major version bump** for removing/renaming exports
2. **Deprecation period:** 3 releases before removal
3. **Pipeline changes:** Must maintain backward compatibility
