"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "var(--color-bg-primary)",
            color: "var(--color-text-primary)",
            padding: "2rem",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "400px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "8px",
                backgroundColor: "var(--color-status-error-bg)",
                color: "var(--color-status-error)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
                margin: "0 auto 16px",
              }}
            >
              !
            </div>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Something went wrong
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "var(--color-text-secondary)",
                marginBottom: "24px",
              }}
            >
              An unexpected error occurred. Please try again.
            </p>
            <button
              onClick={reset}
              style={{
                padding: "10px 24px",
                fontSize: "14px",
                fontWeight: "600",
                backgroundColor: "var(--color-bg-tertiary)",
                color: "var(--color-text-primary)",
                border: "1px solid var(--color-border-primary)",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
