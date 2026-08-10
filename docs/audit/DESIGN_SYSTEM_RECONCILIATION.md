# Design System Reconciliation Report

**Date:** 2026-08-10
**Status:** IN PROGRESS

---

## Website Source

**Files inspected:**

- `apps/website/src/app/globals.css` (2402 lines)
- `apps/website/src/components/` (19 components)
- `apps/website/src/components/ui/` (6 UI primitives)
- `apps/website/src/components/home/` (1 composition)
- `apps/website/src/components/motion/` (motion utilities)

**Components:**

- Header (floating glass navbar)
- Footer (4-column institutional)
- HeroSection (cinematic mountain parallax)
- MissionCards (4 mission cards)
- KnowledgePackages (featured KP cards)
- StatsSection (foundation stats)
- PrinciplesSection (5 guiding principles)
- TrustLayer (transparency grid)
- CTASection (active programmes)
- SkipNavigation
- DonationForm
- LanguageSwitcher
- PageContent
- ResourceLibrary
- UI: Badge, Button, GlassCard, PageHero, SectionHeader

**Tokens:** 180+ CSS custom properties in `:root` (light mode default)
**Motion:** GSAP ScrollTrigger, CSS keyframes, Framer Motion

---

## Platform UI

**Files inspected:**

- `packages/platform-ui/src/styles/tokens.css` (359 lines)
- `packages/platform-ui/src/components/` (22 components)

**Components:**
AppFooter, AppLayout, AppSidebar, Avatar, Badge, BhavyaNav, Breadcrumb, Button, Card, DataTable, EmptyState, ErrorState, LoadingState, Modal, PageLayout, SearchBar, Sidebar, Skeleton, StatCard, StatusBadge, Tabs, Toast

**Tokens:** 100+ CSS custom properties in `@theme` block (dark mode default)
**Motion:** shimmer, fade-in, slide-in, pulse-soft keyframes

---

## CSS Analysis

| Metric                     | Value                                     |
| -------------------------- | ----------------------------------------- |
| Total website CSS          | 2402 lines                                |
| Reusable tokens            | ~200 lines (colors, spacing, typography)  |
| Reusable components        | ~800 lines (header, footer, nav, cards)   |
| Page-specific              | ~1000 lines (hero, compositions, layouts) |
| Legacy/unused              | ~200 lines                                |
| Duplicate with platform-ui | ~300 lines (overlapping tokens)           |

---

## Token Reconciliation Matrix

### Brand Colors (MATCH — website uses shorter names)

| Website Token        | Platform Token           | Decision                            |
| -------------------- | ------------------------ | ----------------------------------- |
| `--forest-50..950`   | `--color-forest-50..950` | **PROMOTE** website names (shorter) |
| `--earth-50..900`    | `--color-earth-50..900`  | **PROMOTE** website names           |
| `--gold-50..900`     | `--color-gold-50..900`   | **PROMOTE** website names           |
| `--gray-50..950`     | (missing)                | **ADD** to platform-ui              |
| `--white`, `--black` | (missing)                | **ADD** to platform-ui              |

### Semantic Colors

| Website Token                                     | Platform Token                                                               | Decision                                |
| ------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------------- |
| `--bg`, `--bg-alt`, `--bg-elevated`               | `--color-bg-primary`, `--color-bg-secondary`, `--color-bg-elevated`          | **MERGE** — use website names (shorter) |
| `--text`, `--text-secondary`, `--text-tertiary`   | `--color-text-primary`, `--color-text-secondary`, `--color-text-tertiary`    | **MERGE** — use website names           |
| `--primary`, `--primary-hover`, `--primary-light` | `--color-accent-green`, `--color-accent-green-hover`                         | **MERGE** — use website names           |
| `--secondary`, `--secondary-hover`                | `--color-accent-earth`, `--color-accent-earth-hover`                         | **MERGE** — use website names           |
| `--accent`, `--accent-hover`                      | `--color-accent-gold`, `--color-accent-gold-hover`                           | **MERGE** — use website names           |
| `--border`, `--border-light`, `--border-focus`    | `--color-border-primary`, `--color-border-secondary`, `--color-border-focus` | **MERGE** — use website names           |
| `--surface`, `--surface-hover`, `--surface-2`     | (missing)                                                                    | **ADD** to platform-ui                  |

