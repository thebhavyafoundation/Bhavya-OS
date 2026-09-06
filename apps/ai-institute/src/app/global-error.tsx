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
            backgroundColor: "var(--color-bg-primary, #0a0f0d)",
            color: "var(--color-text-primary, #f5f1e6)",
            padding: "2rem",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "400px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "8px",
                backgroundColor:
                  "rgba(var(--color-status-error-rgb, 220, 38, 38), 0.1)",
                color: "var(--color-status-error, #dc2626)",
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
                color:
                  "rgba(var(--color-text-primary-rgb, 245, 241, 230), 0.6)",
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
                backgroundColor: "var(--color-bg-tertiary, #1a3a2a)",
                color: "var(--color-text-primary, #f5f1e6)",
                border:
                  "1px solid rgba(var(--color-text-primary-rgb, 245, 241, 230), 0.2)",
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
