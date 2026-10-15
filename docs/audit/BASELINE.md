# BASELINE — Inspection Report

**Date:** 2026-10-12
**Inspector:** OpenCode Agent
**Repository:** thebhavyafoundation/Bhavya-OS
**Branch:** master (3b06078)

---

## Confirmed Framework and Versions

| Component                 | Version                                                        | Notes                                  |
| ------------------------- | -------------------------------------------------------------- | -------------------------------------- |
| **Framework**             | Next.js 15.5.25 (App Router)                                   | `apps/ai-institute/package.json`       |
| **React**                 | 19.0.0                                                         | `apps/ai-institute/package.json`       |
| **TypeScript**            | 5.9.2                                                          | Root & app configs                     |
| **Package Manager**       | pnpm 10.17.1                                                   | `pnpm-lock.yaml`, `package.json`       |
| **Build Target**          | Cloudflare Workers (opennextjs-cloudflare)                     | `wrangler.json`, `next.config.mjs`     |
| **Styling**               | Tailwind CSS 4 + CSS Variables (tokens.css)                    | `globals.css` imports tokens.css       |
| **Animation**             | Framer Motion 13, GSAP 3.15, Lenis 1.3                         | Motion lib at `src/lib/motion/`        |
| **3D**                    | Three.js 0.186, @react-three/fiber 9.8, @react-three/drei 10.7 | Heavy usage in `components/three/`     |
| **Database (Local)**      | better-sqlite3 via @bhavya/database                            | SQLite at `packages/database/`         |
| **Database (Production)** | Turso (libSQL)                                                 | `src/lib/sqlite.ts`, `src/lib/db.ts`   |
| **Auth**                  | Supabase (ssr)                                                 | `@supabase/ssr`, `src/lib/supabase/`   |
| **Object Storage**        | Backblaze B2 (S3-compatible)                                   | `src/lib/b2/`                          |
| **Alternative Storage**   | Vercel Blob                                                    | `@vercel/blob` in deps                 |
| **Testing**               | Vitest 3.2 (unit), Playwright MCP (e2e)                        | `vitest.config.ts`, `.playwright-mcp/` |
| **Linting**               | ESLint 9, TypeScript strict                                    | `eslint.config.mjs`, `tsconfig.json`   |
| **CI/CD**                 | GitHub Actions                                                 | `.github/workflows/`                   |

---

## Repository Structure

```
Bhavya-OS/
├── apps/
│   └── ai-institute/          # CANONICAL HOST (Next.js 15)
│       ├── src/
│       │   ├── app/           # App Router routes (60+ route segments)
│       │   ├── components/    # 15 component categories
│       │   ├── lib/           # 15 lib categories (auth, b2, curriculum, db, motion, etc.)
│       │   ├── data/          # Static curriculum data (86 modules, lessons, assessments)
│       │   ├── hooks/         # Custom React hooks
│       │   ├── types/         # Curriculum types
│       │   └── middleware.ts  # Auth, rate-limit, route policy
│       ├── public/            # 3D assets (Poly Haven models, textures)
│       ├── wrangler.json      # Cloudflare Workers config
│       └── package.json
├── packages/
│   ├── platform-ui/           # Design system (tokens.css, 22+ components)
│   ├── database/              # SQLite abstraction (better-sqlite3, libSQL)
│   ├── content-core/          # Content validation & scaffolding
│   ├── runtime/               # AI runtime engine
│   ├── video-engine/          # Video generation (Remotion)
│   ├── intelligence/          # Intelligence orchestration
│   ├── security/              # Auth strategies, crypto, rate-limit
│   └── 50+ other packages     # See packages/CONTEXT.md
├── content/                   # Canonical content (MDX + JSON)
│   ├── forest/                # 100+ JSON files (sites, plantings, monitoring)
│   ├── governance/            # 6 governance documents
│   ├── knowledge/             # Curriculum standards
│   └── policies/              # Policy documents
├── docs/
│   ├── architecture/          # 20+ architecture docs (ADRs, route maps, domain ownership)
│   ├── constitution/          # 10 constitutional documents
│   └── adr/                   # 14 Architecture Decision Records
├── .github/workflows/         # 4 workflows (CI, deploy to Vercel, Cloudflare, GitHub Pages)
├── scripts/                   # 14 utility scripts (build, deploy, registry, tokens)
├── prototypes/                # 4 experimental apps (Astro, Nextra, Fumadocs)
└── standards/                 # 12 engineering standards
```

