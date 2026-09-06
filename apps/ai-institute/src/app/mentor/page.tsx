"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  publicAgents,
  selectPublicAgent,
  getPublicAgentResponse,
  type PublicAgent,
} from "@/lib/public-agents";

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
  const [selectedAgent, setSelectedAgent] = useState<PublicAgent>(
    publicAgents[0],
  );
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

    const agent = selectPublicAgent(text);
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
        const response = getPublicAgentResponse(agent, text);
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
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-tertiary)",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            transition: "color var(--duration-fast) ease",
          }}
        >
          <span style={{ fontSize: "var(--text-lg)" }}>&larr;</span> Dashboard
        </Link>
        <div className="flex items-center gap-2">
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--color-status-success)",
              animation: "pulse-soft 2s infinite",
            }}
          />
          <span
            style={{
              fontSize: "var(--text-xs)",
              color: "var(--color-status-success)",
            }}
          >
            Mentors Online
          </span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "var(--text-3xl)",
            fontWeight: 400,
            color: "var(--color-text-primary)",
            marginBottom: "var(--space-1)",
          }}
        >
          AI Mentors
        </h1>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-tertiary)",
          }}
        >
          8 specialized mentors for every aspect of your learning journey
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-[380px_1fr] gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          <div
            style={{
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--color-border-primary)",
              background: "var(--color-surface)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "var(--space-4)",
                borderBottom: "1px solid var(--color-border-secondary)",
              }}
            >
              <h3
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "var(--color-text-gold)",
                  fontWeight: 600,
                  marginBottom: "var(--space-3)",
                }}
              >
                Choose a Mentor
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-2)",
                }}
              >
                {publicAgents.map((agent) => (
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
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-3)",
                      padding: "var(--space-3)",
                      borderRadius: "var(--radius-lg)",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all var(--duration-fast) ease",
                      background:
                        selectedAgent.id === agent.id
                          ? "var(--color-surface-forest-light)"
                          : "transparent",
                      color: "inherit",
                    }}
                  >
                    <span style={{ fontSize: "var(--text-xl)" }}>
                      {agent.avatar}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex items-center gap-2">
                        <span
                          style={{
                            fontSize: "var(--text-xs)",
                            fontWeight: 600,
                            color: "var(--color-text-primary)",
                          }}
                        >
                          {agent.name}
                        </span>
                        <span
                          style={{
                            fontSize: "9px",
                            color: "var(--color-text-tertiary)",
                            background: "var(--color-surface-2)",
                            padding: "1px 6px",
                            borderRadius: "var(--radius-sm)",
                          }}
                        >
                          {agent.role}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: "10px",
                          color: "var(--color-text-muted)",
                          marginTop: 2,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {agent.personality}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div style={{ padding: "var(--space-4)" }}>
              <h4
                style={{
                  fontSize: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.15em",
                  color: "var(--color-text-gold)",
                  fontWeight: 600,
                  marginBottom: "var(--space-3)",
                }}
              >
                Suggested Topics
              </h4>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "var(--space-2)",
                }}
              >
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      background: "var(--color-surface-2)",
                      border: "1px solid var(--color-border-secondary)",
                      fontSize: "var(--text-xs)",
                      color: "var(--color-text-tertiary)",
                      cursor: "pointer",
                      transition: "all var(--duration-fast) ease",
                    }}
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
          style={{
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--color-border-primary)",
            background: "var(--color-surface)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              padding: "16px 20px",
              borderBottom: "1px solid var(--color-border-secondary)",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: "var(--radius-lg)",
                background:
                  "linear-gradient(135deg, var(--color-forest-800), var(--color-forest-700))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "var(--text-lg)",
              }}
            >
              {selectedAgent.avatar}
            </div>
            <div>
              <h3
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: 600,
                  color: "var(--color-text-primary)",
                }}
              >
                {selectedAgent.name}
              </h3>
              <p
                style={{
                  fontSize: "11px",
                  color: "var(--color-text-muted)",
                }}
              >
                {selectedAgent.role} — {selectedAgent.teachingStyle} style
              </p>
            </div>
            <div
              style={{
                marginLeft: "auto",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--color-status-success)",
                  animation: "pulse-soft 2s infinite",
                }}
              />
              <span
                style={{
                  fontSize: "10px",
                  color: "var(--color-status-success)",
                }}
              >
                Active
              </span>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "var(--space-5)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-5)",
              maxHeight: 520,
            }}
          >
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  display: "flex",
                  gap: "var(--space-3)",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                }}
              >
                {msg.role === "mentor" && (
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "var(--radius-lg)",
                      background:
                        "linear-gradient(135deg, var(--color-forest-800), var(--color-forest-700))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: "var(--text-base)",
                    }}
                  >
                    {publicAgents.find((a) => a.id === msg.agentId)?.avatar ||
                      "🤖"}
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "85%",
                      padding: "12px 16px",
                      borderRadius:
                        msg.role === "user"
                          ? "16px 16px 4px 16px"
                          : "16px 16px 16px 4px",
                      fontSize: "13px",
                      lineHeight: 1.6,
                      background:
                        msg.role === "user"
                          ? "var(--color-surface-forest-light)"
                          : "var(--color-surface-2)",
                      color:
                        msg.role === "user"
                          ? "var(--color-text-primary)"
                          : "var(--color-text-secondary)",
                    }}
                  >
                    <p style={{ whiteSpace: "pre-wrap" }}>{msg.text}</p>
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "var(--color-text-muted)",
                      marginTop: 4,
                      padding: "0 4px",
                    }}
                  >
                    {msg.time}
                  </span>
                </div>
              </motion.div>
            ))}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: "flex", gap: "var(--space-3)" }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "var(--radius-lg)",
                    background:
                      "linear-gradient(135deg, var(--color-forest-800), var(--color-forest-700))",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "var(--text-base)",
                  }}
                >
                  {selectedAgent.avatar}
                </div>
                <div
                  style={{
                    padding: "12px 16px",
                    borderRadius: "16px 16px 16px 4px",
                    background: "var(--color-surface-2)",
                  }}
                >
                  <div className="flex gap-1.5 items-center">
                    {[0, 150, 300].map((delay) => (
                      <span
                        key={delay}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: "var(--color-status-success)",
                          animation: "bounce 1s infinite",
                          animationDelay: `${delay}ms`,
                        }}
                      />
                    ))}
                    <span
                      style={{
                        fontSize: "10px",
                        color: "var(--color-text-muted)",
                        marginLeft: 4,
                      }}
                    >
                      {selectedAgent.name} is thinking...
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div
            style={{
              padding: "12px 20px",
              borderTop: "1px solid var(--color-border-secondary)",
            }}
          >
            <div className="flex gap-2 overflow-x-auto pb-2">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  onClick={() => sendMessage(action.label)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    borderRadius: "var(--radius-full)",
                    background: "var(--color-surface-2)",
                    border: "1px solid var(--color-border-secondary)",
                    fontSize: "11px",
                    color: "var(--color-text-tertiary)",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    transition: "all var(--duration-fast) ease",
                  }}
                >
                  <span>{action.icon}</span>
                  {action.label}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: "16px 20px",
              borderTop: "1px solid var(--color-border-secondary)",
            }}
          >
            <div className="flex items-center gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask ${selectedAgent.name} anything...`}
                style={{
                  flex: 1,
                  padding: "12px 16px",
                  borderRadius: "var(--radius-lg)",
                  background: "var(--color-bg-secondary)",
                  border: "1px solid var(--color-border-primary)",
                  color: "var(--color-text-primary)",
                  fontSize: "var(--text-sm)",
                  outline: "none",
                  transition: "border-color var(--duration-fast) ease",
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-lg)",
                  background: "var(--color-brand-forest)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--color-text-inverse)",
                  border: "none",
                  cursor: "pointer",
                  flexShrink: 0,
                  transition: "all var(--duration-fast) ease",
                  opacity: input.trim() ? 1 : 0.3,
                }}
              >
                <svg
                  style={{ width: 20, height: 20 }}
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
              <span
                style={{ fontSize: "10px", color: "var(--color-text-muted)" }}
              >
                Press{" "}
                <kbd
                  style={{
                    padding: "2px 6px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--color-surface-2)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  ⌘
                </kbd>{" "}
                +{" "}
                <kbd
                  style={{
                    padding: "2px 6px",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--color-surface-2)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
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
