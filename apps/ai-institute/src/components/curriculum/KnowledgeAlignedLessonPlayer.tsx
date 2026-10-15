"use client";

import { useState } from "react";
import { resolveAssetUrl } from "@/lib/assetUrls";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { aiModules } from "@/data/curriculum/ai-module-registry";
import { getLessonsForModule } from "@/lib/curriculum/lessons";

const STAGE_LABELS = {
  engage: "Engage",
  explore: "Explore",
  explain: "Explain",
  elaborate: "Elaborate",
  evaluate: "Evaluate",
  boardExamAlignment: "Board Exam Alignment",
};

const STAGE_DESCRIPTIONS = {
  engage: "Hook students' interest and activate prior knowledge.",
  explore: "Students investigate the concept through hands-on activities.",
  explain: "Teacher provides formal explanation and vocabulary.",
  elaborate: "Students apply knowledge to new situations.",
  evaluate: "Assess understanding through formative checks.",
  boardExamAlignment: "Practice with board exam-style questions.",
};

interface LessonPlayerProps {
  lesson: {
    id: string;
    title: string;
    description: string;
    learningObjective: string;
    stages: Record<
      string,
      {
        description: string;
        visualType?: string;
        visualFormat?: string;
        assetUrl?: string;
        teacherActions?: string[];
        studentActions?: string[];
        visualAids?: string[];
      }
    >;
  };
  moduleId: string;
  moduleTitle: string;
}

const STAGE_LABELS_LIST = Object.keys(
  STAGE_LABELS,
) as (keyof typeof STAGE_LABELS)[];

export function KnowledgeAlignedLessonPlayer({
  lesson,
  moduleId,
  moduleTitle,
}: LessonPlayerProps) {
  const [activeStage, setActiveStage] =
    useState<keyof typeof STAGE_LABELS>("engage");

  const stages = Object.keys(STAGE_LABELS) as (keyof typeof STAGE_LABELS)[];
  const currentStage = lesson.stages[activeStage];
  const assetUrl =
    resolveAssetUrl(currentStage.assetUrl) || currentStage.assetUrl;

  return (
    <div
      style={{
        background: "var(--color-surface)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--color-border-primary)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "var(--space-6)",
          borderBottom: "1px solid var(--color-border-primary)",
          background: "var(--color-surface-forest-light)",
        }}
      >
        <p
          style={{
            fontSize: "var(--text-xs)",
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-accent-gold)",
            marginBottom: "var(--space-2)",
          }}
        >
          {lesson.title}
        </p>
        <p
          style={{
            fontSize: "var(--text-sm)",
            color: "var(--color-text-secondary)",
            lineHeight: 1.6,
          }}
        >
          {lesson.learningObjective}
        </p>
      </div>

      <div
        role="tablist"
        style={{
          display: "flex",
          borderBottom: "1px solid var(--color-border-primary)",
          overflowX: "auto",
        }}
      >
        {stages.map((stage, index) => (
          <button
            key={stage}
            role="tab"
            aria-selected={activeStage === stage}
            onClick={() => setActiveStage(stage)}
            style={{
              flex: "1",
              minWidth: "140px",
              padding: "var(--space-3) var(--space-4)",
              background:
                activeStage === stage
                  ? "var(--color-brand-forest)"
                  : "transparent",
              color:
                activeStage === stage
                  ? "var(--color-text-inverse)"
                  : "var(--color-text-secondary)",
              border: "none",
              fontSize: "var(--text-xs)",
              fontWeight: 500,
              cursor: "pointer",
              transition: "all var(--duration-fast) ease",
              whiteSpace: "nowrap",
            }}
          >
            {index + 1}. {STAGE_LABELS[stage]}
          </button>
        ))}
      </div>

      <div style={{ padding: "var(--space-6)" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "var(--space-6)",
          }}
        >
          <div
            style={{
              minHeight: "200px",
              borderRadius: "var(--radius-lg)",
              background: "var(--color-surface-2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--color-text-muted)",
              fontSize: "var(--text-sm)",
            }}
          >
            {lesson.stages[activeStage]?.description || "Visual placeholder"}
          </div>

          <div>
            <p
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--color-accent-gold)",
                marginBottom: "var(--space-2)",
              }}
            >
              {STAGE_LABELS[activeStage]}
            </p>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                marginBottom: "var(--space-4)",
              }}
            >
              {STAGE_DESCRIPTIONS[activeStage]}
            </p>
            <p
              style={{
                fontSize: "var(--text-sm)",
                color: "var(--color-text-secondary)",
                lineHeight: 1.7,
                marginBottom: "var(--space-4)",
              }}
            >
              {currentStage.description}
            </p>

            {"teacherActions" in currentStage && (
              <div>
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  Teacher Actions:
                </p>
                <ul
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                    paddingLeft: "var(--space-5)",
                  }}
                >
                  {(currentStage.teacherActions ?? []).map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>
            )}

            {"studentActions" in currentStage && (
              <div>
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  Student Actions:
                </p>
                <ul
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                    paddingLeft: "var(--space-5)",
                  }}
                >
                  {(currentStage.studentActions ?? []).map((action, i) => (
                    <li key={i}>{action}</li>
                  ))}
                </ul>
              </div>
            )}

            {"visualAids" in currentStage && (
              <div>
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    color: "var(--color-text-primary)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  Visual Aids:
                </p>
                <ul
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                    paddingLeft: "var(--space-5)",
                  }}
                >
                  {(currentStage.visualAids ?? []).map((aid, i) => (
                    <li key={i}>{aid}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeStage === "boardExamAlignment" && (
              <div
                style={{
                  marginTop: "var(--space-4)",
                  padding: "var(--space-4)",
                  background: "var(--color-surface-forest-light)",
                  borderRadius: "var(--radius-lg)",
                  border: "1px solid var(--color-border-primary)",
                }}
              >
                <p
                  style={{
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    color: "var(--color-accent-gold)",
                    marginBottom: "var(--space-2)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Board Exam Practice
                </p>
                <p
                  style={{
                    fontSize: "var(--text-sm)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  Practice with board exam-style questions aligned to this
                  lesson&apos;s objectives.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
