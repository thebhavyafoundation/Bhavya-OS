# Constitution 04 — Engineering Constitution

**Document:** ENGINEERING-CONSTITUTION-004
**Version:** 1.0.0
**Status:** Active
**Effective:** 2026-08-06
**Authority:** Bhavya Foundation Governance

---

## 1. Preamble

Engineering is how Bhavya Foundation's mission becomes real. Every line of code, every architecture decision, every deployment either advances the mission or it does not. This constitution establishes the engineering standards that ensure every technical contribution is research-backed, mission-aligned, and built to last.

---

## 2. Engineering Principles

These principles are permanent. They apply to every contributor, every pull request, and every deployment. They are not guidelines — they are requirements.

### 2.1 Research Before Implementation

Every change traces back to evidence. Before writing code, understand the problem space. Before choosing a library, evaluate alternatives. Before making an architecture decision, document the rationale.

**Enforcement:** PR descriptions must reference the research, evidence, or rationale behind the change. "I thought this would work" is not a rationale.

### 2.2 Reuse Before Creation

Before building anything new, check `@bhavya/platform-ui` and existing packages. The platform's component library and utility functions exist for a reason. Use them.

**Enforcement:** PRs that introduce new components when equivalent existing components exist are rejected. The component catalog (Document 05) is the authority on what exists.

### 2.3 Simplify Before Expanding

Remove complexity before adding features. Every line of code is a liability. Every abstraction is a commitment. Every dependency is a risk. The best code is the code that does not exist.

**Enforcement:** PRs that add features to already-complex systems must first propose simplification of existing code. Complexity budgets are reviewed quarterly.

### 2.4 Teach Before Automating

If a process is not understood by a human, automating it merely hides the confusion. Document the process manually first. Then automate it.

**Enforcement:** Automated workflows must have corresponding documentation explaining what they do, why they exist, and how to debug them when they fail.

### 2.5 Measure Before Optimizing

Do not guess what is slow. Measure it. Do not assume what users need. Observe them. Do not assume what is broken. Test it.

**Enforcement:** Performance PRs must include before/after metrics. "I think this is faster" is not sufficient. Benchmark, profile, or measure.

### 2.6 Human Approval Before Platform Evolution

No platform change happens without review. The Bhavya Evolution Engine (BEE 2.0) governs all platform evolution. No application evolves independently.

**Enforcement:** Platform-level changes require governance review. The BEE 2.0 lifecycle is mandatory for any change that affects multiple applications or the platform's core architecture.

---

## 3. The BEE 2.0 Lifecycle

Every application and platform component evolves through this lifecycle. No exceptions.

```
Research → Knowledge Package → Recommendation → Human Review → Platform Update → Application Update → Telemetry → Research
```

### 3.1 Stage Definitions

| Stage                  | What Happens                                                    | Output                         |
| ---------------------- | --------------------------------------------------------------- | ------------------------------ |
| **Research**           | Investigate the problem, gather evidence, evaluate alternatives | Research brief with data       |
| **Knowledge Package**  | Encode findings into a reusable Knowledge Package               | KP in Content OS               |
| **Recommendation**     | Propose a specific change with rationale                        | Recommendation document        |
| **Human Review**       | Governance body reviews and approves/rejects                    | Approval or rejection          |
| **Platform Update**    | Implement the change in the platform layer                      | Code, config, or documentation |
| **Application Update** | Applications adopt the platform change                          | Updated applications           |
| **Telemetry**          | Measure the impact of the change                                | Metrics and feedback           |
| **Research**           | Feed telemetry back into the next research cycle                | Updated understanding          |

### 3.2 BEE 2.0 Rules

1. **No skipping stages.** Every change goes through every stage.
2. **No reversing the order.** Research always comes first.
3. **No autonomous evolution.** No application evolves independently of the platform.
4. **No invisible changes.** Every change is documented and traceable.
5. **No unmeasured changes.** Every change has telemetry to measure its impact.

---

## 4. Package Standards

### 4.1 Naming

| Package Type     | Prefix     | Example                |
| ---------------- | ---------- | ---------------------- |
| Core library     | `@bhavya/` | `@bhavya/platform-ui`  |
| Application      | (none)     | `lesson-studio`        |
| Internal tool    | `@bhavya/` | `@bhavya/content-core` |
| Knowledge domain | (none)     | `constitution`         |

Rules:

- All lowercase
- Kebab-case (no underscores, no camelCase)
- Descriptive, not abbreviated
- No version numbers in package names

### 4.2 Versioning

All packages follow semantic versioning (semver):

