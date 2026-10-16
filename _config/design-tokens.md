# Design Tokens Reference — Bhavya Foundation

**Canonical pointer to token definitions.**
Actual tokens live in `packages/platform-ui/src/styles/tokens.css`.
This file maps token names to their purpose for stage Inputs tables.

---

## Color Tokens (from tokens.css)

### Primitive Colors

| Token                                            | Description        | Stage Usage                     |
| ------------------------------------------------ | ------------------ | ------------------------------- |
| `--color-forest-50` through `--color-forest-900` | Forest green scale | Brand identity, primary actions |
| `--color-ivory-50` through `--color-ivory-900`   | Ivory/cream scale  | Backgrounds, surfaces           |
| `--color-gold-50` through `--color-gold-900`     | Gold accent scale  | CTAs, highlights                |
| `--color-earth-50` through `--color-earth-900`   | Earth/brown scale  | Secondary text, borders         |
| `--color-error-50` through `--color-error-900`   | Error red scale    | Error states                    |

### Semantic Colors

| Token                    | Primitive Ref        | Usage                  |
| ------------------------ | -------------------- | ---------------------- |
| `--color-primary`        | `--color-forest-600` | Primary buttons, links |
| `--color-primary-hover`  | `--color-forest-700` | Hover states           |
| `--color-background`     | `--color-ivory-100`  | Page background        |
| `--color-surface`        | `--color-ivory-50`   | Card backgrounds       |
| `--color-text-primary`   | `--color-forest-900` | Body text              |
| `--color-text-secondary` | `--color-earth-600`  | Secondary text         |
| `--color-border`         | `--color-earth-200`  | Borders, dividers      |
| `--color-accent`         | `--color-gold-500`   | Accent elements        |
| `--color-focus`          | `--color-gold-400`   | Focus rings            |

---

## Spacing Tokens

| Token        | Value          | Usage              |
| ------------ | -------------- | ------------------ |
| `--space-1`  | 0.25rem (4px)  | Micro spacing      |
| `--space-2`  | 0.5rem (8px)   | Tight spacing      |
| `--space-3`  | 0.75rem (12px) | Standard gap       |
| `--space-4`  | 1rem (16px)    | Base unit          |
| `--space-5`  | 1.25rem (20px) | Medium spacing     |
| `--space-6`  | 1.5rem (24px)  | Section spacing    |
| `--space-8`  | 2rem (32px)    | Large spacing      |
| `--space-10` | 2.5rem (40px)  | XL spacing         |
| `--space-12` | 3rem (48px)    | Section separation |
| `--space-16` | 4rem (64px)    | Page margins       |

---

## Typography Tokens

### Font Families

| Token            | Value                       |
| ---------------- | --------------------------- |
| `--font-display` | "Playfair Display", serif   |
| `--font-sans`    | "Inter", sans-serif         |
| `--font-mono`    | "JetBrains Mono", monospace |

### Font Sizes

| Token         | Value           | Usage            |
| ------------- | --------------- | ---------------- |
| `--text-xs`   | 0.75rem (12px)  | Captions, labels |
| `--text-sm`   | 0.875rem (14px) | Small body       |
| `--text-base` | 1rem (16px)     | Body text        |
| `--text-lg`   | 1.125rem (18px) | Large body       |
| `--text-xl`   | 1.25rem (20px)  | Subheadings      |
| `--text-2xl`  | 1.5rem (24px)   | Headings         |
| `--text-3xl`  | 1.875rem (30px) | Major headings   |
| `--text-4xl`  | 2.25rem (36px)  | Hero text        |
| `--text-5xl`  | 3rem (48px)     | Display          |

### Font Weights

| Token             | Value |
| ----------------- | ----- |
| `--font-light`    | 300   |
| `--font-normal`   | 400   |
| `--font-medium`   | 500   |
| `--font-semibold` | 600   |
| `--font-bold`     | 700   |

### Line Heights

| Token               | Value |
| ------------------- | ----- |
| `--leading-tight`   | 1.1   |
| `--leading-normal`  | 1.5   |
| `--leading-relaxed` | 1.75  |

---

## Border Radius

| Token           | Value          |
| --------------- | -------------- |
| `--radius-sm`   | 0.25rem (4px)  |
| `--radius-md`   | 0.375rem (6px) |
| `--radius-lg`   | 0.5rem (8px)   |
| `--radius-xl`   | 0.75rem (12px) |
| `--radius-full` | 9999px         |

---

## Shadows

| Token         | Value                             |
| ------------- | --------------------------------- |
| `--shadow-sm` | 0 1px 2px 0 rgb(0 0 0 / 0.05)     |
| `--shadow-md` | 0 4px 6px -1px rgb(0 0 0 / 0.1)   |
| `--shadow-lg` | 0 10px 15px -3px rgb(0 0 0 / 0.1) |
| `--shadow-xl` | 0 20px 25px -5px rgb(0 0 0 / 0.1) |

---

## Transitions

| Token                 | Value      |
| --------------------- | ---------- |
| `--transition-fast`   | 150ms ease |
| `--transition-normal` | 250ms ease |
| `--transition-slow`   | 350ms ease |

---

## Breakpoints

| Token      | Value  |
| ---------- | ------ |
| `--bp-sm`  | 640px  |
| `--bp-md`  | 768px  |
| `--bp-lg`  | 1024px |
| `--bp-xl`  | 1280px |
| `--bp-2xl` | 1536px |

---

## Z-Index

| Token          | Value |
| -------------- | ----- |
| `--z-dropdown` | 100   |
| `--z-sticky`   | 200   |
| `--z-modal`    | 300   |
| `--z-popover`  | 400   |
| `--z-tooltip`  | 500   |

---

## Usage in Stages

**Stage Inputs table example:**

```
| File | Section to Load | Why |
|------|----------------|-----|
| ../../_config/design-tokens.md | "Color Tokens" through "Semantic Colors" | Component styling |
| ../../_config/design-tokens.md | "Spacing Tokens" | Layout decisions |
```

**Never hardcode values.** Always use `var(--token-name)` in CSS or reference the token name in code.

---

## Source

- **Canonical**: `packages/platform-ui/src/styles/tokens.css` (359 lines, self-declares "Canonical Source of Truth")
- **Components**: `packages/platform-ui/src/components/` (22+ React components using tokens)
- **Constitution**: `docs/constitution/05-DESIGN-SYSTEM.md` (token architecture, spacing, motion, a11y)
