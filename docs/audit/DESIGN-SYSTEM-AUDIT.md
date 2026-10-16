# DESIGN-SYSTEM-AUDIT — Current Design System State

**Date:** 2026-10-12
**Source:** `packages/platform-ui/`, `apps/ai-institute/src/app/globals.css`

---

## Token System (`packages/platform-ui/src/styles/tokens.css` — 689 lines)

### ✅ Strengths

- **Comprehensive**: 359 lines of tokens covering colors, typography, spacing, motion, shadows, z-index
- **Semantic naming**: `--color-bg-primary`, `--color-text-secondary`, `--color-accent-gold`
- **Dark mode**: Complete `.dark` class override (lines 361-408)
- **Brand alignment**: Forest/Ivory/Gold/Sage/Earth scales match Brand Constitution
- **Motion tokens**: Duration, easing, stagger, parallax speeds defined
- **Glass system**: 4 glass variants with backdrop-filter
- **Data viz palette**: 8 brand-compliant hues with bg/border variants
- **Focus rings**: Consistent `--ring-focus` / `--ring-focus-inset`
- **Reduced motion**: Media query disables animations

### ⚠️ Issues

| Issue                                    | Location                  | Severity                                                         |
| ---------------------------------------- | ------------------------- | ---------------------------------------------------------------- |
| **Playfair Display** as `--font-display` | Line 160                  | **High** — Brand Constitution mandates Inter/SF Pro for headings |
| **Duplicate editorial classes**          | `globals.css` lines 12-31 | Medium — Already in tokens.css                                   |
| **Inline styles in components**          | Multiple files            | Medium — Should use tokens                                       |
| **No design token validation**           | CI                        | Medium — No `tokens:check` in CI                                 |
| **CSS custom properties not typed**      | TypeScript                | Low — No type safety                                             |

### Font Stack Conflict

**Current (tokens.css):**

```css
--font-display: "Playfair Display", Georgia, "Times New Roman", serif;
--font-sans:
  "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
```

**Brand Constitution (Doc 15) Requirement:**

- Headings: **Inter / SF Pro**
- Body: **Inter / SF Pro**

**Resolution Needed:** Board-approved decision (see ADR-017 draft)

---

## Component Library (`packages/platform-ui/src/components/` — 22+ components)

### Components Inventory

| Component      | File               | Status | Notes                              |
| -------------- | ------------------ | ------ | ---------------------------------- |
| `AppShell`     | `AppShell.tsx`     | ✅     | Layout wrapper                     |
| `Badge`        | `Badge.tsx`        | ✅     | Status indicators                  |
| `Breadcrumbs`  | `Breadcrumbs.tsx`  | ✅     | Navigation                         |
| `Button`       | `Button.tsx`       | ✅     | Primary, secondary, ghost variants |
| `Card`         | `Card.tsx`         | ✅     | Content container                  |
| `DataTable`    | `DataTable.tsx`    | ✅     | Sortable, filterable               |
| `ErrorState`   | `ErrorState.tsx`   | ✅     | Error display                      |
| `FormField`    | `FormField.tsx`    | ✅     | Input wrapper                      |
| `LoadingState` | `LoadingState.tsx` | ✅     | Skeleton/spinner                   |
| `Modal`        | `Modal.tsx`        | ✅     | Dialog                             |
| `PageLayout`   | `PageLayout.tsx`   | ✅     | Page structure                     |
| `ProgressBar`  | `ProgressBar.tsx`  | ✅     | Progress indicator                 |
| `SearchBar`    | `SearchBar.tsx`    | ✅     | Search input                       |
| `Sidebar`      | `Sidebar.tsx`      | ✅     | Navigation sidebar                 |
| `Skeleton`     | `Skeleton.tsx`     | ✅     | Loading placeholder                |
| `StatCard`     | `StatCard.tsx`     | ✅     | Metric display                     |
| `StatusBadge`  | `StatusBadge.tsx`  | ✅     | Status pills                       |
| `Tabs`         | `Tabs.tsx`         | ✅     | Tab navigation                     |
| `Toast`        | `Toast.tsx`        | ✅     | Notifications                      |
| `Tooltip`      | `Tooltip.tsx`      | ✅     | Hover info                         |

### Export Structure (`src/index.ts`)

```typescript
export * from "./components/AppShell";
export * from "./components/Badge";
// ... all components
export * from "./styles/tokens.css"; // CSS import
```

### ⚠️ Component Issues

| Issue                            | Severity | Details                               |
| -------------------------------- | -------- | ------------------------------------- |
| **No Storybook**                 | Medium   | No component documentation/playground |
| **No visual regression tests**   | Medium   | No Chromatic/Percy integration        |
| **Inconsistent prop interfaces** | Low      | Some use `variant`, others `kind`     |
| **Missing `forwardRef`**         | Low      | Some components don't forward refs    |
| **No component tests**           | Medium   | Only typecheck, no render tests       |

---

## Application-Level Styles (`apps/ai-institute/src/app/globals.css` — 126KB, 6067 lines)

### ⚠️ Major Concerns

| Issue                           | Lines                                    | Impact                              |
| ------------------------------- | ---------------------------------------- | ----------------------------------- |
| **Massive file**                | 6067                                     | Hard to maintain, duplicates tokens |
| **Inline component styles**     | Throughout                               | Should be in components             |
| **Duplicate editorial classes** | 12-31                                    | Already in tokens.css               |
| **Hardcoded colors**            | Throughout                               | Bypasses token system               |
| **Utility classes mixed**       | Throughout                               | Tailwind + custom = confusion       |
| **Component-specific CSS**      | e.g., `.site-nav`, `.mobile-menu-drawer` | Should be in component files        |

