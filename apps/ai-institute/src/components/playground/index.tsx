"use client";

import { useState, useCallback } from "react";

interface PlaygroundConfig {
  temperature: number;
  topP: number;
  maxTokens: number;
  systemPrompt: string;
  model: string;
}

interface PlaygroundMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

const models = [
  { id: "gpt-4", name: "GPT-4", provider: "OpenAI" },
  { id: "gpt-3.5", name: "GPT-3.5 Turbo", provider: "OpenAI" },
  { id: "claude-3", name: "Claude 3", provider: "Anthropic" },
  { id: "llama-3", name: "Llama 3", provider: "Meta" },
  { id: "gemini", name: "Gemini", provider: "Google" },
];

const promptTemplates = [
  {
    id: "zero-shot",
    name: "Zero-Shot",
    template: "Answer the following question directly:\n\n{input}",
  },
  {
    id: "few-shot",
    name: "Few-Shot",
    template:
      "Here are some examples:\n\nExample 1: What is 2+2? → 4\nExample 2: What is 3+3? → 6\n\nNow answer: {input}",
  },
  {
    id: "cot",
    name: "Chain-of-Thought",
    template: "Let's think step by step.\n\n{input}\n\nStep 1:",
  },
  {
    id: "system",
    name: "System + User",
    template: "You are a helpful assistant. Answer concisely.\n\nUser: {input}",
  },
  {
    id: "json",
    name: "JSON Output",
    template: "Respond in valid JSON format with a 'answer' field.\n\n{input}",
  },
];

export function AIPromptPlayground() {
  const [config, setConfig] = useState<PlaygroundConfig>({
    temperature: 0.7,
    topP: 1.0,
    maxTokens: 256,
    systemPrompt: "You are a helpful AI assistant.",
    model: "gpt-4",
  });
  const [messages, setMessages] = useState<PlaygroundMessage[]>([]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);

  const generateResponse = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage: PlaygroundMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsGenerating(true);

    // Simulate response generation
    await new Promise((resolve) =>
      setTimeout(resolve, 500 + Math.random() * 1000),
    );

    const responses = [
      `Based on my analysis, ${input.toLowerCase().includes("what") ? "the answer involves understanding the core concepts and applying them systematically." : "this is an interesting topic that deserves careful consideration. Let me break it down."}`,
      `Here's my response to "${input.slice(0, 50)}...": This is a great question! The key insight is that understanding the fundamentals allows you to build more complex systems.`,
      `Let me address your question about "${input.slice(0, 40)}...". The most important thing to remember is the relationship between theory and practice.`,
    ];

    const assistantMessage: PlaygroundMessage = {
      role: "assistant",
      content: responses[Math.floor(Math.random() * responses.length)],
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsGenerating(false);
  }, [input]);

  const clearChat = () => {
    setMessages([]);
    setInput("");
  };

  const applyTemplate = (templateId: string) => {
    const template = promptTemplates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
    }
  };

  const tokenCount = messages.reduce(
    (sum, m) => sum + Math.ceil(m.content.length / 4),
    0,
  );

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">AI Prompt Playground</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowStats(!showStats)}
            className="px-3 py-1 text-xs bg-white/10 rounded-lg hover:bg-white/20"
          >
            {showStats ? "Hide" : "Show"} Stats
          </button>
          <button
            onClick={clearChat}
            className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-4">
          {/* Model Selection */}
          <div>
            <label className="text-xs text-white/40 block mb-1">Model</label>
            <select
              value={config.model}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, model: e.target.value }))
              }
              className="w-full bg-bg-primary/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
            >
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.provider})
                </option>
              ))}
            </select>
          </div>

          {/* Temperature */}
          <div>
            <label className="text-xs text-white/40 block mb-1">
              Temperature: {config.temperature.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.05"
              value={config.temperature}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  temperature: parseFloat(e.target.value),
                }))
              }
              className="w-full accent-accent-green"
            />
            <div className="flex justify-between text-[10px] text-white/30 mt-1">
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </div>

          {/* Top-P */}
          <div>
            <label className="text-xs text-white/40 block mb-1">
              Top-P: {config.topP.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.topP}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  topP: parseFloat(e.target.value),
                }))
              }
              className="w-full accent-blue-500"
            />
          </div>

          {/* Max Tokens */}
          <div>
            <label className="text-xs text-white/40 block mb-1">
              Max Tokens: {config.maxTokens}
            </label>
            <input
              type="range"
              min="64"
              max="2048"
              step="64"
              value={config.maxTokens}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  maxTokens: parseInt(e.target.value),
                }))
              }
              className="w-full accent-gold"
            />
          </div>

          {/* System Prompt */}
          <div>
            <label className="text-xs text-white/40 block mb-1">
              System Prompt
            </label>
            <textarea
              value={config.systemPrompt}
              onChange={(e) =>
                setConfig((prev) => ({ ...prev, systemPrompt: e.target.value }))
              }
              className="w-full bg-bg-primary/30 border border-white/10 rounded-lg px-3 py-2 text-white text-sm h-20 resize-none"
            />
          </div>

          {/* Prompt Templates */}
          <div>
            <label className="text-xs text-white/40 block mb-2">
              Prompt Templates
            </label>
            <div className="space-y-1">
              {promptTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => applyTemplate(t.id)}
                  className={`w-full text-left px-3 py-1.5 text-xs rounded-lg ${
                    selectedTemplate === t.id
                      ? "bg-accent-green text-text-primary"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3 flex flex-col">
          {/* Messages */}
          <div className="flex-1 bg-bg-primary/30 rounded-lg p-4 mb-4 h-80 overflow-y-auto space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-white/30 text-sm py-12">
                Start a conversation to see how different parameters affect the
                output.
              </div>
            )}
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-accent-gold text-white"
                      : "bg-white/10 text-white/80"
                  }`}
                >
                  <div className="text-[10px] text-white/40 mb-1">
                    {msg.role === "user" ? "You" : config.model}
                  </div>
                  <div className="text-sm whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-white/10 rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Stats */}
          {showStats && (
            <div className="flex gap-4 mb-4 text-xs text-white/40">
              <span>Messages: {messages.length}</span>
              <span>~{tokenCount} tokens</span>
              <span>Model: {config.model}</span>
              <span>Temp: {config.temperature}</span>
            </div>
          )}

          {/* Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && generateResponse()
              }
              className="flex-1 bg-bg-primary/30 border border-white/10 rounded-lg px-4 py-3 text-white text-sm"
              placeholder="Type your prompt..."
              disabled={isGenerating}
            />
            <button
              onClick={generateResponse}
              disabled={isGenerating || !input.trim()}
              className="px-6 py-3 bg-accent-green text-text-primary font-semibold rounded-lg hover:bg-accent-green/80 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? "..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
