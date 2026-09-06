export default function Loading() {
  return (
    <div
      className="animate-pulse"
      style={{
        minHeight: "100vh",
        background: "var(--color-bg-primary)",
        padding: "var(--space-8) var(--space-6)",
      }}
    >
      <div
        className="max-w-6xl mx-auto"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-6)",
        }}
      >
        <div className="flex items-center justify-between">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)",
            }}
          >
            <div
              style={{
                height: 32,
                width: 256,
                borderRadius: "var(--radius-md)",
                background: "var(--color-surface-2)",
              }}
            />
            <div
              style={{
                height: 16,
                width: 192,
                borderRadius: "var(--radius-sm)",
                background: "var(--color-surface-2)",
              }}
            />
          </div>
          <div className="flex gap-3">
            <div
              style={{
                height: 36,
                width: 96,
                borderRadius: "var(--radius-md)",
                background: "var(--color-surface-2)",
              }}
            />
            <div
              style={{
                height: 36,
                width: 80,
                borderRadius: "var(--radius-md)",
                background: "var(--color-surface-2)",
              }}
            />
          </div>
        </div>
        <div
          style={{
            position: "relative",
            height: 500,
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--color-border-secondary)",
            background: "var(--color-surface)",
          }}
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 64,
                height: 64,
                borderRadius: "50%",
                border: "1px solid var(--color-border-primary)",
                background: "var(--color-surface-2)",
                left: `${15 + i * 14}%`,
                top: `${20 + (i % 2) * 30}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
