# Human Merge Runbook — PRs #27 → #30

**Date:** 2026-10-16
**Repository:** `thebhavyafoundation/Bhavya-OS`
**Integration branch:** `master` @ `3a3cbd22d17af124a837e9591c1bc0c8abb658c8`
**Prepared by:** agent. **This document authorises nothing.** Every merge, deploy and rollback below is a human action.

---

## ⚠️ PRODUCTION-TRIGGER WARNING — READ BEFORE ANY MERGE

Verified in `PRODUCTION-TRIGGER-VERIFICATION.md`:

> **On `master` today, every push to `master` deploys to Cloudflare production.**
> No path filters. No `workflow_dispatch`. No concurrency. No environment approval.
> `master` has **no branch protection and no rulesets**.

Consequences:

- **Merging #27, #28, #29 or #30 will each trigger a Cloudflare production deploy.**
- Nothing blocks an accidental direct push to `master`.
- CI is informative only; it is **not** a merge gate.

**Strongly recommended: merge #29 first.** It is the only change that adds path
filters and a deliberate `workflow_dispatch`, so it reduces the blast radius of
every subsequent merge. Note that merging #29 _itself_ still deploys once,
because it modifies `.github/workflows/deploy-cloudflare.yml`, which is inside
its own path filter.

---

## 1. Exact current state

| PR  | Base     | Base SHA        | Head branch                        | Head SHA                                   | Commits unique | CI                     |
| --- | -------- | --------------- | ---------------------------------- | ------------------------------------------ | -------------- | ---------------------- |
| #27 | `master` | `3a3cbd22d17af` | `fix/editorial-diagram-use-client` | `26945e556286ebc893dbdfd9edd11e0016ad0edb` | 1              | **GREEN** 5/5          |
| #28 | `master` | `3a3cbd22d17af` | `docs/platform-truth`              | `0fac5c52939654f805fd9eee4dcd499b9b8da45d` | 1              | **RED** — build failed |
| #29 | `master` | `3a3cbd22d17af` | `ci/deploy-single-path`            | `4b007cc201af`                             | 1              | **RED** — build failed |
| #30 | `master` | `3a3cbd22d17af` | `ci/platform-contract-enforcement` | `638bf0d149cf2767fd953aba0d6bd50ec3ee6c58` | 3              | **GREEN** 6/6          |

### Commit containment (verified, not from PR descriptions)

```
master 3a3cbd22
 ├── #27  26945e55  fix(platform-ui): mark EditorialDiagram as client component
 ├── #28  0fac5c52  docs(platform): add PLATFORM-TRUTH and require it in every skill
 ├── #29  4b007cc2  ci(deploy): make Cloudflare/OpenNext the single correct production path
 └── #30  638bf0d1  ci(platform): enforce the permanent operating contract in CI
              abd4803b  fix(platform-ui): mark EditorialDiagram as client component   <-- cherry-pick of 26945e55
              0fac5c52  docs(platform): ...                                          <-- identical SHA to #28
```

- **#30 contains #28 exactly** — identical commit `0fac5c52`.
- **#30 contains #27's fix as a cherry-pick** — `abd4803b` is a _different SHA_ from
  `26945e55`, but the resulting file content is byte-identical (verified with
  `git diff 26945e55 abd4803b -- <file>` producing no output).
- **#29 shares no files with #30** — verified with `Compare-Object`; no overlap.

### Required CI run IDs at current head

| PR  | Job                | Run ID         | Conclusion  |
| --- | ------------------ | -------------- | ----------- |
| #27 | build              | `117077892096` | success     |
| #27 | lint-and-typecheck | `117076905293` | success     |
| #27 | test               | `117076905220` | success     |
| #27 | secret-scan        | `117076904897` | success     |
| #28 | **build**          | `117079497161` | **failure** |
| #28 | lint-and-typecheck | `117078530540` | success     |
| #28 | test               | `117078531050` | success     |
| #28 | secret-scan        | `117078531030` | success     |
| #29 | **build**          | `117083943837` | **failure** |
| #29 | lint-and-typecheck | `117083099584` | success     |
| #29 | test               | `117083099618` | success     |
| #29 | secret-scan        | `117083099171` | success     |
| #30 | build              | `117096132672` | success     |
| #30 | Platform contract  | `117095318948` | success     |
| #30 | lint-and-typecheck | `117095318385` | success     |
| #30 | test               | `117095318799` | success     |
| #30 | secret-scan        | `117095318921` | success     |

### Why #28 and #29 fail

