"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: "user" as const,
    text: "Can you explain what gradient descent actually does? I keep seeing it mentioned but it's not clicking.",
    time: "2:34 PM",
  },
  {
    id: 2,
    role: "mentor" as const,
    text: "Great question! Think of gradient descent like hiking downhill in a fog. You can't see the valley floor, but you can feel which direction slopes downward under your feet. You take a step in the steepest downhill direction, then reassess.\n\nIn ML, the 'terrain' is the loss function — it measures how wrong your model is. The 'position' is your model's current parameters (weights and biases). Gradient descent computes the slope (gradient) of the loss at your current position, then nudges each parameter in the direction that reduces the loss.\n\nThe learning rate is your step size. Too big, and you overshoot the valley. Too small, and you'll be hiking forever. 🏔️",
    time: "2:34 PM",
  },
  {
    id: 3,
    role: "user" as const,
    text: "That hiking analogy makes so much more sense! So the gradient tells you which direction to step?",
    time: "2:36 PM",
  },
  {
    id: 4,
    role: "mentor" as const,
    text: "Exactly. The gradient is a vector pointing in the direction of steepest increase. Since you want to MINIMIZE loss, you step in the opposite direction. Mathematically:\n\nθ_new = θ_old - α · ∇L(θ)\n\nwhere α is the learning rate and ∇L(θ) is the gradient of the loss with respect to parameters θ. Each iteration brings you closer to the bottom of the valley — the optimal parameters. 📍",
    time: "2:36 PM",
  },
];

const QUICK_ACTIONS = [
  { label: "Explain concept", icon: "💡" },
  { label: "Quiz me", icon: "🧠" },
  { label: "Show example", icon: "📝" },
  { label: "Review my code", icon: "🔍" },
  { label: "Suggest next steps", icon: "🗺️" },
];

const STRENGTHS = [
  "Variables & Data Types",
  "Control Flow",
  "Basic Algorithms",
];

const WEAKNESSES = ["Recursion", "Big-O Notation"];

const GOALS = [
  "Complete Foundations course",
  "Build first ML model",
  "Join AI cohort",
];

const MENTOR_RESPONSES: Record<string, string> = {
  "explain concept":
    "Sure! Which concept would you like me to explain? I can break down any topic from your current lesson into digestible parts with real-world analogies.\n\nBased on your progress, you're working through Linear Algebra basics — I'd recommend starting with **matrix multiplication** since it's foundational for neural networks.",
  "quiz me":
    "Let's test your knowledge! 🧠\n\n**Question 1:** What is the time complexity of binary search?\n\nA) O(n)\nB) O(log n)\nC) O(n²)\nD) O(1)\n\nTake your time — think about what happens to the search space with each comparison.",
  "show example":
    "Here's a practical example from today's lesson:\n\n```python\nimport numpy as np\n\n# Matrix multiplication in action\nA = np.array([[1, 2], [3, 4]])  # 2x2 matrix\nB = np.array([[5, 6], [7, 8]])  # 2x2 matrix\n\nC = A @ B  # Matrix multiplication\nprint(C)\n# [[19 22]\n#  [43 50]]\n```\n\nNotice how each element in C is the dot product of a row from A and a column from B.",
  "review my code":
    "I'd be happy to review your code! Share it in the chat and I'll check for:\n\n• Correctness — does it solve the problem?\n• Efficiency — can it be optimized?\n• Readability — is it clean and maintainable?\n• Best practices — naming, structure, error handling",
  "suggest next steps":
    "Based on your current progress, here's what I recommend:\n\n1. **Complete Module 2** — you're 60% through\n2. **Practice recursion** — your weakest area\n3. **Build a mini-project** — apply what you've learned\n4. **Join the study group** — peer learning accelerates understanding\n\nShall I create a personalized study plan for this week?",
  default:
    "That's a great question! Let me think about the best way to explain this...\n\nThe key insight here is that understanding builds on itself. Make sure you're comfortable with the fundamentals before moving to advanced topics. Would you like me to:\n\n• Break this down into simpler parts\n• Show a real-world analogy\n• Give you a practice exercise",
};

const SUGGESTIONS = [
  "What is backpropagation?",
  "Explain overfitting simply",
  "How does a neural network learn?",
  "Show me a decision tree example",
];

