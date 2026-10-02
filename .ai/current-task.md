---
id: COORD-001
owner: Engineering
version: 0.10
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
2. **PR #9 (hero sunrise photo) — DONE:** rebuilt onto master, CI 4/4, squash-merged `e3cbe067`, deployed, live-verified 31/31 + screenshot + impeccable detect.
3. **PR #10 — DONE:** rebuilt onto master, CI 4/4, squash-merged `9371ae1`, Deploy #36, live-verified.
4. **PR #12 — DONE (craft floor):** dropped the eyebrow/kicker above the hero h1 + dead CSS; merged `e2f3a2c2`, Deploy #37, verify 31/31, HTML probe confirms class absent, impeccable detect unchanged (8 pre-existing, none in changed files). Kicker text may only return repositioned (below rule, not above display heading).
5. **Plan C** — Session C execution COMPLETE; Session A merged master in, pushed, opened PR #13. After a gitleaks false-positive allowlist (`.gitleaksignore` fingerprint entry + `// gitleaks:allow` at `certificate.ts:39`), CI 4/4 and squash-merged `d667918`; Deploy #38 success.
6. **UI/UX professional pass — DONE (parallel in-session agents):** two read-only audits (UIVerse interaction craft + Openverse hierarchy/imagery) then two implementation agents on disjoint file ownership; 34 files, +521/−406; landed as PR #16 `f65513e`, Deploy #41, live verify8 31/31.

### Session B

1. **PR #10** — immersive background-integrated hero: design floor, local gates, screenshot evidence (branch force-updated by Session A; fetch before any push).
2. **Plan B** (`docs/superpowers/plans/2026-09-26-foundation-v2-plan-b-curriculum.md`) — all 86 modules navigable, ages 6–15 content, claims registry update to "86 modules".

## File ownership (no cross-edits without a PR comment)

- **Session A:** `.github/workflows/**`, `.ai/current-task.md`, `src/lib/photos.ts` + `public/photography/**` manifests, Playwright verify harness, Plan C surfaces (migrations, certificate/gallery routes, studio upload), `scripts/sync-tokens.mjs`.
- **Session B:** `src/components/home/SplitHero.tsx`, home-hero CSS block in `globals.css`, homepage visual components, curriculum data/routes/content.
- **Merge order:** PR #11 first (done), PR #9 (done), then PR #10. Re-verify mergeability after each lands.

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