- **MAJOR** — Breaking changes to public API
- **MINOR** — New features, backwards-compatible
- **PATCH** — Bug fixes, backwards-compatible

Pre-1.0 versions (0.x.y) are for packages still in active development. Breaking changes are permitted in pre-1.0 versions but must be documented in the changelog.

### 4.3 Exports

Every package must have a single entry point (`index.ts` or `index.mjs`). Named exports are preferred over default exports. Internal implementation details are not exported.

```typescript
// Good
export { Button } from './components/Button';
export type { ButtonProps } from './components/Button';

// Bad
export default Button;
export const internalHelper = ...; // Do not export internals
```

### 4.4 Documentation

Every package must include:

- README.md with purpose, installation, and usage
- CHANGELOG.md with version history
- ARCHITECTURE.md for complex packages
- TypeScript types for all public APIs
- JSDoc for all exported functions

---

## 5. Type Safety Rules

### 5.1 No `any`

The `any` type is prohibited. It defeats the purpose of TypeScript. If the type is unknown, use `unknown` and narrow it. If the type is complex, define an interface.

**Enforcement:** ESLint rule `@typescript-eslint/no-explicit-any` is set to `error`. PRs with `any` are rejected.

### 5.2 No `ignoreBuildErrors`

The `ignoreBuildErrors` flag in Next.js (or equivalent in other frameworks) is prohibited. Build errors exist for a reason. Fix them, do not suppress them.

**Enforcement:** Any file containing `ignoreBuildErrors` is flagged and the PR is rejected.

### 5.3 Strict TypeScript

All packages use `strict: true` in `tsconfig.json`. No exceptions. This includes:

- Strict null checks
- Strict function types
- No implicit any
- No implicit this
- Always strict

### 5.4 Type-First Design

Design APIs with types first. Define the interface before the implementation. Types are the contract. Implementation is the detail.

---

## 6. Testing Requirements

### 6.1 Test Pyramid

| Layer             | Purpose                             | Coverage Target |
| ----------------- | ----------------------------------- | --------------- |
| Unit tests        | Individual functions and components | 80%+            |
| Integration tests | Module interactions                 | 60%+            |
| End-to-end tests  | User workflows                      | Critical paths  |

### 6.2 Test Rules

1. **No untested critical paths.** Authentication, data mutation, and publishing must have tests.
2. **No test-only files for simple utilities.** If a function is trivial, test it inline or skip.
3. **No mocking everything.** Mock external dependencies, not internal ones.
4. **No flaky tests.** Tests that sometimes pass and sometimes fail are deleted or fixed in the same PR.

### 6.3 Test Framework

- Unit: Vitest (preferred) or Jest
- Integration: Vitest with service containers
- E2E: Playwright
- No test framework changes without governance review

---

## 7. CI/CD Standards

### 7.1 Required Checks

Every pull request must pass:

1. **Type check** — `tsc --noEmit`
2. **Lint** — `eslint` with project config
3. **Test** — Unit and integration tests
4. **Build** — Production build succeeds
5. **Security scan** — No secrets or vulnerabilities

### 7.2 Required Checks (Platform Changes)

For platform-level changes (BEE 2.0), additionally:

6. **Governance review** — Approved by governance body
7. **Migration review** — Database or schema changes reviewed
8. **Performance check** — No regression in key metrics

### 7.3 Merge Rules

- All required checks must pass
- At least one approval from a code owner
- No unresolved conversations
- Branch is up to date with base branch
- No force-push to main or release branches

### 7.4 Deployment

- Staging deploys automatically on merge to `develop`
- Production deploys require manual approval
- Rollback is automated if error rate exceeds threshold
- All deployments are logged and traceable

---

## 8. Security Standards

### 8.1 No Secrets in Code

API keys, passwords, tokens, and credentials are never committed to the repository. This is an absolute rule.

**Enforcement:** `git-secrets` or equivalent tool scans every commit. Any detected secret results in immediate rejection and incident review.

### 8.2 No Hardcoded Credentials

Database connection strings, API endpoints with embedded credentials, and authentication tokens are never hardcoded.

**Enforcement:** Environment variables or secret managers are the only acceptable way to handle credentials.

### 8.3 Dependency Security

- Dependencies are audited weekly
- Known vulnerabilities are patched within 48 hours for critical, 1 week for high
- New dependencies require governance review
- Prefer built-in Node.js APIs over external packages

### 8.4 Input Validation

All external input is validated at the boundary. No trust of client-provided data. Validation schemas are defined with Zod or equivalent.

### 8.5 Authentication

- Supabase Auth is the canonical authentication system
- No custom authentication implementations
- JWT tokens are validated on every request
- Session management follows platform standards

