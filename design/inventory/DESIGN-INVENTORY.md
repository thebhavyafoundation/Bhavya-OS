# Bhavya Design Inventory

**Status:** ACTIVE
**Version:** 1.0.0
**Created:** 2026-09-07
**Owner:** Bhavya Foundation Design

---

## Purpose

This inventory lists every design artifact in Bhavya Foundation. It is the canonical reference for what exists, where it lives, and its status.

---

## Components

### Production Components (22)

| Component    | Location                                               | Purpose             | Accessibility           | Tests |
| ------------ | ------------------------------------------------------ | ------------------- | ----------------------- | ----- |
| AppFooter    | `packages/platform-ui/src/components/AppFooter.tsx`    | Site footer         | Landmark, links         | ✅    |
| AppLayout    | `packages/platform-ui/src/components/AppLayout.tsx`    | Main layout wrapper | Responsive, semantic    | ✅    |
| AppSidebar   | `packages/platform-ui/src/components/AppSidebar.tsx`   | Side navigation     | Collapsible, keyboard   | ✅    |
| Avatar       | `packages/platform-ui/src/components/Avatar.tsx`       | User avatar         | Image alt, fallback     | ✅    |
| Badge        | `packages/platform-ui/src/components/Badge.tsx`        | Status indicator    | Color + text            | ✅    |
| BhavyaNav    | `packages/platform-ui/src/components/BhavyaNav.tsx`    | Main navigation     | Keyboard, ARIA          | ✅    |
| Breadcrumb   | `packages/platform-ui/src/components/Breadcrumb.tsx`   | Page hierarchy      | Navigation landmark     | ✅    |
| Button       | `packages/platform-ui/src/components/Button.tsx`       | Interactive element | Focus, disabled state   | ✅    |
| Card         | `packages/platform-ui/src/components/Card.tsx`         | Content container   | Semantic grouping       | ✅    |
| DataTable    | `packages/platform-ui/src/components/DataTable.tsx`    | Data display        | Sortable, accessible    | ✅    |
| EmptyState   | `packages/platform-ui/src/components/EmptyState.tsx`   | No data state       | Illustration + action   | ✅    |
| ErrorState   | `packages/platform-ui/src/components/ErrorState.tsx`   | Error state         | Clear messaging         | ✅    |
| LoadingState | `packages/platform-ui/src/components/LoadingState.tsx` | Loading state       | Progress indication     | ✅    |
| Modal        | `packages/platform-ui/src/components/Modal.tsx`        | Dialog overlay      | Focus trap, escape      | ✅    |
| PageLayout   | `packages/platform-ui/src/components/PageLayout.tsx`   | Page wrapper        | Responsive, semantic    | ✅    |
| SearchBar    | `packages/platform-ui/src/components/SearchBar.tsx`    | Search input        | Labels, clear button    | ✅    |
| Sidebar      | `packages/platform-ui/src/components/Sidebar.tsx`      | Side panel          | Collapsible, keyboard   | ✅    |
| Skeleton     | `packages/platform-ui/src/components/Skeleton.tsx`     | Loading placeholder | aria-busy               | ✅    |
| StatCard     | `packages/platform-ui/src/components/StatCard.tsx`     | Metric display      | Semantic value          | ✅    |
| StatusBadge  | `packages/platform-ui/src/components/StatusBadge.tsx`  | Status indicator    | Color + text            | ✅    |
| Tabs         | `packages/platform-ui/src/components/Tabs.tsx`         | Tab navigation      | Keyboard, ARIA          | ✅    |
| Toast        | `packages/platform-ui/src/components/Toast.tsx`        | Notification        | Auto-dismiss, aria-live | ✅    |

### Primitives (3)

| Primitive  | Location                                         | Purpose       | Usage                      |
| ---------- | ------------------------------------------------ | ------------- | -------------------------- |
| button.tsx | `packages/platform-ui/src/primitives/button.tsx` | Base button   | Foundation for Button      |
| input.tsx  | `packages/platform-ui/src/primitives/input.tsx`  | Base input    | Foundation for form inputs |
| index.ts   | `packages/platform-ui/src/primitives/index.ts`   | Barrel export | Primitives API             |

### Motion Components (2)

| Component  | Location                                     | Purpose                 | Usage               |
| ---------- | -------------------------------------------- | ----------------------- | ------------------- |
| reveal.tsx | `packages/platform-ui/src/motion/reveal.tsx` | Scroll-triggered reveal | Section entrances   |
| index.ts   | `packages/platform-ui/src/motion/index.ts`   | Motion exports + CSS    | Animation utilities |

---

## Tokens

### Brand Colors (11)

