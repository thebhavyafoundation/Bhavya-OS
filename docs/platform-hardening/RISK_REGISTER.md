# Risk Register

**Sprint:** Platform Hardening v1.0
**Date:** 2026-08-03

---

## Risk Matrix

| #   | Risk                                      | Probability | Impact | Severity | Mitigation                           |
| --- | ----------------------------------------- | ----------- | ------ | -------- | ------------------------------------ |
| R1  | Auth changes break login flow             | Medium      | High   | HIGH     | Test login after each auth change    |
| R2  | DB index creation fails on existing data  | Low         | Medium | MEDIUM   | Use IF NOT EXISTS, test on copy      |
| R3  | Transaction wrapping changes behavior     | Low         | High   | MEDIUM   | Test pipeline execution thoroughly   |
| R4  | BEE import change breaks runtime          | Low         | High   | MEDIUM   | Test runtime after change            |
| R5  | Rate limiting blocks legitimate users     | Medium      | Medium | MEDIUM   | Conservative limits, monitor         |
| R6  | Safe evaluator rejects valid conditions   | Low         | High   | MEDIUM   | Test all existing condition patterns |
| R7  | Shared component refactor breaks pages    | Low         | High   | MEDIUM   | Visual regression test each page     |
| R8  | CI pipeline has false failures            | Medium      | Low    | LOW      | Test CI locally first                |
| R9  | Removing dead deps breaks hidden imports  | Low         | Medium | LOW      | Grep for imports before removing     |
| R10 | TypeScript strict mode catches new errors | High        | Low    | MEDIUM   | Fix errors as they appear            |
| R11 | Rate limiter memory leak                  | Low         | Medium | LOW      | Use simple in-memory with TTL        |
| R12 | NEXTAUTH_SECRET format invalid            | Low         | High   | LOW      | Use crypto.randomBytes               |

---

## Risk Details

### R1: Auth Changes Break Login Flow

**Description:** Adding requireAuth() to routes or changing auth configuration could break the login/register flow.

**Mitigation:**

- Test login flow after every auth-related change
- Test register flow after every auth-related change
- Keep auth.ts changes minimal (only add secret)
- Test session persistence across restarts

**Detection:** Manual login test after each change.

### R2: DB Index Creation Fails

**Description:** SQLite index creation on existing tables could fail if the database is corrupted or has unexpected schema.

**Mitigation:**

- Use `CREATE INDEX IF NOT EXISTS` for all indexes
- Test on a copy of the database first
- Back up database before applying changes

**Detection:** Build-time error if schema creation fails.

### R3: Transaction Wrapping Changes Behavior

**Description:** Wrapping pipeline execution in a transaction changes the error handling semantics. Previously, partial writes persisted. Now, all writes roll back on failure.

**Mitigation:**

- This is the desired behavior (fixing a bug)
- Test pipeline execution with simulated failures
- Verify partial state is no longer possible

**Detection:** Pipeline tests that verify atomic behavior.

### R4: BEE Import Change Breaks Runtime

**Description:** Changing the BEE import from relative path to package import could fail if the runtime package doesn't export the expected subpath.

**Mitigation:**

- Check runtime package.json exports before making change
- Add missing export if needed
- Test runtime after change

**Detection:** Build error or import error at runtime.

### R5: Rate Limiting Blocks Legitimate Users

**Description:** Aggressive rate limits could block legitimate users from using the application.

**Mitigation:**

- Start with conservative limits (5-20 requests per minute)
- Make limits configurable via environment variables
- Log rate limit hits for monitoring

**Detection:** User reports of blocked requests.

### R6: Safe Evaluator Rejects Valid Conditions

**Description:** The new condition evaluator might not support all condition patterns used in existing workflows and governance rules.

**Mitigation:**

- Audit all existing condition strings before implementing
- Support all common operators (==, !=, >, <, >=, <=, contains, startsWith)
- Fall back to `false` for unsupported conditions (fail closed)

**Detection:** Workflow/governance tests that verify condition evaluation.

### R7: Shared Component Refactor Breaks Pages

**Description:** Replacing inline components with shared components could introduce visual differences or functional regressions.

**Mitigation:**

- Take screenshots of all 9 pages before refactoring
- Compare after refactoring
- No visual changes allowed — components must render identically

**Detection:** Visual comparison of before/after screenshots.

### R8: CI Pipeline Has False Failures

**Description:** The new CI pipeline might fail due to configuration issues, not actual code problems.

**Mitigation:**

- Test CI workflow locally with `act` or manual verification
- Start with a minimal workflow (lint only)
- Add steps incrementally

**Detection:** CI failures that don't reproduce locally.

### R9: Removing Dead Deps Breaks Hidden Imports

**Description:** Removing lucide-react or @bhavya/ui could break imports we haven't found.

**Mitigation:**

- Grep for all imports before removing
- Build all affected packages after removal
- Keep the dependency if any import is found

**Detection:** Build error after dependency removal.

### R10: TypeScript Strict Mode Catches New Errors

**Description:** Removing `ignoreBuildErrors: true` could reveal many TypeScript errors.

**Mitigation:**

- Fix TypeScript errors incrementally
- Don't remove `ignoreBuildErrors` until all errors are fixed
- Add typecheck to CI only after it passes

**Detection:** TypeScript compiler errors.

---

## Contingency Plans

### If auth changes break login:

1. Revert auth.ts changes
2. Use simpler approach: add secret only, no middleware changes
3. Test login flow

### If DB changes cause data loss:

1. Restore from backup
2. Apply changes more carefully (one at a time)
3. Test each change individually

### If BEE import breaks runtime:

1. Revert to relative path import
2. Document as technical debt
3. Fix properly with correct package exports

### If shared components break pages:

1. Revert to inline styles
2. Take more careful approach (one component at a time)
3. Visual test after each component
