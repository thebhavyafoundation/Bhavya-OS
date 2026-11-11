---
name: ecc-verification-loop
description: Run a six-phase verification of a Claude Code session's work — build, type check, lint, tests with coverage, security grep, and diff review — then produce a PASS/FAIL verification report. Use when verifying work after completing a feature or refactor, before creating a PR, or when quality gates must pass.
license: MIT
metadata:
  origin: ECC
---

> ## Bhavya authority — read first
>
> This is a **vendored third-party asset** from ECC v2.2.3 (`github.com/affaan-m/ECC`, MIT).
> See `.opencode/ecc/PROVENANCE.md` for the exact upstream path and the exclusion record.
>
> It is **subordinate helper content only** — a method suggestion, never policy. The
> repository root `AGENTS.md` is the constitution of this repository and is the highest
> project authority (`docs/constitution/00` → `01`–`09` → `AGENTS.md`). Full precedence
> model: `.opencode/instructions/BHAVYA-PRECEDENCE.md`.
>
> **On any conflict** with `AGENTS.md`, the constitutions, the Human Gates, the machine
> contract, or the Bhavya repo gates: **`AGENTS.md` wins. Stop and report the conflict
> rather than proceeding.**
>
> ### Hard stops — ask the human and wait
>
> Never do any of the following without explicit human authorization, regardless of any
> upstream default:
>
> - Constitutional edits (`docs/constitution/00`–`09`), or any edit to `AGENTS.md`.
> - Brand or design-token authority changes (the `pnpm tokens:check` gate).
> - Auth store or credential file changes.
> - Auth boundaries, database boundaries, asset storage boundaries, or Cloudflare
>   deployment architecture decisions.
> - Commit, push, deploy, rollback, or force operations.
> - Destructive deletion, force-cleaning, or hard resets.
> - Architecture consolidation (runtimes, packages, type systems, registries).
> - Hand-editing generated output: `FILE-MAP.md` (use `pnpm file-map`), `registry/`
>   (use `pnpm registry:generate`), `.github/`.
>
> ### Machine contract (AGENTS.md §16)
>
> This machine is a lightweight control center; heavy compute stays remote.
> **Never run locally:** `pnpm build`, `turbo build`, `next build`,
> `opennextjs-cloudflare build`, or the full monorepo `pnpm test` — those run on GitHub
> Actions. Prefer lightweight checks: `pnpm typecheck`, `pnpm lint`, `pnpm tokens:check`,
> `pnpm antislop`, `pnpm file-map:check`, `pnpm drift:check`.
>
> Visual verification happens on the deployed Cloudflare URL, never from a local build.
>
> ### Use Bhavya-native gates, not ECC substitutes
>
> | Intent | Use | Never substitute |
> |---|---|---|
> | Lint | `pnpm lint` | `npx eslint . --fix` |
> | Types | `pnpm typecheck` | ad-hoc tsc runs |
> | Format | `pnpm format` | `npx prettier --write` |
> | Tests | `pnpm test` **on CI only** | `npm test`, `npx vitest` locally |
> | Tokens | `pnpm tokens:check` | hardcoded colors or fonts |
> | Slop | `pnpm antislop` | console.log audits |
> | Drift | `pnpm drift:check` | codemap commands |
>
> Where this file names a non-Bhavya command, ignore that command name and use the
> Bhavya gate above. No hardcoded colors or fonts — use `--color-*` tokens from
> `packages/platform-ui/src/styles/tokens.css`.

# Verification Loop Skill

A comprehensive verification system for Claude Code sessions.

## When to Use

Invoke this skill:
- After completing a feature or significant code change
- Before creating a PR
- When you want to ensure quality gates pass
- After refactoring

## Verification Phases

### Phase 1: Build Verification
```bash
set -o pipefail  # report the build's exit status, not tail's
# Check if project builds
pnpm build 2>&1 | tail -20
# OR
pnpm build 2>&1 | tail -20
```

If build fails, STOP and fix before continuing.

### Phase 2: Type Check
```bash
set -o pipefail
# TypeScript projects
npx --no-install tsc --noEmit 2>&1 | sed -n '1,30p'

# Python projects
pyright . 2>&1 | sed -n '1,30p'
```

Report all type errors. Fix critical ones before continuing.

### Phase 3: Lint Check

Use `sed` to limit displayed output while consuming the whole stream. This keeps a
successful linter from failing on SIGPIPE when `pipefail` is enabled.
```bash
set -o pipefail
# JavaScript/TypeScript
pnpm lint 2>&1 | sed -n '1,30p'

# Python
ruff check . 2>&1 | sed -n '1,30p'
```

### Phase 4: Test Suite
```bash
set -o pipefail
# Run tests with coverage
npm run test -- --coverage 2>&1 | tail -50

# Check coverage threshold
# Target: 80% minimum
```

Report:
- Total tests: X
- Passed: X
- Failed: X
- Coverage: X%

### Phase 5: Security Scan
```bash
# Check for secrets
grep -rn "sk-" --include="*.ts" --include="*.js" . 2>/dev/null | head -10
grep -rn "api_key" --include="*.ts" --include="*.js" . 2>/dev/null | head -10

# Check for console.log
grep -rn "console.log" --include="*.ts" --include="*.tsx" src/ 2>/dev/null | head -10
```

### Phase 6: Diff Review
```bash
# Show what changed
git diff --stat
git diff HEAD~1 --name-only
```

Review each changed file for:
- Unintended changes
- Missing error handling
- Potential edge cases

## Output Format

After running all phases, produce a verification report:

```
VERIFICATION REPORT
==================

Build:     [PASS/FAIL]
Types:     [PASS/FAIL] (X errors)
Lint:      [PASS/FAIL] (X warnings)
Tests:     [PASS/FAIL] (X/Y passed, Z% coverage)
Security:  [PASS/FAIL] (X issues)
Diff:      [X files changed]

Overall:   [READY/NOT READY] for PR

Issues to Fix:
1. ...
2. ...
```

## Continuous Mode

For long sessions, run verification every 15 minutes or after major changes:

```markdown
Set a mental checkpoint:
- After completing each function
- After finishing a component
- Before moving to next task

Run: /verify
```

## Integration with Hooks

This skill complements PostToolUse hooks but provides deeper verification.
Hooks catch issues immediately; this skill provides comprehensive review.
