/**
 * Bhavya Video Engine — Code Scene Component
 *
 * Renders a code snippet with syntax highlighting and annotations.
 * Used for programming concepts in educational videos.
 *
 * @component
 */

import type { CodeScene as CodeSceneType } from "../types";

export interface CodeSceneProps extends CodeSceneType {
  theme?: {
    colors: { primary: string; secondary: string; accent: string; background: string };
    typography: { heading: string; body: string; code: string };
  };
}

export function CodeScene({
  title,
  language,
  code,
  highlights,
  annotations,
  accentColor = "#c9a227",
  theme,
}: CodeSceneProps) {
  const colors = theme?.colors ?? {
    primary: "#1a3a2a",
    secondary: "#c9a227",
    accent: "#8a7359",
    background: "#f5f1e6",
  };
  const fonts = theme?.typography ?? {
    heading: "Playfair Display, serif",
    body: "Inter, sans-serif",
    code: "JetBrains Mono, monospace",
  };

  const lines = code.split("\n");

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: colors.background,
        padding: "60px 80px",
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
        {language.toUpperCase()}
      </div>

      <h2
        style={{
          fontSize: "36px",
          fontWeight: 700,
          color: colors.primary,
          margin: "0 0 32px 0",
          fontFamily: fonts.heading,
        }}
      >
        {title}
      </h2>

      <div style={{ display: "flex", gap: "32px", flex: 1 }}>
        {/* Code block */}
        <div
          style={{
            flex: 2,
            background: "#1e293b",
            borderRadius: "16px",
            padding: "32px",
            overflow: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "20px",
            }}
          >
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ef4444" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#eab308" }} />
            <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ marginLeft: "12px", color: "#94a3b8", fontSize: "13px" }}>{language}</span>
          </div>

          <pre
            style={{
              margin: 0,
              fontFamily: fonts.code,
              fontSize: "16px",
              lineHeight: 1.8,
              color: "#e2e8f0",
              whiteSpace: "pre-wrap",
            }}
          >
            {lines.map((line, i) => {
              const lineNum = i + 1;
              const isHighlighted = highlights?.includes(lineNum);
              return (
                <div
                  key={i}
                  style={{
                    background: isHighlighted ? accentColor + "25" : "transparent",
                    margin: "0 -32px",
                    padding: "0 32px",
                    borderLeft: isHighlighted ? `3px solid ${accentColor}` : "3px solid transparent",
                  }}
                >
                  <span style={{ color: "#64748b", marginRight: "20px", userSelect: "none" }}>
                    {String(lineNum).padStart(2, " ")}
                  </span>
                  {line}
                </div>
              );
            })}
          </pre>
        </div>

        {/* Annotations */}
        {annotations && annotations.length > 0 && (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              justifyContent: "center",
            }}
          >
            {annotations.map((ann, i) => (
              <div
                key={i}
                style={{
                  padding: "16px 20px",
                  background: colors.primary + "08",
                  borderRadius: "12px",
                  borderLeft: `3px solid ${accentColor}`,
                }}
              >
                <div
                  style={{
                    fontSize: "13px",
                    color: accentColor,
                    fontWeight: 600,
                    marginBottom: "6px",
                  }}
                >
                  Line {ann.line}
                </div>
                <div
                  style={{
                    fontSize: "15px",
                    color: colors.primary + "cc",
                    lineHeight: 1.5,
                  }}
                >
                  {ann.text}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