---

## 9. Performance Standards

### 9.1 Key Metrics

| Metric                   | Target      | Measurement |
| ------------------------ | ----------- | ----------- |
| First Contentful Paint   | < 1.5s      | Lighthouse  |
| Largest Contentful Paint | < 2.5s      | Lighthouse  |
| Time to Interactive      | < 3.5s      | Lighthouse  |
| Cumulative Layout Shift  | < 0.1       | Lighthouse  |
| API response time (p95)  | < 200ms     | Server logs |
| Build time               | < 5 minutes | CI pipeline |

### 9.2 Performance Rules

1. **No premature optimization.** Profile first, optimize second.
2. **No unnecessary re-renders.** React components memoize when beneficial.
3. **No unbounded queries.** All database queries have limits.
4. **No blocking operations on the main thread.** Web Workers for heavy computation.
5. **No loading spinners for sub-second operations.** Optimistic updates preferred.

---

## 10. The Three Prohibitions

### 10.1 No Placeholder Implementations

A placeholder is code that exists to be replaced later. It is a promise that is rarely kept. Every implementation must be complete and functional.

**What counts as a placeholder:**

- `// TODO: implement this`
- `return mockData` in production code
- Empty function bodies
- Hardcoded values that should be configurable
- Stubbed error handling

**What to do instead:**

- If you cannot implement it fully, do not implement it at all
- Document the gap in an issue, not in a comment
- Ship working features, not promises

**Enforcement:** PRs containing placeholder implementations are rejected. The reviewer's job is to distinguish between "this needs refinement" (acceptable) and "this is not implemented" (not acceptable).

### 10.2 No Duplicate Business Logic

If a function exists, use it. If a pattern exists, follow it. Divergence is technical debt that compounds silently.

**Examples of duplication:**

- Two components that render the same data differently
- Two functions that validate the same input
- Two API endpoints that do the same thing
- Two configuration objects that overlap

**What to do instead:**

- Search for existing implementations before writing new ones
- Extract shared logic into packages
- Use the component catalog before building new components

**Enforcement:** PR reviewers are responsible for identifying duplication. When identified, the author must refactor before the PR is merged.

### 10.3 No Technical Debt Knowingly Introduced

Technical debt is not always avoidable. But knowingly introducing it without a plan to address it is a violation of this constitution.

**When technical debt is acceptable:**

- Temporary workaround with a documented fix-by date
- Migration period between two systems
- Known limitation with a tracking issue

**When technical debt is not acceptable:**

- "We'll fix it later" without a tracking issue
- "It works fine for now" without measuring the cost
- "It's too hard to fix" without evaluating alternatives

**Enforcement:** Any PR that introduces known technical debt must include a tracking issue with a severity label and a target resolution date. PRs without tracking issues for known debt are rejected.

---

## 11. Code Style

### 11.1 Formatting

- Prettier for formatting (consistent across all packages)
- ESLint for linting
- No custom formatters or linters without governance review

### 11.2 Naming

- Variables: `camelCase`
- Functions: `camelCase`
- Components: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: `kebab-case`
- Types/Interfaces: `PascalCase`

### 11.3 Comments

- No comments unless asked for (per this constitution's rules)
- Code should be self-documenting
- JSDoc for public APIs is the only exception
- "Why" comments are acceptable; "what" comments are not

---

## 12. Git Standards

### 12.1 Branch Naming

- Feature: `feature/description`
- Fix: `fix/description`
- Refactor: `refactor/description`
- All lowercase, kebab-case

### 12.2 Commit Messages

Follow conventional commits:

- `feat:` new feature
- `fix:` bug fix
- `refactor:` code change that neither fixes a bug nor adds a feature
- `docs:` documentation only
- `test:` adding or correcting tests
- `chore:` maintenance

### 12.3 PR Standards

- Descriptive title
- Summary of changes
- Reference to issue or research
- Screenshots or recordings for UI changes
- Testing instructions

---

## 13. Constitutional Authority

This document is the single source of truth for engineering standards at Bhavya Foundation. All engineering decisions, architecture choices, and implementation patterns must trace back to this constitution.

When this constitution conflicts with library-specific documentation, this constitution wins. Library docs tell you how to use a tool. This constitution tells you how to build Bhavya Foundation.

When this constitution is silent on a matter, the team follows established patterns in the codebase. When no pattern exists, the team proposes one through the BEE 2.0 process.

---

**Amendment Process:** Amendments require documented rationale, team review, and governance approval. No amendment may reduce quality standards below the minimums defined in this document.
