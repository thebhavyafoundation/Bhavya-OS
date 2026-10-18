import type { ReactNode } from "react";

/**
 * ErrorState — a failure the reader can understand and, usually, retry.
 *
 * Rules this component enforces so callers cannot get it wrong:
 * - `role="alert"` so the failure is announced immediately rather than
 *   politely queued behind other status updates.
 * - Says what failed, never blames the reader.
 * - No raw error message, stack trace, or digest is shown by default.
 *   Institutional surfaces must not leak internals to the public; pass a
 *   sanitised `detail` only when it is safe for the reader to see.
 * - Retry is a real focusable button, so it is reachable by keyboard and
 *   is announced as a button.
 */
export interface ErrorStateProps {
  /** What failed, in plain language. e.g. "We could not load this module." */
  title: string;
  /** What the reader can do next. */
  description: string;
  /** Retry handler. Omit the button entirely when retrying is pointless. */
  onRetry?: () => void;
  /** Button label. Defaults to "Try again". */
  retryLabel?: string;
  /** Sanitised extra detail. Never pass an unfiltered exception. */
  detail?: string;
  /** Replace the retry button entirely, e.g. with a sign-in link. */
  action?: ReactNode;
  className?: string;
}

export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel = "Try again",
  detail,
  action,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center gap-4 px-6 py-16 text-center ${className}`.trim()}
      style={{ minHeight: "16rem" }}
    >
      <p
        aria-hidden="true"
        className="font-display text-3xl leading-none text-text-muted"
      >
        !
      </p>
      <div className="max-w-prose space-y-2">
        <h3 className="font-display text-xl text-text-primary">{title}</h3>
        <p className="text-sm leading-relaxed text-text-secondary">
          {description}
        </p>
        {detail ? (
          <p className="font-mono text-xs text-text-muted">{detail}</p>
        ) : null}
      </div>
      {onRetry || action ? (
        <div className="pt-2">
          {action ??
            (onRetry ? (
              <button
                type="button"
                onClick={onRetry}
                className="btn btn-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)]"
              >
                {retryLabel}
              </button>
            ) : null)}
        </div>
      ) : null}
    </div>
  );
}