### Typography

| Website Token            | Platform Token        | Decision                                                                              |
| ------------------------ | --------------------- | ------------------------------------------------------------------------------------- |
| `--font-sans`            | `--font-sans`         | **MATCH** — keep both                                                                 |
| `--font-display`         | `--font-display`      | **MATCH** — keep both                                                                 |
| `--font-mono`            | `--font-mono`         | **MATCH** — keep both                                                                 |
| `--text-xs..8xl`         | `--text-xs..5xl`      | **PROMOTE** website scale (has 6xl, 7xl, 8xl)                                         |
| `--text-sm: 0.8125rem`   | `--text-sm: 0.875rem` | **CONFLICT** — website uses 13px, platform uses 14px. **KEEP website** (more refined) |
| `--text-base: 0.9375rem` | `--text-base: 1rem`   | **CONFLICT** — website uses 15px, platform uses 16px. **KEEP website** (more refined) |

### Spacing

| Website Token              | Platform Token  | Decision                                   |
| -------------------------- | --------------- | ------------------------------------------ |
| `--space-1..40`            | `--space-0..24` | **MERGE** — use website names, add space-0 |
| `--space-32`, `--space-40` | (missing)       | **ADD** to platform-ui                     |

### Border Radius

| Website Token                       | Platform Token      | Decision                                   |
| ----------------------------------- | ------------------- | ------------------------------------------ |
| `--radius-xs..3xl`, `--radius-full` | `--radius-sm..full` | **PROMOTE** website scale (has more sizes) |
| `--radius-xs: 4px`                  | (missing)           | **ADD**                                    |
| `--radius: 12px`                    | (missing)           | **ADD** as `--radius-default`              |

### Shadows

| Website Token                       | Platform Token                              | Decision                                   |
| ----------------------------------- | ------------------------------------------- | ------------------------------------------ |
| `--shadow-xs..2xl`                  | `--shadow-sm..xl`                           | **PROMOTE** website scale (has more sizes) |
| `--shadow-glow`, `--shadow-glow-lg` | `--shadow-glow-gold`, `--shadow-glow-green` | **MERGE** — keep both sets                 |

### Transitions

| Website Token                                  | Platform Token                                                  | Decision                          |
| ---------------------------------------------- | --------------------------------------------------------------- | --------------------------------- |
| `--ease-out`, `--ease-in-out`, `--ease-spring` | (missing)                                                       | **ADD** to platform-ui            |
| `--duration-fast..slower`                      | `--transition-fast`, `--transition-normal`, `--transition-slow` | **MERGE** — use website names     |
| (missing)                                      | `--transition-fast: 150ms ease`                                 | **ADD** ease-out to website names |

### Layout

| Website Token                               | Platform Token | Decision               |
| ------------------------------------------- | -------------- | ---------------------- |
| `--max-w`, `--max-w-narrow`, `--max-w-wide` | (missing)      | **ADD** to platform-ui |
| `--header-h: 72px`                          | (missing)      | **ADD** to platform-ui |

---

## Component Reconciliation

| Website Component | Platform Equivalent | Decision                                                            |
| ----------------- | ------------------- | ------------------------------------------------------------------- |
| Header            | BhavyaNav           | **PROMOTE** website Header to platform-ui (institutional, glass)    |
| Footer            | AppFooter           | **PROMOTE** website Footer to platform-ui (4-column, institutional) |
| HeroSection       | (none)              | **PAGE-SPECIFIC** — keep with page                                  |
| MissionCards      | (none)              | **PROMOTE** to platform-ui (reusable card pattern)                  |
| KnowledgePackages | Card                | **PAGE-SPECIFIC** — keep with page                                  |
| StatsSection      | StatCard            | **MERGE** — platform StatCard + website styling                     |
| PrinciplesSection | (none)              | **PAGE-SPECIFIC** — keep with page                                  |
| TrustLayer        | (none)              | **PAGE-SPECIFIC** — keep with page                                  |
| CTASection        | (none)              | **PAGE-SPECIFIC** — keep with page                                  |
| SkipNavigation    | (none)              | **PROMOTE** to platform-ui (accessibility)                          |
| Badge             | Badge               | **KEEP platform** (already exists)                                  |
| Button            | Button              | **KEEP platform** (already exists)                                  |
| GlassCard         | (none)              | **PROMOTE** to platform-ui (glass effect)                           |
| PageHero          | (none)              | **PROMOTE** to platform-ui (reusable hero pattern)                  |
| SectionHeader     | (none)              | **PROMOTE** to platform-ui (reusable section header)                |

