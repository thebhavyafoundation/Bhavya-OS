/**
 * @bhavya/platform-ui — Badge
 *
 * Standardized badge component for status and labels.
 */

import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info" | "purple";
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: "bg-bg-hover text-text-secondary border-border-primary",
  success: "bg-accent-green/20 text-accent-green border-accent-green/30",
  warning: "bg-accent-yellow/20 text-accent-yellow border-accent-yellow/30",
  error: "bg-accent-red/20 text-accent-red border-accent-red/30",
  info: "bg-accent-blue/20 text-accent-blue border-accent-blue/30",
  purple: "bg-accent-purple/20 text-accent-purple border-accent-purple/30",
};

const dotColors: Record<string, string> = {
  default: "bg-text-tertiary",
  success: "bg-accent-green",
  warning: "bg-accent-yellow",
  error: "bg-accent-red",
  info: "bg-accent-blue",
  purple: "bg-accent-purple",
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
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`}
        />
      )}
      {children}
    </span>
  );
}
