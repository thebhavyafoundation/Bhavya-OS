import type { ReactNode } from "react";

/**
 * EmptyState — the honest "there is nothing here yet" surface.
 *
 * Rules this component enforces so callers cannot get it wrong:
 * - Always states what is missing and what the reader can do next.
 * - Never implies data exists, is loading, or failed.
 * - `role="status"` + polite live region so screen readers announce a
 *   filter change that produced no results.
 * - Explicit min-height keeps layout stable when a list swaps to empty,
 *   which is what causes the jumpy-filter UX this replaces.
 */
export interface EmptyStateProps {
  /** Short label for the condition, e.g. "No missions yet". */
  title: string;
  /** One or two sentences: what is missing and how to change that. */
  description: string;
  /** Optional next action. Rendered as a real <button> or <a>. */
  action?: ReactNode;
  /** Optional short qualifier, e.g. a count or active filter name. */
  meta?: string;
  /** Decorative mark. Purely typographic — never a decorative image. */
  glyph?: string;
  className?: string;
}

export function EmptyState({
  title,
  description,
  action,
  meta,
  glyph = "—",
  className = "",
}: EmptyStateProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex flex-col items-center justify-center gap-4 px-6 py-16 text-center ${className}`.trim()}
      style={{ minHeight: "16rem" }}
    >
      <p
        aria-hidden="true"
        className="font-display text-4xl leading-none text-text-muted"
      >
        {glyph}
      </p>
      <div className="max-w-prose space-y-2">
        <h3 className="font-display text-xl text-text-primary">{title}</h3>
        <p className="text-sm leading-relaxed text-text-secondary">
          {description}
        </p>
        {meta ? <p className="text-xs text-text-muted">{meta}</p> : null}
      </div>
      {action ? <div className="pt-2">{action}</div> : null}
    </div>
  );
}
