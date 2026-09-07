# Bhavya Token Reference

**Status:** ACTIVE
**Version:** 1.0.0
**Created:** 2026-09-07
**Owner:** Bhavya Foundation Design

---

## Purpose

This is the canonical reference for all design tokens in Bhavya Foundation. Every visual decision must use these tokens. No hardcoded values.

---

## Token Source of Truth

**Canonical location:** `packages/platform-ui/src/styles/tokens.css`

This file is the single source of truth for all design tokens. Other files may reference these tokens, but this is the canonical definition.

---

## Brand Colors

### Forest Scale

| Token                | Hex       | RGB           | Usage            |
| -------------------- | --------- | ------------- | ---------------- |
| `--color-forest-50`  | `#f0f7f2` | 240, 247, 242 | Lightest tint    |
| `--color-forest-100` | `#d4e8d9` | 212, 232, 217 | Light tint       |
| `--color-forest-200` | `#a8d1b3` | 168, 209, 179 | Soft green       |
| `--color-forest-300` | `#7cba8d` | 124, 186, 141 | Medium green     |
| `--color-forest-400` | `#51a367` | 81, 163, 103  | Vibrant green    |
| `--color-forest-500` | `#2d8a45` | 45, 138, 69   | Strong green     |
| `--color-forest-600` | `#1a6b30` | 26, 107, 48   | Deep green       |
| `--color-forest-700` | `#0E382E` | 14, 56, 46    | **Brand forest** |
| `--color-forest-800` | `#0a2a21` | 10, 42, 33    | Darker forest    |
| `--color-forest-900` | `#071c16` | 7, 28, 22     | Very dark        |
| `--color-forest-950` | `#040f0b` | 4, 15, 11     | Near black       |

### Ivory Scale

| Token               | Hex       | RGB           | Usage                  |
| ------------------- | --------- | ------------- | ---------------------- |
| `--color-ivory-50`  | `#F7F4EC` | 247, 244, 236 | **Primary background** |
| `--color-ivory-100` | `#EDE8DB` | 237, 232, 219 | Secondary background   |
| `--color-ivory-200` | `#E0D9C8` | 224, 217, 200 | Tertiary background    |

### Gold Scale

| Token              | Hex       | RGB          | Usage             |
| ------------------ | --------- | ------------ | ----------------- |
| `--color-gold-300` | `#E8C84A` | 232, 200, 74 | Light gold        |
| `--color-gold-400` | `#D4AF37` | 212, 175, 55 | **Heritage gold** |
| `--color-gold-500` | `#C4A032` | 196, 160, 50 | Dark gold         |

### Supporting Colors

| Token                | Hex       | RGB           | Usage                               |
| -------------------- | --------- | ------------- | ----------------------------------- |
| `--color-sage`       | `#8A9A8B` | 138, 154, 139 | Subtle elements, secondary text     |
| `--color-earth`      | `#6A7C52` | 106, 124, 82  | Nature elements, supporting accents |
| `--color-stone`      | `#E6E0D3` | 230, 224, 211 | Secondary backgrounds, cards        |
| `--color-charcoal`   | `#1F1F1F` | 31, 31, 31    | Dark text                           |
| `--color-soft-black` | `#2A2A2A` | 42, 42, 42    | Body text                           |

---

## Surface System

| Token                 | Light Mode              | Dark Mode            | Usage                |
| --------------------- | ----------------------- | -------------------- | -------------------- |
| `--surface-primary`   | `--color-ivory-50`      | `--color-forest-950` | Main content area    |
| `--surface-secondary` | `--color-ivory-100`     | `--color-forest-900` | Sidebar, cards       |
| `--surface-tertiary`  | `--color-ivory-200`     | `--color-forest-800` | Modals, overlays     |
| `--surface-glass`     | `rgba(255,255,255,0.7)` | `rgba(14,56,46,0.7)` | Glassmorphism effect |

---

## Text Colors

| Token              | Light Mode         | Dark Mode            | Usage          |
| ------------------ | ------------------ | -------------------- | -------------- |
| `--text-primary`   | `--color-charcoal` | `--color-ivory-50`   | Primary text   |
| `--text-secondary` | `--color-sage`     | `--color-forest-300` | Secondary text |
| `--text-tertiary`  | `--color-stone`    | `--color-forest-400` | Tertiary text  |
| `--text-muted`     | `--color-stone`    | `--color-forest-500` | Muted text     |

---

## Border Colors

| Token              | Light Mode           | Dark Mode            | Usage            |
| ------------------ | -------------------- | -------------------- | ---------------- |
| `--border-primary` | `--color-stone`      | `--color-forest-700` | Default borders  |
| `--border-focus`   | `--color-forest-500` | `--color-gold-400`   | Focus rings      |
| `--border-gold`    | `--color-gold-400`   | `--color-gold-400`   | Emphasis borders |

---

## Typography

### Font Families

| Token            | Value                         | Usage                   |
| ---------------- | ----------------------------- | ----------------------- |
| `--font-display` | `'Playfair Display', serif`   | Headings, hero text     |
| `--font-body`    | `'Inter', sans-serif`         | Body text, UI elements  |
| `--font-mono`    | `'JetBrains Mono', monospace` | Code, technical content |

### Type Scale

