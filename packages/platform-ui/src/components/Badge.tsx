/**
 * @bhavya/platform-ui — Badge
 *
 * Standardized badge component for status and labels.
 *
 * Variants map only onto accents that actually exist in the brand palette:
 * green (forest), gold, and earth. The previous `error`, `warning`, `info` and
 * `purple` variants referenced `accent-red`, `accent-yellow`, `accent-blue` and
 * `accent-purple`, none of which are defined in the generated theme — so all
 * four rendered with no styling at all and no visible difference from each
 * other. `warning` now uses gold, which is already the platform's attention
 * colour, and `info` uses earth.
 *
 * There is deliberately no `error` variant. The brand palette has no danger
 * hue, and adding one is a constitutional design change that needs human
 * authority rather than a component-level guess. It should return once a danger
 * token has been approved.
 */

import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "info";
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: "bg-bg-hover text-text-secondary border-border-primary",
  success: "bg-accent-green/20 text-accent-green border-accent-green/30",
  warning: "bg-accent-gold/20 text-text-primary border-accent-gold/50",
  info: "bg-accent-earth/20 text-text-primary border-accent-earth/50",
};

const dotColors: Record<string, string> = {
  default: "bg-text-tertiary",
  success: "bg-accent-green",
  warning: "bg-accent-gold",
  info: "bg-accent-earth",
};

const sizeStyles: Record<string, string> = {
  sm: "px-1.5 py-0.5 text-[10px]",
  md: "px-2 py-0.5 text-xs",
};

export function Badge({
  children,
  variant = "default",
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
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />
      )}
      {children}
    </span>
  );
}
