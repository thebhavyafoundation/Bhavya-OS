"use client";

import { useState, useCallback, useMemo } from "react";

// ═══════════════════════════════════════════
// ATTENTION MECHANISM SIMULATOR
// ═══════════════════════════════════════════

interface Token {
  id: number;
  text: string;
  query: number[];
  key: number[];
  value: number[];
}

interface AttentionWeight {
  from: number;
  to: number;
  weight: number;
}

function generateRandomVector(dim: number): number[] {
  return Array.from({ length: dim }, () => Math.random() * 2 - 1);
}

function dotProduct(a: number[], b: number[]): number {
  return a.reduce((sum, v, i) => sum + v * b[i], 0);
}

function softmax(values: number[]): number[] {
  const max = Math.max(...values);
  const exps = values.map((v) => Math.exp(v - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

export function AttentionSimulator() {
  const [tokens, setTokens] = useState<Token[]>([
    {
      id: 0,
      text: "The",
      query: generateRandomVector(4),
      key: generateRandomVector(4),
      value: generateRandomVector(4),
    },
    {
      id: 1,
      text: "cat",
      query: generateRandomVector(4),
      key: generateRandomVector(4),
      value: generateRandomVector(4),
    },
    {
      id: 2,
      text: "sat",
      query: generateRandomVector(4),
      key: generateRandomVector(4),
      value: generateRandomVector(4),
    },
    {
      id: 3,
      text: "on",
      query: generateRandomVector(4),
      key: generateRandomVector(4),
      value: generateRandomVector(4),
    },
    {
      id: 4,
      text: "the",
      query: generateRandomVector(4),
      key: generateRandomVector(4),
      value: generateRandomVector(4),
    },
    {
      id: 5,
      text: "mat",
      query: generateRandomVector(4),
      key: generateRandomVector(4),
      value: generateRandomVector(4),
    },
  ]);
  const [selectedToken, setSelectedToken] = useState(0);
  const [temperature, setTemperature] = useState(1.0);

  const attentionWeights = useMemo(() => {
    const weights: AttentionWeight[] = [];
    const dim = tokens[0].query.length;
    const scale = Math.sqrt(dim);

    for (const queryToken of tokens) {
      const scores: number[] = [];
      for (const keyToken of tokens) {
        scores.push(dotProduct(queryToken.query, keyToken.key) / scale);
      }
      const softmaxed = softmax(scores.map((s) => s / temperature));
      softmaxed.forEach((weight, i) => {
        weights.push({ from: queryToken.id, to: tokens[i].id, weight });
      });
    }
    return weights;
  }, [tokens, temperature]);

  const selectedWeights = attentionWeights.filter(
    (w) => w.from === selectedToken,
  );

  const randomize = useCallback(() => {
    setTokens((prev) =>
      prev.map((t) => ({
        ...t,
        query: generateRandomVector(4),
        key: generateRandomVector(4),
        value: generateRandomVector(4),
      })),
    );
  }, []);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Attention Mechanism</h3>
        <div className="flex gap-2">
          <button
            onClick={randomize}
            className="px-3 py-1 text-xs bg-white/10 rounded-lg hover:bg-white/20"
          >
            Randomize
          </button>
        </div>
      </div>

      <p className="text-white/50 text-sm mb-4">
        Click a token to see how much attention it pays to every other token.
      </p>

      {/* Temperature Control */}
      <div className="mb-4">
        <label className="text-xs text-white/40 block mb-1">
          Temperature: {temperature.toFixed(1)}
        </label>
        <input
          type="range"
          min="0.1"
          max="3"
          step="0.1"
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          className="w-full accent-accent-green"
        />
        <div className="flex justify-between text-[10px] text-white/30 mt-1">
          <span>Focused</span>
          <span>Uniform</span>
        </div>
      </div>

      {/* Tokens */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {tokens.map((token) => (
          <button
            key={token.id}
            onClick={() => setSelectedToken(token.id)}
            className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
              selectedToken === token.id
                ? "bg-accent-green text-text-primary font-bold"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            {token.text}
          </button>
        ))}
      </div>

      {/* Attention Heatmap */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-white/80 mb-2">
          Attention Weights from &quot;{tokens[selectedToken].text}&quot;
        </h4>
        <div className="grid gap-2">
          {selectedWeights.map((w) => (
            <div key={w.to} className="flex items-center gap-3">
              <span className="text-xs text-white/50 w-12 text-right font-mono">
                {tokens[w.to].text}
              </span>
              <div className="flex-1 h-8 bg-white/5 rounded-lg overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-accent-green to-blue-500 rounded-lg transition-all duration-500"
                  style={{ width: `${w.weight * 100}%` }}
                />
                <span className="absolute inset-0 flex items-center px-3 text-xs font-mono text-white/80">
                  {(w.weight * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Connections */}
      <div className="bg-bg-primary/30 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-white/80 mb-3">
          Attention Flow
        </h4>
        <svg viewBox="0 0 600 120" className="w-full h-32">
          {tokens.map((token, i) => {
            const x = 50 + i * 95;
            const weight = selectedWeights.find((w) => w.to === i)?.weight || 0;
            return (
              <g key={token.id}>
                <line
                  x1={50 + selectedToken * 95}
                  y1={20}
                  x2={x}
                  y2={100}
                  stroke={`rgba(34, 197, 94, ${weight})`}
                  strokeWidth={weight * 8}
                  className="transition-all duration-500"
                />
                <circle
                  cx={x}
                  cy={100}
                  r={16 + weight * 12}
                  fill={
                    i === selectedToken
                      ? "#22c55e"
                      : `rgba(59, 130, 246, ${0.3 + weight * 0.7})`
                  }
                  className="transition-all duration-500"
                />
                <text
                  x={x}
                  y={105}
                  textAnchor="middle"
                  fill="white"
                  fontSize="11"
                  fontFamily="monospace"
                >
                  {token.text}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// TOKENIZATION SIMULATOR
// ═══════════════════════════════════════════

export function TokenizationSimulator() {
  const [input, setInput] = useState("Hello, how are you today?");
  const [strategy, setStrategy] = useState<"word" | "char" | "bpe">("bpe");

  const tokens = useMemo(() => {
    if (strategy === "word") {
      return input
        .split(/\s+/)
        .filter(Boolean)
        .map((t, i) => ({ id: i, text: t, type: "word" as const }));
    }
    if (strategy === "char") {
      return input
        .split("")
        .map((t, i) => ({ id: i, text: t, type: "char" as const }));
    }
    // BPE-like simulation
    const result: { id: number; text: string; type: "bpe" }[] = [];
    let remaining = input;
    let id = 0;
    const patterns: [RegExp, string][] = [
      [/the/g, "the"],
      [/\s+/g, "▁"],
      [/er/g, "er"],
      [/ing/g, "ing"],
      [/ly/g, "ly"],
      [/un/g, "un"],
      [/re/g, "re"],
      [/tion/g, "tion"],
      [/able/g, "able"],
      [/est/g, "est"],
    ];
    while (remaining.length > 0) {
      let matched = false;
      for (const [pattern, token] of patterns) {
        const match = remaining.match(pattern);
        if (match && remaining.indexOf(match[0]) === 0) {
          result.push({ id: id++, text: token, type: "bpe" });
          remaining = remaining.slice(match[0].length);
          matched = true;
          break;
        }
      }
      if (!matched) {
        result.push({ id: id++, text: remaining[0], type: "bpe" });
        remaining = remaining.slice(1);
      }
    }
    return result;
  }, [input, strategy]);

  // TODO: reference design tokens
  const colors = [
    "#22c55e",
    "#3b82f6",
    "#8b5cf6",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
    "#06b6d4",
    "#14b8a6",
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">Tokenization Simulator</h3>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full bg-bg-primary/30 border border-white/10 rounded-lg px-4 py-3 text-white font-mono mb-4"
        placeholder="Type something..."
      />

      <div className="flex gap-2 mb-4">
        {(["word", "char", "bpe"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStrategy(s)}
            className={`px-3 py-1 text-xs rounded-lg ${strategy === s ? "bg-accent-green text-text-primary" : "bg-white/10 text-white/60"}`}
          >
            {s.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {tokens.map((t) => (
          <span
            key={t.id}
            className="px-3 py-1.5 rounded-lg font-mono text-sm border"
            style={{
              // TODO: reference design tokens
              backgroundColor: colors[t.id % colors.length] + "20",
              borderColor: colors[t.id % colors.length] + "40",
              color: colors[t.id % colors.length],
            }}
          >
            {t.text}
          </span>
        ))}
      </div>

      <div className="text-xs text-white/40">
        {tokens.length} tokens • {strategy.toUpperCase()} strategy •{" "}
        {input.length} characters
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// EMBEDDING SPACE EXPLORER
// ═══════════════════════════════════════════

interface EmbeddingWord {
  word: string;
  x: number;
  y: number;
  category: string;
}

export function EmbeddingSpaceExplorer() {
  const [words] = useState<EmbeddingWord[]>([
    { word: "king", x: 0.8, y: 0.7, category: "royalty" },
    { word: "queen", x: 0.85, y: 0.8, category: "royalty" },
    { word: "prince", x: 0.75, y: 0.65, category: "royalty" },
    { word: "cat", x: 0.2, y: 0.3, category: "animals" },
    { word: "dog", x: 0.25, y: 0.35, category: "animals" },
    { word: "fish", x: 0.15, y: 0.25, category: "animals" },
    { word: "paris", x: 0.6, y: 0.9, category: "places" },
    { word: "france", x: 0.55, y: 0.85, category: "places" },
    { word: "tokyo", x: 0.4, y: 0.9, category: "places" },
    { word: "run", x: 0.3, y: 0.6, category: "actions" },
    { word: "walk", x: 0.35, y: 0.55, category: "actions" },
    { word: "jump", x: 0.25, y: 0.65, category: "actions" },
    { word: "big", x: 0.7, y: 0.4, category: "adjectives" },
    { word: "small", x: 0.1, y: 0.4, category: "adjectives" },
    { word: "happy", x: 0.6, y: 0.2, category: "emotions" },
    { word: "sad", x: 0.4, y: 0.15, category: "emotions" },
  ]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [showVectors, setShowVectors] = useState(false);

  // TODO: reference design tokens
  const categoryColors: Record<string, string> = {
    royalty: "#f59e0b",
    animals: "#22c55e",
    places: "#3b82f6",
    actions: "#8b5cf6",
    adjectives: "#ef4444",
    emotions: "#ec4899",
  };

  const selected = words.find((w) => w.word === selectedWord);
  const similarities = selected
    ? words
        .filter((w) => w.word !== selectedWord)
        .map((w) => {
          const dx = w.x - selected.x;
          const dy = w.y - selected.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          return {
            word: w.word,
            similarity: Math.max(0, 1 - dist * 2),
            category: w.category,
          };
        })
        .sort((a, b) => b.similarity - a.similarity)
    : [];

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Embedding Space Explorer</h3>
        <button
          onClick={() => setShowVectors(!showVectors)}
          className="px-3 py-1 text-xs bg-white/10 rounded-lg hover:bg-white/20"
        >
          {showVectors ? "Hide" : "Show"} Vectors
        </button>
      </div>

      <p className="text-white/50 text-sm mb-4">
        Click a word to see its position in vector space and find similar words.
      </p>

      {/* 2D Projection */}
      <div
        className="bg-bg-primary/30 rounded-lg p-4 mb-4 relative"
        style={{ height: 320 }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Grid */}
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line
                x1={v}
                y1={0}
                x2={v}
                y2={100}
                stroke="rgba(255,255,255,0.05)"
              />
              <line
                x1={0}
                y1={v}
                x2={100}
                y2={v}
                stroke="rgba(255,255,255,0.05)"
              />
            </g>
          ))}

          {/* Vectors from selected word */}
          {showVectors &&
            selected &&
            words.map((w) => (
              <line
                key={`vec-${w.word}`}
                x1={selected.x * 100}
                y1={selected.y * 100}
                x2={w.x * 100}
                y2={w.y * 100}
                stroke={categoryColors[w.category]}
                strokeWidth="0.3"
                strokeDasharray="1,1"
                opacity="0.3"
              />
            ))}

          {/* Words */}
          {words.map((w) => {
            const isSelected = w.word === selectedWord;
            const color = categoryColors[w.category];
            return (
              <g
                key={w.word}
                onClick={() => setSelectedWord(w.word)}
                className="cursor-pointer"
              >
                <circle
                  cx={w.x * 100}
                  cy={w.y * 100}
                  r={isSelected ? 4 : 2.5}
                  fill={color}
                  opacity={isSelected ? 1 : 0.7}
                  className="transition-all duration-300"
                />
                <text
                  x={w.x * 100}
                  y={w.y * 100 - 4}
                  textAnchor="middle"
                  fill="white"
                  fontSize="3"
                  fontFamily="monospace"
                  opacity={isSelected ? 1 : 0.6}
                >
                  {w.word}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.entries(categoryColors).map(([cat, color]) => (
          <div key={cat} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-white/50 capitalize">{cat}</span>
          </div>
        ))}
      </div>

      {/* Similarities */}
      {selected && (
        <div>
          <h4 className="text-sm font-semibold text-white/80 mb-2">
            Most Similar to &quot;{selected.word}&quot;
          </h4>
          <div className="space-y-1">
            {similarities.slice(0, 5).map((s) => (
              <div key={s.word} className="flex items-center gap-3">
                <span className="text-xs text-white/50 w-16 text-right font-mono">
                  {s.word}
                </span>
                <div className="flex-1 h-6 bg-white/5 rounded overflow-hidden">
                  <div
                    className="h-full rounded transition-all duration-500"
                    style={{
                      width: `${s.similarity * 100}%`,
                      backgroundColor: categoryColors[s.category],
                    }}
                  />
                </div>
                <span className="text-xs text-white/40 w-12">
                  {(s.similarity * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// VECTOR SEARCH SIMULATOR
// ═══════════════════════════════════════════

export function VectorSearchSimulator() {
  const [query, setQuery] = useState("machine learning");
  const [topK, setTopK] = useState(3);

  const documents = [
    {
      id: 1,
      text: "Machine learning is a subset of artificial intelligence",
      category: "AI",
    },
    {
      id: 2,
      text: "Deep learning uses neural networks with many layers",
      category: "AI",
    },
    {
      id: 3,
      text: "Natural language processing deals with text and speech",
      category: "NLP",
    },
    {
      id: 4,
      text: "Computer vision analyzes images and videos",
      category: "CV",
    },
    {
      id: 5,
      text: "Reinforcement learning trains agents through rewards",
      category: "RL",
    },
    {
      id: 6,
      text: "Supervised learning uses labeled training data",
      category: "ML",
    },
    {
      id: 7,
      text: "Unsupervised learning finds patterns in data",
      category: "ML",
    },
    {
      id: 8,
      text: "Transfer learning reuses pre-trained models",
      category: "ML",
    },
    {
      id: 9,
      text: "Neural networks are inspired by biological neurons",
      category: "DL",
    },
    {
      id: 10,
      text: "Transformers use self-attention mechanisms",
      category: "DL",
    },
  ];

  const queryWords = query.toLowerCase().split(/\s+/);
  const scored = documents
    .map((doc) => {
      const docWords = doc.text.toLowerCase().split(/\s+/);
      const overlap = queryWords.filter((w) =>
        docWords.some((dw) => dw.includes(w) || w.includes(dw)),
      ).length;
      const score = overlap / Math.max(queryWords.length, 1);
      return { ...doc, score: Math.min(1, score + Math.random() * 0.2) };
    })
    .sort((a, b) => b.score - a.score);

  const results = scored.slice(0, topK);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">Vector Search Simulator</h3>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-bg-primary/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
          placeholder="Search query..."
        />
        <div className="flex items-center gap-2">
          <label className="text-xs text-white/40">Top-K:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={topK}
            onChange={(e) => setTopK(parseInt(e.target.value) || 3)}
            className="w-16 bg-bg-primary/30 border border-white/10 rounded-lg px-2 py-2 text-white text-sm text-center"
          />
        </div>
      </div>

      <div className="space-y-2">
        {results.map((r, i) => (
          <div
            key={r.id}
            className="flex items-start gap-3 bg-white/5 rounded-lg p-3"
          >
            <span className="text-xs text-white/30 font-mono w-6">
              #{i + 1}
            </span>
            <div className="flex-1">
              <p className="text-sm text-white/70">{r.text}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50">
                  {r.category}
                </span>
                <span className="text-[10px] text-white/30">
                  score: {r.score.toFixed(3)}
                </span>
              </div>
            </div>
            <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-green rounded-full transition-all duration-500"
                style={{ width: `${r.score * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// TRANSFORMER PIPELINE VISUALIZER
// ═══════════════════════════════════════════

export function TransformerPipelineVisualizer() {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("The cat sat");

  const layers = [
    { name: "Input Tokens", desc: "Text is split into tokens" },
    { name: "Embedding Layer", desc: "Tokens converted to vectors" },
    { name: "Positional Encoding", desc: "Add position information" },
    { name: "Self-Attention", desc: "Tokens attend to each other" },
    { name: "Feed Forward", desc: "Process each position" },
    { name: "Output Probabilities", desc: "Predict next token" },
  ];

  const tokens = input.split(/\s+/).filter(Boolean);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">Transformer Pipeline</h3>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full bg-bg-primary/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm mb-4 font-mono"
        placeholder="Enter tokens..."
      />

      {/* Pipeline Steps */}
      <div className="space-y-2 mb-6">
        {layers.map((layer, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`w-full text-left p-3 rounded-lg border transition-all ${
              step === i
                ? "border-accent-green bg-accent-green/10"
                : "border-white/10 bg-white/5 hover:border-white/20"
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  i <= step
                    ? "bg-accent-green text-text-primary"
                    : "bg-white/10 text-white/40"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </span>
              <div>
                <div className="text-sm font-medium">{layer.name}</div>
                <div className="text-xs text-white/40">{layer.desc}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Current Step Visualization */}
      <div className="bg-bg-primary/30 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-white/80 mb-3">
          {layers[step].name}
        </h4>
        {step === 0 && (
          <div className="flex gap-2 flex-wrap">
            {tokens.map((t, i) => (
              <span
                key={i}
                className="px-3 py-2 bg-accent-green/20 border border-accent-green/40 rounded-lg font-mono text-sm text-accent-green"
              >
                [{i}] {t}
              </span>
            ))}
          </div>
        )}
        {step === 1 && (
          <div className="grid grid-cols-3 gap-2">
            {tokens.map((t, i) => (
              <div key={i} className="bg-white/5 rounded-lg p-2">
                <div className="text-xs font-mono text-blue-500 mb-1">{t}</div>
                <div className="flex gap-1">
                  {[...Array(6)].map((_, j) => (
                    <div
                      key={j}
                      className="w-3 h-3 rounded-sm bg-blue-500"
                      style={{ opacity: 0.3 + Math.random() * 0.7 }}
                    />
                  ))}
                  <span className="text-[10px] text-white/30">...</span>
                </div>
              </div>
            ))}
          </div>
        )}
        {step === 2 && (
          <div className="text-sm text-white/60">
            <p className="mb-2">
              Each position gets a unique encoding vector added to its
              embedding.
            </p>
            <div className="font-mono text-xs bg-white/5 p-2 rounded">
              PE(pos, 2i) = sin(pos / 10000^(2i/d))
              <br />
              PE(pos, 2i+1) = cos(pos / 10000^(2i/d))
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="text-sm text-white/60">
            <p className="mb-2">
              Each token computes attention scores with every other token.
            </p>
            <div className="grid grid-cols-3 gap-1 text-center text-xs">
              {tokens.map((t1, i) => (
                <g key={i}>
                  {tokens.map((t2, j) => (
                    <div
                      key={j}
                      className="p-1 rounded"
                      style={{
                        backgroundColor: `rgba(34, 197, 94, ${i === j ? 0.5 : 0.1 + Math.random() * 0.3})`,
                      }}
                    >
                      {t1.slice(0, 2)}→{t2.slice(0, 2)}
                    </div>
                  ))}
                </g>
              ))}
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="text-sm text-white/60">
            <p className="mb-2">
              Each position passes through a feed-forward network independently.
            </p>
            <div className="font-mono text-xs bg-white/5 p-2 rounded">
              FFN(x) = max(0, x·W₁ + b₁)·W₂ + b₂
            </div>
          </div>
        )}
        {step === 5 && (
          <div className="text-sm text-white/60">
            <p className="mb-2">
              Output logits are converted to probabilities via softmax.
            </p>
            <div className="space-y-1">
              {["the", "a", "on", "is", "was"].map((w, i) => (
                <div key={w} className="flex items-center gap-2">
                  <span className="w-10 text-right font-mono text-xs">{w}</span>
                  <div className="flex-1 h-4 bg-white/10 rounded overflow-hidden">
                    <div
                      className="h-full bg-accent-green rounded"
                      style={{
                        width: `${Math.max(5, 40 - i * 8 + Math.random() * 10)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// RAG PIPELINE SIMULATOR
// ═══════════════════════════════════════════

export function RAGPipelineSimulator() {
  const [query, setQuery] = useState("What is machine learning?");
  const [chunkSize, setChunkSize] = useState(50);
  const [topK, setTopK] = useState(2);

  const documents = [
    "Machine learning is a branch of artificial intelligence that enables systems to learn from data. It uses algorithms to find patterns in large datasets.",
    "Deep learning is a subset of machine learning that uses neural networks with multiple layers. It excels at recognizing complex patterns in data.",
    "Natural language processing allows computers to understand and generate human language. It powers chatbots, translation, and text analysis.",
    "Computer vision enables machines to interpret images and videos. Self-driving cars and medical imaging rely on this technology.",
    "Reinforcement learning trains agents through trial and error. The agent receives rewards for good actions and penalties for bad ones.",
  ];

  const chunkDocument = (doc: string, size: number) => {
    const chunks = [];
    for (let i = 0; i < doc.length; i += size) {
      chunks.push(doc.slice(i, i + size));
    }
    return chunks;
  };

  const allChunks = documents.flatMap((doc, docIdx) =>
    chunkDocument(doc, chunkSize).map((chunk, chunkIdx) => ({
      id: `${docIdx}-${chunkIdx}`,
      text: chunk,
      document: docIdx,
      score: 0,
    })),
  );

  const queryWords = query.toLowerCase().split(/\s+/);
  const scored = allChunks
    .map((chunk) => {
      const chunkWords = chunk.text.toLowerCase().split(/\s+/);
      const overlap = queryWords.filter((w) =>
        chunkWords.some((cw) => cw.includes(w) || w.includes(cw)),
      ).length;
      return {
        ...chunk,
        score: Math.min(
          1,
          overlap / Math.max(queryWords.length, 1) + Math.random() * 0.3,
        ),
      };
    })
    .sort((a, b) => b.score - a.score);

  const retrieved = scored.slice(0, topK);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">RAG Pipeline Simulator</h3>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-bg-primary/30 border border-white/10 rounded-lg px-4 py-2 text-white text-sm mb-4"
        placeholder="Ask a question..."
      />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="text-xs text-white/40 block mb-1">
            Chunk Size: {chunkSize}
          </label>
          <input
            type="range"
            min="20"
            max="100"
            value={chunkSize}
            onChange={(e) => setChunkSize(parseInt(e.target.value))}
            className="w-full accent-accent-green"
          />
        </div>
        <div>
          <label className="text-xs text-white/40 block mb-1">
            Top-K: {topK}
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={topK}
            onChange={(e) => setTopK(parseInt(e.target.value))}
            className="w-full accent-blue-500"
          />
        </div>
      </div>

      {/* Pipeline Flow */}
      <div className="grid grid-cols-3 gap-4">
        {/* Documents */}
        <div className="bg-bg-primary/30 rounded-lg p-3">
          <h4 className="text-xs font-semibold text-white/60 mb-2">
            📚 Documents
          </h4>
          <div className="space-y-1">
            {documents.map((_, i) => (
              <div
                key={i}
                className="text-xs text-white/40 bg-white/5 rounded p-1.5"
              >
                Doc {i + 1} → {chunkDocument(documents[i], chunkSize).length}{" "}
                chunks
              </div>
            ))}
          </div>
        </div>

        {/* Retrieved Chunks */}
        <div className="bg-bg-primary/30 rounded-lg p-3">
          <h4 className="text-xs font-semibold text-white/60 mb-2">
            🔍 Retrieved
          </h4>
          <div className="space-y-1">
            {retrieved.map((r, i) => (
              <div
                key={r.id}
                className="text-xs bg-accent-green/10 border border-accent-green/30 rounded p-1.5"
              >
                <div className="text-accent-green font-mono">
                  #{i + 1} (score: {r.score.toFixed(2)})
                </div>
                <div className="text-white/50 mt-0.5 line-clamp-2">
                  {r.text}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Generated Answer */}
        <div className="bg-bg-primary/30 rounded-lg p-3">
          <h4 className="text-xs font-semibold text-white/60 mb-2">
            🤖 Generated
          </h4>
          <div className="text-xs text-white/60 bg-white/5 rounded p-2">
            Based on the retrieved context, machine learning is{" "}
            {retrieved.length > 0
              ? retrieved[0].text.slice(0, 80) + "..."
              : "a branch of AI"}
            .
          </div>
        </div>
      </div>
    </div>
  );
}
