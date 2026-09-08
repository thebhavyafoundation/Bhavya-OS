/**
 * @bhavya/platform-ui — Button
 *
 * Standardized button component with variants.
 * Uses canonical design tokens from tokens.css.
 */

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantStyles: Record<string, string> = {
  primary:
    "bg-accent-green text-text-inverse hover:bg-accent-green-hover active:scale-[0.98]",
  secondary:
    "bg-bg-tertiary text-text-primary border border-border-primary hover:bg-bg-hover hover:border-border-secondary",
  ghost:
    "bg-transparent text-text-secondary hover:bg-bg-hover hover:text-text-primary",
  danger:
    "bg-status-error text-text-inverse hover:opacity-90 active:scale-[0.98]",
};

const sizeStyles: Record<string, string> = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-5 py-2.5 text-base gap-2",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center font-medium rounded-md
        transition-all duration-fast cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
