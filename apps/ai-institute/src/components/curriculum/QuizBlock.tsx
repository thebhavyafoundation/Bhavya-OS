"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/types/curriculum";

interface QuizBlockProps {
  questions: readonly QuizQuestion[];
}

export function QuizBlock({ questions }: QuizBlockProps) {
  const [answers, setAnswers] = useState<Record<string, number>>({});

  return (
    <div className="ai-quiz">
      {questions.map((question, questionIndex) => {
        const chosen = answers[question.id];
        const answered = chosen !== undefined;
        const isCorrect = chosen === question.correctIndex;
        return (
          <fieldset key={question.id} className="ai-quiz-item">
            <legend className="ai-quiz-prompt">
              <span className="ai-quiz-number">{questionIndex + 1}.</span>{" "}
              {question.prompt}
            </legend>
            <ul className="ai-quiz-options">
              {question.options.map((option, optionIndex) => (
                <li key={option}>
                  <button
                    type="button"
                    className="ai-quiz-option"
                    aria-pressed={chosen === optionIndex}
                    disabled={answered}
                    onClick={() =>
                      setAnswers((current) => ({
                        ...current,
                        [question.id]: optionIndex,
                      }))
                    }
                    data-state={
                      !answered
                        ? undefined
                        : optionIndex === question.correctIndex
                          ? "correct"
                          : optionIndex === chosen
                            ? "incorrect"
                            : "dim"
                    }
                  >
                    {option}
                  </button>
                </li>
              ))}
            </ul>
            {answered && (
              <p className="ai-quiz-feedback" role="status" aria-live="polite">
                <strong>{isCorrect ? "Correct." : "Not quite."}</strong>{" "}
                {isCorrect
                  ? question.feedback.correct
                  : question.feedback.incorrect}
              </p>
            )}
          </fieldset>
        );
      })}
    </div>
  );
}
