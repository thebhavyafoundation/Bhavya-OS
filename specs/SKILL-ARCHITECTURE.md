# Bhavya OS — Skill Architecture v1.0.0

## Design Principles

1. **Hierarchical Composition** — Skills compose upward; lower layers never import from higher layers.
2. **Capability Resolution** — The runtime resolves which skills to load based on declared capabilities, not hard-coded paths.
3. **Adopt-Adapt-Build** — Prefer adopted open-source; adapt when gaps exist; build only for institutional primitives.
4. **Single Source of Truth** — Every skill reads from and writes to the canonical data layer; no shadow stores.
5. **Offline-First** — All skills must function without network; online features are optional enhancements.

## Layer Map

```
┌─────────────────────────────────────────────────────────────┐
│  9. Mission Skills        Forest · Heritage · Library ·     │
│                            Volunteer · Projects              │
├─────────────────────────────────────────────────────────────┤
│  8. Operations Skills     Analytics · Search · Workflow ·   │
│                            Release                           │
├─────────────────────────────────────────────────────────────┤
│  7. Engineering Skills    Pipeline · Deploy · Monitor ·     │
│                            Agents · CI/CD                    │
├─────────────────────────────────────────────────────────────┤
│  6. Research Skills       Lit Review · Citations · Findings │
├─────────────────────────────────────────────────────────────┤
│  5. Governance Skills     Policy · Memory · Provenance ·    │
│                            Compliance                        │
├─────────────────────────────────────────────────────────────┤
│  4. Media Skills          Video · Audio · Images · Design   │
├─────────────────────────────────────────────────────────────┤
│  3. Education Skills      Curriculum · Lessons · Assessment ·│
│                            Teacher · Student                  │
├─────────────────────────────────────────────────────────────┤
│  2. Knowledge Skills      KO Lifecycle · Graph · Taxonomy   │
├─────────────────────────────────────────────────────────────┤
│  1. Foundation Skills     File I/O · Data · Config · Search │
└─────────────────────────────────────────────────────────────┘
```

**Dependency rule:** Layers depend only on layers below them. No circular dependencies.

---

## Layer 1 — Foundation Skills

Core infrastructure that every higher layer depends on.

### 1.1 File I/O

| Field                 | Value                           |
| --------------------- | ------------------------------- |
| **Parent capability** | Data persistence                |
| **Dependencies**      | None                            |
| **Implementation**    | Adapt                           |
| **Reference**         | `fs-extra` (npm), `graceful-fs` |
| **Priority**          | P0                              |

**Scope:** Atomic read/write/delete/copy for JSON, Markdown, binary. Directory traversal. Workspace-scoped paths. UTF-8 default with binary pass-through.

**Existing:** `bhavya-ai-lab/packages/` file utilities, `content-core` document repository.

---

### 1.2 Data Layer

| Field                 | Value                                           |
| --------------------- | ----------------------------------------------- |
| **Parent capability** | Canonical data storage                          |
| **Dependencies**      | 1.1 File I/O                                    |
| **Implementation**    | Build                                           |
| **Reference**         | `better-sqlite3` (embedded), `JSON` (flat-file) |
| **Priority**          | P0                                              |

**Scope:** Workspace-backed document store. Entity repository. Knowledge graph adjacency list. Schema validation on write. Immutable append log for provenance.

**Existing:** `content-core` document/entity repositories, `bhavya-ai-lab/knowledge/objects/`.

---

### 1.3 Configuration

| Field                 | Value                             |
| --------------------- | --------------------------------- |
| **Parent capability** | System configuration              |
| **Dependencies**      | 1.1 File I/O                      |
| **Implementation**    | Adopt                             |
| **Reference**         | `cosmiconfig`, `zod` (validation) |
| **Priority**          | P0                                |

**Scope:** Hierarchical config: defaults → workspace → environment → CLI flags. Schema-validated. Type-safe access. Secrets redacted from logs.

**Existing:** `_config/`, `opencode.json`, `turbo.json`, per-app `next.config.ts`.

---

### 1.4 Search Index

| Field                 | Value                                                                |
| --------------------- | -------------------------------------------------------------------- |
| **Parent capability** | Discovery                                                            |
| **Dependencies**      | 1.2 Data Layer                                                       |
| **Implementation**    | Adopt                                                                |
| **Reference**         | `minisearch` (in-memory), `typesense` (server), `tantivy` (Rust CLI) |
| **Priority**          | P0                                                                   |

**Scope:** Full-text keyword search over documents, knowledge objects, and entities. In-memory index for offline; optional server for scale. BM25 ranking. Faceted filtering by domain, grade, type.

