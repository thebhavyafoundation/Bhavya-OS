---
name: bhavya-production-verification
description: Verify production readiness before shipping. Use before merging PRs, deploying, or declaring work complete.
compatibility: opencode
---

# Bhavya Production Verification Skill

## Purpose

Ensure work is verified with evidence before being declared complete.

## Completion Gate

Work is **VERIFIED** only when ALL of the following pass:

### 1. Typecheck
```bash
pnpm typecheck
```
All packages in scope must pass. No new type errors.

### 2. Lint
```bash
pnpm lint
```
All packages in scope must pass. No new errors (warnings acceptable if pre-existing).

### 3. Unit Tests
```bash
pnpm test
```
All tests in affected packages must pass.

### 4. Integration Tests
If applicable, run integration tests for affected packages.

### 5. Build
```bash
pnpm build
```
Production build must succeed.

### 6. Route Audit
If routes were added or modified, run `bhavya-route-audit` skill.

### 7. Security Check
If authentication, authorization, or data handling was modified, run `bhavya-security` skill.

### 8. Git Status
```bash
git status
git diff --check
```
No uncommitted changes. No whitespace errors.

### 9. CI Status
GitHub Actions must pass on the PR.

### 10. Production Smoke Test
For significant changes, verify the deployed preview works correctly.

## Evidence Standard

Never report "complete" based on code inspection alone.

Completion requires evidence:
- Typecheck output showing pass
- Lint output showing pass
- Test output showing pass
- Build output showing success
- Route audit showing no broken links
- Security check showing no vulnerabilities
- Git status showing clean state

## Verification Report

```markdown
## Verification Report — [date]

### Typecheck: PASS/FAIL
[output summary]

### Lint: PASS/FAIL
[output summary]

### Tests: PASS/FAIL
[output summary]

### Build: PASS/FAIL
[output summary]

### Route Audit: PASS/FAIL
[routes checked]

### Security: PASS/FAIL
[checks performed]

### Git Status: CLEAN/DIRTY
[status]

### CI: PASS/FAIL
[link to CI run]

### Overall: VERIFIED / NOT VERIFIED
```
