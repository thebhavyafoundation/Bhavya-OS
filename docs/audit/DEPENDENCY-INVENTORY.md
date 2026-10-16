# DEPENDENCY-INVENTORY — Production Dependencies

**Date:** 2026-10-12
**Source:** `apps/ai-institute/package.json`, `package.json` (root), `packages/*/package.json`

---

## Root Dependencies

| Package                           | Version | Purpose                          |
| --------------------------------- | ------- | -------------------------------- |
| `next`                            | 15.5.25 | Framework (also in ai-institute) |
| `react`                           | 19.2.4  | UI Runtime                       |
| `react-dom`                       | 19.2.4  | DOM Renderer                     |
| `@changesets/cli`                 | 2.31.0  | Version management               |
| `@commitlint/cli`                 | 21.2.1  | Commit linting                   |
| `@commitlint/config-conventional` | 21.2.0  | Conventional commits             |
| `@tailwindcss/postcss`            | 4.1.13  | Tailwind CSS v4 PostCSS          |
| `@types/node`                     | 22.18.6 | Node types                       |
| `@types/react`                    | 19.1.13 | React types                      |
| `@types/react-dom`                | 19.1.9  | React DOM types                  |
| `eslint`                          | 9.36.0  | Linting                          |
| `husky`                           | 9.1.7   | Git hooks                        |
| `lint-staged`                     | 17.0.8  | Staged file linting              |
| `prettier`                        | 3.6.2   | Formatting                       |
| `tailwindcss`                     | 4.1.13  | Tailwind CSS v4                  |
| `turbo`                           | 2.5.6   | Build orchestration              |
| `typescript`                      | 5.9.2   | TypeScript                       |

---

## ai-institute Dependencies (Canonical App)

### Production Dependencies (34)

| Package                         | Version     | Purpose                  | Size Concern |
| ------------------------------- | ----------- | ------------------------ | ------------ |
| `@aws-sdk/client-s3`            | 3.600.0     | B2 S3 client             | Large        |
| `@aws-sdk/s3-request-presigner` | 3.600.0     | Presigned URLs           | Large        |
| `@bhavya/content-core`          | workspace:* | Content validation       | Internal     |
| `@bhavya/database`              | workspace:* | SQLite abstraction       | Internal     |
| `@bhavya/impact-runtime`        | workspace:* | Impact measurement       | Internal     |
| `@bhavya/platform-ui`           | workspace:* | Design system            | Internal     |
| `@bhavya/project-runtime`       | workspace:* | Project runtime          | Internal     |
| `@bhavya/providers`             | workspace:* | Providers                | Internal     |
| `@bhavya/security`              | workspace:* | Auth, crypto, rate-limit | Internal     |
| `@gsap/react`                   | 2.1.2       | GSAP React integration   | **License**  |
| `@libsql/client`                | 0.17.4      | Turso/libSQL client      | Medium       |
| `@react-three/drei`             | 10.7.9      | R3F helpers              | Large        |
| `@react-three/fiber`            | 9.8.1       | React Three.js renderer  | Large        |
| `@supabase/ssr`                 | 0.5.2       | Supabase SSR auth        | Medium       |
| `@supabase/supabase-js`         | 2.45.0      | Supabase client          | Large        |
| `@vercel/blob`                  | 0.25.0      | Vercel Blob storage      | Medium       |
| `@xyflow/react`                 | 12.11.6     | Flow diagrams            | Large        |
| `bcryptjs`                      | 3.0.3       | Password hashing         | Small        |
| `better-sqlite3`                | 12.10.0     | SQLite (native)          | **Native**   |
| `framer-motion`                 | 13.0.0      | Animations               | Large        |
| `gsap`                          | 3.15.0      | Professional animations  | **License**  |
| `lenis`                         | 1.3.26      | Smooth scrolling         | Medium       |
| `lottie-web`                    | 5.13.0      | Lottie animations        | Medium       |
| `lucide-react`                  | 0.468.0     | Icons                    | Medium       |
| `next`                          | 15.5.25     | Framework                | Core         |
| `react`                         | 19.0.0      | UI Runtime               | Core         |
| `react-dom`                     | 19.0.0      | DOM Renderer             | Core         |
| `three`                         | 0.186.1     | 3D Graphics              | Large        |

### Dev Dependencies (15)

| Package                            | Version | Purpose               |
| ---------------------------------- | ------- | --------------------- |
| `@opennextjs/cloudflare`           | 1.20.6  | Cloudflare deployment |
| `@tailwindcss/postcss`             | 4       | Tailwind PostCSS      |
| `@types/better-sqlite3`            | 7.6.0   | SQLite types          |
| `@types/node`                      | 22      | Node types            |
| `@types/react`                     | 19      | React types           |
| `@types/react-dom`                 | 19      | React DOM types       |
| `@types/three`                     | 0.186.0 | Three.js types        |
| `@typescript-eslint/eslint-plugin` | 8.66.0  | TypeScript ESLint     |
| `@typescript-eslint/parser`        | 8.66.0  | TypeScript Parser     |
| `tailwindcss`                      | 4       | Tailwind CSS          |
| `tsx`                              | 4.23.1  | TypeScript execution  |
| `typescript`                       | 5       | TypeScript            |
| `vitest`                           | 3.2.7   | Testing               |
| `wrangler`                         | 4.131.1 | Cloudflare CLI        |

---

## Platform UI Dependencies

| Package        | Version | Purpose |
| -------------- | ------- | ------- |
| `lucide-react` | 0.468.0 | Icons   |
| `react`        | 19.0.0  | Peer    |
| `react-dom`    | 19.0.0  | Peer    |

---

## Database Package Dependencies

