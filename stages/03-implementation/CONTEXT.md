# Stage 03: Implementation

**Purpose:** Implement code changes per REASONS Canvas specification.
**Input:** REASONS Canvas from stage 02.
**Output:** `output/[topic-slug]-code-changes/` (diff summary + file list)

---

## Inputs

| Source         | File/Location                                           | Section/Scope                 | Why                |
| -------------- | ------------------------------------------------------- | ----------------------------- | ------------------ |
| Previous stage | `../02-specification/output/`                           | Full file (REASONS Canvas)    | Specification      |
| Canvas         | `../../specs/[topic-slug]-reasons-canvas.md`            | S (Structure), O (Operations) | File layout, steps |
| Architecture   | `../../docs/architecture/REPOSITORY_SOURCE_OF_TRUTH.md` | Canonical sources             | What exists        |
| Architecture   | `../../docs/architecture/DOMAIN_OWNERSHIP.md`           | Domain registry               | Ownership          |
| Contracts      | `../../contracts/`                                      | Relevant CONTRACT.md          | Package interfaces |
| Shared         | `../../shared/constants/design-tokens.ts`               | Full file                     | Design constants   |
| Shared         | `../../shared/constants/api-constants.ts`               | Full file                     | API constants      |
| Standards      | `../../standards/`                                      | Relevant standards            | Engineering norms  |
| Skills         | `../../skills/bhavya-architecture/SKILL.md`             | Core rules                    | Architecture rules |
| Skills         | `../../skills/bhavya-design-system/SKILL.md`            | Design rules                  | UI implementation  |
| Skills         | `../../skills/bhavya-security/SKILL.md`                 | Security rules                | Secure coding      |
| Skills         | `../../skills/bhavya-github-workflow/SKILL.md`          | Git workflow                  | Commits, PRs       |
| Skills         | `../../skills/bhavya-production-verification/SKILL.md`  | Prod readiness                | Verification gates |

---

## Process

1. **Read REASONS Canvas** — Focus on Structure (file layout, dependencies, interfaces) and Operations (steps)
2. **Verify specifications** — Confirm canvas status is `approved` (not `draft`)
3. **Execute Operations steps in order** — Follow canvas O (Operations) exactly:
   - For each step: read dependencies, implement at location, produce output
   - Run step-level verification (typecheck/lint) after each logical unit
4. **Follow coding norms** — Per canvas N (Norms) and Bhavya standards
5. **Enforce safeguards** — Per canvas S (Safeguards): no duplicate types, no weakened types, etc.
6. **Run checkpoint** — Present implementation summary to human (see Checkpoints)
7. **Run audits** — Verify implementation quality (see Audits)
8. **Generate diff summary** — List all files created/modified/deleted
9. **Save to output/** — Write code-changes summary

---

## Outputs

| Artifact             | Location                              | Format                                                    |
| -------------------- | ------------------------------------- | --------------------------------------------------------- |
| Code changes summary | `output/[topic-slug]-code-changes.md` | Markdown with file list, diff links, verification results |

### Code Changes Summary Structure

```markdown
---
topic: [topic-slug]
stage: 03-implementation
date: [ISO timestamp]
canvas: [path to canvas]
status: complete
---

## Files Created

- `path/to/file.ts` — Purpose

## Files Modified

- `path/to/file.ts` — Change summary

## Files Deleted

- `path/to/file.ts` — Reason

## Verification Results

| Gate      | Status    | Details |
| --------- | --------- | ------- |
| Typecheck | PASS/FAIL | ...     |
| Lint      | PASS/FAIL | ...     |
| Test      | PASS/FAIL | ...     |
| Build     | PASS/FAIL | ...     |
| AntiSlop  | PASS/FAIL | ...     |
| Tokens    | PASS/FAIL | ...     |

## Deviations from Canvas

- [Any deviations with justification]
```

---

## Checkpoints

| After Step                   | Agent Presents                                               | Human Decides                                       |
| ---------------------------- | ------------------------------------------------------------ | --------------------------------------------------- |
| 3 (core implementation done) | Summary of changes, diff preview, any deviations from canvas | Approve / Request fixes / Redirect approach         |
| 6 (all gates pass)           | Final verification results, test coverage                    | Approve for verification stage / Request more tests |

---

## Audits

| Check               | Pass Condition                                                   |
| ------------------- | ---------------------------------------------------------------- |
| No duplicate types  | All shared entities use `@bhavya/shared`; no local redefinitions |
| Types not weakened  | No `any`, `unknown` without justification; strict mode passes    |
| No app-to-app deps  | Imports only from packages/ or shared/; no apps/* imports        |
| Design tokens used  | No hardcoded colors/fonts; all from `designTokens` or CSS vars   |
| Error handling      | No swallowed errors; all async has try/catch or .catch()         |
| Tests cover changes | New/modified code has corresponding tests                        |
| Anti-slop passes    | `pnpm antislop` returns 0 violations                             |
| Tokens check passes | `pnpm tokens:check` returns 0 violations                         |
| Diff inspected      | `git diff` reviewed before output                                |

---

## References (in `references/`)

- `coding-standards.md` — TypeScript, React, Next.js patterns
- `git-workflow.md` — Branch naming, commits, PRs
- `package-conventions.md` — Package structure, exports, contracts
