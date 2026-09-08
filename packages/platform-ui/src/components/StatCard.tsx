/**
 * @bhavya/platform-ui — StatCard
 *
 * Reusable stat card for dashboards.
 * Uses canonical design tokens from tokens.css.
 */

import React from "react";

type StatColor = "forest" | "gold" | "sage" | "earth";

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: { value: number; positive: boolean };
  color?: StatColor;
}

const colorClasses: Record<StatColor, { dot: string; text: string }> = {
  forest: { dot: "bg-accent-green", text: "text-accent-green" },
  gold: { dot: "bg-accent-gold", text: "text-accent-gold" },
  sage: { dot: "bg-brand-sage", text: "text-brand-sage" },
  earth: { dot: "bg-accent-earth", text: "text-accent-earth" },
};

export function StatCard({
  label,
  value,
  icon,
  trend,
  color = "forest",
}: StatCardProps) {
  const colors = colorClasses[color];

  return (
    <div className="bg-bg-secondary border border-border-primary rounded-lg p-5 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${colors.text}`}>{label}</span>
        {icon && <span className="text-text-muted">{icon}</span>}
      </div>
      <div className={`text-3xl font-bold ${colors.text} leading-none`}>
        {value}
      </div>
      {trend && (
        <div
          className={`text-xs ${trend.positive ? "text-status-success" : "text-status-error"}`}
        >
          {trend.positive ? "+" : ""}
          {trend.value}%
        </div>
      )}
    </div>
  );
}
