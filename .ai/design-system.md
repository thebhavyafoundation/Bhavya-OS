---
id: RUNTIME-006
owner: Design
version: 0.5
status: active
depends:
  - PKG-004
related:
  - STD-006
  - SPEC-006
  - MEM-UI
---

# Bhavya Design System

## Design Language (BDL)

The Bhavya Design Language (`packages/bdl/`) defines every visual token and primitive.

## Tokens

Located in `packages/bdl/tokens/`.

### Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--bg` | `#060608` | Page background |
| `--surface` | `#0e0e11` | Card/surface |
| `--surface-2` | `#16161a` | Elevated surface |
| `--surface-3` | `#1c1c22` | Interactive surface |
| `--border` | `#222228` | Borders |
| `--border-focus` | `#34d58a` | Focus ring |
| `--text` | `#f2f2f4` | Primary text |
| `--text-2` | `#9999aa` | Secondary text |
| `--text-3` | `#666677` | Muted text |
| `--green` | `#34d58a` | Primary accent (Nature) |
| `--blue` | `#4c9eff` | Secondary (Knowledge) |
| `--amber` | `#ffb340` | Accent (Heritage) |
| `--purple` | `#b57bff` | Accent (Governance) |
| `--red` | `#ff6b6b` | Error/danger |

### Typography

- Font: `Inter`, system-ui, -apple-system, sans-serif
- Mono: `JetBrains Mono`, monospace
- Scale: 11px (eyebrow) → 68px (hero heading)
- Weights: 400, 500, 600, 700, 800

### Spacing & Radius

- Border radius: `12px` (cards), `8px` (inputs), `6px` (nav), `4px` (tags)
- Grid gaps: `16px` (4-col), `20px` (3-col), `24px` (2-col)
- Section padding: `48px` horizontal, `80px` bottom
- Max content width: `1200px`

### Glow Effects

Each accent color has a matching glow: `--{color}-glow` (rgba at 15% opacity).

## Primitives

Located in `packages/bdl/primitives/`. Include:
- Button, Input, Select, Card, Table, Tag, Badge, Modal, Tooltip
- Navigation components
- Layout primitives (Container, Grid, Section)

## Icons

Located in `packages/bdl/icons/`. Built on Lucide icons with Bhavya theming.

## Charts

Located in `packages/bdl/charts/`. Chart primitives for dashboards.

## Maps

Located in `packages/bdl/maps/`. MapLibre-ready map placeholders.

## Motion

Located in `packages/bdl/motion/`. Animation tokens and primitives.

## Accessibility

- WCAG AA compliance mandatory
- Skip links on every page
- Focus rings with `--border-focus`
- ARIA labels on all interactive elements
- Semantic HTML structure
- `prefers-reduced-motion` support

## Usage

Apps import from `@bhavya/ui` which re-exports BDL primitives.
Never import BDL directly from app code.
