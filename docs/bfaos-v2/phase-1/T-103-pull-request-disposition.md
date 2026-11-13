# BFAOS V2 — T-103 Pull Request Disposition (read-only)

**Status:** disposition proposal only — **no PR was merged, closed, retargeted, rebased or updated** ·
**Date:** 2026-11-13 · **Base for comparison:** `master` @ `98388ddb`

## 1. Method

All open pull requests were enumerated through the GitHub API (`GET /pulls?state=open&per_page=100`) —
**21 open PRs**, two more than Phase 0 recorded (Phase 0's page size was 20). For each: head/base SHAs,
draft state, divergence from current `master` (`GET /compare/master...<head>`), changed file list,
check-run conclusions, combined status, and creation/update dates.

**Signal hygiene:** every one of the 21 carries `Vercel=failure`. That failure was proven in Phase 1-B to
be **pre-existing and unrelated** (it reproduces on `master` itself). It is therefore **not** used as a
disposition signal here.

## 2. Disposition matrix

| PR | State | Branch / head | Base | vs master | Files | CI | Disposition | Rationale |
|---|---|---|---|---|---|---|---|---|
| **#26** | ready | `feat/immersive-hero-background` @ `dd3d0b4d` | `master`@`3a3cbd2` | diverged, +3/−29 | 7 | 8 ✓ / 1 ✗ | **Rebase required** | Four design documents (`ASSET-SOURCING-PLAN`, `PERFORMANCE-BUDGETS`, `VISUAL-BLOCK-REGISTRY`, `MOTION-SYSTEM`) are **absent from master** — unrepresented value. Rebase, then re-verify the one failing check. |
| **#27** | ready | `fix/editorial-diagram-use-client` @ `26945e55` | `master`@`3a3cbd2` | diverged, +1/−29 | 1 | 5 ✓ | **Candidate for closure (superseded)** | Master already contains `"use client"` in `packages/platform-ui/src/components/editorial-diagram/EditorialDiagram.tsx` — the fix landed in another form. |
| **#29** | ready | `ci/deploy-single-path` @ `4b007cc2` | `master`@`3a3cbd2` | diverged, +1/−29 | 6 | 4 ✓ / 1 ✗ | **Rebase required — sequence after #63** | `.github/workflows/deploy.yml` **still exists in master** (the dormant Vercel path). This PR removes it and edits `AGENTS.md`, `_config/build-conventions.md`, `stages/05-deployment/CONTEXT.md`. It also edits `deploy.yml`, which PR #63 also edits → conflict; sequence #63 first. |
| **#31** | ready | `feat/diagram-design-pilot` @ `e5495d6a` | `master`@`3a3cbd2` | diverged, +4/−21 | 41 | 6 ✓ | **Rebase and re-scope; founder decision** | `.github/CODEOWNERS`, `.github/pull_request_template.md` and several skills are **already in master**; the diagram profile may be unique. Re-scope before review. |
| **#35** | ready | `diagnose/deploy-build-replica` @ `1dbb92c4` | `master`@`9bad280` | diverged, +2/−12 | 1 | 6 ✓ / 1 ✗ | **Candidate for closure (superseded)** | The OpenNext gate in master now runs the production build command directly. |
| **#37** | ready | `fix/opennext-libsql-bundle` @ `ed5601d8` | `master`@`9bad280` | diverged, +9/−12 | 6 | 6 ✓ / 1 ✗ | **Rebase required — high value** | Touches `apps/ai-institute/src/lib/sqlite.ts`, `packages/auth/src/db.ts`, `packages/database/src/async-adapter.ts`, `scripts/verify-opennext-bundle.mjs`, and adds `docs/releases/opennext-libsql-incident.md` (**absent from master**). Needs a careful conflict review against the current database layer. |
| **#42** | **draft** | `feat/curriculum-lesson-shell-clean` @ `c04fd47d` | `master`@`9bad280` | diverged, +4/−12 | 11 | 7 ✓ | **Keep and review — founder decision on ordering** | `components/editorial/LessonShell.tsx` and `FigureBlock.tsx` are **absent from master** (master has `components/curriculum/LessonShell.tsx` instead). Overlaps PR #62's curriculum work → sequencing decision required. |
| **#45** | ready | `fix/add-opennext-and-wrangler-config` @ `fd905a42` | `master`@`197f31e9` | diverged, +6/−9 | 2 | 4 ✓ / 1 ⏭ / 2 ✗ | **Candidate for closure (superseded)** | Master already has `apps/ai-institute/open-next.config.ts` (`defineCloudflareConfig({})`) and `apps/ai-institute/wrangler.json` — the same configuration under a different filename. |
| **#46** | ready | `investigate/opennext-install-deps` @ `9881eb5e` | `master`@`197f31e9` | diverged, +2/−9 | 4 | 7 ✓ / 1 ✗ | **Candidate for closure (superseded)** | Diagnostic workflow for an install-ordering issue now handled by `apps/ai-institute/scripts/materialise-conditional-exports.mjs` (**in master**). |
| **#48** | ready | `investigate/copy-phase-split` @ `3079412f` | **`investigate/opennext-install-deps`@`9881eb5e`** | diverged, +4/−9 | 3 | 2 ✓ / 1 ✗ | **Candidate for closure (superseded)** | Copy-phase diagnostic; **depends on #46**; the underlying fix is in master. |
| **#49** | ready | `workaround/pre-esbuild-conditional-exports` @ `56c687b8` | **`investigate/opennext-install-deps`@`9881eb5e`** | diverged, +8/−9 | 8 | 2 ✓ / 2 ✗ | **Candidate for closure (superseded)** | The workaround script **is in master**; **depends on #46**. |
| **#51** | ready | `feat/bhavya-ponytail-wrapper-clean` @ `22f3cf8f` | `master`@`197f31e9` | diverged, +2/−9 | 8 | 6 ✓ | **Candidate for closure (superseded)** | `.opencode/skills/bhavya-ponytail/SKILL.md` is **in master**, together with its licence/provenance set. |
| **#52** | ready | `feat/ponytail-pre-push-gate` @ `9ef10a58` | `master`@`197f31e9` | diverged, +2/−9 | 3 | 6 ✓ / 1 ✗ | **Candidate for closure (superseded)** | `.husky/pre-push` and `scripts/pre-push-gate.mjs` are **in master** and are actively enforcing pushes today. |
| **#53** | ready | `feat/ecc-integration` @ `ed6f38d5` | `master`@`197f31e9` | diverged, +2/−9 | 23 | 6 ✓ | **Founder decision required** | The PR body itself records an unresolved constitutional question (`AGENTS.md` §8 skill count) and it overlaps skills OpenCode already provides natively. Not a mechanical disposition. |
| **#60** | ready | `docs/icm-architect-install` @ `62c78c1f` | `master`@`5f61a802` | diverged, +1/−3 | 29 | 6 ✓ | **Rebase required — keep** | The `icm-architect` skill is **still not tracked** on the branch, and the PR's README/AGENTS.md corrections now interact with the T-101 finding that `skills-lock.json` lists uninstalled third-party skills. Rebase before review. |
| **#61** | ready | `chore/install-cloud-workflow-skill` @ `80b29b45` | `master`@`98388dd` | ahead 1 / behind 0 | 1 | 6 ✓ | **Keep and review** | Clean, single documentation file, CI green. |
| **#62** | **draft** | `feat/visual-learning-batch` @ `6d40870e` | `master`@`98388dd` | ahead 34 / behind 0 | 100 | 11 ✓ | **Keep and review — frozen educational workstream** | The acknowledged candidate; all checks green; subject-matter review remains mandatory (D-07 concerns the `AGENTS.md` skill count it touches). |
| **#63** | **draft** | `chore/workflow-least-privilege-pins` @ `7dcf78b2` | `master`@`98388dd` | ahead 1 / behind 0 | 4 | 7 ✓ | **Keep and review — hold releasable (D-01)** | The hold was raised because of a Vercel failure that Phase 1-B proved pre-existing and unrelated. The change reduces the production-deploy workflow's token scope. |
| **#64** | **draft** | `fix/vercel-content-manifests` @ `7be9114d` | `master`@`98388dd` | ahead 1 / behind 0 | 1 | 6 ✓ | **Founder decision (D-02)** | Correct and minimal, but the Vercel path still has a third defect. The canonical Cloudflare preview already replaces it. |
| **#65** | **draft** | `fix/vercel-output-directory` @ `a73c7995` | `master`@`98388dd` | ahead 1 / behind 0 | 1 | 6 ✓ | **Founder decision (D-02)** | Same as #64; its correctness is proven (the build reaches `Build Completed in /vercel/output`). |
| **#66** | **draft** | `docs/bfaos-v2-phase0` @ `196a96bf` | `master`@ `98388dd` | ahead 1 / behind 0 | 14 | 6 ✓ | **Keep and review** | The Phase 0 evidence set. |

## 3. Summary of the proposal

| Disposition | Count | PRs |
|---|---|---|
| Keep and review | 4 | #61, #62, #63, #66 |
| Rebase required | 5 | #26, #29, #31, #37, #60 |
| Candidate for closure (superseded) | 9 | #27, #35, #45, #46, #48, #49, #51, #52 (+ #31 partly) |
| Founder decision required | 3 | #42, #53, and #64/#65 jointly (D-02) |

**Highest-value rebases:** **#37** (database-layer fixes plus an unrepresented incident document) and
**#26** (four unrepresented design documents). **Highest-risk merge:** **#37** (it touches
`packages/auth/src/db.ts` and `packages/database/src/async-adapter.ts` — the database boundary).

