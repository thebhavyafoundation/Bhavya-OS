# Bhavya OS — L0 Router

Point, don't copy. This file routes agents; it is not a second constitution.
Next hop: `CONTEXT.md` (L1) → domain hubs (L2) → skills (L3).

## 1. Precedence

1. `docs/constitution/00-VISION.md` — supreme; conflicts: **lower number wins** (00 §5.4).
2. Lower-numbered constitutional documents (`docs/constitution/01`–`09`).
3. This file (`AGENTS.md`) — routing only.
4. `CONTEXT.md` chain and domain hub `CONTEXT.md` files.
5. `docs/architecture/REPOSITORY_SOURCE_OF_TRUTH.md` + `docs/architecture/DOMAIN_OWNERSHIP.md`.
6. `contracts/<pkg>/CONTRACT.md`, `standards/`, `_shared/factory-map.md`, `_system/schema.md`.
7. Installed skills under `.opencode/skills/`.
8. Implementation (code) — never higher than the docs above.

**Separate legal/trust set:** `@bhavya/constitution` SDK loads `_archive/constitution-2026-09-05/` (legacy 15-doc set). Do not merge with or cross-cite `docs/constitution/`.

If two authorities conflict and this order does not resolve it: **stop → record → human gate.** Never silently rewrite either authority.

## 2. Where things live

| Need                          | Go to                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------ |
| Umbrella index                | `CONTEXT.md`                                                                   |
| Canonical app                 | `apps/ai-institute/` → `apps/ai-institute/CONTEXT.md`                          |
| Packages                      | `packages/` → `packages/CONTEXT.md`                                            |
| Docs / knowledge              | `docs/` → `docs/CONTEXT.md`                                                    |
| Agent status / tasks          | `.ai/` → `.ai/CONTEXT.md` (live: `.ai/current-task.md`)                        |
| RFCs / decisions              | `rfcs/` → `rfcs/CONTEXT.md`                                                    |
| Design contracts              | `specs/` (via `bhavya-reasons-canvas`)                                         |
| Architecture truth            | `docs/architecture/REPOSITORY_SOURCE_OF_TRUTH.md` (+ `CANONICAL_ROUTE_MAP.md`) |
| Domain ownership              | `docs/architecture/DOMAIN_OWNERSHIP.md`                                        |
| Factory pointers (never copy) | `_shared/factory-map.md`                                                       |
| Browser verification          | Playwright MCP (`opencode.json`) + running app — no `bhavya-qa` skill exists   |

Do not invent hubs or directories not present on disk.

## 3. Design gate

1. **Brand authority:** `docs/constitution/01-BRAND-CONSTITUTION.md` — palette, fonts, voice; on conflict with 05, **01 prevails** (00 §5.4).
2. **Mechanics:** `docs/constitution/05-DESIGN-SYSTEM.md` — token architecture, spacing, motion, a11y.
3. **Implementation SoT:** `packages/platform-ui/src/styles/tokens.css` + `packages/platform-ui/src/components/` (`--color-*` forest/ivory/gold, `--font-display` Playfair, `--font-sans` Inter).
4. **Skills:** `bhavya-design-system`, then `bhavya-ui-verification` after visual work.
5. **Gate:** `pnpm tokens:check`. No hardcoded colors/fonts; no new primitive when platform-ui already has one.

**OPEN (human):** exact hex/palette alignment among 01 vs 05 vs `tokens.css` is unresolved. Do not amend constitutional text or tokens to force agreement during routine work.

## 4. Skills

**Filesystem is authoritative:** `.opencode/skills/` — verified count **16**. Load with the `skill` tool.

Installed: `bhavya-architecture`, `bhavya-design-system`, `bhavya-content-truth`, `bhavya-data-model`, `bhavya-route-audit`, `bhavya-ui-verification`, `bhavya-security`, `bhavya-github-workflow`, `bhavya-production-verification`, `bhavya-ai-development`, `bhavya-spec`, `bhavya-reasons-canvas`, `bhavya-capability-research`, plus third-party design skills `impeccable` (pbakaus/impeccable), `apple-design` (emilkowalski/skills), `design-taste-frontend` (Leonxlnx/taste-skill). Third-party design guidance never outranks §1–§3 authorities (constitution, brand, tokens).

