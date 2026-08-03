/**
 * @bhavya/platform-ui — StatusBadge
 *
 * Reusable status badge with color-coded variants.
 */

import React from "react";

export type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "draft"
  | "published"
  | "active"
  | "inactive";

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: "sm" | "md" | "lg";
}

const VARIANT_COLORS: Record<BadgeVariant, { bg: string; text: string }> = {
  default: { bg: "#334155", text: "#e2e8f0" },
  success: { bg: "#065f46", text: "#a7f3d0" },
  warning: { bg: "#92400e", text: "#fde68a" },
  error: { bg: "#991b1b", text: "#fecaca" },
  info: { bg: "#1e40af", text: "#bfdbfe" },
  draft: { bg: "#334155", text: "#94a3b8" },
  published: { bg: "#065f46", text: "#a7f3d0" },
  active: { bg: "#1e40af", text: "#bfdbfe" },
  inactive: { bg: "#334155", text: "#94a3b8" },
};

const SIZE_STYLES: Record<string, React.CSSProperties> = {
  sm: { padding: "2px 8px", fontSize: 11 },
  md: { padding: "4px 12px", fontSize: 12 },
  lg: { padding: "6px 16px", fontSize: 14 },
};

export function StatusBadge({
  label,
  variant = "default",
  size = "md",
}: StatusBadgeProps) {
  const colors = VARIANT_COLORS[variant];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: 9999,
        fontWeight: 600,
        letterSpacing: "0.025em",
        textTransform: "uppercase",
        backgroundColor: colors.bg,
        color: colors.text,
        ...SIZE_STYLES[size],
      }}
    >
      {label}
    </span>
  );
}
