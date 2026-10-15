# RECOMMENDED-NEXT-STEPS — Phased Improvement Plan

**Date:** 2026-10-12
**Source:** Full repository inspection per AGENTS.md

---

## Executive Summary

The Bhavya Foundation application is a **mature, feature-rich Next.js 15 application** with:

- ✅ Comprehensive curriculum (86 modules, standards-aligned)
- ✅ Cinematic 3D storytelling (Four Pillars)
- ✅ Dual-mode database (SQLite ↔ Turso)
- ✅ Supabase authentication
- ✅ B2 object storage for 3D assets
- ✅ Cloudflare Workers deployment
- ✅ Design system with 22+ components

**Critical gaps** preventing production readiness:

1. **Bundle size** ~800KB (budget: 250KB mobile)
2. **B2 credentials exposed** in browser bundle
3. **No automated accessibility/performance testing**
4. **4K textures in repo** — no optimization pipeline
5. **Duplicate 3D code** — memory leak risk
6. **No Supabase RLS deployed** — data protection incomplete

---

## Phase 1: Security & Foundation (Week 1-2)

### Objective: Secure the application and establish CI quality gates

| Task                                      | Owner    | Files                                                           | Acceptance Criteria                                           |
| ----------------------------------------- | -------- | --------------------------------------------------------------- | ------------------------------------------------------------- |
| **1.1 Move B2 operations to API routes**  | Backend  | `src/lib/b2/client.ts` → `src/app/api/upload/*`                 | No `S3_ACCESS_KEY` in browser bundle; presigned URLs only     |
| **1.2 Add Security Headers + CSP**        | Backend  | `next.config.mjs`                                               | CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy |
| **1.3 Rate Limit Auth Routes**            | Backend  | `src/middleware.ts`, `src/lib/security/rate-limit.ts`           | 5 req/min on `/login`, `/api/auth/*`, `/api/upload/*`         |
| **1.4 Fix Duplicate CinematicScene**      | Frontend | `src/components/three/CinematicHero.tsx` (delete lines 285-359) | Single `CinematicScene` function; no duplicate code           |
| **1.5 Add axe-core to Vitest**            | QA       | `vitest.config.ts`, new `src/lib/__tests__/a11y.test.ts`        | `pnpm test` runs a11y checks                                  |
| **1.6 Add Playwright a11y**               | QA       | `playwright.config.ts` (new), `tests/a11y/`                     | Keyboard nav, focus, ARIA tests in CI                         |
| **1.7 Enable Next.js Image Optimization** | Frontend | `next.config.mjs`                                               | Remove `unoptimized: true`; configure AVIF/WebP               |
| **1.8 Add Bundle Analyzer to CI**         | DevOps   | `.github/workflows/ci.yml`, `@next/bundle-analyzer`             | PR fails if JS > 250KB mobile / 350KB desktop                 |

### Dependencies

- All tasks independent except 1.1 → 1.2 (CSP needs B2 domain)

---

## Phase 2: Data Protection & Quality (Week 3-4)

### Objective: Deploy RLS, validate data integrity, establish testing

| Task                                        | Owner    | Files                                                  | Acceptance Criteria                                         |
| ------------------------------------------- | -------- | ------------------------------------------------------ | ----------------------------------------------------------- |
| **2.1 Deploy Supabase RLS Policies**        | Backend  | Supabase Dashboard / SQL migration                     | All tables have RLS; policies tested per role               |
| **2.2 Curriculum Progress Batch API**       | Backend  | `src/app/api/progress/*`, `src/lib/module-progress.ts` | Single upsert per 30s / navigation; no per-keystroke writes |
| **2.3 Curriculum Content Validation in CI** | QA       | `.github/workflows/ci.yml`, `pnpm validate`            | `pnpm validate` runs on PR; fails on schema errors          |
| **2.3 Visual Regression Tests**             | QA       | `playwright.config.ts`, `tests/visual/`                | Pixel-perfect diffs for design system components            |
| **2.4 Lighthouse CI Budgets**               | DevOps   | `.github/workflows/ci.yml`, `lighthouse-ci` config     | PR fails if LCP>2.5s, INP>200ms, CLS>0.1                    |
| **2.5 Font Subsetting + Self-Host**         | Frontend | `public/fonts/`, `globals.css`                         | Latin-only WOFF2; no Google Fonts requests in production    |
| **2.6 Hindi i18n Foundation**               | Frontend | `src/lib/i18n.ts`, `src/app/[lang]/`                   | `lang` routing; font fallback; RTL test                     |