**Existing:** `search-engine` package (stub), `@bhavya/intelligence` global search API.

---

### 1.5 Schema Registry

| Field                 | Value                      |
| --------------------- | -------------------------- |
| **Parent capability** | Data contracts             |
| **Dependencies**      | 1.3 Configuration          |
| **Implementation**    | Build                      |
| **Reference**         | `zod`, `ajv` (JSON Schema) |
| **Priority**          | P0                         |

**Scope:** Central registry of all data schemas: Knowledge Objects, lessons, assessments, governance records, provenance entries. Versioned. Validation functions exported for runtime checks.

**Existing:** `_config/schemas/`, `bhavya-ai-lab/_config/schemas/`.

---

### 1.6 Event Bus

| Field                 | Value                                      |
| --------------------- | ------------------------------------------ |
| **Parent capability** | Inter-skill communication                  |
| **Dependencies**      | 1.2 Data Layer                             |
| **Implementation**    | Build                                      |
| **Reference**         | `eventemitter3`, `postmsg-rpc` (cross-tab) |
| **Priority**          | P1                                         |

**Scope:** In-process pub/sub for skill-to-skill events. Typed channels. Buffered for offline replay. Optional WebSocket bridge for multi-process.

---

### 1.7 Logging & Observability

| Field                 | Value                 |
| --------------------- | --------------------- |
| **Parent capability** | Debugging, auditing   |
| **Dependencies**      | 1.3 Configuration     |
| **Implementation**    | Adopt                 |
| **Reference**         | `pino`, `pino-pretty` |
| **Priority**          | P1                    |

**Scope:** Structured JSON logging. Log levels: fatal, error, warn, info, debug, trace. Request-scoped context. Redaction of secrets. Optional export to file or stdout.

**Existing:** `bhavya-ai-lab/observability/`.

---

## Layer 2 — Knowledge Skills

Knowledge Object lifecycle: creation, enrichment, graph building, retrieval.

### 2.1 Knowledge Object CRUD

| Field                 | Value                               |
| --------------------- | ----------------------------------- |
| **Parent capability** | Knowledge ingestion                 |
| **Dependencies**      | 1.2 Data Layer, 1.5 Schema Registry |
| **Implementation**    | Build                               |
| **Reference**         | —                                   |
| **Priority**          | P0                                  |

**Scope:** Create, read, update, delete Knowledge Objects. Validate against KO schema. Idempotent writes. Version history. Import from JSON files.

**Existing:** `bhavya-ai-lab/knowledge/objects/`, runtime API `/knowledge` endpoints, `apps/knowledge/`.

---

### 2.2 Knowledge Graph

| Field                 | Value                        |
| --------------------- | ---------------------------- |
| **Parent capability** | Relationship mapping         |
| **Dependencies**      | 2.1 KO CRUD, 1.2 Data Layer  |
| **Implementation**    | Build                        |
| **Reference**         | `graphology` (graph library) |
| **Priority**          | P1                           |

**Scope:** Adjacency-list graph of KO relationships (prerequisite, related, builds-on). Traversal: BFS, DFS, shortest path. Cycle detection. Visual export for graph-based search.

**Existing:** `bhavya-ai-lab/knowledge/graph/`, `registry/knowledge-graph.json`.

---

### 2.3 Taxonomy Manager

| Field                 | Value               |
| --------------------- | ------------------- |
| **Parent capability** | Classification      |
| **Dependencies**      | 1.5 Schema Registry |
| **Implementation**    | Build               |
| **Reference**         | —                   |
| **Priority**          | P1                  |

**Scope:** Domain hierarchy (AI → ML → Neural Networks). Grade-level taxonomy (9→10→11→12). Subject taxonomy. Tag management. Crosswalk between taxonomies.

**Existing:** `bhavya-ai-lab/knowledge/taxonomy/`.

---

### 2.4 Knowledge Ingestion

| Field                 | Value                                                                          |
| --------------------- | ------------------------------------------------------------------------------ |
| **Parent capability** | Knowledge ingestion (PDF, DOCX, web, video transcripts)                        |
| **Dependencies**      | 2.1 KO CRUD, 3.7 Document Intelligence                                         |
| **Implementation**    | Adapt                                                                          |
| **Reference**         | `pdf-parse`, `mammoth` (DOCX), `turndown` (HTML→MD), `whisper` (transcription) |
| **Priority**          | P0                                                                             |

**Scope:** Extract structured content from PDF, DOCX, HTML, YouTube transcripts. Chunk into concepts. Map to KO schema. Deduplication. Language detection.

---

### 2.5 Knowledge Enrichment

