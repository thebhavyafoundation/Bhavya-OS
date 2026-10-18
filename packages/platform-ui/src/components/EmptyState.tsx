/**
 * @bhavya/platform-ui — EmptyState
 *
 * The honest "there is nothing here yet" surface.
 *
 * Contract this component enforces so callers cannot get it wrong:
 * - States what is missing and what the reader can do next.
 * - Never implies data exists, is loading, or failed.
 * - `role="status"` with a polite live region, so a filter change that
 *   produced no results is announced rather than silently replacing content.
 * - Reserves a minimum height, because the jumpy-filter experience comes
 *   from a list swapping to empty and pushing the page around.
 * - Token-only. No literal colours; this component renders correctly in both
 *   the light and dark themes.
 */

import type { ReactNode } from "react";

export interface EmptyStateProps {
  /** Optional mark. Keep it typographic or iconographic, never decorative art. */
  icon?: ReactNode;
  title: string;
  description?: string;
  /** Optional qualifier: a count, or the filter that produced nothing. */
  meta?: string;
  /**
   * The next action. Supplied as an element so the caller can choose a
   * button, a link, or nothing, rather than being forced into an onClick.
   */
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  meta,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      style={{ minHeight: "16rem" }}
      className={`flex flex-col items-center justify-center gap-4 px-6 py-16 text-center ${className}`.trim()}
    >
      {icon ? (
        <div aria-hidden="true" className="text-text-muted opacity-60">
          {icon}
        </div>
      ) : null}

      <div className="flex max-w-prose flex-col gap-2">
        <h3 className="font-display text-xl text-text-primary">{title}</h3>
        {description ? (
          <p className="text-sm leading-relaxed text-text-secondary">
            {description}
          </p>
        ) : null}
        {meta ? <p className="text-xs text-text-muted">{meta}</p> : null}
      </div>

      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
