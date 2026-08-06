# Constitution 08 — Architecture Constitution

**Document Number:** 08  
**Title:** Architecture Constitution  
**Status:** CONSTITUTIONAL  
**Effective Date:** 2026-08-06  
**Authority:** Derived from Document 00 (Vision), Articles 6, 8, and 9  
**Supersedes:** All conflicting architecture documents, technical specifications, and design documents

---

## Preamble

Architecture is not a suggestion. It is governance. The way Bhavya Foundation structures its software determines whether the institution can scale, evolve, and endure for decades. Bad architecture creates technical debt that compounds silently. Good architecture creates institutional permanence.

This constitution establishes the canonical laws governing how Bhavya Foundation's software is structured, how components communicate, how packages are managed, and how architectural decisions are made.

---

## Article 1 — The Six-Layer Architecture

### 1.1 Architecture Overview

Bhavya OS is organized into six distinct layers. Each layer has defined responsibilities, defined dependencies, and defined constraints. No layer may exceed its responsibilities. No layer may depend on a layer above it.

```
┌──────────────────────────────────────────────────────────────┐
│  Layer 1: Mission                                            │
│  Purpose: Domain-specific institutional work                 │
│  Domains: Research, Forest, Heritage, Community, Volunteer   │
│  Authority: Creates canonical data                           │
│  Package: mission apps in apps/                              │
├──────────────────────────────────────────────────────────────┤
│  Layer 2: Platform                                           │
│  Purpose: Canonical content platform                         │
│  Package: @bhavya/content-core                               │
│  Authority: Single source of truth for all content           │
│  Also: Schemas, validation, publishing pipeline              │
├──────────────────────────────────────────────────────────────┤
│  Layer 3: Knowledge                                          │
│  Purpose: Expose institutional knowledge through APIs        │
│  Authority: Read-only access to content-core                 │
│  Package: Knowledge API                                      │
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

### 1.2 Layer Responsibilities

**Layer 1 — Mission**
Creates domain-specific data. Each mission (Research, Forest, Heritage, Community, Volunteer) operates independently with no cross-domain dependencies. Mission apps call `publishKnowledge()` to write to content-core.

Mission apps are the primary data producers of the institution. They generate the Knowledge Packages, field reports, site records, and community data that flow through the Content OS.

**Layer 2 — Platform**
The canonical content platform. Provides document repository, entity repository, knowledge graph, search indexing, publishing pipeline, and validation framework. This is the single source of truth for all institutional content.

Content-core is the institutional memory. It stores, versions, and serves all content. No other layer stores institutional content independently.

**Layer 3 — Knowledge**
Exposes institutional knowledge through stable APIs. Provides search, recommendations, graph exploration, and analytics. Consumes content-core data without modification.

The Knowledge API is the interface between content storage and content consumers. It is stable, versioned, and documented.

**Layer 4 — Intelligence**
Cross-mission interpretation. Provides global search, graph exploration, cross-mission analytics, and explainable recommendations. The intelligence layer never writes to content-core. It reads, interprets, and reports.

Intelligence produces `Insight<T>` objects — structured, evidence-backed interpretations that presentation layers consume.

**Layer 5 — Presentation**
User-facing applications. Library, Website, Lesson Studio, Engineering Dashboard, and all other user interfaces. Presentation apps consume the Knowledge API and contain no business logic.

Presentation layers are thin. They render. They navigate. They collect user input. They do not contain domain logic.

**Layer 6 — User Experience**
Search, Discovery, and Insights. The user-facing layer that translates intelligence into actionable interfaces. Search is a read-only operation on the knowledge graph.

### 1.3 Layer Communication

Layers communicate through defined interfaces, never directly:

```
Layer 1 (Mission) → publishKnowledge() → Layer 2 (Platform)
Layer 2 (Platform) → Knowledge API → Layer 3 (Knowledge)
Layer 3 (Knowledge) → read-only queries → Layer 4 (Intelligence)
Layer 4 (Intelligence) → Insight<T> → Layer 5 (Presentation)
Layer 5 (Presentation) → UI → Layer 6 (User Experience)
```

---

## Article 2 — Dependency Rules

### 2.1 The Law of Downward Dependencies

Dependencies flow one direction: downward through the layers.

```
Mission Apps → content-core → Knowledge → Intelligence → Presentation
```

This is not a guideline. It is a constitutional requirement.

### 2.2 Prohibited Dependencies

The following dependencies are constitutional violations:

| Violation                                      | Example                                  | Consequence      |
| ---------------------------------------------- | ---------------------------------------- | ---------------- |
| Intelligence writing to content-core           | Intelligence module saving data directly | Immediate revert |
| Mission apps importing from other mission apps | Forest app importing Knowledge app code  | Immediate revert |
| Presentation importing from mission apps       | Website importing Forest app logic       | Immediate revert |
| Any circular dependency                        | A → B → A                                | Immediate revert |
| Layer N importing from Layer N+2 or higher     | Mission app importing from Intelligence  | Immediate revert |
| Presentation importing from content-core       | Website accessing database directly      | Immediate revert |

### 2.3 Enforcement

Dependency rules are enforced through:

1. **Static analysis** — Automated dependency graph validation in CI/CD
2. **Import linting** — Forbidden import paths flagged at commit time
3. **Quality gates** — `pnpm validate` checks architectural compliance
4. **Code review** — All pull requests reviewed for dependency compliance

### 2.4 Exception Process

Exceptions to dependency rules require:

1. A written RFC with justification
2. Evidence that no alternative architecture satisfies the requirement
3. Approval by the institution builder designated for platform architecture
4. Documentation in the decision records
5. Time-bound expiration (exceptions expire after 6 months and must be re-justified)

---

## Article 3 — Package Namespace Rules

### 3.1 Naming Convention

| Package Type     | Prefix     | Example                                    |
| ---------------- | ---------- | ------------------------------------------ |
| Core library     | `@bhavya/` | `@bhavya/platform-ui`                      |
| Core platform    | `@bhavya/` | `@bhavya/content-core`                     |
| Intelligence     | `@bhavya/` | `@bhavya/intelligence`                     |
| Application      | (none)     | `lesson-studio`, `github-intelligence-lab` |
| Internal tool    | `@bhavya/` | `@bhavya/content-core`                     |
| Knowledge domain | (none)     | `constitution`                             |

### 3.2 Naming Rules

1. **All lowercase.** No mixed case in package names.
2. **Kebab-case.** No underscores, no camelCase. `@bhavya/platform-ui`, not `@bhavya/platformUI`.
3. **Descriptive, not abbreviated.** `@bhavya/content-core`, not `@bhavya/cc`.
4. **No version numbers in names.** `@bhavya/platform-ui`, not `@bhavya/platform-ui-v2`.
5. **Clear boundaries.** Package names reflect their domain. `@bhavya/content-core` manages content. `@bhavya/platform-ui` manages UI.

### 3.3 Package Boundaries

Every package must have:

- A clear purpose stated in its README
- Defined public API (exports)
- Defined dependencies (imports from other packages)
- No circular dependencies
- No leaking of internal implementation details

### 3.4 Package Promotion Rule

Nothing starts life as a shared package. This is the Package Promotion Rule.

**Lifecycle:**

1. **Application Module** — Code lives within a specific application
2. **Used Successfully** — The module proves its value through production use
3. **Required By Second Application** — A second application needs the same capability
4. **Promoted To Shared Package** — Extracted to `packages/` with its own `package.json`
5. **Versioned** — Semantic versioning from 1.0.0
6. **Documented** — README, CHANGELOG, API documentation
7. **Maintained** — Ongoing bug fixes, security patches, feature evolution

**Promotion Criteria:**

A module earns package status when:

| Criterion       | Requirement                                             |
| --------------- | ------------------------------------------------------- |
| Second consumer | A second application imports it (not just the original) |
| API stability   | The API has been stable for 2+ iterations               |
| Test suite      | It has its own test suite, not just integration tests   |
| Documentation   | It has documented public API                            |

**Example from ADR-001:**

GitHub Intelligence Lab's research modules (ui-research, course-research, architecture-research, automation-research) were evaluated for promotion. All four passed the bounded context test (distinct models, workflows, lifecycle). But all four failed the second consumer test — only GIL uses them today. They remain application modules until a second consumer demands extraction.

---

## Article 4 — API Design Standards

### 4.1 API Principles

1. **Stable.** APIs do not break without versioning and deprecation.
2. **Documented.** Every API endpoint has documentation with request/response examples.
3. **Typed.** All API inputs and outputs are typed (TypeScript types or Zod schemas).
4. **Validated.** All external input is validated at the boundary. No trust of client data.
5. **Versioned.** APIs are versioned. Breaking changes require a new version.

### 4.2 REST API Standards

| Standard        | Rule                                                     |
| --------------- | -------------------------------------------------------- |
| URL naming      | Lowercase, kebab-case: `/api/knowledge-packages`         |
| HTTP methods    | GET (read), POST (create), PUT (update), DELETE (remove) |
| Response format | JSON with consistent structure                           |
| Error format    | `{ error: string, code: string, details?: unknown }`     |
| Pagination      | Cursor-based or offset-based with `limit` and `offset`   |
| Authentication  | JWT tokens validated on every request                    |
| Rate limiting   | Applied per-client, documented                           |

### 4.3 Internal API Standards

| Standard         | Rule                                                   |
| ---------------- | ------------------------------------------------------ |
| Function naming  | Verb-noun: `getKnowledgePackage()`, `publishContent()` |
| Return types     | Always typed, never `any`                              |
| Error handling   | Errors are thrown, not swallowed                       |
| Side effects     | Documented and intentional                             |
| Async operations | Return Promises, not callbacks                         |

### 4.4 API Versioning

| Change Type             | Version Action                      |
| ----------------------- | ----------------------------------- |
| New endpoint            | Add to current version              |
| New optional field      | Add to current version              |
| New required field      | New version with migration          |
| Removed field           | New version with deprecation notice |
| Changed response format | New version                         |
| Changed URL structure   | New version with redirect           |

---

## Article 5 — Database Standards

### 5.1 Database Philosophy

Bhavya Foundation uses Supabase (PostgreSQL) as its canonical database. No other database system is introduced without governance review.

### 5.2 Schema Standards

| Standard     | Rule                                                |
| ------------ | --------------------------------------------------- |
| Naming       | snake_case for tables and columns                   |
| Primary keys | UUID with auto-generation                           |
| Timestamps   | `created_at` and `updated_at` on every table        |
| Soft deletes | `deleted_at` nullable timestamp, never hard deletes |
| Constraints  | Foreign keys, check constraints, unique constraints |
| Indexes      | On all frequently queried columns                   |
| Migrations   | Versioned, reversible, tested                       |

### 5.3 Data Ownership

| Layer                  | Data Ownership                               |
| ---------------------- | -------------------------------------------- |
| Mission (Layer 1)      | Creates data, publishes through content-core |
| Platform (Layer 2)     | Owns content storage, indexing, and serving  |
| Knowledge (Layer 3)    | Read-only access to content-core             |
| Intelligence (Layer 4) | Read-only, never mutates                     |
| Presentation (Layer 5) | No direct database access                    |

### 5.4 Migration Standards

Every database change must:

1. Be versioned with a migration file
2. Be reversible (up and down migrations)
3. Be tested against a copy of production data
4. Be reviewed by a database owner
5. Have a rollback plan

---

## Article 6 — Event System Standards

### 6.1 Canonical Implementation

There is one canonical event system. No parallel event systems, no ad-hoc pub/sub, no direct function calls that should be events.

### 6.2 Event Principles

| Principle    | Rule                                           |
| ------------ | ---------------------------------------------- |
| Asynchronous | Events are consumed asynchronously             |
| Decoupled    | Producer does not depend on consumer           |
| Typed        | All events have defined schemas                |
| Logged       | All events are logged for audit                |
| Retried      | Failed events are retried with backoff         |
| Idempotent   | Consumers handle duplicate delivery gracefully |

### 6.3 Event Types

| Event Type | Purpose                  | Example                                  |
| ---------- | ------------------------ | ---------------------------------------- |
| Content    | Content lifecycle events | `content.published`, `content.updated`   |
| User       | User lifecycle events    | `user.created`, `user.progress`          |
| System     | System events            | `system.health`, `system.deployment`     |
| Mission    | Mission-specific events  | `forest.planting`, `heritage.documented` |

### 6.4 Event Schema

```typescript
interface InstitutionalEvent {
  id: string;
  type: string;
  timestamp: ISO8601;
  source: string;
  data: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}
