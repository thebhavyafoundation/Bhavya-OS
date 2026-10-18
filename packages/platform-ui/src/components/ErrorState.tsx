/**
 * @bhavya/platform-ui — ErrorState
 *
 * A failure the reader can understand and, usually, retry.
 *
 * Contract this component enforces so callers cannot get it wrong:
 * - `role="alert"`, so the failure is announced immediately rather than
 *   queued politely behind other status updates.
 * - Says what failed. Never blames the reader.
 * - Shows no exception message, stack trace, or digest by default.
 *   Institutional surfaces must not leak internals to the public; pass a
 *   sanitised `detail` only when it is safe for the reader to see.
 * - Retry is a real focusable button with a visible focus ring.
 * - Token-only. No literal colours; renders correctly in both themes.
 */

import type { ReactNode } from "react";

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  /** Sanitised extra detail. Never pass an unfiltered exception. */
  detail?: string;
  /** Replaces the retry button, e.g. with a sign-in link. */
  action?: ReactNode;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  retryLabel = "Try again",
  detail,
  action,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      style={{ minHeight: "16rem" }}
      className={`flex flex-col items-center justify-center gap-4 px-6 py-16 text-center ${className}`.trim()}
    >
      <p aria-hidden="true" className="font-display text-3xl text-text-muted">
        !
      </p>

      <div className="flex max-w-prose flex-col gap-2">
        <h3 className="font-display text-xl text-text-primary">{title}</h3>
        <p className="text-sm leading-relaxed text-text-secondary">{message}</p>
        {detail ? (
          <p className="font-mono text-xs text-text-muted">{detail}</p>
        ) : null}
      </div>

      {action ??
        (onRetry ? (
          <div className="pt-2">
            <button
              type="button"
              onClick={onRetry}
              className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-border-focus)] rounded-md px-4 py-2 text-sm font-medium"
              style={{
                background: "var(--color-brand-forest)",
                color: "var(--color-brand-ivory)",
              }}
            >
              {retryLabel}
            </button>
          </div>
        ) : null)}
    </div>
  );
}