| Field                 | Value                                                                         |
| --------------------- | ----------------------------------------------------------------------------- |
| **Parent capability** | Knowledge object generation (concepts, definitions, examples, misconceptions) |
| **Dependencies**      | 2.1 KO CRUD, 4.5 AI Provider                                                  |
| **Implementation**    | Build                                                                         |
| **Reference**         | —                                                                             |
| **Priority**          | P1                                                                            |

**Scope:** Auto-generate definitions from concepts. Generate examples from context. Identify misconceptions from domain patterns. Bloom's taxonomy tagging. Difficulty scoring.

**Existing:** `bhavya-ai-lab/knowledge/concepts/`, `bhavya-ai-lab/knowledge/glossary/`.

---

### 2.6 Citation Manager

| Field                 | Value                          |
| --------------------- | ------------------------------ |
| **Parent capability** | Research (citations)           |
| **Dependencies**      | 2.1 KO CRUD                    |
| **Implementation**    | Build                          |
| **Reference**         | `citeproc-js` (CSL formatting) |
| **Priority**          | P1                             |

**Scope:** Attach citations to KOs. CSL-JSON format. Bibliography generation. URL validation. Offline citation cache.

**Existing:** `bhavya-ai-lab/knowledge/citations/`.

---

## Layer 3 — Education Skills

Curriculum, lessons, assessments, teacher and student workflows.

### 3.1 Curriculum Engine

| Field                 | Value                                                                |
| --------------------- | -------------------------------------------------------------------- |
| **Parent capability** | Curriculum generation (grade-level progression, standards alignment) |
| **Dependencies**      | 2.1 KO CRUD, 2.2 Knowledge Graph, 2.3 Taxonomy Manager               |
| **Implementation**    | Build                                                                |
| **Reference**         | —                                                                    |
| **Priority**          | P0                                                                   |

**Scope:** Define grade-level learning progressions. Standards mapping (CBSE, NCERT). Prerequisite chains. Unit/lesson pacing. Backward design from outcomes.

**Existing:** `bhavya-ai-lab/curriculum/`.

---

### 3.2 Lesson Builder

| Field                 | Value                                          |
| --------------------- | ---------------------------------------------- |
| **Parent capability** | Knowledge object generation (lessons from KOs) |
| **Dependencies**      | 2.1 KO CRUD, 3.1 Curriculum Engine             |
| **Implementation**    | Build                                          |
| **Reference**         | —                                              |
| **Priority**          | P0                                             |

**Scope:** Compile KOs into 6-section lessons. Learning outcomes, vocabulary, activities, assessments. Multi-format output: JSON, HTML, PDF, slides.

**Existing:** `bhavya-ai-lab/builders/lesson/`, `apps/lesson-studio/`.

---

### 3.3 Assessment Builder

| Field                 | Value                                                            |
| --------------------- | ---------------------------------------------------------------- |
| **Parent capability** | Assessment generation (MCQ, short-answer, reflection, practical) |
| **Dependencies**      | 2.1 KO CRUD, 3.2 Lesson Builder                                  |
| **Implementation**    | Build                                                            |
| **Reference**         | —                                                                |
| **Priority**          | P0                                                               |

**Scope:** Generate 15-question assessments from lessons. MCQ with real KO definitions as distractors. Short-answer, reflection, practical questions. Answer keys with rubrics.

**Existing:** `bhavya-ai-lab/builders/quiz/`, `bhavya-ai-lab/assessments/`.

---

### 3.4 Teacher Guide Builder

| Field                 | Value                                                      |
| --------------------- | ---------------------------------------------------------- |
| **Parent capability** | Teacher workflows (guides, materials, timing, answer keys) |
| **Dependencies**      | 3.2 Lesson Builder, 3.3 Assessment Builder                 |
| **Implementation**    | Build                                                      |
| **Reference**         | —                                                          |
| **Priority**          | P1                                                         |

**Scope:** Objectives, materials list (subject-specific), discussion prompts, timing guide, answer keys, differentiation strategies, homework suggestions.

**Existing:** `bhavya-ai-lab/builders/teacher-guide/`, `bhavya-ai-lab/teachers/`.

---

### 3.5 Workbook Builder

| Field                 | Value                                                 |
| --------------------- | ----------------------------------------------------- |
| **Parent capability** | Student workflows (workbooks, exercises, reflections) |
| **Dependencies**      | 3.2 Lesson Builder, 2.5 Knowledge Enrichment          |
| **Implementation**    | Build                                                 |
| **Reference**         | —                                                     |
| **Priority**          | P1                                                    |

