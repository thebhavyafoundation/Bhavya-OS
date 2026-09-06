---
name: bhavya-data-model
description: Manage canonical data entities and prevent type duplication. Use when creating new types, database schemas, API contracts, or data models.
compatibility: opencode
---

# Bhavya Data Model Skill

## Purpose

Maintain canonical entity definitions and prevent type duplication across the monorepo.

## Canonical Type Location

All shared types live in `packages/shared/src/`.

Before creating any new type or interface:
1. Search `packages/shared/src/` for existing definitions
2. Search `packages/types/src/` for re-exports
3. Check `contracts/` for formal package contracts

## Potential Canonical Entities

These entities may exist or be needed. Check before creating:

| Entity | Purpose |
|--------|---------|
| Organization | Institutional entity |
| Person | People (volunteers, students, staff) |
| Role | User roles and permissions |
| Mission | Forest/heritage/knowledge missions |
| Program | Active programs |
| Project | Project tracking |
| Location | Geographic locations |
| Community | Community groups |
| School | Educational institutions |
| Volunteer | Volunteer records |
| Event | Events and activities |
| Activity | Activity logs |
| Partner | Partner organizations |
| Grant | Funding records |
| Proposal | Proposals and applications |
| ResearchProject | Research tracking |
| Dataset | Data collections |
| Document | Document management |
| KnowledgeItem | Knowledge base items |
| Course | Educational courses |
| Lesson | Course lessons |
| HeritageSite | Heritage locations |
| ForestSite | Forest locations |
| Species | Species tracking |
| Observation | Field observations |
| ImpactMetric | Impact measurements |
| Evidence | Evidence records |
| MediaAsset | Media files |
| Publication | Publications |
| Report | Reports |
| Policy | Policies |
| Meeting | Meeting records |
| Decision | Decision logs |
| Task | Task tracking |
| Workflow | Workflow definitions |
| AIJob | AI processing jobs |
| AuditEvent | Audit trail events |

## Rules

1. **Do not create an entity merely because a new page needs one.** Search existing types first.
2. **One entity → one canonical definition** in `packages/shared/`.
3. **Extend, don't duplicate.** If an existing type is close, extend it.
4. **Document entity relationships.** Use TypeScript interfaces with clear relationship markers.
5. **Keep entities focused.** One entity, one responsibility.
6. **Version breaking changes.** Use optional fields for backward compatibility.

## Type Creation Checklist

Before creating a new type:
- [ ] Searched `packages/shared/src/` for existing types
- [ ] Checked `contracts/` for formal definitions
- [ ] Verified no duplicate exists under a different name
- [ ] Defined relationships to existing entities
- [ ] Added to barrel exports in `packages/shared/src/index.ts`
- [ ] Updated relevant CONTRACT.md if applicable
