# Bhavya Design Manifest

**Status:** ACTIVE
**Version:** 1.0.0
**Created:** 2026-09-07
**Owner:** Bhavya Foundation Design

---

## Purpose

This manifest provides a complete inventory of all design artifacts in Bhavya Foundation. It maps where everything lives, what is canonical, and what is obsolete.

---

## Design Artifact Map

### Canonical Implementation (packages/platform-ui/)

| Artifact         | Location                                               | Status | Lines |
| ---------------- | ------------------------------------------------------ | ------ | ----- |
| Design tokens    | `packages/platform-ui/src/styles/tokens.css`           | ACTIVE | 610   |
| Barrel export    | `packages/platform-ui/src/index.ts`                    | ACTIVE | —     |
| AppFooter        | `packages/platform-ui/src/components/AppFooter.tsx`    | ACTIVE | —     |
| AppLayout        | `packages/platform-ui/src/components/AppLayout.tsx`    | ACTIVE | —     |
| AppSidebar       | `packages/platform-ui/src/components/AppSidebar.tsx`   | ACTIVE | —     |
| Avatar           | `packages/platform-ui/src/components/Avatar.tsx`       | ACTIVE | —     |
| Badge            | `packages/platform-ui/src/components/Badge.tsx`        | ACTIVE | —     |
| BhavyaNav        | `packages/platform-ui/src/components/BhavyaNav.tsx`    | ACTIVE | —     |
| Breadcrumb       | `packages/platform-ui/src/components/Breadcrumb.tsx`   | ACTIVE | —     |
| Button           | `packages/platform-ui/src/components/Button.tsx`       | ACTIVE | —     |
| Card             | `packages/platform-ui/src/components/Card.tsx`         | ACTIVE | —     |
| DataTable        | `packages/platform-ui/src/components/DataTable.tsx`    | ACTIVE | —     |
| EmptyState       | `packages/platform-ui/src/components/EmptyState.tsx`   | ACTIVE | —     |
| ErrorState       | `packages/platform-ui/src/components/ErrorState.tsx`   | ACTIVE | —     |
| LoadingState     | `packages/platform-ui/src/components/LoadingState.tsx` | ACTIVE | —     |
| Modal            | `packages/platform-ui/src/components/Modal.tsx`        | ACTIVE | —     |
| PageLayout       | `packages/platform-ui/src/components/PageLayout.tsx`   | ACTIVE | —     |
| SearchBar        | `packages/platform-ui/src/components/SearchBar.tsx`    | ACTIVE | —     |
| Sidebar          | `packages/platform-ui/src/components/Sidebar.tsx`      | ACTIVE | —     |
| Skeleton         | `packages/platform-ui/src/components/Skeleton.tsx`     | ACTIVE | —     |
| StatCard         | `packages/platform-ui/src/components/StatCard.tsx`     | ACTIVE | —     |
| StatusBadge      | `packages/platform-ui/src/components/StatusBadge.tsx`  | ACTIVE | —     |
| Tabs             | `packages/platform-ui/src/components/Tabs.tsx`         | ACTIVE | —     |
| Toast            | `packages/platform-ui/src/components/Toast.tsx`        | ACTIVE | —     |
| Button primitive | `packages/platform-ui/src/primitives/button.tsx`       | ACTIVE | —     |
| Input primitive  | `packages/platform-ui/src/primitives/input.tsx`        | ACTIVE | —     |
| Primitives index | `packages/platform-ui/src/primitives/index.ts`         | ACTIVE | —     |
| Reveal motion    | `packages/platform-ui/src/motion/reveal.tsx`           | ACTIVE | 69    |
| Motion index     | `packages/platform-ui/src/motion/index.ts`             | ACTIVE | 84    |

### Canonical Documentation (docs/design-system/)

