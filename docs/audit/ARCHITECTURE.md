# ARCHITECTURE — Current System Architecture

**Date:** 2026-10-12
**Source:** Repository inspection

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        VISITOR                                    │
└─────────────────────────┬───────────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│              CLOUDFLARE EDGE NETWORK                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   Static    │  │   Cached    │  │   Worker    │              │
│  │   Assets    │  │   Pages     │  │   API       │              │
│  │  (Pages)    │  │  (KV/CDN)   │  │  (API Routes)            │
│  └─────────────┘  └─────────────┘  └──────┬──────┘              │
└───────────────────────────────────────────┼─────────────────────┘
                                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AUTHENTICATED REQUEST                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │  Supabase   │  │  Turso      │  │  B2 Storage │              │
│  │   Auth      │  │  (libSQL)   │  │  (S3 API)   │              │
│  │  (JWT)      │  │  App Data   │  │  3D Assets  │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Layer Breakdown

### 1. Edge Layer (Cloudflare)

| Component          | Technology                                 | Purpose                                   |
| ------------------ | ------------------------------------------ | ----------------------------------------- |
| **Static Hosting** | Cloudflare Pages / Workers Assets          | Next.js static export + `public/` assets  |
| **Edge Compute**   | Cloudflare Workers (opennextjs-cloudflare) | API routes, middleware, SSR               |
| **Caching**        | Cloudflare CDN + KV                        | Stale-while-revalidate for public content |
| **Routing**        | Workers routing + Next.js middleware       | Auth, rate-limit, route policy            |

### 2. Application Layer (Next.js 15 App Router)

| Area                     | Implementation                                                           |
| ------------------------ | ------------------------------------------------------------------------ |
| **Public Routes**        | `/`, `/missions`, `/knowledge`, `/curriculum`, `/governance`, etc. (60+) |
| **Authenticated Routes** | `/app/*` — role-aware dashboards                                         |
| **OS Routes**            | `/os/*` — internal operations (admin, governance, runtime)               |
| **API Routes**           | `src/app/api/*` — curriculum, auth, progress, upload                     |
| **Middleware**           | `src/middleware.ts` — auth validation, route protection, rate limiting   |

### 3. Data Layer

| Database           | Role                     | Technology                            |
| ------------------ | ------------------------ | ------------------------------------- |
| **Supabase**       | Auth, Identity, Sessions | PostgreSQL + RLS + `@supabase/ssr`    |
| **Turso (libSQL)** | Application Data (Prod)  | HTTP-based SQLite, edge replicas      |
| **SQLite (Local)** | Development Data         | better-sqlite3 via `@bhavya/database` |

### 4. Storage Layer

| Storage              | Purpose                           | Access                            |
| -------------------- | --------------------------------- | --------------------------------- |
| **Backblaze B2**     | 3D models, textures, large assets | S3-compatible API, presigned URLs |
| **Vercel Blob**      | Alternative uploads               | `@vercel/blob` SDK                |
| **Supabase Storage** | Avatars, small uploads            | Supabase SDK                      |

### 5. Content Layer

| Source               | Format             | Consumption                           |
| -------------------- | ------------------ | ------------------------------------- |
| `content/`           | MDX + JSON         | `@bhavya/content-core` validation     |
| `src/data/`          | TypeScript modules | Direct import (curriculum, standards) |
| `docs/constitution/` | Markdown           | Reference only                        |
| `docs/adr/`          | Markdown           | Architecture decisions                |

---

## Request Flow

### Public Page Request

```
Visitor → Cloudflare CDN
  ├─ Cache HIT → Static HTML/CSS/JS (instant)
  └─ Cache MISS → Cloudflare Worker
       ├─ Next.js render (SSR/SSG)
       ├─ Turso read (public data)
       └─ Response → CDN cache
```

### Authenticated Request

```
Visitor → Cloudflare Worker
  ├─ Middleware: Validate Supabase JWT
  ├─ Route policy check (role, tier)
  ├─ API Route / Page render
  │   ├─ Supabase: User session, roles
  │   ├─ Turso: Application data (progress, curriculum)
  │   └─ B2: Presigned URLs for assets
  └─ Response
```

### Asset Delivery (3D Models, Textures)

```
Page → B2 Presigned URL → Backblaze B2 → Visitor
      (via Cloudflare CDN cache)
```

---

## Authentication & Authorization

### Supabase Integration

- **Client**: `@supabase/ssr` browser client (anon key)
- **Server**: `@supabase/ssr` server client (cookie-based)
- **Middleware**: Token validation, session refresh
- **Roles**: student, volunteer, donor, researcher, mentor, educator, admin, trustee

### Route Protection (`src/middleware.ts` + `src/lib/route-policy.ts`)

