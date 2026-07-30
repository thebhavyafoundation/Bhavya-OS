# Changelog

## v3.1.0 (2026-07-30)

### Added

- **Provenance System**: Every builder output now carries `_provenance` metadata (artifactId, builder, runtimeVersion, source KO, parent artifacts, quality gate). Provenance records written to `bhavya-ai-lab/institution/provenance/`. Query via `GET /provenance`, `GET /provenance/:artifactId`, `GET /provenance?graph=true`.
- **Build Manifests**: Each pipeline run emits a build manifest to `bhavya-ai-lab/institution/manifests/` listing all artifacts, quality gate summary, and duration. Query via `GET /manifests`, `GET /manifests/:buildId`.
- **Animation Studio** (`/animation/[id]`): Full-page timeline editor with scene timeline panel (horizontal element timing bars, transition info), element timeline (color-coded per-animation bars), color palette display, and video spec metadata grid. Accessible via Animation Studio tab in lesson editor.
- **Shared Configuration Module** (`packages/runtime/engine/config.mjs`): Single source of truth for `ROOT`, `BHAVYA_LAB`, path resolution, and file helpers. All engine modules now import from this module instead of computing paths independently.
- **Quality Gates Validation**: 10 quality gates (structure, schemas, assets, components, accessibility, performance, responsive, naming, imports, dependencies) with 30+ checks now properly loaded and executed from `bhavya-ai-lab/quality-gates/rules.json`.
- **API Endpoints**: `GET /provenance`, `GET /manifests`, `GET /registry` (mirror), `GET /quality-gates`.
- **Runtime Client Helpers**: `listProvenanceRecords`, `getProvenanceRecord`, `getProvenanceGraph`, `listBuildManifests`, `getBuildManifest`.

### Changed

- **Path Resolution**: Unified all runtime path resolution through `config.mjs`. Previously each module computed `ROOT`/`BHAVYA_LAB` independently — course-manager, lesson-manager, knowledge-pipeline, api-standalone all had duplicated path logic.
- **Observability Paths**: Metrics and logs moved from `.ai/state/` to `bhavya-ai-lab/observability/` for consistency with the BHAVYA_LAB convention.
- **Error Handling**: All API file operations now have proper try/catch error handling (registry mirror, quality gates, KO CRUD create/update/delete).
- **Version**: Updated from `3.0.0` to `3.1.0`.

### Fixed

- Quality gates rules.json path resolution — now correctly resolves relative to `bhavya-ai-lab/` instead of project root.
- Builder loader on Windows — uses `fileURLToPath` instead of `URL.pathname` for correct path decoding.
- Build manifest directory auto-creation — uses shared `writeJSON` helper with recursive mkdir.
- Course and lesson managers now use shared `readJSON`/`writeJSON` helpers from config module.

### Regressions Verified

- All 7 pipeline stages pass (lesson, assessment, teacherGuide, workbook, visualSpec, video, website)
- Quality gates: 10 gates loaded, pre/post validation executes
- Provenance records written and queryable via API
- Build manifests written and queryable via API
- Lesson Studio TypeScript compiles with no new errors
- Animation Studio TypeScript compiles with no errors

## v3.0.0 (Previous)

- Production Engineering Ecosystem
- Remotion, Skills, Design System, Quality Gates
- Package Manager, Builder System, Capability Discovery
- Model-agnostic runtime (OpenCode)
- Architectural review and ICM principles
