# EXPERIENCE-BASELINE — Current State Assessment

**Date:** 2026-10-15  
**Branch:** feat/immersive-hero-background (merged to master via PR #22)  
**Commit:** 3964865 feat: immersive-hero-background - typecheck & lint clean

---

## 1. Repository State

| Aspect            | Status                                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Branch            | `master` (clean after merge)                                                                                                                                 |
| Uncommitted       | AGENTS.md, CONTEXT.md, FILE-MAP.md, next.config.mjs, package.json, globals.css, layout.tsx, page.tsx, curriculum pages, 3D components, B2 routes, LFS assets |
| Recent merges     | PR #22: fix typecheck/lint for immersive-hero-background                                                                                                     |
| LFS assets        | Kenney models (.glb), Poly Haven generator (.gltf)                                                                                                           |
| New B2 API routes | /api/b2/signed-url, /api/b2/upload, /api/b2/list, /api/b2/delete                                                                                             |

---

## 2. Dependency Graph (apps/ai-institute)

### Core UI & Motion

| Package              | Version | Purpose                 |
| -------------------- | ------- | ----------------------- |
| `@react-three/fiber` | 9.8.1   | React Three.js renderer |
| `@react-three/drei`  | 10.7.9  | Three.js helpers        |
| `three`              | 0.186.1 | 3D engine               |
| `gsap`               | 3.15.0  | Animation               |
| `@gsap/react`        | 2.1.2   | React GSAP integration  |
| `lenis`              | 1.3.26  | Smooth scroll           |
| `framer-motion`      | 13.0.0  | Motion primitives       |

### Visualization

| Package         | Version | Purpose            |
| --------------- | ------- | ------------------ |
| `@xyflow/react` | 12.11.6 | Node/edge diagrams |
| `lucide-react`  | 0.468.0 | Icons              |

### Curriculum & Data

| Package                | Version     | Purpose               |
| ---------------------- | ----------- | --------------------- |
| `@bhavya/content-core` | workspace:* | Content pipeline      |
| `@bhavya/platform-ui`  | workspace:* | Design system         |
| `@bhavya/providers`    | workspace:* | Provider abstractions |

---

## 3. Canonical Token System (packages/platform-ui/src/styles/tokens.css)

**Complete** — 689 lines covering:

- Brand palette (forest, ivory, gold, sage, earth scales)
- Semantic colors (light + dark mode)
- Typography (Playfair Display + Inter, major third scale)
- Spacing (8pt grid, 0–40)
- Border radius (xs–3xl)
- Shadows (warm forest-based)
- Transitions (easing curves, durations, stagger, parallax)
- Data visualization palette (8 brand-compliant hues)
- Glass system (4 variants)
- Reduced motion support

**Status:** Authoritative, no duplicates found.

---

## 4. Route Inventory (from docs/audit/ROUTE-MATRIX.md)

| Category                  | Count      | Auth  | Tier Classification Needed |
| ------------------------- | ---------- | ----- | -------------------------- |
| Public Routes             | 44         | No    | ✅ Classify A–D            |
| Knowledge Routes          | 13         | Mixed | ✅ Classify A–D            |
| Curriculum (dynamic)      | 4 patterns | No    | ✅ Classify B–C            |
| Authenticated (My Bhavya) | 9          | Yes   | ✅ Classify C–D            |
| OS Routes (Internal)      | 14         | Admin | ✅ Classify D              |
| Auth Routes               | 5          | No    | ✅ Classify D              |

**Missing routes** (exist in canonical map, not implemented):

- `/learning-paths`, `/schools`, `/projects`, `/faq`, `/library`, `/research`, `/contact`, `/support`, `/teachers`, `/privacy`, `/accessibility`

---

## 5. Curriculum Registry (apps/ai-institute/src/data/curriculum/lesson-registry.ts)

| Metric        | Value                                                                                                                                  |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Modules       | 86 (4 bands: junior-a, junior-b, core, advanced)                                                                                       |
| Levels        | L0–L6 + ADV                                                                                                                            |
| Widgets       | 9 types (tap-match, sort-basket, predict-reveal, story-scene, sim-controls, investigate, bar-chart, tokenize-explorer, attention-play) |
| Lesson blocks | prose, quiz, interactive, experiment, project                                                                                          |
| Standards     | AI standards alignment (USA.CA.AI, China.MOE.IT.AI, UNESCO.AI, OECD.AI)                                                                |

---

## 6. 3D Assets & Models

| Asset                         | Source        | License | Status                                        |
| ----------------------------- | ------------- | ------- | --------------------------------------------- |
| Kenney models (14)            | kenney.nl     | CC0     | In repo (LFS)                                 |
| Poly Haven Portable Generator | polyhaven.com | CC0     | Source .blend + 4K EXR textures (50MB + 83MB) |
| Neural net model              | Poly Haven    | CC0     | In repo (LFS)                                 |

**Production derivatives needed:**

- Mobile GLB (Draco) <500KB
- Desktop GLB (Draco) <2MB
- Poster AVIF <100KB
- KTX2 textures <500KB each

**Pipeline missing:** No automated optimization, no asset manifest, no checksum verification, no B2 upload automation.

---

## 7. Current 3D Implementation

### Components

| File                              | Purpose                                            |
| --------------------------------- | -------------------------------------------------- |
| `Hero3DCanvas.tsx`                | Curriculum hero with Float, Environment, particles |
| `CurriculumHero3D.tsx`            | Module-specific hero with band scenes              |
| `CinematicHero.tsx`               | Four-pillar cinematic scene                        |
| `Model3D.tsx`                     | Generic model loader                               |
| `ParticleSystems.tsx`             | Reusable particle systems                          |
| `Card3D.tsx` / `Card3DSimple.tsx` | 3D cards                                           |

### Rendering

- Dynamic import with Suspense
- DRACOLoader for compressed GLB
- Environment presets (forest, sunset, city, etc.)
- Particle systems per band
- Reduced motion fallback (empty div)

---

## 8. Performance Baseline (estimated)

| Metric                | Target            | Current (est.)       |
| --------------------- | ----------------- | -------------------- |
| Initial JS (mobile)   | ≤250 KB gzip      | ~300 KB              |
| Initial JS (desktop)  | ≤350 KB gzip      | ~400 KB              |
| 3D download (mobile)  | ≤1.5 MB           | ~2 MB (uncompressed) |
| 3D download (desktop) | ≤4 MB             | ~8 MB (uncompressed) |
| Texture dimensions    | 512–1024 (mobile) | 4K EXR in source     |
| Draw calls (mobile)   | <100              | ~150                 |
| Draw calls (desktop)  | <250              | ~300                 |

---

## 9. Accessibility Baseline

| Feature              | Status                           |
| -------------------- | -------------------------------- |
| Semantic HTML        | ✅                               |
| Heading hierarchy    | ✅                               |
| Skip navigation      | ⚠️ Partial                       |
| Keyboard operation   | ✅                               |
| Visible focus        | ✅ (gold ring)                   |
| Touch targets        | ⚠️ Some <44px                    |
| Captions/transcripts | ❌ Not implemented               |
| 3D alternatives      | ⚠️ Empty div fallback            |
| Reduced motion       | ✅ (prefers-reduced-motion)      |
| WCAG contrast        | ⚠️ Not programmatically verified |

---

## 10. Deployment Constraints

| Constraint | Detail                                     |
| ---------- | ------------------------------------------ |
| Runtime    | Cloudflare Workers (opennextjs-cloudflare) |
| Build      | `npx opennextjs-cloudflare build`          |
| Node       | 22 (CI), 20 (local)                        |
| pnpm       | 10.17.1                                    |
| Assets     | Backblaze B2 (signed URLs)                 |
| Database   | Turso (libsql) + local SQLite              |
| Auth       | Supabase SSR                               |
| CI         | GitHub Actions (ci.yml on master)          |
| Deploy     | deploy-cloudflare.yml on master push       |

---

## 11. Identified Gaps for UX-0

1. **Route-tier classification** — Not yet assigned A–D
2. **Asset manifest** — Missing `asset-manifest.json`
3. **Checksums** — No source/production verification
4. **Automated pipeline** — No glTF Transform / meshoptimizer / KTX CI
5. **Performance budgets** — Not enforced in CI
6. **Bundle analysis** — Not measured per route
7. **WCAG verification** — Not automated
8. **Hindi layout** — Not tested
9. **Bundle size enforcement** — Not in CI
10. **Design-system proof route** — Not built

---

## 12. Next Steps (UX-0 Complete → UX-1)

1. Create remaining baseline documents:
   - `ROUTE-EXPERIENCE-MATRIX.md`
   - `DESIGN-DIRECTION.md`
   - `COMPONENT-GAP-ANALYSIS.md`
   - `STORYTELLING-ARCHITECTURE.md`
   - `CURRICULUM-EXPERIENCE-AUDIT.md`
   - `VISUAL-BLOCK-REGISTRY.md`
   - `ASSET-SOURCING-PLAN.md`
   - `MOTION-SYSTEM.md`
   - `PERFORMANCE-BUDGETS.md`
   - `IMPLEMENTATION-ROADMAP.md`

2. Begin UX-1: Design-system proof route using canonical tokens.
