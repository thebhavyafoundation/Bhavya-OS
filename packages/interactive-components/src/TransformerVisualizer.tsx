"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TransformerVisualizerProps {
  currentStep?: number;
}

interface Step {
  id: number;
  title: string;
  description: string;
  color: string;
  bgColor: string;
  icon: string;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Input",
    description:
      "Raw text is received by the model. The input sequence consists of tokens representing words or subwords from the original text.",
    color: "#22c55e",
    bgColor: "rgba(34, 197, 94, 0.15)",
    icon: "📝",
  },
  {
    id: 2,
    title: "Tokenization",
    description:
      "The input text is split into tokens. Each token maps to a unique ID in the vocabulary. Special tokens like [CLS] and [SEP] are added.",
    color: "#c9a227",
    bgColor: "rgba(201, 162, 39, 0.15)",
    icon: "✂️",
  },
  {
    id: 3,
    title: "Embedding",
    description:
      "Token IDs are converted to dense vectors. Positional encodings are added to capture sequence order. The embedding dimension is typically 512 or 768.",
    color: "#8a7359",
    bgColor: "rgba(138, 115, 89, 0.15)",
    icon: "🧬",
  },
  {
    id: 4,
    title: "Self-Attention",
    description:
      "Each token attends to every other token. Query, Key, and Value matrices compute attention scores. Multi-head attention captures different relationships.",
    color: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.15)",
    icon: "🔍",
  },
  {
    id: 5,
    title: "Feed Forward",
    description:
      "A two-layer neural network processes each position independently. This adds non-linearity and increases model capacity for complex patterns.",
    color: "#a855f7",
    bgColor: "rgba(168, 85, 247, 0.15)",
    icon: "⚡",
  },
  {
    id: 6,
    title: "Output",
    description:
      "The final hidden states are projected to vocabulary logits. The token with highest probability is selected as the next predicted token.",
    color: "#22c55e",
    bgColor: "rgba(34, 197, 94, 0.15)",
    icon: "🎯",
  },
];

export function TransformerVisualizer({
  currentStep: initialStep = 1,
}: TransformerVisualizerProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);

  const step = steps[currentStep - 1];

  const goToStep = (newStep: number) => {
    setDirection(newStep > currentStep ? 1 : -1);
    setCurrentStep(newStep);
  };

  const goNext = () => {
    if (currentStep < steps.length) {
      goToStep(currentStep + 1);
    }
  };

  const goPrev = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-mono font-bold text-[#c9a227]">
          Transformer Architecture
        </h3>
        <span className="text-sm font-mono text-[#8a7359]">
          Step {currentStep} of {steps.length}
        </span>
      </div>

      <div className="flex justify-center gap-2">
        {steps.map((s, i) => (
          <button
            key={s.id}
            onClick={() => goToStep(s.id)}
            className="relative"
          >
            <motion.div
              animate={{
                scale: currentStep === s.id ? 1.2 : 1,
                backgroundColor: currentStep === s.id ? s.color : "#1a3a2a",
              }}
              className="w-3 h-3 rounded-full cursor-pointer"
            />
            {currentStep === s.id && (
              <motion.div
                layoutId="step-indicator"
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{ backgroundColor: s.color }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center">
            <div
              className="px-2 py-1 rounded text-xs font-mono font-bold transition-all duration-300"
              style={{
                backgroundColor: currentStep === s.id ? s.color : "#1a3a2a",
                color: currentStep === s.id ? "#0a0f0d" : "#8a7359",
                transform: currentStep === s.id ? "scale(1.05)" : "scale(1)",
              }}
            >
              {s.title}
            </div>
            {i < steps.length - 1 && (
              <div
                className="w-4 h-px mx-1"
                style={{
                  backgroundColor: currentStep > s.id ? s.color : "#1a3a2a",
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden" style={{ minHeight: "280px" }}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="rounded-xl border p-6"
            style={{
              borderColor: step.color,
              backgroundColor: step.bgColor,
            }}
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{step.icon}</div>
              <div className="flex-1">
                <h4
                  className="text-xl font-mono font-bold mb-2"
                  style={{ color: step.color }}
                >
                  {step.title}
                </h4>
                <p className="text-[#f5f1e6] font-mono text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>

            <div
              className="mt-6 p-4 rounded-lg"
              style={{ backgroundColor: "#0a0f0d" }}
            >
              <div className="flex items-center gap-3 mb-3">
                {Array.from({ length: 4 }, (_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-8 h-8 rounded flex items-center justify-center text-xs font-mono"
                    style={{ backgroundColor: step.color, color: "#0a0f0d" }}
                  >
                    T{i + 1}
                  </motion.div>
                ))}
                <motion.div
                  animate={{ x: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-[#c9a227]"
                >
                  →
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="w-10 h-8 rounded flex items-center justify-center text-xs font-mono font-bold"
                  style={{ backgroundColor: step.color, color: "#0a0f0d" }}
                >
                  {step.title.slice(0, 3).toUpperCase()}
                </motion.div>
              </div>
              <p className="text-xs font-mono text-[#8a7359]">
                {step.title === "Input" &&
                  "The transformer processes the entire sequence in parallel"}
                {step.title === "Tokenization" &&
                  "Subword tokenization with BPE or WordPiece"}
                {step.title === "Embedding" &&
                  "Learned embeddings + sinusoidal positional encodings"}
                {step.title === "Self-Attention" &&
                  "Attention(Q,K,V) = softmax(QK^T / √d_k) V"}
                {step.title === "Feed Forward" &&
                  "FFN(x) = max(0, xW₁ + b₁)W₂ + b₂"}
                {step.title === "Output" &&
                  "Linear projection + softmax over vocabulary"}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex justify-between">
        <button
          onClick={goPrev}
          disabled={currentStep === 1}
          className="px-4 py-2 font-mono text-sm rounded border border-[#1a3a2a] text-[#f5f1e6] hover:bg-[#1a3a2a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>
        <button
          onClick={goNext}
          disabled={currentStep === steps.length}
          className="px-4 py-2 font-mono text-sm rounded border border-[#1a3a2a] text-[#f5f1e6] hover:bg-[#1a3a2a] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
