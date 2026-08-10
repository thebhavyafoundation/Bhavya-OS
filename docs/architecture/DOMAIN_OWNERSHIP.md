# DOMAIN OWNERSHIP

**Date:** 2026-08-10
**Status:** ACTIVE
**Owner:** Bhavya Foundation Architecture
**Last updated:** 2026-08-10
**Applies To:** All domains, packages, and routes

---

## Rule

Every domain has exactly ONE canonical owner. No duplicate ownership.

---

## Domain Registry

| Domain           | Canonical Package       | Canonical Types                           | Canonical UI Route       | Source of Truth                                      |
| ---------------- | ----------------------- | ----------------------------------------- | ------------------------ | ---------------------------------------------------- |
| Knowledge        | `packages/knowledge`    | `KnowledgeObject`, `KnowledgePackage`     | `/os/knowledge`          | `apps/ai-institute/src/lib/studio/`                  |
| Curriculum       | `packages/curriculum`   | `Lesson`, `Assessment`, `LearningOutcome` | `/os/studio`             | `apps/ai-institute/src/lib/studio/builders.ts`       |
| Academy          | `packages/academy`      | `Course`, `Enrollment`, `Progress`        | `/academy`               | `apps/ai-institute/src/lib/academy-*.ts`             |
| Research         | `packages/research`     | `ResearchProject`, `Evidence`             | `/research`              | `apps/ai-institute/src/data/`                        |
| Forest           | `packages/forest`       | `ForestSite`, `Planting`                  | `/missions/forest`       | `apps/ai-institute/src/data/`                        |
| Heritage         | `packages/heritage`     | `HeritageSite`, `Tradition`               | `/missions/heritage`     | `apps/ai-institute/src/data/`                        |
| Community        | `packages/community`    | `Volunteer`, `Event`                      | `/community`             | `apps/ai-institute/src/data/`                        |
| Intelligence     | `packages/intelligence` | `IntelRun`, `Recommendation`              | `/os/intelligence`       | `apps/bhavya-intelligence-network/src/lib/engine.ts` |
| GitHub           | `packages/github`       | `Repository`, `Analysis`, `Pattern`       | `/os/github`             | `apps/github-os/src/lib/db.ts`                       |
| Compliance (IOC) | `packages/ioc`          | `OKR`, `Risk`, `Action`                   | `/os/ioc`                | `apps/ioc/src/lib/`                                  |
| Social           | `packages/social`       | `Campaign`, `Publication`                 | `/os/social`             | `apps/social-os/src/campaign/`                       |
| Governance       | `packages/governance`   | `Policy`, `Standard`, `ADR`               | `/os/docs`               | `docs/` (root)                                       |
| Video            | `packages/video-engine` | `VisualSpec`, `Composition`               | `/os/studio` (video tab) | `packages/video-engine/`                             |
| Media            | `packages/media`        | `MediaAsset`                              | (internal)               | `packages/media/`                                    |
| Design System    | `packages/platform-ui`  | `Token`, `Component`                      | `/design-system`         | `packages/platform-ui/`                              |

---

## Package → Route Mapping

| Package                 | Consumed By Route    | Authorization    |
| ----------------------- | -------------------- | ---------------- |
| `packages/knowledge`    | `/os/knowledge`      | Admin/Instructor |
| `packages/curriculum`   | `/os/studio`         | Admin/Instructor |
| `packages/academy`      | `/academy/*`         | Student/Admin    |
| `packages/research`     | `/research`          | Public           |
| `packages/forest`       | `/missions/forest`   | Public           |
| `packages/heritage`     | `/missions/heritage` | Public           |
| `packages/community`    | `/community`         | Public           |
| `packages/intelligence` | `/os/intelligence`   | Admin            |
| `packages/github`       | `/os/github`         | Admin            |
| `packages/ioc`          | `/os/ioc`            | Admin            |
| `packages/social`       | `/os/social`         | Admin            |
| `packages/governance`   | `/os/docs`           | Admin            |
| `packages/video-engine` | `/os/studio` (video) | Admin/Instructor |
| `packages/platform-ui`  | All routes           | Public           |

---

## Data Model Ownership

| Entity            | Owner Package           | Database               |
| ----------------- | ----------------------- | ---------------------- |
| `KnowledgeObject` | `packages/knowledge`    | SQLite (ai-institute)  |
| `Course`          | `packages/academy`      | SQLite (ai-institute)  |
| `Lesson`          | `packages/curriculum`   | SQLite (ai-institute)  |
| `Assessment`      | `packages/curriculum`   | SQLite (ai-institute)  |
| `User`            | `packages/shared`       | SQLite (ai-institute)  |
| `Progress`        | `packages/academy`      | SQLite (ai-institute)  |
| `Repository`      | `packages/github`       | SQLite (github-os)     |
| `OKR`             | `packages/ioc`          | SQLite (ioc)           |
| `Risk`            | `packages/ioc`          | SQLite (ioc)           |
| `Campaign`        | `packages/social`       | SQLite (social-os)     |
| `Publication`     | `packages/social`       | SQLite (social-os)     |
| `IntelRun`        | `packages/intelligence` | In-memory (BIN)        |
| `Policy`          | `packages/governance`   | File-based (docs/)     |
| `ADR`             | `packages/governance`   | File-based (docs/adr/) |
