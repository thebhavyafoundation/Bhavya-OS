---
id: COORD-001
owner: Engineering
version: 0.6
status: active
canonical: .ai/runtime.json
---

# Current Task — Two-Session Coordination (Bhavya Foundation V2)

## Current Goal
Two agent sessions work this repository in parallel (same working copy). This file is the coordination contract: division of work, file ownership, quality bar, and reporting protocol. Session A (lead) aggregates all status and reports to the human.

## Sessions
- **Session A — Lead / Integration (opencode, mimo):** owns coordination, CI/CD pipeline, verification, and reporting to the human.
- **Session B — Feature (immersive-hero session):** owns homepage hero design and curriculum content execution.

## Division of work

### Session A
1. Unblock GitHub Actions (no workflow runs created since 2026-09-26T18:25:33Z — facts in Blocked below) and retrigger PR #9.
2. Land **PR #9** (hero sunrise photo, head `dfe6add`) → deploy → live verification (verify8 + screenshots + impeccable detect).
3. **Plan C** — certificate of completion + gallery upload (migrations 006/007, R2 binding, studio upload API, certificate rendering). Research already held by Session A.

### Session B
1. **PR #10** — immersive background-integrated hero: bring to design floor (Quality bar below), local gates, screenshot evidence.
2. **Plan B** (`docs/superpowers/plans/2026-09-26-foundation-v2-plan-b-curriculum.md`) — all 86 modules navigable, ages 6–15 content, claims registry update to "86 modules".

## File ownership (no cross-edits without a PR comment)
- **Session A:** `.github/workflows/**`, `.ai/current-task.md`, `src/lib/photos.ts` + `public/photography/**` manifests, Playwright verify harness, Plan C surfaces (migrations, certificate/gallery routes, studio upload).
- **Session B:** `src/components/home/SplitHero.tsx`, home-hero CSS block in `globals.css`, homepage visual components, curriculum data/routes/content.
- **Merge order:** PR #9 first, then PR #10 (both base `master`; no rebase expected — re-verify mergeability after #9 lands).

## Quality bar (human mandate: modern, professional, aesthetic, always alive)
1. **Design tokens only** — forest/ivory/gold, Playfair/Inter; `pnpm tokens:check` clean. No hardcoded colors/fonts.
2. **Craft floor** — display type ≤ 6rem, tracking ≥ -0.04em, **no eyebrow/kicker labels above headings**, asymmetric composed layouts, zero template patterns.
3. **Alive** — one authored motion moment per view plus subtle hover/focus micro-interactions; every animation gated by `prefers-reduced-motion`; the static fallback must hold the composition on its own.
4. **Truth** — claims registry only, no invented numbers; photo provenance lives in `photo_manifest.json`, never rendered on the page.
5. **Evidence** — local gates green (tsc, eslint, vitest, tokens, antislop) **and** live-URL screenshots before anything is called done.

## Reporting protocol
- **Session B → Session A:** status comments on the relevant PR (gate outputs + live screenshot links), plus updating this file's Session B status when starting/finishing work.
- **Session A → human:** consolidated report after each cycle (what landed, evidence, what is next).

## Blocked
GitHub Actions: no workflow runs created for any event since **2026-09-26T18:25:33Z**. Facts: all three workflows report `state=active`; GitHub status page operational with no incidents; workflow files unchanged since 2026-09-18; events do arrive (a Vercel check suite was created for head `dfe6add` at 2026-09-29T19:39:07Z) — but the Actions app itself starts nothing. Pending owner action: check repo **Settings → Actions → General** (and account-level **Settings → Actions**) for a disable/restriction set after 2026-09-26 18:25Z.

## Previous current task (preserved)
RUNTIME-014 — Runtime Daemon Phase 1 (`packages/runtime/daemon/watch.mjs`, `.ai/` auto-sync): paused. Completed items remain in `.ai/history/` and task contracts under `.ai/tasks/contracts/`.
