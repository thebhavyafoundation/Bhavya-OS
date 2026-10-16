# Stage 02: Specification

**Purpose:** Write REASONS Canvas design contract for the feature/change.
**Input:** Discovery report from stage 01.
**Output:** `output/[topic-slug]-reasons-canvas.md`

---

## Inputs

| Source         | File/Location                                           | Section/Scope                          | Why                       |
| -------------- | ------------------------------------------------------- | -------------------------------------- | ------------------------- |
| Previous stage | `../01-discovery/output/`                               | Full file (discovery report)           | Source material           |
| Canvas guide   | `../../_templates/reasons-canvas.md`                    | Full file                              | Template & rules          |
| Canvas example | `../../specs/examples/reasons-canvas-example.md`        | Full file                              | Reference implementation  |
| Canvas skill   | `../../skills/bhavya-reasons-canvas/SKILL.md`           | Core rules                             | Specification methodology |
| Spec skill     | `../../skills/bhavya-spec/SKILL.md`                     | Spec format                            | Standard spec format      |
| Architecture   | `../../docs/architecture/REPOSITORY_SOURCE_OF_TRUTH.md` | Canonical sources                      | What exists               |
| Architecture   | `../../docs/architecture/DOMAIN_OWNERSHIP.md`           | Domain registry                        | Ownership                 |
| Contracts      | `../../contracts/`                                      | Relevant CONTRACT.md                   | Package interfaces        |
| Standards      | `../../standards/`                                      | Relevant standards                     | Engineering norms         |
| Brand          | `../../_config/brand-rules.md`                          | Voice Rules, Color Palette, Typography | Design constraints        |
| Design         | `../../_config/design-tokens.md`                        | Color Tokens, Spacing, Typography      | Token references          |

---

## Process

1. **Read discovery report** — Understand problem, scope, constraints, risks
2. **Load canvas template** — Use `_templates/reasons-canvas.md` as structure
3. **Load canvas skill** — Follow `bhavya-reasons-canvas` methodology
4. **Fill R — Requirements** — Business context, scope (IN/OUT), success criteria, constraints table
5. **Fill E — Entities** — Mermaid class diagram, entity definitions table
6. **Fill A — Approach** — Strategy, trade-offs table, architecture impact
7. **Fill S — Structure** — File layout, dependencies table, TypeScript interfaces
8. **Fill O — Operations** — Numbered steps with responsibility, location, dependencies, input, output, error handling
9. **Fill N — Norms** — Code standards, design standards, Bhavya-specific norms
10. **Fill S — Safeguards** — Hard constraints, scope boundaries, quality boundaries, anti-slop check
11. **Run checkpoint** — Present canvas to human for review (see Checkpoints)
12. **Run audits** — Verify canvas quality (see Audits)
13. **Save to output/** — Write REASONS Canvas

---

## Outputs

| Artifact       | Location                                | Format                                           |
| -------------- | --------------------------------------- | ------------------------------------------------ |
| REASONS Canvas | `output/[topic-slug]-reasons-canvas.md` | Markdown with frontmatter (type: reasons-canvas) |

---

## Checkpoints

| After Step          | Agent Presents                                | Human Decides                                                                |
| ------------------- | --------------------------------------------- | ---------------------------------------------------------------------------- |
| 10 (canvas drafted) | Complete REASONS Canvas with all 7 dimensions | Approve as-is / Request changes to specific dimensions / Reject and redirect |

---

## Audits

| Check                        | Pass Condition                                                |
| ---------------------------- | ------------------------------------------------------------- |
| All 7 dimensions filled      | R, E, A, S, O, N, S all present with content                  |
| Requirements traceable       | Every constraint cites source (contract/standard/ADR/policy)  |
| Entities match discovery     | Entity definitions align with discovery report domains        |
| Approach has trade-offs      | At least 2 options considered per major decision              |
| Structure has interfaces     | TypeScript signatures for all new/modified interfaces         |
| Operations are sequential    | Execution order diagram shows dependencies                    |
| Safeguards are concrete      | Every safeguard has unambiguous verification method           |
| Anti-slop checklist complete | All 7 Tier 2 rules verified                                   |
| No placeholders              | No `{{PLACEHOLDERS}}` in canvas                               |
| Frontmatter valid            | type, status, owner, date, task-id, spec-ref, rfc-ref present |

---

## References (in `references/`)

- `reasons-canvas-guide.md` — Detailed filling guide
- `spec-standards.md` — Bhavya spec quality standards
