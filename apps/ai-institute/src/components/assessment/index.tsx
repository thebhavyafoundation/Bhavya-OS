"use client";

import { useState, useCallback } from "react";

interface AssessmentQuestion {
  id: string;
  type: "architecture" | "debugging" | "design" | "prompt" | "code" | "system";
  title: string;
  description: string;
  context?: string;
  options?: { id: string; text: string; isCorrect: boolean }[];
  rubric?: { dimension: string; criteria: string[] }[];
  starterCode?: string;
  timeLimit?: number;
}

interface AssessmentResult {
  questionId: string;
  answer: string;
  score: number;
  feedback: string;
  timeSpent: number;
}

const assessments: AssessmentQuestion[] = [
  {
    id: "arch-1",
    type: "architecture",
    title: "Design a RAG System",
    description:
      "You need to build a RAG system for a company with 10,000 documents. The system must answer questions in under 2 seconds with high accuracy. Design the architecture.",
    rubric: [
      {
        dimension: "Chunking Strategy",
        criteria: [
          "Appropriate chunk size",
          "Overlap handling",
          "Metadata preservation",
        ],
      },
      {
        dimension: "Retrieval",
        criteria: ["Vector DB choice", "Hybrid search", "Reranking"],
      },
      {
        dimension: "Generation",
        criteria: [
          "Context window management",
          "Citation",
          "Fallback handling",
        ],
      },
      {
        dimension: "Infrastructure",
        criteria: ["Caching", "Scaling", "Monitoring"],
      },
    ],
  },
  {
    id: "debug-1",
    type: "debugging",
    title: "Fix the RAG Hallucination",
    description:
      "Your RAG system is generating answers that aren't supported by the retrieved context. Debug and fix this issue.",
    context: `async function answer(query: string) {
  const chunks = await vectorDB.search(query, { topK: 3 });
  const context = chunks.map(c => c.text).join("\\n");
  const response = await llm.complete({
    prompt: \`Answer: \${query}\n\nContext: \${context}\`
  });
  return response;
}`,
    rubric: [
      {
        dimension: "Root Cause",
        criteria: [
          "Identifies prompt issue",
          "Understands context window",
          "Recognizes model behavior",
        ],
      },
      {
        dimension: "Solution",
        criteria: [
          "Improves prompt",
          "Adds grounding instructions",
          "Adds citation requirement",
        ],
      },
      {
        dimension: "Evaluation",
        criteria: [
          "Suggests metrics",
          "Proposes testing strategy",
          "Considers edge cases",
        ],
      },
    ],
  },
  {
    id: "design-1",
    type: "design",
    title: "Design an Agent System",
    description:
      "Design an AI agent that can research a topic, write a report, and cite sources. The agent should handle failures gracefully.",
    rubric: [
      {
        dimension: "Agent Architecture",
        criteria: ["Clear role definition", "Tool selection", "Error handling"],
      },
      {
        dimension: "Planning",
        criteria: [
          "Task decomposition",
          "Dependency handling",
          "Fallback strategies",
        ],
      },
      {
        dimension: "Memory",
        criteria: [
          "Context management",
          "State persistence",
          "Learning from mistakes",
        ],
      },
    ],
  },
  {
    id: "prompt-1",
    type: "prompt",
    title: "Optimize the Prompt",
    description:
      "This prompt produces inconsistent results. Optimize it for reliability and accuracy.",
    context: `System: You are an AI that extracts information from resumes.

User: Extract the following from this resume: name, email, phone, skills, experience.

Resume: [resume text]`,
    rubric: [
      {
        dimension: "Structure",
        criteria: ["Clear instructions", "Output format", "Examples"],
      },
      {
        dimension: "Reliability",
        criteria: ["Handles missing data", "Consistent format", "Error cases"],
      },
      {
        dimension: "Quality",
        criteria: ["Accuracy", "Completeness", "Edge cases"],
      },
    ],
  },
  {
    id: "code-1",
    type: "code",
    title: "Implement Semantic Search",
    description:
      "Implement a semantic search function that finds similar documents using embeddings.",
    starterCode: `interface Document {
  id: string;
  text: string;
  embedding: number[];
}

async function semanticSearch(
  query: string,
  documents: Document[],
  topK: number
): Promise<Document[]> {
  // TODO: Implement semantic search
  // 1. Embed the query
  // 2. Calculate similarity with all documents
  // 3. Return top-k most similar
}`,
    rubric: [
      {
        dimension: "Correctness",
        criteria: ["Proper embedding", "Cosine similarity", "Correct ranking"],
      },
      {
        dimension: "Performance",
        criteria: [
          "Efficient calculation",
          "Early termination",
          "Memory usage",
        ],
      },
      {
        dimension: "Edge Cases",
        criteria: ["Empty input", "No documents", "Duplicate embeddings"],
      },
    ],
  },
  {
    id: "system-1",
    type: "system",
    title: "Design an AI Evaluation System",
    description:
      "Design a system to evaluate the quality of LLM-generated responses for a customer support chatbot.",
    rubric: [
      {
        dimension: "Metrics",
        criteria: ["Relevance", "Accuracy", "Helpfulness", "Safety"],
      },
      {
        dimension: "Automation",
        criteria: ["LLM-as-judge", "Human evaluation", "A/B testing"],
      },
      {
        dimension: "Pipeline",
        criteria: ["Data collection", "Scoring", "Reporting", "Feedback loop"],
      },
    ],
  },
];

