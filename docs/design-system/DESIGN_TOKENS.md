# Design Tokens

Unified token system in `packages/platform-ui/src/styles/tokens.css`.

> **Authority (2026-09-23):** Implementation source of truth is `tokens.css`.
> Color tables in this file may lag shipped tokens; **palette alignment among
> constitution 01, constitution 05, and `tokens.css` is an open human decision**
> — do not rewrite either constitution or tokens from this doc to “fix” it.
> Prefer reading `tokens.css` for current values. Gate: `pnpm tokens:check`.

## Usage

### Tailwind Classes

```tsx
<div className="bg-bg-primary text-text-primary border-border-primary">
```

### CSS Variables

```css
.element {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}
```

## Colors

### Backgrounds

| Token          | Value             | Usage                    |
| -------------- | ----------------- | ------------------------ |
| `bg-primary`   | `#0a0a0a`         | Page background          |
| `bg-secondary` | `#111111`         | Card, sidebar background |
| `bg-tertiary`  | `#1a1a1a`         | Input, hover background  |
| `bg-elevated`  | `#18181b`         | Elevated surfaces        |
| `bg-hover`     | `#27272a`         | Hover state              |
| `bg-active`    | `#3f3f46`         | Active state             |
| `bg-overlay`   | `rgba(0,0,0,0.5)` | Modal overlay            |

### Text

| Token            | Value     | Usage            |
| ---------------- | --------- | ---------------- |
| `text-primary`   | `#fafafa` | Primary text     |
| `text-secondary` | `#a1a1aa` | Secondary text   |
| `text-tertiary`  | `#71717a` | Muted text       |
| `text-muted`     | `#52525b` | Very muted text  |
| `text-inverse`   | `#0a0a0a` | Text on light bg |

### Borders

| Token              | Value     | Usage             |
| ------------------ | --------- | ----------------- |
| `border-primary`   | `#27272a` | Default border    |
| `border-secondary` | `#3f3f46` | Emphasized border |
| `border-focus`     | `#3b82f6` | Focus ring        |

### Accents

| Token           | Value     | Usage                 |
| --------------- | --------- | --------------------- |
| `accent-blue`   | `#3b82f6` | Primary action, links |
| `accent-green`  | `#22c55e` | Success, health       |
| `accent-yellow` | `#eab308` | Warning, learning     |
| `accent-red`    | `#ef4444` | Error, danger         |
| `accent-purple` | `#a855f7` | Special, exemplary    |
| `accent-orange` | `#f97316` | Caution               |
| `accent-cyan`   | `#06b6d4` | Info, technology      |

### Status

| Token            | Value     | Usage         |
| ---------------- | --------- | ------------- |
| `status-success` | `#22c55e` | Success state |
| `status-warning` | `#eab308` | Warning state |
| `status-error`   | `#ef4444` | Error state   |
| `status-info`    | `#3b82f6` | Info state    |

### Scores

| Token             | Value     | Usage       |
| ----------------- | --------- | ----------- |
| `score-excellent` | `#22c55e` | 90+ score   |
| `score-good`      | `#3b82f6` | 80-89 score |
| `score-fair`      | `#eab308` | 70-79 score |
| `score-poor`      | `#ef4444` | <70 score   |

## Typography

### Font Families

| Token       | Value                     |
| ----------- | ------------------------- |
| `font-sans` | Inter, system fonts       |
| `font-mono` | JetBrains Mono, monospace |

### Font Sizes

| Token       | Value           | Tailwind    |
| ----------- | --------------- | ----------- |
| `text-xs`   | 0.75rem (12px)  | `text-xs`   |
| `text-sm`   | 0.875rem (14px) | `text-sm`   |
| `text-base` | 1rem (16px)     | `text-base` |
| `text-lg`   | 1.125rem (18px) | `text-lg`   |
| `text-xl`   | 1.25rem (20px)  | `text-xl`   |
| `text-2xl`  | 1.5rem (24px)   | `text-2xl`  |
| `text-3xl`  | 1.875rem (30px) | `text-3xl`  |

## Spacing

| Token      | Value          | Tailwind         |
| ---------- | -------------- | ---------------- |
| `space-0`  | 0              | `p-0`, `m-0`     |
| `space-1`  | 0.25rem (4px)  | `p-1`, `gap-1`   |
| `space-2`  | 0.5rem (8px)   | `p-2`, `gap-2`   |
| `space-3`  | 0.75rem (12px) | `p-3`, `gap-3`   |
| `space-4`  | 1rem (16px)    | `p-4`, `gap-4`   |
| `space-5`  | 1.25rem (20px) | `p-5`, `gap-5`   |
| `space-6`  | 1.5rem (24px)  | `p-6`, `gap-6`   |
| `space-8`  | 2rem (32px)    | `p-8`, `gap-8`   |
| `space-10` | 2.5rem (40px)  | `p-10`, `gap-10` |
| `space-12` | 3rem (48px)    | `p-12`, `gap-12` |

## Border Radius

| Token         | Value          | Tailwind       |
| ------------- | -------------- | -------------- |
| `radius-sm`   | 0.375rem (6px) | `rounded-sm`   |
| `radius-md`   | 0.5rem (8px)   | `rounded-md`   |
| `radius-lg`   | 0.75rem (12px) | `rounded-lg`   |
| `radius-xl`   | 1rem (16px)    | `rounded-xl`   |
| `radius-full` | 9999px         | `rounded-full` |

## Shadows

| Token       | Usage            |
| ----------- | ---------------- |
| `shadow-sm` | Subtle elevation |
| `shadow-md` | Cards, dropdowns |
| `shadow-lg` | Modals           |
| `shadow-xl` | Popovers         |

## Transitions

| Token               | Value      | Tailwind          |
| ------------------- | ---------- | ----------------- |
| `transition-fast`   | 150ms ease | `duration-fast`   |
| `transition-normal` | 200ms ease | `duration-normal` |
| `transition-slow`   | 300ms ease | `duration-slow`   |

## Z-Index

| Token        | Value | Usage               |
| ------------ | ----- | ------------------- |
| `z-dropdown` | 50    | Dropdowns, popovers |
| `z-modal`    | 100   | Modals, dialogs     |
| `z-toast`    | 150   | Toast notifications |
| `z-tooltip`  | 200   | Tooltips            |

## Animations

| Class              | Animation                |
| ------------------ | ------------------------ |
| `animate-shimmer`  | Skeleton loading shimmer |
| `animate-fade-in`  | Fade in + slide up 4px   |
| `animate-slide-in` | Slide in from left       |
| `animate-pulse`    | Pulse opacity            |

All animations respect `prefers-reduced-motion: reduce`.
