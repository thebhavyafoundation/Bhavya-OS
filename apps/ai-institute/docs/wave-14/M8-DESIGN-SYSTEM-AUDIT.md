# M8: Design System Audit

**Status:** ✅ Complete
**Date:** 2026-08-08

---

## Summary

Platform-ui provides a comprehensive token system (backgrounds, text, borders, accents, typography, spacing, shadows, animations, reduced-motion support). However, Bhavya brand colors are NOT in the token system — they're hardcoded throughout AI Institute.

## Token Coverage

| Category    | Tokens Available                                           | AI Institute Usage      |
| ----------- | ---------------------------------------------------------- | ----------------------- |
| Backgrounds | 8 tokens (primary→overlay)                                 | ✅ Used via Tailwind    |
| Text        | 6 tokens (primary→inverse)                                 | ✅ Used via Tailwind    |
| Borders     | 3 tokens (primary, secondary, focus)                       | ✅ Used via Tailwind    |
| Accents     | 14 colors (blue, green, yellow, red, purple, orange, cyan) | ⚠️ Bhavya brand missing |
| Typography  | 2 fonts, 7 sizes                                           | ✅ Inter font used      |
| Spacing     | 12 values (0→12)                                           | ✅ Used via Tailwind    |
| Radius      | 5 values (sm→full)                                         | ✅ Used via Tailwind    |
| Shadows     | 4 levels (sm→xl)                                           | ✅ Used via Tailwind    |
| Transitions | 3 speeds (fast, normal, slow)                              | ⚠️ Some hardcoded       |
| Z-index     | 4 layers (dropdown→tooltip)                                | ⚠️ Some hardcoded       |
| Animations  | 4 keyframes + reduced-motion                               | ✅ Used                 |

## Missing from Tokens

1. **Bhavya brand palette:** `#c9a227` (gold), `#8a7359` (earth), `#1a3a2a` (forest) — used 200+ times
2. **Success/error specific:** Only generic accent colors, no domain-specific (e.g., enrollment status)

## Recommendation

Add Bhavya brand tokens to `tokens.css`:

```css
--color-bhavya-gold: #c9a227;
--color-bhavya-earth: #8a7359;
--color-bhavya-forest: #1a3a2a;
```

**Priority:** Post-beta (functional without them).
