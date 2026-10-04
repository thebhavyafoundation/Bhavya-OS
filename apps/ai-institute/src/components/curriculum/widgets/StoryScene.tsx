"use client";

import { useState, useEffect, useRef } from "react";

interface StorySceneProps {
  scenes: Array<{ narration: string; highlight?: string }>;
  speak?: boolean;
  autoPlay?: boolean;
}

export function StoryScene({
  scenes,
  speak = false,
  autoPlay = false,
}: StorySceneProps) {
  const [currentScene, setCurrentScene] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const isReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (
      speak &&
      "speechSynthesis" in window &&
      scenes[currentScene]?.narration
    ) {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
      const utterance = new SpeechSynthesisUtterance(
        scenes[currentScene].narration,
      );
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    }
    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentScene, speak]);

  useEffect(() => {
    if (!isPlaying || isReduced || currentScene >= scenes.length - 1) return;
    const timer = setTimeout(() => {
      setCurrentScene((c) => Math.min(c + 1, scenes.length - 1));
    }, 4000);
    return () => clearTimeout(timer);
  }, [isPlaying, currentScene, scenes.length, isReduced]);

  const next = () => setCurrentScene((c) => Math.min(c + 1, scenes.length - 1));
  const prev = () => setCurrentScene((c) => Math.max(c - 1, 0));
  const togglePlay = () => setIsPlaying(!isPlaying);

  const scene = scenes[currentScene];

  return (
    <div
      style={{
        padding: "var(--space-4)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-border-primary)",
        background: "var(--color-bg-primary)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "var(--space-4)",
        }}
      >
        <span
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-secondary)",
          }}
        >
          Scene {currentScene + 1} of {scenes.length}
        </span>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button
            onClick={prev}
            disabled={currentScene === 0}
            style={{
              padding: "var(--space-1) var(--space-3)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border-primary)",
              background: "var(--color-bg-elevated)",
              color: "var(--color-text-primary)",
              cursor: currentScene === 0 ? "not-allowed" : "pointer",
              opacity: currentScene === 0 ? 0.5 : 1,
            }}
          >
            ← Back
          </button>
          <button
            onClick={togglePlay}
            disabled={isReduced || currentScene >= scenes.length - 1}
            style={{
              padding: "var(--space-1) var(--space-3)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border-primary)",
              background: isPlaying
                ? "var(--color-brand-forest)"
                : "var(--color-bg-elevated)",
              color: isPlaying ? "white" : "var(--color-text-primary)",
              cursor:
                isReduced || currentScene >= scenes.length - 1
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {isPlaying ? "⏸ Pause" : "▶ Auto"}
          </button>
          <button
            onClick={next}
            disabled={currentScene >= scenes.length - 1}
            style={{
              padding: "var(--space-1) var(--space-3)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border-primary)",
              background: "var(--color-bg-elevated)",
              color: "var(--color-text-primary)",
              cursor:
                currentScene >= scenes.length - 1 ? "not-allowed" : "pointer",
              opacity: currentScene >= scenes.length - 1 ? 0.5 : 1,
            }}
          >
            Next →
          </button>
        </div>
      </div>
      <div
        style={{
          padding: "var(--space-6)",
          borderRadius: "var(--radius-lg)",
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border-primary)",
          minHeight: "120px",
        }}
      >
        <p
          style={{
            fontSize: "var(--text-lg)",
            lineHeight: 1.7,
            color: "var(--color-text-primary)",
          }}
        >
          {scene.narration}
        </p>
        {scene.highlight && (
          <div
            style={{
              marginTop: "var(--space-4)",
              padding: "var(--space-3)",
              borderRadius: "var(--radius-md)",
              background: "rgba(208, 170, 0, 0.1)",
              border: "1px solid var(--color-accent-gold)",
            }}
          >
            <strong style={{ color: "var(--color-brand-forest)" }}>
              Key point:
            </strong>{" "}
            <span style={{ color: "var(--color-text-secondary)" }}>
              {scene.highlight}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
