"use client";

import { useState, useCallback } from "react";

interface TutorMessage {
  role: "tutor" | "student";
  content: string;
  type?: "question" | "explanation" | "hint" | "encouragement";
}

interface StudentContext {
  currentLesson: string;
  knowledgeLevel: "beginner" | "intermediate" | "advanced";
  completedLessons: string[];
  weakAreas: string[];
  strongAreas: string[];
}

const tutorPersonalities = [
  {
    id: "socratic",
    name: "Socratic",
    description: "Asks questions to guide discovery",
    icon: "🤔",
  },
  {
    id: "mentor",
    name: "Mentor",
    description: "Patient guidance with examples",
    icon: "👨‍🏫",
  },
  {
    id: "challenger",
    name: "Challenger",
    description: "Pushes you to think harder",
    icon: "💪",
  },
  {
    id: "debugger",
    name: "Debugger",
    description: "Helps you find and fix errors",
    icon: "🔍",
  },
];

const lessonContexts = [
  {
    id: "attention",
    title: "Attention Mechanism",
    concepts: ["self-attention", "query-key-value", "scaled dot-product"],
  },
  {
    id: "rag",
    title: "RAG Systems",
    concepts: ["retrieval", "augmentation", "generation", "chunking"],
  },
  {
    id: "agents",
    title: "AI Agents",
    concepts: ["planning", "tool-use", "memory", "reasoning"],
  },
  {
    id: "embeddings",
    title: "Embeddings",
    concepts: ["vector-representation", "similarity", "dimensionality"],
  },
];

export function AITutor() {
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      role: "tutor",
      content:
        "Welcome! I'm your AI tutor. I'll help you understand today's lesson through questions and exploration. What would you like to learn about?",
      type: "question",
    },
  ]);
  const [input, setInput] = useState("");
  const [personality, setPersonality] = useState("socratic");
  const [context, _setContext] = useState<StudentContext>({
    currentLesson: "attention",
    knowledgeLevel: "beginner",
    completedLessons: [],
    weakAreas: [],
    strongAreas: [],
  });
  const [isTyping, setIsTyping] = useState(false);

  const currentLesson = lessonContexts.find(
    (l) => l.id === context.currentLesson,
  );

  const generateTutorResponse = useCallback(
    async (_studentMessage: string) => {
      setIsTyping(true);
      await new Promise((resolve) =>
        setTimeout(resolve, 800 + Math.random() * 1200),
      );

      const responses: Record<string, TutorMessage[]> = {
        socratic: [
          {
            role: "tutor",
            content:
              "That's a great question! Before I explain, what do you already know about this concept? Can you think of a real-world example?",
            type: "question",
          },
          {
            role: "tutor",
            content:
              "Interesting thought! Let me ask you this: if you had to explain it to a friend, how would you describe it in your own words?",
            type: "question",
          },
          {
            role: "tutor",
            content:
              "You're on the right track! Now, what do you think would happen if we changed one part of this system? Let's explore together.",
            type: "hint",
          },
        ],
        mentor: [
          {
            role: "tutor",
            content:
              "I understand this can be confusing at first. Let me break it down step by step with a simple analogy.",
            type: "explanation",
          },
          {
            role: "tutor",
            content:
              "Great question! This is actually one of the most important concepts in AI. Here's how it works...",
            type: "explanation",
          },
          {
            role: "tutor",
            content:
              "You're making excellent progress! Let me give you a hint that might help you think about this differently.",
            type: "hint",
          },
        ],
        challenger: [
          {
            role: "tutor",
            content:
              "Interesting, but can you go deeper? What's the underlying mechanism? Don't settle for surface-level understanding.",
            type: "question",
          },
          {
            role: "tutor",
            content:
              "You're thinking about this correctly, but I challenge you to consider: what are the limitations of this approach?",
            type: "question",
          },
          {
            role: "tutor",
            content:
              "Good start! Now push yourself further. How would this scale to 10 million documents? What breaks?",
            type: "question",
          },
        ],
        debugger: [
          {
            role: "tutor",
            content:
              "Let's debug this together. What exactly is going wrong? Walk me through your thinking step by step.",
            type: "question",
          },
          {
            role: "tutor",
            content:
              "I see the issue! It's like a bug in code. Let me help you trace through the logic to find where it breaks.",
            type: "hint",
          },
          {
            role: "tutor",
            content:
              "Great debugging instinct! You found the root cause. Now, how would you write a test to prevent this from happening again?",
            type: "encouragement",
          },
        ],
      };

      const personalityResponses = responses[personality] || responses.socratic;
      return personalityResponses[
        Math.floor(Math.random() * personalityResponses.length)
      ];
    },
    [personality],
  );

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const studentMsg: TutorMessage = { role: "student", content: input };
    setMessages((prev) => [...prev, studentMsg]);
    setInput("");

    const tutorResponse = await generateTutorResponse(input);
    setMessages((prev) => [...prev, tutorResponse]);
    setIsTyping(false);
  }, [input, generateTutorResponse]);

  const askAboutConcept = (concept: string) => {
    setInput(`Can you explain ${concept}?`);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">AI Tutor</h3>
        <div className="flex gap-2">
          {tutorPersonalities.map((p) => (
            <button
              key={p.id}
              onClick={() => setPersonality(p.id)}
              className={`px-3 py-1 text-xs rounded-lg ${
                personality === p.id
                  ? "bg-accent-green text-text-primary"
                  : "bg-white/10 text-white/60"
              }`}
              title={p.description}
            >
              {p.icon} {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Context Bar */}
      <div className="flex items-center gap-4 mb-4 p-3 bg-bg-primary/30 rounded-lg">
        <div>
          <span className="text-xs text-white/40">Lesson: </span>
          <span className="text-xs text-white/80">{currentLesson?.title}</span>
        </div>
        <div>
          <span className="text-xs text-white/40">Level: </span>
          <span className="text-xs text-white/80 capitalize">
            {context.knowledgeLevel}
          </span>
        </div>
        <div className="flex-1" />
        <div className="flex gap-1">
          {currentLesson?.concepts.map((c) => (
            <button
              key={c}
              onClick={() => askAboutConcept(c)}
              className="text-[10px] px-2 py-0.5 bg-white/10 rounded-full text-white/50 hover:bg-white/20"
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="bg-bg-primary/30 rounded-lg p-4 h-80 overflow-y-auto mb-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "student" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-4 py-3 ${
                msg.role === "student"
                  ? "bg-blue-500 text-white"
                  : "bg-white/10 text-white/80"
              }`}
            >
              {msg.role === "tutor" && msg.type && (
                <div className="text-[10px] text-white/40 mb-1 capitalize">
                  {msg.type}
                </div>
              )}
              <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isTyping && (
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

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 bg-bg-primary/30 border border-white/10 rounded-lg px-4 py-3 text-white text-sm"
          placeholder="Ask your tutor a question..."
          disabled={isTyping}
        />
        <button
          onClick={sendMessage}
          disabled={isTyping || !input.trim()}
          className="px-6 py-3 bg-accent-green text-text-primary font-semibold rounded-lg hover:bg-accent-green/80 disabled:opacity-50"
        >
          Ask
        </button>
      </div>
    </div>
  );
}
