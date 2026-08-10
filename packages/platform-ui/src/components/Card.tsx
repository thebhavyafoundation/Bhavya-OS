/**
 * @bhavya/platform-ui — Card
 *
 * Standardized card component for content containers.
 */

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  onClick?: () => void;
}

const paddingStyles: Record<string, string> = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
};

export function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
  onClick,
}: CardProps) {
  return (
    <div
      className={`
        bg-bg-secondary border border-border-primary rounded-lg
        ${hover ? "hover:border-border-secondary hover:bg-bg-tertiary transition-colors" : ""}
        ${onClick ? "cursor-pointer" : ""}
        ${paddingStyles[padding]}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
