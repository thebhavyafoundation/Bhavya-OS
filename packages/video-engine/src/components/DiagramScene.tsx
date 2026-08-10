/**
 * Bhavya Video Engine — Diagram Scene Component
 *
 * Renders flowcharts, cycles, hierarchies, and networks.
 * Used for visual explanations in educational videos.
 *
 * @component
 */

import type { DiagramScene as DiagramSceneType } from "../types";

export interface DiagramSceneProps extends DiagramSceneType {
  theme?: {
    colors: { primary: string; secondary: string; accent: string; background: string; surface: string };
    typography: { heading: string; body: string };
  };
}

export function DiagramScene({
  title,
  diagramType,
  nodes,
  edges,
  accentColor = "#c9a227",
  theme,
}: DiagramSceneProps) {
  const colors = theme?.colors ?? {
    primary: "#1a3a2a",
    secondary: "#c9a227",
    accent: "#8a7359",
    background: "#f5f1e6",
    surface: "#ffffff",
  };
  const fonts = theme?.typography ?? {
    heading: "Playfair Display, serif",
    body: "Inter, sans-serif",
  };

  // Simple grid layout for nodes
  const cols = Math.ceil(Math.sqrt(nodes.length));
  const nodeWidth = 160;
  const nodeHeight = 80;

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
        {diagramType}
      </div>

      <h2
        style={{
          fontSize: "42px",
          fontWeight: 700,
          color: colors.primary,
          margin: "0 0 40px 0",
          fontFamily: fonts.heading,
        }}
      >
        {title}
      </h2>

      {/* Diagram container */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Edges (simple lines) */}
        <svg
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          {edges.map((edge, i) => {
            const fromNode = nodes.findIndex((n) => n.id === edge.from);
            const toNode = nodes.findIndex((n) => n.id === edge.to);
            if (fromNode === -1 || toNode === -1) return null;

            const fromCol = fromNode % cols;
            const fromRow = Math.floor(fromNode / cols);
            const toCol = toNode % cols;
            const toRow = Math.floor(toNode / cols);

            const x1 = 200 + fromCol * (nodeWidth + 60) + nodeWidth / 2;
            const y1 = 80 + fromRow * (nodeHeight + 40) + nodeHeight / 2;
            const x2 = 200 + toCol * (nodeWidth + 60) + nodeWidth / 2;
            const y2 = 80 + toRow * (nodeHeight + 40) + nodeHeight / 2;

            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={colors.primary + "30"}
                strokeWidth={2}
                strokeDasharray={edge.type === "dashed" ? "8 4" : undefined}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "40px",
            justifyContent: "center",
            maxWidth: `${cols * (nodeWidth + 60)}px`,
          }}
        >
          {nodes.map((node, i) => (
            <div
              key={node.id}
              style={{
                width: `${nodeWidth}px`,
                height: `${nodeHeight}px`,
                background: node.color ?? colors.surface,
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                border: `2px solid ${colors.primary}15`,
              }}
            >
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  color: colors.primary,
                  textAlign: "center",
                }}
              >
                {node.label}
              </div>
              {node.description && (
                <div
                  style={{
                    fontSize: "11px",
                    color: colors.primary + "88",
                    textAlign: "center",
                    marginTop: "4px",
                  }}
                >
                  {node.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