**Scope:** 8-page student workbooks. Key terms with definitions. Section exercises. Reflection prompts. Print-ready PDF and interactive HTML.

**Existing:** `bhavya-ai-lab/builders/workbook/`.

---

### 3.6 Slide Builder

| Field                 | Value                           |
| --------------------- | ------------------------------- |
| **Parent capability** | Presentation generation         |
| **Dependencies**      | 3.2 Lesson Builder              |
| **Implementation**    | Adapt                           |
| **Reference**         | `reveal.js`, `marp` (MD→slides) |
| **Priority**          | P2                              |

**Scope:** Generate presentation decks from lesson content. Markdown-based. Speaker notes. Theme support. Export to HTML and PDF.

**Existing:** `bhavya-ai-lab/builders/slides/`, `apps/lesson-studio/` slides tab.

---

### 3.7 Document Intelligence

| Field                 | Value                                                                    |
| --------------------- | ------------------------------------------------------------------------ |
| **Parent capability** | Document intelligence (extraction, conversion, analysis)                 |
| **Dependencies**      | 1.1 File I/O, 1.2 Data Layer                                             |
| **Implementation**    | Adapt                                                                    |
| **Reference**         | `pdf-parse`, `mammoth`, `tesseract.js` (OCR), `sharp` (image processing) |
| **Priority**          | P1                                                                       |

**Scope:** Extract text from PDF/DOCX/Images. OCR for scanned documents. Table extraction. Structure detection (headings, lists, code blocks). Format conversion pipeline.

**Existing:** `bhavya-ai-lab/builders/pdf/`.

---

## Layer 4 — Media Skills

Video, audio, images, design system.

### 4.1 Video Production Pipeline

| Field                 | Value                                                               |
| --------------------- | ------------------------------------------------------------------- |
| **Parent capability** | Video production (storyboarding, rendering, captions)               |
| **Dependencies**      | 4.3 Visual Spec, 1.1 File I/O                                       |
| **Implementation**    | Adapt                                                               |
| **Reference**         | `remotion` (React video), `ffmpeg` (encoding), `whisper` (captions) |
| **Priority**          | P1                                                                  |

**Scope:** Visual spec → Remotion scene graph → MP4 render. 8 compositions, 196s at 1920×1080. Caption overlay. Transition effects. Offline render queue.

**Existing:** `bhavya-ai-lab/builders/video/`, `bhavya-ai-lab/skills/remotion/`, `.agents/skills/hyperframes*`.

---

### 4.2 Audio Processing

| Field                 | Value                                                                  |
| --------------------- | ---------------------------------------------------------------------- |
| **Parent capability** | Voice, transcription, TTS                                              |
| **Dependencies**      | 1.1 File I/O                                                           |
| **Implementation**    | Adopt                                                                  |
| **Reference**         | `whisper.cpp` (local), `edge-tts` (free TTS), `sox` (audio processing) |
| **Priority**          | P2                                                                     |

**Scope:** Speech-to-text (offline via whisper.cpp). Text-to-speech. Audio normalization. Silence removal. Format conversion (WAV, MP3, OGG).

---

### 4.3 Visual Spec

| Field                 | Value              |
| --------------------- | ------------------ |
| **Parent capability** | Visual generation  |
| **Dependencies**      | 3.2 Lesson Builder |
| **Implementation**    | Build              |
| **Reference**         | —                  |
| **Priority**          | P1                 |

**Scope:** Lesson → scene graph with subject-aware palette, 8 scenes, timing, animation hints. Color palettes by domain (science=green, tech=blue, etc.).

**Existing:** Runtime builder `visual-spec.mjs`.

---

### 4.4 Design System

| Field                 | Value                                      |
| --------------------- | ------------------------------------------ |
| **Parent capability** | Design system (tokens, components, themes) |
| **Dependencies**      | 1.3 Configuration                          |
| **Implementation**    | Adapt                                      |
| **Reference**         | `tailwindcss`, `radix-ui`, `shadcn/ui`     |
| **Priority**          | P1                                         |

**Scope:** Three-layer tokens (primitive → semantic → component). CSS variables. Spacing/typography scales. Component specs. Theme support (light/dark). Brand colors.

**Existing:** `design-system/`, `apps/design-system/`, `.opencode/skills/design-system/`, `.opencode/skills/ui-styling/`.

---

### 4.5 AI Provider Abstraction

| Field                 | Value                                    |
| --------------------- | ---------------------------------------- |
| **Parent capability** | AI model access                          |
| **Dependencies**      | 1.3 Configuration                        |
| **Implementation**    | Build                                    |
| **Reference**         | `ai` (Vercel SDK), `langchain` (routing) |
| **Priority**          | P0                                       |

