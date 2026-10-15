# DATA-FLOW — Data Flow Architecture

**Date:** 2026-10-12
**Source:** Repository inspection

---

## Data Flow Overview

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   CONTENT   │────▶│  BUILD TIME │────▶│  EDGE CACHE │────▶│   VISITOR   │
│  (MDX/JSON) │     │  (Next.js)  │     │ (Cloudflare)│     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   TURSO     │
                    │  (libSQL)   │
                    └─────────────┘
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
       ┌──────────┐ ┌──────────┐ ┌──────────┐
       │ CURRICULUM│ │ PROGRESS │ │ ANALYTICS│
       │  MODULES  │ │  DATA    │ │  EVENTS  │
       └──────────┘ └──────────┘ └──────────┘
```

---

## Content Pipeline (Build-Time)

### Source Content

| Source       | Format          | Location                                   | Validation                      |
| ------------ | --------------- | ------------------------------------------ | ------------------------------- |
| Constitution | Markdown        | `docs/constitution/`                       | Manual review                   |
| Governance   | Markdown + JSON | `content/governance/`, `content/policies/` | `@bhavya/content-core validate` |
| Curriculum   | TypeScript      | `src/data/curriculum/`                     | TypeScript compile              |
| Standards    | TypeScript      | `src/data/standards/`                      | TypeScript compile              |
| Missions     | JSON            | `content/forest/`, `content/knowledge/`    | Schema validation               |
| Pages        | MDX             | `content/*.mdx`                            | Frontmatter schema              |

### Build Process

1. **TypeScript Compilation** — `tsc --noEmit` (typecheck)
2. **Next.js Build** — `next build` (SSG/SSR/ISR)
3. **Static Generation** — Public pages pre-rendered
4. **Asset Optimization** — Images, fonts (manual currently)
5. **Bundle Analysis** — Not currently automated

### Output

| Artifact             | Location                        | Deployment              |
| -------------------- | ------------------------------- | ----------------------- |
| Static HTML/CSS/JS   | `.next/server/app/`             | Cloudflare Pages/Assets |
| Serverless Functions | `.next/server/chunks/`          | Cloudflare Workers      |
| Static Assets        | `public/` → `.next/static/`     | Cloudflare CDN          |
| Prerendered Pages    | `.next/server/app/**/page.html` | Edge cache              |

---

## Runtime Data Flows

### 1. Public Page Request (Anonymous)

```
Visitor
  │
  ▼
Cloudflare CDN
  │  ├─ Cache HIT → Static response (instant)
  │  └─ Cache MISS
  │       ▼
  │  Cloudflare Worker (Next.js)
  │       │
  │       ├─ Turso READ (public data: curriculum, missions, impact)
  │       │       └─ Returns JSON → Page render
  │       │
  │       └─ Response → CDN Cache (stale-while-revalidate)
  │
  ▼
Browser renders page
```

### 2. Authenticated Request (Student/Volunteer/etc.)

```
Visitor (with Supabase JWT cookie)
  │
  ▼
Cloudflare Worker
  │
  ├─ Middleware: Validate JWT → Supabase
  │       ├─ Valid → Attach user to request
  │       └─ Invalid → 401 / Redirect to /login
  │
  ├─ Route Policy Check (src/lib/route-policy.ts)
  │       ├─ Role matches → Continue
  │       └─ Role mismatch → 403 / Redirect
  │
  ▼
API Route / Page Component
  │
  ├─ Supabase: getUser(), getSession()
  ├─ Turso: READ/WRITE application data
  │       ├─ module_progress (upsert)
  │       ├─ audit_events (append)
  │       └─ user preferences
  │
  └─ B2: Generate presigned URLs for assets
        └─ Return URL → Component
```

### 3. Curriculum Progress Flow

```
Student completes lesson
  │
  ▼
Client: Optimistic UI update
  │
  ▼
Batch progress (debounced 30s / on navigation)
  │
  ▼
POST /api/progress/module/[id]
  │
  ▼
Middleware: Auth + Rate limit
  │
  ▼
Handler:
  ├─ Validate module exists (ai-registry)
  ├─ Validate user enrollment
  ├─ Turso: UPSERT module_progress
  │       ├─ lessons_completed (JSON array)
  │       ├─ quiz_score
  │       └─ completed_at
  ├─ Turso: INSERT audit_events
  └─ Return updated progress
  │
  ▼
Client: Confirm / Sync UI
```

### 4. Asset Upload Flow (3D Models, Textures)

```
Admin uploads file
  │
  ▼
Client: POST /api/upload/presign
  │
  ▼
Handler: Validate auth (admin), file type, size
  │
  ▼
B2: Generate presigned PUT URL (1hr expiry)
  │
  ▼
Client: PUT file directly to B2
  │
  ▼
Client: POST /api/upload/complete
  │
  ▼
Handler:
  ├─ Verify file exists in B2 (HEAD)
  ├─ Calculate checksum
  ├─ Turso: INSERT media_assets
  │       ├─ key, checksum, size, mime
  │       ├─ uploaded_by, approved=false
  └─ Return asset record
  │
  ▼
