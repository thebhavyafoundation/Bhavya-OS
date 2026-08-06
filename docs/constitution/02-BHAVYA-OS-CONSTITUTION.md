# Bhavya OS Constitution

**Document Number:** 02  
**Title:** Bhavya OS Constitution  
**Status:** CONSTITUTIONAL  
**Effective Date:** 2026-01-01  
**Authority:** Derived from Document 00 (Vision), Articles 6 and 8  
**Supersedes:** All conflicting architecture documents, README files, and technical specifications

---

## Preamble

Bhavya OS is the permanent institutional operating system of Bhavya Foundation. It is not a collection of independent applications. It is not a monolith. It is a layered, dependency-governed platform where every module has architectural placement and every component serves the institutional mission.

This document establishes the operating system as constitutional law. Architecture is not a suggestion. It is governance.

---

## Article 1 — Nature of Bhavya OS

### 1.1 What Bhavya OS Is

Bhavya OS is the permanent institutional operating system that powers every application, workflow, and intelligence capability across Bhavya Foundation. It is the canonical platform that all missions, domains, and applications consume.

### 1.2 What Bhavya OS Is NOT

| Bhavya OS Is                                         | Bhavya OS Is NOT                 |
| ---------------------------------------------------- | -------------------------------- |
| A layered, dependency-governed platform              | A collection of independent apps |
| A permanent institutional system                     | A project with an end date       |
| A canonical content pipeline                         | A set of disconnected tools      |
| An intelligence layer with read-only invariants      | A database that writes to itself |
| A governance framework with constitutional authority | A wiki with informal conventions |

### 1.3 Permanence

Bhavya OS is designed for a 10-year horizon. Every architectural decision assumes the platform will exist in 2036. Technology choices, dependency selections, and design patterns are made for permanence, not trend-following.

---

## Article 2 — The Six-Layer Architecture

### 2.1 Layer Definition

Bhavya OS is organized into six distinct layers:

