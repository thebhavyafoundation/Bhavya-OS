# PERFORMANCE-BASELINE — Current Performance Metrics & Budgets

**Date:** 2026-10-12
**Source:** Repository inspection, bundle analysis (estimated), AGENTS.md budgets

---

## Current Bundle Analysis (Estimated)

### Main Bundle Composition

| Category           | Packages                                                                             | Est. Size (gz) | % of Total |
| ------------------ | ------------------------------------------------------------------------------------ | -------------- | ---------- |
| **Framework Core** | next, react, react-dom                                                               | ~120 KB        | 25%        |
| **3D/Visual**      | three, @react-three/fiber, @react-three/drei, gsap, framer-motion, lenis, lottie-web | ~400 KB        | 45%        |
| **Auth/Data**      | @supabase/supabase-js, @supabase/ssr, @libsql/client, @aws-sdk/*                     | ~200 KB        | 20%        |
| **UI/Utils**       | lucide-react, @xyflow/react, bcryptjs, zod                                           | ~80 KB         | 10%        |
| **TOTAL**          |                                                                                      | **~800 KB**    | 100%       |

> **Note**: Actual size requires `npm run build && npx @next/bundle-analyzer`. Current estimate based on package sizes.

---

## Performance Budgets (from AGENTS.md)

| Resource                    | Mobile Target | Desktop Target | Current Status                      |
| --------------------------- | ------------- | -------------- | ----------------------------------- |
| **Initial Route JS**        | 250 KB gzip   | 350 KB gzip    | **❌ Exceeded** (est. 800 KB)       |
| **Initial 3D Transfer**     | 1.5 MB        | 4 MB           | ❓ Unknown (4K textures in public/) |
| **Deferred Scene Total**    | 3 MB          | 8 MB           | ❓ Unknown                          |
| **Texture Dimension**       | 512–1024 px   | 1024–2048 px   | **❌ 4K textures**                  |
| **Active Draw Calls**       | <100          | <250           | ❓ Unknown                          |
| **Pixel Ratio**             | 1–1.25        | Up to 1.75     | ❓ Not capped                       |
| **Real-time Shadow Lights** | 0–1           | 0–2            | ❓ Used in CinematicHero            |

---

## Core Web Vitals Targets

| Metric   | Target | Current | Measurement  |
| -------- | ------ | ------- | ------------ |
| **LCP**  | <2.5s  | ❓      | Not measured |
| **INP**  | <200ms | ❓      | Not measured |
| **CLS**  | <0.1   | ❓      | Not measured |
| **FCP**  | <1.8s  | ❓      | Not measured |
| **TTFB** | <600ms | ❓      | Not measured |

---

## 3D Performance Analysis

### Current 3D Implementation (`CinematicHero.tsx`)

```typescript
// Canvas config
antialias: true,
alpha: true,
preserveDrawingBuffer: false

// Tone mapping
gl.toneMapping = THREE.ACESFilmicToneMapping;
gl.toneMappingExposure = 1;
gl.physicallyCorrectLights = true;

// Fog
scene.fog = new THREE.Fog(config.fogColor, config.fogNear, config.fogFar);

// Lights
createLightingPreset("hero") // Multiple lights with shadows

// Particles
ForestParticleSystem: count={1500}, spread={80}, size={0.8}
KnowledgeParticleSystem: count={1200}, spread={60}, size={0.6}
HeritageParticleSystem: count={800}, spread={100}, size={0.5}
CommunityParticleSystem: count={1800}, spread={70}, size={0.7}
```

### Issues

| Issue                          | Impact                              | Fix                          |
| ------------------------------ | ----------------------------------- | ---------------------------- |
| **No quality tiers**           | Mobile gets desktop particle counts | Implement `qualityTier` prop |
| **Shadow lights on mobile**    | Expensive GPU                       | Disable shadows on Tier B/C  |
| **No texture compression**     | 4K EXR/JPG in public/               | KTX2 + BasisU pipeline       |
| **No geometry compression**    | Large GLB                           | Draco + meshoptimizer        |
| **No LOD system**              | Fixed detail at all distances       | Implement LOD                |
| **No frame budget monitoring** | Can exceed 16.6ms                   | Add `stats.js` in dev        |

### Particle Counts by Pillar

| Pillar    | Count | Spread | Size | Opacity | Mobile Budget             |
| --------- | ----- | ------ | ---- | ------- | ------------------------- |
| Forest    | 1500  | 80     | 0.8  | 0.4     | **Exceeds** (target <500) |
| Knowledge | 1200  | 60     | 0.6  | 0.5     | **Exceeds**               |
| Heritage  | 800   | 100    | 0.5  | 0.3     | Near limit                |
| Community | 1800  | 70     | 0.7  | 0.45    | **Exceeds**               |

---

## Loading Strategy

### Current

- **Hero 3D**: Lazy loaded via `dynamic()` + `Suspense` ✅
- **Other 3D**: Eager loaded in components ❌
- **Fonts**: Preconnect + preload ✅
- **Images**: `unoptimized: true` in next.config ❌
- **Code splitting**: Route-level via App Router ✅

### Recommended

| Asset     | Strategy                                      |
| --------- | --------------------------------------------- |
| Hero 3D   | Keep lazy + IntersectionObserver (already)    |
| Module 3D | Lazy on scroll into view                      |
| Textures  | KTX2 + progressive loading                    |
| Fonts     | Subset (Latin only), WOFF2 only               |
| Images    | Next.js Image optimization (enable)           |
| JS chunks | Dynamic import per route (App Router default) |

---

## Caching Strategy

### Cloudflare CDN

| Asset Type         | Cache Rule             | TTL     |
| ------------------ | ---------------------- | ------- |
| Static JS/CSS      | Immutable (hashed)     | 1 year  |
| Fonts              | Immutable              | 1 year  |
| Images (optimized) | Stale-while-revalidate | 30 days |
| HTML (prerendered) | Stale-while-revalidate | 5 min   |
| API (public)       | Stale-while-revalidate | 1 hour  |
| API (auth)         | No cache               | —       |

### Next.js Config

```javascript
// next.config.mjs — Current
images: { unoptimized: true }  // ❌ Disables optimization

// Recommended
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [375, 768, 1280, 1440],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

---

## Database Query Performance

### Current Queries

| Query                 | Table               | Index                      | Est. Rows |
| --------------------- | ------------------- | -------------------------- | --------- |
| `getModuleById`       | module_progress     | `idx_module_progress_user` | 1         |
| `getModulesByBand`    | ai_modules (memory) | Map lookup                 | 12-24     |
| `getProgress`         | module_progress     | `idx_module_progress_user` | 1         |
| `audit_events` insert | audit_events        | —                          | 1/write   |

### Risks

- **No query analytics** — No slow query logging
- **No connection pooling** — Turso handles, but local SQLite doesn't
- **Batch progress writes** — Not implemented (per-keystroke risk)

---

## Free Tier Performance Ceilings

| Service                    | Limit          | Risk           | Mitigation                    |
| -------------------------- | -------------- | -------------- | ----------------------------- |
| **Cloudflare Workers**     | 100K req/day   | Medium         | Cache aggressively, batch API |
| **Cloudflare Workers CPU** | 10ms/request   | High (3D API)  | Move 3D to static/client      |
| **Turso Reads**            | 500M rows/mo   | Low            | Cache public data             |
| **Turso Writes**           | 10M rows/mo    | Low            | Batch progress                |
| **Supabase Realtime**      | 200 concurrent | Low (not used) | Polling instead               |
| **B2 Class A Ops**         | 1M/mo          | Low            | Presigned URLs                |
| **B2 Class B Ops**         | 10M/mo         | Low            | CDN cache                     |

---

## Testing Infrastructure

### Current

| Tool                | Configured | Runs |
| ------------------- | ---------- | ---- |
| **Lighthouse CI**   | ❌ No      | —    |
| **Playwright Perf** | ❌ No      | —    |
| **Bundle Analyzer** | ❌ No      | —    |
| **Web Vitals**      | ❌ No      | —    |

### Required

```bash
# Add to package.json
"perf:lighthouse": "lighthouse http://localhost:3030 --output=json",
"perf:bundle": "ANALYZE=true next build",
"perf:playwright": "playwright test --project=chromium --grep=performance"
```

---

## Recommendations

### Immediate (Week 1)

1. **Enable Next.js Image Optimization** — Remove `unoptimized: true`
2. **Add Bundle Analyzer** — `@next/bundle-analyzer` in CI
3. **Cap Pixel Ratio** — `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))`
4. **Disable Shadows on Mobile** — Quality tier detection

### Phase 1 (Weeks 2-3)

5. **3D Asset Pipeline** — GitHub Action: GLB → Draco + KTX2
6. **Quality Tiers** — Mobile (<500 particles), Desktop (full)
7. **Lighthouse CI** — Budget enforcement in PR checks
8. **Web Vitals** — `@vercel/web-vitals` or `web-vitals` library

### Phase 2 (Weeks 4-6)

9. **Progressive 3D Loading** — IntersectionObserver for all 3D
10. **Font Subsetting** — Latin-only WOFF2, self-host
11. **Service Worker** — Offline support for curriculum
12. **API Response Caching** — SWR / TanStack Query for client

### Monitoring

13. **Real User Monitoring** — Vercel Analytics / Cloudflare Web Analytics
14. **Error Tracking** — Sentry (free tier) for JS errors
15. **Database Query Logs** — Turso query analytics