Admin: Review → Approve → Publish
```

---

## Database Schema (Key Tables)

### Supabase (Auth)

```sql
-- users (managed by Supabase Auth)
-- sessions (managed by Supabase Auth)
-- audit_events (custom, append-only)
CREATE TABLE audit_events (
  id TEXT PRIMARY KEY,
  actor_id TEXT,
  actor_email TEXT NOT NULL DEFAULT '',
  action TEXT NOT NULL,
  resource TEXT NOT NULL DEFAULT '',
  resource_id TEXT NOT NULL DEFAULT '',
  result TEXT NOT NULL DEFAULT 'success',
  metadata TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### Turso / SQLite (Application Data)

```sql
-- users (synced from Supabase)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar TEXT,
  role TEXT NOT NULL DEFAULT 'student',
  provider TEXT NOT NULL DEFAULT 'email',
  interests TEXT NOT NULL DEFAULT '[]',
  onboarding_complete INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- module_progress (core curriculum tracking)
CREATE TABLE module_progress (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  module_id TEXT NOT NULL,
  lessons_completed TEXT NOT NULL DEFAULT '[]',
  quiz_score INTEGER,
  completed_at TEXT,
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (user_id, module_id)
);

-- _migrations (schema versioning)
CREATE TABLE _migrations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  checksum TEXT NOT NULL,
  applied_at TEXT DEFAULT (datetime('now'))
);
```

---

## Supabase → Turso Sync (Not Yet Implemented)

### Required Pipeline

```
Supabase (Auth DB)
  │
  ├─ pg_logical replication → Cloudflare Worker / Cron
  │       │
  │       ▼
  │  Transform: Filter public tables only
  │       ├─ users (id, email, name, role, avatar)
  │       ├─ audit_events (public subset)
  │       └─ module_progress (if mirrored)
  │       │
  ▼       ▼
Turso (libSQL) ──▶ Edge Replicas
  │
  ├─ Public curriculum data
  ├─ Published impact metrics
  ├─ Search indexes
  └─ Analytics aggregates
```

### Tables to Sync (One-Way)

| Supabase Table    | Turso Table       | Frequency     | Filter                |
| ----------------- | ----------------- | ------------- | --------------------- |
| `users`           | `users`           | Near-realtime | Public fields only    |
| `audit_events`    | `audit_events`    | Hourly        | Non-sensitive actions |
| `module_progress` | `module_progress` | On-write      | All (for analytics)   |

---

## API Endpoints (Current)

### Public API

| Endpoint                       | Method | Purpose                    | Cache |
| ------------------------------ | ------ | -------------------------- | ----- |
| `/api/curriculum/modules`      | GET    | List modules by band/level | 1hr   |
| `/api/curriculum/modules/[id]` | GET    | Module detail              | 1hr   |
| `/api/curriculum/standards`    | GET    | Standards list             | 1hr   |
| `/api/missions`                | GET    | Mission data               | 1hr   |
| `/api/impact/metrics`          | GET    | Public impact metrics      | 5min  |
| `/api/search`                  | GET    | Unified search             | 5min  |

### Authenticated API

| Endpoint                      | Method   | Purpose            | Auth    |
| ----------------------------- | -------- | ------------------ | ------- |
| `/api/progress/module/[id]`   | GET/POST | Module progress    | Student |
| `/api/progress/course/[id]`   | GET      | Course progress    | Student |
| `/api/enroll`                 | POST     | Course enrollment  | Student |
| `/api/upload/presign`         | POST     | B2 presigned URL   | Admin   |
| `/api/upload/complete`        | POST     | Confirm upload     | Admin   |
| `/api/admin/users`            | GET      | User management    | Admin   |
| `/api/admin/content/validate` | POST     | Content validation | Admin   |

---

## Event Flow (Audit & Analytics)

```
User Action
  │
  ▼
Middleware / Handler
  │
  ├─ Turso: INSERT audit_events (append-only)
  │       ├─ actor_id, actor_email
  │       ├─ action (e.g., "lesson_complete", "module_enroll")
  │       ├─ resource, resource_id
  │       ├─ result (success/error)
  │       ├─ metadata (JSON)
  │       └─ created_at
  │
  ├─ Analytics Queue (if implemented)
  │       └─ Batch → Analytics DB
  │
  └─ Real-time (if enabled)
          └─ Supabase Realtime → Admin dashboard
```

---

## Data Classification & Access Control

| Classification   | Examples                               | Storage              | Access                     |
| ---------------- | -------------------------------------- | -------------------- | -------------------------- |
| **Public**       | Published curriculum, missions, impact | Turso (read replica) | Anonymous CDN              |
| **Internal**     | Draft content, internal notes          | Turso (primary)      | Authenticated              |
| **Confidential** | Donor details, finance, board packs    | Supabase + Turso     | Role-based (admin/trustee) |
| **Safeguarded**  | Child data, incidents, consents        | Supabase (RLS)       | Safeguarding lead only     |

---

## Free Tier Data Limits

| Service            | Limit          | Current Est. Usage    | Headroom |
| ------------------ | -------------- | --------------------- | -------- |
| Supabase DB        | 500 MB         | ~50 MB (users, audit) | 90%      |
| Supabase Realtime  | 200 concurrent | 0 (not used)          | 100%     |
| Turso Storage      | 5 GB           | ~100 MB (curriculum)  | 98%      |
| Turso Reads        | 500M rows/mo   | ~10M/mo               | 98%      |
| Turso Writes       | 10M rows/mo    | ~100K/mo              | 99%      |
| Cloudflare Workers | 100K req/day   | ~20K/day              | 80%      |
| B2 Storage         | 10 GB/mo       | ~0 GB (not deployed)  | 100%     |