```
┌──────────────────────────────────────────────────────────────┐
│  Layer 1: Mission                                            │
│  Purpose: Domain-specific institutional work                 │
│  Domains: Research, Forest, Heritage, Community, Volunteer   │
│  Authority: Creates canonical data                           │
├──────────────────────────────────────────────────────────────┤
│  Layer 2: Platform                                           │
│  Purpose: Canonical content platform                         │
│  Package: @bhavya/content-core                               │
│  Authority: Single source of truth for all content           │
├──────────────────────────────────────────────────────────────┤
│  Layer 3: Knowledge                                          │
│  Purpose: Expose institutional knowledge through APIs        │
│  Authority: Read-only access to content-core                 │
├──────────────────────────────────────────────────────────────┤
│  Layer 4: Intelligence                                       │
│  Purpose: Cross-mission interpretation and analytics         │
│  Package: @bhavya/intelligence                               │
│  Invariant: Never mutates institutional data                 │
├──────────────────────────────────────────────────────────────┤
│  Layer 5: Presentation                                       │
│  Purpose: User-facing applications                           │
│  Apps: Library, Website, Lesson Studio, Dashboard            │
│  Authority: Consumes Knowledge API only                      │
├──────────────────────────────────────────────────────────────┤
│  Layer 6: User Experience                                    │
│  Purpose: Search, Discovery, Insights                        │
│  Authority: Read-only intelligence consumption               │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Layer Responsibilities

**Layer 1 — Mission**  
Creates domain-specific data. Each mission (Research, Forest, Heritage, Community, Volunteer) operates independently with no cross-domain dependencies. Mission apps call `publishKnowledge()` to write to content-core.

**Layer 2 — Platform**  
The canonical content platform. Provides document repository, entity repository, knowledge graph, search indexing, publishing pipeline, and validation framework. This is the single source of truth for all institutional content.

**Layer 3 — Knowledge**  
Exposes institutional knowledge through stable APIs. Provides search, recommendations, graph exploration, and analytics. Consumes content-core data without modification.

**Layer 4 — Intelligence**  
Cross-mission interpretation. Provides global search, graph exploration, cross-mission analytics, and explainable recommendations. The intelligence layer never writes to content-core. It reads, interprets, and reports.

**Layer 5 — Presentation**  
User-facing applications. Library, Website, Lesson Studio, Engineering Dashboard, and all other user interfaces. Presentation apps consume the Knowledge API and contain no business logic.

**Layer 6 — User Experience**  
Search, Discovery, and Insights. The user-facing layer that translates intelligence into actionable interfaces. Search is a read-only operation on the knowledge graph.

### 2.3 Layer Communication

Layers communicate through defined interfaces, never directly:

```
Layer 1 (Mission) → publishKnowledge() → Layer 2 (Platform)
Layer 2 (Platform) → Knowledge API → Layer 3 (Knowledge)
Layer 3 (Knowledge) → read-only queries → Layer 4 (Intelligence)
Layer 4 (Intelligence) → Insight<T> → Layer 5 (Presentation)
Layer 5 (Presentation) → UI → Layer 6 (User Experience)
```

---

## Article 3 — Dependency Rules

### 3.1 The Law of Downward Dependencies

Dependencies flow one direction: downward through the layers.

```
Mission Apps → content-core → Knowledge → Intelligence → Presentation
```

This is not a guideline. It is a constitutional requirement.

### 3.2 Prohibited Dependencies

The following dependencies are constitutional violations:

1. **Intelligence writing to content-core** — Intelligence is read-only. It interprets data; it does not create or modify it.
2. **Mission apps importing from other mission apps** — Each mission is isolated. Forest does not import from Knowledge. Heritage does not import from Community.
3. **Presentation layer importing from mission apps** — Presentation consumes Knowledge API only. It never reaches directly into mission data.
4. **Any circular dependencies** — Circular dependency is an architectural violation that triggers immediate revert.
5. **Layer N importing from Layer N+2 or higher** — A mission app cannot import from the intelligence layer. A presentation app cannot import from content-core.

### 3.3 Enforcement

Dependency rules are enforced through:

1. **Static analysis** — Automated dependency graph validation in CI/CD
2. **Import linting** — Forbidden import paths flagged at commit time
3. **Quality gates** — `pnpm validate` checks architectural compliance
4. **Code review** — All pull requests reviewed for dependency compliance

### 3.4 Exception Process

Exceptions to dependency rules require:

1. A written RFC with justification
2. Evidence that no alternative architecture satisfies the requirement
3. Approval by the institution builder designated for platform architecture
4. Documentation in the decision records
5. Time-bound expiration (exceptions expire after 6 months and must be re-justified)

---

## Article 4 — The Institutional Cycle

### 4.1 The Canonical Workflow

Every institutional workflow follows this cycle:

```
Research → Knowledge Package → Proposal → Review → Approval → Publication → Feedback → Continuous Improvement
```

### 4.2 Stage Definitions

**Research** — Gather evidence. Every change traces back to research. No feature is built because someone "thinks it would be nice." Research produces a Knowledge Package.

**Knowledge Package** — A canonical, reusable educational or institutional unit. Knowledge Packages are the atomic building blocks of all content. They exist once and are consumed by every platform that needs them.

**Proposal** — A formal proposal to modify the platform, curriculum, or institution. Proposals reference Knowledge Packages and cite evidence.

**Review** — Peer review by domain experts. Reviews check constitutional compliance, technical feasibility, and alignment with institutional goals.

**Approval** — Human approval by the designated institution builder. No automated system may approve institutional changes.

**Publication** — Canonical publication through the Content OS. Published artifacts are versioned, tracked, and auditable.

**Feedback** — Structured feedback from users, students, mentors, and community members. Feedback is evidence, not opinion.

**Continuous Improvement** — Feedback feeds back into Research, closing the cycle. Every iteration makes the institution smarter.

### 4.3 No Skipping Stages

No stage may be skipped, bypassed, or automated away. Each stage produces a canonical artifact. The next stage consumes that artifact. This cycle is the heartbeat of the institution.

### 4.4 Cycle Timing

| Stage                  | Target Duration       | Maximum Duration |
| ---------------------- | --------------------- | ---------------- |
| Research               | 1–2 weeks             | 4 weeks          |
| Knowledge Package      | 1 week                | 2 weeks          |
| Proposal               | 2–3 days              | 1 week           |
| Review                 | 3–5 days              | 2 weeks          |
| Approval               | 1–2 days              | 1 week           |
| Publication            | 1 day                 | 3 days           |
| Feedback               | Ongoing               | —                |
| Continuous Improvement | Triggered by feedback | —                |

---

## Article 5 — Versioning Policy

### 5.1 Semantic Versioning

Bhavya OS follows semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR** — Breaking architectural changes, new layers, removed layers
- **MINOR** — New capabilities, new mission apps, new intelligence modules
- **PATCH** — Bug fixes, documentation updates, non-breaking improvements

### 5.2 Version History (Canonical)

| Version       | Era                      | Milestone                                      |
| ------------- | ------------------------ | ---------------------------------------------- |
| v0.6.0        | Platform Foundation      | Shared content platform                        |
| v0.7.0–v0.9.0 | Platform Foundation      | Mission applications                           |
| v1.0.0        | Platform Foundation      | Stable architecture                            |
| v1.0.1        | Platform Foundation      | Engineering excellence                         |
| v1.1.0        | Operational Intelligence | Institution intelligence                       |
| v1.2.0        | Operational Intelligence | Operational intelligence                       |
| v1.3.0        | Operational Intelligence | Decision support                               |
| v2.0.0        | Institutional Operations | Governance operations                          |
| v2.1.0        | Institutional Operations | Resolution lifecycle, policy versioning        |
| v2.2.0        | Institutional Operations | Action items, operational health               |
| v2.3.0        | Institutional Operations | Traceability, evidence, snapshot/trend metrics |
| v2.4.0        | Institutional Operations | Impact reporting                               |
| v2.5.0        | Institutional Operations | Cross-domain reporting                         |
| v3.0.0        | Institutional Learning   | Institutional memory                           |
| v3.1.0        | Institutional Learning   | Organizational learning                        |
| v3.2.0        | Institutional Learning   | Predictive intelligence                        |
| v3.3.0        | Institutional Learning   | Institutional playbooks                        |

### 5.3 Version Governance

- MAJOR version changes require constitutional amendment (Document 00, Article 5.3)
- MINOR version changes require architecture review and approval
- PATCH version changes require standard code review

### 5.4 Deprecation Policy

Deprecated features must:

1. Be announced 6 months before removal
2. Maintain backward compatibility during deprecation period
3. Provide migration guides
4. Log usage metrics to measure adoption of replacements

---

## Article 6 — What Gets Built vs. What Gets Reused

### 6.1 Build Criteria

Build custom solutions only when:

1. The requirement is unique to Bhavya Foundation's institutional mission
2. No mature open-source solution exists
3. Constitutional compliance requires custom implementation
4. Measurable evidence demonstrates superiority over alternatives

### 6.2 Reuse Mandate

The following are mandatory reuse targets:

| Need               | Reuse Target                        |
| ------------------ | ----------------------------------- |
| Social scheduling  | Postiz (29.6k stars, 30+ platforms) |
| Authentication     | Supabase Auth                       |
| Database           | Supabase PostgreSQL                 |
| Version control    | GitHub                              |
| UI components      | @bhavya/platform-ui                 |
| Content pipeline   | @bhavya/content-core                |
| Intelligence       | @bhavya/intelligence                |
| Package management | pnpm                                |
| Runtime            | Node.js                             |

### 6.3 The Anti-Pattern

Building custom solutions for problems that have proven open-source answers is a constitutional violation. Every custom component must:

1. Document why the existing solution was rejected
2. Provide evidence of measurable improvement
3. Justify ongoing maintenance cost
4. Be reviewed by the governance board

### 6.4 New Module Admission

No new module enters Bhavya OS without:

1. Architectural placement in the six-layer model
2. Dependency declaration showing downward-only dependencies
3. Quality gate integration (lint, test, validate, build)
4. Documentation in the architecture overview
5. Approval by the institution builder designated for platform architecture

---

## Article 7 — The Rule: No Feature Without Architectural Placement

### 7.1 The Rule

Every feature, every module, every component must have a clear placement in the six-layer architecture. A feature that cannot be placed architecturally cannot be built.

### 7.2 Placement Test

Before building any feature, answer:

1. Which layer does this belong to? (Mission, Platform, Knowledge, Intelligence, Presentation, UX)
2. What does it depend on? (Only downward dependencies are permitted)
3. What depends on it? (Upward dependencies must be documented)
4. Does it mutate data it does not own? (Intelligence never mutates. Presentation never mutates.)
5. Does it duplicate existing functionality? (Reuse before creation.)

### 7.3 Architectural Violations

Features without architectural placement are:

1. Rejected at code review
2. Flagged by quality gates
3. Documented as architectural debt
4. Scheduled for removal or proper placement

### 7.4 Technical Debt Register

All architectural violations are logged in the technical debt register with:

1. Date of introduction
2. Author
3. Layer violation type
4. Remediation plan
5. Target resolution date

---

## Article 8 — Data Flow and Integrity

### 8.1 Publishing Pipeline

```
Mission App → publishKnowledge() → content-core → Knowledge API → Intelligence → Presentation
```

Every stage consumes the outputs of the previous stage. No stage introduces another source of truth.

### 8.2 Content Types

| Type          | Source                   | Storage                         |
| ------------- | ------------------------ | ------------------------------- |
| Documents     | Mission apps, governance | `content/` directory            |
| Entities      | Extracted from documents | `data/entities.json`            |
| Relationships | Knowledge graph          | `registry/knowledge-graph.json` |
| Collections   | Curated groupings        | `data/collections.json`         |

### 8.3 Single Source of Truth

All institutional data flows through one canonical pipeline. There are no shadow databases, no alternative data stores, no unofficial copies. Content-core is the single source of truth.

### 8.4 Read-Only Intelligence

The intelligence layer never mutates institutional data. It reads from content-core, interprets data, and produces `Insight<T>` objects with evidence and confidence scores. Analytics never modify the underlying data.

---

## Article 9 — Quality Gates

### 9.1 The Four Gates

Every merge must pass four quality gates:

```bash
pnpm lint && pnpm test && pnpm validate && pnpm build
```

| Gate            | Purpose                             | Failure Policy |
| --------------- | ----------------------------------- | -------------- |
| `pnpm lint`     | Code style and consistency          | Block merge    |
| `pnpm test`     | Behavioral verification (55+ tests) | Block merge    |
| `pnpm validate` | Data integrity (21+ checks)         | Block merge    |
| `pnpm build`    | Compilation and type checking       | Block merge    |

### 9.2 Gate Failure

A failed gate blocks the merge. No exceptions. No "fix it later." No bypassing gates for convenience.

### 9.3 Gate Evolution

Quality gates evolve through the Bhavya Evolution Engine (BEE 2.0). New gates are added through the institutional cycle. Gates are never removed without evidence that the check is no longer necessary.

---

## Article 10 — The Four Eras

### 10.1 Era Definitions

| Era                      | Central Question                                     | Outcome                                                             |
| ------------------------ | ---------------------------------------------------- | ------------------------------------------------------------------- |
| Platform Foundation      | How do we represent the institution consistently?    | Canonical models, mission applications, engineering quality         |
| Operational Intelligence | How do we understand current institutional state?    | Knowledge, analytics, dashboards, decision support                  |
| Institutional Operations | How do we govern and execute work?                   | Governance, evidence, traceability, reporting                       |
| Institutional Learning   | How do we improve because of accumulated experience? | Memory, predictive intelligence, organizational learning, playbooks |

### 10.2 Era Progression

Each era builds on the previous one without replacing it. Platform Foundation enables Operational Intelligence. Operational Intelligence enables Institutional Operations. Institutional Operations enables Institutional Learning.

### 10.3 Current Era

The current era is determined by the institution builder and documented in the roadmap. All engineering work must align with the current era's central question.

---

## Article 11 — Institutional Knowledge Hierarchy

### 11.1 Six Levels of Knowledge

| Level       | Question Answered         | Source                             |
| ----------- | ------------------------- | ---------------------------------- |
| Records     | What happened?            | Canonical data in content-core     |
| Evidence    | How do we know?           | Verification, traceability         |
| Memory      | Why did it happen?        | Decision context, lessons          |
| Patterns    | What tends to happen?     | Organizational learning            |
| Predictions | What is likely to happen? | Predictive intelligence            |
| Playbooks   | What should we do?        | Validated institutional experience |

### 11.2 Knowledge Progression

This progression moves from descriptive knowledge (Records) to prescriptive guidance (Playbooks). Each level depends on the levels below it. Playbooks cannot exist without Predictions. Predictions cannot exist without Patterns.

---

## Article 12 — Mission Application Standards

### 12.1 Scaffolding

New missions are scaffolded with:

```bash
pnpm scaffold mission <name> <port>
```

This produces a standardized structure with content-core integration, validation rules, and quality gate configuration.

### 12.2 Integration Requirements

Every mission must:

1. Define domain models in content-core
2. Implement `publishKnowledge()` for auto-indexing
3. Add validation rules for domain-specific data
4. Integrate with the Knowledge API
5. Pass all four quality gates

### 12.3 Isolation Enforcement

Mission apps must not:

1. Import from other mission apps
2. Directly access other missions' data
3. Bypass content-core for data storage
4. Skip the publishing pipeline

---

## Article 13 — Extension Guidelines

### 13.1 Adding Intelligence

1. Create module in `packages/intelligence/src/`
2. Return `Insight<T>` with evidence and confidence
3. Never mutate content-core data
4. Expose through Knowledge API
5. Include test coverage for all recommendations

### 13.2 Adding Presentation

1. Create app in `apps/`
2. Consume Knowledge API only
3. Focus on user experience
4. Keep business logic in intelligence layer
5. Use @bhavya/platform-ui for all components

### 13.3 Adding Skills

1. Define skill in `_config/skills/`
2. Register in capability registry
3. Declare required dependencies
4. Include quality gate configuration
5. Document in the skill catalog

---

## Article 14 — Design System Integration

### 14.1 Canonical UI Layer

`@bhavya/platform-ui` is the canonical UI layer. All applications consume it. No application creates custom foundational components.

### 14.2 Design Rules

1. No application creates custom foundational components.
2. No inline design tokens.
3. No hardcoded spacing, colors, typography, or animations.
4. Components evolve only after research and approval through BEE 2.0.
5. Every component is versioned with documentation.

### 14.3 Design Tokens

All design decisions — colors, spacing, typography, shadows, animations — flow from the design system. Application-specific tokens are derived from, never independent of, the canonical tokens.

---

## Article 15 — Amendment Process

This Bhavya OS Constitution may only be amended through:

1. A written RFC with architectural justification
2. Dependency graph analysis showing impact
3. Quality gate verification that no regressions are introduced
4. Review by the governance board
5. A 30-day comment period
6. Approval by the institution builder designated for platform architecture
7. Publication with version bump and changelog entry

Architecture changes require MAJOR version bump. Capability additions require MINOR version bump. Bug fixes require PATCH version bump.

---

## Article 16 — Enforcement

### 16.1 Architectural Compliance

Every pull request must demonstrate:

1. Correct layer placement
2. Downward-only dependencies
3. No data mutation outside ownership boundaries
4. Integration with quality gates
5. Constitutional citation for governance-relevant changes

### 16.2 AI Accountability

AI systems operating within Bhavya OS must:

1. Cite this Constitution for architectural decisions
2. Never override architectural boundaries
3. Log all code modifications for audit
4. Refuse to execute actions that violate dependency rules

### 16.3 Human Override

Humans always have final authority over architectural decisions. No automated system may modify the six-layer architecture, introduce new layers, or change dependency rules without human approval.

---

## Article 17 — Definitions

For the purposes of this Constitution:

- **Bhavya OS** — The permanent institutional operating system of Bhavya Foundation
- **Layer** — One of six architectural tiers with defined responsibilities and dependency constraints
- **Mission** — A domain-specific application in Layer 1 (Research, Forest, Heritage, Community, Volunteer)
- **content-core** — The canonical content platform (Layer 2) that serves as the single source of truth
- **Knowledge API** — The stable API (Layer 3) that exposes institutional knowledge
- **Intelligence** — The read-only interpretation layer (Layer 4) that produces Insight<T> objects
- **Presentation** — User-facing applications (Layer 5) that consume the Knowledge API
- **Quality Gates** — Automated validation checks (lint, test, validate, build) that gate all merges
- **BEE 2.0** — Bhavya Evolution Engine, the lifecycle protocol for platform evolution
- **Institution Builder** — A person authorized to modify institutional architecture

---

## Article 18 — Effective Date and Authority

This Constitution takes effect on 2026-01-01 and remains in force indefinitely. It may only be amended through the process defined in Article 15.

The authority for this Constitution derives from Document 00 (Vision), which establishes Bhavya OS as the permanent institutional platform of Bhavya Foundation.

---

**End of Document 02 — Bhavya OS Constitution**

_This document is derived from Document 00 (Vision) and is subordinate only to it._