| Token         | Size            | Line Height | Usage                |
| ------------- | --------------- | ----------- | -------------------- |
| `--text-xs`   | 0.75rem (12px)  | 1rem        | Captions, labels     |
| `--text-sm`   | 0.875rem (14px) | 1.25rem     | Small text, metadata |
| `--text-base` | 1rem (16px)     | 1.5rem      | Body text            |
| `--text-lg`   | 1.125rem (18px) | 1.75rem     | Large body text      |
| `--text-xl`   | 1.25rem (20px)  | 1.75rem     | Subheadings          |
| `--text-2xl`  | 1.5rem (24px)   | 2rem        | Section headings     |
| `--text-3xl`  | 1.875rem (30px) | 2.25rem     | Page headings        |
| `--text-4xl`  | 2.25rem (36px)  | 2.5rem      | Hero headings        |
| `--text-5xl`  | 3rem (48px)     | 1           | Display headings     |

### Font Weights

| Token             | Value | Usage           |
| ----------------- | ----- | --------------- |
| `--font-light`    | 300   | Light text      |
| `--font-normal`   | 400   | Body text       |
| `--font-medium`   | 500   | Emphasized text |
| `--font-semibold` | 600   | Strong emphasis |
| `--font-bold`     | 700   | Headings        |

---

## Spacing Scale

| Token        | Value          | Usage                 |
| ------------ | -------------- | --------------------- |
| `--space-1`  | 0.25rem (4px)  | Tight gaps            |
| `--space-2`  | 0.5rem (8px)   | Small gaps            |
| `--space-3`  | 0.75rem (12px) | Medium gaps           |
| `--space-4`  | 1rem (16px)    | Standard gaps         |
| `--space-5`  | 1.25rem (20px) | Large gaps            |
| `--space-6`  | 1.5rem (24px)  | Section gaps          |
| `--space-8`  | 2rem (32px)    | Page gaps             |
| `--space-10` | 2.5rem (40px)  | Large page gaps       |
| `--space-12` | 3rem (48px)    | Hero gaps             |
| `--space-16` | 4rem (64px)    | Section margins       |
| `--space-20` | 5rem (80px)    | Large section margins |
| `--space-24` | 6rem (96px)    | Hero padding          |

---

## Shadow System

| Token         | Value                          | Usage                       |
| ------------- | ------------------------------ | --------------------------- |
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)`   | Subtle lift                 |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)`    | Cards, buttons              |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)`  | Modals, dropdowns           |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.15)` | Hero images, featured cards |

---

## Border Radius

| Token           | Value          | Usage                |
| --------------- | -------------- | -------------------- |
| `--radius-sm`   | 0.25rem (4px)  | Small elements       |
| `--radius-md`   | 0.375rem (6px) | Medium elements      |
| `--radius-lg`   | 0.5rem (8px)   | Large elements       |
| `--radius-xl`   | 0.75rem (12px) | Extra large elements |
| `--radius-full` | 9999px         | Circular elements    |

---

## Motion Tokens

### Durations

| Token               | Value | Usage                      |
| ------------------- | ----- | -------------------------- |
| `--duration-fast`   | 150ms | Micro-interactions, hover  |
| `--duration-normal` | 250ms | Standard transitions       |
| `--duration-slow`   | 400ms | Page transitions, reveals  |
| `--duration-slower` | 600ms | Hero animations, cinematic |

### Easing Curves

| Token           | Value                             | Usage                           |
| --------------- | --------------------------------- | ------------------------------- |
| `--ease-out`    | cubic-bezier(0.16, 1, 0.3, 1)     | Elements entering viewport      |
| `--ease-in-out` | cubic-bezier(0.45, 0, 0.55, 1)    | Elements moving within viewport |
| `--ease-spring` | cubic-bezier(0.34, 1.56, 0.64, 1) | Interactive feedback            |

---

## Breakpoints

| Token              | Value  | Usage         |
| ------------------ | ------ | ------------- |
| `--breakpoint-sm`  | 640px  | Small tablets |
| `--breakpoint-md`  | 768px  | Tablets       |
| `--breakpoint-lg`  | 1024px | Small laptops |
| `--breakpoint-xl`  | 1280px | Laptops       |
| `--breakpoint-2xl` | 1536px | Desktops      |

---

## Z-Index Scale

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

## Usage Examples

### Button

```tsx
// ✅ Correct — uses tokens
<button className="bg-[var(--color-forest-700)] text-[var(--color-ivory-50)] px-[var(--space-4)] py-[var(--space-2)] rounded-[var(--radius-md)]">

// ❌ Wrong — hardcoded values
<button className="bg-[#0E382E] text-[#F7F4EC] px-4 py-2 rounded-md">
```

### Card

```tsx
// ✅ Correct — uses tokens
<div className="bg-[var(--surface-primary)] border-[var(--border-primary)] shadow-[var(--shadow-md)] rounded-[var(--radius-lg)]">

// ❌ Wrong — hardcoded values
<div className="bg-white border-gray-200 shadow-md rounded-lg">
```

### Typography

```tsx
// ✅ Correct — uses tokens
<h1 className="font-[var(--font-display)] text-[var(--text-4xl)] font-[var(--font-bold)]">

// ❌ Wrong — hardcoded values
<h1 className="font-serif text-4xl font-bold">
```

---

## Verification

This reference is verified by:

- `pnpm file-map:check` — structural integrity
- `pnpm typecheck` — no type errors
- `pnpm test` — all tests pass
- Git status clean — no uncommitted changes
