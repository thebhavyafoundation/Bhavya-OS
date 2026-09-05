# Architecture Overview

This document describes the architectural design of the Bhavya Foundation institutional platform.

## Design Philosophy

The platform follows three core principles:

1. **Single Source of Truth** — All institutional data flows through one canonical pipeline.
2. **Domain Isolation** — Mission applications operate independently with no cross-domain dependencies.
3. **Read-Only Intelligence** — Analytics and insights never modify the underlying data.

## Layered Architecture

The platform consists of six distinct layers:

```
Mission Layer
──────────────────────────────────
Research
Forest
Heritage
Volunteer

                │ (publish)

Platform Layer
──────────────────────────────────
@bhavya/content-core

                │

Knowledge Layer
──────────────────────────────────
Knowledge

                │ (read-only)

Intelligence Layer
──────────────────────────────────
@bhavya/intelligence

                │

Presentation Layer
──────────────────────────────────
Library
Website

                │

User Experience
──────────────────────────────────
Search
Discovery
Insights
```

## Dependency Rules

Dependencies flow one direction:

```
Mission Apps → content-core → Knowledge → intelligence → Presentation
```

**Never:**

- Intelligence writing to content-core
- Mission apps importing from other mission apps
- Presentation layer importing from mission apps
- Any circular dependencies

## Data Flow

### Publishing Pipeline

1. Mission apps create domain-specific data
2. `publishKnowledge()` writes to content-core
3. content-core indexes data for search and graph
4. Knowledge app exposes data through APIs
5. intelligence layer reads and interprets data
6. Library and Website present insights to users

### Content Types

| Type          | Source                   | Storage                         |
| ------------- | ------------------------ | ------------------------------- |
| Documents     | Mission apps, governance | `content/` directory            |
| Entities      | Extracted from documents | `data/entities.json`            |
| Relationships | Knowledge graph          | `registry/knowledge-graph.json` |
| Collections   | Curated groupings        | `data/collections.json`         |

## Package Architecture

### @bhavya/content-core

**Responsibility:** Canonical content platform

**Provides:**

- Document repository
- Entity repository
- Knowledge graph
- Search indexing
- Publishing pipeline
- Validation framework

**Key Functions:**

```typescript
getDocuments(); // All documents
getEntities(); // All entities
getKnowledgeGraph(); // Knowledge graph nodes
getSearchIndex(); // Search index
publishKnowledge(); // Publish to Knowledge
```

### @bhavya/intelligence

**Responsibility:** Cross-mission interpretation

**Invariant:** Never mutates institutional data

**Provides:**

- Global search
- Graph exploration
- Cross-mission analytics
- Explainable recommendations

**Key Functions:**

```typescript
search(); // Unified search
getGraphNodeById(); // Graph exploration
getOperationalMetrics(); // Operational analytics
getRecommendations(); // Related content
```

## Knowledge API

The Knowledge app exposes intelligence through a stable API:

| Endpoint                   | Purpose                  | Returns               |
| -------------------------- | ------------------------ | --------------------- |
| `GET /api/search?q=query`  | Discovery                | SearchInsight         |
| `GET /api/recommendations` | Related content          | RecommendationInsight |
| `GET /api/graph`           | Relationship exploration | GraphInsight          |
| `GET /api/analytics`       | Institutional metrics    | AnalyticsInsight      |

## Insight<T> Type

All intelligence capabilities return `Insight<T>`:

```typescript
interface Insight<T> {
  id: string;
  title: string;
  description: string;
  confidence: number; // 0-1 based on data quality
  evidence: Evidence[]; // Supporting sources
  generatedAt: string; // ISO timestamp
  data: T; // Typed payload
}
```

## Metrics Separation

Analytics distinguishes two types:

### Operational Metrics

- Active missions
- Volunteer activity
- Publication activity
- Restoration progress

### Knowledge Metrics

- Entity growth
- Relationship density
- Citation coverage
- Cross-domain connections

## Quality Gates

Every merge must pass:

