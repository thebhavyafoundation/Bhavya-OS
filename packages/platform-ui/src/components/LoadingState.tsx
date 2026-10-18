/**
 * @bhavya/platform-ui — LoadingState
 *
 * Reserved space while data is in flight.
 *
 * Contract this component enforces so callers cannot get it wrong:
 * - Reserves real dimensions, so arriving content does not shift the layout.
 * - The shimmer is suppressed under prefers-reduced-motion; the skeleton
 *   remains as a static placeholder. A pulsing block is motion, and motion
 *   the reader did not ask for is a failure, not polish.
 * - The placeholder is aria-hidden and paired with a visible-to-assistive-
 *   technology status label, so a sighted reader gets a skeleton and a
 *   non-sighted reader gets an announcement rather than a meaningless
 *   empty region.
 * - Token-only. No literal colours; renders correctly in both themes.
 */

import React from "react";

export interface LoadingSkeletonProps {
  /** Number of placeholder rows to reserve. */
  lines?: number;
  /** Row height in pixels. */
  height?: number;
  /** Reserve a media block above the rows. */
  withMedia?: boolean;
  /** Announced to assistive technology while the skeleton is visible. */
  label?: string;
  className?: string;
}

export function LoadingSkeleton({
  lines = 3,
  height = 16,
  withMedia = false,
  label = "Loading",
  className = "",
}: LoadingSkeletonProps) {
  return (
    <div
      style={{ minHeight: withMedia ? "18rem" : "12rem" }}
      className={`flex flex-col gap-4 ${className}`.trim()}
    >
      <span className="sr-only" role="status" aria-live="polite">
        {label}
      </span>
      <div aria-hidden="true" className="flex flex-col gap-4">
        {withMedia ? (
          <span
            className="block w-full rounded-lg bg-bg-tertiary motion-safe:animate-pulse"
            style={{ height: 160 }}
          />
        ) : null}
        {Array.from({ length: lines }, (_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <span
              className="block rounded bg-bg-tertiary motion-safe:animate-pulse"
              style={{ height }}
            />
            {/* Ragged right edge: reads as content, not as a progress bar. */}
            <span
              className="block rounded bg-bg-tertiary motion-safe:animate-pulse"
              style={{
                height: Math.max(height - 4, 8),
                width: `${80 - index * 15}%`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export interface LoadingSpinnerProps {
  size?: number;
  /** Any CSS colour value. Defaults to the brand forest token. */
  color?: string;
  /** Announced to assistive technology. */
  label?: string;
}

export function LoadingSpinner({
  size = 24,
  color = "var(--color-brand-forest)",
  label = "Loading",
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{ padding: 40, display: "flex", justifyContent: "center" }}
    >
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className="motion-safe:animate-spin"
        style={{
          display: "inline-block",
          width: size,
          height: size,
          border: `3px solid var(--color-border-primary)`,
          borderTopColor: color,
          borderRadius: "50%",
        }}
      />
    </div>
  );
}