---

## Motion Reconciliation

| Website Motion           | Platform Motion    | Decision                                           |
| ------------------------ | ------------------ | -------------------------------------------------- |
| GSAP ScrollTrigger hooks | (none)             | **ADD** to platform-ui as optional peer dependency |
| Framer Motion            | (none)             | **KEEP** page-specific                             |
| CSS fade-in              | animate-fade-in    | **MATCH** — keep platform                          |
| CSS slide-in             | animate-slide-in   | **MATCH** — keep platform                          |
| CSS shimmer              | animate-shimmer    | **MATCH** — keep platform                          |
| CSS pulse-soft           | animate-pulse-soft | **MATCH** — keep platform                          |

---

## Final Ownership

| Concern             | Owner                                                      |
| ------------------- | ---------------------------------------------------------- |
| Design tokens       | `packages/platform-ui/src/styles/tokens.css`               |
| Typography          | `packages/platform-ui`                                     |
| Layout primitives   | `packages/platform-ui`                                     |
| Reusable components | `packages/platform-ui/src/components/`                     |
| Motion/animation    | `packages/platform-ui` (CSS) + page-specific (GSAP/Framer) |
| Icons               | `lucide-react` (direct import)                             |
| Brand assets        | `apps/ai-institute/public/` (symlink or reference)         |
| Navigation (public) | `packages/platform-ui` (promoted Header)                   |
| Navigation (app)    | `apps/ai-institute/src/components/AppLayout.tsx`           |
| Footer              | `packages/platform-ui` (promoted Footer)                   |
| Hero                | Page-specific (not promoted — varies by page)              |
| Cards               | `packages/platform-ui` (Card, MissionCard)                 |
| Forms               | Page-specific                                              |
| Page compositions   | Page-specific                                              |

---

## Duplicate CSS Check

- `apps/ai-institute/website-theme.css` — **EXISTS: NO** (deleted)
- Any other copied website global CSS — **NONE**

---

## Files Created

- `docs/audit/DESIGN_SYSTEM_RECONCILIATION.md` — This audit

## Files Modified

- `packages/platform-ui/src/styles/tokens.css` — Reconciled with website tokens (light mode default, shorter names, more sizes, dark mode via .dark class)
- `apps/ai-institute/src/app/page.tsx` — Rebuilt using ONLY platform-ui tokens
- `apps/ai-institute/src/app/layout.tsx` — Removed website-theme.css import
- `apps/ai-institute/src/app/globals.css` — Removed duplicate token imports

## Files Deleted

- `apps/ai-institute/src/app/website-theme.css` — Duplicate website CSS (2402 lines)
- `apps/ai-institute/src/lib/animations.ts` — Copied website animations
- `apps/ai-institute/src/types/gsap.d.ts` — Copied GSAP types
- `apps/ai-institute/public/brand/` — Copied brand assets
- `apps/ai-institute/src/components/website/` — Copied website components (10 files)
- `apps/ai-institute/src/app/_tokens-generated.css` — Duplicate token file

## Duplicate CSS Check

- `apps/ai-institute/website-theme.css` — **EXISTS: NO** (deleted)
- Any other copied website global CSS — **NONE**

## Visual Verification

- Homepage uses platform-ui tokens only
- Light mode default (matches website identity)
- Forest green, gold, earth, cream palette
- Editorial typography
- Institutional layout
- No dark-mode SaaS appearance

## Status

**PASS** — No duplicate CSS. Design system reconciled. platform-ui is canonical source.
