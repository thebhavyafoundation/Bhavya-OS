# Bhavya Foundation — Web Experience Design System

**Status:** ACTIVE
**Version:** 2.0
**Last Updated:** 2026-08-10

---

## Visual Identity Answer

**"WHAT SHOULD THE BHAVYA FOUNDATION WEB APP EXPERIENCE FEEL LIKE?"**

- ELITE
- INSTITUTIONAL
- EDITORIAL
- NATURE-INSPIRED
- CULTURAL
- TECHNOLOGICALLY ADVANCED
- CALM
- IMMERSIVE
- INTELLIGENT
- PREMIUM
- MOBILE-FIRST
- APP-LIKE

It must feel like a serious institution that could exist for 50+ years.

It must NOT feel like:

- An AI startup
- SaaS
- A dashboard template
- shadcn demo
- Tailwind demo
- Crypto site
- Generic Web3 site
- Developer portfolio
- AI-generated landing page
- Generic education platform

---

## Color System

### Primary Palette

| Name          | Hex     | RGB           | Usage                                       |
| ------------- | ------- | ------------- | ------------------------------------------- |
| Forest Green  | #0E382E | 14, 56, 46    | Primary brand color, dark backgrounds, CTAs |
| Warm Ivory    | #F7F4EC | 247, 244, 236 | Primary background, light surfaces          |
| Heritage Gold | #D4AF37 | 212, 175, 55  | Accent, highlights, premium elements        |

### Supporting Palette

| Name       | Hex     | RGB           | Usage                               |
| ---------- | ------- | ------------- | ----------------------------------- |
| Sage       | #8A9A8B | 138, 154, 139 | Subtle elements, secondary text     |
| Earth      | #6A7C52 | 106, 124, 82  | Nature elements, supporting accents |
| Stone      | #E6E0D3 | 230, 224, 211 | Secondary backgrounds, cards        |
| Charcoal   | #1F1F1F | 31, 31, 31    | Dark text                           |
| Soft Black | #2A2A2A | 42, 42, 42    | Body text                           |

### Forest Scale (for gradients)

| Step | Hex     | Usage         |
| ---- | ------- | ------------- |
| 50   | #f0f7f2 | Lightest tint |
| 100  | #d4e8d9 | Light tint    |
| 200  | #a8d1b3 | Soft green    |
| 300  | #7cba8d | Medium green  |
| 400  | #51a367 | Vibrant green |
| 500  | #2d8a45 | Strong green  |
| 600  | #1a6b30 | Deep green    |
| 700  | #0E382E | Brand forest  |
| 800  | #0a2a21 | Darker forest |
| 900  | #071c16 | Very dark     |
| 950  | #040f0b | Near black    |

### Gold Scale

| Step | Hex     | Usage          |
| ---- | ------- | -------------- |
| 50   | #fdf8e8 | Lightest gold  |
| 100  | #f9ecc0 | Light gold     |
| 200  | #f3d88a | Soft gold      |
| 300  | #e8c04a | Bright gold    |
| 400  | #D4AF37 | Brand gold     |
| 500  | #c09a2a | Deep gold      |
| 600  | #a07d1e | Dark gold      |
| 700  | #806418 | Very dark gold |

---

## Typography System

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

| Token       | Size      | Line Height | Usage                |
| ----------- | --------- | ----------- | -------------------- |
| --text-xs   | 0.75rem   | 1.4         | Labels, captions     |
| --text-sm   | 0.8125rem | 1.5         | Small text, metadata |
| --text-base | 0.9375rem | 1.6         | Body text            |
| --text-md   | 1rem      | 1.6         | Default body         |
| --text-lg   | 1.125rem  | 1.7         | Large body           |
| --text-xl   | 1.25rem   | 1.7         | Lead text            |
| --text-2xl  | 1.5rem    | 1.3         | Subheadings          |
| --text-3xl  | 1.875rem  | 1.2         | Section headings     |
| --text-4xl  | 2.25rem   | 1.15        | Page headings        |
| --text-5xl  | 3rem      | 1.1         | Hero headings        |
| --text-6xl  | 3.75rem   | 1.05        | Display headings     |
| --text-7xl  | 4.5rem    | 1.0         | Large display        |

### Typography Classes

```css
/* Editorial heading — serif, tight */
.editorial-heading {
  font-family: var(--font-display);
  font-weight: 400;
  letter-spacing: -0.01em;
  line-height: 1.15;
}

/* Editorial label — uppercase, gold */
.editorial-label {
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-gold);
}

/* Editorial lead — large body */
.editorial-lead {
  font-size: var(--text-xl);
  color: var(--color-text-secondary);
  line-height: 1.7;
}
```

---

## Glass System

### Bhavya Glass Variants

