# Bhavya Foundation — Design System Board Reference

**Status:** ACTIVE
**Version:** 1.0
**Last Updated:** 2026-08-10
**Source:** User-provided design system board PNG

---

## Overview

This document captures the complete visual language of the Bhavya Foundation design system as shown in the canonical design system board. All agents, designers, and developers MUST use this reference when creating any UI components or visual assets.

---

## Visual Language Summary

### Core Identity

- **Tagline:** NATURE. KNOWLEDGE. HERITAGE.
- **Visual Metaphor:** Forest ecosystem — trees, mountains, sun, botanical elements
- **Color Story:** Forest green + warm ivory + heritage gold
- **Typography:** Editorial serif (Playfair Display) + modern sans (Inter)
- **Texture:** Layered depth, glassmorphism, organic patterns

### Design Principles

1. **Nature-Inspired:** Every element derives from forest, mountains, sun, or botanical motifs
2. **Editorial Quality:** Typography-driven, not template-driven
3. **Layered Depth:** Multiple visual layers create richness
4. **Restrained Glass:** Glassmorphism used sparingly, not everywhere
5. **Gold as Accent:** Gold highlights, never primary background
6. **Warm, Not Sterile:** Cream/ivory backgrounds, not pure white
7. **Purposeful Motion:** Animation tells stories, not decoration
8. **Mobile-First:** App-quality experience on all devices

---

## 1. Hero Illustration System

### Composition

- **Background:** Sky gradient (light blue → white)
- **Layers:** 3 mountain ranges (back → front, increasing opacity)
- **Center:** B-tree with golden sun halo
- **Foreground:** Rolling hills with contour lines
- **Atmosphere:** Fog/mist layers between mountains
- **Life:** Bird silhouettes (3 birds)
- **Detail:** River/water element

### Style Rules

- Flat design with subtle gradients
- No 3D or realistic rendering
- Semantic colors (var(--color-*))
- Scalable vector (viewBox)
- Accessible (aria-hidden for decorative)

### SVG Location

- `/brand/svg/mountain-layer.svg`
- `/brand/svg/tree.svg`
- `/brand/svg/sun.svg`

---

## 2. Mission Illustration System

### Four Mission Styles

#### Forest Mission

- Dense forest canopy
- Mountain backdrop
- River/water element
- Atmospheric fog
- Color: Forest green dominant

#### Knowledge Mission

- Library/study setting
- Books, globe, lamp
- Architectural elements
- Warm lighting
- Color: Gold/cream dominant

#### Heritage Mission

- Temple architecture
- Traditional buildings
- Cultural motifs
- Ornate details
- Color: Earth/gold dominant

#### Community Mission

- People silhouettes
- Community gathering
- Hand-holding/connection
- Warm, inclusive
- Color: Sage/earth dominant

### Style Rules

- Consistent illustration style across all four
- Each has unique visual identity
- All share: flat design, semantic colors, SVG format
- Used in: mission cards, section headers, feature highlights

### SVG Location

- `/brand/svg/mission-forest.svg`
- `/brand/svg/mission-knowledge.svg`
- `/brand/svg/mission-infrastructure.svg`
- `/brand/svg/mission-giving.svg`

---

## 3. Icon System

### Icon Categories

#### Core Icons (4)

- Forest (tree with roots)
- Knowledge (book/lamp)
- Heritage (temple/architecture)
- Community (people/hands)

#### Activity Icons (4)

- Research (magnifying glass)
- Education (graduation cap)
- Innovation (lightbulb)
- Volunteers (hands)

#### Value Icons (4)

- Stewardship (shield)
- Integrity (checkmark)
- Service (heart)
- Excellence (star)

#### Infrastructure Icons (4)

- Library (books)
- AI Lab (circuit/brain)
- Water (droplet)
- Energy (lightning)

#### Place Icons (3)

- Mountains
- Temple
- Youth (person)

### Style Rules

- 24x24 or 32x32 viewBox
- Stroke-based (not filled)
- 2px stroke weight
- Rounded caps/joins
- Semantic colors
- Consistent visual weight

### SVG Location

- `/brand/svg/` (all icons)

---

## 4. Background Pattern System

### Pattern Types

