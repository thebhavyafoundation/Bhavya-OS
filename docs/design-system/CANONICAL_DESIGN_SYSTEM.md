# CANONICAL DESIGN SYSTEM

**Date:** 2026-08-10
**Status:** ACTIVE
**Owner:** Bhavya Foundation Design
**Last updated:** 2026-08-10
**Applies To:** All Bhavya Foundation UI

---

## Source of Truth

**THE CANONICAL DESIGN TOKENS FILE IS:**

```
packages/platform-ui/src/styles/tokens.css
```

Every Bhavya application MUST import this file. No application creates its own foundational tokens.

---

## Color System

### Primary Palette (from logo)

| Name          | Hex     | Token                  | Usage                                 |
| ------------- | ------- | ---------------------- | ------------------------------------- |
| Forest Green  | #0E382E | `--color-brand-forest` | Primary brand, dark backgrounds, CTAs |
| Warm Ivory    | #F7F4EC | `--color-brand-ivory`  | Primary background, light surfaces    |
| Heritage Gold | #D4AF37 | `--color-brand-gold`   | Accent, highlights, premium elements  |

### Supporting Palette

| Name  | Hex     | Token                 | Usage                               |
| ----- | ------- | --------------------- | ----------------------------------- |
| Sage  | #8A9A8B | `--color-brand-sage`  | Subtle elements, secondary text     |
| Earth | #6A7C52 | `--color-brand-earth` | Nature elements, supporting accents |
| Stone | #E6E0D3 | `--color-ivory-300`   | Secondary backgrounds, cards        |

### Forest Scale

| Step | Hex     | Token                |
| ---- | ------- | -------------------- |
| 50   | #f0f7f2 | `--color-forest-50`  |
| 100  | #d4e8d9 | `--color-forest-100` |
| 200  | #a8d1b3 | `--color-forest-200` |
| 300  | #7cba8d | `--color-forest-300` |
| 400  | #51a367 | `--color-forest-400` |
| 500  | #2d8a45 | `--color-forest-500` |
| 600  | #1a6b30 | `--color-forest-600` |
| 700  | #0E382E | `--color-forest-700` |
| 800  | #0a2a21 | `--color-forest-800` |
| 900  | #071c16 | `--color-forest-900` |
| 950  | #040f0b | `--color-forest-950` |

### Gold Scale

| Step | Hex     | Token              |
| ---- | ------- | ------------------ |
| 50   | #fdf8e8 | `--color-gold-50`  |
| 100  | #f9ecc0 | `--color-gold-100` |
| 200  | #f3d88a | `--color-gold-200` |
| 300  | #e8c04a | `--color-gold-300` |
| 400  | #D4AF37 | `--color-gold-400` |
| 500  | #c09a2a | `--color-gold-500` |
| 600  | #a07d1e | `--color-gold-600` |
| 700  | #806418 | `--color-gold-700` |

---

## Typography

### Font Stack

```css
/* Display — Editorial, serif */
--font-display: "Playfair Display", Georgia, "Times New Roman", serif;

/* Body — Modern sans */
--font-sans:
  "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;

/* Utility — Monospace */
--font-mono: "JetBrains Mono", "SF Mono", "Fira Code", monospace;
```

### Type Scale (Major Third 1.250)

| Token         | Size      | Line Height | Usage                |
| ------------- | --------- | ----------- | -------------------- |
| `--text-xs`   | 0.75rem   | 1.4         | Labels, captions     |
| `--text-sm`   | 0.8125rem | 1.5         | Small text, metadata |
| `--text-base` | 0.9375rem | 1.6         | Body text            |
| `--text-md`   | 1rem      | 1.6         | Default body         |
| `--text-lg`   | 1.125rem  | 1.7         | Large body           |
| `--text-xl`   | 1.25rem   | 1.7         | Lead text            |
| `--text-2xl`  | 1.5rem    | 1.3         | Subheadings          |
| `--text-3xl`  | 1.875rem  | 1.2         | Section headings     |
| `--text-4xl`  | 2.25rem   | 1.15        | Page headings        |
| `--text-5xl`  | 3rem      | 1.1         | Hero headings        |
| `--text-6xl`  | 3.75rem   | 1.05        | Display headings     |
| `--text-7xl`  | 4.5rem    | 1.0         | Large display        |

