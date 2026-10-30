/**
 * @bhavya/platform-ui — Input
 *
 * Bhavya wrapper around a shadcn-style input primitive. All color, radius,
 * focus-ring and transition values resolve to canonical design tokens in
 * tokens.css — never inline literals.
 *
 * @module platform-ui/components/Input
 */

import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "bordered" | "ghost";
  inputSize?: "sm" | "md" | "lg";
}

const variantStyles: Record<string, string> = {
  default:
    "bg-bg-elevated border border-border-primary text-text-primary placeholder:text-text-muted focus:border-border-focus focus:ring-2 focus:ring-[var(--ring-focus)]",
  bordered:
    "bg-surface border border-border-primary text-text-primary placeholder:text-text-muted focus:border-border-focus focus:ring-2 focus:ring-[var(--ring-focus)]",
  ghost:
    "bg-transparent text-text-primary placeholder:text-text-muted focus:bg-surface-hover focus:border-transparent",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-base gap-2",
};

export function Input({
  variant = "default",
  inputSize = "md",
  className = "",
  ...props
}: InputProps) {
  return (
    <input
      className={`
        inline-flex items-center justify-center
        rounded-[var(--radius-sm)]
        transition-[border-color,background-color,box-shadow]
        duration-normal ease-out
        disabled:opacity-50 disabled:cursor-not-allowed
        read-only:opacity-60 read-only:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[inputSize]}
        ${className}
      `}
      {...props}
    />
  );
}
