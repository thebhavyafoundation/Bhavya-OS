# Phase 3 Roadmap — K-12 AI Curriculum

Scope: third phase of the AI-only K-12 curriculum build (Plan B lineage:
`docs/superpowers/plans/2026-09-26-foundation-v2-plan-b-curriculum.md`), after
Phase 0 (standards taxonomy + 86-module registry), Phase 1 (interactive
`/curriculum` timeline), and Phase 2 (lesson player + Turso progress sync).
Not to be confused with the Content OS phases in `docs/ai-institute/ROADMAP.md`.

## 1. Adaptive Learning Paths (rule-based)

Deterministic recommendations computed from existing data. No ML inference, no
invented metrics or scores.

**Data available today**

- 86-module registry: prerequisites, age bands (6-18, four bands), standards links
- Module completion + quiz answers synced to Turso (Phase 2 `module-progress`)

**Prerequisite work (Phase 3a)**

- Lesson-level completion + quiz score persistence. Quiz feedback today is
  per-question and local: scores are neither stored nor synced. This single gap
  blocks both adaptive paths (input signal) and the teacher dashboard (input data).

**Initial rule set (thresholds are human product decisions)**

1. Unlock: a module becomes eligible when all of its registry `prerequisites`
   are complete.
2. Band progression: learner stays in the current band until the band completion
   threshold (human input) is met.
3. Remediation: on a quiz score below threshold (human input), recommend the
   module's own lessons first, then prerequisite modules.
4. Next-up list: top uncompleted modules whose prerequisites are met, ordered by
   position within the learner's band.

## 2. Teacher Dashboard

**New data (migration required, `bhavya-data-model` review before build)**

- Classes/groups (roster), assignments (module/lesson sets to groups),
  assignment status per learner.

**Views**

- Class progress: aggregate the existing `module-progress` table; per-learner
  drill-down reuses the module timeline components.
- Assignment creation: pick modules by band and Phase 0 standards tags.
- Empty states first: no roster data exists at ship time.

**Constraints**

- Auth-gated under the existing student/auth stack; no new auth model.
- New routes register in `sitemap.ts` and `CANONICAL_ROUTE_MAP.md` (route-audit
  gate before ship).

## 3. Deferred Widgets — Build Order

Phase 2 deferred items, ordered data-layer first, then curriculum completeness,
then enrichment:

1. **Lesson-level completion + quiz scoring** (deferred in Phase 2) — foundation
   for sections 1 and 2 above.
2. **`tokenize-explorer`** — wire `TokenizerExplorer` from
   `packages/interactive-components` via workspace dependency
   `@bhavya/interactive-components` in `apps/ai-institute/package.json`. Do not
   fork the package. Targets Junior A "how AI reads" lessons.
3. **`attention-play`** — wire `AttentionSimulator` from the same package with
   the same pattern. Targets Core transformer lessons.
4. Backlog only (never referenced in lesson content until built):
   `block-coding`, `train-a-classifier`, `agent-flow`, `research-sandbox`,
   `system-architect`.

## 4. Sequencing and Gates

| Step | Content                                    | Exit                              |
| ---- | ------------------------------------------ | --------------------------------- |
| 3a   | Lesson completion + quiz score persistence | Gates + deployed-URL visual check |
| 3b   | Adaptive rule engine + next-up UI          | Gates + deployed-URL visual check |
| 3c   | Teacher dashboard MVP                      | Gates + deployed-URL visual check |
| 3d   | `tokenize-explorer` + `attention-play`     | Gates + deployed-URL visual check |

Each step: `pnpm typecheck` / `lint` / `test` scope-appropriate checks locally,
`pnpm antislop`, `pnpm tokens:check`, `pnpm drift:check`; CI verifies on the PR;
visual verification only on the deployed Cloudflare URL.

**Human input required before 3b:** band completion threshold, quiz remediation
threshold. **Before 3c:** class/assignment schema review.