**Scope:** Unified interface for LLM providers. OpenAI, Anthropic, local models (Ollama). Streaming. Token counting. Cost tracking. Fallback chains. Offline mode (no AI calls).

**Existing:** `bhavya-ai-lab/providers/`.

---

### 4.6 Image Generation

| Field                 | Value                                                |
| --------------------- | ---------------------------------------------------- |
| **Parent capability** | Visual content creation                              |
| **Dependencies**      | 4.5 AI Provider                                      |
| **Implementation**    | Adopt                                                |
| **Reference**         | `sharp` (transforms), `@aspect-build/rules_js` (SVG) |
| **Priority**          | P2                                                   |

**Scope:** Diagram generation from data. Chart rendering (Chart.js). SVG icon system. Image optimization. Thumbnail generation.

**Existing:** `packages/icons/`, `packages/charts/`.

---

## Layer 5 — Governance Skills

Policies, institutional memory, provenance, compliance.

### 5.1 Policy Engine

| Field                 | Value                               |
| --------------------- | ----------------------------------- |
| **Parent capability** | Governance (policies)               |
| **Dependencies**      | 1.2 Data Layer, 1.5 Schema Registry |
| **Implementation**    | Build                               |
| **Reference**         | —                                   |
| **Priority**          | P0                                  |

**Scope:** Store and version governance documents (Constitution, Trust Deed, policies). Policy status tracking (active, superseded, draft). Conflict detection between policies. Amendment workflow.

**Existing:** `governance/`, `bhavya-ai-lab/institution/governance/`, `01_The_Constitution.md` through `15_Brand_Constitution.md`.

---

### 5.2 Institutional Memory

| Field                 | Value                                                |
| --------------------- | ---------------------------------------------------- |
| **Parent capability** | Institutional memory (decisions, rationale, history) |
| **Dependencies**      | 5.1 Policy Engine, 1.2 Data Layer                    |
| **Implementation**    | Build                                                |
| **Reference**         | —                                                    |
| **Priority**          | P1                                                   |

**Scope:** Decision records with rationale. ADR (Architecture Decision Records) lifecycle. Timeline of institutional events. Searchable memory index. "Why did we do this?" answers.

**Existing:** `bhavya-ai-lab/institution/decisions/`, `bhavya-ai-lab/institution/adr/`, `bhavya-ai-lab/institution/history/`.

---

### 5.3 Provenance Tracker

| Field                 | Value                                     |
| --------------------- | ----------------------------------------- |
| **Parent capability** | Provenance (tracking what generated what) |
| **Dependencies**      | 1.2 Data Layer, 1.6 Event Bus             |
| **Implementation**    | Build                                     |
| **Reference**         | —                                         |
| **Priority**          | P1                                        |

**Scope:** Immutable provenance chain: input → builder → output → publication. Artifact lineage. "What generated this lesson?" answers. Exportable provenance reports.

**Existing:** `bhavya-ai-lab/institution/provenance/`.

---

### 5.4 Compliance Checker

| Field                 | Value                                  |
| --------------------- | -------------------------------------- |
| **Parent capability** | Governance (compliance)                |
| **Dependencies**      | 5.1 Policy Engine, 1.5 Schema Registry |
| **Implementation**    | Build                                  |
| **Reference**         | —                                      |
| **Priority**          | P2                                     |

**Scope:** Validate artifacts against governance policies. Content age-appropriateness. Brand compliance. AI ethics compliance (policy 13). Automated audit trails.

---

### 5.5 Release Registry

| Field                 | Value                     |
| --------------------- | ------------------------- |
| **Parent capability** | Governance (versioning)   |
| **Dependencies**      | 5.3 Provenance Tracker    |
| **Implementation**    | Build                     |
| **Reference**         | `changesets` (versioning) |
| **Priority**          | P1                        |

**Scope:** Version tagging. Changelog generation. Release notes. Snapshot archiving. Rollback capability.

**Existing:** `bhavya-ai-lab/institution/releases/`, `bhavya-ai-lab/release/`, `.changeset/`.

---

## Layer 6 — Research Skills

Literature review, citations, findings synthesis.

### 6.1 Literature Review Engine

| Field                 | Value                                               |
| --------------------- | --------------------------------------------------- |
| **Parent capability** | Research (literature review)                        |
| **Dependencies**      | 2.6 Citation Manager, 4.5 AI Provider               |
| **Implementation**    | Build                                               |
| **Reference**         | `semantic-scholar-api`, `openalex` (open citations) |
| **Priority**          | P1                                                  |

