# BFAOS V2 — 12 Founder Decision Register

**Date:** 2026-11-13 · **Base:** `master` @ `98388ddb`

Only decisions that **genuinely require the founder** appear here. Questions the repository can answer
were answered during Phase 0 and are recorded in the other documents, not asked.

Each decision states the question, why it matters, the recommended option, alternatives, risks, and
what is blocked while it is open.

---

## D-01 — Release the hold on PR #63 (workflow least-privilege and action pins)

**Question.** PR #63 is on hold because a Vercel status failure was suspected to relate to it. The
Vercel failure has since been proven to be a **pre-existing defect unrelated to PR #63** (it reproduces
on `master` @ `98388ddb` with identical logs, and PR #63 changed only workflow YAML).
**Why it matters.** PR #63 reduces the `GITHUB_TOKEN` scope of the production-deploy workflow — the
single highest-value hardening available (R-03).
**Recommended.** Release the hold and merge, accepting that the merge triggers a production rebuild
and deploy of identical application content.
**Alternatives.** (a) Keep the hold until the Vercel path is fixed — but PR #63 cannot affect Vercel;
(b) split the change: permissions first, action pins separately.
**Risks of merging.** A production deploy occurs; the change itself is workflow-only and cannot alter
the bundle.
**Blocked while open.** R-03 remains open; the three unprotected workflows keep inheriting token scope.

## D-02 — PR #64 and #65 (Vercel repairs): merge, or formally retire the Vercel preview path?

**Question.** Two draft PRs fix the Vercel preview path (upload exclusion, output directory), and a
third defect remains (symlinked deployment package) that requires changing `next.config.mjs` or the
canonical Cloudflare build target.
**Why it matters.** Every pull request currently carries a red `Vercel` status, which makes GitHub
report `mergeable_state: unstable` and can block merges if that status is ever required.
**Recommended.** **Formally retire Vercel as a preview target.** The canonical Cloudflare preview
worker is fully verified (`02-production-truth.md` §5) and serves the same commits; Vercel is
already "optional and preview-only" in `PLATFORM-TRUTH.md`; the application is Cloudflare-shaped
(`output: "standalone"`, repo-root tracing root, Turso externals) and Vercel's serverless packaging
rejects that shape. Finishing the Vercel repair would mean making the canonical build configuration
conditional — a real architectural cost for a non-canonical path.
**Alternatives.** (a) Merge #64/#65 and complete a third repair that makes the build Vercel-specific;
(b) merge #64/#65 now (they are correct and harmless) and defer the third defect.
**Risks.** Retiring without merging leaves two open draft PRs to close. Merging without the third fix
leaves the Vercel status red.
**Blocked while open.** PR hygiene; every PR carries a misleading red status.

## D-03 — Supabase authentication continuity

**Question.** Both Supabase projects are paused, so the provider declared as the authentication system in
`PLATFORM-TRUTH.md` is unavailable. Options: restore it and keep it warm; restore and treat it as
secondary; or formalise the Turso-backed `api-auth` session store as the learner identity system and
demote Supabase.
**Why it matters.** It is the declared architecture versus the running architecture. Every future
agent and every founder decision inherits this ambiguity, and paused free-tier projects pause again
after seven idle days.
**Recommended.** **Restore the project, and formalise `api-auth` as the live learner session path**,
with Supabase retained only for what it genuinely serves (OAuth callbacks, profiles) until a decision
is made. Do not build a keep-warm schedule until the provider's terms are confirmed to permit it.
**Alternatives.** (a) Restore + keep-warm (needs terms verification); (b) migrate fully to Supabase
(now or later); (c) drop Supabase entirely and document Turso sessions as the identity system.
**Risks.** (b) touches every auth surface and the learner journey, with safeguarding review; (c)
removes the OAuth path.
**Blocked while open.** R-01, R-11 (retention policy cannot be written without knowing the identity
system), and T-104.

## D-04 — Branch protection on `master`

**Question.** Protection on the branch that auto-deploys to production could not be read (HTTP 403).
What protection should be required?
**Why it matters.** Today, nothing demonstrably prevents a write-access holder from shipping straight
to production.
**Recommended.** Required status checks for the CI suite (lint-and-typecheck, test, secret-scan,
Platform contract, build) and required pull-request review, with administrators included.
**Alternatives.** (a) Required checks only, no review requirement; (b) also require the
`OpenNext build (no deploy)` check, which is the closest proxy to a deployable artifact.
**Risks.** None operationally; it slows merges.
**Blocked while open.** R-02. This is a founder/admin action; an agent token with admin scope should
not be granted merely to set it.

## D-05 — Production deploy protection