---

## Existing Hosting Configuration

| Environment         | Target             | Configuration                                                               |
| ------------------- | ------------------ | --------------------------------------------------------------------------- |
| **Production**      | Cloudflare Workers | `apps/ai-institute/wrangler.json`, `deploy-cloudflare.yml`                  |
| **Preview (PR)**    | Vercel             | `vercel.json`, `deploy.yml`                                                 |
| **Static Assets**   | GitHub Pages       | `pages.yml` (public/ only)                                                  |
| **Database (Prod)** | Turso              | `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` (Wrangler secrets)                 |
| **Auth**            | Supabase           | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`                 |
| **Object Storage**  | Backblaze B2       | `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_BUCKET_NAME` |

---

## Existing Database and Authentication Integration

### Database Layer (`packages/database/`, `apps/ai-institute/src/lib/db.ts`)

- **Dual-mode**: Local (better-sqlite3) ↔ Production (Turso/libSQL)
- **Async adapter** for Vercel/Cloudflare compatibility
- **Baseline schema**: users, sessions, audit_events, module_progress, _migrations
- **Migrations**: 6 migrations in `packages/database/migrations/ai-institute/`
- **Init pattern**: `initDatabase()` called once at startup (idempotent)

### Authentication (`apps/ai-institute/src/lib/supabase/`, `src/lib/auth/`)

- **Supabase SSR** (`@supabase/ssr`) for Next.js App Router
- **Client & Server clients** with cookie-based session management
- **Auth Strategy** (`SupabaseStrategy`) implements `@bhavya/security` interface
- **Middleware** (`src/middleware.ts`): auth validation, rate-limiting, route policy enforcement
- **Role-based access**: Student, Volunteer, Donor, Researcher, Mentor, Educator, Admin, Trustee

---

## Existing Visual and Motion Systems

### Design Tokens (`packages/platform-ui/src/styles/tokens.css` — 689 lines)

- **Colors**: Forest (primary), Ivory (secondary), Gold (accent), Sage, Earth scales
- **Semantic tokens**: Light/dark mode via `.dark` class
- **Typography**: Playfair Display (display), Inter (sans), JetBrains Mono (mono)
- **Spacing**: 8pt grid (--space-1 through --space-40)
- **Motion**: Duration tokens, easing curves, stagger, parallax speeds
- **Glass system**: `.glass`, `.glass-heavy`, `.glass-forest`, `.glass-gold`
- **Data viz palette**: 8 brand-compliant hues with bg/border variants

### Components (`packages/platform-ui/src/components/`)

- 22+ components: Button, Card, Modal, Toast, Tabs, Sidebar, DataTable, etc.
- Exported via `src/index.ts` with path aliases

### Motion (`apps/ai-institute/src/lib/motion/`)

- **Apple Springs**: damping/response spring system (`apple-springs.ts`)
- **Scroll Provider**: Framer Motion scroll-linked animations (`scrollProvider.tsx`)
- **Direct Manipulation**: Velocity tracking, rubber-band, momentum projection
- **Scroll Reveal**: IntersectionObserver-based reveal animations

### 3D System (`apps/ai-institute/src/components/three/`)

- **CinematicHero**: Pillar-specific 3D scenes (Forest, Knowledge, Heritage, Community)
- **Particle Systems**: 4 pillar-specific particle systems
- **Lazy loading**: Dynamic imports with Suspense fallbacks
- **Reduced motion**: Gradient fallback overlay
- **Quality tiers**: Mobile/desktop budgets defined in code comments

---

## Existing Curriculum Capabilities

### Data Structure

- **86 Modules** across 4 bands: junior-a (12), junior-b, core (L0-L6), advanced (ADV)
- **Lesson blocks**: 9 block types (visual, prose, quiz, interactive, experiment, project)
- **Widgets**: 11 interactive widget specs (tap-match, sort-basket, predict-reveal, etc.)
- **Standards**: 4 sources (USA CA, China MOE, UNESCO, OECD) mapped to modules
- **Assessments**: Quiz questions with feedback, module quizzes

### UI Components (`apps/ai-institute/src/components/curriculum/`)

- **CurriculumHero3D**: Band-specific 3D hero with lazy loading
- **BentoModuleGrid**: Module grid with progress indicators
- **KnowledgeAlignedLessonPlayer**: Lesson player with block rendering
- **ModuleQuiz**: Assessment component
- **PinnedLessonSidebar**: Navigation sidebar
- **AICurriculumTimeline**: Visual timeline

### Content Pipeline

- Static data in `src/data/curriculum/` (TypeScript modules)
- Content validation via `@bhavya/content-core` (validate, scaffold commands)
- Generated registry: `source-b-registry.generated.ts`

---

## Existing Test Coverage

| Test Type             | Configuration                       | Coverage                                              |
| --------------------- | ----------------------------------- | ----------------------------------------------------- |
| **Unit**              | Vitest (`vitest.config.ts`)         | `src/lib/__tests__/` — DB isolation, temp directories |
| **Component**         | Not configured                      | —                                                     |
| **E2E**               | Playwright MCP (`.playwright-mcp/`) | 100+ console logs, page snapshots                     |
| **Typecheck**         | `tsc --noEmit` (turbo)              | All packages                                          |
| **Lint**              | ESLint 9                            | All packages                                          |
| **Schema Validation** | `@bhavya/content-core validate`     | Content JSON schemas                                  |

**Test Database Isolation**: Per-worker temp SQLite + isolated content root

---

## Major Risks

| Risk                        | Severity | Description                                                                      |
| --------------------------- | -------- | -------------------------------------------------------------------------------- |
| **Bundle Size**             | High     | Heavy 3D deps (Three.js, R3F, Drei, GSAP, Framer Motion) on all routes           |
| **3D on Mobile**            | High     | No automatic quality tier enforcement; 4K textures in public/                    |
| **Free Tier Limits**        | Medium   | Supabase (500MB DB, 200 Realtime), Turso (500M reads), Cloudflare (100K req/day) |
| **Turso Sync**              | Medium   | No automated Supabase→Turso sync pipeline implemented                            |
| **B2 Credentials**          | Medium   | Client-side B2 upload uses credentials in browser bundle (security)              |
| **Playwright Config**       | Low      | No `playwright.config.ts` in ai-institute; MCP only                              |
| **Content-core Validation** | Low      | Validation runs in CI but not as pre-commit hook                                 |
| **Dependency Drift**        | Low      | 60+ workspace packages; some may be unused                                       |

---

## Unknowns Requiring Clarification

1. **Supabase Project Status**: Is a Supabase project provisioned? Are RLS policies deployed?
2. **Turso Database**: Is a Turso database created? Schema sync mechanism?
3. **B2 Bucket**: Is Backblaze B2 bucket created with proper CORS/App Keys?
4. **Cloudflare Account**: Is `bhavya-foundation` Worker deployed? Secrets configured?
5. **Vercel Project**: Is Vercel project linked? Environment variables set?
6. **Domain**: Is `bhavyafoundation.org` (or similar) configured on Cloudflare?
7. **Email Provider**: Custom SMTP configured for Supabase auth emails?
8. **Analytics**: Vercel Analytics ID configured?
9. **GSAP License**: Commercial license verified for GSAP 3.15 usage?
10. **3D Asset Licenses**: Poly Haven assets confirmed CC0? Kenney assets downloaded?

---

## Features That Must Be Preserved

1. **Canonical Route Map** — 60+ routes mapped in `CANONICAL_ROUTE_MAP.md`
2. **Curriculum Registry** — 86 modules with standards alignment
3. **Design Tokens** — `tokens.css` as single source of truth
4. **Platform UI Components** — 22+ accessible components
5. **3D Cinematic Hero** — Pillar-specific scenes with reduced-motion fallback
6. **Apple Springs Motion** — Damping/response spring system
7. **Dual-mode Database** — Local SQLite ↔ Turso with async adapter
8. **Supabase Auth** — SSR-compatible with middleware protection
9. **B2 Storage** — S3-compatible for 3D assets
10. **Content-core Validation** — Schema validation for governance content
11. **Cloudflare Workers Deployment** — opennextjs-cloudflare build
12. **GitHub Actions CI** — Lint, typecheck, test, build, secret-scan
13. **Governance Documents** — 10 constitutional docs in `docs/constitution/`
14. **ADR Process** — 14 ADRs in `docs/adr/`
15. **Standards** — 12 engineering standards in `standards/`