| Route Pattern             | Protection    | Required Role  |
| ------------------------- | ------------- | -------------- |
| `/app/*`                  | Authenticated | Any            |
| `/os/*`                   | Authenticated | admin, trustee |
| `/os/admin`               | Authenticated | admin          |
| `/curriculum/*/lessons/*` | Authenticated | student        |
| `/api/progress/*`         | Authenticated | student        |

---

## Curriculum Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  TypeScript │────▶│  Registry   │────▶│  Components │
│  Modules    │     │  (ai-registry)         │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Standards  │
                    │  Mapping    │
                    └─────────────┘
                           │
                           ▼
                    ┌─────────────┐     ┌─────────────┐
                    │  Progress   │◀───▶│   Turso     │
                    │  (module_   │     │  (prod)     │
                    │   progress) │     └─────────────┘
                    └─────────────┘
```

---

## Deployment Pipeline

### CI (`.github/workflows/ci.yml`)

1. **Checkout** → pnpm install → antislop → lint → typecheck
2. **Secret Scan** → Gitleaks + pattern scan
3. **Test** → Vitest (unit)
4. **Build** → `pnpm build` (turbo)

### CD — Cloudflare (`.github/workflows/deploy-cloudflare.yml`)

- Trigger: push to `master`
- Build: `npx opennextjs-cloudflare build` (4GB Node memory)
- Deploy: `npx opennextjs-cloudflare deploy`
- Secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
- Runtime secrets: Set manually via `wrangler secret put`

### CD — Vercel (`.github/workflows/deploy.yml`)

- Trigger: push to `main`, PR to `main`
- Build: `vercel build`
- Deploy: `vercel deploy --prebuilt` (prod on main)

---

## Key Architectural Decisions (ADRs)

| ADR     | Decision                              | Status   |
| ------- | ------------------------------------- | -------- |
| ADR-001 | `@bhavya/shared` as canonical types   | Accepted |
| ADR-002 | UI consolidation into `platform-ui`   | Accepted |
| ADR-003 | Circular dependency prevention        | Accepted |
| ADR-004 | Layer architecture enforcement        | Accepted |
| ADR-005 | Contract freezing                     | Accepted |
| ADR-006 | Quality gates (lint, typecheck, test) | Accepted |
| ADR-007 | ADR standard format                   | Accepted |
| ADR-008 | Provider-agnostic AI gateway          | Accepted |
| ADR-009 | Release train governance              | Accepted |
| ADR-010 | App-003 roadmap discipline            | Accepted |
| ADR-011 | GitHub intelligence boundaries        | Accepted |
| ADR-012 | Deterministic registry generation     | Accepted |
| ADR-013 | Domain-owned memory system            | Accepted |
| ADR-014 | ICM adoption                          | Accepted |

---

## Free-Tier Constraints & Ceilings

| Service                | Free Limit     | Current Risk                | Mitigation               |
| ---------------------- | -------------- | --------------------------- | ------------------------ |
| **Supabase DB**        | 500 MB         | Medium (curriculum + users) | Archive old audit events |
| **Supabase Realtime**  | 200 concurrent | Low (not used for learners) | Polling for progress     |
| **Supabase Auth**      | 50k MAU        | Low                         | —                        |
| **Turso Storage**      | 5 GB           | Low                         | —                        |
| **Turso Reads**        | 500M rows/mo   | Medium (curriculum queries) | Cache public data        |
| **Turso Writes**       | 10M rows/mo    | Low                         | Batch progress updates   |
| **Cloudflare Workers** | 100K req/day   | Medium (API traffic)        | Cache aggressively       |
| **Cloudflare Pages**   | 500 builds/mo  | Low                         | —                        |
| **B2 Storage**         | 10 GB/mo       | Low                         | Lifecycle rules          |

---

## Technical Debt

1. **Duplicate CinematicScene** — Two identical `CinematicScene` functions in `CinematicHero.tsx` (lines 170-244 and 285-359)
2. **Large Globals CSS** — 126KB `globals.css` with inline styles, should use tokens
3. **Playwright Config Missing** — No `playwright.config.ts` in ai-institute
4. **B2 Client Credentials** — Exposed in browser bundle (should use presigned URLs only)
5. **Unused Packages** — 60+ workspace packages, some legacy stubs without package.json
6. **Phantom Domain Ownership** — `DOMAIN_OWNERSHIP.md` references non-existent packages
7. **Bundle Analysis** — No bundle size monitoring in CI
8. **Image Optimization** — `images.unoptimized: true` in next.config
9. **GSAP License** — Commercial license needed for production
10. **Asset Manifest** — No automated B2 manifest generation in CI
