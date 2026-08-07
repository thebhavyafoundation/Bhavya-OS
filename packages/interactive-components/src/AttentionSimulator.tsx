"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface AttentionSimulatorProps {
  query?: string;
  context?: string;
}

const defaultQuery = "The cat sat on the mat";
const defaultContext = "A fluffy cat rests peacefully on a soft mat";

export function AttentionSimulator({
  query = defaultQuery,
  context = defaultContext,
}: AttentionSimulatorProps) {
  const [queryTokens, setQueryTokens] = useState<string[]>([]);
  const [contextTokens, setContextTokens] = useState<string[]>([]);
  const [weights, setWeights] = useState<number[][]>([]);
  const [hoveredCell, setHoveredCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const qTokens = query.split(/\s+/).filter((t) => t.length > 0);
    const cTokens = context.split(/\s+/).filter((t) => t.length > 0);
    setQueryTokens(qTokens);
    setContextTokens(cTokens);

    const generatedWeights = qTokens.map(() =>
      cTokens.map(() => Math.random()),
    );
    setWeights(generatedWeights);
  }, [query, context]);

  const getWeightColor = (weight: number) => {
    if (weight > 0.7) return "#c9a227";
    if (weight > 0.4) return "#8a7359";
    return "#1a3a2a";
  };

  const getWeightIntensity = (weight: number) => {
    return Math.max(0.2, weight);
  };

  const animateBuildUp = () => {
    setIsAnimating(true);
    const newWeights = queryTokens.map(() => contextTokens.map(() => 0));
    setWeights(newWeights);

    let step = 0;
    const totalCells = queryTokens.length * contextTokens.length;

    const interval = setInterval(() => {
      const row = Math.floor(step / contextTokens.length);
      const col = step % contextTokens.length;

      if (row < queryTokens.length) {
        setWeights((prev) => {
          const next = prev.map((r) => [...r]);
          next[row][col] = Math.random();
          return next;
        });
      }

      step++;
      if (step >= totalCells) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 50);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-mono font-bold text-[#c9a227]">
          Attention Simulator
        </h3>
        <button
          onClick={animateBuildUp}
          disabled={isAnimating}
          className="px-3 py-1 text-xs font-mono rounded bg-[#1a3a2a] text-[#8a7359] hover:bg-[#c9a227] hover:text-[#0a0f0d] transition-colors disabled:opacity-50"
        >
          {isAnimating ? "Building..." : "Animate"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div
          className="p-4 rounded-lg border border-[#1a3a2a]"
          style={{ backgroundColor: "#0a0f0d" }}
        >
          <h4 className="text-sm font-mono font-bold text-[#3b82f6] mb-2">
            Query
          </h4>
          <p className="text-sm font-mono text-[#f5f1e6]">{query}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {queryTokens.map((token, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs font-mono rounded bg-[#3b82f6] text-[#0a0f0d]"
              >
                {token}
              </span>
            ))}
          </div>
        </div>
        <div
          className="p-4 rounded-lg border border-[#1a3a2a]"
          style={{ backgroundColor: "#0a0f0d" }}
        >
          <h4 className="text-sm font-mono font-bold text-[#22c55e] mb-2">
            Context
          </h4>
          <p className="text-sm font-mono text-[#f5f1e6]">{context}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {contextTokens.map((token, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs font-mono rounded bg-[#22c55e] text-[#0a0f0d]"
              >
                {token}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        className="p-4 rounded-lg border border-[#1a3a2a]"
        style={{ backgroundColor: "#0a0f0d" }}
      >
        <h4 className="text-sm font-mono font-bold text-[#c9a227] mb-4">
          Attention Heatmap
        </h4>

        <div className="overflow-x-auto">
          <div className="inline-block">
            <div className="flex items-center mb-2">
              <div className="w-20" />
              {contextTokens.map((token, i) => (
                <div key={i} className="w-16 text-center">
                  <span className="text-xs font-mono text-[#22c55e]">
                    {token.slice(0, 6)}
                  </span>
                </div>
              ))}
            </div>

            {queryTokens.map((qToken, row) => (
              <div key={row} className="flex items-center mb-1">
                <div className="w-20 text-right pr-3">
                  <span className="text-xs font-mono text-[#3b82f6]">
                    {qToken.slice(0, 8)}
                  </span>
                </div>
                {contextTokens.map((_, col) => {
                  const weight = weights[row]?.[col] || 0;
                  const isHovered =
                    hoveredCell?.row === row && hoveredCell?.col === col;

                  return (
                    <motion.div
                      key={col}
                      className="w-16 h-8 flex items-center justify-center cursor-pointer transition-all duration-200"
                      style={{
                        backgroundColor: getWeightColor(weight),
                        opacity: getWeightIntensity(weight),
                        transform: isHovered ? "scale(1.1)" : "scale(1)",
                        zIndex: isHovered ? 10 : 1,
                      }}
                      onMouseEnter={() => setHoveredCell({ row, col })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <span className="text-xs font-mono text-[#f5f1e6]">
                        {weight.toFixed(2)}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs font-mono text-[#8a7359]">Low</span>
          <div className="flex gap-1">
            {[0.2, 0.4, 0.6, 0.8, 1.0].map((intensity, i) => (
              <div
                key={i}
                className="w-8 h-4 rounded"
                style={{
                  backgroundColor: getWeightColor(intensity),
                  opacity: intensity,
                }}
              />
            ))}
          </div>
          <span className="text-xs font-mono text-[#8a7359]">High</span>
        </div>
      </div>

      {hoveredCell && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg border border-[#1a3a2a]"
          style={{ backgroundColor: "#0a0f0d" }}
        >
          <div className="text-sm font-mono">
            <span className="text-[#3b82f6]">
              {queryTokens[hoveredCell.row]}
            </span>
            <span className="text-[#8a7359]"> attends to </span>
            <span className="text-[#22c55e]">
              {contextTokens[hoveredCell.col]}
            </span>
            <span className="text-[#8a7359]"> with weight </span>
            <span className="text-[#c9a227] font-bold">
              {weights[hoveredCell.row]?.[hoveredCell.col]?.toFixed(3)}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