| Artifact             | Location                                           | Status | Lines |
| -------------------- | -------------------------------------------------- | ------ | ----- |
| Web experience       | `docs/design-system/BHAVYA_WEB_EXPERIENCE.md`      | ACTIVE | 493   |
| Design system        | `docs/design-system/CANONICAL_DESIGN_SYSTEM.md`    | ACTIVE | —     |
| Design principles    | `docs/design-system/DESIGN_PRINCIPLES.md`          | ACTIVE | —     |
| Component catalog    | `docs/design-system/COMPONENT_CATALOG.md`          | ACTIVE | —     |
| Design system board  | `docs/design-system/BHAVYA_DESIGN_SYSTEM_BOARD.md` | ACTIVE | —     |
| Motion system        | `docs/design-system/BHVYA_MOTION_SYSTEM.md`        | ACTIVE | 283   |
| Motion system (typo) | `docs/design-system/BHAVYA_MOTION_SYSTEM.md`       | ACTIVE | —     |
| AI review            | `docs/design-system/AI_REVIEW.md`                  | ACTIVE | 117   |
| Feature admission    | `docs/design-system/FEATURE_ADMISSION.md`          | ACTIVE | 137   |
| Quarterly review     | `docs/design-system/QUARTERLY_REVIEW.md`           | ACTIVE | 151   |

### Design ICM (design/)

| Artifact             | Location                                | Status | Lines |
| -------------------- | --------------------------------------- | ------ | ----- |
| Context router       | `design/CONTEXT.md`                     | ACTIVE | —     |
| Design constitution  | `design/DESIGN-CONSTITUTION.md`         | ACTIVE | —     |
| Design manifest      | `design/DESIGN-MANIFEST.md`             | ACTIVE | —     |
| Design principles    | `design/DESIGN-PRINCIPLES.md`           | ACTIVE | —     |
| Token reference      | `design/tokens/TOKEN-REFERENCE.md`      | ACTIVE | —     |
| Motion specification | `design/motion/MOTION-SPECIFICATION.md` | ACTIVE | —     |
| Design inventory     | `design/inventory/DESIGN-INVENTORY.md`  | ACTIVE | —     |

---

## Obsolete Artifacts

These files exist but are NOT canonical. Do NOT use them as reference:

| File                                        | Issue                                                                                                                  | Action   |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | -------- |
| `design-system/bhavya-foundation/MASTER.md` | Auto-generated template with wrong colors (cyan #0891B2, orange #EA580C) and wrong typography (Lexend + Source Sans 3) | OBSOLETE |
| `design-system/bhavya-foundation/pages/`    | Empty directory                                                                                                        | OBSOLETE |
| `docs/design-system/BEE-2.0.md`             | Empty file (0 lines)                                                                                                   | OBSOLETE |
| `docs/design-principles.md`                 | Stub (3 lines)                                                                                                         | REPLACED |
| `docs/design-inventory.md`                  | Stub (3 lines)                                                                                                         | REPLACED |
| `docs/token-reference.md`                   | Stub (3 lines)                                                                                                         | REPLACED |
| `docs/motion-specification.md`              | Stub (3 lines)                                                                                                         | REPLACED |
| `docs/component-matrix.md`                  | Stub (4 lines, empty table)                                                                                            | OBSOLETE |

---

## Token Inventory

### Brand Colors

| Token                | Hex       | Usage         |
| -------------------- | --------- | ------------- |
| `--color-forest-50`  | `#f0f7f2` | Lightest tint |
| `--color-forest-100` | `#d4e8d9` | Light tint    |
| `--color-forest-200` | `#a8d1b3` | Soft green    |
| `--color-forest-300` | `#7cba8d` | Medium green  |
| `--color-forest-400` | `#51a367` | Vibrant green |
| `--color-forest-500` | `#2d8a45` | Strong green  |
| `--color-forest-600` | `#1a6b30` | Deep green    |
| `--color-forest-700` | `#0E382E` | Brand forest  |
| `--color-forest-800` | `#0a2a21` | Darker forest |
| `--color-forest-900` | `#071c16` | Very dark     |
| `--color-forest-950` | `#040f0b` | Near black    |

### Ivory Scale

| Token               | Hex       | Usage                |
| ------------------- | --------- | -------------------- |
| `--color-ivory-50`  | `#F7F4EC` | Primary background   |
| `--color-ivory-100` | `#EDE8DB` | Secondary background |
| `--color-ivory-200` | `#E0D9C8` | Tertiary background  |

### Gold Scale

| Token              | Hex       | Usage         |
| ------------------ | --------- | ------------- |
| `--color-gold-300` | `#E8C84A` | Light gold    |
| `--color-gold-400` | `#D4AF37` | Heritage gold |
| `--color-gold-500` | `#C4A032` | Dark gold     |

### Surface System

| Token                 | Usage                |
| --------------------- | -------------------- |
| `--surface-primary`   | Main content area    |
| `--surface-secondary` | Sidebar, cards       |
| `--surface-tertiary`  | Modals, overlays     |
| `--surface-glass`     | Glassmorphism effect |

### Typography Tokens

| Token            | Value            | Usage                   |
| ---------------- | ---------------- | ----------------------- |
| `--font-display` | Playfair Display | Headings, hero text     |
| `--font-body`    | Inter            | Body text, UI elements  |
| `--font-mono`    | Monospace        | Code, technical content |

### Type Scale

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

### Spacing Scale

| Token        | Value   | Usage           |
| ------------ | ------- | --------------- |
| `--space-1`  | 0.25rem | Tight gaps      |
| `--space-2`  | 0.5rem  | Small gaps      |
| `--space-3`  | 0.75rem | Medium gaps     |
| `--space-4`  | 1rem    | Standard gaps   |
| `--space-5`  | 1.25rem | Large gaps      |
| `--space-6`  | 1.5rem  | Section gaps    |
| `--space-8`  | 2rem    | Page gaps       |
| `--space-10` | 2.5rem  | Large page gaps |
| `--space-12` | 3rem    | Hero gaps       |

### Shadow System

| Token         | Value                          | Usage             |
| ------------- | ------------------------------ | ----------------- |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)`   | Subtle lift       |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)`    | Cards, buttons    |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)`  | Modals, dropdowns |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images       |

### Motion Tokens

| Token               | Value                             | Usage                           |
| ------------------- | --------------------------------- | ------------------------------- |
| `--duration-fast`   | 150ms                             | Micro-interactions, hover       |
| `--duration-normal` | 250ms                             | Standard transitions            |
| `--duration-slow`   | 400ms                             | Page transitions, reveals       |
| `--duration-slower` | 600ms                             | Hero animations, cinematic      |
| `--ease-out`        | cubic-bezier(0.16, 1, 0.3, 1)     | Elements entering viewport      |
| `--ease-in-out`     | cubic-bezier(0.45, 0, 0.55, 1)    | Elements moving within viewport |
| `--ease-spring`     | cubic-bezier(0.34, 1.56, 0.64, 1) | Interactive feedback            |

---

## Component Inventory

### Production Components (22)

| Component    | Purpose             | Accessibility           |
| ------------ | ------------------- | ----------------------- |
| AppFooter    | Site footer         | Landmark, links         |
| AppLayout    | Main layout wrapper | Responsive, semantic    |
| AppSidebar   | Side navigation     | Collapsible, keyboard   |
| Avatar       | User avatar         | Image alt, fallback     |
| Badge        | Status indicator    | Color + text            |
| BhavyaNav    | Main navigation     | Keyboard, ARIA          |
| Breadcrumb   | Page hierarchy      | Navigation landmark     |
| Button       | Interactive element | Focus, disabled state   |
| Card         | Content container   | Semantic grouping       |
| DataTable    | Data display        | Sortable, accessible    |
| EmptyState   | No data state       | Illustration + action   |
| ErrorState   | Error state         | Clear messaging         |
| LoadingState | Loading state       | Progress indication     |
| Modal        | Dialog overlay      | Focus trap, escape      |
| PageLayout   | Page wrapper        | Responsive, semantic    |
| SearchBar    | Search input        | Labels, clear button    |
| Sidebar      | Side panel          | Collapsible, keyboard   |
| Skeleton     | Loading placeholder | aria-busy               |
| StatCard     | Metric display      | Semantic value          |
| StatusBadge  | Status indicator    | Color + text            |
| Tabs         | Tab navigation      | Keyboard, ARIA          |
| Toast        | Notification        | Auto-dismiss, aria-live |

### Primitives (3)

| Primitive  | Purpose       | Usage                      |
| ---------- | ------------- | -------------------------- |
| button.tsx | Base button   | Foundation for Button      |
| input.tsx  | Base input    | Foundation for form inputs |
| index.ts   | Barrel export | Primitives API             |

### Motion Components (2)

| Component  | Purpose                 | Usage               |
| ---------- | ----------------------- | ------------------- |
| reveal.tsx | Scroll-triggered reveal | Section entrances   |
| index.ts   | Motion exports + CSS    | Animation utilities |

---

## Verification

This manifest is verified by:

- `pnpm file-map:check` — structural integrity
- `pnpm typecheck` — no type errors
- `pnpm test` — all tests pass
- Git status clean — no uncommitted changes
