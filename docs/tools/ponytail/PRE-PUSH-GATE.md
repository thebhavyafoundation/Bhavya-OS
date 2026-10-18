# Ponytail Pre-Push Review Gate

**Purpose:** A safe pre-push workflow so Ponytail is used before code is pushed to GitHub. It never merges, deploys, or invokes an interactive agent from inside a Git hook.

**Status:** Local-only deterministic gate. Does not replace GitHub CI or required checks.

---

## Design — two layers

| Layer                                   | What it is                                        | Who runs it         | When                               |
| --------------------------------------- | ------------------------------------------------- | ------------------- | ---------------------------------- |
| 1. OpenCode/Ponytail review layer       | `/ponytail-review staged` (or branch/full/ultra)  | The agent, manually | Before push                        |
| 2. Deterministic local validation layer | `scripts/pre-push-gate.mjs` via `.husky/pre-push` | Husky hook          | Automatically, on every `git push` |

The hook does **not** invoke an interactive agent. It runs deterministic checks only and verifies that a local review record exists and is valid.

## Existing hook framework

The repository already uses **Husky** (`husky` ^9.1.7, `prepare` script) with `.husky/pre-commit` and `.husky/commit-msg`. No new hook framework is added. The pre-push gate is `.husky/pre-push`, matching the existing single-command hook convention:

```
node scripts/pre-push-gate.mjs
```

## Normal workflow

Before every push, the agent:

1. Runs `/ponytail-review staged` for staged changes.
2. Runs `/ponytail-review branch` for branch-wide or risky changes.
3. Runs `/ponytail [full]` by default; `/ponytail ultra` for auth, RLS, B2, Turso, OpenNext, deployment, safeguarding, governance, migration, payment, or WebGL changes.
4. Writes a local review record at `.git/ponytail/reviews/<tree-id>.md`.
5. Runs `git push` — the `.husky/pre-push` hook executes `scripts/pre-push-gate.mjs`.

## Staged vs branch review

| Scope                       | Command                   | When                                           |
| --------------------------- | ------------------------- | ---------------------------------------------- |
| Staged changes only         | `/ponytail-review staged` | Every push (default)                           |
| Whole branch / risky change | `/ponytail-review branch` | Branch-wide, refactor, or cross-cutting change |

## Risk-sensitive ultra mode

Use `/ponytail ultra` (not full) when the change touches:

- Authentication (Supabase Auth flows, session handling, token validation)
- Supabase RLS (row-level security policies and tests)
- B2 signed URLs / Backblaze B2
- Turso access (database queries, connection handling, migrations)
- OpenNext production build
- Deployment workflows / CI (`deploy.yml`, `opennext-build-verify.yml`, `deploy-cloudflare.yml`)
- Safeguarding logic
- Governance and policy content
- Migrations
- Payment (Stripe, etc.)
- WebGL fallbacks

For these, the hook treats the push as security-sensitive and requires a valid ultra review record.

## Deterministic checks (run by the hook)

1. `pnpm wrapper:check` — Ponytail wrapper integrity (enabled, MIT, pinned SHA, no upstream dirs committed)
2. `pnpm platform:check` — platform contract (no R2, no paid config, B2 boundary, permanent files)
3. Secret scan — changed files scanned for real tokens/keys (policy text naming a rule is allowed)
4. Relevant typecheck / lint / test (`pnpm typecheck`, `pnpm lint`, `pnpm test`) — skipped only for documentation/skill-only changes with no application code; the skipped check is printed

## Review record

**Location:** `.git/ponytail/reviews/<tree-id>.md` (local-only, never committed to the repository).

**Format:**

```markdown
## Review mode

- value: ultra

## Reviewed tree

- value: <git tree id of the pushed changes>

## Changed paths

- value: <comma-separated list>

## Timestamp

- value: <ISO-8601>

## Ponytail upstream SHA

- value: 09c434ab73ca43761c5d8b0c5d341926c2fba710

## Bhavya wrapper version/pin

- value: bhavya-ponytail ENABLED, pinned 09c434ab73ca43761c5d8b0c5d341926c2fba710

## Commands run

- value: /ponytail ultra, pnpm wrapper:check, pnpm platform:check, secret scan, pnpm typecheck, pnpm lint, pnpm test

## Tests passed/failed

- value: passed

## Findings

- value: none

## Skipped checks

- value: none

## Risk notes

- value: none

## Final review status

- value: pass
```

**Validity requirements:**

- Matches the current staged tree / push range (tree id)
- Not older than the 24-hour review window
- Reports no unresolved blocking finding
- Required deterministic checks passed

A review record is valid only if all of the above hold. Otherwise the hook blocks the push.

## Emergency bypass

If a bypass is genuinely necessary, set:

```
BHAVYA_ALLOW_UNREVIEWED_PUSH=1
```

The hook prints:

```
WARNING: unreviewed push bypass enabled
```

Rules:

- The bypass is **never** the default.
- The bypass must **never** bypass GitHub branch protection or required CI.
- The bypass does **not** hide test failures — deterministic checks still run.
- Every bypass is logged by the hook.
- The bypass is documented here and in the final report.

## Limitations

- The hook provides deterministic validation only. It is **not** complete security and does **not** replace CI.
- It does **not** claim an AI review happened when only deterministic checks ran.
- The OpenCode/Ponytail review layer is manual; the hook cannot verify that a human or agent actually performed it beyond the review record's self-declared fields.
- Review records are local (`.git/`, never committed) and are lost if `.git` is reset or the clone is discarded.

## Local installation

The gate is already wired into the repository via `.husky/pre-push` and `scripts/pre-push-gate.mjs`. Husky is installed through the `prepare` script (`npx husky install` runs on `pnpm install`). No additional installation is required for contributors who have already run `pnpm install`.

## Uninstall / rollback

1. Delete `.husky/pre-push`.
2. Delete `scripts/pre-push-gate.mjs`.
3. Optionally delete `.git/ponytail/reviews/` (local review records only).
4. No application code or package dependency is affected.

## Interaction with GitHub CI

The gate runs locally before push. GitHub CI (`.github/workflows/ci.yml`) still runs on push and is the authoritative merge gate. The local gate does not skip, replace, or weaken any required CI check. Required checks must still pass on the latest PR commit before merging.

## Interaction with PR #51

PR #51 (`feat/bhavya-ponytail-wrapper-clean`) adds the Ponytail wrapper and audit records. This pre-push gate is a separate, complementary tooling change that validates the wrapper state (`pnpm wrapper:check`) before any push. It does not modify PR #51 and does not require changes to it.
