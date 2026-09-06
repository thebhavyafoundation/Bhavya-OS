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
        <div
          style={{
            height: 32,
            width: 192,
            borderRadius: "var(--radius-md)",
            background: "var(--color-surface-2)",
          }}
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "var(--space-4)",
          }}
        >
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              style={{
                height: 96,
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-border-secondary)",
                padding: "var(--space-4)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-2)",
                background: "var(--color-surface)",
              }}
            >
              <div
                style={{
                  height: 12,
                  width: 80,
                  borderRadius: "var(--radius-sm)",
                  background: "var(--color-surface-2)",
                }}
              />
              <div
                style={{
                  height: 28,
                  width: 48,
                  borderRadius: "var(--radius-sm)",
                  background: "var(--color-surface-2)",
                }}
              />
              <div
                style={{
                  height: 8,
                  width: "100%",
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-surface-2)",
                }}
              />
            </div>
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "var(--space-6)",
          }}
        >
          <div
            style={{
              height: 192,
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border-secondary)",
              background: "var(--color-surface)",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-4)",
            }}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                style={{
                  height: 80,
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-border-secondary)",
                  background: "var(--color-surface)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
