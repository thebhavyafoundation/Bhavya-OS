# Stage 01: Discovery

**Purpose:** Understand the problem, gather context, produce a discovery report.
**Input:** Issue, RFC, or feature request.
**Output:** `output/[topic-slug]-discovery-report.md`

---

## Inputs

| Source       | File/Location                                           | Section/Scope                | Why                    |
| ------------ | ------------------------------------------------------- | ---------------------------- | ---------------------- |
| Request      | User-provided issue/RFC                                 | Full content                 | Problem statement      |
| Architecture | `../../docs/architecture/REPOSITORY_SOURCE_OF_TRUTH.md` | Canonical sources table      | What exists, where     |
| Architecture | `../../docs/architecture/DOMAIN_OWNERSHIP.md`           | Domain registry              | Who owns what          |
| Architecture | `../../docs/architecture/CANONICAL_ROUTE_MAP.md`        | Route map                    | Route ownership        |
| Constitution | `../../docs/constitution/02-BHAVYA-OS-CONSTITUTION.md`  | Architecture principles      | Design constraints     |
| Constitution | `../../docs/constitution/08-ARCHITECTURE.md`            | System architecture          | Technical constraints  |
| RFCs         | `../../rfcs/`                                           | Relevant RFCs                | Prior decisions        |
| Specs        | `../../specs/`                                          | Related REASONS Canvas       | Existing designs       |
| Codebase     | `../../apps/ai-institute/src/`                          | Relevant routes/components   | Implementation context |
| Codebase     | `../../packages/`                                       | Relevant package CONTRACT.md | Package interfaces     |
| Skills       | `../../skills/bhavya-architecture/SKILL.md`             | Core rules                   | Architecture skill     |
| Skills       | `../../skills/bhavya-reasons-canvas/SKILL.md`           | Canvas workflow              | Specification skill    |

---

## Process

1. **Read the request** — Understand the problem, scope, and success criteria
2. **Scan architecture docs** — Identify canonical sources, domain ownership, route map
3. **Review constitutions** — Note technical/design constraints (02, 08, 01, 05)
4. **Check RFCs/specs** — Find related decisions or designs
5. **Explore codebase** — Locate relevant routes, components, packages
6. **Load architecture skills** — Internalize `bhavya-architecture` rules
7. **Synthesize discovery report** — Document findings, constraints, risks, recommendations
8. **Run audit** — Verify report completeness (see Audits)
9. **Save to output/** — Write discovery report for stage 02

---

## Outputs

| Artifact         | Location                                  | Format                        |
| ---------------- | ----------------------------------------- | ----------------------------- |
| Discovery report | `output/[topic-slug]-discovery-report.md` | Markdown with metadata header |

### Discovery Report Structure

```markdown
---
topic: [topic-slug]
stage: 01-discovery
date: [ISO timestamp]
request: [summary of input request]
---

## Problem Statement

[What problem are we solving?]

## Scope

**IN:** [items]
**OUT:** [items]

## Current State

[What exists today — canonical sources, packages, routes]

## Constraints

| Type       | Constraint | Source |
| ---------- | ---------- | ------ |
| Technical  | ...        | ...    |
| Design     | ...        | ...    |
| Governance | ...        | ...    |

## Risks

- [Risk 1]
- [Risk 2]

## Recommendations

- [Approach 1 with trade-offs]
- [Approach 2 with trade-offs]

## Next Steps

→ Stage 02: Specification (REASONS Canvas)
```

---

## Audits

| Check                        | Pass Condition                                                            |
| ---------------------------- | ------------------------------------------------------------------------- |
| Canonical sources identified | Report references REPOSITORY_SOURCE_OF_TRUTH.md for all domains mentioned |
| Domain ownership clear       | Each domain maps to one package per DOMAIN_OWNERSHIP.md                   |
| Routes mapped                | Affected routes listed with ownership per CANONICAL_ROUTE_MAP.md          |
| Constitutions cited          | At least 02 and 08 referenced; 01/05 if design involved                   |
| No fabricated data           | All claims traceable to existing files                                    |
| Placeholders resolved        | No `{{PLACEHOLDERS}}` in report                                           |

---

## References (in `references/`)

- `rfc-process.md` — How to read/write RFCs
- `codebase-map.md` — Key directories and their purposes