#### Leaf Pattern

- Repeating leaf motif
- Dark green on cream
- Subtle, organic
- Usage: Section backgrounds

#### Wave/Terrain Pattern

- Organic curves
- Topographic feel
- Subtle depth
- Usage: Dividers, backgrounds

#### Tree Repeat Pattern

- Forest canopy repeat
- Dense, natural
- Green palette
- Usage: Feature sections

#### Mountain Contour Pattern

- Topographic lines
- Subtle, technical
- Green/gray palette
- Usage: Data sections

### Style Rules

- Seamless repeat
- Low opacity (0.05-0.15)
- Semantic colors
- SVG format
- Accessible (aria-hidden)

### SVG Location

- `/brand/svg/leaf-pattern.svg`

---

## 5. Decorative Element System

### Elements

#### Sun

- Golden circle with rays
- Warm, radiant
- Usage: Hero, accents

#### Leaf Sprigs

- Botanical branches
- Organic, natural
- Usage: Dividers, accents

#### Mountain Silhouettes

- Layered ranges
- Depth, scale
- Usage: Section dividers

#### Organic Dividers

- Curved lines
- Natural flow
- Usage: Section breaks

### Style Rules

- Consistent stroke weight
- Semantic colors
- SVG format
- Decorative only (aria-hidden)

### SVG Location

- `/brand/svg/sun.svg`
- `/brand/svg/leaf-pattern.svg`

---

## 6. Section Divider System

### Divider Types

#### Mountain Range Divider

- Silhouette of mountain range
- Layered depth
- Usage: Major section breaks

#### Botanical Vine Divider

- Organic vine with leaves
- Flowing, natural
- Usage: Content sections

#### Gold Accent Line

- Thin gold line
- Subtle, premium
- Usage: Feature highlights

### Style Rules

- Full width
- Low opacity (0.2-0.4)
- Semantic colors
- SVG format
- Accessible (role="separator")

### SVG Location

- `/brand/svg/mountain-layer.svg` (for dividers)

---

## 7. Logo System

### Logo Variations

#### Full Logo

- Icon + wordmark
- Horizontal layout
- Primary usage

#### Icon Only

- B-tree mark
- Compact
- Social profiles, favicons

#### Horizontal Layout

- Icon + wordmark side by side
- Navigation, headers

#### Stacked Layout

- Icon above wordmark
- Compact spaces

#### Dark/Light Variants

- Dark version (for light backgrounds)
- Light version (for dark backgrounds)

### Usage Rules

- Minimum clear space: height of "B" icon
- Never stretch or distort
- Use provided SVG files
- Maintain visual hierarchy

### SVG Location

- `/brand/logo.svg` (full)
- `/brand/icon.svg` (icon only)
- `/docs/brand/assets/bhavya-logo-full.svg`
- `/docs/brand/assets/bhavya-icon.svg`

---

## 8. UI Component System

### Button Styles

#### Primary Button

- Forest green background
- White text
- Rounded corners
- Hover: darker green

#### Secondary Button

- Outlined (forest green border)
- Transparent background
- Forest green text
- Hover: light green background

#### Text Link

- No background/border
- Forest green text
- Underline on hover
- Inline usage

### Badge Styles

#### Ongoing

- Green background
- White text
- Pill shape

#### Impact

- Gold background
- Dark text
- Pill shape

#### New

- Blue background
- White text
- Pill shape

#### Featured

- Purple background
- White text
- Pill shape

### Card Styles

#### Mission Card

- Image/gradient header
- Icon overlay
- Title + description
- Stat + arrow footer
- Glass background

#### Knowledge Card

- Icon header
- Title + description
- Link footer
- Subtle hover

### Style Rules

- Consistent spacing
- Semantic colors
- Accessible (focus states)
- Responsive
- Glass system compliant

---

## 9. Infographic Element System

### Elements

#### Progress Circle

- Circular progress bar
- Percentage display
- Usage: Stats, progress

#### People Icon

- Group of people
- Usage: Community stats

#### Mountain Icon

- Mountain silhouette
- Usage: Forest stats

#### Brain Icon

- Brain with circuits
- Usage: Knowledge stats

### Style Rules

