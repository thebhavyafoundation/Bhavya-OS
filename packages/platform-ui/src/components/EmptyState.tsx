/**
 * @bhavya/platform-ui — EmptyState
 *
 * Reusable empty state component with icon, title, description, and action.
 * Uses design tokens for consistent theming.
 */

import React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        py-16 px-5 text-center
        animate-fade-in
        ${className}
      `}
    >
      {icon && (
        <div className="text-text-muted mb-4 opacity-50">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-text-primary mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-text-secondary max-w-sm mb-6">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="
            px-4 py-2 bg-accent-blue text-white text-sm font-medium
            rounded-md hover:bg-accent-blue-hover
            transition-colors duration-fast
            cursor-pointer
          "
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