```bash
pnpm lint && pnpm test && pnpm validate && pnpm build
```

| Gate            | Purpose                            |
| --------------- | ---------------------------------- |
| `pnpm lint`     | Code style                         |
| `pnpm test`     | Behavioral verification (55 tests) |
| `pnpm validate` | Data integrity (21 checks)         |
| `pnpm build`    | Compilation                        |

## Extension Guidelines

### Adding a New Mission

1. Use `pnpm scaffold mission <name> <port>`
2. Define domain models in content-core
3. Implement `publishKnowledge()` for auto-indexing
4. Add validation rules if needed

### Adding Intelligence

1. Create module in `packages/intelligence/src/`
2. Return `Insight<T>` with evidence
3. Never mutate content-core data
4. Expose through Knowledge API

### Adding Presentation

1. Create app in `apps/`
2. Consume Knowledge API
3. Focus on user experience
4. Keep business logic in intelligence layer

## Version History

| Version       | Milestone                                                |
| ------------- | -------------------------------------------------------- |
| v0.6.0        | Shared content platform                                  |
| v0.7.0–v0.9.0 | Mission applications                                     |
| v1.0.0        | Stable architecture                                      |
| v1.0.1        | Engineering excellence                                   |
| v1.1.0        | Institution intelligence                                 |
| v1.2.0        | Operational intelligence                                 |
| v1.3.0        | Decision support                                         |
| v2.0.0        | Phase II: Governance operations                          |
| v2.1.0        | Phase II: Resolution lifecycle, policy versioning        |
| v2.2.0        | Phase II: Action items, operational health               |
| v2.3.0        | Phase II: Traceability, evidence, snapshot/trend metrics |
| v2.4.0        | Phase II: Impact reporting                               |
| v2.5.0        | Phase II: Cross-domain reporting                         |
| v3.0.0        | Phase III: Institutional memory                          |
| v3.1.0        | Phase III: Organizational learning                       |
| v3.2.0        | Phase III: Predictive intelligence                       |
| v3.3.0        | Phase III: Institutional playbooks                       |

## Institutional Cycle

The platform now supports a complete institutional learning cycle:

```
Strategy
    │
    ▼
Governance
    │
    ▼
Operations
    │
    ▼
Evidence
    │
    ▼
Canonical Records
    │
    ▼
Institutional Memory
    │
    ▼
Organizational Learning
    │
    ▼
Predictive Intelligence
    │
    ▼
Institutional Playbooks
    │
    ▼
Decision Support
    │
    ▼
Reports
    │
    ▼
Governance Review
    │
    └──────────────► informs the next Strategy
```

Every stage consumes the outputs of the previous stage instead of introducing another source of truth.

## Institutional Knowledge Hierarchy

The platform supports six levels of institutional knowledge:

| Level       | Question Answered         | Source                             |
| ----------- | ------------------------- | ---------------------------------- |
| Records     | What happened?            | Canonical data in content-core     |
| Evidence    | How do we know?           | Verification, traceability         |
| Memory      | Why did it happen?        | Decision context, lessons          |
| Patterns    | What tends to happen?     | Organizational learning            |
| Predictions | What is likely to happen? | Predictive intelligence            |
| Playbooks   | What should we do?        | Validated institutional experience |

This progression moves from descriptive knowledge to prescriptive guidance.

## Four Eras of Development

| Era                      | Central Question                                     | Outcome                                                             |
| ------------------------ | ---------------------------------------------------- | ------------------------------------------------------------------- |
| Platform Foundation      | How do we represent the institution consistently?    | Canonical models, mission applications, engineering quality         |
| Operational Intelligence | How do we understand current institutional state?    | Knowledge, analytics, dashboards, decision support                  |
| Institutional Operations | How do we govern and execute work?                   | Governance, evidence, traceability, reporting                       |
| Institutional Learning   | How do we improve because of accumulated experience? | Memory, predictive intelligence, organizational learning, playbooks |

Each era builds on the previous one without replacing it.