```css
/* Standard glass — cream translucent */
.glass {
  background: rgba(247, 244, 236, 0.72);
  backdrop-filter: blur(12px) saturate(1.2);
  border: 1px solid rgba(14, 56, 46, 0.12);
}

/* Heavy glass — more opaque */
.glass-heavy {
  background: rgba(247, 244, 236, 0.88);
  backdrop-filter: blur(20px) saturate(1.3);
  border: 1px solid rgba(14, 56, 46, 0.12);
}

/* Forest glass — dark translucent */
.glass-forest {
  background: rgba(14, 56, 46, 0.92);
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

### Glass Usage Rules

1. **Navigation:** Use `.glass` for sticky nav
2. **Cards:** Use `.glass-heavy` for elevated cards
3. **Overlays:** Use `.glass-forest` for modal backgrounds
4. **Accents:** Use `.glass-gold` for highlighted elements
5. **NOT everywhere:** Only where depth is needed

---

## Spacing System

### 8pt Grid

| Token      | Value   | Pixels |
| ---------- | ------- | ------ |
| --space-0  | 0       | 0      |
| --space-1  | 0.25rem | 4      |
| --space-2  | 0.5rem  | 8      |
| --space-3  | 0.75rem | 12     |
| --space-4  | 1rem    | 16     |
| --space-5  | 1.25rem | 20     |
| --space-6  | 1.5rem  | 24     |
| --space-8  | 2rem    | 32     |
| --space-10 | 2.5rem  | 40     |
| --space-12 | 3rem    | 48     |
| --space-16 | 4rem    | 64     |
| --space-20 | 5rem    | 80     |
| --space-24 | 6rem    | 96     |
| --space-32 | 8rem    | 128    |
| --space-40 | 10rem   | 160    |

---

## Border Radius

| Token         | Value  | Usage           |
| ------------- | ------ | --------------- |
| --radius-xs   | 4px    | Small elements  |
| --radius-sm   | 8px    | Buttons, inputs |
| --radius-md   | 12px   | Cards, panels   |
| --radius-lg   | 16px   | Large cards     |
| --radius-xl   | 20px   | Modals          |
| --radius-2xl  | 24px   | Large modals    |
| --radius-3xl  | 32px   | Full panels     |
| --radius-full | 9999px | Pills, circles  |

---

## Shadow System

### Warm Shadows (not cold gray)

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
```

### Glow Shadows

```css
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

- **Reveal** — Entrance animations
- **TextReveal** — Word-by-word entrance
- **Parallax** — Depth-based scroll
- **Stagger** — Sequential children
- **NumberReveal** — Animated counters
- **ScrollProgress** — Visual scroll indicator
- **MagneticButton** — Cursor-following buttons

---

## Component Patterns

### Navigation

- Fixed position, glass background
- Logo + wordmark on left
- Links centered
- CTA + search on right
- Mobile: hamburger + slide drawer

### Hero

- Full viewport height
- Layered SVG landscape (sky, mountains, forest)
- Left-aligned editorial content
- Badge + title + description + CTAs
- Scroll indicator

### Mission Cards

- 4-column grid (desktop)
- 2-column grid (tablet)
- 1-column stack (mobile)
- Image/gradient header with icon
- Editorial content body
- Stat + arrow footer

### Knowledge Cards

- 3-column grid (desktop)
- Icon + title + description + link
- Subtle hover with gold border

### Stats Section

- Forest green background
- 4-column grid
- Large display numbers
- Uppercase labels

### Footer

- Forest green background
- 5-column grid (desktop)
- Brand + navigation columns
- Status indicator
- Bottom bar with links

---

## SVG Asset System

### Canonical Assets

| Asset          | Location                        | Usage           |
| -------------- | ------------------------------- | --------------- |
| Logo (full)    | `/brand/logo.svg`               | Header, footer  |
| Icon           | `/brand/icon.svg`               | Favicon, social |
| Mountain Layer | `/brand/svg/mountain-layer.svg` | Hero background |
| Sun            | `/brand/svg/sun.svg`            | Decorative      |
| Tree           | `/brand/svg/tree.svg`           | Decorative      |
| Leaf Pattern   | `/brand/svg/leaf-pattern.svg`   | Dividers        |
| Mission Icons  | `/brand/svg/mission-*.svg`      | Mission cards   |

### SVG Usage Rules

1. **Always use viewBox** for scaling
2. **Use semantic colors** (var(--color-*))
3. **Optimize** — remove unnecessary attributes
4. **Accessibility** — add aria-hidden for decorative

---

## Responsive Breakpoints

| Breakpoint | Width     | Layout                 |
| ---------- | --------- | ---------------------- |
| Mobile     | <= 640px  | Single column, stacked |
| Tablet     | <= 1024px | 2-column grids         |
| Desktop    | > 1024px  | Full layout            |

### Mobile-First Rules

1. Navigation: hamburger + drawer
2. Hero: stacked content
3. Grids: single column
4. Touch targets: minimum 44px
5. Safe area support

---

## Anti-AI-Slop Rules

### NEVER:

- Gray placeholder mountains
- Generic black/white cards
- Random gradients
- Random blobs
- Random particles
- Generic glass cards
- Identical cards everywhere
- Huge typography everywhere
- Default icons
- Poor spacing
- Collapsed navigation
- Unrelated images
- Stock imagery without art direction
- Meaningless animations
- Purple/blue AI colors

### ALWAYS:

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

## Reference Images

### Design System Board

**File:** `bhavya-design-system-board.png`
**Location:** `apps/ai-institute/public/brand/assets/`

This board contains:

- Hero illustration style
- Mission illustration styles
- Icon set
- Background patterns
- Decorative elements
- Section dividers
- Logo variations
- UI components
- Infographic elements
- Navigation icons
- Spot graphics
- Animation references
- Color palette
- Typography samples

**All agents MUST review this board before creating UI.**

---

## File Locations

| File                          | Path                                                                   |
| ----------------------------- | ---------------------------------------------------------------------- |
| Design System Board           | `apps/ai-institute/public/brand/assets/bhavya-design-system-board.png` |
| Design System Board Reference | `docs/design-system/BHAVYA_DESIGN_SYSTEM_BOARD.md`                     |
| Design Tokens                 | `packages/platform-ui/src/styles/tokens.css`                           |
| Brand Guide                   | `docs/brand/BRAND_GUIDE.md`                                            |
| Motion System                 | `docs/design-system/BHAVYA_MOTION_SYSTEM.md`                           |
| Visual Language               | `docs/design-system/BHAVYA_VISUAL_LANGUAGE.md`                         |
| This Document                 | `docs/design-system/BHAVYA_WEB_EXPERIENCE.md`                          |
