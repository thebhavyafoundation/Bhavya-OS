# Verification Gates — Bhavya Foundation

**For Stage 04: Verification — Gate procedures and commands.**

---

## Gate Execution Order

Run gates in this exact order. Stop on first failure.

| #   | Gate      | Command               | Purpose                 | Timeout |
| --- | --------- | --------------------- | ----------------------- | ------- |
| 1   | Typecheck | `pnpm typecheck`      | TypeScript compilation  | 120s    |
| 2   | Lint      | `pnpm lint`           | ESLint + style          | 60s     |
| 3   | Test      | `pnpm test`           | Unit/integration tests  | 180s    |
| 4   | Build     | `pnpm build`          | Production build        | 300s    |
| 5   | AntiSlop  | `pnpm antislop`       | Code quality            | 60s     |
| 6   | Tokens    | `pnpm tokens:check`   | Design token compliance | 30s     |
| 7   | File Map  | `pnpm file-map:check` | File map currency       | 30s     |
| 8   | Registry  | `pnpm registry:check` | Registry currency       | 30s     |
| 9   | Drift     | `pnpm drift:check`    | Schema/contract drift   | 60s     |

---

## Gate Details

### 1. Typecheck

```bash
pnpm typecheck
# Runs: tsc --noEmit (all packages)
```

**Pass:** Exit code 0, no errors
**Fail:** Any TypeScript error
**Common fixes:** Add missing types, fix generics, remove `any`

### 2. Lint

```bash
pnpm lint
# Runs: eslint . --ext .ts,.tsx
```

**Pass:** Exit code 0, no warnings/errors
**Fail:** Any ESLint error
**Common fixes:** Auto-fix (`eslint --fix`), remove unused vars, fix imports

### 3. Test

```bash
pnpm test
# Runs: vitest run (all packages)
```

**Pass:** All tests pass, coverage thresholds met
**Fail:** Any test failure, coverage below threshold
**Common fixes:** Update tests, fix flaky tests, add missing tests

### 4. Build

```bash
pnpm build
# Runs: next build (apps), tsc + bundler (packages)
```

**Pass:** Exit code 0, all outputs generated
**Fail:** Build errors, missing exports, type errors
**Note:** NEVER run locally — only on CI

### 5. AntiSlop

```bash
pnpm antislop
# Runs: custom quality checks
```

**Pass:** Exit code 0
**Fail:** Any Tier 2 rule violation
**Rules checked:** R-A1 through R-A7 (see anti-slop-rules.md)

### 6. Tokens Check

```bash
pnpm tokens:check
# Verifies: no hardcoded colors/fonts, token usage
```

**Pass:** Exit code 0
**Fail:** Hardcoded values found
**Common fixes:** Replace hex with `var(--color-*)`, use designTokens constants

### 7. File Map Check

```bash
pnpm file-map:check
# Verifies: FILE-MAP.md matches filesystem
```

**Pass:** No discrepancies
**Fail:** Files added/removed without map update
**Fix:** `pnpm file-map` to regenerate

### 8. Registry Check

```bash
pnpm registry:check
# Verifies: registry/index.json matches packages/routes
```

**Pass:** No discrepancies
**Fail:** Package/route changes not reflected
**Fix:** `pnpm registry:generate` to regenerate

### 9. Drift Check

```bash
pnpm drift:check
# Verifies: contracts match implementation, schemas match DB
```

**Pass:** No drift detected
**Fail:** Contract/implementation/schema mismatch
**Fix:** Update contracts or implementation to align

---

## Production Verification (bhavya-production-verification skill)

Run after all gates pass:

| Check         | Tool                       | Pass Condition                                |
| ------------- | -------------------------- | --------------------------------------------- |
| Security      | `bhavya-security` skill    | No critical vulnerabilities                   |
| Performance   | Lighthouse CI              | Scores ≥ 90 (perf, a11y, best practices, SEO) |
| Accessibility | axe-core / Playwright      | WCAG 2.1 AA                                   |
| Route Audit   | `bhavya-route-audit` skill | No broken links, all routes have owners       |

---

## Gate Failure Protocol

### On Any Failure

1. **Stop** — Don't run subsequent gates
2. **Diagnose** — Read error output
3. **Fix** — Implement minimal fix
4. **Re-run** — Start from failed gate (not from beginning)
5. **Document** — Note failure and fix in verification report

### Common Failure Patterns

| Gate      | Typical Cause                | Fix                              |
| --------- | ---------------------------- | -------------------------------- |
| Typecheck | Missing types, `any` usage   | Add types, replace `any`         |
| Lint      | Unused imports, formatting   | `eslint --fix`, organize imports |
| Test      | Flaky test, missing mock     | Stabilize test, add mock         |
| Build     | Missing export, circular dep | Fix exports, break cycle         |
| AntiSlop  | R-A1 to R-A7 violation       | See anti-slop-rules.md           |
| Tokens    | Hardcoded color/font         | Use design tokens                |
| File Map  | New file not in map          | `pnpm file-map`                  |
| Registry  | New route/package            | `pnpm registry:generate`         |
| Drift     | Contract changed             | Update contract or code          |

---

## Verification Report Template

See `stages/04-verification/CONTEXT.md` Outputs section for full template.

### Required Fields

- Overall PASS/FAIL
- Per-gate status table
- Production verification table
- Failures with remediation
- Canvas safeguards verification
- Clear recommendation (deploy / fix / investigate)

---

## References

- `_config/build-conventions.md` — Full gate list with CI context
- `skills/bhavya-production-verification/SKILL.md` — Production readiness
- `skills/bhavya-security/SKILL.md` — Security gates
- `skills/bhavya-route-audit/SKILL.md` — Route audit
- `skills/bhavya-architecture/SKILL.md` — Anti-slop rules
- `stages/04-verification/references/anti-slop-rules.md` — Tier 2 details
