# 25 — Execution Roadmap (dependency-ordered)

Only safe, evidence-derived order. No large rewrites; no curriculum merge; no prod/auth changes without approval.

## Stream 0 — AUTHORITY (unblocks everything; docs + decisions only)

- 0.1 Resolve §24 items 2,4,5,6,7 (constitution home/numbering, SSOT, routes, L1 list, pillar wording). Files: `docs/constitution/*`, `_shared/factory-map.md`, `docs/architecture/*`. Verify: `pnpm antislop`, route audit clean. Rollback: git revert.
- 0.2 Declare binding metrics (§24.3) + memory/governance ownership (§24.11/12). Human approval required.

## Stream 1 — TRUTH (public integrity; before any launch claim)

- 1.1 Source-or-remove every numeric claim in `content/*.mdx`, brand README, `/impact`, `/mission` (§13 table). Add verification-state frontmatter per `07-CONTENT`. Verify: content-truth skill pass + `pnpm validate`.
- 1.2 KP-001 disposition (§24.8): complete artifacts or delist. Verify: files on disk match README table or README corrected.

## Stream 2 — DATA (unblocks migration)

- 2.1 Fix `packages/video-engine/.../academy.test.ts:7-8` app-import (move fixture to package or test via public API). Verify: `pnpm --filter @bhavya/video-engine test`, typecheck.
- 2.2 Unify persistence: one SQLite owner + migrate github-os/ioc/social-os DBs; adopt `packages/auth` in ai-institute or delete it. Human approval (auth change). Verify: single `better-sqlite3` owner, auth tests green.
- 2.3 Provenance schema for curriculum (source/original/version/author/date/transform) in `content-core` + future `packages/curriculum`. Verify: schema tests.

## Stream 3 — ARCHITECTURE (hygiene; parallelizable after Stream 0)

- 3.1 Tokens: rebuild `platform-ui` tokens from ai-institute forest globals; delete competing systems. Verify: token-sync check + UI verification skill + Playwright (remote).
- 3.2 Retire `packages/ui`, `packages/bdl`, `design-system` pkg dup, 3 orphan stubs; delete `apps/github-os.zip`; rename BIN to `@bhavya/*`. Verify: workspace build + `pnpm file-map:check`.
- 3.3 CI: fix `deploy.yml` branch → `master` (or declare `main`); document Vercel-vs-Cloudflare precedence. Verify: workflow dry-run / Actions evidence.

## Stream 4 — CURRICULUM MODEL (no content merge)

- 4.1 Land Source B under `content/lessons-source-b/` IF/WHEN supplied, with per-lesson records (§11). Verify: inventory file + provenance intact.
- 4.2 Mark `CURRICULUM_ARCHITECTURE.md` 8-level model superseded; keep 13-level `docs/master-curriculum/` canonical. Verify: cross-links updated.
- 4.3 Backfill L0/L2–L12 ONLY via KP pipeline with human content approval. Never synthesize institutional facts.

## Stream 5 — PRODUCT (stub → real, journey order)

Assessment-adaptivity → roadmap → labs (Socratic/hints) → projects-milestones → portfolio-autogen → mentor (ethics-gated) → certification (verifiable) → capstone → career. Each: spec (bhavya-spec) → TDD → platform-ui only → route audit → a11y → remote browser evidence. Auth changes need approval.

## Stream 6 — VERIFICATION → PRODUCTION GATE

Wire preview → Playwright → evidence → PR → master gate (per §20 target chain); post-deploy canary. Agents never operate Vercel without explicit authorization.

## Second-pass consistency notes (self-review, 2026-09-17)

Checked: no false canonical claims introduced; Source B never claimed present; no invented partners/numbers/people; KP-001 flagged not trusted; branch/SSOT/route conflicts recorded in all three places (00, 01, 24); `opencode.json` untouched; no files deleted/renamed; no servers/builds run. Residual risk: grep-based scans were sampled (PowerShell, no rg) — full `packages/` mock-scan + secret-scan re-run in CI recommended.