```

---

## Article 7 — Workflow System Standards

### 7.1 Canonical Implementation

There is one canonical workflow system. No parallel workflow engines, no ad-hoc state machines, no manual tracking of multi-step processes.

### 7.2 Workflow Principles

| Principle    | Rule                                                  |
| ------------ | ----------------------------------------------------- |
| Defined      | Every workflow has a documented definition            |
| Stateful     | Workflow state is persisted and auditable             |
| Recoverable  | Failed workflows can be resumed from last checkpoint  |
| Observable   | Workflow progress is visible to authorized users      |
| Time-bounded | Every workflow step has a target and maximum duration |

### 7.3 Standard Workflows

| Workflow          | Stages                                                  | Authority     |
| ----------------- | ------------------------------------------------------- | ------------- |
| Content Lifecycle | Research → Draft → Review → Approve → Publish           | Document 07   |
| BEE 2.0           | Research → KP → Recommend → Review → Update → Telemetry | Document 04   |
| Incident Response | Detect → Assess → Respond → Resolve → Review            | Governance    |
| Package Promotion | Module → Use → Second consumer → Extract → Version      | This Document |

---

## Article 8 — Memory System Standards

### 8.1 Canonical Implementation

There is one canonical memory system. No parallel memory stores, no ad-hoc history tracking, no manual record-keeping of institutional decisions.

### 8.2 Memory Types

| Memory Type          | Purpose                              | Retention                       |
| -------------------- | ------------------------------------ | ------------------------------- |
| Decision Memory      | Why decisions were made              | Permanent                       |
| Learning Memory      | What learners know and struggle with | Duration of enrollment + 1 year |
| Institutional Memory | What the institution has learned     | Permanent                       |
| Technical Memory     | Architecture decisions, ADRs         | Permanent                       |
| Operational Memory   | Incident reports, runbooks           | 5 years                         |

### 8.3 Memory Principles

| Principle         | Rule                                                         |
| ----------------- | ------------------------------------------------------------ |
| Write-once        | Memory entries are not modified, only appended               |
| Immutable history | Past records are never altered                               |
| Accessible        | Authorized users can query memory                            |
| Private           | Personal learning memory is private                          |
| Portable          | Users can export their data                                  |
| Deletable         | Users can delete their data (subject to institutional needs) |

---

## Article 9 — UI Component Standards

### 9.1 Canonical UI System

`@bhavya/platform-ui` is the canonical UI system. All applications consume it. No application creates custom foundational components.

### 9.2 Component Rules

| Rule                                     | Description                                       |
| ---------------------------------------- | ------------------------------------------------- |
| No custom foundational components        | All base components come from @bhavya/platform-ui |
| No inline design tokens                  | All tokens come from the design system            |
| No hardcoded colors, spacing, typography | Everything references tokens                      |
| Variant-based, not component-based       | Use props for variants, not separate components   |
| Accessible                               | WCAG 2.1 AA compliance                            |
| Responsive                               | Works at all breakpoints                          |
| Dark mode first                          | Dark mode is the default                          |

### 9.3 Component Catalog

Available components:

| Category     | Components                       |
| ------------ | -------------------------------- |
| Layout       | AppLayout                        |
| Primitives   | Button, Card, Badge, Avatar      |
| Navigation   | Breadcrumb, Tabs                 |
| Feedback     | EmptyState, Toast, Modal         |
| Loading      | Skeleton, LoadingSpinner         |
| Data Display | StatCard, StatusBadge, DataTable |
| Forms        | SearchBar                        |

### 9.4 Component Evolution

Components evolve through the BEE 2.0 lifecycle. No component is added, modified, or removed without:

1. Research demonstrating the need
2. Governance review
3. Design system maintainer approval
4. Documentation update
5. Version bump

---

## Article 10 — Design Token Standards

### 10.1 Canonical Token System

There is one canonical design token system defined in `packages/platform-ui/src/styles/tokens.css`. No application may define its own foundational tokens.

### 10.2 Three-Layer Architecture

```
Primitive Tokens (raw values)
    ↓
