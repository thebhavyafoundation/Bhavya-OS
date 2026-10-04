import { getStandards } from "@/data/curriculum/standards";

const BI_LABELS: Record<string, string> = {
  BI1: "BI1 — Perception",
  BI2: "BI2 — Representation & Reasoning",
  BI3: "BI3 — Learning",
  BI4: "BI4 — Natural Interaction",
  BI5: "BI5 — Societal Impact",
};

export function StandardsFooter({ moduleId }: { moduleId: string }) {
  const standards = getStandards(moduleId);

  return (
    <section
      style={{
        marginTop: "var(--space-8)",
        padding: "var(--space-6)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-border-primary)",
        background: "var(--color-bg-elevated)",
      }}
    >
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          color: "var(--color-brand-forest)",
          marginBottom: "var(--space-4)",
          fontSize: "var(--text-lg)",
        }}
      >
        Standards
      </h3>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--space-3)",
          marginBottom: "var(--space-4)",
        }}
      >
        {standards.bigIdeas.map((bi) => (
          <span
            key={bi}
            style={{
              padding: "var(--space-1) var(--space-3)",
              borderRadius: "var(--radius-full)",
              fontSize: "var(--text-xs)",
              fontWeight: 600,
              background: "rgba(208, 170, 0, 0.15)",
              color: "var(--color-brand-forest)",
              border: "1px solid var(--color-accent-gold)",
            }}
          >
            {BI_LABELS[bi] || bi}
          </span>
        ))}
      </div>
      {standards.csta && standards.csta.length > 0 && (
        <div style={{ marginBottom: "var(--space-4)" }}>
          <strong
            style={{
              fontSize: "var(--text-xs)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "var(--color-text-secondary)",
            }}
          >
            CSTA
          </strong>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "var(--space-2)",
              marginTop: "var(--space-2)",
            }}
          >
            {standards.csta.map((code) => (
              <span
                key={code}
                style={{
                  padding: "var(--space-1) var(--space-2)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "var(--text-xs)",
                  fontFamily: "var(--font-mono)",
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border-primary)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {code}
              </span>
            ))}
          </div>
        </div>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          fontSize: "var(--text-sm)",
        }}
      >
        <span style={{ fontWeight: 600, color: "var(--color-brand-forest)" }}>
          China: {standards.cnDim}
        </span>
        <span style={{ color: "var(--color-text-secondary)" }}>·</span>
        <span style={{ fontWeight: 600, color: "var(--color-brand-forest)" }}>
          学段 {standards.cnStage}
        </span>
      </div>
    </section>
  );
}
