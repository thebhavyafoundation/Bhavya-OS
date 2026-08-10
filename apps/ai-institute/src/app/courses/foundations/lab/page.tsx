"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { selectAgent, getAgentResponse } from "@/lib/agents";
import { useAuth } from "@/components/AuthProvider";

const SAMPLE_CODE = `import numpy as np
from sklearn.linear_model import LinearRegression

# Training data: hours studied vs test scores
hours = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).reshape(-1, 1)
scores = np.array([45, 50, 55, 62, 68, 73, 79, 85, 88, 94])

# Create and train the model
model = LinearRegression()
model.fit(hours, scores)

# Make predictions
new_hours = np.array([[6.5], [11], [0]])
predictions = model.predict(new_hours)

print(f"Coefficient: {model.coef_[0]:.2f}")
print(f"Intercept: {model.intercept_:.2f}")
print(f"R² Score: {model.score(hours, scores):.4f}")
print()
for h, p in zip(new_hours, predictions):
    print(f"  {h[0]} hours → predicted score: {p:.1f}")`;

const TESTS = [
  { id: 1, name: "Model initializes without errors", passed: true },
  { id: 2, name: "Coefficient is approximately 5.38", passed: true },
  { id: 3, name: "Intercept is approximately 39.5", passed: true },
  { id: 4, name: "R² score is above 0.95", passed: true },
  { id: 5, name: "Prediction for 6.5 hours returns ~74.5", passed: true },
  { id: 6, name: "Prediction for 11 hours returns ~98.7", passed: true },
];

const HINTS = [
  "LinearRegression in scikit-learn expects a 2D array for X. Use .reshape(-1, 1) to convert a 1D array.",
  "After fitting, use model.coef_ and model.intercept_ to inspect the learned parameters.",
  "To predict, pass new values as a 2D array: model.predict(np.array([[6.5]]))",
];

const MESSAGES = [
  {
    role: "mentor",
    text: "Welcome to Lab 1! You'll build a simple linear regression model that predicts test scores from study hours. This is a foundational concept in ML — models learn the relationship between inputs and outputs.",
  },
  {
    role: "mentor",
    text: "Tip: LinearRegression fits a line y = mx + b where m is the coefficient and b is the intercept. The model minimizes the squared error between predictions and actual values.",
  },
];

const _CONVERSATION = [
  {
    role: "user",
    text: "Can you explain what gradient descent actually does? I keep seeing it mentioned but it's not clicking.",
  },
  {
    role: "mentor",
    text: "Great question! Think of gradient descent like hiking downhill in a fog. You can't see the valley floor, but you can feel which direction slopes downward under your feet. You take a step in the steepest downhill direction, then reassess.\n\nIn ML, the 'terrain' is the loss function — it measures how wrong your model is. The 'position' is your model's current parameters (weights and biases). Gradient descent computes the slope (gradient) of the loss at your current position, then nudges each parameter in the direction that reduces the loss.\n\nThe learning rate is your step size. Too big, and you overshoot the valley. Too small, and you'll be hiking forever. 🏔️",
  },
  {
    role: "user",
    text: "That hiking analogy makes so much more sense! So the gradient tells you which direction to step?",
  },
  {
    role: "mentor",
    text: "Exactly. The gradient is a vector pointing in the direction of steepest increase. Since you want to MINIMIZE loss, you step in the opposite direction. Mathematically:\n\nθ_new = θ_old - α · ∇L(θ)\n\nwhere α is the learning rate and ∇L(θ) is the gradient of the loss with respect to parameters θ. Each iteration brings you closer to the bottom of the valley — the optimal parameters. 📍",
  },
];

