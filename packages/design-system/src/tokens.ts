/**
 * @bhavya/design-system — Unified Design Tokens
 *
 * Merges the warm institutional palette from BDL with the dark tech palette
 * from platform-ui. Both themes are available for use across all apps.
 *
 * Usage:
 *   import { tokens, lightTheme, darkTheme } from '@bhavya/design-system/tokens';
 */

// ─── Primitives ─────────────────────────────────────────────────────────────

export const primitives = {
  colors: {
    white: "#FFFFFF",
    black: "#000000",
    transparent: "transparent",

    // Warm institutional palette (BDL editorial)
    cream: "#F6F2E7",
    parchment: "#EAE3D2",
    sand: "#D9CDB8",
    forest: "#173D2E",
    forestLight: "#245B45",
    gold: "#C79A4B",

    // Institutional dark palette
    navy: "#07090E",
    navyLight: "#111520",
    navyMid: "#1A2033",
    slate: "#232A42",
    cyan: "#00F0FF",
    cyanDark: "#00C3FF",
    blue: "#0055FF",

    // Tech dark palette
    gray950: "#0a0a0a",
    gray900: "#111111",
    gray850: "#18181b",
    gray800: "#1a1a1a",
    gray700: "#27272a",
    gray600: "#3f3f46",
    gray500: "#52525b",
    gray400: "#71717a",
    gray300: "#a1a1aa",
    gray100: "#fafafa",

    // Accent palette
    blue500: "#3b82f6",
    blue600: "#2563eb",
    green500: "#22c55e",
    green600: "#16a34a",
    yellow500: "#eab308",
    yellow600: "#ca8a04",
    red500: "#ef4444",
    red600: "#dc2626",
    purple500: "#a855f7",
    purple600: "#9333ea",
    orange500: "#f97316",
    orange600: "#ea580c",
    cyan500: "#06b6d4",
    cyan600: "#0891b2",
  },

  typography: {
    fontFamily: {
      sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: '"JetBrains Mono", "Fira Code", "SF Mono", monospace',
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
    },
    fontWeight: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
    lineHeight: {
      tight: "1.25",
      snug: "1.375",
      normal: "1.5",
      relaxed: "1.625",
      loose: "2",
    },
    letterSpacing: {
      tight: "-0.02em",
      normal: "0",
      wide: "0.025em",
      wider: "0.05em",
    },
  },

  spacing: {
    0: "0px",
    1: "4px",
    2: "8px",
    3: "12px",
    4: "16px",
    5: "20px",
    6: "24px",
    7: "28px",
    8: "32px",
    9: "36px",
    10: "40px",
    12: "48px",
    14: "56px",
    16: "64px",
    20: "80px",
    24: "96px",
    32: "128px",
  },

  borderRadius: {
    none: "0px",
    sm: "2px",
    md: "4px",
    lg: "8px",
    xl: "12px",
    "2xl": "16px",
    full: "9999px",
  },

  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  },

  transitions: {
    fast: "150ms ease",
    normal: "200ms ease",
    slow: "300ms ease",
  },

  zIndex: {
    base: "0",
    dropdown: "50",
    sticky: "60",
    modal: "100",
    toast: "150",
    tooltip: "200",
  },
} as const;

// ─── Theme Types ────────────────────────────────────────────────────────────

export interface ThemeColors {
  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
    hover: string;
    active: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    tertiary: string;
    muted: string;
    inverse: string;
  };
  border: {
    primary: string;
    secondary: string;
    focus: string;
  };
  accent: {
    blue: string;
    blueHover: string;
    green: string;
    greenHover: string;
    yellow: string;
    yellowHover: string;
    red: string;
    redHover: string;
    purple: string;
    purpleHover: string;
    orange: string;
    orangeHover: string;
    cyan: string;
    cyanHover: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  score: {
    excellent: string;
    good: string;
    fair: string;
    poor: string;
  };
}

export interface Theme {
  name: string;
  colors: ThemeColors;
}

// ─── Light Theme (Institutional — warm whites, forest greens, gold) ─────────