Both branch from `master`, which is red: `EditorialDiagram.tsx` uses
`useState` without a `"use client"` directive, and it is re-exported from the
`platform-ui` barrel that `apps/ioc/src/app/layout.tsx` imports. #30 differs
from #28 by the addition of that fix plus the enforcement commit, and #30's
build passes. The failure is inherited from `master`, not introduced by #28 or #29.

### Vercel status — do not read as a Bhavya failure

A `Vercel` **commit status** context is `failure` on these branches. It is an
optional preview-only surface (`PLATFORM-TRUTH.md`: Vercel is preview-only).
It does not affect the canonical Cloudflare/OpenNext build, which is green.
Do not make Vercel-specific changes that compromise Cloudflare.

---

## 2. Recommended strategy: **CONSOLIDATED DELIVERY** (#30 first)

### Why, based on the actual graph

1. **Only #27 and #30 are green.** #28 and #29 both have red builds and would
   each need a rebase onto a fixed `master` plus a full CI rerun before they
   could merge. Refreshing them is unavoidable in either strategy.
2. **#30 already contains #27 and #28.** Merging #30 delivers all three in one
   review, with one green CI run, instead of three separate merges each
   triggering a production deploy.
3. **Each merge to `master` is a production deploy** on current wiring. Three
   merges mean three deploys; one merge means one.
4. **#30 is the only PR that installs the `Platform contract` gate.** Merging it
   first means the remaining PRs are reviewed against an enforced policy.

### Trade-off accepted

The cost is a larger single review (3 commits, 29 files) and a coarser commit
history — the build fix and the platform-truth docs land together with the CI
enforcement. The mitigation is that the three concerns remain as **separate,
individually described commits**, so `git log` and blame still distinguish them.

**Trade-off rejected (separate history):** it requires refreshing #28 and #30
onto a moved `master`, re-running CI three times, and still leaves #28's content
duplicated in #30, guaranteeing a conflict when #30 merges last.

---

## 3. Step-by-step

### STEP 0 — Pre-flight (no merge)

```bash
git fetch origin
git log --oneline origin/master -1
# expect 3a3cbd22
```

Confirm on the PR pages that the head SHAs above are unchanged. If any head has
moved, re-read the CI table — the run IDs below apply only to the stated SHAs.

### STEP 1 — Merge #29 (deploy hardening). ⚠️ **PRODUCTION DEPLOY**

**Why first:** after this, only merges that genuinely change the app deploy.

| Field              | Value                                                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| PR                 | #29 `ci(deploy): make Cloudflare/OpenNext the single correct production path`                                                            |
| Head SHA to merge  | `4b007cc201af`                                                                                                                           |
| Expected red check | `build` — expected to fail **before** #27 lands                                                                                          |
| Master change      | removes `deploy.yml`; adds path filters, `workflow_dispatch`, concurrency to `deploy-cloudflare.yml`; fixes `pages.yml` trigger and docs |
| Production deploy  | **YES** — once                                                                                                                           |
| Rollback           | `git revert <merge-sha>` on `master`, then push                                                                                          |

**If you require a green build on every merge, skip this step and do STEP 2
first.** #29 then needs `git rebase origin/master` and a CI rerun afterwards.

### STEP 2 — Merge #30 (build fix + platform truth + enforcement). ⚠️ **PRODUCTION DEPLOY**

| Field                             | Value                                                                                                                                      |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| PR                                | #30 `ci(platform): enforce the permanent operating contract in CI`                                                                         |
| Head SHA to merge                 | `638bf0d149cf2767fd953aba0d6bd50ec3ee6c58`                                                                                                 |
| Checks that must be visible green | `build 117096132672`, `Platform contract 117095318948`, `lint-and-typecheck 117095318385`, `test 117095318799`, `secret-scan 117095318921` |
| Master change                     | 3 commits: build fix, PLATFORM-TRUTH + skill blocks, contract enforcement (CI job, CODEOWNERS, PR template, update procedure)              |
| Production deploy                 | **YES**                                                                                                                                    |
| Post-merge                        | `pnpm platform:check` equivalent is enforced by the new CI job from now on                                                                 |
| Rollback                          | `git revert -m 1 <merge-sha>` on `master`, then push                                                                                       |

**After this merge, `master` is green for the first time.**

### STEP 3 — Close superseded PRs

```bash
# #27 and #28 are fully contained in #30. Close as superseded.
gh pr close 27 --comment "Superseded by #30 — commit 26945e55 is included as abd4803b (identical file content). master builds green."
gh pr close 28 --comment "Superseded by #30 — commit 0fac5c52 is included identically."
```

