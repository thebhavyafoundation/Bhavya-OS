# Slice 1 — Architecture Notes

## Technology Stack

| Layer     | Technology                | Reason                       |
| --------- | ------------------------- | ---------------------------- |
| Framework | Next.js 15 (App Router)   | SSR, SSG, API routes         |
| UI        | React 19 + Tailwind CSS 4 | Component-based, utility CSS |
| Database  | SQLite (better-sqlite3)   | Local-first, no server       |
| Language  | TypeScript                | Type safety                  |
| Monorepo  | pnpm + Turborepo          | Workspace management         |

## Database Design

SQLite with WAL mode for concurrent reads:

```
repositories → knowledge_packages (FK)
activity_events (independent)
technology_radar (independent)
recommendations (independent)
```

## API Design

RESTful routes using Next.js Route Handlers:

- GET `/api/resource` — List resources
- POST `/api/resource` — Create resource
- GET `/api/resource/[id]` — Get single resource

## Component Architecture

```
Dashboard (page.tsx)
├── Sidebar (navigation)
├── CommandPalette (⌘K search)
└── Widgets
    ├── StatCard (metrics)
    ├── ActivityFeed (events)
    ├── RepositoryWidget (repos)
    ├── KnowledgeWidget (packages)
    ├── RadarWidget (technology)
    └── RecommendationWidget (recs)
```

## Data Flow

1. Page loads → useEffect fires
2. Fetch `/api/repositories`, `/api/knowledge`, `/api/activity`
3. API routes query SQLite
4. Data returned as JSON
5. Components render with data

## Design Decisions

1. **Client-side rendering for dashboard** — Dashboard needs interactivity, no SEO requirement
2. **SQLite over PostgreSQL** — Hardware constraint (Intel i3, 8GB RAM)
3. **No ORM** — better-sqlite3 is fast and simple
4. **Static seed data** — Demo data for immediate usability
5. **Component co-location** — Widgets in single file for simplicity
