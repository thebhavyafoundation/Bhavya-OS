# BFAOS V2 — 07 Governance and Permissions

**Date:** 2026-11-13 · **Base:** `master` @ `98388ddb`

## 1. Authority hierarchy (verified in source)

From `_config/project-governance.md` — highest first:

1. `docs/constitution/00-VISION.md` (supreme; lower number wins)
2. `docs/constitution/01`–`09`
3. `AGENTS.md` (L0 router + ICM workspace identity)
4. `CONTEXT.md` chain and domain hub `CONTEXT.md` files
5. `docs/architecture/REPOSITORY_SOURCE_OF_TRUTH.md` + `docs/architecture/DOMAIN_OWNERSHIP.md`
6. `contracts/<pkg>/CONTRACT.md`, `standards/`, `_shared/factory-map.md`, `_system/schema.md`
7. Installed skills under `.opencode/skills/`
8. Implementation (code) — never higher than the docs above

**Separate legal/trust set:** `@bhavya/constitution` SDK loads `_archive/constitution-2026-09-05/`; it must
not be merged with or cross-cited to `docs/constitution/`.

**Conflict rule (verbatim intent):** if two authorities conflict and the order does not resolve it —
*stop → record → human gate*. Never silently rewrite either authority.

**Platform truth** (`docs/architecture/PLATFORM-TRUTH.md`, 15 lines) is the operational contract:
GitHub is canonical source and CI; Cloudflare/OpenNext is canonical deployment; B2 stores large
assets; Supabase provides authentication; Turso stores application data; SQLite supports local
development; Vercel is optional and preview-only; the i5/8 GB machine is an editor and control centre;
GitHub Actions performs approved heavy processing; **Cloudflare R2 is prohibited**; **paid APIs and
payment-method-requiring services are prohibited**; **production actions require human approval**.

## 2. Human gates already defined

`_config/project-governance.md` — requires explicit human authorisation for:

- constitutional amendments
- brand / token authority changes (including the unresolved 01 vs 05 vs `tokens.css` conflict)
- auth stores and protected data
- commit, push, deploy, rollback
- destructive deletion
- architecture consolidation (runtimes, packages, type systems, registries)

Ordinary research, implementation, local verification and task-authorised documentation edits proceed
without extra checkpoints.

## 3. Machine-enforced boundaries (verified in configuration)

| Boundary | Enforcement | Location |
|---|---|---|
| Read-only planning | `plan` agent: `edit`/`bash`/`task` = deny | `opencode.json:16-30` |
| Secret reads | deny `**/.env`, `**/*.env`, `**/.env.*`, `**/auth.json`, `**/mcp-auth.json`, `**/.git-credentials`, `**/.npmrc`, `**/credentials*`, `**/*.pem`, `**/*.key` | `D:\.config\opencode\opencode.jsonc` |
| Secret writes | deny `auth.json`, `mcp-auth.json`, `.git-credentials`, `.npmrc`, `opencode.db*` | same |
| Destructive commands | `ask` for `git push*`, `git reset --hard*`, `git clean*`, `git checkout -- *`, `git rm*`, `rm -rf*`, `Remove-Item*` | same |
| Out-of-tree writes | `external_directory: ask` | same |
| Push quality gate | `scripts/pre-push-gate.mjs`: wrapper + platform contract + secret scan + fresh review record (<24 h, mode/status/findings validated; **ultra mode required** for security-sensitive paths) | `.husky/pre-push` |
| Commit quality | commitlint conventional, ≤100-char body lines | `.husky/commit-msg` |
| Format/scope | lint-staged (eslint + prettier) | `.husky/pre-commit` |
| CI secrets | per-workflow `permissions:`; secret-scan + gitleaks jobs | `.github/workflows/ci.yml` |
| Production gate | OpenNext bundle must verify before the deploy job starts | `deploy-cloudflare.yml` (`needs: build`) |
| Role gating (app) | `requireMissionOperator` → admin/staff | `apps/ai-institute/src/app/os/mission/api/_auth.ts` |

**Assessment:** the repository has one of the stronger governance implementations of any open-source
project of this size — constitutional ordering, explicit human gates, machine-enforced read-only
planning, a push gate with ultra-review escalation, and a credential-holding deploy job isolated from
the build job.

## 4. Gaps identified

| # | Gap | Severity | Evidence |
|---|---|---|---|
| G1 | **Branch protection on `master` is unverifiable** with the available credential (HTTP 403) — required checks/review enforcement unknown on the branch that auto-deploys to production | High | REST `/branches/master/protection` → 403 |
| G2 | Three workflows (`deploy-cloudflare.yml`, `deploy.yml`, `opennext-build-verify.yml`) still declare **no `permissions:` block** — they inherit the repository default token scope | High | workflow files |
| G3 | `pages.yml` still publishes to GitHub Pages from a **long-lived feature branch** (`feat/immersive-hero-background`) | Medium | workflow trigger |
| G4 | Production deploy has **no `concurrency:` block** and **no `environment:` protection** — overlap and no GitHub-enforced approval | Medium | `deploy-cloudflare.yml` |
| G5 | `registry/agents.json` is a **stale generated artefact** (2026-09-17) presenting an outdated agent inventory | Medium | file header + `generated_at` |
| G6 | **Two audit stores** (`mc_decisions` and `audit-repository.ts`) with no declared authority | Medium | source |
| G7 | **Four agent registries** with no precedence rule | Medium | source |
| G8 | Supabase (the declared authentication provider) is **inactive on both projects**; the live path currently uses the Turso-backed `api-auth` session store, so the declared architecture and the running architecture disagree | High | Supabase MCP + source |
| G9 | `AGENTS.md` §8 skill-count claim was already found stale by PR #60 and is still unresolved — a constitutional document is out of date relative to the filesystem | Medium | PR #60 body |
| G10 | **15 stale pull requests** remain open, several based on pre-`master` SHAs — a live path for reverting newer work | Medium | GitHub PR list |

## 5. Separation of duties for BFAOS

| Role | May | May not |
|---|---|---|
| Executing agent | implement within its isolated worktree; run checks; create draft PRs; write evidence | merge; deploy; modify its own permission scope; grant itself approvals; edit constitution |
| Verifying agent (QA/Security) | review diffs, run checks, reject | implement the change it verifies; close its own findings |
| Founder | merge, deploy, promote, credential/permission changes, data migrations, deletions, spend | — |
| BFAOS runtime | read job/approval state; dispatch within pre-approved scope; write evidence | merge; deploy; bypass approval states; delete history |

**Self-granting:** the architecture must never let an agent write the permission that authorises it.
Concretely: approval requests are created by agents; approvals are granted by humans (or by a rule
already authorised in advance); the `mc_decisions.actor` field records who.

## 6. Approval-record requirements (for every future approval)

Per the blueprint and the practice already used in Phase 1-A/1-B:

1. Exact target (branch, commit, PR, file, deployment, account).
2. Content digest (commit SHA / tree SHA / object key).
3. Consequences (what changes in production, what it costs, what it can break).
4. Expiry (approval applies to that digest only).
5. Whether it may be re-used for a materially changed action (default: **no**).

## 7. What must not be done automatically — the standing prohibition list

No automatic merge. No automatic production deploy or promotion. No automatic credential, permission
or billing change. No automatic data migration or deletion. No automatic paid-model fallback. No
automatic Slack-authored shell execution. No rewriting of constitutional documents without founder
authorisation. No silent rewrite of conflicting authorities.