### Dependencies

- 2.1 requires Supabase project provisioned
- 2.2 depends on 1.3 (rate limiting)

---

## Phase 3: 3D Performance & Asset Pipeline (Week 5-7)

### Objective: Bring 3D within budget; automate asset optimization

| Task                                      | Owner    | Files                                                                                            | Acceptance Criteria                                               |
| ----------------------------------------- | -------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| **3.1 3D Asset Pipeline (GitHub Action)** | DevOps   | `.github/workflows/optimize-assets.yml` (new), `gltf-transform`, `meshoptimizer`, `KTX-Software` | On asset change: GLB→Draco, textures→KTX2, manifest updated       |
| **3.2 Quality Tier System**               | Frontend | `src/components/three/CinematicHero.tsx`, `src/lib/three/quality.ts`                             | Mobile: <500 particles, no shadows, 512px textures; Desktop: full |
| **3.3 Cap Pixel Ratio**                   | Frontend | `src/components/three/CinematicHero.tsx`                                                         | `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))`  |
| **3.4 Lazy Load All 3D**                  | Frontend | `src/components/curriculum/CurriculumHero3D.tsx`, `Hero3DCanvas`                                 | IntersectionObserver trigger; `dynamic()` import                  |
| **3.5 Remove 4K Source Assets from Repo** | DevOps   | `public/models/poly-haven/`                                                                      | Only optimized derivatives in repo; sources in B2                 |
| **3.6 Asset Manifest + Checksums**        | DevOps   | `public/asset-manifest.json`, CI validation                                                      | `asset-manifest.json` validated; checksums match B2               |
| **3.7 3D Memory Leak Tests**              | QA       | `tests/3d-memory.test.ts` (Playwright)                                                           | 10 route navigations → no heap growth >10MB                       |
| **3.8 WebGL Fallback Testing**            | QA       | `tests/webgl-fallback.test.ts`                                                                   | All 3D routes render poster/text without WebGL                    |

### Dependencies

- 3.1 requires GitHub Actions runner with Blender/Node
- 3.2 depends on 1.4 (clean CinematicHero)

---

## Phase 4: Experience Polish & Launch Prep (Week 8-10)

### Objective: Accessibility compliance, content completeness, launch readiness

| Task                                 | Owner    | Files                                             | Acceptance Criteria                                       |
| ------------------------------------ | -------- | ------------------------------------------------- | --------------------------------------------------------- |
| **4.1 WCAG 2.2 AA Audit**            | QA       | All routes                                        | axe-core 0 violations; manual keyboard/screen reader pass |
| **4.2 Required Viewport Testing**    | QA       | `tests/viewports.test.ts`                         | 5 viewports × 10 states = 50 test scenarios pass          |
| **4.3 Content Completeness**         | Content  | `src/app/*/page.tsx` vs `CANONICAL_ROUTE_MAP.md`  | All 80+ routes implemented; no 404s                       |
| **4.4 Governance Content Sync**      | Content  | `content/governance/` → routes                    | Constitution, policies, transparency all accessible       |
| **4.5 Error Boundary + Fallback UI** | Frontend | `src/app/global-error.tsx`, `error.tsx` per route | Graceful degradation; no white screens                    |
| **4.6 Offline Support (SW)**         | Frontend | `public/sw.js`, `next.config.mjs`                 | Curriculum pages work offline; progress queues            |
| **4.7 Analytics + Error Tracking**   | DevOps   | `@vercel/analytics`, Sentry (free)                | Web Vitals + JS errors captured                           |
| **4.8 Launch Runbooks**              | DevOps   | `docs/runbooks/`                                  | Deploy, rollback, incident, scaling docs                  |

### Dependencies

- 4.1 requires 1.5, 1.6 complete
- 4.3 requires 4.2 complete

---

## Phase 5: Post-Launch Optimization (Week 11+)