Precedence: project → personal (`~/.config/opencode/skills/`) → superpowers.

**Not installed** (never invoke or pretend): `bhavya-qa`, `bhavya-autoplan`, `bhavya-canary`, `bhavya-freeze`, `bhavya-investigate`, `bhavya-learn`, `bhavya-plan-review`, `bhavya-retro`, `bhavya-review`, `bhavya-security-audit`, `bhavya-ship`, `antislop*`, `icm-architect`, and design/gsap packs listed only in `config/skills/registry.json`. `pnpm antislop` is a command, not a skill.

Stale indexes (`config/skills/registry.json`, `docs/architecture/SKILL_*.md`, `TASK_SKILL_ROUTER.md`, `CAPABILITY_GRAPH.md`) are **non-authoritative** when they disagree with `.opencode/skills/`.

## 5. Verification order

inspect → identify authority → plan → implement → static review → `pnpm typecheck` → `pnpm lint` → `pnpm test` → `pnpm build` → applicable gates → `git diff --check` → `git status` → report with command evidence.

Only claim gates that exist in root `package.json`. Unverified “done” is not done.

**Commands (root `package.json`):**

- Verify: `pnpm typecheck` · `pnpm lint` · `pnpm test` · `pnpm build`
- Gates: `pnpm antislop` · `pnpm tokens:check` · `pnpm file-map:check` · `pnpm registry:check` · `pnpm drift:check` · `pnpm validate` · `pnpm format`
- Generate (never hand-edit outputs): `pnpm file-map` · `pnpm registry:generate` · `pnpm tokens:sync`

CI (`.github/workflows/ci.yml`, branch **`master`**): antislop + lint + typecheck, test, secret-scan, then build. `deploy.yml` targets **`main`** — push ≠ deploy (wiring mismatch is known; do not “fix” by deploying).

## 6. Master execution contract

One session, one task.

**Before code:** identify authority files. If two authorities conflict and precedence does not resolve it → **human gate**.

**After code:** run applicable verification gates; attach evidence.

Never:

- claim an installed skill, index, or ICM capability the filesystem does not show;
- edit constitutional documents (`docs/constitution/00`–`09`) without explicit authorization;
- hand-edit generated indexes where a declared generator exists (`registry/`, `FILE-MAP.md`, `bar/` outputs);
- modify auth stores or protected data without explicit authorization;
- commit, push, or deploy unless the task explicitly authorizes it.

Unverified “done” is not done.

## 7. Human gates

Require explicit human authorization for:

- constitutional amendments;
- brand / token authority changes (including resolving 01 vs 05 vs `tokens.css`);
- auth stores and protected data;
- commit, push, deploy, rollback;
- destructive deletion;
- architecture consolidation (runtimes, packages, type systems, registries).

Ordinary research, implementation, local verification, and task-authorized doc edits may proceed without extra checkpoints.

## 8. Explicit non-goals

Do **not**:

- create a new registry, runtime, routing layer, or executable ICM index;
- install missing skills to satisfy a stale index;
- silently resolve constitutional conflicts;
- delete runtime surfaces (`.ai/build/`, `packages/runtime/`, `platform/ai-runtime/`);
- consolidate packages or merge `@bhavya/shared` / `@bhavya/types`;
- change brand tokens;
- invent architecture because a document claims it should exist.

**ICM stays navigation:** L0 this file → L1 `CONTEXT.md` → L2 hubs → L3 skills → OpenSPDD/`specs/` workflow. No ICM runtime, database, or router.

## Architecture-change trigger

New/changed package, app, route, schema, API, cross-package dependency, shared primitive, or infra boundary → load `bhavya-architecture` · read constitutions 02 + 08 + `REPOSITORY_SOURCE_OF_TRUTH.md` + `DOMAIN_OWNERSHIP.md` · substantial design → `bhavya-reasons-canvas` into `specs/` · platform-wide evolution → RFC in `rfcs/`.
