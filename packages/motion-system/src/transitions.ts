export const transitions = {
  fast: { duration: 0.15 },
  normal: { duration: 0.3 },
  slow: { duration: 0.6 },
  spring: { type: "spring" as const, stiffness: 300, damping: 30 },
  bouncy: { type: "spring" as const, stiffness: 500, damping: 15 },
} as const;
