"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  agents,
  selectAgent,
  getAgentResponse,
  type Agent,
} from "@/lib/agents";

interface Message {
  id: number;
  role: "user" | "mentor";
  text: string;
  time: string;
  agentId?: string;
}

const QUICK_ACTIONS = [
  { label: "Explain concept", icon: "💡" },
  { label: "Quiz me", icon: "🧠" },
  { label: "Show example", icon: "📝" },
  { label: "Review my code", icon: "🔍" },
  { label: "Suggest next steps", icon: "🗺️" },
];

const SUGGESTIONS = [
  "What is backpropagation?",
  "Explain overfitting simply",
  "How does a neural network learn?",
  "Show me a decision tree example",
  "How do I deploy a model?",
  "What are AI ethics?",
];

export default function MentorPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent>(agents[0]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 1,
          role: "mentor",
          text: selectedAgent.greeting,
          time: new Date().toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          }),
          agentId: selectedAgent.id,
        },
      ]);
      setNextId(2);
    }
  }, [selectedAgent.id]);

  function sendMessage(text: string) {
    if (!text.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    const agent = selectAgent(text);
    if (agent.id !== selectedAgent.id) {
      setSelectedAgent(agent);
    }

    const userMsg: Message = {
      id: nextId,
      role: "user",
      text: text.trim(),
      time,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setNextId((n) => n + 1);
    setIsTyping(true);

    setTimeout(
      () => {
        const response = getAgentResponse(agent, text);
        const mentorMsg: Message = {
          id: nextId + 1,
          role: "mentor",
          text: response,
          time,
          agentId: agent.id,
        };
        setMessages((prev) => [...prev, mentorMsg]);
        setIsTyping(false);
        setNextId((n) => n + 2);
      },
      800 + Math.random() * 700,
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
          <span className="text-lg">&larr;</span> Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-pulse" />
          <span className="text-xs text-[#4ade80]">Mentors Online</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-[#f5f1e6] tracking-tight mb-1">
          AI Mentors
        </h1>
        <p className="text-sm text-[#8a7359]">
          8 specialized mentors for every aspect of your learning journey
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
            <div className="p-4 border-b border-[#1a3a2a]/30">
              <h3 className="text-[10px] uppercase tracking-[0.15em] text-[#c9a227] font-semibold mb-3">
                Choose a Mentor
              </h3>
              <div className="space-y-2">
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => {
                      setSelectedAgent(agent);
                      setMessages([
                        {
                          id: Date.now(),
                          role: "mentor",
                          text: agent.greeting,
                          time: new Date().toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          }),
                          agentId: agent.id,
                        },
                      ]);
                      setNextId(Date.now() + 1);
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                      selectedAgent.id === agent.id
                        ? "bg-[#1a3a2a]/40 border border-[#1a3a2a]"
                        : "bg-[#1a3a2a]/10 border border-transparent hover:bg-[#1a3a2a]/20"
                    }`}
                  >
                    <span className="text-xl">{agent.avatar}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-[#f5f1e6]">
                          {agent.name}
                        </span>
                        <span className="text-[9px] text-[#8a7359] bg-[#1a3a2a]/40 px-1.5 py-0.5 rounded">
                          {agent.role}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#8a7359] truncate mt-0.5">
                        {agent.personality}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4">
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
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-2xl border border-[#1a3a2a]/40 bg-[#0d1410] overflow-hidden flex flex-col"
        >
          <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1a3a2a]/30">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1a3a2a] to-[#1a4a35] flex items-center justify-center text-lg">
              {selectedAgent.avatar}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[#f5f1e6]">
                {selectedAgent.name}
              </h3>
              <p className="text-[11px] text-[#8a7359]/60">
                {selectedAgent.role} — {selectedAgent.teachingStyle} style
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
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a3a2a] to-[#1a4a35] flex items-center justify-center flex-shrink-0 text-base">
                    {agents.find((a) => a.id === msg.agentId)?.avatar || "🤖"}
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
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a3a2a] to-[#1a4a35] flex items-center justify-center flex-shrink-0 text-base">
                  {selectedAgent.avatar}
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
                      {selectedAgent.name} is thinking...
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
                placeholder={`Ask ${selectedAgent.name} anything...`}
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
