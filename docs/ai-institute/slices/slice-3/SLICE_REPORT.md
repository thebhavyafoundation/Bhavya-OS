# Slice 3 — Project OS (Build, Don't Consume)

## Status: COMPLETE

## Date: 2026-08-04

## Mission

Transform learning into building. Projects become the primary learning unit. Lessons become support material.

## What Was Built

### Project Runtime (`packages/project-runtime/`)

- **ProjectEngine** — Milestone tracking, task management, portfolio generation, repository generation
- **AIProjectCoach** — Project-aware coaching (clarify, suggest, review, encourage, question, recommend)
- **PortfolioExporter** — Export as JSON, Markdown, LinkedIn post, or GitHub repository structure
- **Core Types** — Project, Milestone, Task, Reflection, KnowledgePackage, ProjectDNA, ProjectPortfolio, RepositoryStructure

### First Flagship Project

- **Build Your First AI Assistant** — 6 milestones, 18 tasks
- Milestone 1: Understand the Problem
- Milestone 2: Design the Solution
- Milestone 3: Build
- Milestone 4: Document
- Milestone 5: Reflect
- Milestone 6: Publish

### Project Workspace (`apps/ai-institute/src/app/projects/`)

- `/projects` — Project list page
- `/projects/[id]` — Full project workspace with 5 tabs:
  - Overview (objectives, milestones, knowledge packages)
  - Milestones (task completion, evidence capture)
  - AI Coach (project-aware coaching)
  - Learning Journal (reflection after each milestone)
  - Portfolio (export as Markdown, JSON, LinkedIn post)

### Dashboard Updated

- Added "Open Projects" link to Quick Actions

## Architecture

```
packages/project-runtime/
├── types/index.ts          — Core interfaces
├── engine/project-engine.ts — Project CRUD, milestone tracking, portfolio generation
├── mentor/project-coach.ts  — AI coaching for projects
├── portfolio/exporter.ts    — Export as JSON/Markdown/LinkedIn/GitHub
└── index.ts                — Package exports
```

## How It Works

1. Student starts a project
2. Project is created with 6 milestones
3. First milestone is unlocked
4. Student completes tasks within milestones
5. AI Coach provides guidance at each step
6. Student reflects after each milestone
7. All milestones complete → project complete
8. Student exports portfolio artifact
9. Student generates GitHub repository structure

## Quality Gates

| Gate                           | Status |
| ------------------------------ | ------ |
| Project can be started         | PASS   |
| Milestones track progress      | PASS   |
| Tasks can be completed         | PASS   |
| AI Coach provides guidance     | PASS   |
| Reflections are captured       | PASS   |
| Portfolio can be exported      | PASS   |
| Repository structure generated | PASS   |
| Build passes                   | PASS   |

## Files Changed

### New Packages

- `packages/project-runtime/` — Complete project runtime

### New Pages

- `apps/ai-institute/src/app/projects/page.tsx` — Project list
- `apps/ai-institute/src/app/projects/[id]/page.tsx` — Project workspace

### Updated Files

- `apps/ai-institute/package.json` — Added @bhavya/project-runtime
- `apps/ai-institute/src/app/dashboard/page.tsx` — Added Projects link
- `apps/ai-institute/src/data/projects.ts` — First flagship project data

## Next Steps

1. Student starts "Build Your First AI Assistant" project
2. Works through milestones with AI coaching
3. Completes reflection after each milestone
4. Exports portfolio artifact
5. Generates GitHub repository
6. Shares on LinkedIn
7. Moves to open-source contribution
