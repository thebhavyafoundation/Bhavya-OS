/**
 * @bhavya/platform-ui — StatCard
 *
 * Reusable stat card for dashboards.
 */

import React from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; positive: boolean };
  color?: string;
}

export function StatCard({ label, value, icon, trend }: StatCardProps) {
  return (
    <div
      style={{
        background: "#1e293b",
        borderRadius: 12,
        padding: "20px 24px",
        border: "1px solid #334155",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: 13, color: "#94a3b8", fontWeight: 500 }}>
          {label}
        </span>
        {icon && <span style={{ color: "#64748b" }}>{icon}</span>}
      </div>
      <div
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "#f8fafc",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      {trend && (
        <div
          style={{
            fontSize: 12,
            color: trend.positive ? "#10b981" : "#ef4444",
          }}
        >
          {trend.positive ? "+" : ""}
          {trend.value}%
        </div>
      )}
    </div>
  );
}
