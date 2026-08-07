"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TokenizerExplorerProps {
  initialText?: string;
}

interface Token {
  text: string;
  position: number;
  color: string;
}

const sampleTexts = [
  "The quick brown fox jumps over the lazy dog",
  "Natural language processing enables machines to understand human language",
  "Transformers use self-attention mechanisms to process sequences efficiently",
];

const tokenColors = [
  "#22c55e",
  "#3b82f6",
  "#a855f7",
  "#c9a227",
  "#8a7359",
  "#ef4444",
  "#06b6d4",
  "#f97316",
  "#84cc16",
  "#ec4899",
];

export function TokenizerExplorer({
  initialText = sampleTexts[0],
}: TokenizerExplorerProps) {
  const [text, setText] = useState(initialText);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isTokenizing, setIsTokenizing] = useState(false);
  const [showTokens, setShowTokens] = useState(false);

  const tokenize = () => {
    setIsTokenizing(true);
    setShowTokens(false);

    setTimeout(() => {
      const words = text.split(/\s+/).filter((w) => w.length > 0);
      const tokenList: Token[] = words.map((word, i) => ({
        text: word,
        position: i,
        color: tokenColors[i % tokenColors.length],
      }));

      setTokens(tokenList);
      setIsTokenizing(false);
      setShowTokens(true);
    }, 800);
  };

  const loadSample = (sampleText: string) => {
    setText(sampleText);
    setTokens([]);
    setShowTokens(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-mono font-bold text-[#c9a227]">
          Tokenizer Explorer
        </h3>
        <div className="flex gap-2">
          {sampleTexts.map((sample, i) => (
            <button
              key={i}
              onClick={() => loadSample(sample)}
              className="px-2 py-1 text-xs font-mono rounded bg-[#1a3a2a] text-[#8a7359] hover:bg-[#c9a227] hover:text-[#0a0f0d] transition-colors"
            >
              Sample {i + 1}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-4 rounded-lg border border-[#1a3a2a] bg-transparent text-[#f5f1e6] font-mono text-sm resize-none focus:outline-none focus:border-[#c9a227] transition-colors"
          style={{ backgroundColor: "#0a0f0d", minHeight: "80px" }}
          placeholder="Enter text to tokenize..."
          spellCheck={false}
        />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={tokenize}
          disabled={isTokenizing || !text.trim()}
          className="w-full py-3 rounded-lg font-mono text-sm font-bold bg-[#c9a227] text-[#0a0f0d] hover:bg-[#8a7359] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTokenizing ? "Tokenizing..." : "Tokenize"}
        </motion.button>
      </div>

      {showTokens && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex gap-4 text-sm font-mono">
            <div
              className="px-3 py-1 rounded"
              style={{ backgroundColor: "#1a3a2a" }}
            >
              <span className="text-[#8a7359]">Tokens:</span>{" "}
              <span className="text-[#c9a227] font-bold">{tokens.length}</span>
            </div>
            <div
              className="px-3 py-1 rounded"
              style={{ backgroundColor: "#1a3a2a" }}
            >
              <span className="text-[#8a7359]">Characters:</span>{" "}
              <span className="text-[#c9a227] font-bold">{text.length}</span>
            </div>
          </div>

          <div
            className="p-4 rounded-lg border border-[#1a3a2a]"
            style={{ backgroundColor: "#0a0f0d" }}
          >
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {tokens.map((token, i) => (
                  <motion.div
                    key={`${token.position}-${token.text}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative"
                  >
                    <div
                      className="px-3 py-2 rounded-lg font-mono text-sm font-bold cursor-pointer transition-transform hover:scale-105"
                      style={{
                        backgroundColor: token.color,
                        color: "#0a0f0d",
                      }}
                    >
                      {token.text}
                    </div>
                    <div
                      className="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono"
                      style={{
                        backgroundColor: "#0a0f0d",
                        color: token.color,
                        border: `1px solid ${token.color}`,
                      }}
                    >
                      {token.position}
                    </div>
                    <div
                      className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10"
                      style={{
                        backgroundColor: "#0a0f0d",
                        color: token.color,
                        border: `1px solid ${token.color}`,
                      }}
                    >
                      pos: {token.position} | len: {token.text.length}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div
            className="p-4 rounded-lg border border-[#1a3a2a]"
            style={{ backgroundColor: "#0a0f0d" }}
          >
            <h4 className="text-sm font-mono font-bold text-[#c9a227] mb-3">
              Token Breakdown
            </h4>
            <div className="space-y-2">
              {tokens.map((token, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 text-sm font-mono"
                >
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold"
                    style={{ backgroundColor: token.color, color: "#0a0f0d" }}
                  >
                    {token.position}
                  </div>
                  <span className="text-[#f5f1e6]">{token.text}</span>
                  <span className="text-[#8a7359]">→</span>
                  <span className="text-[#c9a227]">
                    ID_{token.position.toString().padStart(3, "0")}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