Semantic Tokens (contextual meaning)
    ↓
Component Tokens (component-specific)
```

### 10.3 Token Categories

| Category   | Examples                                                  | Rules                             |
| ---------- | --------------------------------------------------------- | --------------------------------- |
| Background | `bg-primary`, `bg-secondary`, `bg-tertiary`               | No hardcoded hex values           |
| Text       | `text-primary`, `text-secondary`, `text-tertiary`         | Must meet contrast ratios         |
| Border     | `border-primary`, `border-focus`                          | Consistent across components      |
| Accent     | `accent-blue`, `accent-green`, `accent-yellow`            | Limited to defined palette        |
| Status     | `status-success`, `status-warning`, `status-error`        | Color-independent (use icons too) |
| Spacing    | `space-1` through `space-12`                              | Multiples of 4px                  |
| Typography | `text-xs` through `text-3xl`                              | Defined scale                     |
| Motion     | `transition-fast`, `transition-normal`, `transition-slow` | Purposeful only                   |

### 10.4 Token Rules

1. No hardcoded values in components
2. No custom palettes
3. Applications may reference tokens but never redefine them
4. Token changes require governance review
5. Dark mode is default; light mode must use separate token mappings

---

## Article 11 — Port Allocation Rules

### 11.1 Canonical Port Allocation

| Application     | Port | Purpose                     |
| --------------- | ---- | --------------------------- |
| Runtime API     | 3100 | Bhavya OS runtime engine    |
| Lesson Studio   | 3020 | Next.js lesson development  |
| Website         | 3000 | Public-facing website       |
| Documentation   | 3001 | Platform documentation      |
| Admin Dashboard | 3010 | Internal operations         |
| Content Factory | 3110 | Content generation pipeline |

### 11.2 Port Rules

1. **No port conflicts.** Every application has a unique port.
2. **Ports are documented.** Port allocation is recorded in the architecture documentation.
3. **Ports are not changed without notification.** Port changes require governance review and migration plan.
4. **Development ports match production.** Development and production use the same port allocation where possible.

---

## Article 12 — The Rule: No Standalone Apps

### 12.1 The Rule

No application exists as a standalone product. Every application is a module of Bhavya OS. This is constitutional law.

### 12.2 What This Means

| Rule                                     | Consequence                                                                   |
| ---------------------------------------- | ----------------------------------------------------------------------------- |
| Every app has architectural placement    | A feature that cannot be placed in the six-layer architecture cannot be built |
| Every app consumes shared infrastructure | @bhavya/platform-ui, @bhavya/content-core, @bhavya/intelligence               |
| Every app follows the BEE 2.0 lifecycle  | No app evolves independently of the platform                                  |
| Every app passes quality gates           | lint, test, validate, build                                                   |
| Every app is documented                  | In the architecture overview and its own README                               |

### 12.3 Why This Rule Exists

1. **Institutional permanence.** Applications that exist independently can be abandoned. Applications that are modules of the institution persist.
2. **Shared infrastructure.** A common design system, content platform, and intelligence layer reduce duplication.
3. **Governance.** All applications follow the same lifecycle, quality standards, and review processes.
4. **Discoverability.** A unified platform is easier to understand, navigate, and maintain than a collection of independent apps.

### 12.4 Anti-Pattern: The Standalone App

Building a standalone application that:

- Has its own design system
- Has its own content storage
- Has its own authentication
- Has its own deployment pipeline
- Does not share infrastructure with Bhavya OS

This is a constitutional violation. Every custom component must justify its existence against the reuse mandate in Document 02 (Bhavya OS Constitution), Article 6.

---

## Article 13 — Quality Gates

### 13.1 The Four Gates

Every merge must pass four quality gates:

```bash
pnpm lint && pnpm test && pnpm validate && pnpm build
```

| Gate            | Purpose                                     | Failure Policy |
| --------------- | ------------------------------------------- | -------------- |
| `pnpm lint`     | Code style and consistency                  | Block merge    |
| `pnpm test`     | Behavioral verification                     | Block merge    |
| `pnpm validate` | Data integrity and architectural compliance | Block merge    |
| `pnpm build`    | Compilation and type checking               | Block merge    |

### 13.2 Gate Failure

A failed gate blocks the merge. No exceptions. No "fix it later." No bypassing gates for convenience.

### 13.3 Gate Evolution

Quality gates evolve through the BEE 2.0 lifecycle. New gates are added through the institutional cycle. Gates are never removed without evidence that the check is no longer necessary.

---

## Article 14 — Coding Standards

### 14.1 Language Standards

| Standard            | Rule                                         |
| ------------------- | -------------------------------------------- |
| Language            | TypeScript (strict mode)                     |
| Linter              | ESLint                                       |
| Formatter           | Prettier                                     |
| Type checking       | `strict: true` in all tsconfig.json          |
| `any` type          | Prohibited. Use `unknown` and narrow.        |
| `ignoreBuildErrors` | Prohibited. Fix errors, don't suppress them. |

### 14.2 Testing Standards

| Layer       | Framework              | Coverage Target |
| ----------- | ---------------------- | --------------- |
| Unit        | Vitest                 | 80%+            |
| Integration | Vitest with containers | 60%+            |
| E2E         | Playwright             | Critical paths  |

### 14.3 Performance Standards

| Metric                   | Target  |
| ------------------------ | ------- |
| Lighthouse score         | >= 95   |
| JS bundle size           | < 200KB |
| First Contentful Paint   | < 1.5s  |
| Largest Contentful Paint | < 2.5s  |
| API response (p95)       | < 200ms |

---

## Article 15 — What We Never Do

1. **Never create standalone apps.** Every app is a module of Bhavya OS.
2. **Never skip architectural placement.** If it cannot be placed, it cannot be built.
3. **Never create circular dependencies.** Dependencies flow downward only.
4. **Never duplicate business logic.** If it exists, use it.
5. **Never bypass quality gates.** Gates block merges. No exceptions.
6. **Never create parallel systems.** One event system, one workflow system, one memory system, one UI system, one token system.
7. **Never promote packages prematurely.** Shared packages are earned, not planned.
8. **Never hardcode domain content.** All content flows through the Content OS.
9. **Never use `any` type.** TypeScript strict mode is non-negotiable.
10. **Never commit secrets.** Environment variables or secret managers only.

---

## Article 16 — Amendment Process

This constitution may only be amended through:

1. A written RFC with architectural justification
2. Dependency graph analysis showing impact
3. Quality gate verification that no regressions are introduced
4. Review by the governance board
5. A 30-day comment period
6. Approval by the institution builder designated for platform architecture
7. Publication with version bump and changelog entry

Architecture changes require MAJOR version bump. Capability additions require MINOR version bump. Bug fixes require PATCH version bump.

---

## Article 17 — Definitions

For the purposes of this Constitution:

- **Bhavya OS** — The permanent institutional operating system of Bhavya Foundation
- **Layer** — One of six architectural tiers with defined responsibilities and dependency constraints
- **Mission** — A domain-specific application in Layer 1 (Research, Forest, Heritage, Community, Volunteer)
- **content-core** — The canonical content platform (Layer 2) that serves as the single source of truth
- **Knowledge API** — The stable API (Layer 3) that exposes institutional knowledge
- **Intelligence** — The read-only interpretation layer (Layer 4) that produces `Insight<T>` objects
- **Presentation** — User-facing applications (Layer 5) that consume the Knowledge API
- **Quality Gates** — Automated validation checks (`lint`, `test`, `validate`, `build`) that gate all merges
- **BEE 2.0** — Bhavya Evolution Engine, the lifecycle protocol for platform evolution
- **Package Promotion Rule** — The rule that nothing starts life as a shared package; packages are earned through demonstrated consumption
- **Institution Builder** — A person authorized to modify institutional architecture

---

## Article 18 — Effective Date and Authority

This Constitution takes effect on 2026-08-06 and remains in force indefinitely. It may only be amended through the process defined in Article 16.

The authority for this Constitution derives from Document 00 (Vision), Article 6 (Engineering Principles), which establishes that architecture is governance and every decision must trace back to evidence.

---

**End of Document 08 — Architecture Constitution**

_This document is derived from Document 00 (Vision) and is subordinate only to it. Architecture is governance. Architecture is permanent._
