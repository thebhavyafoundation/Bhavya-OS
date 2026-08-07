"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RAGExplorerProps {
  query?: string;
}

interface Document {
  id: number;
  title: string;
  content: string;
  relevance: number;
}

const defaultQuery = "What are transformers in machine learning?";

const sampleDocuments: Document[] = [
  {
    id: 1,
    title: "Transformer Architecture Explained",
    content:
      'Transformers are deep learning models that use self-attention mechanisms to process sequential data. They were introduced in the landmark paper "Attention Is All You Need" by Vaswani et al.',
    relevance: 0.95,
  },
  {
    id: 2,
    title: "Introduction to Neural Networks",
    content:
      "Neural networks are computing systems inspired by biological neural networks. They consist of layers of interconnected nodes that process information using connectionist approaches.",
    relevance: 0.72,
  },
  {
    id: 3,
    title: "Machine Learning Fundamentals",
    content:
      "Machine learning is a subset of artificial intelligence that enables systems to learn from data. It includes supervised learning, unsupervised learning, and reinforcement learning.",
    relevance: 0.65,
  },
];

export function RAGExplorer({
  query: initialQuery = defaultQuery,
}: RAGExplorerProps) {
  const [query, setQuery] = useState(initialQuery);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [generatedAnswer, setGeneratedAnswer] = useState("");

  const steps = [
    { id: 0, title: "Query", icon: "🔍", color: "#3b82f6" },
    { id: 1, title: "Retrieve", icon: "📚", color: "#22c55e" },
    { id: 2, title: "Rerank", icon: "🎯", color: "#c9a227" },
    { id: 3, title: "Generate", icon: "✨", color: "#a855f7" },
  ];

  const runPipeline = () => {
    setIsRunning(true);
    setCurrentStep(0);
    setDocuments([]);
    setGeneratedAnswer("");

    setTimeout(() => {
      setCurrentStep(1);
      setTimeout(() => {
        setDocuments(sampleDocuments);
        setCurrentStep(2);
        setTimeout(() => {
          const sortedDocs = [...sampleDocuments].sort(
            (a, b) => b.relevance - a.relevance,
          );
          setDocuments(sortedDocs);
          setCurrentStep(3);
          setTimeout(() => {
            setGeneratedAnswer(
              `Transformers are a revolutionary architecture in machine learning that use self-attention mechanisms to process sequential data. Introduced in the 2017 paper "Attention Is All You Need", they have become the foundation for modern NLP models like BERT and GPT. The key innovation is the self-attention mechanism, which allows the model to weigh the importance of different parts of the input when producing output. This enables transformers to handle long-range dependencies efficiently and process sequences in parallel, unlike recurrent neural networks.`,
            );
            setIsRunning(false);
          }, 1500);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  const resetPipeline = () => {
    setCurrentStep(0);
    setDocuments([]);
    setGeneratedAnswer("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-mono font-bold text-[#c9a227]">
          RAG Pipeline Explorer
        </h3>
        <div className="flex gap-2">
          <button
            onClick={resetPipeline}
            disabled={isRunning}
            className="px-3 py-1 text-xs font-mono rounded bg-[#1a3a2a] text-[#8a7359] hover:bg-[#c9a227] hover:text-[#0a0f0d] transition-colors disabled:opacity-50"
          >
            Reset
          </button>
          <button
            onClick={runPipeline}
            disabled={isRunning}
            className="px-3 py-1 text-xs font-mono rounded bg-[#c9a227] text-[#0a0f0d] hover:bg-[#8a7359] transition-colors disabled:opacity-50"
          >
            {isRunning ? "Running..." : "Run Pipeline"}
          </button>
        </div>
      </div>

      <div
        className="p-4 rounded-lg border border-[#1a3a2a]"
        style={{ backgroundColor: "#0a0f0d" }}
      >
        <h4 className="text-sm font-mono font-bold text-[#3b82f6] mb-2">
          Query
        </h4>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 rounded bg-transparent text-[#f5f1e6] font-mono text-sm resize-none focus:outline-none"
          style={{ backgroundColor: "#0a0f0d", minHeight: "60px" }}
          disabled={isRunning}
          spellCheck={false}
        />
      </div>

      <div className="flex items-center justify-center gap-2">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center">
            <motion.div
              animate={{
                scale: currentStep === step.id ? 1.1 : 1,
                opacity: currentStep >= step.id ? 1 : 0.5,
              }}
              className={`px-3 py-2 rounded-lg font-mono text-sm flex items-center gap-2 transition-all duration-300 ${
                currentStep === step.id ? "ring-2" : ""
              }`}
              style={{
                backgroundColor:
                  currentStep >= step.id ? step.color : "#1a3a2a",
                color: currentStep >= step.id ? "#0a0f0d" : "#8a7359",
                ringColor: step.color,
              }}
            >
              <span>{step.icon}</span>
              <span className="font-bold">{step.title}</span>
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div
                animate={{ opacity: currentStep > step.id ? 1 : 0.3 }}
                className="w-8 h-px mx-2"
                style={{ backgroundColor: step.color }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div
          className="p-4 rounded-lg border border-[#1a3a2a]"
          style={{ backgroundColor: "#0a0f0d" }}
        >
          <h4 className="text-sm font-mono font-bold text-[#22c55e] mb-3">
            Retrieved Documents
          </h4>
          <div className="space-y-3">
            <AnimatePresence>
              {documents.map((doc, i) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="p-3 rounded border border-[#1a3a2a]"
                  style={{ backgroundColor: "#0a0f0d" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-[#c9a227]">
                      {doc.title}
                    </span>
                    <span
                      className="text-xs font-mono px-2 py-0.5 rounded"
                      style={{
                        backgroundColor:
                          doc.relevance > 0.8
                            ? "#22c55e"
                            : doc.relevance > 0.6
                              ? "#c9a227"
                              : "#8a7359",
                        color: "#0a0f0d",
                      }}
                    >
                      {(doc.relevance * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-xs font-mono text-[#8a7359] line-clamp-2">
                    {doc.content}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
            {documents.length === 0 && (
              <p className="text-xs font-mono text-[#8a7359] text-center py-4">
                Run pipeline to retrieve documents
              </p>
            )}
          </div>
        </div>

        <div
          className="p-4 rounded-lg border border-[#1a3a2a]"
          style={{ backgroundColor: "#0a0f0d" }}
        >
          <h4 className="text-sm font-mono font-bold text-[#a855f7] mb-3">
            Generated Answer
          </h4>
          {generatedAnswer ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 rounded border border-[#a855f7]"
              style={{ backgroundColor: "rgba(168, 85, 247, 0.1)" }}
            >
              <p className="text-sm font-mono text-[#f5f1e6] leading-relaxed">
                {generatedAnswer}
              </p>
            </motion.div>
          ) : (
            <p className="text-xs font-mono text-[#8a7359] text-center py-4">
              Run pipeline to generate answer
            </p>
          )}
        </div>
      </div>

      <div
        className="p-4 rounded-lg border border-[#1a3a2a]"
        style={{ backgroundColor: "#0a0f0d" }}
      >
        <h4 className="text-sm font-mono font-bold text-[#c9a227] mb-3">
          Pipeline Flow
        </h4>
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <motion.div
                animate={{
                  scale: currentStep === step.id ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: 1,
                  repeat: currentStep === step.id ? Infinity : 0,
                }}
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
                style={{
                  backgroundColor:
                    currentStep >= step.id ? step.color : "#1a3a2a",
                  color: currentStep >= step.id ? "#0a0f0d" : "#8a7359",
                }}
              >
                {step.icon}
              </motion.div>
              {i < steps.length - 1 && (
                <motion.div
                  animate={{
                    opacity: currentStep > step.id ? 1 : 0.3,
                    scaleX: currentStep > step.id ? 1 : 0.5,
                  }}
                  className="w-16 h-1 mx-2"
                  style={{ backgroundColor: step.color }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3">
          {steps.map((step) => (
            <span
              key={step.id}
              className="text-xs font-mono text-[#8a7359] w-12 text-center"
            >
              {step.title}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
