# ADR-004: Bhavya OS Skill Architecture

**Status:** Proposed  
**Date:** 2026-08-02  
**Deciders:** Bhavya Foundation  
**Technical Stack:** Next.js 15, Node.js, pnpm monorepo, Vercel

---

## 1. Context

Bhavya OS is an autonomous institutional operating system for the Bhavya Foundation. It manages knowledge objects, curriculum, lessons, assessments, teacher guides, workbooks, videos, websites, forest missions, heritage preservation, volunteer coordination, governance, and research.

The current state is a collection of 43 skills scattered across `.agents/skills/`, `.opencode/skills/`, and `C:\Users\BBNC\.config\opencode\skills\`. These skills were added ad-hoc as capabilities were needed. There is no coherent architecture governing how skills relate to each other, which institutional function they serve, or how new skills should be designed.

**This ADR designs the capability architecture for Bhavya OS so that every future skill, agent, MCP server, workflow, and automation fits into a coherent institutional operating system.**

---

## 2. Decision

### 2.1 Current Skills Audit

#### Summary

| Category  | Count  | %        | Action                                            |
| --------- | ------ | -------- | ------------------------------------------------- |
| Core      | 33     | 77%      | Keep — directly powers institutional capabilities |
| Useful    | 7      | 16%      | Integrate when needed                             |
| Redundant | 3      | 7%       | Merge into broader skills                         |
| Archive   | 0      | 0%       | —                                                 |
| **Total** | **43** | **100%** |                                                   |

#### Core Skills (33)

| Skill                              | Institutional Capability   | Justification                                                     |
| ---------------------------------- | -------------------------- | ----------------------------------------------------------------- |
| `hyperframes`                      | Video composition routing  | Entry point for ALL video requests — routes to specialized skills |
| `hyperframes-core`                 | Composition contract       | Technical foundation for building renderable projects             |
| `hyperframes-animation`            | Animation rules/blueprints | Atomic motion rules, 7 runtime adapters (GSAP, Lottie, Three.js)  |
| `hyperframes-cli`                  | CLI development loop       | init, lint, render, cloud — essential dev workflow                |
| `hyperframes-creative`             | Creative direction         | Palettes, typography, narration, beat planning                    |
| `hyperframes-keyframes`            | Seek-safe keyframes        | 2D/3D keyframes, GSAP timelines, SVG morph, masks                 |
| `hyperframes-registry`             | Reusable components        | Install and wire registry items into compositions                 |
| `motion-doctrine`                  | Motion law                 | Gateway skill — makes multi-scene videos feel continuous          |
| `media-use`                        | Media OS                   | Resolve BGM, SFX, images, TTS, voiceover, captions, bg removal    |
| `cut-the-curve`                    | Transition catalog         | 5 seams, waterfall entry, nudge curve — foundational transitions  |
| `seam-craft`                       | Render-correctness         | Scene-to-scene seam compositing mechanics                         |
| `general-video`                    | Custom compositions        | Catch-all for multi-scene pieces, montages, brand reels           |
| `captions-overlay`                 | Caption doctrine           | Drop/rail/embed model — critical for video output                 |
| `design`                           | Design hub                 | Routes to sub-skills — logo, CIP, mockups, banners, icons         |
| `design-system`                    | Token architecture         | Three-layer tokens, CSS variables, component specs                |
| `ui-styling`                       | UI styling                 | shadcn/ui + Tailwind + dark mode + accessible components          |
| `ui-ux-pro-max`                    | UI/UX intelligence         | Searchable design database — routing hub for UI decisions         |
| `brand`                            | Brand identity             | Voice, visual identity, messaging, style guides, compliance       |
| `gsap-core`                        | GSAP API                   | gsap.to/from/fromTo, easing, stagger, matchMedia                  |
| `gsap-frameworks`                  | Vue/Svelte GSAP            | Lifecycle, scoping, cleanup in non-React frameworks               |
| `gsap-performance`                 | GSAP perf                  | Transforms, will-change, batching, avoid layout thrashing         |
| `gsap-plugins`                     | GSAP plugins               | ScrollTrigger, Flip, Draggable, Inertia, SplitText                |
| `gsap-react`                       | React GSAP                 | useGSAP hook, refs, gsap.context()                                |
| `gsap-scrolltrigger`               | ScrollTrigger              | Scroll-linked animations, pinning, scrub, triggers                |
| `gsap-timeline`                    | Timelines                  | Sequencing, position parameter, nesting, playback                 |
| `gsap-utils`                       | GSAP utils                 | clamp, mapRange, normalize, interpolate, random, snap             |
| `supabase`                         | Supabase platform          | Auth, DB, Edge Functions, Realtime, Storage, Vectors, RLS         |
| `supabase-postgres-best-practices` | Postgres optimization      | Query performance, schema design, extensions                      |
| `customize-opencode`               | Config management          | Editing opencode.json, agents, skills, plugins, permissions       |
| `slideshow`                        | Interactive decks          | Presentations with hotspot navigation, speaker mode               |
| `slides`                           | HTML presentations         | Chart.js slides, design tokens, responsive                        |
| `talking-head-recut`               | Graphic overlays           | Overlay cards on existing video footage                           |
| `figma`                            | Figma import               | Figma → HyperFrames composition                                   |

#### Useful Skills (7)

| Skill                  | Capability            | Integration Point                                           |
| ---------------------- | --------------------- | ----------------------------------------------------------- |
| `oversized-cursor`     | Cursor technique      | Launch videos — on-demand                                   |
| `faceless-explainer`   | Topic explainers      | Text-to-explainer — routes through general-video            |
| `motion-graphics`      | Short motion graphics | Under 10s kinetic typography — routes through general-video |
| `music-to-video`       | Beat-synced video     | Music-driven pacing — routes through general-video          |
| `product-launch-video` | Product promos        | SaaS promos — routes through general-video                  |
| `talking-head-recut`   | Graphic overlays      | Overlay cards on footage — on-demand                        |
| `banner-design`        | Banner design         | Multi-format social/ads/web — routes through design         |

#### Redundant Skills (3) — Merge Targets

| Skill                     | Merge Into         | Reason                                               |
| ------------------------- | ------------------ | ---------------------------------------------------- |
| `pr-to-video`             | `general-video`    | Very narrow — just a PR-to-diff workflow             |
| `changelog-video`         | `general-video`    | Very narrow — just a changelog-to-video workflow     |
| `embedded-captions`       | `captions-overlay` | Duplicate caption doctrine                           |
| `remotion-to-hyperframes` | —                  | One-way migration, rarely needed — archive candidate |

---

### 2.2 GitHub Research: Best Open-Source Implementations

#### MCP Servers

| Repository                                                              | Stars  | Use Case for Bhavya OS                                        |
| ----------------------------------------------------------------------- | ------ | ------------------------------------------------------------- |
| [mcp-chrome](https://github.com/hangwin/mcp-chrome)                     | 12,245 | Browser-based knowledge extraction, automated lesson research |
| [mcp-playwright](https://github.com/executeautomation/mcp-playwright)   | 5,624  | Automated web research, content scraping for lesson creation  |
| [awesome-mcp-servers](https://github.com/appcypher/awesome-mcp-servers) | 5,734  | Reference for integrating new capabilities                    |

#### Agent Orchestration

| Repository                                                    | Stars  | Use Case                                                 |
| ------------------------------------------------------------- | ------ | -------------------------------------------------------- |
| [deepset-ai/haystack](https://github.com/deepset-ai/haystack) | 26,091 | LLM pipeline framework with RAG, agents, semantic search |
| [omnigent](https://github.com/omnigent-ai/omnigent)           | 8,031  | Multi-agent orchestration with policies and sandboxing   |
| [holaOS](https://github.com/holaboss-ai/holaOS)               | 5,469  | Agent workspace architecture reference                   |
| [AionUi](https://github.com/iOfficeAI/AionUi)                 | 31,270 | Multi-agent workspace for content creation               |

#### Knowledge Graphs

| Repository                                                        | Stars | Use Case                                              |
| ----------------------------------------------------------------- | ----- | ----------------------------------------------------- |
| [hashintel/hash](https://github.com/hashintel/hash)               | 1,631 | Self-building knowledge graphs for curriculum mapping |
| [litegraphdb/litegraph](https://github.com/litegraphdb/litegraph) | 127   | Lightweight graph database with MCP support           |
| [swarmvault](https://github.com/swarmclawai/swarmvault)           | 635   | Local-first LLM Wiki with knowledge graph builder     |

#### Vector Stores

| Repository                                                  | Stars  | License    | Use Case                              |
| ----------------------------------------------------------- | ------ | ---------- | ------------------------------------- |
| [chroma-core/chroma](https://github.com/chroma-core/chroma) | ~16k   | Apache-2.0 | Vector store for knowledge embeddings |
| [qdrant/qdrant](https://github.com/qdrant/qdrant)           | ~22k   | Apache-2.0 | High-performance similarity search    |
| [weaviate/weaviate](https://github.com/weaviate/weaviate)   | 16,681 | BSD-3      | Hybrid search for knowledge objects   |

#### Document Processing

| Repository                                                                                      | Stars | Use Case                                           |
| ----------------------------------------------------------------------------------------------- | ----- | -------------------------------------------------- |
| [hwdsl2/docker-docling](https://github.com/hwdsl2/docker-docling)                               | 10    | IBM Docling — PDF/DOCX/PPTX/HTML → Markdown/JSON   |
| [opensemanticsearch/open-semantic-etl](https://github.com/opensemanticsearch/open-semantic-etl) | 282   | ETL for document crawling, OCR, entity recognition |

#### Workflow Engines

| Repository                                                    | Stars  | License    | Use Case                             |
| ------------------------------------------------------------- | ------ | ---------- | ------------------------------------ |
| [apache/airflow](https://github.com/apache/airflow)           | 46,354 | Apache-2.0 | DAG-based pipeline orchestration     |
| [n8n](https://github.com/enescingoz/awesome-n8n-templates)    | 24,361 | —          | Visual workflow automation           |
| [bytechefhq/bytechef](https://github.com/bytechefhq/bytechef) | 938    | —          | Embedded iPaaS for content pipelines |

#### Memory Architectures

| Repository                                              | Stars | Use Case                                            |
| ------------------------------------------------------- | ----- | --------------------------------------------------- |
| [MemHop](https://github.com/qyiun666/MemHop)            | 16    | 6-layer cognitive architecture with knowledge graph |
| [swarmvault](https://github.com/swarmclawai/swarmvault) | 635   | Durable agent memory for knowledge management       |

#### Educational Platforms

| Repository                                                                     | Stars  | Use Case                                        |
| ------------------------------------------------------------------------------ | ------ | ----------------------------------------------- |
| [AI-Research-SKILLs](https://github.com/Orchestra-Research/AI-Research-SKILLs) | 11,325 | AI research skills for Claude Code/Codex/Gemini |
| [awesome-llm-skills](https://github.com/Prat011/awesome-llm-skills)            | 1,430  | Reference for skill development patterns        |

---

### 2.3 Competitive Analysis

#### Competitors Analyzed

| Category             | Platforms                           | Key Insight                                |
| -------------------- | ----------------------------------- | ------------------------------------------ |
| Open Ed-Tech         | Open edX, Moodle, Canvas, Chamilo   | Scale but dated UX; no K-12 focus          |
| Knowledge Management | Notion, Obsidian, Logseq, Wiki.js   | Flexibility but no education workflows     |
| Digital Libraries    | Open Library, Koha, DSpace          | Catalog focus, no content generation       |
| AI Research          | Elicit, Semantic Scholar, Consensus | Paper search, no curriculum generation     |
| Institutional OS     | CampusOS, ibl.ai, UniversitasAI     | ERP bolt-ons, not true operating systems   |
| Knowledge Graphs     | Neo4j, ArangoDB, TigerGraph         | Storage only, no educational applications  |
| Content Generation   | Jupyter Book, Quarto                | Reproducible research, no video/assessment |

#### Top 5 Differentiators for Bhavya OS

1. **Unified Institutional Intelligence Layer** — No competitor combines knowledge management + education + research + community impact in one system
2. **Knowledge Graph-Native Architecture** — First educational platform where graphs are the primary data model, not an add-on
3. **Open Standards + Open Source + Community Governance** — No vendor lock-in, community-driven development
4. **Impact Measurement as Core Feature** — First-class community/educational outcome tracking (forest, heritage, volunteer)
5. **AI-Augmented, Not AI-Dependent** — Privacy-first AI with human-in-the-loop, filesystem-based data layer

#### Market Gaps Identified

- No platform bridges **research and education** (research tools ≠ learning platforms)
- **Impact measurement** is an afterthought everywhere
- **Knowledge Commons** (federated, reusable educational resources) doesn't exist
- **Privacy-first AI for education** is missing
- The "Institutional OS" category doesn't exist — only ERPs with AI features

---

### 2.4 Bhavya OS Skill Architecture

#### Hierarchy: 9 Layers, 38 Skills

```
L9 Mission Skills    ── Forest, Heritage, Library, Volunteer, Projects
L8 Operations Skills ── Analytics, Search, Workflow, Release
L7 Engineering Skills ── Pipeline, Orchestration, Deployment, Monitoring, Agents, Config
L6 Research Skills   ── Literature Review, Citations
L5 Governance Skills ── Policies, Memory, Provenance, Compliance, Trust
L4 Media Skills      ── Video, Audio, Images, Design, Captions, Compositions
L3 Education Skills  ── Curriculum, Lessons, Assessments, Teacher, Student, Workbook, Standards
L2 Knowledge Skills  ── KO CRUD, Ingestion, Graph, Search, Federation
L1 Foundation Skills ── File I/O, Data Layer, Config, Event Bus, Search, Logging, Auth
```

#### Complete Skill Map

##### L1: Foundation Skills

| Skill        | Purpose                                  | Dependencies | Implementation               | Priority |
| ------------ | ---------------------------------------- | ------------ | ---------------------------- | -------- |
| `file-io`    | Read/write JSON, MDX, BBL files          | —            | Build (custom)               | P0       |
| `data-layer` | Async data functions for all domains     | file-io      | Build (exists: `data.ts`)    | P0       |
| `config`     | ROOT resolution, env vars, feature flags | —            | Build (exists: `config.mjs`) | P0       |
| `event-bus`  | Inter-component communication            | —            | Adopt: custom EventEmitter   | P0       |
| `search`     | Keyword + semantic search                | data-layer   | Adopt: minisearch + vector   | P0       |
| `logging`    | Structured logging, metrics              | —            | Adopt: pino                  | P1       |
| `auth`       | JWT, sessions, RBAC                      | —            | Adopt: Supabase Auth         | P1       |

##### L2: Knowledge Skills

| Skill                  | Purpose                                     | Dependencies     | Implementation          | Priority |
| ---------------------- | ------------------------------------------- | ---------------- | ----------------------- | -------- |
| `ko-crud`              | Create/read/update/delete Knowledge Objects | data-layer       | Build (exists)          | P0       |
| `ko-generation`        | Generate KOs from source material           | ko-crud, llm     | Build                   | P1       |
| `knowledge-ingestion`  | PDF/DOCX/web → KO pipeline                  | file-io, ko-crud | Adopt: docling + custom | P1       |
| `knowledge-graph`      | Graph-based relationships between KOs       | ko-crud          | Adopt: graphology       | P1       |
| `knowledge-search`     | Semantic search across KOs                  | ko-crud, search  | Adopt: minisearch       | P1       |
| `knowledge-federation` | Share KOs across instances                  | ko-crud          | Build                   | P2       |

##### L3: Education Skills

| Skill               | Purpose                                         | Dependencies      | Implementation | Priority |
| ------------------- | ----------------------------------------------- | ----------------- | -------------- | -------- |
| `curriculum-engine` | Grade-level progression, standards alignment    | ko-crud           | Build          | P0       |
| `lesson-builder`    | KO → 6-section lesson with outcomes             | ko-crud           | Build (exists) | P0       |
| `assessment-gen`    | Lesson → 15 questions (MCQ, short-answer, etc.) | lesson-builder    | Build (exists) | P0       |
| `teacher-guide`     | Lesson → objectives, materials, timing          | lesson-builder    | Build (exists) | P1       |
| `workbook-gen`      | Lesson → 8-page workbook                        | lesson-builder    | Build (exists) | P1       |
| `standards-map`     | Map content to educational standards            | curriculum-engine | Build          | P2       |
| `student-tracker`   | Progress, grades, analytics                     | assessment-gen    | Build          | P2       |

##### L4: Media Skills

| Skill                | Purpose                        | Dependencies           | Implementation  | Priority |
| -------------------- | ------------------------------ | ---------------------- | --------------- | -------- |
| `video-pipeline`     | Visual-spec → video rendering  | hyperframes, media-use | Build (exists)  | P0       |
| `audio-engine`       | TTS, voiceover, music, SFX     | media-use              | Adopt: existing | P1       |
| `image-engine`       | Image generation, icons, logos | design                 | Adopt: existing | P1       |
| `design-system`      | Tokens, components, themes     | —                      | Build (exists)  | P1       |
| `caption-engine`     | Subtitles, captions, overlays  | captions-overlay       | Build (exists)  | P1       |
| `composition-engine` | HTML → video rendering         | hyperframes-core       | Build (exists)  | P1       |

##### L5: Governance Skills

| Skill                  | Purpose                         | Dependencies   | Implementation | Priority |
| ---------------------- | ------------------------------- | -------------- | -------------- | -------- |
| `policy-manager`       | Create/ratify/enforce policies  | data-layer     | Build          | P0       |
| `institutional-memory` | ADR records, decision rationale | data-layer     | Build (exists) | P1       |
| `provenance`           | Track what generated what       | data-layer     | Build (exists) | P1       |
| `compliance-checker`   | Validate against quality gates  | data-layer     | Build (exists) | P1       |
| `trust-deed`           | Founding document management    | policy-manager | Build          | P2       |

##### L6: Research Skills

| Skill               | Purpose                      | Dependencies       | Implementation           | Priority |
| ------------------- | ---------------------------- | ------------------ | ------------------------ | -------- |
| `literature-review` | Systematic review, citations | search, data-layer | Adopt: haystack + custom | P1       |
| `citation-manager`  | References, bibliography     | data-layer         | Build                    | P2       |

##### L7: Engineering Skills

| Skill                   | Purpose                       | Dependencies            | Implementation           | Priority |
| ----------------------- | ----------------------------- | ----------------------- | ------------------------ | -------- |
| `pipeline-orchestrator` | 8-stage content pipeline      | event-bus, all builders | Build (exists)           | P0       |
| `agent-orchestrator`    | Multi-agent coordination      | event-bus               | Adopt: omnigent patterns | P0       |
| `deployment`            | Vercel deploy, CI/CD          | config                  | Build (exists)           | P1       |
| `monitoring`            | Health checks, metrics        | logging                 | Build (exists)           | P1       |
| `builder-registry`      | Register/discover builders    | config                  | Build (exists)           | P1       |
| `config-manager`        | opencode.json, agents, skills | config                  | Build (exists)           | P1       |

##### L8: Operations Skills

| Skill                 | Purpose                            | Dependencies     | Implementation      | Priority |
| --------------------- | ---------------------------------- | ---------------- | ------------------- | -------- |
| `analytics`           | Usage, performance, impact metrics | data-layer       | Build               | P1       |
| `global-search`       | Cross-domain search                | search, all data | Adopt: minisearch   | P1       |
| `workflow-engine`     | Task routing, approval chains      | event-bus        | Adopt: n8n patterns | P2       |
| `release-engineering` | Versioning, changelogs, tags       | git              | Build               | P2       |

##### L9: Mission Skills

| Skill             | Purpose                              | Dependencies | Implementation | Priority |
| ----------------- | ------------------------------------ | ------------ | -------------- | -------- |
| `forest-missions` | Site tracking, planting, telemetry   | data-layer   | Build (exists) | P1       |
| `heritage-docs`   | Documents, prescriptions, research   | data-layer   | Build (exists) | P1       |
| `library-mgmt`    | Catalog, circulation, digital assets | data-layer   | Build          | P2       |
| `volunteer-coord` | Onboarding, tasks, impact            | data-layer   | Build (exists) | P2       |
| `project-tracker` | Sectors, budgets, impact             | data-layer   | Build (exists) | P2       |

---

### 2.5 Implementation Strategy

#### Adopt (Use Open-Source)

| Capability             | Repository                                                 | License         | Stars | Rationale                              |
| ---------------------- | ---------------------------------------------------------- | --------------- | ----- | -------------------------------------- |
| Search engine          | [minisearch](https://github.com/nicolo-ribaudo/minisearch) | MIT             | 2.5k  | Lightweight, zero-dep, client+server   |
| Structured logging     | [pino](https://github.com/pinojs/pino)                     | MIT             | 13k   | Fastest Node.js logger                 |
| Knowledge graph        | [graphology](https://github.com/graphology/graphology)     | MIT             | 2.8k  | Graph management, community detection  |
| PDF extraction         | [pdf-parse](https://github.com/nicolo-ribaudo/pdf-parse)   | MIT             | 1.5k  | Text extraction from PDFs              |
| Vector embeddings      | [chroma](https://github.com/chroma-core/chroma)            | Apache-2.0      | 16k   | AI-native embedding database           |
| Pipeline orchestration | [n8n](https://github.com/n8n-io/n8n)                       | Sustainable Use | 24k   | Visual workflow automation             |
| Document conversion    | [docling](https://github.com/hwdsl2/docker-docling)        | MIT             | 10    | IBM Docling — PDF/DOCX/PPTX → Markdown |

#### Adapt (Modify Existing)

| Capability                    | Source                  | Modification Needed                             |
| ----------------------------- | ----------------------- | ----------------------------------------------- |
| Multi-agent orchestration     | omnigent patterns       | Simplify for educational content pipelines      |
| Knowledge graph visualization | hashintel/hash patterns | Extract graph viz component only                |
| Agent memory                  | MemHop patterns         | Simplify 6-layer model to 3 layers              |
| ETL pipeline                  | open-semantic-etl       | Extract document crawling, drop Solr dependency |

#### Build (Custom)

| Capability            | Complexity | Est. Effort | Dependencies              |
| --------------------- | ---------- | ----------- | ------------------------- |
| KO CRUD               | Low        | 2 weeks     | file-io                   |
| Curriculum Engine     | High       | 6 weeks     | ko-crud, standards        |
| Lesson Builder        | Medium     | 3 weeks     | ko-crud (exists)          |
| Assessment Generator  | Medium     | 3 weeks     | lesson-builder (exists)   |
| Pipeline Orchestrator | High       | 4 weeks     | event-bus, all builders   |
| Provenance Tracker    | Low        | 1 week      | data-layer (exists)       |
| Compliance Checker    | Medium     | 2 weeks     | data-layer, quality gates |
| Policy Manager        | Medium     | 2 weeks     | data-layer                |

---

### 2.6 Gap Analysis

#### Critical Gaps (No Existing Implementation)

| Gap                          | Impact                                  | Recommended Approach                   |
| ---------------------------- | --------------------------------------- | -------------------------------------- |
| Knowledge Ingestion Pipeline | Cannot auto-generate KOs from PDFs/DOCX | Build using docling + pdf-parse        |
| Semantic Search              | No cross-domain search                  | Adopt minisearch + chroma for vectors  |
| Event Bus                    | No inter-component communication        | Build lightweight EventEmitter         |
| Workflow Engine              | No task routing/approval                | Adopt n8n patterns or build simple FSM |
| Standards Alignment          | No curriculum standards mapping         | Build standards registry + matching    |
| Student Tracking             | No progress/analytics                   | Build assessment analytics pipeline    |
| Knowledge Federation         | No cross-instance sharing               | Build KO export/import API             |

#### Nice-to-Have Gaps

| Gap                     | Impact                     | Recommended Approach               |
| ----------------------- | -------------------------- | ---------------------------------- |
| Real-time Collaboration | Limited multi-user editing | Adopt Supabase Realtime            |
| Mobile App              | No native mobile access    | Build PWA wrapper                  |
| Offline Mode            | No offline capability      | Build service worker + local cache |
| Multi-language          | English only               | Build i18n framework               |

---

### 2.7 Prioritized Implementation Roadmap

#### Phase 1: Foundation (Weeks 1-4) — P0 Skills

| Week | Skill               | Effort | Deliverable                                              |
| ---- | ------------------- | ------ | -------------------------------------------------------- |
| 1    | Event Bus           | 3 days | `packages/foundation/event-bus.mjs`                      |
| 1    | Search Engine       | 2 days | `packages/foundation/search.mjs` (minisearch)            |
| 2    | Knowledge Ingestion | 5 days | `packages/knowledge/ingestion.mjs` (docling + pdf-parse) |
| 3    | Knowledge Graph     | 5 days | `packages/knowledge/graph.mjs` (graphology)              |
| 4    | Semantic Search     | 3 days | `packages/knowledge/semantic.mjs` (chroma)               |

**Milestone:** KOs can be auto-generated from PDFs, searched semantically, and visualized as graphs.

#### Phase 2: Education Core (Weeks 5-10) — P0-P1 Skills

| Week | Skill              | Effort  | Deliverable                         |
| ---- | ------------------ | ------- | ----------------------------------- |
| 5-6  | Curriculum Engine  | 2 weeks | `packages/education/curriculum.mjs` |
| 7-8  | Standards Mapping  | 1 week  | `packages/education/standards.mjs`  |
| 9    | Student Tracker    | 1 week  | `packages/education/tracker.mjs`    |
| 10   | Analytics Pipeline | 1 week  | `packages/operations/analytics.mjs` |

**Milestone:** Full curriculum generation with standards alignment and student progress tracking.

#### Phase 3: Operations (Weeks 11-14) — P1 Skills

| Week | Skill               | Effort | Deliverable                          |
| ---- | ------------------- | ------ | ------------------------------------ |
| 11   | Workflow Engine     | 1 week | `packages/operations/workflow.mjs`   |
| 12   | Release Engineering | 1 week | `packages/engineering/release.mjs`   |
| 13   | Compliance Checker  | 1 week | `packages/governance/compliance.mjs` |
| 14   | Documentation       | 1 week | ADR updates, API docs                |

**Milestone:** Operational infrastructure complete.

#### Phase 4: Federation (Weeks 15-18) — P2 Skills

| Week  | Skill                | Effort  | Deliverable                         |
| ----- | -------------------- | ------- | ----------------------------------- |
| 15-16 | Knowledge Federation | 2 weeks | `packages/knowledge/federation.mjs` |
| 17    | Citation Manager     | 1 week  | `packages/research/citations.mjs`   |
| 18    | Trust Deed           | 1 week  | `packages/governance/trust.mjs`     |

**Milestone:** Federated knowledge sharing and research capabilities.

---

### 2.8 Dependencies

```
L1 Foundation ──→ L2 Knowledge ──→ L3 Education
      │                │                │
      ▼                ▼                ▼
