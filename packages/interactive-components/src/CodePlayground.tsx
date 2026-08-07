"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CodePlaygroundProps {
  initialCode?: string;
  language?: string;
  onRun?: (code: string) => void;
}

const defaultCode = `import numpy as np
from sklearn.linear_model import LinearRegression

X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 5, 4, 5])

model = LinearRegression()
model.fit(X, y)

print(f"Coefficient: {model.coef_[0]:.2f}")
print(f"Intercept: {model.intercept_:.2f}")
print(f"R² Score: {model.score(X, y):.2f}")

prediction = model.predict([[6]])
print(f"Prediction for X=6: {prediction[0]:.2f}")`;

export function CodePlayground({
  initialCode = defaultCode,
  language = "python",
  onRun,
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [showOutput, setShowOutput] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [code]);

  const simulateRun = () => {
    setIsRunning(true);
    setShowOutput(false);

    setTimeout(() => {
      const lines = code.split("\n");
      let simulatedOutput = "";

      lines.forEach((line) => {
        if (line.trim().startsWith("print(")) {
          const content = line.match(/print\((.+)\)/)?.[1] || "";
          if (content.includes("Coefficient:")) {
            simulatedOutput += "Coefficient: 0.60\n";
          } else if (content.includes("Intercept:")) {
            simulatedOutput += "Intercept: 2.20\n";
          } else if (content.includes("R² Score:")) {
            simulatedOutput += "R² Score: 0.23\n";
          } else if (content.includes("Prediction for X=6:")) {
            simulatedOutput += "Prediction for X=6: 5.80\n";
          }
        }
      });

      if (!simulatedOutput) {
        simulatedOutput = `>>> ${language} execution completed\n>>> No print output detected`;
      }

      setOutput(simulatedOutput);
      setIsRunning(false);
      setShowOutput(true);
      onRun?.(code);
    }, 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };

  const handleReset = () => {
    setCode(initialCode);
    setOutput("");
    setShowOutput(false);
  };

  const lineCount = code.split("\n").length;

  return (
    <div
      className="rounded-xl overflow-hidden border border-[#1a3a2a]"
      style={{ backgroundColor: "#0a0f0d" }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 border-b border-[#1a3a2a]"
        style={{ backgroundColor: "#1a3a2a" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-sm font-mono text-[#c9a227] uppercase">
            {language}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="px-3 py-1 text-xs font-mono rounded bg-[#0a0f0d] text-[#f5f1e6] hover:bg-[#8a7359] transition-colors"
          >
            Copy
          </button>
          <button
            onClick={handleReset}
            className="px-3 py-1 text-xs font-mono rounded bg-[#0a0f0d] text-[#f5f1e6] hover:bg-[#8a7359] transition-colors"
          >
            Reset
          </button>
          <button
            onClick={simulateRun}
            disabled={isRunning}
            className="px-4 py-1 text-xs font-mono rounded bg-[#c9a227] text-[#0a0f0d] font-bold hover:bg-[#8a7359] transition-colors disabled:opacity-50"
          >
            {isRunning ? "Running..." : "Run"}
          </button>
        </div>
      </div>

      <div className="flex">
        <div
          className="py-4 px-3 text-right select-none border-r border-[#1a3a2a]"
          style={{ minWidth: "3rem" }}
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i} className="text-xs font-mono text-[#8a7359] leading-5">
              {i + 1}
            </div>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 p-4 bg-transparent text-[#f5f1e6] font-mono text-sm resize-none focus:outline-none leading-5"
          style={{ backgroundColor: "transparent" }}
          spellCheck={false}
        />
      </div>

      <AnimatePresence>
        {showOutput && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-[#1a3a2a] overflow-hidden"
          >
            <div className="px-4 py-2 border-b border-[#1a3a2a] flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-xs font-mono text-[#c9a227]">Output</span>
            </div>
            <pre
              className="p-4 text-sm font-mono text-green-400 whitespace-pre-wrap leading-5"
              style={{ backgroundColor: "#0a0f0d" }}
            >
              {output}
            </pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
