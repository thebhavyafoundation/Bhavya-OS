/**
 * @bhavya/platform-ui — EmptyState
 *
 * Reusable empty state component with icon, title, description, and action.
 */

import React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
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
      {icon && (
        <div style={{ fontSize: 48, color: "#475569", marginBottom: 16 }}>
          {icon}
        </div>
      )}
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
      {description && (
        <p
          style={{
            fontSize: 14,
            color: "#94a3b8",
            maxWidth: 400,
            marginBottom: action ? 24 : 0,
          }}
        >
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
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
          {action.label}
        </button>
      )}
    </div>
  );
}
