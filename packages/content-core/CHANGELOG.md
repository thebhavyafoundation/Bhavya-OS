# Changelog

All notable changes to @bhavya/content-core will be documented in this file.

## [1.0.1] - 2026-07-29

### Engineering Excellence

Testing and validation release. No feature changes.

### Added

- **Test Suite**: 55 unit tests across 9 test files
  - `io.test.ts`: Filesystem operations (ensureDir, writeJSON, readJSON, listDir)
  - `documents.test.ts`: Document metadata parsing (parseMarkdownMetadata, parseJsonMetadata)
  - `entities.test.ts`: Entity repository (getEntities, getEntity, getEntitiesByType, searchEntities)
  - `graph.test.ts`: Knowledge graph (getGraphNodeNeighbors, getGraphStats)
  - `search.test.ts`: Search indexing (getSearchIndex, searchAll, searchDocuments, getContentStats)
  - `publish.test.ts`: Publishing pipeline (publishKnowledge, publishFieldReport, publishImpactReport, publishSurveyResult, publishMonitoringLog)
  - `research.test.ts`: Research domain (projects, sources, evidence, reviews, stats)
  - `forest.test.ts`: Forest domain (missions, sites, surveys, plantings, monitoring, impact)
  - `volunteer.test.ts`: Volunteer domain (volunteers, skills, training, assignments, participations, recognitions)

- **Validation Framework**: `pnpm validate` runs 7 validators across 21 checks
  - Document Validator: duplicate IDs, missing title, missing category, missing content
  - Entity Validator: duplicate IDs, missing type, missing name
  - Relationship Validator: duplicate edges, broken source/target references
  - Knowledge Graph Validator: duplicate nodes, graph consistency
  - Search Index Validator: index has documents, stats consistency
  - Publication Validator: published documents exist, valid statuses
  - Mission Data Validator: forest, heritage, research, volunteer data consistency

- **Test Configuration**: vitest.config.ts with globals enabled
- **Root Scripts**: `pnpm test` and `pnpm validate` run across all packages via turbo

## [1.0.0] - 2026-07-29

### Initial Stable Release

First stable release of the Bhavya Foundation institutional platform.

### Added

- **Core Models**: Document, Entity, Relationship, Citation, Source, Evidence, GraphNode
- **I/O Utilities**: readJSON, readMD, listDir, writeJSON, ensureDir, resolvePath
- **Document Repository**: getDocuments, getDocument, getDocumentsByCategory, getRecentDocuments, parseMarkdownMetadata, parseJsonMetadata
- **Collection Repository**: getCollections, getCollection (11 default collections)
- **Entity Repository**: getEntities, getEntity, getEntitiesByType, searchEntities
- **Knowledge Graph**: getRelationships, getRelationshipsBySource/Target/Type, getGraphNodeNeighbors, getGraphStats, getKnowledgeGraph, getGraphNode, getLinkedNodes
- **Search**: getSearchIndex, searchAll, searchDocuments, getContentStats
- **Publication Contract**: publishKnowledge, publishFieldReport, publishImpactReport, publishSurveyResult, publishMonitoringLog
- **Research Domain**: Projects, Sources, Evidence, Reviews with full CRUD
- **Forest Domain**: Missions, Sites, Surveys, Plantings, Monitoring, Impact with auto-publishing
- **Heritage Domain**: Missions, Sites, Assets, Assessments, Documentation, Conservation Plans, Impact with auto-publishing
- **Volunteer Domain**: Volunteers, Skills, Training, Assignments, Participation, Recognition with auto-publishing

### Architecture

- Unified publishing pipeline across all mission apps
- Domain isolation (no cross-domain dependencies)
- Filesystem-based storage with JSON/Markdown
- Automatic Knowledge indexing on create operations