export function AssessmentEngine() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});
  const [startTime, setStartTime] = useState<number>(Date.now());

  const question = assessments[currentQuestion];

  const submitAnswer = useCallback(() => {
    const answer = answers[question.id] || "";
    const elapsed = Math.floor((Date.now() - startTime) / 1000);

    // Simulate scoring
    const score = Math.min(
      100,
      Math.max(0, 60 + Math.floor(Math.random() * 40)),
    );
    const feedback =
      score >= 80
        ? "Excellent work! Your response demonstrates strong understanding."
        : score >= 60
          ? "Good response. Consider adding more detail in key areas."
          : "Needs improvement. Review the rubric and try again.";

    const result: AssessmentResult = {
      questionId: question.id,
      answer,
      score,
      feedback,
      timeSpent: elapsed,
    };

    setResults((prev) => [...prev, result]);
    setTimeSpent((prev) => ({ ...prev, [question.id]: elapsed }));

    if (currentQuestion < assessments.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setStartTime(Date.now());
    } else {
      setShowResults(true);
    }
  }, [answers, question, currentQuestion, startTime]);

  const averageScore =
    results.length > 0
      ? Math.round(
          results.reduce((sum, r) => sum + r.score, 0) / results.length,
        )
      : 0;

  if (showResults) {
    return (
      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-bold mb-6">Assessment Results</h3>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-[#22c55e]">
              {averageScore}%
            </div>
            <div className="text-xs text-white/40">Overall Score</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-[#3b82f6]">
              {results.length}
            </div>
            <div className="text-xs text-white/40">Questions Completed</div>
          </div>
          <div className="bg-black/30 rounded-lg p-4 text-center">
            <div className="text-3xl font-bold text-[#8b5cf6]">
              {Math.round(
                Object.values(timeSpent).reduce((a, b) => a + b, 0) /
                  results.length,
              )}
              s
            </div>
            <div className="text-xs text-white/40">Avg Time per Question</div>
          </div>
        </div>

        <div className="space-y-3">
          {results.map((r, i) => {
            const q = assessments.find((a) => a.id === r.questionId);
            return (
              <div key={r.questionId} className="bg-black/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{q?.title}</span>
                  <span
                    className={`text-sm font-bold ${r.score >= 80 ? "text-[#22c55e]" : r.score >= 60 ? "text-[#f59e0b]" : "text-red-400"}`}
                  >
                    {r.score}%
                  </span>
                </div>
                <p className="text-xs text-white/50 mb-2">{r.feedback}</p>
                <div className="text-xs text-white/30">
                  Time: {r.timeSpent}s
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Assessment Engine</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/40">
            Question {currentQuestion + 1} of {assessments.length}
          </span>
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              question.type === "architecture"
                ? "bg-[#22c55e]/20 text-[#22c55e]"
                : question.type === "debugging"
                  ? "bg-red-500/20 text-red-400"
                  : question.type === "design"
                    ? "bg-[#8b5cf6]/20 text-[#8b5cf6]"
                    : question.type === "prompt"
                      ? "bg-[#3b82f6]/20 text-[#3b82f6]"
                      : question.type === "code"
                        ? "bg-[#f59e0b]/20 text-[#f59e0b]"
                        : "bg-[#06b6d4]/20 text-[#06b6d4]"
            }`}
          >
            {question.type}
          </span>
        </div>
      </div>

      <h4 className="text-xl font-semibold mb-2">{question.title}</h4>
      <p className="text-white/60 text-sm mb-4">{question.description}</p>

      {question.context && (
        <pre className="bg-black/50 rounded-lg p-4 mb-4 text-sm text-[#22c55e] font-mono overflow-x-auto">
          {question.context}
        </pre>
      )}

      {question.starterCode && (
        <pre className="bg-black/50 rounded-lg p-4 mb-4 text-sm text-[#22c55e] font-mono overflow-x-auto">
          {question.starterCode}
        </pre>
      )}

      {question.rubric && (
        <div className="mb-4">
          <h5 className="text-sm font-semibold text-white/80 mb-2">
            Evaluation Criteria
          </h5>
          <div className="grid grid-cols-2 gap-2">
            {question.rubric.map((r) => (
              <div key={r.dimension} className="bg-white/5 rounded-lg p-3">
                <div className="text-xs font-medium text-[#22c55e] mb-1">
                  {r.dimension}
                </div>
                <ul className="space-y-0.5">
                  {r.criteria.map((c, i) => (
                    <li key={i} className="text-xs text-white/50">
                      • {c}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      <textarea
        value={answers[question.id] || ""}
        onChange={(e) =>
          setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }))
        }
        className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white text-sm h-40 resize-none mb-4"
        placeholder="Write your answer here..."
      />

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          className="px-4 py-2 text-sm bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-30"
        >
          Previous
        </button>
        <button
          onClick={submitAnswer}
          className="px-6 py-2 text-sm bg-[#22c55e] text-black font-semibold rounded-lg hover:bg-[#16a34a]"
        >
          {currentQuestion === assessments.length - 1
            ? "Submit Assessment"
            : "Next →"}
        </button>
      </div>
    </div>
  );
}