**Scope:** Topic-based literature search. Source collection from PDFs, URLs, databases. Relevance scoring. Deduplication. Research brief generation.

**Existing:** `bhavya-ai-lab/research/` (01_topic_brief, 02_source_collection, 03_synthesis).

---

### 6.2 Findings Synthesizer

| Field                 | Value                                           |
| --------------------- | ----------------------------------------------- |
| **Parent capability** | Research (findings)                             |
| **Dependencies**      | 6.1 Literature Review, 2.5 Knowledge Enrichment |
| **Implementation**    | Build                                           |
| **Reference**         | —                                               |
| **Priority**          | P2                                              |

**Scope:** Synthesize research findings into structured summaries. Evidence grading. Cross-reference with existing KOs. Gap analysis. Research-to-KO pipeline.

**Existing:** `bhavya-ai-lab/research/03_synthesis/`.

---

## Layer 7 — Engineering Skills

Pipeline orchestration, deployment, monitoring, agent coordination.

### 7.1 Pipeline Orchestrator

| Field                 | Value                                       |
| --------------------- | ------------------------------------------- |
| **Parent capability** | Agent orchestration (multi-agent pipelines) |
| **Dependencies**      | 1.6 Event Bus, 1.5 Schema Registry          |
| **Implementation**    | Build                                       |
| **Reference**         | —                                           |
| **Priority**          | P0                                          |

**Scope:** 9-step capability resolution pipeline. Builder loading. Quality gate execution. Parallel stage execution. Error recovery. Pipeline state machine.

**Existing:** `bhavya-ai-lab/orchestrator/`, `packages/runtime/engine/capability-engine.mjs`, `packages/runtime/engine/knowledge-pipeline.mjs`.

---

### 7.2 Quality Gates

| Field                 | Value               |
| --------------------- | ------------------- |
| **Parent capability** | Quality assurance   |
| **Dependencies**      | 1.5 Schema Registry |
| **Implementation**    | Build               |
| **Reference**         | —                   |
| **Priority**          | P0                  |

**Scope:** 10 gates, 30+ checks. Input validation, output validation, content quality, accessibility, brand compliance. Gate pass/fail with detailed reports.

**Existing:** `bhavya-ai-lab/quality-gates/`.

---

### 7.3 Agent Runtime

| Field                 | Value                                      |
| --------------------- | ------------------------------------------ |
| **Parent capability** | Agent orchestration                        |
| **Dependencies**      | 4.5 AI Provider, 7.1 Pipeline Orchestrator |
| **Implementation**    | Build                                      |
| **Reference**         | —                                          |
| **Priority**          | P1                                         |

**Scope:** Multi-agent execution. Agent capability declarations. Skill loading. Agent-to-agent communication. Context management. Token budgeting.

**Existing:** `bhavya-ai-lab/agents/`, `packages/agent-engine/`, `packages/agent-platform/`.

---

### 7.4 Deployment Engine

| Field                 | Value                                            |
| --------------------- | ------------------------------------------------ |
| **Parent capability** | Website publishing (HTML pages, navigation, CSS) |
| **Dependencies**      | 4.4 Design System, 1.1 File I/O                  |
| **Implementation**    | Adapt                                            |
| **Reference**         | `next.js` (static export), `vercel` (deployment) |
| **Priority**          | P1                                               |

**Scope:** Static site generation. HTML/CSS output. Navigation structure. Offline package creation. Vercel deployment. Preview URLs.

**Existing:** `bhavya-ai-lab/builders/website/`, `apps/website/`, `apps/docs/`.

---

### 7.5 CI/CD Pipeline

| Field                 | Value                                                           |
| --------------------- | --------------------------------------------------------------- |
| **Parent capability** | Release engineering (versioning, deployment, changelogs)        |
| **Dependencies**      | 7.4 Deployment Engine, 5.5 Release Registry                     |
| **Implementation**    | Adopt                                                           |
| **Reference**         | `turbo` (monorepo), `changesets` (versioning), `github-actions` |
| **Priority**          | P1                                                              |

**Scope:** Lint → test → validate → build → deploy. Automated versioning. Changelog generation. PR-based releases. Preview deployments.

**Existing:** `turbo.json`, `.changeset/`, `.github/`, `pnpm-workspace.yaml`.

---

### 7.6 Monitoring & Alerting

| Field                 | Value                                  |
| --------------------- | -------------------------------------- |
| **Parent capability** | System health                          |
| **Dependencies**      | 1.7 Logging & Observability            |
| **Implementation**    | Adapt                                  |
| **Reference**         | `prometheus-client`, `sentry` (errors) |
| **Priority**          | P2                                     |

