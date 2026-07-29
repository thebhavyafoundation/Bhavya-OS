# Changelog

All notable changes to @bhavya/content-core will be documented in this file.

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
