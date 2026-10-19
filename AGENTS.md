# Bhavya OS — L0 Router (ICM-Aligned)

**Single entry point for all agents.** Embodies Interpretable Context Methodology (ICM) five-layer architecture while preserving Bhavya constitutional authority.

Next hop: `CONTEXT.md` (L1) → ICM stages (L2) / domain hubs (L2) → Layer 3 refs → Layer 4 artifacts.

---

## 1. Precedence (Constitutional Authority)

1. `docs/constitution/00-VISION.md` — supreme; conflicts: **lower number wins** (00 §5.4).
2. Lower-numbered constitutional documents (`docs/constitution/01`–`09`).
3. This file (`AGENTS.md`) — **L0 router + ICM workspace identity**.
4. `CONTEXT.md` chain and domain hub `CONTEXT.md` files.
5. `docs/architecture/REPOSITORY_SOURCE_OF_TRUTH.md` + `docs/architecture/DOMAIN_OWNERSHIP.md`.
6. `contracts/<pkg>/CONTRACT.md`, `standards/`, `_shared/factory-map.md`, `_system/schema.md`.
7. Installed skills under `.opencode/skills/`.
8. Implementation (code) — never higher than the docs above.

**Separate legal/trust set:** `@bhavya/constitution` SDK loads `_archive/constitution-2026-09-05/` (legacy 15-doc set). Do not merge with or cross-cite `docs/constitution/`.

If two authorities conflict and this order does not resolve it: **stop → record → human gate.** Never silently rewrite either authority.

---

## 2. ICM Five-Layer Architecture

This workspace follows ICM (Interpretable Context Methodology): folder structure as agent architecture.

```
Layer 0: AGENTS.md           → "Where am I?"              (always loaded)
Layer 1: CONTEXT.md          → "Where do I go?"            (read on entry)
Layer 2: stages/NN-name/     → "What do I do?"             (read per-task)
Layer 3: _config/, shared/   → "What rules apply?"         (loaded selectively)
Layer 4: stages/NN/output/   → "What am I working with?"   (loaded selectively)
```

**Layer 3 (factory):** Stable config — brand rules, design tokens, build conventions, bundled skills. Configured once, persists across runs.

**Layer 4 (product):** Working artifacts — stage outputs, user input, per-run data. Changes every run.

**Agents read down layers and stop when they have what they need.** No agent reads everything. Total context per stage: 2K–8K tokens.

---

## 3. ICM Conventions (Binding)

All workflows follow the 15 patterns from ICM `_core/CONVENTIONS.md`:

| #   | Pattern                       | Requirement                                                        |
| --- | ----------------------------- | ------------------------------------------------------------------ |
| 1   | **Stage contracts**           | Every stage `CONTEXT.md` has Inputs, Process, Outputs tables       |
| 2   | **Stage handoffs**            | `output/` folders connect stages; human can edit before next stage |
| 3   | **One-way references**        | If A references B, B never references A                            |
| 4   | **Selective section routing** | Inputs tables specify exact sections to load (not whole files)     |
| 5   | **Canonical sources**         | Every rule has one home; others point there                        |
| 6   | **CONTEXT.md = routing**      | Never contains content; only routing tables                        |
| 7   | **Tool prerequisites**        | In stage `references/` folders                                     |
| 8   | **Questionnaire design**      | Flat, all-at-once, system-level only (`setup/questionnaire.md`)    |
| 9   | **Bundled skills**            | Skills in `skills/` (junction to `.opencode/skills/`)              |
| 10  | **Specs as contracts**        | Define WHAT/WHEN, not HOW (`specs/` via `bhavya-reasons-canvas`)   |
| 11  | **Checkpoints**               | Creative stages pause for human steering                           |
| 12  | **Stage audits**              | Quality checklists before writing output                           |
| 13  | **Value validation**          | Agree on value types at checkpoints                                |
| 14  | **Docs over outputs**         | Reference docs authoritative; outputs are artifacts                |
| 15  | **Shared constants**          | Configurable values in `shared/constants/`                         |

---

## 4. Where Things Live (Routing Map)

