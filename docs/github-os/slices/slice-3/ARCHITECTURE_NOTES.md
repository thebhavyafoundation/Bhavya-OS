# Slice 3: Architecture Notes

## Component Architecture

### New Page Components

- `PatternLibraryPage` — Searchable pattern catalog with detail panel
- `KnowledgeGraphPage` — SVG-based graph visualization with node selection
- `EducationalPage` — Filterable educational exports with content viewer
- `LearningModePage` — Tabbed learning experience per repository
- `TimelinePage` — Vertical timeline with event types
- `HealthPage` — 8-dimension health score with methodology
- `MemoryPage` — Q&A format institutional memory

### New API Routes

- `/api/patterns` — Pattern library CRUD
- `/api/knowledge-graph` — Graph data
- `/api/educational` — Educational exports
- `/api/health` — Engineering health scores
- `/api/repositories/[id]/learning` — Learning path data
- `/api/repositories/[id]/timeline` — Timeline events
- `/api/repositories/[id]/health` — Single repository health
- `/api/repositories/[id]/memory` — Institutional memory

## Database Design

### New Tables

```sql
pattern_library (
  id TEXT PRIMARY KEY,
  name TEXT, slug TEXT, category TEXT,
  explanation TEXT, use_cases TEXT (JSON),
  related_patterns TEXT (JSON), educational_value TEXT,
  bhavya_recommendation TEXT, learning_mode TEXT,
  difficulty TEXT
)

repository_timelines (
  id TEXT PRIMARY KEY,
  repository_id TEXT FK,
  event_type TEXT, title TEXT, description TEXT,
  event_date DATETIME
)

engineering_health (
  id TEXT PRIMARY KEY,
  repository_id TEXT FK,
  overall_score REAL,
  documentation_score REAL, test_coverage_score REAL,
  dependency_freshness_score REAL, release_cadence_score REAL,
  architecture_consistency_score REAL, knowledge_coverage_score REAL,
  adr_coverage_score REAL, educational_completeness_score REAL,
  calculation_methodology TEXT, recommendations TEXT (JSON)
)

learning_paths (
  id TEXT PRIMARY KEY,
  repository_id TEXT FK,
  prerequisites TEXT (JSON), learning_objectives TEXT (JSON),
  reading_order TEXT (JSON), important_folders TEXT (JSON),
  key_files TEXT (JSON), concepts_demonstrated TEXT (JSON),
  suggested_exercises TEXT (JSON), mini_projects TEXT (JSON),
  capstone_ideas TEXT (JSON), estimated_hours REAL, difficulty TEXT
)

knowledge_graph_nodes (
  id TEXT PRIMARY KEY,
  node_type TEXT, label TEXT, metadata TEXT (JSON)
)

knowledge_graph_edges (
  id TEXT PRIMARY KEY,
  source_id TEXT, target_id TEXT,
  relationship TEXT, weight REAL
)

educational_exports (
  id TEXT PRIMARY KEY,
  repository_id TEXT FK,
  export_type TEXT, title TEXT, content TEXT,
  metadata TEXT (JSON)
)

institutional_memory (
  id TEXT PRIMARY KEY,
  repository_id TEXT FK,
  question TEXT, answer TEXT,
  evidence TEXT (JSON), confidence REAL
)
```

## Key Patterns

1. **Single-fetch learning** — Learning mode page fetches all data (path, health, knowledge, patterns, exports) in one API call.

2. **Graph as data** — Knowledge graph stored as nodes/edges tables, rendered as SVG. No graph database needed.

3. **Health as dimensions** — 8 health dimensions stored as separate columns, not JSON. Enables direct comparison and sorting.

4. **Memory as Q&A** — Institutional memory stored as question/answer pairs with evidence arrays. Simple to query and display.

5. **Educational as content** — Educational exports stored as markdown content with metadata. Ready for rendering.

## Scaling Considerations

- 15 graph nodes is manageable in SVG; would need canvas at 100+ nodes
- Health calculation is static; real implementation needs metric collection
- Learning paths are static; AI generation would be dynamic
- Timeline events are manually created; would need webhook integration
- Pattern library grows linearly; no pagination needed yet