### Examples of Token Bypass

```css
/* globals.css line 161-166 */
.site-nav {
  background: rgba(247, 244, 236, 0.82);  // Should use var(--color-surface-glass)
  backdrop-filter: blur(20px) saturate(1.4);
  border-bottom: 1px solid var(--color-border-primary);  // Good
}

/* globals.css line 195-206 */
.nav-cta-support {
  background: linear-gradient(90deg, #d4af37, #c09a2a);  // Hardcoded gold gradient
}
```

---

## Motion System (`apps/ai-institute/src/lib/motion/`)

### Apple Springs (`apple-springs.ts`)

- ✅ Damping/response spring model (WWDC 2018)
- ✅ `SPRING_DEFAULT`, `SPRING_MOMENTUM`, `SPRING_REPOSITION`
- ✅ Velocity tracking, momentum projection, rubber-band
- ✅ Reduced motion detection
- ✅ Web Animations API integration

### Scroll Provider (`scrollProvider.tsx`)

- ✅ Framer Motion scroll-linked animations
- ✅ `useScroll`, `useTransform` hooks

### Direct Manipulation (`useDirectManipulation.ts`)

- ✅ Drag with spring return
- ✅ Velocity-based release

### Scroll Reveal (`useScrollReveal.ts`)

- ✅ IntersectionObserver-based
- ✅ Stagger support

### ⚠️ Motion Issues

| Issue                                    | Severity                                           |
| ---------------------------------------- | -------------------------------------------------- |
| **Multiple animation libraries**         | High — Framer Motion + GSAP + Lenis + Native WAAPI |
| **GSAP ScrollTrigger**                   | High — Used in `CinematicHero`, `HeroBackground`   |
| **Lenis smooth scroll**                  | Medium — May conflict with native scroll           |
| **No unified motion strategy**           | Medium — 4+ systems coexist                        |
| **Reduced motion not enforced globally** | Medium — Only in apple-springs                     |

---

## 3D Visual System (`apps/ai-institute/src/components/three/`)

### Components

| Component                           | Purpose                             | Size   |
| ----------------------------------- | ----------------------------------- | ------ |
| `CinematicHero.tsx`                 | Pillar-specific 3D hero (702 lines) | Large  |
| `ParticleSystems.tsx`               | 4 pillar particle systems           | Medium |
| `HeroBackground.tsx`                | Legacy gradient hero                | Medium |
| `Card3D.tsx` / `Card3DRenderer.tsx` | 3D cards                            | Small  |
| `Model3D.tsx`                       | GLTF loader                         | Small  |
| `MistScene.tsx`                     | Atmospheric effects                 | Small  |
| `PillarSphere.tsx`                  | Sphere visualization                | Small  |

### ⚠️ 3D Issues

| Issue                                   | Severity                                           |
| --------------------------------------- | -------------------------------------------------- |
| **Duplicate `CinematicScene` function** | **Critical** — Lines 170-244 AND 285-359 identical |
| **No quality tier enforcement**         | High — Mobile gets desktop assets                  |
| **4K textures in public/**              | High — Should be optimized derivatives             |
| **No WebGL fallback testing**           | Medium — Not in CI                                 |
| **No memory leak detection**            | Medium — Scene disposal not verified               |
| **Lazy loading only on hero**           | Medium — Other 3D loads eagerly                    |

---

## Icon System

- **Primary**: `lucide-react` (0.468.0) — Used in platform-ui + ai-institute
- **Consistent**: Single icon family ✅
- **Tree-shakeable**: ES modules ✅

---

## Accessibility in Design System

### ✅ Present

- Focus-visible styles (globals.css lines 56-83)
- Skip link (globals.css lines 37-54)
- High contrast media query (globals.css lines 79-83)
- Semantic color tokens (not color-only meaning)
- 44px touch targets (in Button, etc.)

### ⚠️ Missing

| Gap                              | Severity                          |
| -------------------------------- | --------------------------------- |
| **No automated a11y tests**      | High — No axe-core in CI          |
| **No component a11y docs**       | Medium — Storybook would help     |
| **Color contrast not validated** | Medium — Tokens assumed compliant |
| **No ARIA pattern library**      | Low — Custom implementations vary |

---

## Recommendations

### Immediate (Phase 1)

1. **Resolve font conflict** — Board decision on Playfair vs Inter
2. **Remove duplicate `CinematicScene`** — Delete lines 285-359 in `CinematicHero.tsx`
3. **Slim `globals.css`** — Move component styles to components, keep only global utilities
4. **Add `tokens:check` to CI** — Validate no hardcoded colors in components

### Short-term (Phase 2)

4. **Unify motion library** — Choose: Framer Motion (React) OR GSAP (complex sequences) OR Native
5. **Add Storybook** — Document all platform-ui components
6. **Add visual regression** — Playwright + pixelmatch for design system
7. **Component a11y tests** — axe-core in Vitest

### Medium-term (Phase 3)

8. **3D quality tiers** — Implement mobile/desktop asset switching
9. **Asset pipeline** — Automated GLB → Draco + KTX2 in CI
10. **Design token TypeScript types** — `tokens.d.ts` for type-safe tokens