### Typography Classes

```css
.editorial-heading {
  font-family: var(--font-display);
  font-weight: 400;
  letter-spacing: -0.01em;
  line-height: 1.15;
}

.editorial-label {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-gold);
}

.editorial-lead {
  font-size: var(--text-xl);
  color: var(--color-text-secondary);
  line-height: 1.7;
}
```

---

## Glass System

### Variants

```css
/* Standard glass — cream translucent */
.glass {
  background: var(--color-surface-glass);
  backdrop-filter: blur(12px) saturate(1.2);
  border: 1px solid var(--color-border-primary);
}

/* Heavy glass — more opaque */
.glass-heavy {
  background: var(--color-surface-glass-heavy);
  backdrop-filter: blur(20px) saturate(1.3);
  border: 1px solid var(--color-border-primary);
}

/* Forest glass — dark translucent */
.glass-forest {
  background: var(--color-surface-forest);
  backdrop-filter: blur(16px) saturate(1.2);
  border: 1px solid rgba(247, 244, 236, 0.08);
}

/* Gold glass — gold tinted */
.glass-gold {
  background: rgba(212, 175, 55, 0.05);
  backdrop-filter: blur(12px) saturate(1.2);
  border: 1px solid rgba(212, 175, 55, 0.15);
}
```

### Usage Rules

1. Navigation: `.glass` for sticky nav
2. Cards: `.glass-heavy` for elevated cards
3. Overlays: `.glass-forest` for modal backgrounds
4. Accents: `.glass-gold` for highlighted elements
5. NOT everywhere: Only where depth is needed

---

## Spacing (8pt Grid)

| Token        | Value   | Pixels |
| ------------ | ------- | ------ |
| `--space-0`  | 0       | 0      |
| `--space-1`  | 0.25rem | 4      |
| `--space-2`  | 0.5rem  | 8      |
| `--space-3`  | 0.75rem | 12     |
| `--space-4`  | 1rem    | 16     |
| `--space-5`  | 1.25rem | 20     |
| `--space-6`  | 1.5rem  | 24     |
| `--space-8`  | 2rem    | 32     |
| `--space-10` | 2.5rem  | 40     |
| `--space-12` | 3rem    | 48     |
| `--space-16` | 4rem    | 64     |
| `--space-20` | 5rem    | 80     |
| `--space-24` | 6rem    | 96     |
| `--space-32` | 8rem    | 128    |
| `--space-40` | 10rem   | 160    |

---

## Border Radius

| Token           | Value  | Usage           |
| --------------- | ------ | --------------- |
| `--radius-xs`   | 4px    | Small elements  |
| `--radius-sm`   | 8px    | Buttons, inputs |
| `--radius-md`   | 12px   | Cards, panels   |
| `--radius-lg`   | 16px   | Large cards     |
| `--radius-xl`   | 20px   | Modals          |
| `--radius-2xl`  | 24px   | Large modals    |
| `--radius-3xl`  | 32px   | Full panels     |
| `--radius-full` | 9999px | Pills, circles  |

---

## Shadow System (Warm, not cold gray)

