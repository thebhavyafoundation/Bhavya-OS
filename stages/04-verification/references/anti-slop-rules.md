# Anti-Slop Tier 2 Rules — Bhavya Foundation

**For Stage 04: Verification — Detailed rule definitions and checks.**

---

## Tier 2 Rules (from AGENTS.md)

| Rule | Name                        | Description                                      | Automated Check                             |
| ---- | --------------------------- | ------------------------------------------------ | ------------------------------------------- |
| R-A1 | Smallest Viable Change      | Only files necessary for the change are modified | `git diff --stat` review                    |
| R-A2 | Existing Patterns Reused    | New code follows patterns already in codebase    | Grep for similar patterns                   |
| R-A3 | No Unjustified Dependencies | No new npm packages without RFC                  | `package.json` diff review                  |
| R-A4 | No Invented Architecture    | Follows REPOSITORY_SOURCE_OF_TRUTH.md            | Architecture doc cross-reference            |
| R-A5 | Errors Investigated         | No empty catch, no silent failures               | ESLint: `no-empty`, `require-await`         |
| R-A6 | Types Not Weakened          | No `any`, `unknown` without justification        | TypeScript strict + `ts-expect-error` audit |
| R-A7 | Diff Inspected              | `git diff` reviewed before completion            | Manual checkpoint                           |

---

## Rule Details

### R-A1: Smallest Viable Change

**Check:** `git diff --name-only` shows only relevant files
**Pass:** Every modified file is traceable to the change
**Fail:** Unrelated refactoring, formatting, or cleanup in same PR
**Exception:** Auto-formatting via `pnpm format` in separate commit

### R-A2: Existing Patterns Reused

**Check:** For each new pattern, `grep -r` finds ≥1 existing use
**Examples:**

- New React component → follows `platform-ui` component pattern
- New API route → follows existing route structure in `apps/ai-institute/src/app/api/`
- New type → uses `@bhavya/shared` patterns
- New test → follows existing test patterns

**Pass:** Pattern documented in codebase
**Fail:** Novel pattern without precedent

### R-A3: No Unjustified Dependencies

**Check:** `package.json` additions reviewed
**Pass:** Every new dependency has:

- RFC reference, OR
- Clear justification in PR description, OR
- Is dev-only and well-known (e.g., `@types/*`, `vitest`)

**Fail:** New runtime dependency without justification

### R-A4: No Invented Architecture

**Check:** Cross-reference with `docs/architecture/REPOSITORY_SOURCE_OF_TRUTH.md`
**Pass:** Changes align with canonical sources, domain ownership, route map
**Fail:** New package without domain ownership, new route without canonical mapping, duplicate types

### R-A5: Errors Investigated

**ESLint Rules Enforced:**

```json
{
  "rules": {
    "no-empty": ["error", { "allowEmptyCatch": false }],
    "require-await": "error",
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "@typescript-eslint/no-floating-promises": "error"
  }
}
```

**Patterns Checked:**

- ❌ `catch {}`
- ❌ `catch (e) { console.log(e) }`
- ❌ `fetch()` without `await` or `.catch()`
- ✅ `catch (e) { logger.error(e); throw e; }`
- ✅ `try { await fetch() } catch (e) { handle(e) }`

### R-A6: Types Not Weakened

**TypeScript Config:**

```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true
}
```

**Audit:**

- Zero `any` in new code (excluding `@ts-expect-error` with comment)
- Zero `unknown` without narrowing
- No `as Type` casts without validation
- All function params/returns typed

**Exception:** `@ts-expect-error` with explanatory comment for legacy interop

### R-A7: Diff Inspected

**Process:**

1. Run `git diff` (not `git diff --cached`)
2. Review every hunk
3. Confirm each change matches intent
4. Check for: debug code, console.log, commented code, large refactors

**Checkpoint:** Required before marking verification complete

---

## Automated Enforcement

### `pnpm antislop` Implementation

```bash
#!/bin/bash
# Runs all Tier 2 checks

# R-A1: Diff size check
git diff --stat | awk 'NR>1 {files+=$1} END {if (files > 20) exit 1}'

# R-A2: Pattern check (simplified)
# Custom script: checks new imports against known patterns

# R-A3: Dependency check
git diff package.json | grep '^+' | grep -v 'devDependencies' && exit 1

# R-A4: Architecture check
# Custom script: validates against REPOSITORY_SOURCE_OF_TRUTH.md

# R-A5: ESLint
pnpm lint --max-warnings=0

# R-A6: TypeScript strict
pnpm typecheck

# R-A7: Manual (checkpoint)

echo "All automated checks passed"
```

---

## Manual Verification Checklist

Before verification complete:

- [ ] R-A1: `git diff --name-only` reviewed — only relevant files
- [ ] R-A2: New patterns have ≥1 existing use in codebase
- [ ] R-A3: New dependencies justified in PR
- [ ] R-A4: Changes align with architecture docs
- [ ] R-A5: No empty catch, no unawaited promises
- [ ] R-A6: Zero `any` without `@ts-expect-error` + comment
- [ ] R-A7: `git diff` fully reviewed, no debug code

---

## References

- `AGENTS.md` — Universal Operating Rules
- `docs/constitution/04-ENGINEERING-CONSTITUTION.md` — Engineering principles
- `docs/architecture/REPOSITORY_SOURCE_OF_TRUTH.md` — Canonical architecture
- `skills/bhavya-architecture/SKILL.md` — Architecture rules
- `_config/build-conventions.md` — Verification gate list