GitHub Actions outage (2026-09-26T18:25:33Z → 2026-09-29T21:21:59Z) is over: owner re-enabled Actions. All event types now work — proven 2026-09-30: `pull_request` synchronize (CI run #45 on PR #9), `push` to master (CI run #46 + Deploy run #35). Earlier missing runs were the disabled-window, not a repo setting.

## Status log

- 2026-09-30 02:55 IST — Actions re-enabled by owner; CI verified alive on PR #11.
- 2026-09-30 02:55 IST — PR #11 opened: one-line regex fix in `scripts/sync-tokens.mjs` (CRLF header strip); root cause + byte-level verification in PR body.
- 2026-09-30 02:55 IST — Session C steering delivered: tokens:check fail = pre-existing bug; must NOT run `tokens:sync` or edit token files; other gates must be green.
- 2026-09-30 03:15 IST — PR #11 squash-merged `47d7b2d`; Deploy run #34 success.
- 2026-09-30 03:50 IST — PR #9 root cause fixed: branch diverged at PR #8 squash merge (conflict in SplitHero). Rebuilt branch as one commit on master (`a603832`, exactly 7 files, sync-tokens kept from master). CI run #45 4/4 green.
- 2026-09-30 03:56 IST — PR #9 squash-merged `e3cbe067`; CI run #46 + Deploy run #35 both success.
- 2026-09-30 03:59 IST — Live verified: verify8 31/31 (hero-img-sunrise passes), evidence screenshots regenerated, impeccable detect shows no new anti-patterns in changed files. Sunrise hero confirmed on deployed URL.
- 2026-09-30 04:00 IST — PR #10 rebuild: branch reset onto master carrying Session B's design files (globals.css, SplitHero.tsx) + this coord file; scripts/sync-tokens.mjs stays at master's fixed version. Session B: fetch before your next push.
- 2026-09-30 04:07 IST — PR #10 squash-merged `9371ae1`; Deploy run #36 success; live verify 29/31 (2 stale assertions for the intentional split→immersive design changes, not defects).
- 2026-09-30 04:20 IST — PR #12 (craft floor): removed `home-hero-eyebrow` kicker from SplitHero.tsx + dead CSS block; merged `e2f3a2c2`; Deploy run #37; verify8 updated for new design intent (gold accent, mobile spine `display:none`) → 31/31; HTML probe: kicker class absent, trust text only in meta descriptions; impeccable detect = 8 pre-existing, none in changed files.
- 2026-09-30 04:54 IST — Session C run 2 complete: 5 commits on `build/plan-c-cert-gallery` (`848c891`, `a65a30e`, `816ad8b`, `03d610a`, `7ce2063`), gates green (tsc, eslint 0 errors, vitest 237/237, antislop, diff-check, prettier), tree clean, no push (per brief). Deviations: `/certificates` substitutes blocked `/app/credentials` path; server-side QR (`qrcode` never client-bundled); Task 13 dropped.
- 2026-09-30 07:19 IST — Session A integration: merged `origin/master` (`e2f3a2c2`) into the branch as `d80305a` (both parents); conflicts resolved — globals.css hero region → master's immersive state (eyebrow block stays deleted), SplitHero.tsx + this file → master's side, Session C gallery/cert CSS preserved. Post-merge gates: tsc PASS, eslint PASS (25 files), vitest 237/237, antislop PASS, diff-check PASS.
- 2026-10-01 00:20 IST — PR #13 (Plan C) merged `d667918` after gitleaks FP allowlist; Deploy #38 success; live probe: `/`, `/certificates`, `/studio/gallery` 200; `/api/auth/login`, `/api/gallery`, `/gallery`, `/verify/*` 500.
- 2026-10-01 00:20 IST — ROOT CAUSE (human gate): worker `bhavya-foundation` has ZERO secrets — `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN` never set, `isProduction()` false, better-sqlite3 loads in a Worker → every DB route 500s (pre-existing since the Workers cutover; login was already broken). Fix: `cd apps/ai-institute && npx wrangler secret put TURSO_DATABASE_URL && npx wrangler secret put TURSO_AUTH_TOKEN` (values = human). No Turso credentials exist on this machine or in any accessible API.
- 2026-10-01 00:20 IST — PR #14 squash was a three-way no-op: fix delta empty vs merge-base `e2f3a2c2`, so GitHub kept master's duplicate hero blocks (`d667918...d8601d6` compare = files 0); Deploy #39 shipped dups; verify8 29/31 (m-accent-reset 430px, m-accent-gold ivory).
- 2026-10-01 00:20 IST — PR #15 re-applied the 17-line hero-dup removal directly on master: merged `08d35ef`, Deploy #40, verify8 **31/31** restored.
- 2026-10-01 00:20 IST — Parallel-agent UI pass (2 audits → 2 implementation agents, disjoint ownership, this session only): nav keyboard parity + aria-current, dead ⌘K search removed, tokenized focus rings, `.btn` hover/active/disabled, card focus parity, one h1 per route + no level skips, display h1s → Playfair editorial-heading, eyebrows moved below h1, asymmetric heroes (about/research/get-involved/programs), 65ch measure, dead `accent-blue/yellow` utilities remapped, error/skeleton/empty states tokenized, transitions enumerated, reduced-motion kills transforms, hero clamp 6rem, quote scrim eased.
- 2026-10-01 00:20 IST — Bug found by vitest at month boundary: `knowledge-metrics.ts` bucketed "this month" by local time vs UTC evidence timestamps (fails 00:00–05:30 IST on the 1st); fixed to UTC bucketing (`97459f7`).
- 2026-10-01 00:20 IST — PR #16 merged `f65513e`; Deploy #41 success; live verify: verify8 **31/31**, one h1 per route, eyebrow gone + label below h1, focus ring = gold outline, `aria-current`/`role=menu`/`menuitem`/`aria-expanded` confirmed post-hydration, impeccable detect 9 findings all pre-existing (verified against master), no new console errors. `/certificates` is auth-gated (redirects to login) — h1-absence there is moot.

## Previous current task (preserved)

RUNTIME-014 — Runtime Daemon Phase 1 (`packages/runtime/daemon/watch.mjs`, `.ai/` auto-sync): paused. Completed items remain in `.ai/history/` and task contracts under `.ai/tasks/contracts/`.