| Need                        | Go To                                                              | Layer   |
| --------------------------- | ------------------------------------------------------------------ | ------- |
| **Workspace identity**      | `AGENTS.md`                                                        | 0       |
| **Task routing**            | `CONTEXT.md`                                                       | 1       |
| **Discovery workflow**      | `stages/01-discovery/CONTEXT.md`                                   | 2       |
| **Specification workflow**  | `stages/02-specification/CONTEXT.md`                               | 2       |
| **Implementation workflow** | `stages/03-implementation/CONTEXT.md`                              | 2       |
| **Verification workflow**   | `stages/04-verification/CONTEXT.md`                                | 2       |
| **Deployment workflow**     | `stages/05-deployment/CONTEXT.md`                                  | 2       |
| **Onboarding**              | `setup/questionnaire.md`                                           | 3       |
| **Brand & design rules**    | `_config/brand-rules.md`, `_config/design-tokens.md`               | 3       |
| **Build conventions**       | `_config/build-conventions.md`                                     | 3       |
| **Shared constants**        | `shared/constants/design-tokens.ts`, `api-constants.ts`            | 3       |
| **Shared schemas**          | `shared/schemas/stage-contract.schema.json`, `handoff.schema.json` | 3       |
| **Bundled skills**          | `skills/` (junction → `.opencode/skills/`)                         | 3       |
| **Canonical app**           | `apps/ai-institute/` → `apps/ai-institute/CONTEXT.md`              | 2 (hub) |
| **Packages**                | `packages/` → `packages/CONTEXT.md`                                | 2 (hub) |
| **Docs / knowledge**        | `docs/` → `docs/CONTEXT.md`, `.ai/` → `.ai/CONTEXT.md`             | 2 (hub) |
| **RFCs / decisions**        | `rfcs/` → `rfcs/CONTEXT.md`                                        | 2 (hub) |
| **Design contracts**        | `specs/` (via `bhavya-reasons-canvas`)                             | 3 (ref) |
| **Architecture truth**      | `docs/architecture/REPOSITORY_SOURCE_OF_TRUTH.md`                  | 3 (ref) |
| **Domain ownership**        | `docs/architecture/DOMAIN_OWNERSHIP.md`                            | 3 (ref) |
| **Factory pointers**        | `_shared/factory-map.md`                                           | 3 (ref) |

**Do not invent hubs or directories not present on disk.**

---

## 5. Task Routing (Layer 1 Entry)

Read `CONTEXT.md` for routing. Two routing modes coexist:

### ICM Workflow Routing (repeatable pipelines with human gates)

| Trigger     | Stage             | Entry Point                           |
| ----------- | ----------------- | ------------------------------------- |
| `discovery` | 01-discovery      | `stages/01-discovery/CONTEXT.md`      |
| `spec`      | 02-specification  | `stages/02-specification/CONTEXT.md`  |
| `implement` | 03-implementation | `stages/03-implementation/CONTEXT.md` |
| `verify`    | 04-verification   | `stages/04-verification/CONTEXT.md`   |
| `deploy`    | 05-deployment     | `stages/05-deployment/CONTEXT.md`     |
| `setup`     | onboarding        | `setup/questionnaire.md`              |
| `status`    | pipeline status   | scan `stages/*/output/`               |

### Hub Navigation (exploratory, reference)

| Need                 | Hub         | Entry                          |
| -------------------- | ----------- | ------------------------------ |
| Canonical app routes | `apps/`     | `apps/ai-institute/CONTEXT.md` |
| Package interfaces   | `packages/` | `packages/CONTEXT.md`          |
| Architecture docs    | `docs/`     | `docs/CONTEXT.md`              |
| Agent memory/state   | `.ai/`      | `.ai/CONTEXT.md`               |
| RFCs                 | `rfcs/`     | `rfcs/CONTEXT.md`              |

**Pipeline status:** Run `status` keyword or scan `stages/*/output/` for completion.

---

## 6. Stage Handoff Protocol (ICM Pattern 2)

```
Stage N produces:  stages/0N-name/output/[topic-slug]-[artifact].md
Stage N+1 reads:   ../0N-name/output/[topic-slug]-[artifact].md
```

Human can edit the output file before running the next stage. The next stage picks up the edited version.

---

## 7. Design Gate (Constitutional)