### Objective: Monitor, optimize, scale

| Task                                | Owner   | Trigger                        |
| ----------------------------------- | ------- | ------------------------------ |
| **5.1 RUM Analysis**                | DevOps  | Weekly — identify slow routes  |
| **5.2 Database Query Optimization** | Backend | Monthly — slow query review    |
| **5.3 Cache Hit Ratio Tuning**      | DevOps  | Weekly — Cloudflare Analytics  |
| **5.4 Free Tier Monitoring**        | DevOps  | Daily alerts at 70% thresholds |
| **5.5 Curriculum Expansion**        | Content | Per roadmap — new modules      |
| **5.6 Multi-region Turso**          | Backend | When read latency >200ms       |
| **5.7 Supabase Pro Upgrade**        | DevOps  | When DB >350MB or MAU >35k     |

---

## Cross-Cutting Technical Debt

| Debt                                         | Phase | Effort | Risk if Deferred              |
| -------------------------------------------- | ----- | ------ | ----------------------------- |
| **Resolve Playfair vs Inter**                | 1     | Low    | Brand inconsistency           |
| **Slim globals.css (126KB → <20KB)**         | 2     | Medium | Maintenance burden            |
| **Unify Motion Library (Framer/GSAP/Lenis)** | 2     | High   | Bundle size, conflicts        |
| **Storybook for Platform UI**                | 3     | Medium | No component docs             |
| **Type-safe Design Tokens**                  | 3     | Medium | Token drift                   |
| **Phantom Package Cleanup**                  | 4     | Low    | Confusion in DOMAIN_OWNERSHIP |
| **Playwright Config**                        | 1     | Low    | No E2E config                 |

---

## Required Human Decisions

| Decision                            | Required By | Options                                                       |
| ----------------------------------- | ----------- | ------------------------------------------------------------- |
| **Font Display: Playfair vs Inter** | Phase 1     | A) Constitution (Inter) B) Prototype (Playfair) C) Dual-track |
| **GSAP License Type**               | Phase 1     | Standard / Business / None (remove)                           |
| **Supabase Project Provisioning**   | Phase 2     | New project / Existing                                        |
| **Turso Database Creation**         | Phase 2     | New / Existing                                                |
| **B2 Bucket + CORS Config**         | Phase 1     | New / Existing                                                |
| **Cloudflare Domain + Zone**        | Phase 3     | New / Existing                                                |
| **Vercel Project Link**             | Phase 1     | New / Existing                                                |
| **Custom SMTP for Supabase**        | Phase 2     | SendGrid / Mailgun / Other                                    |

---

## Rollback Plan

### Per-Phase Rollback

| Phase | Rollback Trigger         | Rollback Action                              |
| ----- | ------------------------ | -------------------------------------------- |
| 1     | Security regression      | `git revert` security commits; redeploy      |
| 2     | Data integrity issue     | Supabase PITR (if Pro) / manual restore      |
| 3     | 3D regression            | Feature flag: `NEXT_PUBLIC_3D_ENABLED=false` |
| 4     | Accessibility regression | `git revert`; redeploy previous build        |
| 5     | Performance regression   | Rollback to previous Cloudflare deployment   |

### Feature Flags (Add to `next.config.mjs`)

```javascript
env: {
  NEXT_PUBLIC_3D_ENABLED: process.env.NEXT_PUBLIC_3D_ENABLED ?? 'true',
  NEXT_PUBLIC_MOTION_ENABLED: process.env.NEXT_PUBLIC_MOTION_ENABLED ?? 'true',
  NEXT_PUBLIC_ANALYTICS_ENABLED: process.env.NEXT_PUBLIC_ANALYTICS_ENABLED ?? 'false',
}
```

---

## Test Plan Summary