- Consistent size
- Semantic colors
- SVG format
- Accessible (aria-label)

---

## 10. App Navigation System

### Navigation Icons

#### Primary Nav

- Home (house)
- Learn (book)
- Missions (target)
- Community (people)
- Profile (person)

#### Utility Nav

- Search (magnifying glass)
- Notifications (bell)
- Menu (hamburger)

### Style Rules

- 24x24 viewBox
- Stroke-based
- 2px weight
- Active state: filled
- Inactive state: outlined
- Consistent visual weight

---

## 11. Illustrative Spot Graphics

### Graphics

#### Books Stack

- Stack of books
- Usage: Education sections

#### Globe

- Earth globe
- Usage: Global impact

#### Temple

- Traditional architecture
- Usage: Heritage sections

#### Community Figures

- People silhouettes
- Usage: Community sections

### Style Rules

- Consistent illustration style
- Flat design
- Semantic colors
- SVG format
- Decorative (aria-hidden)

---

## 12. Animation/Loading System

### Animation Types

#### Mountain Landscape

- Layered mountains
- Subtle parallax
- Usage: Loading screens

#### Sun Rise/Set

- Sun gradient
- Warm animation
- Usage: Transitions

#### Leaf Growth

- Organic growth
- Natural motion
- Usage: Progress indicators

### Style Rules

- Subtle, not distracting
- Organic easing
- Semantic colors
- Lottie-ready SVG
- Reduced motion support

---

## Color Palette Reference

### Primary Palette

| Name          | Hex     | RGB           | Usage                              |
| ------------- | ------- | ------------- | ---------------------------------- |
| Forest Green  | #0E382E | 14, 56, 46    | Primary brand, dark backgrounds    |
| Warm Ivory    | #F7F4EC | 247, 244, 236 | Primary background, light surfaces |
| Heritage Gold | #D4AF37 | 212, 175, 55  | Accent, highlights, premium        |

### Supporting Palette

| Name       | Hex     | RGB           | Usage                               |
| ---------- | ------- | ------------- | ----------------------------------- |
| Sage       | #8A9A8B | 138, 154, 139 | Subtle elements, secondary text     |
| Earth      | #6A7C52 | 106, 124, 82  | Nature elements, supporting accents |
| Stone      | #E6E0D3 | 230, 224, 211 | Secondary backgrounds, cards        |
| Charcoal   | #1F1F1F | 31, 31, 31    | Dark text                           |
| Soft Black | #2A2A2A | 42, 42, 42    | Body text                           |

---

## Typography Reference

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

### Type Scale

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

---

## Glass System Reference

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

---

## Motion System Reference

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

## File Locations

| File                | Path                                                                   |
| ------------------- | ---------------------------------------------------------------------- |
| Design System Board | `apps/ai-institute/public/brand/assets/bhavya-design-system-board.png` |
| Design Tokens       | `packages/platform-ui/src/styles/tokens.css`                           |
| Brand Guide         | `docs/brand/BRAND_GUIDE.md`                                            |
| Motion System       | `docs/design-system/BHAVYA_MOTION_SYSTEM.md`                           |
| Visual Language     | `docs/design-system/BHAVYA_VISUAL_LANGUAGE.md`                         |
| This Document       | `docs/design-system/BHAVYA_DESIGN_SYSTEM_BOARD.md`                     |

---

## Usage for Agents

When creating any Bhavya Foundation UI:

1. **Review this document** for visual consistency
2. **Use the exact color palette** (no arbitrary colors)
3. **Follow the typography hierarchy** (serif headings, sans body)
4. **Use the icon set** (don't create new icons)
5. **Apply the mission illustration style** (consistent across all four)
6. **Use the section dividers** (mountain, botanical, gold)
7. **Follow the glass system rules** (restrained, not everywhere)
8. **Maintain editorial quality** (typography-driven, not template-driven)
9. **Add purposeful motion** (organic, not mechanical)
10. **Verify against anti-AI-slop rules** (no generic patterns)

---

## Notes

- This document captures the visual language from the user-provided design system board PNG
- All SVG assets are located in `/brand/svg/` and `/docs/brand/assets/`
- The design system is canonical and must be followed for all UI work
- When in doubt, reference this document and the brand guide
