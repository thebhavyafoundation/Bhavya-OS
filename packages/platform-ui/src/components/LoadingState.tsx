/**
 * @bhavya/platform-ui — LoadingState
 *
 * Reusable loading spinner and skeleton components.
 */

import React from "react";

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
}

export function LoadingSpinner({
  size = 24,
  color = "#3b82f6",
}: LoadingSpinnerProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          border: `3px solid #1e293b`,
          borderTop: `3px solid ${color}`,
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

interface LoadingSkeletonProps {
  lines?: number;
  height?: number;
}

export function LoadingSkeleton({
  lines = 3,
  height = 16,
}: LoadingSkeletonProps) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: 12, padding: 20 }}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          style={{
            height,
            background: "#1e293b",
            borderRadius: 6,
            width: `${80 - i * 15}%`,
          }}
        />
      ))}
    </div>
  );
}