1. **Brand authority:** `docs/constitution/01-BRAND-CONSTITUTION.md` — palette, fonts, voice; on conflict with 05, **01 prevails** (00 §5.4).
2. **Mechanics:** `docs/constitution/05-DESIGN-SYSTEM.md` — token architecture, spacing, motion, a11y.
3. **Implementation SoT:** `packages/platform-ui/src/styles/tokens.css` + `packages/platform-ui/src/components/` (`--color-*` forest/ivory/gold, `--font-display` Playfair, `--font-sans` Inter).
4. **Skills:** `bhavya-design-system`, then `bhavya-ui-verification` after visual work.
5. **Gate:** `pnpm tokens:check`. No hardcoded colors/fonts; no new primitive when platform-ui already has one.

**OPEN (human):** exact hex/palette alignment among 01 vs 05 vs `tokens.css` is unresolved. Do not amend constitutional text or tokens to force agreement during routine work.

---

## 8. Skills

**Filesystem is authoritative:** `.opencode/skills/` — verified count **17**. Load with the `skill` tool.

Installed: `bhavya-architecture`, `bhavya-design-system`, `bhavya-content-truth`, `bhavya-data-model`, `bhavya-route-audit`, `bhavya-ui-verification`, `bhavya-security`, `bhavya-github-workflow`, `bhavya-production-verification`, `bhavya-ai-development`, `bhavya-spec`, `bhavya-reasons-canvas`, `bhavya-capability-research`, plus third-party design skills `impeccable` (pbakaus/impeccable), `apple-design` (emilkowalski/skills), `design-taste-frontend` (Leonxlnx/taste-skill). Third-party design guidance never outranks §1–§3 authorities (constitution, brand, tokens).

Precedence: project → personal (`~/.config/opencode/skills/`) → superpowers.

**Governed wrappers (present on disk, verify before use):** `bhavya-apple-design`, `bhavya-design-taste`, `bhavya-diagram-design`, `bhavya-impeccable`. Each wraps a third-party skill and must be read before that upstream skill loads.

**Third-party design skills** `impeccable` (pbakaus/impeccable), `apple-design` (emilkowalski/skills), and `design-taste-frontend` (Leonxlnx/taste-skill) are not vendored in `.opencode/skills/`; they are reachable through the governed wrappers above. Third-party design guidance never outranks §1–§3 authorities (constitution, brand, tokens).

**Not installed** (never invoke or pretend): `bhavya-qa`, `bhavya-autoplan`, `bhavya-canary`, `bhavya-freeze`, `bhavya-investigate`, `bhavya-learn`, `bhavya-plan-review`, `bhavya-retro`, `bhavya-review`, `bhavya-security-audit`, `bhavya-ship`, `antislop*`, `icm-architect`, and design/gsap packs listed only in `config/skills/registry.json`. `pnpm antislop` is a command, not a skill.

Stale indexes (`config/skills/registry.json`, `docs/architecture/SKILL_*.md`, `TASK_SKILL_ROUTER.md`, `CAPABILITY_GRAPH.md`) are **non-authoritative** when they disagree with `.opencode/skills/`.

---

## 9. Verification Order

inspect → identify authority → plan → implement → static review → `pnpm typecheck` → `pnpm lint` → `pnpm test` → `pnpm build` → applicable gates → `git diff --check` → `git status` → report with command evidence.

Only claim gates that exist in root `package.json`. Unverified "done" is not done.

**Commands (root `package.json`):**

- Verify: `pnpm typecheck` · `pnpm lint` · `pnpm test` · `pnpm build`
- Gates: `pnpm antislop` · `pnpm tokens:check` · `pnpm file-map:check` · `pnpm registry:check` · `pnpm drift:check` · `pnpm validate` · `pnpm format`
- Generate (never hand-edit outputs): `pnpm file-map` · `pnpm registry:generate` · `pnpm tokens:sync`

CI (`.github/workflows/ci.yml`, branch **`master`**): antislop + lint + typecheck, test, secret-scan, then build. `deploy.yml` targets **`main`** — push ≠ deploy (wiring mismatch is known; do not "fix" by deploying).

---

## 10. Master Execution Contract

One session, one task.

**Before code:** identify authority files. If two authorities conflict and precedence does not resolve it → **human gate**.

**After code:** run applicable verification gates; attach evidence.