export default function MentorPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<"progress" | "goals">("progress");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [nextId, setNextId] = useState(5);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
    const userMsg = {
      id: nextId,
      role: "user" as const,
      text: text.trim(),
      time,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setNextId((n) => n + 1);
    setIsTyping(true);

    setTimeout(
      () => {
        const key =
          Object.keys(MENTOR_RESPONSES).find((k) =>
            text.toLowerCase().includes(k),
          ) || "default";
        const mentorMsg = {
          id: nextId + 1,
          role: "mentor" as const,
          text: MENTOR_RESPONSES[key],
          time,
        };
        setMessages((prev) => [...prev, mentorMsg]);
        setIsTyping(false);
        setNextId((n) => n + 2);
      },
      1500 + Math.random() * 1000,
    );
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-[#8a7359] hover:text-[#c9a227] transition-colors flex items-center gap-2"
        >
          <span className="text-lg">←</span> Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
          <span className="text-xs text-[#4ade80]">Mentor Online</span>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-[#f5f1e6] tracking-tight mb-1">
          AI Mentor
        </h1>
        <p className="text-sm text-[#8a7359]">
          Your personal AI learning companion
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          <div className="rounded-2xl border border-[#1a3a2a]/40 bg-[#0d1410] overflow-hidden">
            <div className="p-5 border-b border-[#1a3a2a]/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1a3a2a] to-[#1a4a35] flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-[#4ade80]"
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
                  <h3 className="text-sm font-semibold text-[#f5f1e6]">
                    Current Lesson
                  </h3>
                  <p className="text-[11px] text-[#8a7359]">
                    Module 2: Linear Algebra Basics
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#8a7359]">Lesson progress</span>
                  <span className="text-[#c9a227] font-mono">73%</span>
                </div>
                <div className="h-1.5 bg-[#1a3a2a]/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "73%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-gradient-to-r from-[#1a3a2a] to-[#4ade80] rounded-full"
                  />
                </div>
              </div>
            </div>
            <div className="p-5">
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setActiveTab("progress")}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === "progress"
                      ? "bg-[#1a3a2a]/50 text-[#4ade80] border border-[#1a3a2a]"
                      : "text-[#8a7359]/60 hover:text-[#8a7359]"
                  }`}
                >
                  Progress
                </button>
                <button
                  onClick={() => setActiveTab("goals")}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === "goals"
                      ? "bg-[#1a3a2a]/50 text-[#4ade80] border border-[#1a3a2a]"
                      : "text-[#8a7359]/60 hover:text-[#8a7359]"
                  }`}
                >
                  Goals
                </button>
              </div>
              {activeTab === "progress" ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.15em] text-[#4ade80] font-semibold mb-2">
                      Strengths
                    </h4>
                    <div className="space-y-1.5">
                      {STRENGTHS.map((s) => (
                        <div
                          key={s}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a3a2a]/20 border border-[#1a3a2a]/30"
                        >
                          <svg
                            className="w-3.5 h-3.5 text-[#4ade80] flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-xs text-[#8a7359]">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] uppercase tracking-[0.15em] text-[#c9a227] font-semibold mb-2">
                      Needs Practice
                    </h4>
                    <div className="space-y-1.5">
                      {WEAKNESSES.map((w) => (
                        <div
                          key={w}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#c9a227]/5 border border-[#c9a227]/15"
                        >
                          <svg
                            className="w-3.5 h-3.5 text-[#c9a227] flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                            />
                          </svg>
                          <span className="text-xs text-[#8a7359]">{w}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {GOALS.map((g, i) => (
                    <div
                      key={g}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#1a3a2a]/15 border border-[#1a3a2a]/25"
                    >
                      <div className="w-5 h-5 rounded-full border border-[#8a7359]/30 flex items-center justify-center flex-shrink-0">
                        {i === 0 ? (
                          <svg
                            className="w-3 h-3 text-[#c9a227]"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : null}
                      </div>
                      <span className="text-xs text-[#8a7359]">{g}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-[#1a3a2a]/40 bg-[#0d1410] p-5">
            <h4 className="text-[10px] uppercase tracking-[0.15em] text-[#c9a227] font-semibold mb-3">
              Suggested Topics
            </h4>
            <div className="space-y-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="w-full text-left px-3 py-2.5 rounded-lg bg-[#c9a227]/5 border border-[#c9a227]/15 text-xs text-[#8a7359] hover:bg-[#c9a227]/10 hover:border-[#c9a227]/25 transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border border-[#1a3a2a]/40 bg-[#0d1410] overflow-hidden flex flex-col"
        >
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1a3a2a]/30">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a3a2a] to-[#1a4a35] flex items-center justify-center">
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#f5f1e6]">
                Chat with Mentor
              </h3>
              <p className="text-[11px] text-[#8a7359]/60">
                Ask anything about your lesson
              </p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
              <span className="text-[10px] text-[#4ade80]">Active</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 max-h-[520px] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#1a3a2a]">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {msg.role === "mentor" && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a3a2a] to-[#1a4a35] flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4.5 h-4.5 text-[#4ade80]"
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
                  className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#c9a227]/15 text-[#f5f1e6] rounded-tr-sm"
                        : "bg-[#1a3a2a]/30 text-[#8a7359] rounded-tl-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-[#8a7359]/40 mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a3a2a] to-[#1a4a35] flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-4.5 h-4.5 text-[#4ade80]"
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
                  <div className="flex gap-1.5 items-center">
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
                    <span className="text-[10px] text-[#4ade80]/60 ml-1">
                      Mentor is typing...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="px-5 py-3 border-t border-[#1a3a2a]/30">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.label)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1a3a2a]/20 border border-[#1a3a2a]/40 text-[11px] text-[#8a7359] hover:bg-[#1a3a2a]/40 hover:text-[#f5f1e6] transition-all whitespace-nowrap flex-shrink-0"
                >
                  <span>{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 py-4 border-t border-[#1a3a2a]/30">
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask your mentor anything..."
                className="flex-1 px-4 py-3 rounded-xl bg-[#0a0f0d] border border-[#1a3a2a]/40 text-[#f5f1e6] text-sm placeholder-[#8a7359]/40 focus:outline-none focus:border-[#c9a227]/40 transition-colors"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                className="w-11 h-11 rounded-xl bg-gradient-to-r from-[#1a3a2a] to-[#1a4a35] flex items-center justify-center text-[#4ade80] hover:from-[#1a4a35] hover:to-[#1a5a40] transition-all disabled:opacity-30 flex-shrink-0"
              >
                <svg
                  className="w-5 h-5"
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
            <div className="flex items-center justify-center mt-2">
              <span className="text-[10px] text-[#8a7359]/30">
                Press{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-[#1a3a2a]/30 text-[#8a7359]/50 font-mono">
                  ⌘
                </kbd>{" "}
                +{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-[#1a3a2a]/30 text-[#8a7359]/50 font-mono">
                  Enter
                </kbd>{" "}
                to send
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
