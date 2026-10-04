"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/data/curriculum";

interface ModuleQuizProps {
  questions: readonly QuizQuestion[];
  moduleId: string;
}

export function ModuleQuiz({ questions, moduleId }: ModuleQuizProps) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showExplanations, setShowExplanations] = useState(false);

  const handleAnswer = (questionIndex: number, optionIndex: number) => {
    if (submitted) return;
    setAnswers((a) => ({ ...a, [questionIndex]: optionIndex }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      alert("Please answer all questions before submitting.");
      return;
    }
    setSubmitted(true);
    setShowExplanations(true);
  };

  const correctCount = Object.entries(answers).filter(
    ([idx, ans]) => ans === questions[Number(idx)].correctIndex,
  ).length;
  const score =
    questions.length > 0
      ? Math.round((correctCount / questions.length) * 100)
      : 0;

  const submitProgress = async () => {
    try {
      await fetch("/api/student/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "submitModuleQuiz",
          data: { moduleId, score },
        }),
      });
    } catch {
      // Silently fail - progress is optional
    }
  };

  if (submitted && !showExplanations) {
    submitProgress();
    setShowExplanations(true);
  }

  return (
    <section
      style={{
        marginTop: "var(--space-8)",
        padding: "var(--space-6)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-border-primary)",
        background: "var(--color-bg-primary)",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          color: "var(--color-brand-forest)",
          marginBottom: "var(--space-4)",
          fontSize: "var(--text-xl)",
        }}
      >
        Module Quiz
      </h2>
      <p
        style={{
          marginBottom: "var(--space-6)",
          color: "var(--color-text-secondary)",
        }}
      >
        Test your understanding of this module. Score 80% or higher to be
        eligible for the certificate.
      </p>
      {questions.map((q, idx) => (
        <div key={q.id} style={{ marginBottom: "var(--space-6)" }}>
          <p
            style={{
              marginBottom: "var(--space-3)",
              fontWeight: 500,
              color: "var(--color-text-primary)",
            }}
          >
            {idx + 1}. {q.prompt}
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-2)",
            }}
          >
            {q.options.map((opt, optIdx) => {
              const isSelected = answers[idx] === optIdx;
              const isCorrect = optIdx === q.correctIndex;
              const showResult = submitted;
              return (
                <button
                  key={optIdx}
                  onClick={() => handleAnswer(idx, optIdx)}
                  disabled={submitted}
                  style={{
                    padding: "var(--space-3) var(--space-4)",
                    borderRadius: "var(--radius-md)",
                    border: showResult
                      ? isSelected && isCorrect
                        ? "2px solid var(--color-status-success)"
                        : isSelected && !isCorrect
                          ? "2px solid var(--color-status-error)"
                          : isCorrect
                            ? "2px solid var(--color-status-success)"
                            : "1px solid var(--color-border-primary)"
                      : isSelected
                        ? "2px solid var(--color-accent-gold)"
                        : "1px solid var(--color-border-primary)",
                    background: showResult
                      ? isSelected && isCorrect
                        ? "var(--color-status-success-bg)"
                        : isSelected && !isCorrect
                          ? "var(--color-status-error-bg)"
                          : isCorrect
                            ? "var(--color-status-success-bg)"
                            : "var(--color-bg-primary)"
                      : isSelected
                        ? "rgba(208, 170, 0, 0.1)"
                        : "var(--color-bg-primary)",
                    color: "var(--color-text-primary)",
                    textAlign: "left",
                    cursor: submitted ? "default" : "pointer",
                    transition: "all var(--duration-fast) ease",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--space-2)",
                    }}
                  >
                    <span
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        border: showResult
                          ? isSelected && isCorrect
                            ? "2px solid var(--color-status-success)"
                            : isSelected && !isCorrect
                              ? "2px solid var(--color-status-error)"
                              : isCorrect
                                ? "2px solid var(--color-status-success)"
                                : "1px solid var(--color-border-primary)"
                          : "2px solid var(--color-accent-gold)",
                        background: isSelected
                          ? "var(--color-accent-gold)"
                          : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {isSelected ? (
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeWidth="3"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      ) : null}
                    </span>
                    <span>{opt}</span>
                  </span>
                </button>
              );
            })}
          </div>
          {submitted && (
            <div
              style={{
                marginTop: "var(--space-3)",
                padding: "var(--space-3)",
                borderRadius: "var(--radius-md)",
                background:
                  answers[idx] === questions[idx].correctIndex
                    ? "var(--color-status-success-bg)"
                    : "var(--color-status-error-bg)",
              }}
            >
              <p
                style={{
                  color:
                    answers[idx] === questions[idx].correctIndex
                      ? "var(--color-status-success)"
                      : "var(--color-status-error)",
                  fontWeight: 500,
                  marginBottom: "var(--space-1)",
                }}
              >
                {answers[idx] === questions[idx].correctIndex
                  ? "✓ Correct"
                  : "✗ Incorrect"}
              </p>
              <p
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "var(--text-sm)",
                }}
              >
                {
                  q.feedback[
                    answers[idx] === questions[idx].correctIndex
                      ? "correct"
                      : "incorrect"
                  ]
                }
              </p>
            </div>
          )}
        </div>
      ))}
      {!submitted ? (
        <button
          onClick={handleSubmit}
          style={{
            marginTop: "var(--space-4)",
            padding: "var(--space-3) var(--space-5)",
            borderRadius: "var(--radius-lg)",
            background: "var(--color-brand-forest)",
            color: "white",
            fontSize: "var(--text-sm)",
            fontWeight: 500,
            border: "none",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Submit Module Quiz
        </button>
      ) : (
        <div
          style={{
            marginTop: "var(--space-4)",
            display: "flex",
            gap: "var(--space-3)",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              padding: "var(--space-4) var(--space-6)",
              borderRadius: "var(--radius-lg)",
              background:
                score >= 80
                  ? "var(--color-status-success-bg)"
                  : "var(--color-status-error-bg)",
            }}
          >
            <strong
              style={{
                color:
                  score >= 80
                    ? "var(--color-status-success)"
                    : "var(--color-status-error)",
                fontSize: "var(--text-lg)",
              }}
            >
              Score: {score}% (
              {
                Object.keys(answers).filter(
                  (k) =>
                    answers[Number(k)] === questions[Number(k)].correctIndex,
                ).length
              }
              /{questions.length})
            </strong>
            {score >= 80 && (
              <span
                style={{
                  marginLeft: "var(--space-3)",
                  color: "var(--color-status-success)",
                }}
              >
                ✓ Certificate eligible!
              </span>
            )}
          </div>
          <button
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
              setShowExplanations(false);
            }}
            style={{
              padding: "var(--space-3) var(--space-5)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border-primary)",
              background: "var(--color-bg-elevated)",
              color: "var(--color-text-primary)",
              fontSize: "var(--text-sm)",
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Retry Quiz
          </button>
        </div>
      )}
      {submitted && score < 80 && (
        <p
          style={{
            marginTop: "var(--space-4)",
            padding: "var(--space-3)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-status-warning-bg)",
            color: "var(--color-status-warning)",
            fontSize: "var(--text-sm)",
          }}
        >
          Score below 80%. Review the explanations and retry to become
          certificate eligible.
        </p>
      )}
      {submitted && score >= 80 && (
        <p
          style={{
            marginTop: "var(--space-4)",
            padding: "var(--space-3)",
            borderRadius: "var(--radius-md)",
            background: "var(--color-status-success-bg)",
            color: "var(--color-status-success)",
            fontSize: "var(--text-sm)",
          }}
        >
          ✓ Score 80% or higher! You are eligible to claim the module
          certificate from the module page.
        </p>
      )}
    </section>
  );
}
