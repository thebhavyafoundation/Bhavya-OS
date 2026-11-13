# BFAOS V2 — T-101 Agent Registry Reconciliation (preparation)

**Status:** investigation and options only — **no registry authority changed, no file edited, no
generator run** · **Date:** 2026-11-13 · **Base:** `master` @ `98388ddb`
**Founder decision:** **D-07** (canonical agent registry) — *not* resolved here.

## 1. Purpose

The Phase 0 inventory found four competing descriptions of "the agents" and one stale generated file.
T-101 determines **which representation is actually consumed at runtime**, which is generated, which
merely describes roles, what depends on the generated structure, and whether changing authority would
break anything. It then prepares two options for D-07.

## 2. Representations found

| # | Representation | Size | Nature | Runtime consumers |
|---|---|---|---|---|
| 1 | `.ai/agents/registry.yaml` | 9 roles, each with `capabilities`, `loads`, `max_files` | **hand-authored source** | 3 (see §3) |
| 2 | `registry/agents.json` | 9 items (`id`, `name`, `role`, `file`) | **generated projection** | 1 (see §3) |
| 3 | `platform/agents/` | 8 role briefs, 0 TS files | documentation | none found |
| 4 | `platform/ai-runtime/` | 171 files, 0 TS files, no `package.json` | role/artefact definitions | none found |
| 5 | `skills-lock.json` (root) | ~130 entries | canonical **skills** list per `AGENTS.md:45` | `AGENTS.md` only |

The `registry/` directory as a whole holds **19 generated files** (`agents.json`, `apps.json`,
`capability-registry.json`, `components.json`, `core-manifest.json`, `documents.json`, `index.json`,
`knowledge-graph.json`, `mcp.json`, `models.json`, `packages.json`, `pages.json`, `prompts.json`,
`search-index.json`, `search.json`, `services.json`, `standards.json`, `workflows.json`).

## 3. Consumer and ownership map (verified)

| Consumer | File:line | What it reads | Authority implied |
|---|---|---|---|
| Registry generator | `scripts/generate-registry.js:134-137` | `.ai/agents/registry.yaml` — comment: *"Agents live in the canonical `.ai/agents/registry.yaml` (the legacy `.agents/*.agent.json` store was retired)."* | **`.ai/agents/registry.yaml` is the source** |
| Generator (output) | `scripts/generate-registry.js:151` + `:149` | writes `registry/agents.json` with `file: ".ai/agents/registry.yaml"` | generated projection of #1 |
| Generator (index) | `scripts/generate-registry.js:338` | `registry/index.json` → `agents: ".ai/agents/registry.yaml"` | #1 |
| CLI | `packages/runtime/cli/bhavya.mjs:103` | `.ai/agents/registry.yaml` (`readYAMLSimple`) | #1 |
| CLI | `packages/runtime/cli/bhavya.mjs:317` | `registry/agents.json` | #2 (read as generated output) |
| Orchestrator CLI | `packages/runtime/cli/orchestrator.mjs:18` | `.ai/agents/registry.yaml` | #1 |
| Scaffolding CLI | `packages/cli/src/commands/create.ts:85` | instructs: *"Register the role in `.ai/agents/registry.yaml`"* | #1 |
| Skill | `.opencode/skills/bhavya-ai-development/SKILL.md:41` | *"Defined in `.ai/agents/registry.yaml`"* | #1 |

**Conclusion (verified, not inferred): the authority question is already answered by the code.**
`.ai/agents/registry.yaml` is the canonical agent-role source; `registry/agents.json` is a generated
projection of it; `platform/agents/` and `platform/ai-runtime/` are **role briefs with no consumer**;
`registry/agents.json` and the other 18 files under `registry/` are generated artefacts.

## 4. The actual defect: silent drift, not ambiguity

| Observation | Evidence |
|---|---|
| The generator exists and is deterministic | `scripts/generate-registry.js` — byte-stable output, timestamp preserved unless content changes (ADR-012 pattern) |
| A drift check exists | `pnpm registry:check` → regenerates then `git diff --exit-code -- registry/` |
| **CI never runs it** | `git grep 'registry' -- .github/workflows/ci.yml` → no match |
| The projection is therefore stale | `registry/agents.json` `generated_at: 2026-09-17`, while the tracked skill inventory has changed since (20 tracked skills today) |

**So the problem is not "four registries compete"; it is that a correct single source has no automated
guard, so its generated output drifts without anyone noticing.**

## 5. A second, sharper finding: the canonical *skills* list is inverted

`AGENTS.md:45` states *"Skills (canonical list) → `skills-lock.json`"*, and §61 repeats it as a fixed
ICM invariant. Verified content of `skills-lock.json`:

