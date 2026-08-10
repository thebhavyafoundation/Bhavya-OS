# CANONICAL PRODUCT ARCHITECTURE

**Date:** 2026-08-10
**Status:** ACTIVE
**Owner:** Bhavya Foundation Architecture
**Last updated:** 2026-08-10
**Applies To:** All applications, packages, and deployments

---

## Product Statement

```text
BHAVYA FOUNDATION
        ↓
ONE CANONICAL WEB EXPERIENCE
        ↓
ONE CANONICAL USER EXPERIENCE
        ↓
ONE CANONICAL PUBLIC DOMAIN
        ↓
ONE CANONICAL VERCEL DEPLOYMENT
```

The user must never experience separate "websites." They experience **Bhavya Foundation**.

---

## Architecture

```text
                 apps/ai-institute
                         │
       ┌─────────────────┼──────────────────┐
       ↓                 ↓                  ↓
 platform-ui         shared            domain packages
                                           │
                 ┌────────┬────────┬───────┼───────┐
                 ↓        ↓        ↓       ↓       ↓
             knowledge academy research intelligence compliance
```

The canonical application consumes reusable packages. No app-to-app dependencies.

---

## Product Hierarchy

```
BHAVYA FOUNDATION (product)
    │
    ├── FOREST (pillar)
    ├── KNOWLEDGE (pillar)
    │   ├── AI
    │   ├── Academy
    │   ├── Library
    │   └── Research
    ├── HERITAGE (pillar)
    └── COMMUNITY (pillar)
```

## Route Architecture

```text
BHAVYA FOUNDATION (apps/ai-institute)
        │
        ├── PUBLIC WEB
        │   ├── / (homepage — Bhavya Foundation)
        │   ├── /forest
        │   ├── /knowledge
        │   ├── /heritage
        │   ├── /community
        │   ├── /about
        │   ├── /mission
        │   ├── /programs
        │   ├── /transparency/*
        │   ├── /resources
        │   ├── /donate
        │   ├── /privacy
        │   └── /accessibility
        │
        ├── KNOWLEDGE
        │   ├── /knowledge
        │   ├── /knowledge/academy
        │   ├── /knowledge/courses
        │   ├── /knowledge/courses/[id]
        │   ├── /knowledge/courses/[id]/lessons/[lessonId]
        │   ├── /knowledge/library
        │   ├── /knowledge/research
        │   ├── /knowledge/ai
        │   ├── /knowledge/mentor
        │   ├── /knowledge/projects
        │   ├── /knowledge/credentials
        │   └── /knowledge/graph
        │
        ├── MY BHAVYA (authenticated)
        │   ├── /app
        │   ├── /app/learn
        │   ├── /app/community
        │   ├── /app/knowledge
        │   ├── /app/missions
        │   ├── /app/projects
        │   ├── /app/credentials
        │   ├── /app/contributions
        │   └── /app/profile
        │
        └── BHAVYA OS (internal)
            ├── /os
            ├── /os/governance
            ├── /os/observability
            ├── /os/runtime
            ├── /os/knowledge
            ├── /os/memory
            └── /os/search
```

---

## Product Consolidation vs Domain Consolidation

### Product consolidation (DONE)

- One user experience
- One deployment
- One navigation
- One design system
- One domain

### Domain consolidation (NOT done — and should NOT be)

- Each domain retains its own package
- Security boundaries remain modular
- Domain logic is extracted to packages, not flattened into one module

```text
packages/intelligence     → /os/intelligence
packages/github           → /os/github
packages/ioc              → /os/ioc
packages/social           → /os/social
packages/curriculum       → /os/studio
packages/assessment       → academy assessment
packages/knowledge        → /os/knowledge
packages/governance       → /os/docs
```

---

## Vercel Architecture

```text
GitHub repository
       ↓
apps/ai-institute (canonical app)
       ↓
ONE Vercel project: bhavya-foundation
       ↓
Production: bhavyafoundation.org
```

`apps/design-system` may remain as a separate Vercel project (developer tool).

---

## Design System

One canonical design system: `@bhavya/platform-ui`

- Tokens: `packages/platform-ui/src/styles/tokens.css`
- Components: `packages/platform-ui/src/components/`
- All UI changes consume platform-ui — no application-created foundational components

---

## Acceptance Criteria

A new user must be able to:

```text
BHAVYA FOUNDATION
        ↓
Mission
        ↓
Learn
        ↓
Academy
        ↓
Course
        ↓
Lesson
        ↓
Video
        ↓
Assessment
        ↓
Progress
```

without ever feeling they left Bhavya Foundation.

An internal creator must be able to:

```text
BHAVYA FOUNDATION
        ↓
OS
        ↓
Knowledge
        ↓
ICM Curriculum
        ↓
Lesson Studio
        ↓
Video Studio
        ↓
Quality Gate
        ↓
Publish
        ↓
Academy
```

without switching applications.
