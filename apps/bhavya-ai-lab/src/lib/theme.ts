export const theme = {
  // Background layers (darkest to lightest)
  bg: {
    base: "#09090b", // zinc-950
    raised: "#18181b", // zinc-900
    overlay: "#27272a", // zinc-800
    surface: "#1c1c1f", // custom
    hover: "#3f3f46", // zinc-700
    active: "#52525b", // zinc-600
  },
  // Text
  text: {
    primary: "#fafafa", // zinc-50
    secondary: "#a1a1aa", // zinc-400
    tertiary: "#71717a", // zinc-500
    muted: "#52525b", // zinc-600
  },
  // Borders
  border: {
    subtle: "#27272a", // zinc-800
    default: "#3f3f46", // zinc-700
    strong: "#52525b", // zinc-600
  },
  // Accent
  accent: {
    green: "#22c55e",
    greenMuted: "#166534",
    blue: "#3b82f6",
    blueMuted: "#1e3a5f",
    amber: "#f59e0b",
    amberMuted: "#78350f",
    red: "#ef4444",
    redMuted: "#7f1d1d",
    purple: "#a855f7",
    purpleMuted: "#581c87",
  },
  // Typography
  font: {
    sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    mono: '"JetBrains Mono", "SF Mono", "Fira Code", monospace',
  },
  // Spacing
  sidebar: {
    width: 240,
    collapsedWidth: 56,
  },
  // Glassmorphism
  glass: "rgba(24, 24, 27, 0.8)",
  glassBorder: "rgba(63, 63, 70, 0.5)",
} as const;
