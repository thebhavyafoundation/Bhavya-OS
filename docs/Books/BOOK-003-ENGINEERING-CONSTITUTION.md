# BOOK-003 — Engineering Constitution

**The Technical Law of Bhavya OS**

> "Engineering is not about building things. It is about building things that last, that scale, that serve human needs with precision and grace."

**Version:** 1.0
**Status:** Active
**Authority:** Subordinate to BOOK-001 and BOOK-002
**Last Updated:** 2026-07-27

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Philosophy](#2-philosophy)
3. [Mission](#3-mission)
4. [Architecture](#4-architecture)
5. [Rules](#5-rules)
6. [Implementation](#6-implementation)
7. [Examples](#7-examples)
8. [Anti-patterns](#8-anti-patterns)
9. [Checklists](#9-checklists)
10. [Acceptance Criteria](#10-acceptance-criteria)
11. [Automation Hooks](#11-automation-hooks)
12. [Future Evolution](#12-future-evolution)
13. [Appendices](#13-appendices)

---

## 1. Introduction

### 1.1 What Is This Document?

This is the **Engineering Constitution** — the technical law of Bhavya OS. It defines the engineering principles, architecture decisions, technology stack, and technical standards that govern all software built for the Foundation.

### 1.2 Why Does This Exist?

Engineering decisions have long-term consequences. The technology choices made today will affect the Foundation for decades. This constitution ensures:

- **Consistency** — All engineering follows the same principles
- **Quality** — Every technical decision meets the Foundation's standards
- **Longevity** — Technical choices are made for decades, not quarters
- **Scalability** — The system can grow without rewriting

### 1.3 Scope

This document governs:

- Technology stack selection
- Architecture patterns
- Performance standards
- Security requirements
- Testing strategies
- Monitoring and observability
- Infrastructure decisions
- Third-party dependencies

---

## 2. Philosophy

### 2.1 Core Belief

> "We do not build projects. We build institutions. Projects finish. Institutions endure."

Every engineering decision must serve the long-term vision. We choose technologies that:

- Have proven track records
- Strong communities
- Excellent documentation
- Long-term support
- Minimal vendor lock-in

### 2.2 Design Principles

1. **Simplicity Over Cleverness**
   - Simple code is maintainable code
   - Clever code is bugs waiting to happen
   - Choose the boring technology

2. **Progressive Enhancement**
   - Core functionality works without JavaScript
   - Enhancement layers add interactivity
   - Graceful degradation when features fail

3. **Standards Over Proprietary**
   - Use web standards whenever possible
   - Prefer open-source over proprietary
   - Avoid vendor lock-in

4. **Performance as a Feature**
   - Performance is not an optimization
   - Performance is a user experience
   - Measure everything, optimize ruthlessly

5. **Security by Design**
   - Security is not a layer
   - Security is built into every decision
   - Assume breach, design for resilience

---

## 3. Mission

### 3.1 Engineering Mission

To build a technical platform that:

1. **Serves the Mission** — Every technical decision supports Nature, Knowledge, or Heritage
2. **Endures for Decades** — The architecture outlives any individual technology trend
3. **Scales Globally** — The system serves millions of users worldwide
4. **Remains Maintainable** — New developers can contribute quickly
5. **Upholds Quality** — Every release meets the Foundation's quality bar

### 3.2 Success Criteria

The Engineering Constitution succeeds when:

- Lighthouse scores >= 95 across all pages
- Bundle sizes < 200KB JS per route
- Build times < 2 minutes
- Test coverage > 80%
- Zero critical security vulnerabilities
- 99.9% uptime for production services
- New developers productive within 1 day

---

## 4. Architecture

### 4.1 Technology Stack

| Layer               | Technology              | Rationale                                     |
| ------------------- | ----------------------- | --------------------------------------------- |
| **Runtime**         | Node.js >= 20.9.0       | LTS, performance, ecosystem                   |
| **Framework**       | Next.js 15 (App Router) | Server components, streaming, ISR             |
| **Language**        | TypeScript 5.x (strict) | Type safety, tooling, maintainability         |
| **UI Library**      | React 19                | Component model, ecosystem, performance       |
| **Styling**         | Tailwind CSS 4.x        | Utility-first, design system, performance     |
| **Animation**       | GSAP 3.x                | Professional-grade, performant, reliable      |
| **Package Manager** | pnpm 10.x               | Performance, workspace support, strictness    |
| **Build System**    | Turborepo               | Monorepo optimization, caching, parallelism   |
| **Deployment**      | Vercel                  | Edge network, serverless, Next.js integration |
| **Database**        | PostgreSQL (planned)    | ACID, JSON support, reliability               |
| **Cache**           | Redis (planned)         | Performance, pub/sub, sessions                |
| **Search**          | Meilisearch (planned)   | Fast, typo-tolerant, open-source              |
| **Storage**         | S3-compatible (planned) | Scalability, reliability, cost                |

### 4.2 Architecture Patterns

#### 4.2.1 Monorepo with Turborepo

```
Bhavya-OS/
├── apps/           # Deployable applications
├── packages/       # Shared libraries
├── turbo.json      # Build pipeline configuration
└── pnpm-workspace.yaml
```

**Benefits:**

- Shared code without publishing
- Atomic commits across packages
- Consistent tooling and configuration
- Optimized builds with caching

#### 4.2.2 Server Components by Default

```typescript
// Default: Server Component (no "use client")
export async function Page() {
  const data = await fetchData();
  return <div>{data.map(item => <ClientComponent key={item.id} data={item} />)}</div>;
}

// Only when interactivity is needed: Client Component
"use client";
export function ClientComponent({ data }) {
  const [state, setState] = useState(data);
  return <button onClick={() => setState(...)}>{state.label}</button>;
}
```

#### 4.2.3 Shared Package Architecture

```
packages/
├── ui/           # Shared UI components (shadcn-style)
├── icons/        # Lucide-based icon wrappers
├── branding/     # Brand & navigation
├── charts/       # Chart primitives
├── maps/         # MapLibre-ready map components
├── sdk/          # Public application SDK
├── config/       # Shared configuration
├── eslint/       # Shared ESLint config
├── typescript/   # Shared TypeScript config
├── mission-runtime/  # Shared app runtime
├── runtime/      # Bhavya CLI + planner/executor
├── auth/         # Authentication
├── database/     # Database utilities
├── docs/         # MDX content registry
└── bdl/          # Bhavya Design Language
```

### 4.3 Performance Budget

| Metric                   | Budget  | Enforcement          |
| ------------------------ | ------- | -------------------- |
| First Load JS            | < 200KB | CI gate              |
| Largest Contentful Paint | < 2.5s  | Lighthouse CI        |
| First Input Delay        | < 100ms | Real User Monitoring |
| Cumulative Layout Shift  | < 0.1   | Lighthouse CI        |
| Total Blocking Time      | < 200ms | Lighthouse CI        |
| Time to Interactive      | < 3.5s  | Lighthouse CI        |
| Build Time               | < 2min  | CI gate              |
| TypeScript Compilation   | < 30s   | Pre-commit           |

### 4.4 Security Requirements

| Requirement         | Standard                       | Enforcement         |
| ------------------- | ------------------------------ | ------------------- |
| HTTPS               | All production traffic         | Vercel default      |
| CSP Headers         | Strict Content Security Policy | Middleware          |
| Authentication      | JWT with refresh tokens        | Auth package        |
| Authorization       | Role-based access control      | Middleware          |
| Input Validation    | Zod schema validation          | API routes          |
| Output Encoding     | React's default escaping       | Component rendering |
| Dependency Scanning | npm audit                      | CI pipeline         |
| Secret Management   | Environment variables          | Vercel secrets      |

---

## 5. Rules

### 5.1 Technology Selection Rules

1. **Choose boring technology** — Proven, well-documented, large community
2. **Avoid cutting-edge** — Wait for ecosystem maturity
3. **Check bundle size** — Every dependency must justify its weight
4. **Check maintenance** — Active maintenance required
5. **Check license** — OSI-approved licenses only
6. **Check security** — No known vulnerabilities
7. **Check alternatives** — Evaluate at least 3 options

### 5.2 Architecture Rules

1. **Server components by default** — Only add "use client" when needed
2. **Static generation when possible** — ISR over SSR when data allows
3. **Edge functions for middleware** — Keep middleware lightweight
4. **Serverless for API routes** — Auto-scaling, no server management
5. **Shared packages for reuse** — Never duplicate code across apps
6. **TypeScript strict mode** — No `any`, no `@ts-ignore`
7. **Functional components only** — No class components

### 5.3 Performance Rules

1. **Measure before optimizing** — No premature optimization
2. **Lazy load everything** — Code split aggressively
3. **Optimize images** — WebP/AVIF, responsive sizes
4. **Cache aggressively** — ISR, CDN, browser cache
5. **Minimize client JavaScript** — Server components over client
6. **Use streaming** — Suspense boundaries for progressive loading
7. **Monitor in production** — Real User Monitoring

### 5.4 Security Rules

1. **Never trust user input** — Validate everything
2. **Never expose internals** — Hide error details in production
3. **Never commit secrets** — Use environment variables
4. **Never bypass auth** — Every route protected
5. **Never use eval** — Always parse JSON safely
6. **Never store sensitive data in localStorage** — Use httpOnly cookies
7. **Never trust client-side validation** — Always validate server-side

---

## 6. Implementation

### 6.1 Adding a New Feature

```bash
# 1. Check existing patterns
grep -r "similar-feature" apps/ packages/

# 2. Create feature branch
git checkout -b feat/feature-name

# 3. Implement in the appropriate location
# Follow existing patterns

# 4. Add tests
# Unit tests for logic
# Integration tests for API routes
# E2E tests for user flows

# 5. Run validation
pnpm typecheck
pnpm lint
pnpm test

# 6. Commit with conventional format
git commit -m "feat(scope): add feature description"

# 7. Create pull request
# Describe changes, link to issue

# 8. Get review and merge
```

### 6.2 Adding a New Package

```bash
# 1. Create package directory
mkdir packages/<package-name>

# 2. Initialize with package.json
cd packages/<package-name>
pnpm init

# 3. Create src/ directory structure
mkdir src

# 4. Add TypeScript configuration
# Extend from root tsconfig.base.json

# 5. Add ESLint configuration
# Extend from @bhavya/eslint

# 6. Add tests
mkdir tests

# 7. Write README.md
# Document package purpose, API, examples

# 8. Register in workspace
# Already configured in pnpm-workspace.yaml

# 9. Register in .ai/index.yaml
# Add entry: PKG-XXX: packages/<package-name>

# 10. Update registry
pnpm registry:generate
```

### 6.3 Adding a New Application

```bash
# 1. Create app directory
mkdir apps/<app-name>

# 2. Initialize Next.js
cd apps/<app-name>
npx create-next-app@latest . --typescript --tailwind --app --src-dir

# 3. Configure for monorepo
# Update package.json to use workspace packages

# 4. Add to navigation registry
# Create navigation/<app-name>.json

# 5. Register in .ai/index.yaml
# Add entry: APP-XXX: apps/<app-name>

# 6. Register in .ai/manifest.yaml
# Add to apps section

# 7. Update registry
pnpm registry:generate
```

### 6.4 Adding a New Standard

```bash
# 1. Create standard document
touch standards/<standard-name>.md

# 2. Follow standard template
# Introduction, Philosophy, Rules, Implementation, Examples

# 3. Register in .ai/index.yaml
# Add entry: STD-XXX: standards/<standard-name>.md

# 4. Update registry
pnpm registry:generate
```

---

## 7. Examples

### 7.1 Correct Server Component

```typescript
// apps/website/src/app/nature/page.tsx
import { Metadata } from "next";
import { ForestContent } from "@/components/ForestContent";

export const metadata: Metadata = {
  title: "Bhavya Forest Mission",
  description: "Restoring ecosystems, protecting biodiversity...",
};

export default async function NaturePage() {
  const data = await fetchForestData();
  return <ForestContent data={data} />;
}
```

**Why this is correct:**

- Server component by default (no "use client")
- Async data fetching on server
- SEO metadata exported
- Content component is separate

### 7.2 Correct Client Component

```typescript
// apps/website/src/components/ForestContent.tsx
"use client";

import { useState } from "react";
import { TreePine } from "lucide-react";

export function ForestContent({ data }) {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      {data.items.map(item => (
        <button
          key={item.id}
          onClick={() => setSelected(item)}
          className={selected?.id === item.id ? "active" : ""}
        >
          <TreePine size={16} />
          {item.name}
        </button>
      ))}
    </div>
  );
}
```

**Why this is correct:**

- "use client" only where interactivity is needed
- Minimal client state
- Icon from shared icon package
- Clean, readable code

### 7.3 Correct API Route

```typescript
// apps/website/src/api/health/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || "unknown",
  });
}
```

**Why this is correct:**

- Simple, focused endpoint
- No sensitive data exposed
- Proper response format
- Error handling built-in

---

## 8. Anti-patterns

### 8.1 Never Do This

| Anti-pattern                            | Why it's wrong             | Correct approach          |
| --------------------------------------- | -------------------------- | ------------------------- |
| Using `any` type                        | Defeats TypeScript purpose | Use proper types          |
| Using `@ts-ignore`                      | Hides type errors          | Fix the type error        |
| Using class components                  | Outdated pattern           | Use functional components |
| Using `useEffect` for data fetching     | Inefficient                | Use server components     |
| Using `localStorage` for sensitive data | Security risk              | Use httpOnly cookies      |
| Using `eval()`                          | Security risk              | Use safe parsing          |
| Using `console.log` in production       | Debug noise                | Use proper logging        |
| Using inline styles                     | Inconsistent styling       | Use Tailwind classes      |
| Using magic numbers                     | Unclear meaning            | Use named constants       |
| Using default exports                   | Unclear imports            | Use named exports         |

### 8.2 Common Mistakes

1. **Client Component Overuse** — Adding "use client" when not needed
2. **Prop Drilling** — Passing props through many levels
3. **State Management Chaos** — Using too many state management solutions
4. **Performance Neglect** — Not measuring or optimizing
5. **Security Afterthought** — Adding security later
6. **Testing Debt** — Skipping tests to save time
7. **Documentation Gap** — Not documenting decisions
8. **Dependency Bloat** — Adding unnecessary dependencies

---

## 9. Checklists

### 9.1 Before Starting Development

- [ ] Read BOOK-001 (AI Constitution)
- [ ] Read BOOK-003 (this document)
- [ ] Check existing patterns
- [ ] Understand the feature requirements
- [ ] Plan the implementation approach
- [ ] Identify affected packages
- [ ] Check performance implications
- [ ] Check security implications

### 9.2 During Implementation

- [ ] Follow existing code patterns
- [ ] Use TypeScript strict mode
- [ ] Use server components by default
- [ ] Add "use client" only when needed
- [ ] Use Tailwind for styling
- [ ] Use shared packages for reuse
- [ ] Handle errors gracefully
- [ ] Add loading states
- [ ] Write tests as you go

### 9.3 Before Committing

- [ ] Run `pnpm typecheck`
- [ ] Run `pnpm lint`
- [ ] Run `pnpm test`
- [ ] Check bundle size impact
- [ ] Check performance impact
- [ ] Check security implications
- [ ] Write conventional commit message
- [ ] Update documentation if needed

### 9.4 Before Merging

- [ ] All CI checks pass
- [ ] Code review approved
- [ ] Tests cover new code
- [ ] Documentation updated
- [ ] Performance budget met
- [ ] Security scan clean
- [ ] Accessibility verified
- [ ] Design system compliance checked

---

## 10. Acceptance Criteria

### 10.1 For Code Changes

A code change is compliant when:

1. TypeScript compiles in strict mode
2. ESLint reports zero warnings
3. All tests pass with > 80% coverage
4. Bundle size stays under budget
5. Lighthouse score remains >= 95
6. No security vulnerabilities introduced
7. Accessibility requirements met
8. Documentation updated
9. Design system tokens used correctly
10. Conventional commit format used

### 10.2 For Architecture Decisions

An architecture decision is compliant when:

1. It aligns with the Foundation's mission
2. It has been documented as an ADR
3. It has been reviewed by the Architecture Agent
4. It has been approved by the Governance Agent
5. It has been tested against performance budgets
6. It has been evaluated for security implications
7. It has been considered for long-term maintainability
8. It has been communicated to all stakeholders

### 10.3 For Technology Selection

Technology selection is compliant when:

1. It has been evaluated against at least 3 alternatives
2. It has a proven track record in production
3. It has active maintenance and community
4. It has acceptable license terms
5. It has acceptable bundle size
6. It has acceptable security posture
7. It has been documented in ADR
8. It has been approved by Architecture Agent

---

## 11. Automation Hooks

### 11.1 Pre-commit Hooks

```yaml
pre-commit:
  - name: TypeScript Check
    command: pnpm typecheck
    required: true
  - name: ESLint
    command: pnpm lint
    required: true
  - name: Prettier
    command: pnpm format
    required: true
  - name: Commit Message Validation
    command: commitlint --edit
    required: true
```

### 11.2 CI/CD Pipeline

```yaml
ci:
  - name: Build
    command: pnpm build
    required: true
  - name: Type Check
    command: pnpm typecheck
    required: true
  - name: Lint
    command: pnpm lint
    required: true
  - name: Test
    command: pnpm test
    required: true
  - name: Bundle Analysis
    command: next-build-visualizer
    required: true
  - name: Lighthouse
    command: lighthouse-ci
    required: true
  - name: Security Scan
    command: npm audit
    required: true
```

### 11.3 Performance Monitoring

```yaml
monitoring:
  - name: Lighthouse CI
    trigger: post-deploy
    action: lighthouse-ci --preset=performance
  - name: Bundle Size Check
    trigger: post-deploy
    action: next-build-visualizer --compare
  - name: Error Tracking
    trigger: on-error
    action: send-to-error-tracker
  - name: Performance Metrics
    trigger: continuous
    action: collect-web-vitals
```

---

## 12. Future Evolution

### 12.1 Planned Enhancements

1. **Automated Performance Budgets** — CI enforces performance limits
2. **Automated Security Scanning** — Continuous vulnerability detection
3. **Automated Accessibility Auditing** — WCAG compliance verification
4. **Automated Architecture Review** — AI-powered architecture analysis
5. **Automated Dependency Updates** — Dependabot-style updates
6. **Automated Bundle Analysis** — Real-time bundle size tracking
7. **Automated Performance Monitoring** — Real User Monitoring integration
8. **Automated Incident Response** — AI-powered incident detection and response

### 12.2 Evolution Process

Changes to this constitution require:

1. RFC submitted to `.ai/rfcs/`
2. Review by Architecture Agent
3. Approval by Governance Agent
4. Update to this document
5. Notification to all agents
6. Update to dependent documents

---

## 13. Appendices

### Appendix A: Technology Decision Matrix

| Criteria             | Weight | Technology A | Technology B | Technology C |
| -------------------- | ------ | ------------ | ------------ | ------------ |
| Performance          | 25%    |              |              |              |
| Developer Experience | 20%    |              |              |              |
| Community            | 15%    |              |              |              |
| Documentation        | 15%    |              |              |              |
| Security             | 15%    |              |              |              |
| Cost                 | 10%    |              |              |              |

### Appendix B: Related Documents

- BOOK-001: AI Constitution
- BOOK-002: Repository Constitution
- BOOK-005: Coding Constitution
- BOOK-010: Quality Constitution
- `.ai/architecture.md`: System architecture
- `.ai/coding-standards.md`: Coding standards
- `standards/architecture.md`: Architecture standards

---

_This document defines the technical law of Bhavya OS. All engineering decisions must comply with these rules._
