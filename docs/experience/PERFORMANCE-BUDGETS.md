# PERFORMANCE-BUDGETS.md — Performance Budgets by Route Tier

**Date:** 2026-10-16  
**Branch:** feat/immersive-hero-background  
**Source:** `docs/experience/EXPERIENCE-BASELINE.md` §8, `ROUTE-EXPERIENCE-MATRIX.md`

---

## 1. Performance Budget Table

| Tier                        | Initial JS (mobile) | Initial JS (desktop) | 3D Download (mobile) | 3D Download (desktop) | Draw Calls (mobile) | Draw Calls (desktop) | Texture Dimensions |
| --------------------------- | ------------------- | -------------------- | -------------------- | --------------------- | ------------------- | -------------------- | ------------------ |
| A — Cinematic Flagship      | ≤350 KB gzip        | ≤350 KB gzip         | ≤4 MB                | ≤4 MB                 | <250                | <250                 | 512–1024           |
| B — Interactive Explanatory | ≤250 KB gzip        | ≤250 KB gzip         | ≤2 MB                | ≤2 MB                 | <150                | <150                 | 512–1024           |
| C — Functional Learning     | ≤200 KB gzip        | ≤200 KB gzip         | — (no 3D)            | — (no 3D)             | —                   | —                    | —                  |
| D — Operational             | ≤100 KB gzip        | ≤100 KB gzip         | — (no 3D)            | — (no 3D)             | —                   | —                    | —                  |

---

## 2. Current Baseline vs Budget (Estimated)

| Metric                | Target (Mobile) | Current (Est.) | Status         |
| --------------------- | --------------- | -------------- | -------------- |
| Initial JS (mobile)   | ≤250 KB gzip    | ~300 KB        | ⚠️ Over budget |
| Initial JS (desktop)  | ≤350 KB gzip    | ~400 KB        | ⚠️ Over budget |
| 3D download (mobile)  | ≤1.5 MB         | ~2 MB          | ⚠️ Over budget |
| 3D download (desktop) | ≤4 MB           | ~8 MB          | ⚠️ Over budget |
| Draw calls (mobile)   | <100            | ~150           | ⚠️ Over budget |
| Draw calls (desktop)  | <250            | ~300           | ⚠️ Over budget |
| Texture dimensions    | 512–1024        | 4K EXR source  | ⚠️ Over budget |

---

## 3. Route-Level Budgets

| Route                        | Tier | JS Budget | 3D Budget | Notes                              |
| ---------------------------- | ---- | --------- | --------- | ---------------------------------- |
| `/`                          | A    | ≤350 KB   | ≤4 MB     | Homepage, four-pillar 3D system    |
| `/mission`                   | A    | ≤350 KB   | ≤4 MB     | Animated four-pillar diagram       |
| `/missions/*`                | A    | ≤350 KB   | ≤4 MB     | Terrain/neural/heritage/network 3D |
| `/knowledge`                 | A    | ≤350 KB   | ≤4 MB     | 3D concept network                 |
| `/curriculum`                | C    | ≤200 KB   | —         | Static band cards                  |
| `/curriculum/levels/*`       | C    | ≤200 KB   | —         | Static module cards                |
| `/app`                       | C    | ≤200 KB   | —         | Progress rings, upcoming           |
| `/login`, `/register`        | D    | ≤100 KB   | —         | Auth forms only                    |
| `/privacy`, `/accessibility` | D    | ≤50 KB    | —         | Legal text only                    |

---

## 4. CI Enforcement (Missing)

| Check                   | Tool                        | Status       |
| ----------------------- | --------------------------- | ------------ |
| Bundle size per route   | `next-build` size analysis  | ❌ Not in CI |
| 3D asset size check     | Custom script + `sha256sum` | ❌ Not in CI |
| Draw call budget        | Three.js render stats       | ❌ Not in CI |
| Texture dimension check | Image metadata inspection   | ❌ Not in CI |

**Next Step:** Add `pnpm perf:check` to CI that fails builds exceeding budgets.

---

## 5. Next: Create IMPLEMENTATION-ROADMAP.md