**Scope:** Uptime monitoring. Error rate tracking. Performance metrics. Alert thresholds. Dashboard export.

**Existing:** `bhavya-ai-lab/observability/`, `packages/runtime/engine/capability-engine.mjs` metrics.

---

## Layer 8 — Operations Skills

Analytics, search, workflow, release management.

### 8.1 Analytics Engine

| Field                 | Value                                                |
| --------------------- | ---------------------------------------------------- |
| **Parent capability** | Analytics (assessment scores, content usage, impact) |
| **Dependencies**      | 1.2 Data Layer, 1.4 Search Index                     |
| **Implementation**    | Build                                                |
| **Reference**         | —                                                    |
| **Priority**          | P1                                                   |

**Scope:** Assessment score aggregation. Content usage tracking. Impact metrics (students reached, lessons generated). Time-series data. Exportable reports. Read-only invariant.

**Existing:** `bhavya-ai-lab/dashboard/`, `apps/dashboard/`, `packages/charts/`.

---

### 8.2 Semantic Search

| Field                 | Value                                           |
| --------------------- | ----------------------------------------------- |
| **Parent capability** | Search (semantic, keyword, graph-based)         |
| **Dependencies**      | 1.4 Search Index, 2.2 Knowledge Graph           |
| **Implementation**    | Adapt                                           |
| **Reference**         | `voyager` (vector index), `ollama` (embeddings) |
| **Priority**          | P2                                              |

**Scope:** Vector embeddings for semantic search. Graph-based "related content" queries. Hybrid keyword + semantic ranking. Offline fallback to keyword-only.

---

### 8.3 Workflow Engine

| Field                 | Value                                    |
| --------------------- | ---------------------------------------- |
| **Parent capability** | Workflow automation                      |
| **Dependencies**      | 1.6 Event Bus, 7.1 Pipeline Orchestrator |
| **Implementation**    | Build                                    |
| **Reference**         | —                                        |
| **Priority**          | P2                                       |

**Scope:** Define multi-step workflows. Conditional branching. Retry logic. Workflow templates for common patterns (KO → lesson → assessment → publish).

**Existing:** `packages/workflow-engine/`.

---

### 8.4 Content Marketplace

| Field                 | Value                                     |
| --------------------- | ----------------------------------------- |
| **Parent capability** | Content marketplace (sharing, federation) |
| **Dependencies**      | 5.3 Provenance Tracker, 2.1 KO CRUD       |
| **Implementation**    | Build                                     |
| **Reference**         | —                                         |
| **Priority**          | P2                                        |

**Scope:** Export KOs and lessons for sharing. Import from external sources. Federation protocol. Attribution tracking. License management.

---

## Layer 9 — Mission Skills

Domain-specific mission applications.

### 9.1 Forest Mission

| Field                 | Value                                                   |
| --------------------- | ------------------------------------------------------- |
| **Parent capability** | Forest missions (site tracking, planting, telemetry)    |
| **Dependencies**      | 1.2 Data Layer, 4.4 Design System, 8.1 Analytics Engine |
| **Implementation**    | Build                                                   |
| **Reference**         | —                                                       |
| **Priority**          | P1                                                      |

**Scope:** Planting site management. Species tracking. Growth telemetry. Geospatial mapping. Impact reporting. Volunteer coordination for planting events.

**Existing:** `apps/forest/`.

---

### 9.2 Heritage Mission

| Field                 | Value                                                         |
| --------------------- | ------------------------------------------------------------- |
| **Parent capability** | Heritage preservation (documents, prescriptions, research)    |
| **Dependencies**      | 3.7 Document Intelligence, 2.1 KO CRUD, 6.1 Literature Review |
| **Implementation**    | Build                                                         |
| **Reference**         | —                                                             |
| **Priority**          | P1                                                            |

**Scope:** Historical document digitization. Prescription analysis. Heritage research pipeline. Preservation metadata. Community access portal.

**Existing:** `apps/heritage/`.

---

### 9.3 Library Mission

| Field                 | Value                                                     |
| --------------------- | --------------------------------------------------------- |
| **Parent capability** | Library management (catalog, circulation, digital assets) |
| **Dependencies**      | 1.4 Search Index, 2.1 KO CRUD, 1.2 Data Layer             |
| **Implementation**    | Build                                                     |
| **Reference**         | —                                                         |
| **Priority**          | P1                                                        |

**Scope:** Digital catalog. Circulation tracking. Digital asset management. OPAC (Online Public Access Catalog). Inter-library loan tracking.

**Existing:** `apps/library/`.

---

### 9.4 Volunteer Mission

