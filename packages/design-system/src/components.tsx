"use client";

import React, {
  ReactNode,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: "text-sm" },
    md: { icon: 32, text: "text-base" },
    lg: { icon: 48, text: "text-xl" },
  };

  const iconSizes = { sm: 6, md: 8, lg: 12 };

  return (
    <div className="flex items-center gap-2">
      <svg
        width={sizes[size].icon}
        height={sizes[size].icon}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="32" height="32" rx="8" fill="#1a3a2a" />
        <circle
          cx="16"
          cy="14"
          r={iconSizes[size]}
          stroke="#c9a227"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M16 10v8"
          stroke="#c9a227"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M12 14h8"
          stroke="#c9a227"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="16" cy="14" r="2" fill="#c9a227" opacity="0.4" />
      </svg>
      {showText && (
        <span
          className={`${sizes[size].text} font-medium tracking-tight text-[#f5f1e6]`}
        >
          {size === "sm" ? "Bhavya AI" : "Bhavya AI Institute"}
        </span>
      )}
    </div>
  );
}

interface BadgeProps {
  variant:
    | "beginner"
    | "intermediate"
    | "advanced"
    | "expert"
    | "success"
    | "warning"
    | "error";
  children: ReactNode;
}

const badgeStyles = {
  beginner: "bg-[#1a3a2a]/40 text-[#3d7a5a] border border-[#2d5a42]/30",
  intermediate: "bg-[#3a5a8a]/40 text-[#5a8abb] border border-[#3a5a8a]/30",
  advanced: "bg-[#c9a227]/15 text-[#d4b44a] border border-[#c9a227]/30",
  expert: "bg-[#8a3a3a]/15 text-[#c9a227] border border-[#c9a227]/40",
  success: "bg-[#2d5a42]/40 text-[#3d7a5a] border border-[#2d5a42]/30",
  warning: "bg-[#c9a227]/15 text-[#c9a227] border border-[#c9a227]/30",
  error: "bg-[#8a3a3a]/20 text-[#c95a5a] border border-[#8a3a3a]/30",
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeStyles[variant]}`}
    >
      {children}
    </span>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  color?: string;
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = false,
  color = "#c9a227",
}: ProgressBarProps) {
  const [mounted, setMounted] = useState(false);
  const percent = Math.min(Math.max((value / max) * 100, 0), 100);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-1 flex justify-between text-xs text-[#b8b0a0]">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#1a2420]">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: mounted ? `${percent}%` : "0%",
            background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          }}
        />
      </div>
    </div>
  );
}

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  image?: string;
}

const avatarColors = [
  "#1a3a2a",
  "#2d5a42",
  "#3d7a5a",
  "#8a7359",
  "#c9a227",
  "#3a5a8a",
  "#8a3a3a",
  "#5a4a6a",
];

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({ name, size = "md", image }: AvatarProps) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
  };

  const bgColor = useMemo(
    () => avatarColors[hashName(name) % avatarColors.length],
    [name],
  );

  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover ring-1 ring-[rgba(245,241,230,0.08)]`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} flex items-center justify-center rounded-full font-medium text-[#f5f1e6] ring-1 ring-[rgba(245,241,230,0.08)]`}
      style={{ backgroundColor: bgColor }}
    >
      {getInitials(name)}
    </div>
  );
}

interface TooltipProps {
  content: string;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const show = useCallback(() => setVisible(true), []);
  const hide = useCallback(() => setVisible(false), []);

  return (
    <div
      ref={ref}
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-md border border-[rgba(245,241,230,0.1)] bg-[#111916]/95 px-3 py-1.5 text-xs text-[#f5f1e6] shadow-lg backdrop-blur-sm animate-in fade-in-0 zoom-in-95">
          {content}
          <div className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#111916]/95" />
        </div>
      )}
    </div>
  );
}

interface DividerProps {
  label?: string;
  className?: string;
}

export function Divider({ label, className = "" }: DividerProps) {
  if (label) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <div className="h-px flex-1 bg-[rgba(245,241,230,0.08)]" />
        <span className="text-xs font-medium uppercase tracking-wider text-[#7a7268]">
          {label}
        </span>
        <div className="h-px flex-1 bg-[rgba(245,241,230,0.08)]" />
      </div>
    );
  }

  return (
    <hr
      className={`border-0 border-t border-[rgba(245,241,230,0.08)] ${className}`}
    />
  );
}

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-1 text-lg font-medium text-[#f5f1e6]">{title}</h3>
      <p className="mb-6 max-w-sm text-sm text-[#7a7268]">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="rounded-lg bg-[#1a3a2a] px-4 py-2 text-sm font-medium text-[#f5f1e6] transition-colors hover:bg-[#2d5a42] focus:outline-none focus:ring-2 focus:ring-[rgba(201,162,39,0.5)] focus:ring-offset-2 focus:ring-offset-[#0a0f0d]"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

interface SkeletonProps {
  lines?: number;
  className?: string;
}

export function Skeleton({ lines = 3, className = "" }: SkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-[#1a2420] animate-pulse"
          style={{
            width: i === lines - 1 ? "60%" : "100%",
            animationDelay: `${i * 150}ms`,
          }}
        />
      ))}
    </div>
  );
}