L7 Engineering ──→ L8 Operations ──→ L9 Mission
      │
      ▼
L4 Media ──→ L5 Governance ──→ L6 Research
```

**Critical Path:** Foundation → Knowledge → Education → Operations

---

### 2.9 Risks

| Risk                          | Probability | Impact | Mitigation                                      |
| ----------------------------- | ----------- | ------ | ----------------------------------------------- |
| Scope creep (too many skills) | High        | High   | Strict P0-first approach; defer P2              |
| Open-source abandonment       | Medium      | Medium | Pin versions; maintain forks for critical deps  |
| Performance at scale          | Medium      | High   | Benchmark early; use streaming where possible   |
| Integration complexity        | High        | Medium | Start with monolith; extract packages gradually |
| Team knowledge gaps           | Medium      | Medium | Document patterns; create skill templates       |

---

### 2.10 Long-Term Maintenance Strategy

1. **Skill Registry** — Central registry of all skills with version, status, dependencies
2. **Skill Templates** — Standardized SKILL.md format for creating new skills
3. **Automated Testing** — Each skill has integration tests against real data
4. **Dependabot** — Automated dependency updates for adopted libraries
5. **Quarterly Audits** — Review skill usage, deprecate unused, merge redundant
6. **ADR Process** — Any architectural change goes through ADR

---

## 3. Consequences

### What We Gain

- **Coherent architecture** — Every skill has a clear place in the hierarchy
- **Scalable design** — New capabilities slot into existing layers
- **Reduced duplication** — 3 redundant skills merged, clear ownership
- **Institutional focus** — Skills serve institutional functions, not just tools
- **Competitive differentiation** — Knowledge graph-native, impact-first, privacy-first

### What We Lose

- **Ad-hoc flexibility** — Must follow architecture for new skills
- **Speed of addition** — New skills require design review
- **Some hyperframes dominance** — 25/43 skills are video-related; architecture rebalances

### What We Must Do

1. Merge 3 redundant skills (pr-to-video, changelog-video, embedded-captions)
2. Build Event Bus, Search Engine, Knowledge Ingestion in Phase 1
3. Create skill template and registry
4. Document all existing skills in the architecture
5. Begin Phase 1 implementation immediately

---

## 4. References

- [awesome-llm-skills](https://github.com/Prat011/awesome-llm-skills) — 1,430 stars, curated skill patterns
- [haystack](https://github.com/deepset-ai/haystack) — 26k stars, LLM pipeline framework
- [chroma](https://github.com/chroma-core/chroma) — 16k stars, vector database
- [graphology](https://github.com/graphology/graphology) — 2.8k stars, graph management
- [minisearch](https://github.com/nicolo-ribaudo/minisearch) — 2.5k stars, search engine
- [n8n](https://github.com/n8n-io/n8n) — 24k stars, workflow automation
- [docling](https://github.com/hwdsl2/docker-docling) — document conversion
- [hashintel/hash](https://github.com/hashintel/hash) — 1.6k stars, knowledge graphs
- [swarmvault](https://github.com/swarmclawai/swarmvault) — 635 stars, LLM Wiki
- [MemHop](https://github.com/qyiun666/MemHop) — cognitive memory architecture

---

**Next ADR:** ADR-005: Event Bus Architecture  
**Related:** ADR-001: Runtime Architecture, ADR-002: Quality Gates, ADR-003: Provenance System
