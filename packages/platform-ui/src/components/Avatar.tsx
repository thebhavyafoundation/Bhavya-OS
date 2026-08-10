/**
 * @bhavya/platform-ui — Avatar
 *
 * Standardized avatar component for user/org representation.
 */

import React from "react";

interface AvatarProps {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeStyles: Record<string, string> = {
  sm: "w-6 h-6 text-[10px]",
  md: "w-8 h-8 text-xs",
  lg: "w-10 h-10 text-sm",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getColorFromName(name: string): string {
  const colors = [
    "bg-accent-blue",
    "bg-accent-green",
    "bg-accent-purple",
    "bg-accent-orange",
    "bg-accent-cyan",
    "bg-accent-yellow",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

export function Avatar({
  name,
  src,
  size = "md",
  className = "",
}: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`
          rounded-full object-cover
          ${sizeStyles[size]}
          ${className}
        `}
      />
    );
  }

  return (
    <div
      className={`
        rounded-full flex items-center justify-center font-medium text-white
        ${getColorFromName(name)}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {getInitials(name)}
    </div>
  );
}