| Field                 | Value                                              |
| --------------------- | -------------------------------------------------- |
| **Parent capability** | Volunteer coordination (onboarding, tasks, impact) |
| **Dependencies**      | 1.2 Data Layer, 8.1 Analytics Engine               |
| **Implementation**    | Build                                              |
| **Reference**         | —                                                  |
| **Priority**          | P2                                                 |

**Scope:** Volunteer profiles. Onboarding workflows. Task assignment. Impact tracking. Hours logging. Recognition system.

**Existing:** `apps/volunteer/`.

---

### 9.5 Research Mission

| Field                 | Value                                                        |
| --------------------- | ------------------------------------------------------------ |
| **Parent capability** | Research project management                                  |
| **Dependencies**      | 6.1 Literature Review, 6.2 Findings Synthesizer, 2.1 KO CRUD |
| **Implementation**    | Build                                                        |
| **Reference**         | —                                                            |
| **Priority**          | P2                                                           |

**Scope:** Research project tracking. Topic briefs. Source collections. Synthesis workflows. Research-to-KO pipeline.

**Existing:** `apps/research/`, `bhavya-ai-lab/research/`.

---

## Dependency Matrix

```
                    L1  L2  L3  L4  L5  L6  L7  L8  L9
Foundation Skills   ●
Knowledge Skills    ●   ●
Education Skills    ●   ●   ●
Media Skills        ●   ●   ●   ●
Governance Skills   ●   ●       ●   ●
Research Skills     ●   ●   ●       ●   ●
Engineering Skills  ●           ●       ●   ●
Operations Skills   ●   ●               ●   ●   ●
Mission Skills      ●   ●   ●   ●   ●       ●   ●   ●
```

## Implementation Priority Summary

| Priority | Count | Skills                                                                                                                                                                                                                                                                                                          |
| -------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **P0**   | 12    | File I/O, Data Layer, Config, Search Index, Schema Registry, KO CRUD, Curriculum Engine, Lesson Builder, Assessment Builder, AI Provider, Policy Engine, Pipeline Orchestrator, Quality Gates                                                                                                                   |
| **P1**   | 16    | Event Bus, Logging, Knowledge Graph, Taxonomy, Knowledge Enrichment, Citation Manager, Teacher Guide, Workbook, Document Intelligence, Video Production, Visual Spec, Design System, Institutional Memory, Provenance, Release Registry, Agent Runtime, Deployment, CI/CD, Analytics, Forest, Heritage, Library |
| **P2**   | 10    | Audio Processing, Image Generation, Slide Builder, Compliance, Findings Synthesizer, Monitoring, Semantic Search, Workflow, Content Marketplace, Volunteer, Research Mission                                                                                                                                    |

## Existing Coverage

| Layer          | Already Built                                                               | Gap                                                |
| -------------- | --------------------------------------------------------------------------- | -------------------------------------------------- |
| L1 Foundation  | File I/O, Data Layer (content-core), Config, Search (stub), Schema Registry | Event Bus, Logging hardening                       |
| L2 Knowledge   | KO CRUD, Knowledge Graph, Taxonomy, Citations                               | Enrichment pipeline, Ingestion pipeline            |
| L3 Education   | Lesson Builder, Assessment Builder, Teacher Guide, Workbook, Slides, PDF    | Curriculum Engine (partial), Document Intelligence |
| L4 Media       | Video Production, Visual Spec, Design System, AI Providers                  | Audio, Image Generation                            |
| L5 Governance  | Policy Engine, Institutional Memory, Provenance, Releases                   | Compliance Checker                                 |
| L6 Research    | Literature Review (partial), Synthesis (partial)                            | Findings Synthesizer                               |
| L7 Engineering | Pipeline Orchestrator, Quality Gates, Agent Runtime, Deployment, CI/CD      | Monitoring                                         |
| L8 Operations  | Analytics (partial), Dashboard                                              | Semantic Search, Workflow, Marketplace             |
| L9 Mission     | Forest, Heritage, Library, Volunteer, Research                              | Mission-specific depth                             |

## Extension Protocol

To add a new skill:

1. **Declare** capability in `skills-lock.json` or `_config/skills/`
2. **Specify** dependencies (must be from lower layers only)
3. **Choose** implementation: adopt / adapt / build
4. **Register** schemas in Schema Registry (1.5)
5. **Wire** to Event Bus (1.6) for inter-skill communication
6. **Validate** against Quality Gates (7.2)
7. **Document** in this file with version bump

## Version History

| Version | Date       | Change                                                 |
| ------- | ---------- | ------------------------------------------------------ |
| 1.0.0   | 2026-08-02 | Initial skill architecture — 38 skills across 9 layers |
