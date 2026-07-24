"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";

const colorOptions = [
  { name: "Brand", value: "#1a56db" },
  { name: "Accent", value: "#d97706" },
  { name: "Forest", value: "#16a34a" },
  { name: "Heritage", value: "#9333ea" },
  { name: "Red", value: "#dc2626" },
];

const sizeOptions = ["sm", "md", "lg"];
const radiusOptions = ["none", "sm", "md", "lg", "xl", "full"];

export default function PlaygroundPage() {
  const [primaryColor, setPrimaryColor] = useState("#1a56db");
  const [fontSize, setFontSize] = useState(16);
  const [borderRadius, setBorderRadius] = useState("md");
  const [darkMode, setDarkMode] = useState(true);

  const radiusMap: Record<string, string> = {
    none: "0",
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 lg:p-12">
        <div className="max-w-4xl">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Playground</h1>
          <p className="text-lg text-[var(--text-muted)] mb-12">
            Interactive sandbox to test tokens, components, and patterns.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Controls */}
            <div className="lg:col-span-1 space-y-6">
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <h3 className="font-medium mb-3">Primary Color</h3>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setPrimaryColor(color.value)}
                      className={`w-10 h-10 rounded-lg border-2 transition-colors ${
                        primaryColor === color.value
                          ? "border-white scale-110"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="mt-3 w-full h-10 rounded-lg cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <h3 className="font-medium mb-3">Font Size: {fontSize}px</h3>
                <input
                  type="range"
                  min="12"
                  max="32"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <h3 className="font-medium mb-3">Border Radius</h3>
                <div className="flex flex-wrap gap-2">
                  {radiusOptions.map((r) => (
                    <button
                      key={r}
                      onClick={() => setBorderRadius(r)}
                      className={`px-3 py-1 text-xs rounded-md border ${
                        borderRadius === r
                          ? "bg-[var(--primary)] text-white border-transparent"
                          : "bg-[var(--bg-muted)] border-[var(--border)]"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--surface)]">
                <h3 className="font-medium mb-3">Theme</h3>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="px-4 py-2 text-sm rounded-lg bg-[var(--bg-muted)] border border-[var(--border)]"
                >
                  {darkMode ? "Dark Mode" : "Light Mode"}
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-2">
              <div
                className="p-8 rounded-xl border border-[var(--border)] min-h-[500px]"
                style={{
                  backgroundColor: darkMode ? "#0f172a" : "#ffffff",
                  color: darkMode ? "#f8fafc" : "#0f172a",
                }}
              >
                <h2
                  className="font-bold mb-4"
                  style={{ fontSize: `${fontSize * 1.5}px` }}
                >
                  Preview Component
                </h2>

                <div className="space-y-4">
                  <button
                    className="px-4 py-2 font-medium text-white transition-colors"
                    style={{
                      backgroundColor: primaryColor,
                      borderRadius: radiusMap[borderRadius],
                    }}
                  >
                    Primary Button
                  </button>

                  <button
                    className="px-4 py-2 font-medium border transition-colors"
                    style={{
                      borderColor: primaryColor,
                      color: primaryColor,
                      borderRadius: radiusMap[borderRadius],
                    }}
                  >
                    Secondary Button
                  </button>

                  <div
                    className="p-4 border"
                    style={{
                      borderColor: `${primaryColor}33`,
                      borderRadius: radiusMap[borderRadius],
                    }}
                  >
                    <h3
                      className="font-semibold mb-2"
                      style={{ fontSize: `${fontSize}px` }}
                    >
                      Card Title
                    </h3>
                    <p style={{ fontSize: `${fontSize * 0.875}px`, opacity: 0.7 }}>
                      This is a preview card with your selected tokens applied.
                    </p>
                  </div>

                  <div
                    className="inline-flex items-center gap-2 px-3 py-1 text-sm"
                    style={{
                      backgroundColor: `${primaryColor}22`,
                      color: primaryColor,
                      borderRadius: radiusMap[borderRadius],
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: primaryColor }}
                    />
                    Badge Component
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: darkMode ? "#1e293b" : "#f1f5f9" }}>
                  <p className="text-sm opacity-70">
                    <strong>Selected tokens:</strong>{" "}
                    Primary: {primaryColor} | Size: {fontSize}px | Radius: {borderRadius}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
