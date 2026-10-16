# Bhavya Foundation — the umbrella

Propose it (`rfcs/`) → build it (`apps/` + `packages/`) → govern it
(`standards/` + `contracts/` + constitution SDK) → ship it (canonical app).

| Hub             | Form                           | Entry                               | Status is                                                                                      |
| --------------- | ------------------------------ | ----------------------------------- | ---------------------------------------------------------------------------------------------- |
| `apps/`         | umbrella                       | `apps/CONTEXT.md`                   | route exists in `apps/ai-institute/src/app/`                                                   |
| `packages/`     | record library                 | `packages/CONTEXT.md`               | `contracts/<pkg>/CONTRACT.md`                                                                  |
| `rfcs/`         | pipeline                       | `rfcs/CONTEXT.md`                   | `status:` frontmatter per RFC                                                                  |
| `docs/`, `.ai/` | knowledge bundle               | `docs/CONTEXT.md`, `.ai/CONTEXT.md` | files on disk                                                                                  |
| `registry/`     | catalog (generated)            | `registry/index.json`               | rebuilt by `pnpm registry:generate`                                                            |
| `bar/`          | architecture registry snapshot | `bar/index.json`                    | local tools under `bar/scripts/`; not a root script — authority vs `registry/` is open (human) |
| `specs/`        | design contracts               | `specs/`                            | REASONS Canvas lives here                                                                      |

Factory (stable): `_shared/factory-map.md`. Product (per run): RFCs, routes,
releases, curriculum runs. This file points — content lives in each hub.

---

## ICM Workflow Routing (Layer 1)

For repeatable, multi-step workflows with human review gates, use ICM stages:

| Task Type                    | ICM Stage           | Entry Point                           |
| ---------------------------- | ------------------- | ------------------------------------- |
| Understand problem, research | `01-discovery`      | `stages/01-discovery/CONTEXT.md`      |
| Write spec / REASONS Canvas  | `02-specification`  | `stages/02-specification/CONTEXT.md`  |
| Implement code changes       | `03-implementation` | `stages/03-implementation/CONTEXT.md` |
| Run gates, verify quality    | `04-verification`   | `stages/04-verification/CONTEXT.md`   |
| Deploy to production         | `05-deployment`     | `stages/05-deployment/CONTEXT.md`     |
| First-time machine setup     | `onboarding`        | `setup/questionnaire.md`              |

**Trigger keywords:** `discovery`, `spec`, `implement`, `verify`, `deploy`, `setup`, `status`

**Pipeline status:** Run `status` keyword or scan `stages/*/output/` for completion.

---

## Layer 3 Reference Collections (for stage Inputs tables)

| Collection        | Path                 | Contains                                                                         |
| ----------------- | -------------------- | -------------------------------------------------------------------------------- |
| Brand & Design    | `_config/`           | `brand-rules.md`, `design-tokens.md`, `build-conventions.md`                     |
| Shared Constants  | `shared/constants/`  | `design-tokens.ts`, `api-constants.ts`                                           |
| Shared Schemas    | `shared/schemas/`    | `stage-contract.schema.json`, `handoff.schema.json`                              |
| Bundled Skills    | `skills/`            | 16 skills (symlink to `.opencode/skills/`)                                       |
| Architecture Docs | `docs/architecture/` | `REPOSITORY_SOURCE_OF_TRUTH.md`, `DOMAIN_OWNERSHIP.md`, `CANONICAL_ROUTE_MAP.md` |
| Constitutions     | `docs/constitution/` | 00-VISION through 09-ROADMAP                                                     |
| RFCs              | `rfcs/`              | Architecture decision records                                                    |
| Specs             | `specs/`             | REASONS Canvas design contracts                                                  |
| Agent Memory      | `.ai/`               | Architecture, decisions, workflows, state                                        |
| Standards         | `standards/`         | Engineering standards                                                            |

---

## Stage Handoff Protocol (ICM Pattern 2)

```
Stage N produces:  stages/0N-name/output/[topic-slug]-[artifact].md
Stage N+1 reads:   ../0N-name/output/[topic-slug]-[artifact].md
```

Human can edit the output file before running the next stage. The next stage picks up the edited version.
