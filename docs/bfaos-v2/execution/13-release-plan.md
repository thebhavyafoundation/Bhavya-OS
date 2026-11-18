# BFAOS V2 — Proposed Release Sequence (founder decision; nothing merged)

**Date:** 2026-11-18 · **Status:** Proposed · **Rule:** every merge into `master` is a production deployment; none performed here

## 1. PR inventory (exact heads, all based on `origin/master @ 98388ddb`)

| PR | Branch | Head | Base | Files | CI (last known) | Verdict |
|---|---|---|---|---|---|---|
| #62 | `feat/visual-learning-batch` | 6d40870e | master | 113 | n/a (branch is the protected checkout) | Release candidate |
| #63 | `chore/workflow-least-privilege-pins` | 7dcf78b2 | master | 4 | n/a | Release candidate |
| #64 | Vercel repair | — | master | 1 | — | Isolated |
| #65 | Vercel repair | — | master | 1 | — | Isolated |
| #66 | `docs/bfaos-v2-phase0` | 196a96bf | master | 14 | green | Docs chain |
| #67 | `docs/bfaos-v2-phase1-reconciliation` | 2c359d13 | master | 31 | green | Docs chain |
| #68 | `feat/bfaos-kernel-safety` | 0a9183ac | master | 45 | green | Kernel foundation |
| #69 | `feat/bfaos-phase4-contracts` | b3010092 | master | 74 | all 9 green at 6f8ec07a | Kernel contracts |
| #70 | `feat/bfaos-phase4-test-harnesses` | 735f3c6c | **#69 branch** | 10 | 4/4 green | Harness migration |
| #71 | `feat/bhavya-product-quality` | 97e6b632 | master | 43 | build=FAIL (transient font flake); all others green | Product quality |

**Dependency note:** #70 was created by merging an **older** #69 state (ad50a57e) into its branch. #69 has since advanced to b3010092 (7 newer doc commits: 070f0947 → b3010092). So #70 must be merged **after** #69, and #70's branch will need to incorporate #69's newer commits before merging (rebase not permitted — PR author action after #69 merges).

## 2. Proposed merge order

| Order | PR | Why here | Risk if merged here | Rollback |
|---|---|---|---|---|
| 1 | **#62** | carries `scripts/build-with-retry.sh` + CI wiring (absent from master); the font-flake repair every later build needs | app content release; triggers prod deploy | revert merge commit |
| 2 | **#63** | pins actions #62's workflows use; overlaps #62 on `opennext-build-verify.yml` (different hunks, no conflict) | CI only | revert |
| 3 | **#64, #65** | isolated single-file Vercel repairs | Vercel only | revert |
| 4 | **#66 → #67 → #68 → #69** | one docs chain, then kernel foundation, then kernel contracts | #69 = largest kernel change but **no app imports the kernel** → deployed bundle unaffected | revert per PR |
| 5 | **#70** | stacked on #69; must follow it | test-only, no runtime effect | revert |
| 6 | **#71** | independent app work; carries founder-approved cache policy (R-15) | **changes production caching + adds public endpoint** — merge only after preview verified with build-identity | revert; cache reverts with it |

**#62 first is the material change to prior planning.** The font-flake repair lives only on #62's branch; master has neither the script nor any workflow reference. Every later build (#69, #70, #71) is exposed to the intermittent Google Fonts fetch until #62 merges. The failure is proven from logs: `TypeError: Cannot read properties of null (reading '1')`.

## 3. Required checks before each merge

- Every CI job green on the **exact head to be merged** (a green run on an earlier head is not evidence)
- #69: OpenNext build + preview deploy both green
- #70: all 4 checks green
- #71: test, lint-and-typecheck, secret-scan, Platform contract, Build preview bundle, OpenNext build, Deploy preview to Cloudflare green; `build` failure is the intermittent font flake (infrastructure, needs rerun or #62 merged first)
- For #71: preview deployment must serve `97e6b632` (or its merge ref) and `GET /api/build-identity` must return that commit with `Cache-Control: no-store`

## 4. Preview identity requirements

- Build identity endpoint (`GET /api/build-identity`) deployed on the preview
- Returns exact commit SHA, build timestamp, build identifier, `Cache-Control: no-store`
- Reported commit must correspond to the PR being reviewed (merge ref for `pull_request` events)
- If the endpoint returns 404 or a different commit, stop preview verification
- Shared preview worker is overwritten by each deployment — identity is only knowable when the endpoint is deployed

## 5. Production deployment impact

| PR | Effect of merging into master |
|---|---|
| #62 | Application content release + CI font repair; triggers production deploy via `deploy-cloudflare.yml` |
| #63 | CI only (permissions + pins); no runtime effect |
| #64, #65 | Vercel path only; no Cloudflare effect |
| #66, #67 | Documentation only |
| #68, #69, #70 | Kernel library only; **no application imports the kernel** → deployed bundle unaffected |
| #71 | Changes production cache policy (`revalidate=300`, `expireTime=900` → `s-maxage=300, swr=600`), adds skip link, favicon, build-identity endpoint, IOC bootstrap changes |

## 6. Rollback method

Every merge is a merge commit; rollback = revert the merge commit on master, then redeploy. Per-PR rollback listed above. #71's cache policy reverts with its merge commit.

## 7. Post-deployment smoke tests

- `curl` production root: `Cache-Control: s-maxage=300, stale-while-revalidate=600` (after #71)
- `curl /api/build-identity` on preview: returns expected commit, no-store (after #71 preview deploy)
- `curl /api/health`: `private, no-store` (private isolation)
- Kernel tests: 122/122 pass (unchanged — kernel not imported by app)
- ai-institute tests: 338/338 pass; ioc tests: 26/26 pass

## 8. Conditions that should stop the release

- Any CI job red on the exact head to be merged (except #71's transient font-flake `build`, which is infrastructure)
- `GET /api/build-identity` returns 404 or wrong commit on the preview being verified
- Founder has not approved D-08 / D-09 (kernel integration with Mission Control remains unwired — this is by design, not a blocker)
- `bhavya.db` modified, committed, or migrated (must remain preserved)

## 9. Boundaries honored

No production deployment, no master merge, no production DB access/writes, no schema migrations, no auth/learner-data changes, no credential/permission/billing changes, no paid services, no destructive git, no force push, no history rewrite, no broad cleanup, no `git clean -xdf`/`git reset --hard`/`pnpm clean`/`git add .`, no modifications to protected worktrees or `.opencode/`.
