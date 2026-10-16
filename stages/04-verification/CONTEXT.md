# Stage 04: Verification

**Purpose:** Run all verification gates, verify production readiness, produce verification report.
**Input:** Code changes summary from stage 03.
**Output:** `output/[topic-slug]-verification-report.md`

---

## Inputs

| Source           | File/Location                                          | Section/Scope                    | Why                  |
| ---------------- | ------------------------------------------------------ | -------------------------------- | -------------------- |
| Previous stage   | `../03-implementation/output/`                         | Full file (code changes summary) | What was implemented |
| Canvas           | `../../specs/[topic-slug]-reasons-canvas.md`           | S (Safeguards), N (Norms)        | Quality boundaries   |
| Gates            | `../../_config/build-conventions.md`                   | Verification Gates table         | Gate commands        |
| Production skill | `../../skills/bhavya-production-verification/SKILL.md` | Full checklist                   | Prod readiness       |
| Security skill   | `../../skills/bhavya-security/SKILL.md`                | Security checks                  | Security gates       |
| Anti-slop        | `../../skills/bhavya-architecture/SKILL.md`            | Anti-slop rules                  | Quality gates        |
| Design tokens    | `../../_config/design-tokens.md`                       | All tokens                       | Token compliance     |

---

## Process

1. **Read code changes summary** — Understand what was implemented
2. **Run verification gates in order** (from `_config/build-conventions.md`):
   - `pnpm typecheck` — TypeScript compilation
   - `pnpm lint` — ESLint + style
   - `pnpm test` — Unit/integration tests
   - `pnpm build` — Production build
   - `pnpm antislop` — Code quality gate
   - `pnpm tokens:check` — Design token compliance
   - `pnpm file-map:check` — File map currency
   - `pnpm registry:check` — Registry currency
   - `pnpm drift:check` — Schema/contract drift
3. **Run production verification** — Per `bhavya-production-verification` skill:
   - Security audit
   - Performance baseline
   - Accessibility check
   - Route audit
4. **Run checkpoint** — Present gate results to human (see Checkpoints)
5. **Run audits** — Verify against canvas safeguards and norms (see Audits)
6. **Compile verification report** — All gate results, any failures, remediation
7. **Save to output/** — Write verification report

---

## Outputs

| Artifact            | Location                                     | Format                     |
| ------------------- | -------------------------------------------- | -------------------------- |
| Verification report | `output/[topic-slug]-verification-report.md` | Markdown with gate results |

### Verification Report Structure

```markdown
---
topic: [topic-slug]
stage: 04-verification
date: [ISO timestamp]
implementation: [path to code-changes summary]
overall: PASS/FAIL
---

## Gate Results

| Gate      | Command               | Status    | Duration | Details |
| --------- | --------------------- | --------- | -------- | ------- |
| Typecheck | `pnpm typecheck`      | PASS/FAIL | Xs       | ...     |
| Lint      | `pnpm lint`           | PASS/FAIL | Xs       | ...     |
| Test      | `pnpm test`           | PASS/FAIL | Xs       | ...     |
| Build     | `pnpm build`          | PASS/FAIL | Xs       | ...     |
| AntiSlop  | `pnpm antislop`       | PASS/FAIL | Xs       | ...     |
| Tokens    | `pnpm tokens:check`   | PASS/FAIL | Xs       | ...     |
| File Map  | `pnpm file-map:check` | PASS/FAIL | Xs       | ...     |
| Registry  | `pnpm registry:check` | PASS/FAIL | Xs       | ...     |
| Drift     | `pnpm drift:check`    | PASS/FAIL | Xs       | ...     |

## Production Verification

| Check         | Status    | Details |
| ------------- | --------- | ------- |
| Security      | PASS/FAIL | ...     |
| Performance   | PASS/FAIL | ...     |
| Accessibility | PASS/FAIL | ...     |
| Route Audit   | PASS/FAIL | ...     |

## Failures & Remediation

| Gate | Failure | Remediation |
| ---- | ------- | ----------- |
| ...  | ...     | ...         |

## Canvas Safeguards Verification

| Safeguard          | Verified | Evidence |
| ------------------ | -------- | -------- |
| No duplicate types | YES/NO   | ...      |
| Types not weakened | YES/NO   | ...      |
| ...                | ...      | ...      |

## Recommendation

→ Stage 05: Deployment / → Return to Stage 03: Fix failures
```

---

## Checkpoints

| After Step        | Agent Presents                                             | Human Decides                                                                          |
| ----------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 2 (all gates run) | Complete gate results table, any failures with remediation | Approve for deployment / Return to implementation with fixes / Investigate flaky gates |

---

## Audits

| Check                      | Pass Condition                                            |
| -------------------------- | --------------------------------------------------------- |
| All gates executed         | Every gate from build-conventions.md run and reported     |
| No gate skipped            | No gate omitted without documented justification          |
| Failures have remediation  | Every FAIL has a remediation path documented              |
| Canvas safeguards verified | All S (Safeguards) from canvas checked and reported       |
| Production checks complete | Security, performance, accessibility, route audit all run |
| Overall status clear       | PASS or FAIL unambiguous                                  |

---

## References (in `references/`)

- `verification-gates.md` — Detailed gate procedures
- `anti-slop-rules.md` — AntiSlop Tier 2 rules reference
