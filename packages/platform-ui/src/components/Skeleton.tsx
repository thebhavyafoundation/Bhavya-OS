/**
 * @bhavya/platform-ui — Skeleton
 *
 * Standardized skeleton loading component.
 */

import React from "react";

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  rounded?: "sm" | "md" | "lg" | "full";
}

const roundedStyles: Record<string, string> = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  full: "rounded-full",
};

export function Skeleton({
  className = "",
  width,
  height,
  rounded = "md",
}: SkeletonProps) {
  return (
    <div
      className={`
        animate-shimmer
        ${roundedStyles[rounded]}
        ${className}
      `}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}
    />
  );
}

// === Presed Skeleton Patterns ===

export function CardSkeleton() {
  return (
    <div className="bg-bg-secondary border border-border-primary rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Skeleton width="60%" height={20} className="mb-2" />
          <Skeleton width="80%" height={14} />
        </div>
        <Skeleton width={48} height={48} rounded="full" />
      </div>
      <Skeleton width="100%" height={12} className="mb-2" />
      <Skeleton width="40%" height={12} />
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="bg-bg-secondary border border-border-primary rounded-lg overflow-hidden">
      <div className="border-b border-border-primary p-3">
        <div className="flex gap-4">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} width="100%" height={14} />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="border-b border-border-primary last:border-0 p-3">
          <div className="flex gap-4">
            {Array.from({ length: cols }).map((_, j) => (
              <Skeleton key={j} width="100%" height={14} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function TabSkeleton() {
  return (
    <div className="flex gap-1 border-b border-border-primary mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} width={80} height={36} rounded="md" />
      ))}
    </div>
  );
}
