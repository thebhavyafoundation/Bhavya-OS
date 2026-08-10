# Platform Roadmap

**Generated:** 2026-08-06 02:50 IST

---

## Current State

| Metric                                 | Value             |
| -------------------------------------- | ----------------- |
| Total apps                             | 23                |
| Total packages                         | 51                |
| Apps at Level 4 (Production Candidate) | 8                 |
| Apps at Level 3 (Integrated)           | 7                 |
| Apps at Level 2 (Functional)           | 4                 |
| Apps at Level 1 (Scaffolded)           | 3                 |
| Apps at Level 5 (Production)           | 0                 |
| Vercel projects                        | 15 (should be 13) |
| Deployed and READY                     | 11                |
| Deployed but ERROR                     | 2                 |
| Not deployed                           | 10                |
| Packages with tests                    | 14 of 51 (27%)    |
| Packages with README                   | 3 of 51 (6%)      |

---

## Top 10 Engineering Priorities

### Priority 1: Fix Website Deployment (CRITICAL)

**Problem:** Three Vercel projects deploy the same app. Production URL returns ERROR.
**Impact:** Public-facing website is broken.
**Fix:** Consolidate to one `website` project. Remove `bhavya-foundation-dashboard` and `website` (Astro). Fix `serverExternalPackages` runtime error.
**Effort:** 2-4 hours
**Maturity impact:** website Level 4 → Level 5

### Priority 2: Add Lint/Typecheck to 8 Apps

**Problem:** ai-institute, bhavya-intelligence-network, capability-center, github-intelligence-lab, knowledge-studio, open-source-intelligence, github-os (lint only), social-os (lint only) have no lint or typecheck scripts.
**Impact:** Code quality unverified. TypeScript errors slip through.
**Fix:** Add `@bhavya/eslint` and `@bhavya/typescript` as devDependencies. Add lint and typecheck scripts.
**Effort:** 1-2 hours
**Maturity impact:** Multiple apps Level 2 → Level 3

### Priority 3: Connect knowledge Project to GitHub

**Problem:** `knowledge` Vercel project has no GitHub link. Deployments are manual.
**Impact:** Pushing to master doesn't trigger deployments.
**Fix:** Link `knowledge` project to `thebhavyafoundation/Bhavya-OS` on Vercel dashboard.
**Effort:** 5 minutes
**Maturity impact:** Enables automated deployments

### Priority 4: Clean Up Empty Package Directories

**Problem:** `packages/auth/`, `packages/bar/`, `packages/bdx/`, `packages/bhavya-ai-lab/` are empty or contain non-package content.
**Impact:** Confusing. pnpm workspace includes them unnecessarily.
**Fix:** Remove empty directories or convert to proper packages.
**Effort:** 30 minutes
**Maturity impact:** Reduces confusion

### Priority 5: Add Tests to Core Packages

**Problem:** 37 of 51 packages have no test script. Only 14 have tests.
**Impact:** No regression detection. Refactoring is dangerous.
**Fix:** Add vitest to platform, types, security, database, notifications, workflows, ai, providers. Add node --test to constitution, runtime, bee.
**Effort:** 1-2 days
**Maturity impact:** Packages Level 3 → Level 4

### Priority 6: Add README to All Packages

**Problem:** Only 3 of 51 packages have README files.
**Impact:** New contributors can't understand package purpose.
**Fix:** Add README.md to each package with: purpose, API, usage example, dependencies.
**Effort:** 1 day
**Maturity impact:** Documentation completeness

### Priority 7: Deploy github-os to Vercel

**Problem:** github-os has 48 routes (the largest app) but is not deployed.
**Impact:** Repository intelligence features unavailable.
**Fix:** Create Vercel project, link to GitHub, configure build.
**Effort:** 1 hour
**Maturity impact:** github-os Level 3 → Level 4

### Priority 8: Deploy lesson-studio to Vercel

**Problem:** lesson-studio has 36 routes but is not deployed.
**Impact:** Content production pipeline unavailable.
**Fix:** Create Vercel project, link to GitHub, configure build.
**Effort:** 1 hour
**Maturity impact:** lesson-studio Level 3 → Level 4

### Priority 9: Consolidate Root-Level Standalone Projects

**Problem:** `bhavya-ai-lab/`, `openhuman/`, `website/` at root are independent projects outside the workspace.
**Impact:** Repository confusion. Multiple package managers. Multiple Git repos.
**Decision needed:** Are these part of Bhavya OS or separate products?
**Effort:** Varies
**Maturity impact:** Repository clarity

### Priority 10: Establish CI/CD Pipeline

**Problem:** `.github/workflows/ci.yml` and `deploy.yml` exist but their effectiveness is unknown.
**Impact:** No automated quality gates on PR merge.
**Fix:** Verify CI runs lint, typecheck, test on every PR. Verify deploy triggers on master push.
**Effort:** 2-4 hours
**Maturity impact:** Enables Level 5 for all apps

---

## Roadmap Phases

### Phase 1: Stabilize (Week 1)

- [ ] Fix website deployment (Priority 1)
- [ ] Add lint/typecheck to 8 apps (Priority 2)
- [ ] Link knowledge to GitHub (Priority 3)
- [ ] Clean up empty packages (Priority 4)
- [ ] Verify CI/CD pipeline (Priority 10)

### Phase 2: Harden (Week 2-3)

- [ ] Add tests to core packages (Priority 5)
- [ ] Add README to all packages (Priority 6)
- [ ] Deploy github-os (Priority 7)
- [ ] Deploy lesson-studio (Priority 8)

### Phase 3: Consolidate (Week 4)

- [ ] Decide on root-level standalone projects (Priority 9)
- [ ] Remove duplicate Vercel projects
- [ ] Remove orphaned Astro website
- [ ] Standardize all vercel.json configs

### Phase 4: Production (Month 2)

- [ ] Promote Level 4 apps to Level 5
- [ ] Establish monitoring and alerting
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation site live

---

## Target State

| Metric               | Current | Target  |
| -------------------- | ------- | ------- |
| Apps at Level 5      | 0       | 8       |
| Apps at Level 4      | 8       | 15      |
| Vercel projects      | 15      | 13      |
| Packages with tests  | 14      | 40+     |
| Packages with README | 3       | 51      |
| CI/CD passing        | Unknown | 100%    |
| Deployment health    | 2 ERROR | 0 ERROR |
