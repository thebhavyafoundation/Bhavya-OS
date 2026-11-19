# BFAOS V2 — Release dependency assessment and proposed merge order

**Date:** 2026-11-15 · **Scope:** the ten open draft pull requests, #62 through #71.
Nothing in this document merges, closes, retargets or rebases anything. Every merge into `master`
triggers the existing Cloudflare production deploy, so every order below is a production decision.

---

## 1. Verified state of the three release candidates

| PR | Branch | Base | Head | Files | CI at assessment |
|---|---|---|---|---|---|
| #69 | `feat/bfaos-phase4-contracts` | master | `070f094` | 74 | all nine checks green, including the preview deploy |
| #70 | `feat/bfaos-phase4-test-harnesses` | **`feat/bfaos-phase4-contracts`** | `735f3c6` | 10 | all four checks green, including the preview deploy |
| #71 | `feat/bhavya-product-quality` | master | `0399fffc` | 43 | seven of nine green; the OpenNext build and preview bundle were re-triggered by the latest push |

## 2. Dependencies

```
master
 ├─ #62  feat/visual-learning-batch ──── 113 files, includes the CI font-flake repair
 ├─ #63  chore/workflow-least-privilege-pins ── 4 files, shares opennext-build-verify.yml with #62
 ├─ #64  fix/vercel-content-manifests ── 1 file, isolated
 ├─ #65  fix/vercel-output-directory ── 1 file, isolated
 ├─ #66  docs/bfaos-v2-phase0 ── 14 files ─┐
 │   └─ #67  docs/bfaos-v2-phase1-reconciliation ── 31 files ─┐  one docs chain, each a
 │       └─ #68  feat/bfaos-kernel-safety ── 45 files ───────┤  refinement of the same tree
 │           └─ #69  feat/bfaos-phase4-contracts ── 74 files ─┤
 │               └─ #70  feat/bhavya-phase4-test-harnesses ── 10 files (stacked, needs #69)
 └─ #71  feat/bhavya-product-quality ── 43 files, independent
```

**Hard dependency:** #70 cannot be merged before #69 — its base is #69's branch, not `master`.
**Soft dependency:** #67 after #66, #68 after #67, #69 after #68 — each rewrites the same
`docs/bfaos-v2/**` tree, so merging them out of order conflicts on every document.
**#71 depends on nothing** and nothing depends on it.

## 3. Measured file overlaps (GitHub API, at these heads)

| Pair | Shared files | Consequence |
|---|---|---|
| #66 ↔ #67 ↔ #68 ↔ #69 | all of `docs/bfaos-v2/**` | merge in chain order, or the documents conflict |
| #68 ↔ #69 | the docs tree plus `packages/kernel/**` and `pnpm-lock.yaml` | merge #68 before #69 |
| #69 ↔ #70 | none by file | stacked by branch, not by file |
| #69 ↔ #71 | `pnpm-lock.yaml` | separate importer entries; a trivial resolution |
| #68 ↔ #71 | `pnpm-lock.yaml` | as above |
| **#62 ↔ #71** | **`.github/workflows/opennext-preview.yml`** | **different hunks — no textual conflict**, but see §4 |
| #62 ↔ #63 | `.github/workflows/opennext-build-verify.yml` | both edit the same file; merge #62 first |

## 4. The finding that changes the order — #62 carries the CI font-flake repair

`scripts/build-with-retry.sh` exists **only on #62's branch** and is wired by #62 into all three
CI workflows (`ci.yml`, `opennext-build-verify.yml`, `opennext-preview.yml`). `master` has neither
the script nor a reference to it.

The script exists because `next/font/google` fetches the font CSS from `fonts.googleapis.com`
during the build and that request fails intermittently on the runner, throwing:

```
TypeError: Cannot read properties of null (reading '1')
```

That is not a theory. It is the exact error read from the failing job log of PR #71 at head
`37483f4f` (job id 132141696709, run 43499632179), and the same job passed unchanged on the next
push of the same source. PR #71's later failure at head `85f66456` had a different and *real* cause
(`react/no-children-prop` as an error in the skip-link specification), which is fixed in `d4fdb6ef`.

**Consequence:** #69, #70 and #71 are all based on `master` and therefore all exposed to the
intermittent font failure. Merging **#62 first** removes that failure mode from every later build.
That moves #62 from "last" in the Phase 4.2 proposal to "early" here.

## 5. Proposed merge order, with the reason for each position

| Order | PR | Why here | Risk if merged here | Rollback |
|---|---|---|---|---|
| 1 | **#62** | carries the CI font-flake repair that every later build needs; also the largest app change, so it gets its own review | app content release — needs its own visual verification | revert the merge commit; the CI repair is separable from the content |
| 2 | **#63** | pins the actions that #62's workflow uses; conflicts with #62 on one file, so it follows | CI only | revert |
| 3 | **#64**, **#65** | isolated single-file Vercel repairs; decide D-02 (merge or retire Vercel) first | low | revert |
| 4 | **#66 → #67 → #68 → #69** | one docs chain, then the kernel foundation, then the kernel contracts | #69 is the largest kernel change (74 files) but touches no application code | revert per PR |
| 5 | **#70** | stacked on #69; it must follow it | test-only, no runtime effect | revert |
| 6 | **#71** | independent app work; carries the founder-approved cache policy | **changes production caching and adds a public endpoint** — merge only after its preview deployment has been verified | revert; the cache policy reverts with it |

**#63 vs #62:** #63 pins the actions; #62 modifies the workflow that uses them. #62 first, then #63,
means #63's pins apply to the repaired workflow. Merging #63 first would pin actions that #62 later
edits — the pins survive, the edits survive, but the review is harder. #62 first is cleaner.

## 6. CI requirements before any merge

- Every job green on the exact head that is merged. A green run on an earlier head is not evidence.
- For #71: the preview deployment must be re-verified **after** the final push, and the build
  identity endpoint must report the expected commit before any header observation is trusted.
- For #69 and #70: the OpenNext build and the preview deploy must both be green — they are the
  two jobs that catch a broken Cloudflare bundle.

## 7. Production impact of each merge

| PR | Effect of merging |
|---|---|
| #62 | application content release and the CI font repair; triggers the production deploy |
| #63 | CI only; no runtime effect |
| #64, #65 | Vercel path only; no Cloudflare effect |
| #66, #67 | documentation only |
| #68, #69, #70 | kernel library only; **no application imports the kernel**, so the deployed bundle is unaffected |
| #71 | **changes the production cache policy** (`revalidate = 300`, bounded stale window), adds the skip link, the favicon declaration and the build-identity endpoint, and changes the ioc database bootstrap |

## 8. Remaining concerns carried into the release decision

| Concern | Where it is recorded |
|---|---|
| The shared preview worker is overwritten by every deployment, so a preview observation only describes the deployment that ran last | PR #71 body, "Remote verification"; the build-identity endpoint now answers it |
| The year-long shared-cache stale window Next.js defaults to | fixed in #71 (`expireTime`); the reasoning is in `apps/ai-institute/docs/cache-control-policy.md` |
| Nothing caches the response today, so the cache policy currently has no runtime effect | same document, measured against the deployed worker |
| The tracked development database carries applied migrations | `docs/bfaos-v2/execution/08-tracked-database-preservation.md` on #69 |
| D-08 and D-09 remain founder-owned | the Phase 0 decision register |