export const lightTheme: Theme = {
  name: "light",
  colors: {
    background: {
      primary: primitives.colors.cream,
      secondary: primitives.colors.white,
      tertiary: primitives.colors.parchment,
      elevated: primitives.colors.white,
      hover: primitives.colors.parchment,
      active: primitives.colors.sand,
      overlay: "rgba(0, 0, 0, 0.3)",
    },
    text: {
      primary: "#1A1A1A",
      secondary: "#4A4A4A",
      tertiary: "#767676",
      muted: "#9A9A9A",
      inverse: primitives.colors.white,
    },
    border: {
      primary: primitives.colors.sand,
      secondary: primitives.colors.parchment,
      focus: primitives.colors.forest,
    },
    accent: {
      blue: primitives.colors.blue,
      blueHover: "#0044CC",
      green: primitives.colors.forest,
      greenHover: primitives.colors.forestLight,
      yellow: primitives.colors.gold,
      yellowHover: "#B08A3E",
      red: primitives.colors.red500,
      redHover: primitives.colors.red600,
      purple: primitives.colors.purple500,
      purpleHover: primitives.colors.purple600,
      orange: primitives.colors.orange500,
      orangeHover: primitives.colors.orange600,
      cyan: primitives.colors.cyan,
      cyanHover: primitives.colors.cyanDark,
    },
    status: {
      success: primitives.colors.forest,
      warning: primitives.colors.gold,
      error: primitives.colors.red500,
      info: primitives.colors.blue,
    },
    score: {
      excellent: primitives.colors.forest,
      good: primitives.colors.blue,
      fair: primitives.colors.gold,
      poor: primitives.colors.red500,
    },
  },
};

// ─── Dark Theme (Tech — dark backgrounds, blue accents) ─────────────────────

export const darkTheme: Theme = {
  name: "dark",
  colors: {
    background: {
      primary: primitives.colors.gray950,
      secondary: primitives.colors.gray900,
      tertiary: primitives.colors.gray800,
      elevated: primitives.colors.gray850,
      hover: primitives.colors.gray700,
      active: primitives.colors.gray600,
      overlay: "rgba(0, 0, 0, 0.5)",
    },
    text: {
      primary: primitives.colors.gray100,
      secondary: primitives.colors.gray300,
      tertiary: primitives.colors.gray400,
      muted: primitives.colors.gray500,
      inverse: primitives.colors.gray950,
    },
    border: {
      primary: primitives.colors.gray700,
      secondary: primitives.colors.gray600,
      focus: primitives.colors.blue500,
    },
    accent: {
      blue: primitives.colors.blue500,
      blueHover: primitives.colors.blue600,
      green: primitives.colors.green500,
      greenHover: primitives.colors.green600,
      yellow: primitives.colors.yellow500,
      yellowHover: primitives.colors.yellow600,
      red: primitives.colors.red500,
      redHover: primitives.colors.red600,
      purple: primitives.colors.purple500,
      purpleHover: primitives.colors.purple600,
      orange: primitives.colors.orange500,
      orangeHover: primitives.colors.orange600,
      cyan: primitives.colors.cyan500,
      cyanHover: primitives.colors.cyan600,
    },
    status: {
      success: primitives.colors.green500,
      warning: primitives.colors.yellow500,
      error: primitives.colors.red500,
      info: primitives.colors.blue500,
    },
    score: {
      excellent: primitives.colors.green500,
      good: primitives.colors.blue500,
      fair: primitives.colors.yellow500,
      poor: primitives.colors.red500,
    },
  },
};

// ─── Unified Tokens Export ──────────────────────────────────────────────────

export const tokens = {
  primitives,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  typography: primitives.typography,
  spacing: primitives.spacing,
  borderRadius: primitives.borderRadius,
  shadows: primitives.shadows,
  transitions: primitives.transitions,
  zIndex: primitives.zIndex,
} as const;

export type TokenType = typeof tokens;
export type SpacingToken = keyof typeof primitives.spacing;
export type RadiusToken = keyof typeof primitives.borderRadius;
export type ShadowToken = keyof typeof primitives.shadows;
export type TransitionToken = keyof typeof primitives.transitions;
export type ZIndexToken = keyof typeof primitives.zIndex;
