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

### Evidence classification

```text
OBSERVED:
The build failed while next/font attempted an external Google Fonts operation.
Two runs of effectively identical code produced different results on the same
day; re-running the failing one succeeded. The failing job's only errors were
next/font errors. None of the differing files touch fonts, layout, or the build.

SUPPORTED INFERENCE:
The failure is consistent with a transient external dependency problem. The
timing, the isolation to the font-fetch step, and the successful re-run all
point that way. A throttled or momentarily unavailable font origin is one
explanation that fits.

NOT PROVEN:
The precise upstream rate-limit mechanism. Nothing in the logs contains
provider-side evidence. Per-IP throttling is a plausible hypothesis because
GitHub-hosted runners share egress addresses across concurrent jobs, but it is
an inference, not a confirmed diagnosis. Other transient causes (runner DNS,
egress proxy failure, brief origin unavailability) fit the same evidence.
Confirming it would require provider-side logs or a controlled reproduction.

HOW TO CONFIRM:
Re-run the same commit's build several times and observe whether failures
cluster with concurrent runner load. Treat repeated success as consistent with,
not as proof of, rate limiting.
```

## Why this matters

1. **CI is unreliable.** A green `build` is currently weak evidence. Two runs of
   near-identical code produced different results.
2. **Production deploys inherit the flake.** `deploy-cloudflare.yml` runs
   `pnpm build`. A transient font-fetch failure can fail a production deploy.
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

## Preconditions if Option A is chosen

Self-hosting must satisfy all of the following before merge:

1. **Verify the font licences.** Inter and Playfair Display must each be
   confirmed redistributable, with the licence text and version recorded under
   `docs/diagrams/licences/` alongside the existing Tabler/Simple Icons entries.
   Do not assume — confirm.
2. **Preserve the canonical typography tokens.** The resolved stacks in
   `packages/platform-ui/src/styles/tokens.css` (`--font-display`,
   `--font-sans`, `--font-mono`) must remain authoritative and unchanged in
   _value_. Only the delivery mechanism may change. Any change to the token
   values is a brand-authority change requiring its own human gate.
3. **Measure bundle and LCP impact.** Record font payload size and a LCP
   comparison before and after. Self-hosting changes when and how font bytes are
   fetched; this must not silently regress performance.
4. **Confirm no third-party request remains.** After switching to
   `next/font/local`, verify a production build emits no reference to
   `fonts.googleapis.com` or `fonts.gstatic.com`.
5. **Verify the deploy still works end to end**, including the OpenNext/Cloudflare
   build, since font loading interacts with the bundler.

## Rollback plan

If self-hosting is implemented and then causes a production regression:

1. **Fastest recovery:** revert the commit on `master` and push. Note this
   itself triggers a Cloudflare deploy — that is the intended rollback path.
2. **If the previous release is still healthy:** activate the prior Worker
   version in the Cloudflare dashboard. This avoids a rebuild and is the
   preferred production recovery.
3. **Verification after rollback:** re-run the `build` job and confirm a green
   result, then re-check the smoke tests in
   `docs/releases/PR-27-30-HUMAN-MERGE-RUNBOOK.md` §4.
4. **Do not** attempt to fix a font regression by editing tokens or CSS during
   an incident; roll back first, diagnose second.

## Interim guidance until resolved

- Treat a `build` failure mentioning `next/font` as a **suspected
  infrastructure problem**, not an established one. Re-run before
  investigating — but always read the log first. A `next/font` failure is not a
  licence to dismiss any build failure without inspecting it.
- Do not "fix" it by committing font binaries without an explicit human
  decision, per `AGENTS.md` §11 (brand/token authority changes).
- Do not suppress, retry-storm, or ignore build failures to obtain a green
  check.

## Explicit human decision gate

This change **must not** be implemented by an agent. It requires, in order:

1. A human decision that Option A is wanted at all.
2. Licence verification for both families (§Preconditions 1).
3. Approval of the token-preservation plan (§Preconditions 2).
4. Bundle and LCP measurements recorded (§Preconditions 3).
5. A separate PR, reviewed on its own merits, with a rollback plan attached.

## Reproduction

1. Push any branch with a `layout.tsx` using `next/font/google`.
2. Watch the `build` job.
3. Push a second branch immediately and watch its `build` job.
4. Expect intermittent `next/font` `TypeError: Cannot read properties of null`.