| Test Type         | Tool                  | Phase | Coverage Target          |
| ----------------- | --------------------- | ----- | ------------------------ |
| Unit              | Vitest                | 1     | 80% lib code             |
| Component         | Vitest + RTL          | 2     | 70% components           |
| A11y Automated    | axe-core              | 1     | 0 violations             |
| E2E Auth          | Playwright            | 2     | Login, enroll, progress  |
| E2E Curriculum    | Playwright            | 3     | Module → lesson → quiz   |
| Visual Regression | Playwright            | 2     | Design system components |
| 3D Memory         | Playwright            | 3     | 10 navs <10MB growth     |
| WebGL Fallback    | Playwright            | 3     | All 3D routes            |
| Lighthouse CI     | LHCI                  | 1     | Budgets pass             |
| Bundle Size       | @next/bundle-analyzer | 1     | <250KB mobile            |

---

## Approval Gates

| Gate                 | Required Approvers                           | Artifacts                                               |
| -------------------- | -------------------------------------------- | ------------------------------------------------------- |
| **Phase 1 Complete** | Security Lead, Tech Lead                     | CI green, bundle < budget, no secrets in bundle         |
| **Phase 2 Complete** | Data Lead, QA Lead                           | RLS deployed, progress batch works, validate passes     |
| **Phase 3 Complete** | Performance Lead, 3D Lead                    | 3D budgets met, asset pipeline runs, memory test passes |
| **Phase 4 Complete** | Accessibility Lead, Content Lead             | WCAG AA, all viewports, content complete                |
| **Launch**           | Executive Director, Tech Lead, Security Lead | All gates passed, runbooks ready, monitoring live       |

---

## Questions Requiring Human Answers

1. **Supabase Project**: Is a Supabase project already provisioned? If so, share project ref.
2. **Turso Database**: Is a Turso database created? If so, share connection URL.
3. **B2 Bucket**: Is Backblaze B2 bucket created with App Keys? Share bucket name.
4. **Cloudflare Account**: Is `bhavya-foundation` Worker namespace available? Account ID?
5. **Domain**: What is the production domain? (e.g., `bhavyafoundation.org`)
6. **GSAP License**: What GSAP license does the organization hold? (Standard/Business/None)
7. **Font Decision**: Board preference on Playfair Display vs Inter for headings?
8. **SMTP Provider**: Preferred transactional email provider for Supabase auth?
9. **Launch Timeline**: Target launch date?
10. **Team Capacity**: How many engineers per phase? (Affects parallelization)

---

## File Change Summary (Phase 1)

### Files to Modify

| File                                     | Change                                            |
| ---------------------------------------- | ------------------------------------------------- |
| `src/lib/b2/client.ts`                   | Remove client-side exports; keep server-only      |
| `src/app/api/upload/presign/route.ts`    | New: Generate presigned PUT URL                   |
| `src/app/api/upload/complete/route.ts`   | New: Confirm upload, save metadata                |
| `next.config.mjs`                        | Security headers, CSP, image optimization         |
| `src/middleware.ts`                      | Rate limiting on auth/upload routes               |
| `src/components/three/CinematicHero.tsx` | Delete duplicate `CinematicScene` (lines 285-359) |
| `vitest.config.ts`                       | Add axe-core setup                                |
| `playwright.config.ts`                   | New: a11y + visual regression config              |
| `.github/workflows/ci.yml`               | Add bundle analyzer, Lighthouse CI, axe-core      |

### Files to Create

| File                              | Purpose                     |
| --------------------------------- | --------------------------- |
| `src/lib/__tests__/a11y.test.ts`  | axe-core component tests    |
| `tests/a11y/keyboard-nav.test.ts` | Playwright keyboard tests   |
| `tests/a11y/aria.test.ts`         | Playwright ARIA tests       |
| `playwright.config.ts`            | Playwright configuration    |
| `lighthouserc.json`               | Lighthouse CI budgets       |
| `tests/visual/`                   | Visual regression baselines |

---

## Estimated Effort

| Phase     | Engineer-Weeks | Parallelizable                                    |
| --------- | -------------- | ------------------------------------------------- |
| Phase 1   | 3-4            | High (security, frontend, QA, DevOps independent) |
| Phase 2   | 3-4            | Medium (RLS blocks progress API)                  |
| Phase 3   | 4-5            | Medium (asset pipeline blocks quality tiers)      |
| Phase 4   | 3-4            | Medium (a11y blocks content review)               |
| **Total** | **13-17**      | —                                                 |

> With 2 engineers: ~8-10 weeks. With 3 engineers: ~6-8 weeks.
