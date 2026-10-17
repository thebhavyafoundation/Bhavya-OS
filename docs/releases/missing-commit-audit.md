# Missing commit audit — master vs. last known-good deployment

Status: **audit only. Nothing was cherry-picked.**

## The gap

| | |
| --- | --- |
| Last deploy known to succeed | `3b715c7a` (2026-10-02, run `37025788141`) |
| Current `master` | `9bad2803841b60745d6a76f636c9f78bac9ef7e6` |
| Merge base | `e3cbe067` |
| Commits reachable from `3b715c7a` but not from `master` | **11** |

`3b715c7a` is **not an ancestor of `master`**. The two histories diverged and
`master` lost these commits. This is the most consequential finding of the
incident: production has been running a build that `master` cannot reproduce.

## The eleven commits

| Commit | Subject | Files | Category |
| --- | --- | --- | --- |
| `fa9aad09` | fix(database): load @libsql/client via its web entry in Workers (#19) | `apps/ai-institute/src/lib/sqlite.ts`, `packages/database/src/async-adapter.ts`, `packages/database/src/__tests__/async-adapter.test.ts` | **Turso/database** |
| `1e6a2995` | fix(database): route multi-statement exec through executeMultiple for Turso (#18) | `packages/database/src/async-adapter.ts`, `packages/database/package.json`, `packages/database/vitest.config.ts`, `packages/database/src/__tests__/async-adapter.test.ts` | **Turso/database** |
| `cd2e5c29` | Phase 2: K-12 AI Curriculum Lesson Player + Turso Sync (#20) | curriculum routes, progress API, `globals.css`, `apps/ai-institute/package.json` | Feature, Turso-touching |
| `3b715c7a` | branded asset pipeline for K-12 modules and lessons (#21) | lesson SVGs, `apps/ai-institute/package.json` | Feature/assets |
| `d6679188` | verifiable course certificates and studio photo gallery (Plan C) | certificate and gallery APIs, `.gitleaksignore`, `package.json` | Feature |
| `f65513e2` | UI/UX professional pass | many page components | Feature/UI |
| `d05f5a52` | measure follow-ups + coord v0.10 status record (#17) | pages, `.ai/current-task.md` | UI/docs |
| `08d35ef0` | remove duplicate legacy hero rules from master | `globals.css` | Cleanup |
| `d8601d60` | drop legacy duplicate hero rules left by master merge | `globals.css` | Cleanup |
| `e2f3a2c2` | remove kicker above hero heading (#12) | `globals.css`, `SplitHero.tsx` | UI |
| `9371ae11` | immersive background-integrated hero (#10) | `globals.css`, `SplitHero.tsx` | UI |

## Are the two database fixes already present?

**Functionally yes, as independent reimplementation — not as the original commits.**

| File | In `master`? | In PR #37 branch? |
| --- | --- | --- |
| `apps/ai-institute/src/lib/sqlite.ts` | exists, **without** the fix | has `@libsql/client/web` |
| `packages/database/src/async-adapter.ts` | exists, **without** the fix | has `/web` entry + `executeMultiple` fallback |
| `packages/auth/src/db.ts` | exists, **without** the fix | has `/web` entry (extra hardening, not in the original) |
| `packages/database/src/__tests__/async-adapter.test.ts` | **absent** | **absent** |
| `packages/database/vitest.config.ts` | **absent** | **absent** |

PR #37 restores both behaviours by hand: `/web` at all three require sites and
`executeMultiple` preferred with an `execute` fallback. It is **not** a cherry-pick;
the diffs differ, and the regression tests that shipped with the originals were
deliberately not restored because wiring vitest into `packages/database` would
change that package's `test` script.

## Is cherry-picking safe?

**No, and it should not be done.**

- `1e6a2995` touches `packages/database/package.json` and adds
  `vitest.config.ts` plus a vitest suite. `packages/database` currently runs
  `node --test src/__tests__/database.test.mjs`. Cherry-picking changes that
  package's test wiring, which feeds `turbo test` at the root. That is a
  test-infrastructure change riding inside a bug fix.
- `cd2e5c29` and `3b715c7a` both modify `apps/ai-institute/package.json` and
  overlap heavily with curriculum work already on `master`. High conflict risk.
- `f65513e2`, `d05f5a52`, `e2f3a2c2`, `9371ae11`, `08d35ef0`, `d8601d60` all
  modify `globals.css`, which `master` has since changed repeatedly. These are
  UI merges, not database fixes, and they are out of scope for this incident.

## Would restoring them reintroduce old deployment behaviour?

**Yes, for anything other than the two database fixes.**

`3b715c7a` predates the current Cloudflare/OpenNext configuration. Merging it
would drag `apps/ai-institute/package.json`, asset pipeline and layout back to an
October state and would very likely reintroduce the deployment behaviour that
caused the incident. The reason that commit deployed successfully is not that its
content is correct; it is that it predates the configuration drift.

The two database fixes are the exception. Both are narrow, both were verified
against live Turso at the time, and both are already present as behaviour in
PR #37. They carry no deployment configuration.

## Can the successful Worker be reproduced from a clean branch?

**Not from `master`, and not known to be reproducible at all.**

- `master` cannot reproduce it: the ancestry is disjoint.
- `3b715c7a` built successfully but predates the configuration that later broke,
  so redeploying it would be a rollback to an older application state, not a
  reproduction of the current application.
- The current application on `master` has never built successfully. There is no
  known-good commit for the present code.

This is the central risk: **there is no safe rollback target for the current
application.** The only deployable commit is an older, divergent application.

## Recommendation

1. Take the two database fixes from **PR #37**, which already contains them as
   clean, reviewable, reimplemented changes with no test-infrastructure churn.
   Do not cherry-pick the originals.
2. Restore `async-adapter.test.ts` as a **separate, later** change if the vitest
   wiring is wanted. It is valuable but it is not this incident.
3. Do **not** cherry-pick the other nine commits. They are UI and feature work on
   a divergent branch and carry a real risk of reintroducing old deployment
   configuration.
4. Record that production currently runs an application state that `master` cannot
   build or reproduce. That is a separate risk requiring a human decision.