Do **not** merge #27 or #28 afterwards; their content is already on `master`.

### STEP 4 — Refresh and merge #29 (if not done in STEP 1). ⚠️ **PRODUCTION DEPLOY**

```bash
git checkout ci/deploy-single-path
git rebase origin/master          # now includes #30's fix
git push --force-with-lease
```

Wait for a green `build`, then merge at the **new** head SHA. Record that SHA —
the runbook's `4b007cc201af` no longer applies after a rebase.

### STEP 5 — Refresh and merge #26 (UX-0 documentation)

```bash
git checkout feat/immersive-hero-background
git rebase origin/master
git push --force-with-lease
```

Documentation only; no production impact expected. **Note:** if STEP 1 landed
first, this triggers no deploy, because `docs/**` is outside #29's path filter.

---

## 4. Observing the Cloudflare deployment

After each ⚠️ merge, watch the deploy run:

```bash
gh run list --workflow deploy-cloudflare.yml --limit 3
gh run watch <run-id>
```

Confirm the run reaches `Build and Deploy to Cloudflare` → `Deploy to Cloudflare
Workers` and reports success.

Then verify the live Worker:

```bash
curl -sS -o /dev/null -w '%{http_code}\n' https://bhavya-foundation.thebhavyafoundation.workers.dev/
```

### Smoke tests

| Route                | Expect                                                |
| -------------------- | ----------------------------------------------------- |
| `/`                  | 200, hero and four pillars render                     |
| `/curriculum`        | 200, all 86 modules listed                            |
| `/curriculum/levels` | 200, band list renders                                |
| `/about`             | 200                                                   |
| `/os`                | 200                                                   |
| `/api/b2/status`     | 200 or a clean "not configured" body — must not throw |

Worker dashboard: <https://dashboard.cloudflare.com> → `bhavya-foundation`.

---

## 5. Stop conditions — halt and escalate

Stop immediately, do not continue merging, if any of these occur:

1. `build` fails on `master` after a merge.
2. The Cloudflare deploy run fails.
3. Any smoke test returns 5xx, or `/curriculum` stops listing 86 modules.
4. `/api/b2/status` throws rather than reporting configuration status.
5. `Platform contract` CI job fails on `master` — someone has weakened the
   contract or introduced prohibited configuration.
6. A merge produces a `Vercel` failure that is _newly accompanied_ by a
   Cloudflare failure. A Vercel-only failure is not a stop condition.

---

## 6. Rollback

All verified against the recorded SHAs.

| Situation                       | Command                                                                            | Effect                                                                |
| ------------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Revert a single PR merge        | `git revert -m 1 <merge-sha> && git push origin master`                            | ⚠️ **this itself triggers a deploy** that restores the previous code  |
| Restore previous Worker version | Cloudflare dashboard → `bhavya-foundation` → Versions → activate the prior version | No git history change; fastest production recovery                    |
| Revert #30 only                 | `git revert -m 1 <merge-sha-of-30>`                                                | Removes enforcement **and** the build fix; `master` becomes red again |
| Re-apply after incident         | `git revert <revert-sha> && git push origin master`                                | ⚠️ triggers a deploy                                                  |

**Preferred production recovery is Cloudflare version activation**, not a git
revert: it avoids a rebuild and a full CI cycle, and does not dirty history.

---

## 7. What becomes redundant

| After            | Redundant                                                                  |
| ---------------- | -------------------------------------------------------------------------- |
| #30 merged       | #27 (build fix), #28 (PLATFORM-TRUTH + skill blocks) — close, do not merge |
| #29 merged       | nothing; it is unique                                                      |
| #26 merged       | nothing                                                                    |
| Any of the above | The bare root `CODEOWNERS`, superseded by `.github/CODEOWNERS` in #30      |

---

## 8. Human-only actions

1. Merge #29 (or defer it) — **deploys production**.
2. Merge #30 — **deploys production**.
3. Close #27 and #28 as superseded.
4. Rebase and merge refreshed #29, #26.
5. **Configure branch protection on `master`** — require PR, require
   `Platform contract` + `build`, require one approval, block force-push. It is
   currently **wide open**.
6. **Consider a protected `Production` environment** so deploys require approval,
   matching the contract's "production actions require human approval".
7. Verify licences for `apple-design` and `design-taste-frontend`, or leave them
   `DISABLED_LICENSE_UNVERIFIED` permanently.