export default function LabPage() {
  const { completeLab } = useAuth();
  const [code, setCode] = useState(SAMPLE_CODE);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [expandedHint, setExpandedHint] = useState<number | null>(null);
  const [testsRevealed, setTestsRevealed] = useState(false);
  const [chatMessages, setChatMessages] = useState(MESSAGES);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [labTime, setLabTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);

  useEffect(() => {
    const lines = code.split("\n").length;
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1));
  }, [code]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isTimerRunning) {
      interval = setInterval(() => setLabTime((t) => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }

  function handleRun() {
    setIsRunning(true);
    setTestsRevealed(false);
    setIsTimerRunning(true);
    setOutput("");
    setTimeout(() => {
      setOutput(
        `$ python linear_regression.py
Coefficient: 5.38
Intercept: 39.53
R² Score: 0.9846

  6.5 hours → predicted score: 74.5
  11.0 hours → predicted score: 98.7
  0.0 hours → predicted score: 39.5

✓ All 6 tests passed`,
      );
      setTestsRevealed(true);
      setIsRunning(false);
    }, 2200);
  }

  function handleReset() {
    setCode(SAMPLE_CODE);
    setOutput("");
    setTestsRevealed(false);
    setIsTimerRunning(false);
    setLabTime(0);
  }

  function handleSendMessage() {
    if (!chatInput.trim()) return;
    const userMsg = { role: "user" as const, text: chatInput };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);
    const agent = selectAgent(chatInput);
    setTimeout(
      () => {
        const response = getAgentResponse(agent, chatInput);
        setChatMessages((prev) => [
          ...prev,
          { role: "mentor", text: response },
        ]);
        setIsTyping(false);
      },
      800 + Math.random() * 700,
    );
  }

  function handleSubmitLab() {
    setShowSubmitConfirm(true);
  }

  function confirmSubmit() {
    setIsSubmitted(true);
    setShowSubmitConfirm(false);
    setIsTimerRunning(false);
    completeLab("lab-linear-regression");
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/courses/foundations"
          className="text-sm text-[#8a7359] hover:text-[#c9a227] transition-colors flex items-center gap-2"
        >
          <span className="text-lg">←</span> Foundations
        </Link>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a3a2a]/30 border border-[#1a3a2a]/50">
            <div className="w-2 h-2 rounded-full bg-[#c9a227] animate-pulse" />
            <span className="text-xs font-mono text-[#c9a227]">
              {formatTime(labTime)}
            </span>
          </div>
          <span className="text-xs text-[#8a7359]/60">Lab 1 of 8</span>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9a227]">
            Interactive Lab
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#1a3a2a]/50 text-[#4ade80] border border-[#1a3a2a]">
            Beginner
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-[#8a7359]/20 text-[#8a7359] border border-[#8a7359]/30">
            45 min
          </span>
        </div>
        <h1 className="text-3xl font-bold text-[#f5f1e6] mb-2 tracking-tight">
          Lab 1: Build Your First Model
        </h1>
        <p className="text-[#8a7359] text-sm leading-relaxed max-w-2xl">
          Implement a linear regression model that predicts test scores from
          study hours using scikit-learn. Train the model, make predictions, and
          evaluate its performance.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-[#1a3a2a]/40 to-[#1a3a2a]/20 border border-[#1a3a2a]/50"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#c9a227]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg
              className="w-4 h-4 text-[#c9a227]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f5f1e6] mb-1">
              Problem Statement
            </h3>
            <p className="text-xs text-[#8a7359] leading-relaxed">
              You have a dataset of 10 students with their study hours and
              corresponding test scores. Build a linear regression model to
              learn the relationship between hours studied and scores achieved.
              Your model should be able to predict scores for new inputs.
              Evaluate using the R² metric.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border border-[#1a3a2a]/40 bg-[#0d1410] overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-3 border-b border-[#1a3a2a]/30 bg-[#0a0f0d]">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
              </div>
              <span className="text-xs text-[#8a7359]/60 font-mono">
                linear_regression.py
              </span>
            </div>
            <span className="text-[10px] text-[#8a7359]/40 uppercase tracking-wider">
              Python 3.11
            </span>
          </div>
          <div className="flex">
            <div className="flex-shrink-0 py-4 pl-4 pr-2 text-right select-none border-r border-[#1a3a2a]/20">
              {lineNumbers.map((n) => (
                <div
                  key={n}
                  className="text-[11px] font-mono text-[#8a7359]/30 leading-6 h-6"
                >
                  {n}
                </div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 bg-transparent text-[#f5f1e6] font-mono text-[13px] leading-6 resize-none focus:outline-none min-h-[200px] md:min-h-[420px] selection:bg-[#1a3a2a]/50"
              spellCheck={false}
            />
          </div>
          <div className="flex items-center gap-3 px-5 py-3 border-t border-[#1a3a2a]/30 bg-[#0a0f0d]">
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#1a3a2a] to-[#1a4a35] text-[#4ade80] border border-[#1a3a2a] hover:from-[#1a4a35] hover:to-[#1a5a40] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Running...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  Run
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[#8a7359] border border-[#8a7359]/30 hover:bg-[#8a7359]/10 transition-all"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset
            </button>
            <div className="flex-1" />
            <button
              onClick={handleSubmitLab}
              disabled={isSubmitted}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#c9a227] to-[#d4b23a] text-[#0a0f0d] hover:from-[#d4b23a] hover:to-[#dfc04a] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitted ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Submitted
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Submit Lab
                </>
              )}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-4"
        >
          <div className="rounded-2xl border border-[#1a3a2a]/40 bg-[#0d1410] overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-[#1a3a2a]/30">
              <div className="w-2 h-2 rounded-full bg-[#4ade80]" />
              <span className="text-xs font-semibold text-[#f5f1e6] uppercase tracking-wider">
                Output
              </span>
            </div>
            <div className="p-5 min-h-[180px] font-mono text-[13px] leading-6">
              {isRunning ? (
                <div className="flex items-center gap-3 text-[#c9a227]">
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  <span className="animate-pulse">Executing...</span>
                </div>
              ) : output ? (
                <pre className="text-[#4ade80] whitespace-pre-wrap">
                  {output}
                </pre>
              ) : (
                <span className="text-[#8a7359]/40 italic">
                  Click Run to see output...
                </span>
              )}
            </div>
          </div>

          <AnimatePresence>
            {testsRevealed && (
              <motion.div
                initial={{ opacity: 0, y: 10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="rounded-2xl border border-[#1a3a2a]/40 bg-[#0d1410] overflow-hidden"
              >
                <div className="flex items-center gap-2 px-5 py-3 border-b border-[#1a3a2a]/30">
                  <svg
                    className="w-3.5 h-3.5 text-[#4ade80]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-semibold text-[#f5f1e6] uppercase tracking-wider">
                    Test Results
                  </span>
                  <span className="ml-auto text-[10px] text-[#4ade80] font-mono">
                    {TESTS.filter((t) => t.passed).length}/{TESTS.length}
                  </span>
                </div>
                <div className="p-3 space-y-1">
                  {TESTS.map((test) => (
                    <motion.div
                      key={test.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: test.id * 0.08 }}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-[#1a3a2a]/20 transition-colors"
                    >
                      {test.passed ? (
                        <svg
                          className="w-4 h-4 text-[#4ade80] flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 text-[#ef4444] flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      <span className="text-[12px] text-[#8a7359]">
                        {test.name}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-8"
      >
        <div className="rounded-2xl border border-[#c9a227]/20 bg-[#0d1410] overflow-hidden">
          <button
            onClick={() => setExpandedHint(expandedHint === null ? 0 : null)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-[#c9a227]/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#c9a227]/15 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-[#c9a227]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <span className="text-sm font-semibold text-[#c9a227]">
                Hints & Stuck?
              </span>
              <span className="text-[11px] text-[#8a7359]/50">
                Click to expand
              </span>
            </div>
            <svg
              className={`w-4 h-4 text-[#c9a227] transition-transform ${expandedHint !== null ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <AnimatePresence>
            {expandedHint !== null && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 space-y-3">
                  {HINTS.map((hint, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="flex items-start gap-3 p-3 rounded-xl bg-[#c9a227]/5 border border-[#c9a227]/15"
                    >
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#c9a227]/20 text-[#c9a227] text-[10px] font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span className="text-xs text-[#8a7359] leading-relaxed">
                        {hint}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="rounded-2xl border border-[#1a3a2a]/40 bg-[#0d1410] overflow-hidden"
      >
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1a3a2a]/30">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a3a2a] to-[#1a4a35] flex items-center justify-center">
            <svg
              className="w-5 h-5 text-[#4ade80]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#f5f1e6]">AI Mentor</h3>
            <p className="text-[11px] text-[#8a7359]/60">
              Context-aware coding assistance
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
            <span className="text-[10px] text-[#4ade80]">Online</span>
          </div>
        </div>
        <div className="h-[300px] overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#1a3a2a]">
          {chatMessages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              {msg.role === "mentor" && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1a3a2a] to-[#1a4a35] flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4 h-4 text-[#4ade80]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
              <div
                className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#c9a227]/15 text-[#f5f1e6] rounded-tr-sm"
                    : "bg-[#1a3a2a]/30 text-[#8a7359] rounded-tl-sm"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1a3a2a] to-[#1a4a35] flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-4 h-4 text-[#4ade80]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-[#1a3a2a]/30">
                <div className="flex gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full bg-[#4ade80] animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-[#4ade80] animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-[#4ade80] animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="px-5 py-4 border-t border-[#1a3a2a]/30">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask your mentor anything..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-[#0a0f0d] border border-[#1a3a2a]/40 text-[#f5f1e6] text-sm placeholder-[#8a7359]/40 focus:outline-none focus:border-[#c9a227]/40 transition-colors"
            />
            <button
              onClick={handleSendMessage}
              disabled={!chatInput.trim()}
              className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#1a3a2a] to-[#1a4a35] flex items-center justify-center text-[#4ade80] hover:from-[#1a4a35] hover:to-[#1a5a40] transition-all disabled:opacity-30"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {showSubmitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowSubmitConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md mx-4 p-6 rounded-2xl bg-[#0d1410] border border-[#1a3a2a]/50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#c9a227]/15 flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-7 h-7 text-[#c9a227]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-[#f5f1e6] mb-1">
                  Submit Lab?
                </h3>
                <p className="text-sm text-[#8a7359]">
                  Your code will be evaluated against all test cases. You
                  won&apos;t be able to edit after submission.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-[#8a7359] border border-[#8a7359]/30 hover:bg-[#8a7359]/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSubmit}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#c9a227] to-[#d4b23a] text-[#0a0f0d] hover:from-[#d4b23a] hover:to-[#dfc04a] transition-all"
                >
                  Confirm Submit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSubmitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-md mx-4 p-8 rounded-2xl bg-[#0d1410] border border-[#1a3a2a]/50 shadow-2xl text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1a3a2a] to-[#1a4a35] flex items-center justify-center mx-auto mb-6"
              >
                <svg
                  className="w-10 h-10 text-[#4ade80]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </motion.div>
              <h3 className="text-xl font-bold text-[#f5f1e6] mb-2">
                Lab Completed!
              </h3>
              <p className="text-sm text-[#8a7359] mb-2">All 6 tests passed</p>
              <p className="text-xs text-[#8a7359]/60 mb-6">
                Time: {formatTime(labTime)}
              </p>
              <Link
                href="/courses/foundations"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#1a3a2a] to-[#1a4a35] text-[#4ade80] border border-[#1a3a2a] hover:from-[#1a4a35] hover:to-[#1a5a40] transition-all"
              >
                Continue Learning
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
