# Color System

## Primary Colors

| Token | Value | Use Case |
|-------|-------|----------|
| `primary` | #1E3A5F | Main brand color |
| `primary-light` | #2D5A8C | Hover states |
| `primary-dark` | #142A45 | Active states |

## Secondary Colors

| Token | Value | Use Case |
|-------|-------|----------|
| `secondary` | #4CAF50 | Success, positive |
| `secondary-light` | #66BB6A | Hover states |
| `secondary-dark` | #388E3C | Active states |

## Neutral Colors

| Token | Value | Use Case |
|-------|-------|----------|
| `background` | #FFFFFF | Page background |
| `foreground` | #1A1A1A | Primary text |
| `card` | #FFFFFF | Card background |
| `card-foreground` | #1A1A1A | Card text |
| `popover` | #FFFFFF | Popover background |
| `popover-foreground` | #1A1A1A | Popover text |
| `muted` | #F5F5F5 | Muted background |
| `muted-foreground` | #737373 | Secondary text |
| `border` | #E5E5E5 | Borders |
| `input` | #E5E5E5 | Input borders |
| `ring` | #1E3A5F | Focus rings |

## Semantic Colors

| Token | Value | Use Case |
|-------|-------|----------|
| `destructive` | #EF4444 | Errors, delete |
| `destructive-foreground` | #FFFFFF | Error text |
| `success` | #22C55E | Success states |
| `success-foreground` | #FFFFFF | Success text |
| `warning` | #F59E0B | Warning states |
| `warning-foreground` | #FFFFFF | Warning text |
| `info` | #3B82F6 | Information |
| `info-foreground` | #FFFFFF | Info text |

## Dark Mode

| Token | Value | Use Case |
|-------|-------|----------|
| `dark-background` | #0A0A0A | Page background |
| `dark-foreground` | #FAFAFA | Primary text |
| `dark-card` | #1A1A1A | Card background |
| `dark-card-foreground` | #FAFAFA | Card text |
| `dark-muted` | #262626 | Muted background |
| `dark-muted-foreground` | #A3A3A3 | Secondary text |
| `dark-border` | #262626 | Borders |

## Color Contrast (WCAG AA)

| Text Size | Required Ratio |
|-----------|----------------|
| Normal text | 4.5:1 |
| Large text | 3:1 |
| UI components | 3:1 |

## Usage

```tsx
import { DESIGN_TOKENS } from '../design-system';

const style = {
  backgroundColor: DESIGN_TOKENS.colors.background,
  color: DESIGN_TOKENS.colors.foreground,
  borderColor: DESIGN_TOKENS.colors.border,
};
```
