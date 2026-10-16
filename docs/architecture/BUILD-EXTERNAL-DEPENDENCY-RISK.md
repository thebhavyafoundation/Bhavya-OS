# Build External Dependency Risk — `next/font/google`

**Severity:** High (build reliability, production deploy risk)
**Status:** Open — requires a human decision
**Discovered:** 2026-10-16, during PR #31 CI
**Authority note:** this document is a **finding**, not a canonical change. It does not amend `PLATFORM-TRUTH.md` or any token authority. Resolving it is a human gate per `AGENTS.md` §11.

---

## The finding

`apps/ai-institute/src/app/layout.tsx` line 2:

```ts
import { Inter, Playfair_Display } from "next/font/google";
```

`next/font/google` **fetches font files from Google Fonts at build time**. Every
build of `apps/ai-institute` therefore makes a live network request to
`fonts.googleapis.com` / `fonts.gstatic.com`.

## Empirical evidence that this is flaky

Two CI runs of effectively identical code, minutes apart, on 2026-10-16:

| Branch                                   | Head       | Commit delta vs the other                                                                  | `build` result |
| ---------------------------------------- | ---------- | ------------------------------------------------------------------------------------------ | -------------- |
| `ci/platform-contract-enforcement` (#30) | `75a2b7a2` | base + 4 diagram files missing                                                             | **success**    |
| `feat/diagram-design-pilot` (#31)        | `3de1fdcc` | base + `bhavya-diagram-profile.json`, `test-profile.mjs`, 4 package scripts, `FILE-MAP.md` | **FAILURE**    |

The failure on #31 (job `117117556375`):

```
An error occurred in `next/font`.
TypeError: Cannot read properties of null (reading '1')
...
> Build failed because of webpack errors
```

The 4 files unique to #31 are a JSON document, a Node test script, four
`package.json` script entries and a generated Markdown index. **None of them
touch fonts, layout, or the build.** The build failure is therefore
attributable to the font fetch, not to the pilot's changes.

The likely mechanism is **per-IP rate limiting**. GitHub-hosted runners share
egress IP addresses across many concurrent jobs; two builds within minutes are
very likely to share an address, and Google Fonts rate-limits by address.

## Why this matters

1. **CI is unreliable.** A green `build` is currently weak evidence. Two runs of
   near-identical code produced different results.
2. **Production deploys inherit the flake.** `deploy-cloudflare.yml` runs
   `pnpm build`. A rate-limited font fetch can fail a production deploy.
3. **It contradicts the stated posture.** `PLATFORM-TRUTH.md` and the contract
   checker treat external runtime services and paid/API dependencies as
   hazards. A build that silently depends on a third-party CDN is the same class
   of problem, just at build time rather than runtime.
4. **It is self-contradictory with the diagram profile.** PR #31 introduces
   `content/diagrams/profile/bhavya-diagram-profile.json`, which explicitly
   forbids `fonts.googleapis.com` in exported diagrams because it would
   disclose a visitor IP to a third party. The application's own build depends
   on that same host.

## Options

| Option                                                      | Effect                                                                                   | Cost / risk                                                                                            |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **A. Self-host the fonts** (`next/font/local`)              | Removes the network dependency entirely; builds become deterministic and offline-capable | Requires committing font binaries. Touches the brand/token authority surface. **Human gate required.** |
| **B. Keep `next/font/google`, accept flakiness**            | No code change                                                                           | Build remains non-deterministic; production deploy can fail randomly                                   |
| **C. Add build retries around the font fetch**              | Masks the symptom                                                                        | Increases CI duration; does not remove the dependency                                                  |
| **D. Cache the font fetch in CI** (`~/.cache` or an action) | Reduces repeat fetches within a runner                                                   | Still requires egress on first run; partial mitigation only                                            |

**Recommendation: A**, because it is the only option that makes the build
deterministic. But it changes how brand fonts are delivered, which is a
constitutional-adjacent decision, so it must not be done unilaterally.

## Interim guidance until resolved

- Treat a `build` failure mentioning `next/font` as **infrastructure**, not as a
  regression in the change under test. Re-run before investigating.
- Do not "fix" it by committing font binaries without an explicit human
  decision, per `AGENTS.md` §11 (brand/token authority changes).

## Reproduction

1. Push any branch with a `layout.tsx` using `next/font/google`.
2. Watch the `build` job.
3. Push a second branch immediately and watch its `build` job.
4. Expect intermittent `next/font` `TypeError: Cannot read properties of null`.