- It lists **~130 third-party Google skills** (`agent-platform-*`, `bigquery-*`, `gke-*`, `iam-*`,
  `secops-*`, `vercel-*`, `google-ads-*`, …) — **none of which is installed in this repository**.
- It contains **none** of the 20 tracked `bhavya-*` skills that *are* installed.
- Format: `{ "version": 1, "skills": { "<name>": { "source", "sourceType", "skillPath", "computedHash" } } }`
  — a catalogue of *available upstream* skills with hashes, not an inventory of *installed* skills.

**Consequence:** a document that names `skills-lock.json` as the canonical skill inventory points an
agent at a catalogue of things it does not have. PR #60 already found the related §8 skill-count
claim to be false; the underlying pointer is the larger problem. This is a **constitutional-tier
document defect** (`AGENTS.md`) and therefore founder-owned.

## 6. Option A — `.ai/agents/registry.yaml` as authoritative, with generated output (recommended)

**Shape:** state the authority that the code already implements; keep `registry/` as a generated
projection; make the drift check part of CI; regenerate the stale projection.

| Aspect | Consequence |
|---|---|
| Runtime consumers | **None break** — the authority does not change, only its documentation |
| Generator | `scripts/generate-registry.js` keeps reading the same file; `registry:check` is added to CI |
| Stale artefacts | `registry/agents.json` and siblings are regenerated (a generated-file update, not a hand edit) |
| `AGENTS.md` | §8 "Skills (canonical list) → `skills-lock.json`" needs correction (constitutional → founder gate) |
| Risk | Low. Touches a workflow file (CI), the generated `registry/` files, and `AGENTS.md` |
| Residual | The distinction between *installed skills* and *available upstream skills* needs a second, honest inventory file |

## 7. Option B — explicit precedence among the existing representations, nothing retired

**Shape:** publish a precedence table (source → generated projection → role briefs → catalogues) and
leave every file where it is.

| Aspect | Consequence |
|---|---|
| Runtime consumers | None break |
| Drift | **Unchanged** — without a CI check the projection still drifts |
| `AGENTS.md` | still points at an inaccurate skills list unless separately corrected |
| Risk | Lowest |
| Residual | The ambiguity is documented but not fixed; every future agent must read the precedence table to know which file to trust |

## 8. Would changing authority break existing consumers?

**Verified: no**, under either option, because the authority is *already* `.ai/agents/registry.yaml`:

- `packages/runtime/cli/bhavya.mjs` reads both #1 and #2 — under Option A both keep their current roles;
  under Option B the same.
- `packages/runtime/cli/orchestrator.mjs` and `packages/cli/src/commands/create.ts` read #1 only.
- The generator reads #1 and writes #2 — unchanged.
- No consumer parses `platform/agents/` or `platform/ai-runtime/` at runtime, so neither option needs to
  touch them.

**The one consumer that *would* be affected** is any human or agent that treats
`registry/agents.json` as editable — which its own header forbids ("GENERATED ONLY. NEVER EDIT MANUALLY.
Run `pnpm registry:generate`").

## 9. Exact decision required (D-07 refinement)

| # | Question | Recommendation | Alternatives |
|---|---|---|---|
| **D-07.1** | Is `.ai/agents/registry.yaml` declared the canonical agent-role source in `AGENTS.md`? | **Yes** — it is already the de facto source in code, the generator and three consumers | Declare `registry/agents.json` canonical (would contradict the generator) |
| **D-07.2** | Should `pnpm registry:check` run in CI to prevent drift? | **Yes** — one workflow step; the check already exists | Accept manual drift checks |
| **D-07.3** | Should the stale `registry/` projection be regenerated? | **Yes** — generated-file update, no hand edit | Leave stale |
| **D-07.4** | What is the canonical record of **installed** skills, given that `skills-lock.json` lists uninstalled third-party skills? | Create/curate an installed-skills inventory, and correct `AGENTS.md` §8/§61 to describe `skills-lock.json` accurately as the *upstream catalogue* | Point §8 at the installed inventory; rename/repurpose `skills-lock.json` |
| **D-07.5** | Do `platform/agents/` and `platform/ai-runtime/` need an explicit "descriptive only" label? | **Yes** — a one-line note each, so no agent treats them as registries | Leave as-is (risk: an agent adopts them as authority) |

## 10. What was explicitly NOT done

- No registry was designated, changed, merged or regenerated.
- `AGENTS.md` was not edited (constitutional tier — founder gate).
- `scripts/generate-registry.js` was not modified and was not run.
- No `registry/` file was regenerated or deleted.
- No CI workflow was changed.
- No PR was created, updated, closed, rebased or retargeted.
- `platform/agents/` and `platform/ai-runtime/` were not modified.
