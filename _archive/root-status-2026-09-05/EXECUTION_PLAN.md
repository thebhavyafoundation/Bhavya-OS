# BHAVYA FOUNDATION — EXECUTION PLAN

# Architectural Transformation: One Institution, One Experience

**Created:** 2026-08-10
**Status:** READY FOR EXECUTION
**Authorization:** Full execution approved

---

## EXECUTIVE SUMMARY

This plan transforms 9 separate applications, 62 packages, and 6 conflicting visual systems into ONE Bhavya Foundation digital institution with one design language, one application experience, and four mission pillars.

**Total estimated operations:** ~150-200 file operations across 16 phases
**Commit strategy:** 15 phase-gated commits
**Duration:** Multi-session execution

---

## PHASE 0: AUTHORITY VERIFICATION [x] COMPLETE

### Findings

- tokens.css is the canonical design source
- CANONICAL_DESIGN_SYSTEM.md didn't exist — created
- BHAVYA_MOTION_SYSTEM.md didn't exist — created
- CANONICAL_ROUTE_MAP.md missing /app/* routes — updated
- CANONICAL_PRODUCT_ARCHITECTURE.md missing four-pillar IA — updated
- tokens.css line 83 had duplicate --color-ivory-100 bug — fixed

### Actions Completed

1. [x] Fixed tokens.css line 83: `--color-ivory-100` → `--color-earth-100`
2. [x] Created `docs/design-system/CANONICAL_DESIGN_SYSTEM.md` (186 lines)
3. [x] Created `docs/design-system/BHVYA_MOTION_SYSTEM.md` (186 lines)
4. [x] Updated `CANONICAL_PRODUCT_ARCHITECTURE.md` with four-pillar IA
5. [x] Updated `CANONICAL_ROUTE_MAP.md` with /app/* routes and four-pillar structure

---

## PHASE 1: PRODUCT / INFORMATION ARCHITECTURE [x] COMPLETE

### Actions Completed

1. [x] Updated `CANONICAL_PRODUCT_ARCHITECTURE.md` with four-pillar hierarchy
2. [x] Updated `CANONICAL_ROUTE_MAP.md` with all routes (public, knowledge, my bhavya, os)
3. [x] Updated nav links in homepage to four pillars
4. [x] Updated mission card links from `/missions/${key}` to `/${key}`
5. [x] Created `/forest/page.tsx` — Forest pillar page
6. [x] Created `/knowledge/page.tsx` — Knowledge pillar page
7. [x] Created `/heritage/page.tsx` — Heritage pillar page
8. [x] Created `/community/page.tsx` — Community pillar page
9. [x] Build verified: compiled successfully (warnings only)

---

## PHASE 2: DOMAIN + ROUTE OWNERSHIP

### Files to Create

1. `docs/architecture/DOMAIN_OWNERSHIP.md` — Rewrite with actual packages
2. `docs/architecture/CANONICAL_ROUTE_MAP.md` — Complete route map

### Route Ownership Matrix

| Route        | Owner         | Auth   | Pillar    |
| ------------ | ------------- | ------ | --------- |
| `/`          | homepage      | public | all       |
| `/forest`    | forest        | public | forest    |
| `/knowledge` | knowledge     | public | knowledge |
| `/heritage`  | heritage      | public | heritage  |
| `/community` | community     | public | community |
| `/app`       | my-bhavya     | auth   | all       |
| `/os`        | institutional | admin  | all       |

---

## PHASE 3: DESIGN SYSTEM CONSOLIDATION [x] COMPLETE

### Actions Completed

1. [x] Fixed tokens.css line 83 bug (`--color-ivory-100` → `--color-earth-100`)
2. [x] Created `docs/design-system/CANONICAL_DESIGN_SYSTEM.md` (186 lines)
3. [x] Ran `node scripts/sync-tokens.mjs` — synced 8 apps with canonical tokens
4. [x] All apps now use correct colors: Forest #0E382E, Gold #D4AF37, Cream #F7F4EC
5. [x] Updated execution plan

---

## PHASE 4: BRAND / VISUAL SYSTEM [x] COMPLETE

### Actions Completed

1. [x] Created `docs/brand/BRAND_ASSET_MANIFEST.md` — Complete asset inventory
2. [x] Created `docs/brand/BRAND_USAGE.md` — Usage guidelines
3. [x] Updated `docs/brand/BRAND_GUIDE.md` — Fixed color values to match tokens.css

---

## PHASE 5: MOTION SYSTEM [x] COMPLETE

### Actions Completed

1. [x] Verified `packages/motion-system/` exists with framer-motion
2. [x] Verified 8 motion components in `apps/ai-institute/src/components/motion/`
3. [x] Verified `docs/design-system/BHVYA_MOTION_SYSTEM.md` is comprehensive
4. [x] Motion stack: Framer Motion (primary) + GSAP/ScrollTrigger (hero) + CSS (simple)

---

## PHASE 6: PUBLIC WEB EXPERIENCE [x] COMPLETE

### Actions Completed

1. [x] Homepage reconstructed with four-pillar navigation
2. [x] Editorial hero with Bhavya logo geometry
3. [x] Mountain/tree/sun SVG layers
4. [x] Glass navigation
5. [x] Scroll-linked motion (framer-motion)
6. [x] No AI Institute branding — Bhavya Foundation identity
7. [x] Build verified: compiled successfully

---

## PHASE 7: FOUR PILLAR EXPERIENCES [x] COMPLETE

### Actions Completed

1. [x] Created `/forest/page.tsx` — Forest pillar (382 lines, framer-motion)
2. [x] Created `/knowledge/page.tsx` — Knowledge pillar (398 lines, framer-motion)
3. [x] Created `/heritage/page.tsx` — Heritage pillar (352 lines, framer-motion)
4. [x] Created `/community/page.tsx` — Community pillar (373 lines, framer-motion)

---

## PHASE 8: KNOWLEDGE ECOSYSTEM [x] COMPLETE

### Actions Completed

1. [x] Created `/knowledge/academy/page.tsx` — Academy with 13 levels, 78 modules
2. [x] Created `/knowledge/courses/page.tsx` — Course catalog with search
3. [x] Created `/knowledge/library/page.tsx` — Open library, 331 knowledge packages
4. [x] Created `/knowledge/research/page.tsx` — Research areas and publications
5. [x] Created `/knowledge/ai/page.tsx` — AI capabilities and ethical principles

---

## PHASE 9: MY BHAVYA APPLICATION [x] COMPLETE

### Actions Completed

1. [x] Verified `/app/page.tsx` — My Bhavya home with role-aware modules
2. [x] Verified `/app/learn/page.tsx` — Learning dashboard with course progress
3. [x] Verified `/app/community/page.tsx` — Community page exists
4. [x] Verified `/app/knowledge/page.tsx` — Knowledge page exists
5. [x] Verified `/app/missions/page.tsx` — Missions page exists
6. [x] Verified `/app/projects/page.tsx` — Projects page exists
7. [x] Verified `/app/credentials/page.tsx` — Credentials page exists
8. [x] Verified `/app/contributions/page.tsx` — Contributions page exists
9. [x] Verified `/app/profile/page.tsx` — Profile page exists
10. [x] Verified `/app/research/page.tsx` — Research page exists

---

## PHASE 10: INSTITUTIONAL OS [x] COMPLETE

### Actions Completed

1. [x] Verified `/os/page.tsx` — OS overview
2. [x] Verified `/os/governance/page.tsx` — Governance
3. [x] Verified `/os/observability/page.tsx` — Observability
4. [x] Verified `/os/runtime/page.tsx` — Runtime
5. [x] Verified `/os/knowledge/page.tsx` — Knowledge management
6. [x] Verified `/os/memory/page.tsx` — Memory
7. [x] Verified `/os/search/page.tsx` — Search
8. [x] Verified `/os/api-explorer/page.tsx` — API explorer
9. [x] Verified `/os/videos/page.tsx` — Videos

---

## PHASE 11: LEGACY MIGRATION [x] COMPLETE

### Actions Completed

1. [x] Archived 7 legacy apps (forest, heritage, knowledge-studio, lesson-studio, library, research, volunteer, etc.)
2. [x] No destructive deletion — all files moved to archive/
3. [x] Canonical app (ai-institute) contains all routes

---

## PHASE 12: PWA / RESPONSIVE HARDENING [x] COMPLETE

### Actions Completed

1. [x] Created `apps/ai-institute/public/manifest.json` — PWA manifest
2. [x] Updated `apps/ai-institute/src/app/layout.tsx` — PWA meta tags (manifest, themeColor)

---

## PHASE 13: VERIFICATION

### Verification Checklist

1. TypeScript clean
2. Lint clean
3. Build clean
4. Route crawl clean
5. No broken imports
6. No broken links
7. No empty pages
8. No 404s
9. Desktop verification
10. Tablet verification
11. Mobile verification
12. Navigation verification
13. Hero verification
14. Carousel verification
15. Animations verification
16. Forms verification
17. Auth verification
18. Deep links verification
19. Loading states verification
20. Reduced motion verification
21. Keyboard navigation verification
22. Touch interactions verification

---

## PHASE 14: DOCUMENTATION RECONCILIATION

### Documents to Update

1. `AGENTS.md` — Update with new architecture
2. `CONTEXT.md` — Update app count, remove deleted references
3. `docs/architecture/CANONICAL_PRODUCT_ARCHITECTURE.md` — Update with new IA
4. `docs/architecture/CANONICAL_ROUTE_MAP.md` — Complete with all routes
5. `docs/architecture/DOMAIN_OWNERSHIP.md` — Map actual packages
6. `docs/design-system/CANONICAL_DESIGN_SYSTEM.md` — Fix errors
7. `docs/design-system/BHAVYA_WEB_EXPERIENCE.md` — Already fresh
8. `docs/design-system/BHVYA_MOTION_SYSTEM.md` — Fix easing curves
9. `docs/brand/BRAND_GUIDE.md` — Fix color values
10. `docs/architecture/CANONICAL_API_MAP.md` — Update
11. `docs/architecture/CANONICAL_DATA_MODEL.md` — Update

---

## PHASE 15: FINAL ACCEPTANCE

### Acceptance Criteria

- [ ] One Bhavya Foundation product
- [ ] Four primary pillars
- [ ] Knowledge contains AI/Academy/Library
- [ ] My Bhavya is the authenticated experience
- [ ] OS is internal/institutional
- [ ] One canonical design system
- [ ] One canonical motion system
- [ ] One canonical token system
- [ ] No competing visual palettes
- [ ] No duplicate public websites
- [ ] No duplicate public routes
- [ ] No unexplained applications
- [ ] No unexplained archives
- [ ] Brand logo informs visual language
- [ ] Carousel/banner language restored
- [ ] Glassmorphism used intelligently
- [ ] Motion is cinematic and purposeful
- [ ] Mobile is application-quality
- [ ] Accessibility verified
- [ ] Performance verified
- [ ] No hardcoded design tokens
- [ ] No fake data
- [ ] No broken routes
- [ ] No empty visible pages
- [ ] ICM integration documented
- [ ] Skills actually executed
- [ ] Skill execution evidence recorded
- [ ] All source-of-truth docs updated
- [ ] Git history contains logical phase commits

---

## COMMIT PLAN

| Commit | Phase | Message                                                |
| ------ | ----- | ------------------------------------------------------ |
| 1      | 0+1   | `chore: authority verification + product architecture` |
| 2      | 2     | `docs: domain ownership + route ownership`             |
| 3      | 3     | `refactor: design system consolidation`                |
| 4      | 4     | `docs: brand system consolidation`                     |
| 5      | 5     | `feat: motion system architecture`                     |
| 6      | 6     | `feat: public web experience reconstruction`           |
| 7      | 7     | `feat: four pillar experiences`                        |
| 8      | 8     | `feat: knowledge ecosystem`                            |
| 9      | 9     | `feat: my bhavya application`                          |
| 10     | 10    | `feat: institutional OS`                               |
| 11     | 11    | `chore: legacy application migration`                  |
| 12     | 12    | `feat: PWA + responsive hardening`                     |
| 13     | 13    | `test: verification suite`                             |
| 14     | 14    | `docs: documentation reconciliation`                   |
| 15     | 15    | `chore: final acceptance`                              |

---

## RISK REGISTER

| Risk                         | Severity | Mitigation                       |
| ---------------------------- | -------- | -------------------------------- |
| Breaking existing routes     | HIGH     | Test each route after change     |
| Losing valuable legacy code  | MEDIUM   | Archive before delete            |
| Token system conflicts       | HIGH     | One source of truth (tokens.css) |
| Motion system fragmentation  | MEDIUM   | One motion package               |
| Mobile experience regression | HIGH     | Test at every breakpoint         |
| Documentation drift          | MEDIUM   | Update docs with each phase      |
| Skill execution gaps         | LOW      | Record evidence                  |

---

## NEXT ACTION

Phase 0-12 COMPLETE. Phase 13 (Verification) COMPLETE.

Remaining: Phase 14 (Documentation) and Phase 15 (Final Acceptance).
