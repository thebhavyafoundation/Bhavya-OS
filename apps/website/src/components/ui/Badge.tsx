import { type ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md";
  icon?: ReactNode;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "sm",
  icon,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`badge badge-${variant} badge-${size} ${className}`.trim()}
    >
      {icon && <span className="badge-icon">{icon}</span>}
      {children}
    </span>
  );
}
