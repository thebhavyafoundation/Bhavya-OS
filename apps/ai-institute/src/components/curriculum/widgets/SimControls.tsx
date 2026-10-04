"use client";

import { useState } from "react";

interface SimControlsProps {
  preset: "perceptron-step" | "knn-1d" | "overfit-poly" | "bar-perception";
  prompt: string;
}

const PERCEPTRON_POINTS = [
  { x: 120, y: 80, label: 1 },
  { x: 200, y: 80, label: 1 },
  { x: 300, y: 80, label: 1 },
  { x: 120, y: 200, label: -1 },
  { x: 200, y: 200, label: -1 },
  { x: 300, y: 200, label: -1 },
];

const KNN_POINTS = [
  { x: 100, label: 1 },
  { x: 150, label: 1 },
  { x: 220, label: -1 },
  { x: 280, label: -1 },
  { x: 350, label: -1 },
  { x: 420, label: 1 },
  { x: 480, label: 1 },
  { x: 550, label: -1 },
];

const _OVERFIT_DATA = [
  { degree: 1, points: [] },
  { degree: 2, points: [] },
  { degree: 3, points: [] },
  { degree: 4, points: [] },
  { degree: 5, points: [] },
  { degree: 6, points: [] },
];

const BAR_COLORS = [
  "var(--color-viz-1)",
  "var(--color-viz-2)",
  "var(--color-viz-3)",
  "var(--color-viz-4)",
  "var(--color-viz-5)",
  "var(--color-viz-6)",
];