```css
--shadow-xs: 0 1px 2px rgba(14, 56, 46, 0.03);
--shadow-sm: 0 1px 3px rgba(14, 56, 46, 0.04), 0 1px 2px rgba(14, 56, 46, 0.02);
--shadow-md:
  0 4px 12px rgba(14, 56, 46, 0.04), 0 2px 4px rgba(14, 56, 46, 0.02);
--shadow-lg:
  0 12px 32px rgba(14, 56, 46, 0.06), 0 4px 8px rgba(14, 56, 46, 0.02);
--shadow-xl:
  0 24px 64px rgba(14, 56, 46, 0.08), 0 8px 16px rgba(14, 56, 46, 0.02);
--shadow-2xl: 0 48px 96px rgba(14, 56, 46, 0.12);
--shadow-glow-green: 0 0 48px rgba(14, 56, 46, 0.12);
--shadow-glow-gold: 0 0 48px rgba(212, 175, 55, 0.12);
--shadow-glow-lg: 0 0 80px rgba(14, 56, 46, 0.16);
```

---

## Motion System

### Easing Curves

```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.45, 0, 0.55, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Duration Tokens

```css
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 400ms;
--duration-slower: 600ms;
```

### Motion Principles

1. **Organic Over Mechanical** — Use natural easing
2. **Calm Over Energetic** — Subtle, not jarring
3. **Cinematic Over Decorative** — Tell stories
4. **Purposeful** — Every animation needs a reason

### Motion Primitives

| Primitive      | Purpose                  |
| -------------- | ------------------------ |
| Reveal         | Entrance animations      |
| TextReveal     | Word-by-word entrance    |
| Parallax       | Depth-based scroll       |
| Stagger        | Sequential children      |
| NumberReveal   | Animated counters        |
| ScrollProgress | Visual scroll indicator  |
| MagneticButton | Cursor-following buttons |

---

## Anti-AI-Slop Rules

### NEVER

- Gray placeholder mountains
- Generic black/white cards
- Random gradients/blobs/particles
- Purple/blue AI colors
- Generic glass cards everywhere
- Identical cards everywhere
- Huge typography everywhere
- Default icons
- Poor spacing
- Collapsed navigation
- Unrelated images
- Stock imagery without art direction
- Meaningless animations

### ALWAYS

- Bhavya brand colors
- Editorial typography
- Purposeful motion
- Real imagery or rich procedural SVG
- Sophisticated glassmorphism
- Elite navigation
- Mobile app-quality experience
- Nature-inspired motifs
- Gold as accent only
- Warm, not sterile

---

## Verification Checklist

Before declaring any UI complete:

1. [ ] Bhavya logo is visually dominant
2. [ ] Forest/cream/gold palette is unmistakable
3. [ ] Real imagery or rich SVG is present
4. [ ] Glassmorphism is sophisticated and restrained
5. [ ] Navigation is properly composed
6. [ ] Hero is art-directed
7. [ ] Missions are editorial, not generic
8. [ ] Motion is purposeful
9. [ ] Motion is not AI-slop
10. [ ] Mobile feels like a real app
11. [ ] Desktop feels spatial and premium
12. [ ] Public site and My Bhavya feel like one product
13. [ ] No placeholder visuals remain
14. [ ] No broken routes
15. [ ] No horizontal overflow
16. [ ] No console errors
17. [ ] Reduced-motion works
18. [ ] Design system remains canonical

---

## File Locations

| File                          | Path                                                                   |
| ----------------------------- | ---------------------------------------------------------------------- |
| Design Tokens                 | `packages/platform-ui/src/styles/tokens.css`                           |
| Design System Board           | `apps/ai-institute/public/brand/assets/bhavya-design-system-board.png` |
| Design System Board Reference | `docs/design-system/BHAVYA_DESIGN_SYSTEM_BOARD.md`                     |
| Web Experience Design System  | `docs/design-system/BHAVYA_WEB_EXPERIENCE.md`                          |
| Brand Guide                   | `docs/brand/BRAND_GUIDE.md`                                            |
| Motion System                 | `docs/design-system/BHVYA_MOTION_SYSTEM.md`                            |
| This Document                 | `docs/design-system/CANONICAL_DESIGN_SYSTEM.md`                        |
