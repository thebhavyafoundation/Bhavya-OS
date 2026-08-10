"use client";

import React, { useState, useCallback } from "react";
import { usePlayground } from "../hooks";
import type { Experiment, MentorResponse, Reflection } from "../types";

interface AIPlaygroundProps {
  lessonId: string;
  systemMessage?: string;
  title?: string;
  task?: string;
  showPayoff?: boolean;
}

export function AIPlayground({
  lessonId,
  systemMessage,
  title,
  task,
  showPayoff = true,
}: AIPlaygroundProps) {
  const {
    prompt,
    setPrompt,
    experiments,
    currentExperiment,
    mentorFeedback,
    isRunning,
    reflection,
    execute,
    submitReflection,
    compare,
  } = usePlayground(lessonId);

  const [showReflection, setShowReflection] = useState(false);
  const [reflData, setReflData] = useState({
    whatChanged: "",
    whyChanged: "",
    surprised: "",
    improveNext: "",
  });
  const [comparisonDone, setComparisonDone] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState<string | null>(null);

  const handleRun = async () => {
    if (!prompt.trim()) return;
    await execute(prompt, systemMessage);
    setShowReflection(true);
  };

  const handleReflection = () => {
    if (!currentExperiment) return;
    submitReflection(reflData);
    setReflData({ whatChanged: "", whyChanged: "", surprised: "", improveNext: "" });
    setShowReflection(false);
  };

  const handleCompare = useCallback(() => {
    if (experiments.length >= 2) {
      setComparisonDone(true);
    }
  }, [experiments]);

  const firstAttempt = experiments.length > 0 ? experiments[0] : null;
  const latestAttempt = experiments.length > 0 ? experiments[experiments.length - 1] : null;
  const hasImproved = experiments.length >= 2;
  const improvement = hasImproved && firstAttempt && latestAttempt
    ? calculateImprovement(firstAttempt.prompt, latestAttempt.prompt)
    : null;

  // Celebration logic
  const shouldCelebrate = hasImproved && improvement && improvement.score > 30;
  if (shouldCelebrate && !celebrationMessage) {
    const messages = [
      "✨ Better prompt!",
      "🎯 Clearer instruction!",
      "🚀 AI understood your intent!",
      "🏆 Nice iteration!",
      "💡 Great improvement!",
    ];
    setCelebrationMessage(messages[Math.floor(Math.random() * messages.length)]);
  }

  return (
    <div className="space-y-6">
      {/* Task */}
      {task && (
        <div className="border border-accent-blue/30 rounded-lg bg-accent-blue/5 p-4">
          <p className="text-xs font-medium text-accent-blue mb-1">Your Task</p>
          <p className="text-sm text-text-secondary">{task}</p>
        </div>
      )}

      {/* Title */}
      {title && (
        <h3 className="text-sm font-medium text-text-primary">{title}</h3>
      )}

      {/* Prompt Input */}
      <div className="border border-border-primary rounded-lg bg-bg-secondary">
        <div className="px-4 py-2 border-b border-border-primary">
          <span className="text-xs font-medium text-text-secondary">Your Message to AI</span>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full h-32 p-4 bg-transparent text-sm text-text-primary font-mono placeholder-text-muted focus:outline-none resize-none"
          placeholder={experiments.length === 0
            ? "Type your message here... (e.g., 'Explain AI to a 12-year-old using simple words')"
            : "Try making your message more specific or detailed..."}
        />
        <div className="px-4 py-2 border-t border-border-primary flex gap-2">
          <button
            onClick={handleRun}
            disabled={isRunning || !prompt.trim()}
            className="px-4 py-1.5 text-xs font-medium bg-accent-blue text-white rounded hover:bg-accent-blue-hover transition-colors disabled:opacity-50"
          >
            {isRunning ? "Thinking..." : experiments.length === 0 ? "Send to AI" : "Try Again"}
          </button>
          <button
            onClick={() => { setPrompt(""); }}
            className="px-4 py-1.5 text-xs font-medium border border-border-primary text-text-secondary rounded hover:text-text-primary transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* AI Response */}
      {currentExperiment && (
        <div className="border border-border-primary rounded-lg bg-bg-secondary">
          <div className="px-4 py-2 border-b border-border-primary flex justify-between items-center">
            <span className="text-xs font-medium text-text-secondary">AI Response</span>
            <span className="text-[10px] text-text-muted">
              Attempt #{currentExperiment.version}
            </span>
          </div>
          <div className="p-4 text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
            {currentExperiment.output}
          </div>
        </div>
      )}

      {/* Mentor Feedback — Visible and Coaching */}
      {mentorFeedback && (
        <div className="border border-accent-blue/30 rounded-lg bg-accent-blue/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-accent-blue/20 flex items-center justify-center">
              <span className="text-xs">🤖</span>
            </div>
            <span className="text-xs font-medium text-accent-blue">AI Mentor</span>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">{mentorFeedback.content}</p>
        </div>
      )}

      {/* Reflection */}
      {showReflection && currentExperiment && !reflection && (
        <div className="border border-border-primary rounded-lg bg-bg-secondary p-4 space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-text-primary">Reflection</span>
            <span className="text-[10px] text-text-muted">(required before next attempt)</span>
          </div>
          <input
            value={reflData.whatChanged}
            onChange={(e) => setReflData({ ...reflData, whatChanged: e.target.value })}
            className="w-full p-2 bg-bg-primary border border-border-primary rounded text-sm text-text-primary placeholder-text-muted focus:outline-none"
            placeholder="What did you notice about the AI's response?"
          />
          <input
            value={reflData.whyChanged}
            onChange={(e) => setReflData({ ...reflData, whyChanged: e.target.value })}
            className="w-full p-2 bg-bg-primary border border-border-primary rounded text-sm text-text-primary placeholder-text-muted focus:outline-none"
            placeholder="What would you try changing?"
          />
          <button
            onClick={handleReflection}
            disabled={!reflData.whatChanged.trim()}
            className="px-4 py-1.5 text-xs font-medium bg-accent-green text-white rounded hover:bg-accent-green-hover transition-colors disabled:opacity-50"
          >
            Save Reflection
          </button>
        </div>
      )}

      {reflection && (
        <div className="border border-accent-green/30 rounded-lg bg-accent-green/5 p-4">
          <span className="text-xs font-medium text-accent-green">✓ Reflection saved</span>
          <p className="text-xs text-text-muted mt-1">Great work reflecting on your experiment.</p>
        </div>
      )}

      {/* Celebration */}
      {celebrationMessage && (
        <div className="border border-accent-green/30 rounded-lg bg-accent-green/5 p-4 text-center animate-fade-in">
          <p className="text-lg font-semibold text-accent-green">{celebrationMessage}</p>
          {improvement && (
            <p className="text-xs text-text-muted mt-1">
              Your message improved from {improvement.firstScore} to {improvement.latestScore} — that&apos;s real progress
            </p>
          )}
        </div>
      )}

      {/* Experiment History */}
      {experiments.length > 0 && (
        <div className="border border-border-primary rounded-lg bg-bg-secondary">
          <div className="px-4 py-2 border-b border-border-primary">
            <span className="text-xs font-medium text-text-secondary">
              Your Experiments ({experiments.length} attempt{experiments.length !== 1 ? "s" : ""})
            </span>
          </div>
          <div className="divide-y divide-border-primary">
            {experiments.map((exp) => (
              <div
                key={exp.id}
                className="px-4 py-3 flex items-center justify-between text-xs"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-text-muted mr-2">#{exp.version}</span>
                  <span className="text-text-secondary truncate">{exp.prompt.slice(0, 60)}</span>
                  {exp.reflection && (
                    <span className="ml-2 text-accent-green">✓ reflected</span>
                  )}
                </div>
                <span className="text-text-muted ml-2">
                  {getPromptQuality(exp.prompt)}
                </span>
              </div>
            ))}
          </div>
          {experiments.length >= 2 && !comparisonDone && (
            <div className="px-4 py-2 border-t border-border-primary">
              <button
                onClick={handleCompare}
                className="text-[10px] text-accent-blue hover:underline"
              >
                Compare your first attempt vs latest →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Comparison View — The Payoff */}
      {comparisonDone && firstAttempt && latestAttempt && (
        <div className="border border-accent-blue/30 rounded-lg bg-accent-blue/5 p-4 space-y-4 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-accent-blue">Before & After</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Before */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-medium bg-bg-primary border border-border-primary rounded text-text-muted">
                  BEFORE
                </span>
                <span className="text-[10px] text-text-muted">Attempt #{firstAttempt.version}</span>
              </div>
              <div className="p-3 bg-bg-primary border border-border-primary rounded-md">
                <p className="text-xs text-text-secondary font-mono whitespace-pre-wrap">
                  {firstAttempt.prompt}
                </p>
              </div>
              <div className="p-3 bg-bg-primary border border-border-primary rounded-md">
                <p className="text-xs text-text-tertiary whitespace-pre-wrap line-clamp-4">
                  {firstAttempt.output}
                </p>
              </div>
              <span className="text-[10px] text-text-muted">{getPromptQuality(firstAttempt.prompt)}</span>
            </div>

            {/* After */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-medium bg-accent-green/10 border border-accent-green/30 rounded text-accent-green">
                  AFTER
                </span>
                <span className="text-[10px] text-text-muted">Attempt #{latestAttempt.version}</span>
              </div>
              <div className="p-3 bg-bg-primary border border-accent-green/30 rounded-md">
                <p className="text-xs text-text-secondary font-mono whitespace-pre-wrap">
                  {latestAttempt.prompt}
                </p>
              </div>
              <div className="p-3 bg-bg-primary border border-accent-green/30 rounded-md">
                <p className="text-xs text-text-tertiary whitespace-pre-wrap line-clamp-4">
                  {latestAttempt.output}
                </p>
              </div>
              <span className="text-[10px] text-accent-green">{getPromptQuality(latestAttempt.prompt)}</span>
            </div>
          </div>

          {/* What Changed */}
          <div className="p-3 bg-bg-primary border border-border-primary rounded-md">
            <p className="text-xs font-medium text-text-primary mb-2">What Changed</p>
            <ul className="space-y-1">
              {improvement?.changes.map((change, i) => (
                <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                  <span className="text-accent-green mt-0.5">→</span>
                  {change}
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => setComparisonDone(false)}
            className="text-[10px] text-text-muted hover:text-text-primary"
          >
            Close comparison
          </button>
        </div>
      )}
    </div>
  );
}

function getPromptQuality(prompt: string): string {
  const words = prompt.split(/\s+/).length;
  const len = prompt.length;
  const hasAudience = /explain to|for a|for someone|teach|help.*understand/i.test(prompt);
  const hasFormat = /step by step|json|list|example|analogy|like|such as/i.test(prompt);
  const hasConstraint = /under \d+|less than|no more than|short|simple|easy/i.test(prompt);

  let quality = 0;
  if (words >= 5) quality++;
  if (words >= 15) quality++;
  if (len > 60) quality++;
  if (hasAudience) quality++;
  if (hasFormat) quality++;
  if (hasConstraint) quality++;

  if (quality <= 1) return "Vague";
  if (quality <= 2) return "Basic";
  if (quality <= 3) return "Clear";
  if (quality <= 4) return "Specific";
  return "Excellent";
}

function calculateImprovement(first: string, latest: string): {
  firstScore: number;
  latestScore: number;
  score: number;
  changes: string[];
} | null {
  if (first === latest) return null;

  const firstScore = getScore(first);
  const latestScore = getScore(latest);
  const changes: string[] = [];

  if (latest.length > first.length * 1.5) {
    changes.push("Added more detail and context");
  }
  if (/explain to|for a|for someone|teach/i.test(latest) && !/explain to|for a|for someone|teach/i.test(first)) {
    changes.push("Specified who this is for");
  }
  if (/step by step|json|list|example|analogy/i.test(latest) && !/step by step|json|list|example|analogy/i.test(first)) {
    changes.push("Added a specific format or structure");
  }
  if (/under \d+|less than|short|simple/i.test(latest) && !/under \d+|less than|short|simple/i.test(first)) {
    changes.push("Added constraints or limits");
  }
  if (latest.split(/\s+/).length > first.split(/\s+/).length + 5) {
    changes.push("Made the message more detailed");
  }
  if (changes.length === 0) {
    changes.push("Refined the wording");
  }

  return {
    firstScore,
    latestScore,
    score: latestScore - firstScore,
    changes,
  };
}

function getScore(prompt: string): number {
  const words = prompt.split(/\s+/).length;
  let s = 0;
  if (words >= 5) s += 15;
  if (words >= 15) s += 10;
  if (/[.:;,]/.test(prompt)) s += 15;
  if (prompt.length > 60) s += 15;
  if (/explain to|for a|for someone|teach|help.*understand/i.test(prompt)) s += 20;
  if (/step by step|json|list|example|analogy/i.test(prompt)) s += 15;
  if (/under \d+|less than|short|simple/i.test(prompt)) s += 5;
  if (/who|which|specific|particular/i.test(prompt)) s += 5;
  return Math.min(s, 100);
}
