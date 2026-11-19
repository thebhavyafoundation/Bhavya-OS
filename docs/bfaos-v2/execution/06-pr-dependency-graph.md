# BFAOS V2 — Release dependency graph and proposed sequence (#62 – #71)

**Date:** 2026-11-13 · **Branches compared against `origin/master` @ `98388ddb`** · **Files-changed measured via the GitHub API**. No PR is modified, retargeted, closed or merged by this document.

---

## 1. What exists, and where it is based

| PR | Branch | Base | Files | Kind | Overlap with the rest |
|---|---|---|---|---|---|
| #62 | `feat/visual-learning-batch` | master | 113 | app + content (visual learning) | touches `.github/workflows/opennext-build-verify.yml` → **overlaps #63** |
| #63 | `chore/workflow-least-privilege-pins` | master | 4 | CI permissions + action pins | sole overlap is the workflow file above |
| #64 | `fix/vercel-content-manifests` | master | 1 | Vercel | isolated |
| #65 | `fix/vercel-output-directory` | master | 1 | Vercel | isolated |
| #66 | `docs/bfaos-v2-phase0` | master | 14 | Phase 0 evidence docs | overlaps the docs chain (#67/#68/#69) |
| #67 | `docs/bfaos-v2-phase1-reconciliation` | master | 31 | Phase 1 docs | same docs tree |
| #68 | `feat/bfaos-kernel-safety` | master | 45 | kernel safety (replay/checkpoint/contract) | same docs tree + `packages/kernel/**` |
| #69 | `feat/bfaos-phase4-contracts` | master | 71 | kernel reliability + contracts | same docs tree + `packages/kernel/**` |
| #70 | `feat/bfaos-phase4-test-harnesses` | **`feat/bfaos-phase4-contracts`** | 10 | kernel harness migration | inside #69's tree by construction |
| #71 | `feat/bhavya-product-quality` | master | 15 | app product-quality + app tests | isolated (apps + app docs only) |

## 2. The stacks

```
master
 ├── #62 (visual-learning-batch)          ── independent; an app release
 ├── #63 (workflow least-privilege pins)   ── interacts with #62 only on one workflow file
 ├── #64 (vercel content manifests)        ── independent Vercel repair
 ├── #65 (vercel output directory)         ── independent Vercel repair
 ├── #66 (Phase 0 evidence docs)           ── docs chain
 │      └── #67 (Phase 1 reconciliation)   ── same docs chain, refinement layer
 │            └── #68 (kernel safety)      ── **kernel foundation**
 │                  └── #69 (Phase 4)      ── **kernel reliability + contracts**
 │                        └── #70 (test harnesses) ── **stacked; depends on #69 by construction**
 └── #71 (product quality)                 ── independent app release
```

The docs files are **not** duplicated on purpose: each branch adds its own execution log and ledger
content on top of the same tree, so they will merge cleanly in order and conflict only through
narrower common lines if merged out of order.

`pnpm-lock.yaml` is touched by #68 and #69 (kernel test dependencies) — merge #68 before #69 and
the lockfile collision resolves in order. #62 changes the CI workflow that #63 pins; if both land,
`opennext-build-verify.yml` will need the file re-serialized by whoever retargets it.

## 3. Independence and overlap summary (measured)

Pairwise overlaps detected (GitHub file lists):

| Pair | Shared files | Note |
|---|---|---|
| #62 ↔ #63 | `.github/workflows/opennext-build-verify.yml` | both edit the same workflow |
| #66 ↔ #67/#68/#69 | all of `docs/bfaos-v2/**` | the docs chain |
| #67 ↔ #68/#69 | `docs/bfaos-v2/phase-1/**` and `execution/**` | chain |
| #68 ↔ #69 | kernel sources + `vitest.config.ts` + `pnpm-lock.yaml` | dependency order |
| #70 ⊂ #69 | kernel tests | stacked, satisfies #69's harness requirement |
| #62/#71 | **none** | disjoint trees (app vs kernel/docs) |

No other overlaps exist. #63–#65, #62 and #71 are mergeable in isolation.

## 4. Which PRs would trigger production deployment if merged

Every merge into `master` triggers the existing `deploy-cloudflare.yml` workflow (on push to
`master`) — **all** of the PRs above, because they target `master`. #62 in particular is a large
app content change. This document does not authorise any merge.

## 5. Proposed release order (for the founder to approve)

1. **Docs chain first** — #66 → #67. They are evidence records; they establish the ledger everything else cites and their overlap is additive.
2. **Kernel foundation** — #68. Must be next: #69 is built on its contract modules and vitest configuration.
3. **Kernel reliability** — #69, then #70 (only after #69). #69's CI fixes must land before the stacked #70 is evaluated fairly.
4. **Product quality** — #71. Independent of the kernel chain; #71's preview verification is already green.
5. **Vercel** — #64 → #65. Decide D-02 (merge-or-retire Vercel) first; they repair a path that
   may cease to be the deployment path entirely.
6. **CI hygiene** — #63, only after #62's state is decided (they conflict on one workflow file).
7. **#62** — last: the largest blast radius, and its own visual-verification gate applies.

## 6. Grouping option (if the founder prefers fewer reviews)

Same order, grouped as three release candidates:

- **A — Evidence & governance**: #66 + #67
- **B — Kernel chain**: #68 + #69 + #70
- **C — Product**: #71 + #64 + #65
- **D — App release**: #62

Each group is reviewable as one concern. Re-merging within a group out of order is still
unsafe for B alone.

## 7. Rollback considerations

- Each branch is a separate draft PR; rollback per concern = revert that PR's merge commit.
- #64/#65 revert cleanly (single file each).
- #68–#70 are kernel-only with no application import path; rollback is behaviour-safe.
- #62 contains a broad content surface; rolling it back requires reviewing its own release notes first.
- Before any merge: confirm the preview worker (`bhavya-foundation-preview`) and production
  (`bhavya-foundation`) are healthy and the last verified deployment record (953f06bb for production) is known-good.

## 8. Production deployment trigger

Every merge into `master` fires the existing Cloudflare production deploy. There is no exemption
path, no staging promotion and no manual gate in the workflow for PRs targeting master. The only
safe merges are the ones the founder explicitly approves, and the only safe sequence is the one in §5.