Never:

- claim an installed skill, index, or ICM capability the filesystem does not show;
- edit constitutional documents (`docs/constitution/00`–`09`) without explicit authorization;
- hand-edit generated indexes where a declared generator exists (`registry/`, `FILE-MAP.md`, `bar/` outputs);
- modify auth stores or protected data without explicit authorization;
- commit, push, or deploy unless the task explicitly authorizes it.

Unverified "done" is not done.

---

## 11. Human Gates

Require explicit human authorization for:

- constitutional amendments;
- brand / token authority changes (including resolving 01 vs 05 vs `tokens.css`);
- auth stores and protected data;
- commit, push, deploy, rollback;
- destructive deletion;
- architecture consolidation (runtimes, packages, type systems, registries).

Ordinary research, implementation, local verification, and task-authorized doc edits may proceed without extra checkpoints.

---

## 12. Explicit Non-Goals

Do **not**:

- create a new registry, runtime, routing layer, or executable ICM **index**;
- install missing skills to satisfy a stale index;
- silently resolve constitutional conflicts;
- delete runtime surfaces (`.ai/build/`, `packages/runtime/`, `platform/ai-runtime/`);
- consolidate packages or merge `@bhavya/shared` / `@bhavya/types`;
- change brand tokens;
- invent architecture because a document claims it should exist.

**ICM workflow layer is permitted** for repeatable pipelines (RFC→Spec→Impl→Verify→Deploy). The `stages/` directories are **ICM stage contracts**, not a runtime/index. No ICM runtime, database, or router.

---

## 13. Architecture-Change Trigger

New/changed package, app, route, schema, API, cross-package dependency, shared primitive, or infra boundary → load `bhavya-architecture` · read constitutions 02 + 08 + `REPOSITORY_SOURCE_OF_TRUTH.md` + `DOMAIN_OWNERSHIP.md` · substantial design → `bhavya-reasons-canvas` into `specs/` · platform-wide evolution → RFC in `rfcs/`.

---

## 14. Machine Resource Contract (Human Directive, 2026-09-30 — Permanent)

1. **Free models only — no paid API calls.** Every session, subagent, and spawned `opencode run` uses free-tier models only (e.g. `opencode/mimo-v2.6-flash-free`). Never select or trigger paid models/providers; verify spawned runs report `cost: 0`.
2. **Limited resources — protect the machine.** ~8 GB RAM, low-spec CPU (i3-1215U, 7.7 GB). No parallel heavy jobs; keep one background computation at a time; watch RAM/CPU and stop stray processes; keep system responsive.
3. **Never delete any file outside the repository — no exceptions.** System-health authority covers managing spawned processes, memory/CPU discipline, in-repo cleanup (in-repo deletions follow Rule 12). Nothing outside repo is ever removed.
4. **Resources are limited, but there is always a solution.** Be resourceful: reuse, background, cache, smallest-change, remote verification. Never conclude "cannot" because of hardware — find the workable path.

---

## 15. Trigger Keywords

| Keyword     | Action                                                  |
| ----------- | ------------------------------------------------------- |
| `setup`     | Run onboarding questionnaire (`setup/questionnaire.md`) |
| `status`    | Show pipeline completion (scan `stages/*/output/`)      |
| `discovery` | Enter stage 01                                          |
| `spec`      | Enter stage 02                                          |
| `implement` | Enter stage 03                                          |
| `verify`    | Enter stage 04                                          |
| `deploy`    | Enter stage 05                                          |

---

## 16. Walk Test

An agent with no memory must be able to:

1. Read `AGENTS.md` → understand workspace identity, ICM layers, routing
2. Read `CONTEXT.md` → find the stage/hub for a given task
3. Read stage `CONTEXT.md` → understand Inputs, Process, Outputs
4. Load only referenced Layer 3/4 files (selective section routing)
5. Execute the process and write to `output/`
6. Report status by scanning `stages/*/output/`

---

## References

- ICM Paper: arXiv:2603.16021 (Van Clief & McDermott, 2026)
- ICM Repo: https://github.com/RinDig/Interpretable-Context-Methodology
- RFC-0014: ICM Adoption for Bhavya OS
- Canvas: `specs/icm-workspace-implementation-reasons-canvas.md`
