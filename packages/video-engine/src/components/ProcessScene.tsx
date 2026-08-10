/**
 * Bhavya Video Engine — Process Scene Component
 *
 * Renders a step-by-step process with numbered steps.
 * Used for procedural content in educational videos.
 *
 * @component
 */

import type { ProcessScene as ProcessSceneType } from "../types";

export interface ProcessSceneProps extends ProcessSceneType {
  theme?: {
    colors: { primary: string; secondary: string; accent: string; background: string };
    typography: { heading: string; body: string };
  };
}

export function ProcessScene({
  title,
  steps,
  layout = "linear",
  accentColor = "#c9a227",
  theme,
}: ProcessSceneProps) {
  const colors = theme?.colors ?? {
    primary: "#1a3a2a",
    secondary: "#c9a227",
    accent: "#8a7359",
    background: "#f5f1e6",
  };
  const fonts = theme?.typography ?? {
    heading: "Playfair Display, serif",
    body: "Inter, sans-serif",
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: colors.background,
        padding: "80px",
        fontFamily: fonts.body,
      }}
    >
      <div
        style={{
          fontSize: "14px",
          color: accentColor,
          letterSpacing: "2px",
          textTransform: "uppercase",
          marginBottom: "12px",
          fontWeight: 600,
        }}
      >
        Process
      </div>

      <h2
        style={{
          fontSize: "48px",
          fontWeight: 700,
          color: colors.primary,
          margin: "0 0 48px 0",
          fontFamily: fonts.heading,
        }}
      >
        {title}
      </h2>

      <div
        style={{
          display: "flex",
          flexDirection: layout === "grid" ? "row" : "column",
          flexWrap: layout === "grid" ? "wrap" : undefined,
          gap: layout === "grid" ? "24px" : "20px",
        }}
      >
        {steps.map((step, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "20px",
              padding: layout === "grid" ? "24px" : "0",
              background: layout === "grid" ? colors.primary + "06" : "transparent",
              borderRadius: layout === "grid" ? "16px" : "0",
              flex: layout === "grid" ? "1 1 300px" : undefined,
            }}
          >
            {/* Step number */}
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: i === 0 ? accentColor : colors.primary + "15",
                color: i === 0 ? "#fff" : colors.primary,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {step.number}
            </div>

            {/* Step content */}
            <div>
              <h3
                style={{
                  fontSize: "22px",
                  fontWeight: 600,
                  color: colors.primary,
                  margin: "0 0 8px 0",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: "17px",
                  color: colors.primary + "aa",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {step.description}
              </p>
            </div>

            {/* Connector */}
            {i < steps.length - 1 && layout === "linear" && (
              <div
                style={{
                  position: "absolute",
                  left: "103px",
                  marginTop: "48px",
                  width: "2px",
                  height: "20px",
                  background: colors.primary + "20",
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