## 4. Dependencies between PRs

| Dependent | Depends on | Note |
|---|---|---|
| #48 | **#46** (base is `investigate/opennext-install-deps` @ `9881eb5e` = #46's head) | both superseded |
| #49 | **#46** (same base) | both superseded |
| #29 ↔ #63 | both edit `.github/workflows/deploy.yml` | sequence #63 first, then rebase #29 |
| #42 ↔ #62 | both touch curriculum/lesson-shell surface | founder sequencing decision (PR #62 is frozen) |
| #45 ↔ #37 | both touch OpenNext/libsql configuration | #37 is the higher-value PR |

## 5. Production-deployment implications

- **Any merge into `master` triggers `deploy-cloudflare.yml`** (push→master, no path filter) → a full
  production rebuild and deploy. This applies to **every** PR in the table, including documentation-only
  ones (as observed with #66).
- **Application-bundle impact:** only **#62** materially changes application code (100 files). #37
  changes the database layer. #26, #60, #61, #66 are documentation. #29, #35, #45, #46, #48, #49, #63,
  #64, #65 change workflows or configuration.
- **Recommended merge discipline (founder):** merge in the order **#63 → #64/#65 (or retire them) →
  #61 → #66 → #26 → #60 → #37 → #42 → #62**, re-verifying CI and production after each merge, since
  every merge is a production event.

## 6. What was explicitly NOT done

No PR was merged, closed, reopened, retargeted, rebased, edited, labelled or reviewed. No comment was
posted on any PR. No branch was deleted or renamed. No `git` operation was performed against any PR
branch — the analysis used the GitHub API only. PR #66 was not modified.