| Token                | Hex       | Usage            |
| -------------------- | --------- | ---------------- |
| `--color-forest-50`  | `#f0f7f2` | Lightest tint    |
| `--color-forest-100` | `#d4e8d9` | Light tint       |
| `--color-forest-200` | `#a8d1b3` | Soft green       |
| `--color-forest-300` | `#7cba8d` | Medium green     |
| `--color-forest-400` | `#51a367` | Vibrant green    |
| `--color-forest-500` | `#2d8a45` | Strong green     |
| `--color-forest-600` | `#1a6b30` | Deep green       |
| `--color-forest-700` | `#0E382E` | **Brand forest** |
| `--color-forest-800` | `#0a2a21` | Darker forest    |
| `--color-forest-900` | `#071c16` | Very dark        |
| `--color-forest-950` | `#040f0b` | Near black       |

### Ivory Scale (3)

| Token               | Hex       | Usage                  |
| ------------------- | --------- | ---------------------- |
| `--color-ivory-50`  | `#F7F4EC` | **Primary background** |
| `--color-ivory-100` | `#EDE8DB` | Secondary background   |
| `--color-ivory-200` | `#E0D9C8` | Tertiary background    |

### Gold Scale (3)

| Token              | Hex       | Usage             |
| ------------------ | --------- | ----------------- |
| `--color-gold-300` | `#E8C84A` | Light gold        |
| `--color-gold-400` | `#D4AF37` | **Heritage gold** |
| `--color-gold-500` | `#C4A032` | Dark gold         |

### Supporting Colors (5)

| Token                | Hex       | Usage                               |
| -------------------- | --------- | ----------------------------------- |
| `--color-sage`       | `#8A9A8B` | Subtle elements, secondary text     |
| `--color-earth`      | `#6A7C52` | Nature elements, supporting accents |
| `--color-stone`      | `#E6E0D3` | Secondary backgrounds, cards        |
| `--color-charcoal`   | `#1F1F1F` | Dark text                           |
| `--color-soft-black` | `#2A2A2A` | Body text                           |

### Surface System (4)

| Token                 | Usage                |
| --------------------- | -------------------- |
| `--surface-primary`   | Main content area    |
| `--surface-secondary` | Sidebar, cards       |
| `--surface-tertiary`  | Modals, overlays     |
| `--surface-glass`     | Glassmorphism effect |

### Text Colors (4)

| Token              | Usage          |
| ------------------ | -------------- |
| `--text-primary`   | Primary text   |
| `--text-secondary` | Secondary text |
| `--text-tertiary`  | Tertiary text  |
| `--text-muted`     | Muted text     |

### Border Colors (3)

| Token              | Usage            |
| ------------------ | ---------------- |
| `--border-primary` | Default borders  |
| `--border-focus`   | Focus rings      |
| `--border-gold`    | Emphasis borders |

### Typography (3)

| Token            | Value            | Usage                   |
| ---------------- | ---------------- | ----------------------- |
| `--font-display` | Playfair Display | Headings, hero text     |
| `--font-body`    | Inter            | Body text, UI elements  |
| `--font-mono`    | Monospace        | Code, technical content |

### Type Scale (9)

| Token         | Size     | Usage                |
| ------------- | -------- | -------------------- |
| `--text-xs`   | 0.75rem  | Captions, labels     |
| `--text-sm`   | 0.875rem | Small text, metadata |
| `--text-base` | 1rem     | Body text            |
| `--text-lg`   | 1.125rem | Large body text      |
| `--text-xl`   | 1.25rem  | Subheadings          |
| `--text-2xl`  | 1.5rem   | Section headings     |
| `--text-3xl`  | 1.875rem | Page headings        |
| `--text-4xl`  | 2.25rem  | Hero headings        |
| `--text-5xl`  | 3rem     | Display headings     |

### Font Weights (5)

| Token             | Value | Usage           |
| ----------------- | ----- | --------------- |
| `--font-light`    | 300   | Light text      |
| `--font-normal`   | 400   | Body text       |
| `--font-medium`   | 500   | Emphasized text |
| `--font-semibold` | 600   | Strong emphasis |
| `--font-bold`     | 700   | Headings        |

### Spacing Scale (12)

| Token        | Value   | Usage                 |
| ------------ | ------- | --------------------- |
| `--space-1`  | 0.25rem | Tight gaps            |
| `--space-2`  | 0.5rem  | Small gaps            |
| `--space-3`  | 0.75rem | Medium gaps           |
| `--space-4`  | 1rem    | Standard gaps         |
| `--space-5`  | 1.25rem | Large gaps            |
| `--space-6`  | 1.5rem  | Section gaps          |
| `--space-8`  | 2rem    | Page gaps             |
| `--space-10` | 2.5rem  | Large page gaps       |
| `--space-12` | 3rem    | Hero gaps             |
| `--space-16` | 4rem    | Section margins       |
| `--space-20` | 5rem    | Large section margins |
| `--space-24` | 6rem    | Hero padding          |

