/**
 * @bhavya/platform-ui — ErrorState
 *
 * Reusable error display component.
 */

import React from "react";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 48, color: "#ef4444", marginBottom: 16 }}>
        &#9888;
      </div>
      <h3
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: "#f8fafc",
          marginBottom: 8,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 14,
          color: "#94a3b8",
          maxWidth: 400,
          marginBottom: onRetry ? 24 : 0,
        }}
      >
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: "10px 20px",
            borderRadius: 8,
            border: "none",
            background: "#3b82f6",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
      )}
    </div>
  );
}
