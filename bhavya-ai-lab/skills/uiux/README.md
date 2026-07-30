# UI/UX Design Intelligence

## Purpose

Generate design systems, apply UI patterns, and ensure accessibility across all Bhavya AI Lab outputs.

## Core Concepts

### Design System

A design system is a set of rules for visual consistency:

```json
{
  "colors": {
    "primary": "#1E3A5F",
    "secondary": "#4CAF50",
    "background": "#FFFFFF",
    "text": "#1A1A1A"
  },
  "fonts": {
    "heading": "Poppins",
    "body": "Inter"
  },
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px"
  }
}
```

### Visual Hierarchy

Guide the eye through content:

1. **Size** - Larger = more important
2. **Color** - Contrast draws attention
3. **Spacing** - White space creates focus
4. **Typography** - Weight and style signal importance

### Accessibility (WCAG)

- **Level A** - Minimum compliance
- **Level AA** - Standard compliance
- **Level AAA** - Enhanced compliance

Key requirements:
- Color contrast ratio ≥ 4.5:1 for text
- Keyboard navigation support
- Screen reader compatibility
- `prefers-reduced-motion` support

## Usage

### Generate Design System

```bash
# Generate for education platform
python3 scripts/search.py "education" --design-system

# Generate for dashboard
python3 scripts/search.py "dashboard" --design-system
```

### Apply Design System

```tsx
import { DESIGN_TOKENS } from '../design-system';

const style = {
  backgroundColor: DESIGN_TOKENS.colors.background,
  color: DESIGN_TOKENS.colors.text,
  fontFamily: DESIGN_TOKENS.fonts.body,
  padding: DESIGN_TOKENS.spacing.md,
};
```

## Best Practices

1. Use design tokens, not hardcoded values
2. Test with color blindness simulators
3. Support dark mode from the start
4. Use relative units (rem, em)
5. Test keyboard navigation
