"use client";

import { useEffect, useState } from "react";
import {
  initialLeftItems,
  initialRightItems,
  shuffleRightItems,
} from "./tap-match-order";

export function TapMatch({
  pairs,
}: {
  pairs: Array<{ a: string; b: string }>;
}) {
  /*
   * The first render has to be identical on the server and in the browser,
   * so both columns start in their authored order. The definitions are
   * shuffled afterwards, once the component is mounted in the browser, so
   * that the matching exercise is not a matter of reading two aligned
   * columns.
   *
   * Shuffling during the render - which is what this did before - made the
   * server and the browser pick different orders, the markup disagreed and
   * React reported a hydration mismatch (error #418) on every load where
   * the two orders differed.
   */
  const [leftItems] = useState(() => initialLeftItems(pairs));
  const [rightItems, setRightItems] = useState(() => initialRightItems(pairs));

  useEffect(() => {
    setRightItems((items) => shuffleRightItems(items));
  }, []);

  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<Set<string>>(new Set());

  const handleLeftClick = (id: string) => {
    if (matched.has(id) || wrong.has(id)) return;
    setSelectedLeft(id);
    checkMatch();
  };

  const handleRightClick = (id: string) => {
    if (matched.has(id) || wrong.has(id)) return;
    setSelectedRight(id);
    checkMatch();
  };

  const checkMatch = () => {
    if (selectedLeft && selectedRight) {
      const leftItem = leftItems.find((l) => l.id === selectedLeft);
      const rightItem = rightItems.find((r) => r.id === selectedRight);
      if (leftItem && rightItem && leftItem.match === rightItem.text) {
        setMatched((m) => new Set([...m, selectedLeft, selectedRight]));
      } else {
        setWrong((w) => new Set([...w, selectedLeft, selectedRight]));
        setTimeout(() => {
          setWrong((w) => {
            const n = new Set(w);
            n.delete(selectedLeft);
            n.delete(selectedRight);
            return n;
          });
        }, 600);
      }
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

  const isReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "var(--space-8)",
        alignItems: "start",
      }}
    >
      <div>
        <h4
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            color: "var(--color-text-primary)",
            marginBottom: "var(--space-4)",
          }}
        >
          Concepts
        </h4>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          {leftItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleLeftClick(item.id)}
              disabled={matched.has(item.id)}
              style={{
                padding: "var(--space-3) var(--space-4)",
                borderRadius: "var(--radius-lg)",
                border: matched.has(item.id)
                  ? "2px solid var(--color-status-success)"
                  : wrong.has(item.id)
                    ? "2px solid var(--color-status-error)"
                    : selectedLeft === item.id
                      ? "2px solid var(--color-accent-gold)"
                      : "1px solid var(--color-border-primary)",
                background: matched.has(item.id)
                  ? "var(--color-status-success-bg)"
                  : wrong.has(item.id)
                    ? "var(--color-status-error-bg)"
                    : "var(--color-bg-primary)",
                color: "var(--color-text-primary)",
                textAlign: "left",
                transition: "all var(--duration-fast) ease",
                cursor: matched.has(item.id) ? "default" : "pointer",
                opacity: matched.has(item.id) ? 0.8 : 1,
              }}
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>
      <div>
        <h4
          style={{
            fontSize: "var(--text-sm)",
            fontWeight: 600,
            color: "var(--color-text-primary)",
            marginBottom: "var(--space-4)",
          }}
        >
          Definitions
        </h4>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          {rightItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleRightClick(item.id)}
              disabled={matched.has(item.id)}
              style={{
                padding: "var(--space-3) var(--space-4)",
                borderRadius: "var(--radius-lg)",
                border: matched.has(item.id)
                  ? "2px solid var(--color-status-success)"
                  : wrong.has(item.id)
                    ? "2px solid var(--color-status-error)"
                    : selectedRight === item.id
                      ? "2px solid var(--color-accent-gold)"
                      : "1px solid var(--color-border-primary)",
                background: matched.has(item.id)
                  ? "var(--color-status-success-bg)"
                  : wrong.has(item.id)
                    ? "var(--color-status-error-bg)"
                    : "var(--color-bg-primary)",
                color: "var(--color-text-primary)",
                textAlign: "left",
                transition: "all var(--duration-fast) ease",
                cursor: matched.has(item.id) ? "default" : "pointer",
                opacity: matched.has(item.id) ? 0.8 : 1,
                animation:
                  wrong.has(item.id) && !isReduced ? "shake 0.4s ease" : "none",
              }}
            >
              {item.text}
            </button>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          20%,
          60% {
            transform: translateX(-4px);
          }
          40%,
          80% {
            transform: translateX(4px);
          }
        }
      `}</style>
    </div>
  );
}
