id: MEM-UI
type: memory
domain: ui
owner: Design
last_updated: 2026-07-23

# UI Memory

## Design Tokens
- bg: #060608, surface: #0e0e11, surface-2: #16161a, border: #222228
- text: #f2f2f4, text-2: #9999aa, text-3: #666677
- green: #34d58a (primary), blue: #4c9eff, amber: #ffb340, purple: #b57bff, red: #ff6b6b
- font: Inter, mono: JetBrains Mono
- radius: 12px (cards), 8px (inputs), 6px (nav)
- max-width: 1200px

## Component Tree
- @bhavya/bdl (PKG-004): tokens/ → primitives/ → icons/, charts/, maps/, motion/
- @bhavya/ui (PKG-001): re-exports BDL primitives for apps
- apps/*/components/: app-specific components only

## Accessibility
- WCAG AA mandatory. Skip links on every page. Focus rings (--border-focus).
- prefers-reduced-motion support. Semantic HTML. ARIA labels.

## Component Rules
- One component per file. Named exports. Props typed with interface.
- Server Components by default. 'use client' for interactivity only.