### Shadow System (4)

| Token         | Value                          | Usage             |
| ------------- | ------------------------------ | ----------------- |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)`   | Subtle lift       |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)`    | Cards, buttons    |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)`  | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images       |

### Border Radius (5)

| Token           | Value    | Usage                |
| --------------- | -------- | -------------------- |
| `--radius-sm`   | 0.25rem  | Small elements       |
| `--radius-md`   | 0.375rem | Medium elements      |
| `--radius-lg`   | 0.5rem   | Large elements       |
| `--radius-xl`   | 0.75rem  | Extra large elements |
| `--radius-full` | 9999px   | Circular elements    |

### Motion Tokens (7)

| Token               | Value                             | Usage                           |
| ------------------- | --------------------------------- | ------------------------------- |
| `--duration-fast`   | 150ms                             | Micro-interactions, hover       |
| `--duration-normal` | 250ms                             | Standard transitions            |
| `--duration-slow`   | 400ms                             | Page transitions, reveals       |
| `--duration-slower` | 600ms                             | Hero animations, cinematic      |
| `--ease-out`        | cubic-bezier(0.16, 1, 0.3, 1)     | Elements entering viewport      |
| `--ease-in-out`     | cubic-bezier(0.45, 0, 0.55, 1)    | Elements moving within viewport |
| `--ease-spring`     | cubic-bezier(0.34, 1.56, 0.64, 1) | Interactive feedback            |

### Breakpoints (5)

| Token              | Value  | Usage         |
| ------------------ | ------ | ------------- |
| `--breakpoint-sm`  | 640px  | Small tablets |
| `--breakpoint-md`  | 768px  | Tablets       |
| `--breakpoint-lg`  | 1024px | Small laptops |
| `--breakpoint-xl`  | 1280px | Laptops       |
| `--breakpoint-2xl` | 1536px | Desktops      |

### Z-Index Scale (9)

| Token                | Value | Usage              |
| -------------------- | ----- | ------------------ |
| `--z-base`           | 0     | Default layer      |
| `--z-dropdown`       | 1000  | Dropdowns, selects |
| `--z-sticky`         | 1020  | Sticky elements    |
| `--z-fixed`          | 1030  | Fixed elements     |
| `--z-modal-backdrop` | 1040  | Modal backdrops    |
| `--z-modal`          | 1050  | Modals             |
| `--z-popover`        | 1060  | Popovers           |
| `--z-tooltip`        | 1070  | Tooltips           |
| `--z-toast`          | 1080  | Toasts             |

---

## Total Token Count

| Category       | Count  |
| -------------- | ------ |
| Brand Colors   | 22     |
| Surface System | 4      |
| Text Colors    | 4      |
| Border Colors  | 3      |
| Typography     | 3      |
| Type Scale     | 9      |
| Font Weights   | 5      |
| Spacing Scale  | 12     |
| Shadow System  | 4      |
| Border Radius  | 5      |
| Motion Tokens  | 7      |
| Breakpoints    | 5      |
| Z-Index Scale  | 9      |
| **Total**      | **92** |

---

## Documentation

| Document             | Location                                           | Status | Lines |
| -------------------- | -------------------------------------------------- | ------ | ----- |
| Web experience       | `docs/design-system/BHAVYA_WEB_EXPERIENCE.md`      | ACTIVE | 493   |
| Design system        | `docs/design-system/CANONICAL_DESIGN_SYSTEM.md`    | ACTIVE | —     |
| Design principles    | `docs/design-system/DESIGN_PRINCIPLES.md`          | ACTIVE | —     |
| Component catalog    | `docs/design-system/COMPONENT_CATALOG.md`          | ACTIVE | —     |
| Design system board  | `docs/design-system/BHAVYA_DESIGN_SYSTEM_BOARD.md` | ACTIVE | —     |
| Motion system        | `docs/design-system/BHVYA_MOTION_SYSTEM.md`        | ACTIVE | 283   |
| AI review            | `docs/design-system/AI_REVIEW.md`                  | ACTIVE | 117   |
| Feature admission    | `docs/design-system/FEATURE_ADMISSION.md`          | ACTIVE | 137   |
| Quarterly review     | `docs/design-system/QUARTERLY_REVIEW.md`           | ACTIVE | 151   |
| Token reference      | `design/tokens/TOKEN-REFERENCE.md`                 | ACTIVE | —     |
| Motion specification | `design/motion/MOTION-SPECIFICATION.md`            | ACTIVE | —     |

---

## Verification

This inventory is verified by:

- `pnpm file-map:check` — structural integrity
- `pnpm typecheck` — no type errors
- `pnpm test` — all tests pass
- Git status clean — no uncommitted changes