| Package          | Version | Purpose      |
| ---------------- | ------- | ------------ |
| `@libsql/client` | 0.17.4  | Turso client |
| `better-sqlite3` | 12.10.0 | Local SQLite |

---

## Security Package Dependencies

| Package    | Version | Purpose          |
| ---------- | ------- | ---------------- |
| `bcryptjs` | 3.0.3   | Password hashing |

---

## Video Engine Dependencies

| Package         | Version | Purpose          |
| --------------- | ------- | ---------------- |
| `@remotion/*`   | 4.0.x   | Video generation |
| `ffmpeg-static` | —       | FFmpeg binary    |

---

## Bundle Size Risk Assessment

### High Risk (Large + Multiple)

| Package                                 | Est. Size | Routes Affected     |
| --------------------------------------- | --------- | ------------------- |
| `@react-three/fiber` + `drei` + `three` | ~500KB+   | All 3D routes       |
| `gsap` + `@gsap/react`                  | ~150KB    | All animated routes |
| `framer-motion`                         | ~120KB    | All motion routes   |
| `@supabase/supabase-js`                 | ~200KB    | Auth routes         |
| `@xyflow/react`                         | ~300KB    | Graph/flow routes   |
| `@aws-sdk/*`                            | ~400KB    | B2 upload routes    |

### Medium Risk

| Package        | Est. Size | Routes Affected      |
| -------------- | --------- | -------------------- |
| `lottie-web`   | ~80KB     | Lottie routes        |
| `lenis`        | ~30KB     | Smooth scroll routes |
| `@vercel/blob` | ~50KB     | Upload routes        |

### Licensing Concerns

| Package         | License                        | Action Required    |
| --------------- | ------------------------------ | ------------------ |
| `gsap`          | Commercial (Standard/Business) | **Verify license** |
| `@gsap/react`   | Commercial                     | **Verify license** |
| `lottie-web`    | MIT                            | OK                 |
| `lenis`         | MIT                            | OK                 |
| `framer-motion` | MIT                            | OK                 |
| `@xyflow/react` | MIT                            | OK                 |

---

## Unused / Duplicate Dependencies

| Package                | Location                | Status        |
| ---------------------- | ----------------------- | ------------- |
| `next`                 | Root + ai-institute     | Duplicate     |
| `react`                | Root + ai-institute     | Duplicate     |
| `react-dom`            | Root + ai-institute     | Duplicate     |
| `typescript`           | Root + ai-institute     | Duplicate     |
| `tailwindcss`          | Root + ai-institute     | Duplicate     |
| `@types/*`             | Root + ai-institute     | Duplicate     |
| `@typescript-eslint/*` | Root + ai-institute     | Duplicate     |
| `vitest`               | Root + ai-institute     | Duplicate     |
| `better-sqlite3`       | Database + ai-institute | Via workspace |
| `@libsql/client`       | Database + ai-institute | Via workspace |

---

## Workspace Packages (60+)

### Core Platform (6)

- `@bhavya/kernel` — BRP types, registry, observability
- `@bhavya/shared` — Canonical types (100+)
- `@bhavya/types` — Type re-exports
- `@bhavya/config` — Platform configuration
- `@bhavya/events` — Event bus
- `@bhavya/sdk` — Extension SDK

### Runtime Engine (5)

- `@bhavya/runtime` — Full runtime engine
- `@bhavya/mission-runtime` — Mission execution
- `@bhavya/learning-runtime` — Learning execution
- `@bhavya/project-runtime` — Project execution
- `@bhavya/impact-runtime` — Impact measurement

### AI/Agent Systems (11)

- `@bhavya/ai` — AI abstractions
- `@bhavya/agent-engine` — Agent lifecycle
- `@bhavya/intelligence` — Intelligence processing
- `@bhavya/knowledge-engine` — Knowledge processing
- `@bhavya/knowledge-graph` — Knowledge graph (17 entities)
- `@bhavya/mentor-engine` — Mentor system
- `@bhavya/memory-engine` — Memory persistence
- `@bhavya/search-engine` — Search
- `@bhavya/scheduler-engine` — Task scheduling
- `@bhavya/planner-engine` — Planning
- `@bhavya/workflow-engine` — Workflow execution

### UI/Design (7)

- `@bhavya/platform-ui` — Canonical UI
- `@bhavya/design-system` — Design system
- `@bhavya/icons` — Icons
- `@bhavya/charts` — Charts
- `@bhavya/motion-system` — Motion/animation
- `@bhavya/interactive-components` — Interactive UI
- `@bhavya/branding` — Brand assets

### Content (3)

- `@bhavya/content-core` — Content authoring
- `@bhavya/content-board` — Content board
- `@bhavya/content-engine` — Content engine

### Infrastructure (7)

- `@bhavya/api` — API layer
- `@bhavya/auth` — Authentication
- `@bhavya/database` — Database layer
- `@bhavya/security` — Security
- `@bhavya/notifications` — Notifications
- `@bhavya/observability` — Monitoring
- `@bhavya/providers` — Providers

### Tooling (5)

- `@bhavya/cli` — CLI utilities
- `@bhavya/eslint` — ESLint configs
- `@bhavya/typescript` — TypeScript configs
- `@bhavya/bdx` — Developer tools

---

## Recommended Dependency Actions

1. **Remove root duplicates** — Keep only in ai-institute
2. **Verify GSAP license** — Before production deploy
3. **Add bundle analyzer** — `@next/bundle-analyzer` to CI
4. **Audit workspace packages** — Remove unused packages
5. **Split 3D deps** — Lazy load Three.js/R3F only on 3D routes
6. **Replace @aws-sdk** — Use lighter S3 client for presigned URLs only
