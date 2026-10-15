// Design Token Constants — Bhavya Foundation
// Canonical source: packages/platform-ui/src/styles/tokens.css
// This file provides TypeScript constants that mirror CSS tokens for type-safe usage.
// Run `pnpm tokens:sync` to regenerate if tokens change.

export const designTokens = {
  colors: {
    // Primitive scales
    forest: {
      50: "#E8F0EB",
      100: "#D1E1D7",
      200: "#A3C3AF",
      300: "#75A587",
      400: "#4C875F",
      500: "#2E6B42",
      600: "#1B3A2F", // Primary brand
      700: "#152D24",
      800: "#0F2019",
      900: "#0A140F",
    },
    ivory: {
      50: "#FDFBF5",
      100: "#F5F0E8", // Background
      200: "#EBE1D1",
      300: "#DCCCA3",
      400: "#CDB575",
      500: "#BE9C47",
      600: "#A68036",
      700: "#85642B",
      800: "#694D24",
      900: "#543D1E",
    },
    gold: {
      50: "#FEF9F0",
      100: "#FDF0D9",
      200: "#F9E1B3",
      300: "#F5D28D",
      400: "#F1C367",
      500: "#C8A951", // Accent
      600: "#A38A41",
      700: "#7D6B31",
      800: "#635428",
      900: "#504522",
    },
    earth: {
      50: "#F5F0EB",
      100: "#EBE1D7",
      200: "#D7C3AF",
      300: "#C3A587",
      400: "#AF875F",
      500: "#9B6B42",
      600: "#8B7355", // Secondary text
      700: "#735D46",
      800: "#5D4A39",
      900: "#4A3C2E",
    },
    error: {
      50: "#FDF2F2",
      100: "#FBE5E5",
      200: "#F5CACA",
      300: "#EDA5A5",
      400: "#E57A7A",
      500: "#DD4D4D",
      600: "#C0392B", // Error actions
      700: "#9A2E22",
      800: "#78251B",
      900: "#5E1E15",
    },

    // Semantic aliases
    primary: "forest.600",
    primaryHover: "forest.700",
    background: "ivory.100",
    surface: "ivory.50",
    textPrimary: "forest.900",
    textSecondary: "earth.600",
    border: "earth.200",
    accent: "gold.500",
    focus: "gold.400",
  },

  spacing: {
    1: "0.25rem", // 4px
    2: "0.5rem", // 8px
    3: "0.75rem", // 12px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    8: "2rem", // 32px
    10: "2.5rem", // 40px
    12: "3rem", // 48px
    16: "4rem", // 64px
  },

  typography: {
    fontFamilies: {
      display: '"Playfair Display", serif',
      sans: '"Inter", sans-serif',
      mono: '"JetBrains Mono", monospace',
    },
    fontSizes: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
    },
    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.1,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  borderRadius: {
    sm: "0.25rem", // 4px
    md: "0.375rem", // 6px
    lg: "0.5rem", // 8px
    xl: "0.75rem", // 12px
    full: "9999px",
  },

  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  },

  transitions: {
    fast: "150ms ease",
    normal: "250ms ease",
    slow: "350ms ease",
  },

  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },

  zIndex: {
    dropdown: 100,
    sticky: 200,
    modal: 300,
    popover: 400,
    tooltip: 500,
  },
} as const;

export type DesignTokens = typeof designTokens;

// Helper to get CSS custom property name
export function cssVar(path: string): string {
  return `var(--${path.replace(/\./g, "-")})`;
}

// Example: cssVar('colors.primary') → 'var(--colors-primary)'
// Note: Actual CSS uses flat naming like --color-forest-600
