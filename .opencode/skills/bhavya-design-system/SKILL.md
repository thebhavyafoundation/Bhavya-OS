---
name: bhavya-design-system
description: Enforce Bhavya dual-mode design system. Use when creating, reviewing, or modifying UI components, pages, layouts, or visual design.
compatibility: opencode
---

# Bhavya Design System Skill

## Purpose

Enforce the two visual modes of Bhavya Foundation while maintaining shared design DNA. Prevent AI-slop patterns and ensure institutional aesthetics.

## Two Modes

### Foundation Mode (Public)
- **Feel:** Warm, editorial, natural, human, institutional, premium, timeless
- **Colors:** Forest green `#0e382e`, warm ivory `#f7f4ec`, heritage gold `#d4af37`, sage `#8a9a8b`, earth `#6a7c52`
- **Typography:** Playfair Display (display headings), Inter (body text)
- **Surfaces:** Cream backgrounds, forest imagery, large whitespace, thin borders
- **Motion:** Cinematic, subtle, purposeful

### OS Mode (Internal)
- **Feel:** Dark, technical, precise, data-rich, operational, intelligent
- **Colors:** Dark surfaces, subtle grid, modular panels
- **Layout:** Data visualization, compact metadata, workspace navigation
- **Interaction:** Command/search interface, keyboard-first

### Shared DNA
Both modes share: calm, minimal, credible, modern, institutional

## Design Tokens

Canonical tokens live in `packages/platform-ui/src/styles/tokens.css`.

Always use token variables, never hardcoded hex values:
- `--color-forest-*` for greens
- `--color-ivory-*` for warm whites
- `--color-gold-*` for accents
- `--color-sage-*` for muted greens
- `--color-earth-*` for brown-greens
- `--font-display` for Playfair Display
- `--font-sans` for Inter
- `--space-*` for spacing (8pt grid)

## Components

Canonical components live in `packages/platform-ui/src/components/`.

Use existing components before creating new ones:
- AppShell, AppSidebar, AppHeader (layout)
- Card, StatCard, DataTable (data display)
- Modal, Toast, Badge, StatusBadge (feedback)
- Button, SearchBar, Tabs (interaction)
- PageLayout, Breadcrumb, Skeleton, EmptyState, ErrorState, LoadingState (page structure)

## Anti-Slop Rules

**NEVER create:**
- Purple/blue AI gradients
- Generic dark AI dashboards
- Random glass cards without restraint
- Excessive rounded cards (use token radius)
- Template hero sections
- AI-generated illustrations
- Generic stock imagery
- Random neon accents
- Dashboard-first homepage composition

**ALWAYS ensure:**
- Editorial typography hierarchy
- Forest/ivory/gold/sage/earth palette
- Intentional spatial rhythm
- Meaningful motion
- Responsive design (mobile, tablet, desktop)
- `prefers-reduced-motion` support
- Accessibility (ARIA labels, keyboard nav, screen reader support)

## Verification

Before completing any UI work:
1. Does it use design tokens (not hardcoded colors)?
2. Does it use existing components (not reinventing)?
3. Does it match the appropriate mode (Foundation vs OS)?
4. Does it avoid AI-slop patterns?
5. Is it responsive?
6. Does it support reduced motion?
7. Is it accessible?
