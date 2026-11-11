---
description: Review code for quality, security, and maintainability
agent: ecc-code-reviewer
subtask: true
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

# Code Review Command

Review code changes for quality, security, and maintainability: $ARGUMENTS

## Your Task

1. **Get changed files**: Run `git diff --name-only HEAD`
2. **Analyze each file** for issues
3. **Generate structured report**
4. **Provide actionable recommendations**

## Check Categories

### Security Issues (CRITICAL)
- [ ] Hardcoded credentials, API keys, tokens
- [ ] SQL injection vulnerabilities
- [ ] XSS vulnerabilities
- [ ] Missing input validation
- [ ] Insecure dependencies
- [ ] Path traversal risks
- [ ] Authentication/authorization flaws

### Code Quality (HIGH)
- [ ] Functions > 50 lines
- [ ] Files > 800 lines
- [ ] Nesting depth > 4 levels
- [ ] Missing error handling
- [ ] console.log statements
- [ ] TODO/FIXME comments
- [ ] Missing JSDoc for public APIs

### Best Practices (MEDIUM)
- [ ] Mutation patterns (use immutable instead)
- [ ] Unnecessary complexity
- [ ] Missing tests for new code
- [ ] Accessibility issues (a11y)
- [ ] Performance concerns

### Style (LOW)
- [ ] Inconsistent naming
- [ ] Missing type annotations
- [ ] Formatting issues

## Report Format

For each issue found:

```
**[SEVERITY]** file.ts:123
Issue: [Description]
Fix: [How to fix]
```

## Decision

- **CRITICAL or HIGH issues**: Block commit, require fixes
- **MEDIUM issues**: Recommend fixes before merge
- **LOW issues**: Optional improvements

---

**IMPORTANT**: Never approve code with security vulnerabilities!
