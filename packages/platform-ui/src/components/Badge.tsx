/**
 * @bhavya/platform-ui — Badge
 *
 * Standardized badge component for status and labels.
 *
 * Variants are semantic roles, not colours. Each maps onto a measured
 * `--color-status-*` pair from `styles/tokens.css` — a foreground, a
 * background and a border that were checked for WCAG contrast in both light
 * and dark mode.
 *
 * This previously referenced `accent-red`, `accent-yellow`, `accent-blue` and
 * `accent-purple`, none of which exist in the generated theme, so four
 * variants rendered unstyled and indistinguishable. The roles were always
 * meant to exist; only the names were wrong.
 *
 * The class strings are written out in full because Tailwind discovers
 * candidates by scanning source text, and an interpolated class name is
 * invisible to it.
 */

import React from "react";

export type BadgeVariant =
  /* Roles. `neutral` is the no-status chip. */
  | "neutral"
  | "success"
  | "warning"
  | "caution"
  | "info"
  | "danger"
  /* Compatibility aliases for existing callers. Both are semantic role names
     rather than hues, so both stay within the token rules. */
  | "default"
  | "error";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  neutral:
    "bg-status-neutral-bg text-status-neutral-fg border-status-neutral-border",
  success:
    "bg-status-success-bg text-status-success-fg border-status-success-border",
  warning:
    "bg-status-warning-bg text-status-warning-fg border-status-warning-border",
  caution:
    "bg-status-caution-bg text-status-caution-fg border-status-caution-border",
  info: "bg-status-info-bg text-status-info-fg border-status-info-border",
  danger: "bg-status-error-bg text-status-error-fg border-status-error-border",
  default:
    "bg-status-neutral-bg text-status-neutral-fg border-status-neutral-border",
  error: "bg-status-error-bg text-status-error-fg border-status-error-border",
};

const dotColors: Record<BadgeVariant, string> = {
  neutral: "bg-status-neutral",
  success: "bg-status-success",
  warning: "bg-status-warning",
  caution: "bg-status-caution",
  info: "bg-status-info",
  danger: "bg-status-error",
  default: "bg-status-neutral",
  error: "bg-status-error",
};

const sizeStyles: Record<"sm" | "md", string> = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2 py-0.5 text-xs",
};

export function Badge({
  children,
  variant = "neutral",
  size = "md",
  dot = false,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-medium rounded border
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {dot && (
        <span
          aria-hidden="true"
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`}
        />
      )}
      {children}
    </span>
  );
}
