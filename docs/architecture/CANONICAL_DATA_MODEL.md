# CANONICAL DATA MODEL

**Date:** 2026-08-10
**Status:** ACTIVE
**Owner:** Bhavya Foundation Architecture
**Last updated:** 2026-08-10

---

## Rule

Every entity has exactly ONE canonical owner. No duplicate domain models.

---

## Core Entities

### Knowledge Domain

| Entity             | Canonical Type                 | Owner                | Storage               | Relationships               |
| ------------------ | ------------------------------ | -------------------- | --------------------- | --------------------------- |
| `KnowledgeObject`  | `packages/shared/src/types.ts` | `packages/knowledge` | SQLite (ai-institute) | has Concepts, has Exercises |
| `KnowledgePackage` | `packages/shared/src/types.ts` | `packages/knowledge` | SQLite                | contains KOs                |
| `Concept`          | inline in KO                   | `packages/knowledge` | SQLite                | belongs to KO               |
| `Definition`       | inline in KO                   | `packages/knowledge` | SQLite                | belongs to Concept          |
| `Misconception`    | inline in KO                   | `packages/knowledge` | SQLite                | belongs to Concept          |
| `Exercise`         | inline in KO                   | `packages/knowledge` | SQLite                | belongs to KO               |

### Academy Domain

| Entity       | Canonical Type                 | Owner                 | Storage               | Relationships                  |
| ------------ | ------------------------------ | --------------------- | --------------------- | ------------------------------ |
| `Course`     | `packages/shared/src/types.ts` | `packages/academy`    | SQLite (ai-institute) | has Lessons                    |
| `Lesson`     | `packages/shared/src/types.ts` | `packages/curriculum` | SQLite                | belongs to Course, has Content |
| `Enrollment` | TBD                            | `packages/academy`    | SQLite                | User → Course                  |
| `Progress`   | TBD                            | `packages/academy`    | SQLite                | User → Lesson                  |
| `Assessment` | TBD                            | `packages/curriculum` | SQLite                | belongs to Lesson              |
| `Question`   | TBD                            | `packages/curriculum` | SQLite                | belongs to Assessment          |

### User Domain

| Entity           | Canonical Type                 | Owner              | Storage               | Relationships                 |
| ---------------- | ------------------------------ | ------------------ | --------------------- | ----------------------------- |
| `User`           | `packages/shared/src/types.ts` | `packages/shared`  | SQLite (ai-institute) | has Progress, has Enrollments |
| `Session`        | TBD                            | `packages/auth`    | SQLite                | belongs to User               |
| `StudentProfile` | TBD                            | `packages/academy` | SQLite                | belongs to User               |

### GitHub/Intelligence Domain

| Entity           | Canonical Type | Owner                   | Storage            | Relationships           |
| ---------------- | -------------- | ----------------------- | ------------------ | ----------------------- |
| `Repository`     | TBD            | `packages/github`       | SQLite (github-os) | has Analyses            |
| `Analysis`       | TBD            | `packages/github`       | SQLite             | belongs to Repository   |
| `Pattern`        | TBD            | `packages/github`       | SQLite             | many-to-many with Repos |
| `KnowledgeGraph` | TBD            | `packages/github`       | SQLite             | nodes + edges           |
| `IntelRun`       | TBD            | `packages/intelligence` | In-memory (BIN)    | has Events              |
| `Recommendation` | TBD            | `packages/intelligence` | In-memory          | belongs to Run          |

### IOC Domain

| Entity          | Canonical Type | Owner          | Storage      | Relationships      |
| --------------- | -------------- | -------------- | ------------ | ------------------ |
| `OKR`           | TBD            | `packages/ioc` | SQLite (ioc) | has KeyResults     |
| `KeyResult`     | TBD            | `packages/ioc` | SQLite       | belongs to OKR     |
| `Risk`          | TBD            | `packages/ioc` | SQLite       | has Mitigations    |
| `Action`        | TBD            | `packages/ioc` | SQLite       | linked to OKR/Risk |
| `ProductionKPI` | TBD            | `packages/ioc` | SQLite       | time-series        |
| `SystemHealth`  | TBD            | `packages/ioc` | SQLite       | per-system status  |

### Social Domain

| Entity          | Canonical Type | Owner             | Storage            | Relationships       |
| --------------- | -------------- | ----------------- | ------------------ | ------------------- |
| `Campaign`      | TBD            | `packages/social` | SQLite (social-os) | has Publications    |
| `Publication`   | TBD            | `packages/social` | SQLite             | belongs to Campaign |
| `CalendarEvent` | TBD            | `packages/social` | SQLite             | editorial calendar  |
| `Feedback`      | TBD            | `packages/social` | SQLite             | community feedback  |

### Governance Domain

| Entity     | Canonical Type | Owner                 | Storage                 | Relationships        |
| ---------- | -------------- | --------------------- | ----------------------- | -------------------- |
| `Policy`   | TBD            | `packages/governance` | File-based (docs/)      | references Standards |
| `Standard` | TBD            | `packages/governance` | File-based (standards/) | references ADRs      |
| `ADR`      | TBD            | `packages/governance` | File-based (docs/adr/)  | references Standards |
| `RFC`      | TBD            | `packages/governance` | File-based (rfcs/)      | implements ADRs      |

### Media Domain

| Entity        | Canonical Type | Owner                   | Storage     | Relationships    |
| ------------- | -------------- | ----------------------- | ----------- | ---------------- |
| `VisualSpec`  | TBD            | `packages/video-engine` | File-based  | from Lesson      |
| `Composition` | TBD            | `packages/video-engine` | File-based  | from VisualSpec  |
| `MediaAsset`  | TBD            | `packages/media`        | File system | from Composition |

---

## Storage Map

| Database              | Location                           | Entities                                                                             |
| --------------------- | ---------------------------------- | ------------------------------------------------------------------------------------ |
| SQLite (ai-institute) | `apps/ai-institute/data/bhavya.db` | Users, Sessions, Profiles, Courses, Lessons, KOs, Progress, Enrollments, Assessments |
| SQLite (github-os)    | `apps/github-os/data/`             | Repositories, Analyses, Patterns, KnowledgeGraph, Radar                              |
| SQLite (ioc)          | `apps/ioc/data/`                   | OKRs, Risks, Actions, KPIs, Events, Systems                                          |
| SQLite (social-os)    | `apps/social-os/data/`             | Campaigns, Publications, Calendar, Feedback                                          |
| In-memory             | bhavya-intelligence-network        | IntelRuns, Recommendations                                                           |
| File-based            | docs/, standards/, rfcs/           | Policies, Standards, ADRs, RFCs                                                      |

---

## Source of Truth

| Entity          | Canonical Source                                                          |
| --------------- | ------------------------------------------------------------------------- |
| KnowledgeObject | `packages/shared/src/types.ts` + `apps/ai-institute/src/lib/studio/`      |
| Course          | `packages/shared/src/types.ts` + `apps/ai-institute/src/lib/academy-*.ts` |
| Lesson          | `packages/shared/src/types.ts` + `apps/ai-institute/src/lib/studio/`      |
| User            | `packages/shared/src/types.ts` + `apps/ai-institute/src/lib/db.ts`        |
| Repository      | `apps/github-os/src/lib/db.ts`                                            |
| OKR             | `apps/ioc/src/lib/`                                                       |
| Campaign        | `apps/social-os/src/campaign/`                                            |
| Policy          | `docs/governance/`                                                        |
