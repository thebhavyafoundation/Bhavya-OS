---
id: COORD-001
owner: Engineering
version: 0.7
status: active
canonical: .ai/runtime.json
---

# Current Task — Two-Session Coordination (Bhavya Foundation V2)

## Current Goal
Two agent sessions work this repository in parallel (same working copy). This file is the coordination contract: division of work, file ownership, quality bar, and reporting protocol. Session A (lead) aggregates all status and reports to the human.

## Sessions
- **Session A — Lead / Integration (opencode, mimo):** owns coordination, CI/CD pipeline, verification, and reporting to the human.
- **Session B — Feature (immersive-hero session):** owns homepage hero design and curriculum content execution.
- **Session C — Headless executor (spawned 2026-09-30 02:03, attach to desktop server):** executes Plan C in worktree `D:\Bhavya-OS-wt\plan-c` on branch `build/plan-c-cert-gallery`. Session `ses_f112084d6ffecDWhgmlfD1rjWL`, model `mimo-v2.6-flash-free`, cost 0. Log: temp `session-c-run.log`.

## Division of work

### Session A
1. CI/CD: Actions outage RESOLVED (see Status log); keep PRs green and land them in order.
2. Land **PR #9** (hero sunrise photo, head `dfe6add`) → deploy → live verification (verify8 + screenshots + impeccable detect).
3. **Plan C** — research held by Session A; execution delegated to Session C. Session A supervises, verifies, and integrates the PR.

### Session B
1. **PR #10** — immersive background-integrated hero: bring to design floor (Quality bar below), local gates, screenshot evidence.
2. **Plan B** (`docs/superpowers/plans/2026-09-26-foundation-v2-plan-b-curriculum.md`) — all 86 modules navigable, ages 6–15 content, claims registry update to "86 modules".

## File ownership (no cross-edits without a PR comment)
- **Session A:** `.github/workflows/**`, `.ai/current-task.md`, `src/lib/photos.ts` + `public/photography/**` manifests, Playwright verify harness, Plan C surfaces (migrations, certificate/gallery routes, studio upload), `scripts/sync-tokens.mjs`.
- **Session B:** `src/components/home/SplitHero.tsx`, home-hero CSS block in `globals.css`, homepage visual components, curriculum data/routes/content.
- **Merge order:** PR #11 first (trivial one-liner), then PR #9, then PR #10. Re-verify mergeability after each lands.

## Machine resource contract (human directive 2026-09-30 — applies to every session here)
Free models only (spawn with `opencode/mimo-v2.6-flash-free`, cost must stay 0); low-spec 8 GB machine — no parallel heavy jobs, one background computation at a time; **never delete any file outside the repository**; limited resources, always find a solution. Full text: global `~/.config/opencode/AGENTS.md` → "Machine Resource Contract".

## Quality bar (human mandate: modern, professional, aesthetic, always alive)
1. **Design tokens only** — forest/ivory/gold, Playfair/Inter; `pnpm tokens:check` clean. No hardcoded colors/fonts.
2. **Craft floor** — display type ≤ 6rem, tracking ≥ -0.04em, **no eyebrow/kicker labels above headings**, asymmetric composed layouts, zero template patterns.
3. **Alive** — one authored motion moment per view plus subtle hover/focus micro-interactions; every animation gated by `prefers-reduced-motion`; the static fallback must hold the composition on its own.
4. **Truth** — claims registry only, no invented numbers; photo provenance lives in `photo_manifest.json`, never rendered on the page.
5. **Evidence** — local gates green (tsc, eslint, vitest, tokens, antislop) **and** live-URL screenshots before anything is called done.

## Reporting protocol
- **Session B → Session A:** status comments on the relevant PR (gate outputs + live screenshot links), plus updating this file's Session B status when starting/finishing work.
- **Session A → human:** consolidated report after each cycle (what landed, evidence, what is next).

## Blocked — RESOLVED
GitHub Actions outage (2026-09-26T18:25:33Z → 2026-09-29T21:21:59Z) is over: owner re-enabled Actions; first run #36632769764 was created for PR #11 and all jobs passed/building. Note: `reopened` events did NOT trigger workflows — retrigger requires a branch push (synchronize).

## Status log
- 2026-09-30 02:55 IST — Actions re-enabled by owner; CI verified alive on PR #11 (test ✓ lint+typecheck ✓ secret-scan ✓ build running).
- 2026-09-30 02:55 IST — PR #11 opened: one-line regex fix in `scripts/sync-tokens.mjs` (CRLF header strip) unblocking `tokens:check` in fresh checkouts; root cause + byte-level verification in PR body.
- 2026-09-30 02:55 IST — Session C steering delivered: tokens:check fail = pre-existing bug; must NOT run `tokens:sync` or edit token files; other gates must be green.
- 2026-09-30 02:55 IST — PR #9/#10 close+reopen did not trigger CI; this push retriggers PR #9 via synchronize.

## Previous current task (preserved)
RUNTIME-014 — Runtime Daemon Phase 1 (`packages/runtime/daemon/watch.mjs`, `.ai/` auto-sync): paused. Completed items remain in `.ai/history/` and task contracts under `.ai/tasks/contracts/`.
