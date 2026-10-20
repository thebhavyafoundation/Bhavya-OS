"use client";

import { ErrorState } from "@bhavya/platform-ui";

/**
 * Client-only demo: the retry handler is an event handler, so it must be
 * defined inside a Client Component rather than passed as a prop from this
 * server page.
 */
export function ErrorStateRetryDemo() {
  return (
    <ErrorState
      title="We could not load this module"
      message="The curriculum registry did not respond. Nothing has been lost."
      retryLabel="Try again"
      onRetry={() => undefined}
    />
  );
}
