# Bhavya Foundation — Brand Asset Manifest

**Last updated:** 2026-08-10

## Canonical Brand Assets

### Logo Files

| Asset | Location | Format | Usage |
|-------|----------|--------|-------|
| Primary Logo | `apps/ai-institute/public/brand/logo.svg` | SVG | Full wordmark with B-tree icon |
| Icon Only | `apps/ai-institute/public/brand/icon.svg` | SVG | B-tree symbol (social profiles, favicon) |
| Apple Touch Icon | `apps/ai-institute/public/brand/apple-touch-icon.svg` | SVG | iOS home screen icon |

### SVG Illustrations

| Asset | Location | Usage |
|-------|----------|-------|
| Mountain Layer | `apps/ai-institute/public/brand/svg/mountain-layer.svg` | Hero backgrounds, section dividers |
| Sun | `apps/ai-institute/public/brand/svg/sun.svg` | Hero accent, decorative elements |
| Tree | `apps/ai-institute/public/brand/svg/tree.svg` | Forest mission, nature themes |
| Leaf Pattern | `apps/ai-institute/public/brand/svg/leaf-pattern.svg` | Background patterns, textures |

### Mission Illustrations

| Mission | Location | Style |
|---------|----------|-------|
| Forest | `apps/ai-institute/public/brand/svg/mission-forest.svg` | Dense forest with river, mountain backdrop |
| Knowledge | `apps/ai-institute/public/brand/svg/mission-knowledge.svg` | Library/study with books, globe, lamp |
| Heritage | `apps/ai-institute/public/brand/svg/mission-infrastructure.svg` | Temple architecture, traditional buildings |
| Giving | `apps/ai-institute/public/brand/svg/mission-giving.svg` | Community giving, support themes |

### Design System Reference

| Asset | Location | Purpose |
|-------|----------|---------|
| Design System Board | `apps/ai-institute/public/brand/assets/bhavya-design-system-board.png` | Canonical visual reference for all UI work |

## Color Tokens (Canonical Source)

**Source:** `packages/platform-ui/src/styles/tokens.css`

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-brand-forest` | #0e382e | Primary brand color |
| `--color-brand-ivory` | #f7f4ec | Secondary brand color |
| `--color-brand-gold` | #d4af37 | Accent brand color |
| `--color-brand-sage` | #8a9a8b | Supporting color |
| `--color-brand-earth` | #6a7c52 | Supporting color |

## Typography Tokens

| Role | Font | Weight | Source |
|------|------|--------|--------|
| Headings | Playfair Display | 400-700 | Google Fonts |
| Body | Inter | 400-500 | Google Fonts |
| Code | JetBrains Mono | 400 | Google Fonts |

## Glass System

| Type | Description | CSS Variable |
|------|-------------|--------------|
| Standard | Cream translucent | `--glass-standard` |
| Heavy | More opaque | `--glass-heavy` |
| Forest | Dark translucent | `--glass-forest` |
| Gold | Gold tinted | `--glass-gold` |

## Usage Rules

1. **Always use canonical tokens** from `packages/platform-ui/src/styles/tokens.css`
2. **Never create custom colors** — use the token system
3. **Reference the Design System Board** before creating any UI
4. **Use existing SVG illustrations** — do not create new icons without approval
5. **Maintain clear space** around logo: minimum height of the "B" icon
6. **Use correct color variants** for light/dark backgrounds