export function SimControls({ preset, prompt }: SimControlsProps) {
  const [threshold, setThreshold] = useState(0);
  const [k, setK] = useState(1);
  const [degree, setDegree] = useState(1);
  const [bars, setBars] = useState([0, 0, 0, 0, 0, 0]);

  if (preset === "perceptron-step") {
    const correct = PERCEPTRON_POINTS.filter((p) =>
      (p.x - 210) * threshold > 0 ? p.label === 1 : p.label === -1,
    ).length;
    return (
      <div
        style={{
          padding: "var(--space-4)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border-primary)",
          background: "var(--color-bg-primary)",
        }}
      >
        <p
          style={{
            marginBottom: "var(--space-4)",
            color: "var(--color-text-secondary)",
          }}
        >
          {prompt}
        </p>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "300px",
            borderRadius: "var(--radius-lg)",
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border-primary)",
          }}
        >
          {PERCEPTRON_POINTS.map((p) => {
            const predicted = (p.x - 210) * threshold > 0 ? 1 : -1;
            const isCorrect = predicted === p.label;
            return (
              <div
                key={p.x + "," + p.y}
                style={{
                  position: "absolute",
                  left: `${p.x}px`,
                  top: `${p.y}px`,
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: isCorrect
                    ? "var(--color-status-success)"
                    : "var(--color-status-error)",
                  border: "2px solid var(--color-bg-primary)",
                  transform: "translate(-50%, -50%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {p.label === 1 ? "+" : "−"}
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              left: `${210 + threshold * 2}px`,
              top: "40px",
              width: "2px",
              height: "220px",
              background: "var(--color-accent-gold)",
              borderRadius: "1px",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: `${210 + threshold * 2 - 10}px`,
              top: "10px",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              background: "var(--color-accent-gold)",
              border: "2px solid var(--color-bg-primary)",
              cursor: "ew-resize",
            }}
            onMouseDown={(e) => {
              const startX = e.clientX;
              const startThreshold = threshold;
              const move = (me: MouseEvent) => {
                const delta = (me.clientX - startX) / 2;
                setThreshold(
                  Math.max(-100, Math.min(100, startThreshold + delta)),
                );
              };
              const up = () => {
                window.removeEventListener("mousemove", move);
                window.removeEventListener("mouseup", up);
              };
              window.addEventListener("mousemove", move);
              window.addEventListener("mouseup", up);
            }}
          />
        </div>
        <div style={{ marginTop: "var(--space-4)" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              color: "var(--color-text-primary)",
            }}
          >
            <span style={{ minWidth: "100px" }}>Threshold: {threshold}</span>
            <input
              type="range"
              min="-100"
              max="100"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span>Correct: {correct}/6</span>
          </label>
        </div>
      </div>
    );
  }

  if (preset === "knn-1d") {
    const predictions = KNN_POINTS.map((p) => {
      const distances = KNN_POINTS.filter((q) => q !== p).map((q) => ({
        dist: Math.abs(q.x - p.x),
        label: q.label,
      }));
      distances.sort((a, b) => a.dist - b.dist);
      const neighbors = distances.slice(0, k);
      const votes = neighbors.reduce(
        (acc, n) => {
          acc[n.label] = (acc[n.label] || 0) + 1;
          return acc;
        },
        {} as Record<number, number>,
      );
      const predicted = votes[1] >= votes[-1] ? 1 : -1;
      return { ...p, predicted, isCorrect: predicted === p.label };
    });
    const correct = predictions.filter((p) => p.isCorrect).length;
    return (
      <div
        style={{
          padding: "var(--space-4)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border-primary)",
          background: "var(--color-bg-primary)",
        }}
      >
        <p
          style={{
            marginBottom: "var(--space-4)",
            color: "var(--color-text-secondary)",
          }}
        >
          {prompt}
        </p>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "120px",
            borderRadius: "var(--radius-lg)",
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border-primary)",
          }}
        >
          {predictions.map((p) => (
            <div
              key={p.x}
              style={{
                position: "absolute",
                left: `${p.x}px`,
                top: "50px",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background:
                  p.predicted === 1
                    ? "var(--color-viz-1)"
                    : "var(--color-viz-2)",
                border: p.isCorrect
                  ? "2px solid var(--color-status-success)"
                  : "2px solid var(--color-status-error)",
                transform: "translate(-50%, -50%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "10px",
                fontWeight: "bold",
              }}
            >
              {p.label === 1 ? "+" : "−"}
            </div>
          ))}
        </div>
        <div style={{ marginTop: "var(--space-4)" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              color: "var(--color-text-primary)",
            }}
          >
            <span style={{ minWidth: "60px" }}>k = {k}</span>
            <input
              type="range"
              min="1"
              max="5"
              value={k}
              onChange={(e) => setK(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span>Correct: {correct}/8</span>
          </label>
        </div>
      </div>
    );
  }

  if (preset === "overfit-poly") {
    const trueFn = (x: number) => Math.sin(x / 100) * 50 + 150;
    const xs = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500];
    const noisyPoints = xs.map((x) => ({
      x,
      y: trueFn(x) + (Math.random() - 0.5) * 40,
    }));
    const coeffs = Array.from(
      { length: degree + 1 },
      () => (Math.random() - 0.5) * 10,
    );
    const fitY = (x: number) =>
      coeffs.reduce((sum, c, i) => sum + c * Math.pow(x / 100, i), 0);
    const curve = Array.from({ length: 50 }, (_, i) => ({
      x: 50 + i * 9,
      y: fitY(50 + i * 9),
    }));
    const error = noisyPoints.reduce(
      (sum, p) => sum + Math.pow(p.y - fitY(p.x), 2),
      0,
    );
    return (
      <div
        style={{
          padding: "var(--space-4)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border-primary)",
          background: "var(--color-bg-primary)",
        }}
      >
        <p
          style={{
            marginBottom: "var(--space-4)",
            color: "var(--color-text-secondary)",
          }}
        >
          {prompt}
        </p>
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "300px",
            borderRadius: "var(--radius-lg)",
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border-primary)",
          }}
        >
          <svg width="100%" height="100%">
            <path
              d={curve
                .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
                .join(" ")}
              stroke="var(--color-accent-gold)"
              strokeWidth="2"
              fill="none"
            />
            {noisyPoints.map((p) => (
              <circle
                key={p.x}
                cx={p.x}
                cy={p.y}
                r={4}
                fill="var(--color-viz-1)"
                stroke="var(--color-bg-primary)"
                strokeWidth="1"
              />
            ))}
          </svg>
        </div>
        <div style={{ marginTop: "var(--space-4)" }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              color: "var(--color-text-primary)",
            }}
          >
            <span style={{ minWidth: "80px" }}>Degree: {degree}</span>
            <input
              type="range"
              min="1"
              max="6"
              value={degree}
              onChange={(e) => setDegree(Number(e.target.value))}
              style={{ flex: 1 }}
            />
            <span>MSE: {error.toFixed(1)}</span>
          </label>
        </div>
      </div>
    );
  }

  if (preset === "bar-perception") {
    return (
      <div
        style={{
          padding: "var(--space-4)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border-primary)",
          background: "var(--color-bg-primary)",
        }}
      >
        <p
          style={{
            marginBottom: "var(--space-4)",
            color: "var(--color-text-secondary)",
          }}
        >
          {prompt}
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "var(--space-3)",
            marginBottom: "var(--space-4)",
          }}
        >
          {bars.map((count, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <button
                onClick={() =>
                  setBars((b) => {
                    const n = [...b];
                    n[i]++;
                    return n;
                  })
                }
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "var(--radius-lg)",
                  background: BAR_COLORS[i],
                  border: "2px solid var(--color-border-primary)",
                  color: "white",
                  fontSize: "var(--text-xl)",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "var(--space-1)",
                }}
              >
                Bar {i + 1}
                <span
                  style={{ fontSize: "var(--text-sm)", fontWeight: "normal" }}
                >
                  {count} taps
                </span>
              </button>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          {bars.map((count, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-3)",
              }}
            >
              <span
                style={{
                  width: "60px",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                }}
              >
                Bar {i + 1}
              </span>
              <div
                style={{
                  flex: 1,
                  height: "24px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--color-border-primary)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(count / 20, 1) * 100}%`,
                    height: "100%",
                    background: BAR_COLORS[i],
                    transition: "width var(--duration-fast) ease",
                  }}
                />
              </div>
              <span
                style={{
                  width: "40px",
                  textAlign: "right",
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                }}
              >
                {count}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
