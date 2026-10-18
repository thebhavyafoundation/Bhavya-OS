---
name: bhavya-ponytail
description: >
  Bhavya-governed wrapper around the third-party "ponytail" OpenCode skill.
  Ponytail is a lazy-senior-dev mode plus read-only review skills (review,
  audit, debt, gain, help). This wrapper enforces AGENTS.md and
  docs/architecture/PLATFORM-TRUTH.md before the third-party skill may load,
  and preserves every Bhavya security, accessibility, governance, curriculum
  and deployment boundary. It never changes application code itself.
compatibility: opencode
wrapper_state: ENABLED
upstream_skill: ponytail
upstream_repo: https://github.com/DietrichGebert/ponytail
upstream_pin: 09c434ab73ca43761c5d8b0c5d341926c2fba710
upstream_license: MIT
update_procedure: docs/tools/ponytail/UPDATE-PROCEDURE.md
uninstall_procedure: docs/tools/ponytail/UNINSTALL-PROCEDURE.md
---

# Bhavya · Ponytail Wrapper

**State: `ENABLED`**

A project-owned wrapper. The third-party `ponytail` skill is installed at
OpenCode user level (`~/.config/opencode/skills/ponytail/`) from the pinned
commit `09c434ab73ca43761c5d8b0c5d341926c2fba710`. It is **not** a web
runtime, **not** a production dependency, and **never** imported by
application code. This wrapper governs it.

## Required platform context

Before using this skill, read:

1. `/AGENTS.md`
2. `/docs/architecture/PLATFORM-TRUTH.md`

If the requested operation conflicts with either file, do not execute it.
Correct the plan to use the established zero-budget Bhavya OS architecture.

## Gate — mandatory order

1. Read `AGENTS.md` in full.
2. Read `docs/architecture/PLATFORM-TRUTH.md` in full.
3. Only then, and only for review/audit/debt/gain/help tasks that respect the
   Bhavya exceptions below, load the third-party skill with
   `skill({ name: "ponytail" })` (or one of `ponytail-review`,
   `ponytail-audit`, `ponytail-debt`, `ponytail-gain`, `ponytail-help`).

If either file cannot be read, **stop**. Do not load the third-party skill.

## Precedence

```
AGENTS.md + PLATFORM-TRUTH.md
  > Bhavya constitution
    > verified curriculum content
      > this wrapper's Bhavya constraints
        > third-party ponytail guidance
```

## Upstream record

| Field | Value |
|---|---|
| Skill id | `ponytail` |
| Repository | `DietrichGebert/ponytail` |
| Pinned commit | `09c434ab73ca43761c5d8b0c5d341926c2fba710` |
| Licence | MIT (Copyright (c) 2026 Dietrich Gebert) |
| Install location | `~/.config/opencode/skills/ponytail` (OpenCode user level) |
| Modification policy | **Do not edit upstream files.** The install is pinned and audited under `docs/tools/ponytail/` (`UPSTREAM-AUDIT.md`, `LICENSE-REVIEW.md`, `SECURITY-REVIEW.md`, `INSTALLATION.md`, `UPDATE-PROCEDURE.md`, `UNINSTALL-PROCEDURE.md`). Change it through that documented update procedure, never by direct edit — a direct edit invalidates the integrity records. |
| Production dependency | **No.** Review/authoring-time only. Never imported by application code. |
| Upstream OpenCode plugin | **Not installed.** Only `skills/ponytail/` is copied; `.opencode/plugins/` is never brought into Bhavya. |

## What this wrapper permits

- Read-only review of uncommitted/staged changes, a branch, or a PR via
  `ponytail-review` (changes nothing).
- Read-only audit of a folder or the whole repo via `ponytail-audit`
  (changes nothing).
- Read-only `ponytail-debt` ledger of `shortcut:` comments (changes nothing).
- Read-only `ponytail-gain` benchmark scoreboard (published averages only;
  never a per-repo savings claim).
- Read-only `ponytail-help` reference.

## What this wrapper forbids (Bhavya exceptions — never simplify)

Ponytail's "smallest change that works" rule must **never** reduce or remove:

1. **Authentication** — Supabase Auth flows, session handling, token validation.
2. **Supabase RLS** — row-level security policies and their tests.
3. **B2 signed URLs** — Backblaze B2 signed-url generation and validation.
4. **B2 role and prefix checks** — B2 bucket role/prefix access controls.
5. **Turso access** — Turso database queries, connection handling, migrations.
6. **OpenNext production build** — the production build pipeline and its gates.
7. **CI/deployment dependencies** — `.github/workflows/`, deploy scripts, pinned
   tool versions required by CI.
8. **Curriculum standards and learning outcomes** — verified curriculum
   content and its sign-off gates.
9. **Safeguarding logic** — any safeguarding/child-safety validation.
10. **Governance and policy content** — governance documents and policy text.
11. **WebGL fallbacks** — WebGL fallback paths in rendering code.
12. **Reduced-motion support** — `prefers-reduced-motion` handling.
13. **Audio captions and transcripts** — captions, transcripts, audio
    alternatives.
14. **Asset licence and attribution records** — asset licence metadata and
    attribution.

Any ponytail suggestion that touches one of these must be flagged, not
applied, and escalated to a human gate.

## Wrapper requirements (binding)

1. Read `AGENTS.md` before any change.
2. Read `docs/architecture/PLATFORM-TRUTH.md` before any change.
3. Preserve existing architecture — no new registry, runtime, or routing layer.
4. Require inspection before implementation — read the code a change touches.
5. Require tests after changes — risky logic leaves a failing test when it breaks.
6. Require licence review for external code/assets — MIT-compatible only.
7. Require measured performance checks — no unverified performance claims.
8. Prevent unnecessary dependency additions — never add a dependency for a few lines.
9. Prevent deletion of security or accessibility logic — never cut trust-boundary validation, error handling, security, or a11y.
10. Preserve production and deployment gates — Cloudflare/OpenNext canonical, B2 for large assets, Supabase auth, Turso data, Vercel preview-only, no R2, no paid APIs.

## Do not use for

- Writing or modifying application code directly.
- Production builds, deployments, or CI changes.
- Simplifying any item in the Bhavya exceptions list.
- Replacing Cloudflare, Backblaze B2, Supabase, or Turso.
- Proposing paid services or payment-required services.
- Proposing local inference as a replacement for the free-model contract.

## Pilot scope (read-only / review mode)

One-shot, changes nothing. Safe pilot targets:

1. One small UI change — reuse existing components, no validation removed.
2. One curriculum-page change — standards and learning outcomes preserved.
3. One diagram change — static SVG, accessibility preserved.
4. One OpenNext/deployment workflow change — review only, gates preserved.
5. One security-sensitive B2 change in review-only mode — no secrets sent.

## Sign-off

- AGENTS.md read ✓
- PLATFORM-TRUTH.md read ✓
- MIT licence compatible ✓
- Pinned commit recorded ✓
- Bhavya exceptions enumerated ✓
- Production/deployment gates preserved ✓