**Question.** Should the production deploy job gain an `environment: production` gate with required
reviewers, and a `concurrency` group?
**Why it matters.** Currently the deploy job starts on any `master` push, and two rapid merges can
overlap.
**Recommended.** Yes to both: `environment: production` (founder approval enforced by GitHub rather
than by procedure) and `concurrency: {group: deploy-production, cancel-in-progress: false}`.
**Alternatives.** Concurrency only (protects against races but not against unauthorised merges);
neither (status quo).
**Risks.** An environment gate can block a legitimate emergency deploy unless a bypass owner is named.
**Blocked while open.** R-12.

## D-06 — Public financial content

**Question.** `content/financials/` contains four tracked financial JSON files in a **public**
repository. Is that intended?
**Why it matters.** The master directive forbids placing private institutional or financial records
in public source. This was not previously reviewed.
**Recommended.** Founder review of each of the four files; if any contains confidential figures,
replace with an aggregate or non-sensitive summary, or move the source to a private store and publish
only a summary.
**Alternatives.** Confirm all four are public-facing transparency documents and leave them.
**Risks of changing.** The transparency pages may depend on them.
**Blocked while open.** R-10.

## D-07 — Canonical agent registry

**Question.** Which of the four agent registries is authoritative?
**Why it matters.** `registry/agents.json` is generated but stale (2026-09-17), and
`AGENTS.md` §8 already carries a skill-count claim that PR #60 found incorrect — a constitutional
document out of date with the filesystem.
**Recommended.** `.ai/agents/registry.yaml` becomes the single source; `registry/agents.json` is
regenerated from it (or retired); `platform/agents/` and `platform/ai-runtime/` are explicitly
labelled role briefs, not registries. `AGENTS.md` §8 is corrected in the same change.
**Alternatives.** `registry/agents.json` remains authoritative (requires a reliable generator);
all four are kept with a precedence note.
**Risks.** `AGENTS.md` is a constitutional-tier document; its amendment is a human gate.
**Blocked while open.** T-101, T-104 and any future agent-registry work.

## D-08 — Job status vocabulary

**Question.** The blueprint's lifecycle includes `BLOCKED` and `QUOTA_PAUSED`; `mc_jobs.status` has
neither.
**Recommended.** **Reuse the existing vocabulary** — express "blocked" as `failed` with a reason in
`mc_decisions` (`pause`/`abort`), and "quota paused" as `stopped` + `mc_decisions.action='pause'` —
rather than widening a production CHECK constraint.
**Alternatives.** Extend the constraint by migration (a schema change to production data).
**Risks of extending.** Migration on a live table; the blueprint's states map cleanly enough onto
existing values that the benefit is small.
**Blocked while open.** T-201, T-203.

## D-09 — B2 verification and the artefact plan

**Question.** B2 is the declared asset store but is not on the live path, and no bucket or key access has
been verified. Should V2 artefacts go to B2?
**Recommended.** Verify bucket existence and a bucket-scoped key first (read-only), then adopt B2 for
artefacts and checkpoints with a manifest (object key, SHA-256, size, content type, classification,
version, retention, created-at, related job). Keep the 10 GB free allowance and the alert/pause policy
at ~7 GB / ~9 GB, but confirm the policy against the account's current terms.
**Alternatives.** GitHub Actions artefacts only (7-day retention — too short for audit); Google
Drive/Dropbox (adds providers for no benefit).
**Risks.** Private bucket required; learner data must never enter it.
**Blocked while open.** T-201/T-203 artefact storage, R-20.

## D-10 — Slack (later)

**Question.** Should Slack be connected as a founder interface, and at what scope?
**Recommended.** **Notifications first, commands later, and only after a working read-only status
surface exists.** Commands must create Mission Control jobs and nothing else — never a shell path —
and must verify signatures, prevent replay, and allow only the founder identity.
**Alternatives.** No Slack; GitHub notifications only (acceptable for v1 — the founder already works
through GitHub PRs).
**Risks.** Slack becomes a remote command surface; scope creep.
**Blocked while open.** Nothing else — this is genuinely optional and later.

---

## Decisions already taken (no founder input needed)

Recorded so they are not re-asked: Cloudflare/OpenNext is the only production target; Turso (not D1) is
the application database and the Mission Control ledger; GitHub Actions is the only execution
environment; OpenCode is the only agent runtime; the kernel is the orchestration library; Mission
Control is the job/approval/audit system; Vercel is non-canonical; the machine is a control centre
only; no paid services; production actions require explicit approval; constitutional, token, auth
and architecture-consolidation changes require explicit human authorisation.

## Blocked-work summary

| Blocked work | Blocked by |
|---|---|
| T-102 (read production Mission Control data) | D-03-adjacent credential access |
| T-301 (headless OpenCode proof in CI) | D-03-adjacent provider confirmation (no billing) |
| T-401–T-403 (Mission Control panels, single audit store, status report) | T-102 result + D-08 |
| T-501–T-503 (knowledge consolidation, routing policy, one autonomous task) | T-301, T-402 |
| T-601–T-602 (Slack) | D-10 + founder OAuth |
| T-801–T-804 (recovery drill, quota monitoring, retention policy, audit) | D-05, D-06, D-09 |
