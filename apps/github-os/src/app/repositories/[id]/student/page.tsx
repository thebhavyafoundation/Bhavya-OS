"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  Code,
  FolderOpen,
  MessageSquare,
  Lightbulb,
  Target,
  Wrench,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

interface Student {
  id: string;
  repository_id: string;
  study_guide: string;
  learning_roadmap: string;
  prerequisites: string;
  exercises: string;
  mini_projects: string;
  capstone_projects: string;
  interview_questions: string;
  discussion_questions: string;
  reflection_notes: string;
  engineering_challenges: string;
  difficulty_score: number;
}

export default function StudentPage() {
  const params = useParams();
  const id = params.id as string;
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("guide");

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/repositories/${id}/student`);
      if (res.ok) {
        const data = await res.json();
        setStudent(data);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div
        className="flex min-h-screen"
        style={{ background: "var(--color-bg-primary)" }}
      >
        <Sidebar />
        <main className="ml-[var(--sidebar-width)] flex-1 p-8">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div
              className="h-8 rounded w-1/3 mb-8"
              style={{ background: "var(--color-bg-tertiary)" }}
            />
            <div
              className="h-64 rounded-lg"
              style={{ background: "var(--color-surface)" }}
            />
          </div>
        </main>
      </div>
    );
  }

  if (!student) {
    return (
      <div
        className="flex min-h-screen"
        style={{ background: "var(--color-bg-primary)" }}
      >
        <Sidebar />
        <main className="ml-[var(--sidebar-width)] flex-1 p-8">
          <div className="max-w-4xl mx-auto text-center py-20">
            <GraduationCap
              size={24}
              className="mx-auto mb-3"
              style={{ color: "var(--color-text-muted)" }}
            />
            <p
              className="text-sm"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              No student mode available for this repository
            </p>
            <Link
              href={`/repositories/${id}`}
              className="text-sm mt-2 inline-block hover:text-[var(--color-accent-gold)]"
              style={{ color: "var(--color-accent-gold)" }}
            >
              Back to repository
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const tabs = [
    { id: "guide", label: "Study Guide", icon: <BookOpen size={14} /> },
    { id: "roadmap", label: "Roadmap", icon: <Target size={14} /> },
    { id: "exercises", label: "Exercises", icon: <Code size={14} /> },
    { id: "projects", label: "Projects", icon: <FolderOpen size={14} /> },
    { id: "interview", label: "Interview", icon: <MessageSquare size={14} /> },
    { id: "reflect", label: "Reflection", icon: <Lightbulb size={14} /> },
    { id: "challenges", label: "Challenges", icon: <Wrench size={14} /> },
  ];

  const roadmap = JSON.parse(student.learning_roadmap || "[]");
  const prerequisites = JSON.parse(student.prerequisites || "[]");
  const exercises = JSON.parse(student.exercises || "[]");
  const miniProjects = JSON.parse(student.mini_projects || "[]");
  const capstoneProjects = JSON.parse(student.capstone_projects || "[]");
  const interviewQuestions = JSON.parse(student.interview_questions || "[]");
  const discussionQuestions = JSON.parse(student.discussion_questions || "[]");
  const reflectionNotes = JSON.parse(student.reflection_notes || "[]");
  const challenges = JSON.parse(student.engineering_challenges || "[]");

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "var(--color-bg-primary)" }}
    >
      <Sidebar />
      <main className="ml-[var(--sidebar-width)] flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/repositories/${id}`}
            className="inline-flex items-center gap-2 text-sm transition-colors mb-6 hover:text-[var(--color-text-primary)]"
            style={{ color: "var(--color-text-tertiary)" }}
          >
            <ArrowLeft size={14} />
            Back to repository
          </Link>

          <div className="flex items-start justify-between mb-8">
            <div>
              <h1
                className="text-2xl font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Student Mode
              </h1>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--color-text-tertiary)" }}
              >
                Study guide, exercises, and engineering challenges
              </p>
            </div>
            <div className="text-right">
              <span
                className="text-2xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {student.difficulty_score}
              </span>
              <p
                className="text-[10px]"
                style={{ color: "var(--color-text-muted)" }}
              >
                Difficulty
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div
            className="flex gap-1 mb-6 pb-px"
            style={{ borderBottom: "1px solid var(--color-border-primary)" }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-t transition-colors"
                style={{
                  background:
                    activeTab === tab.id
                      ? "var(--color-surface)"
                      : "transparent",
                  color:
                    activeTab === tab.id
                      ? "var(--color-text-primary)"
                      : "var(--color-text-tertiary)",
                  borderBottom:
                    activeTab === tab.id
                      ? "1px solid var(--color-border-primary)"
                      : "1px solid transparent",
                  marginBottom: activeTab === tab.id ? "-1px" : "0",
                }}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "guide" && (
            <div className="space-y-4">
              <div
                className="rounded-lg p-5"
                style={{
                  background: "var(--color-surface)",
                  borderColor: "var(--color-border-primary)",
                }}
              >
                <h3
                  className="text-sm font-medium mb-3"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Study Guide
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {student.study_guide}
                </p>
              </div>
              {prerequisites.length > 0 && (
                <div
                  className="rounded-lg p-5"
                  style={{
                    background: "var(--color-surface)",
                    borderColor: "var(--color-border-primary)",
                  }}
                >
                  <h3
                    className="text-sm font-medium mb-3"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    Prerequisites
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {prerequisites.map((p: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs rounded-full"
                        style={{
                          background: "var(--color-bg-tertiary)",
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "roadmap" && (
            <div className="space-y-2">
              {roadmap.map((r: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 rounded-lg"
                  style={{
                    background: "var(--color-surface)",
                    borderColor: "var(--color-border-primary)",
                  }}
                >
                  <span
                    className="font-mono text-sm"
                    style={{ color: "var(--color-accent-gold)" }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {r}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "exercises" && (
            <div className="space-y-2">
              {exercises.map((e: string, i: number) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-lg"
                  style={{
                    background: "var(--color-surface)",
                    borderColor: "var(--color-border-primary)",
                  }}
                >
                  <Code
                    size={14}
                    className="mt-0.5 flex-shrink-0"
                    style={{ color: "var(--color-accent-green-light)" }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {e}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-6">
              <div>
                <h3
                  className="text-sm font-medium mb-3"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Mini Projects
                </h3>
                <div className="space-y-2">
                  {miniProjects.map((p: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-lg"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: "var(--color-border-primary)",
                      }}
                    >
                      <FolderOpen
                        size={14}
                        className="mt-0.5 flex-shrink-0"
                        style={{ color: "var(--color-accent-gold)" }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {p}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3
                  className="text-sm font-medium mb-3"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Capstone Projects
                </h3>
                <div className="space-y-2">
                  {capstoneProjects.map((p: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-lg"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: "var(--color-border-primary)",
                      }}
                    >
                      <Target
                        size={14}
                        className="mt-0.5 flex-shrink-0"
                        style={{ color: "var(--color-accent-earth)" }}
                      />
                      <span
                        className="text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {p}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "interview" && (
            <div className="space-y-6">
              <div>
                <h3
                  className="text-sm font-medium mb-3"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Interview Questions
                </h3>
                <div className="space-y-2">
                  {interviewQuestions.map((q: string, i: number) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: "var(--color-border-primary)",
                      }}
                    >
                      <span
                        className="text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {q}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3
                  className="text-sm font-medium mb-3"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Discussion Questions
                </h3>
                <div className="space-y-2">
                  {discussionQuestions.map((q: string, i: number) => (
                    <div
                      key={i}
                      className="p-4 rounded-lg"
                      style={{
                        background: "var(--color-surface)",
                        borderColor: "var(--color-border-primary)",
                      }}
                    >
                      <span
                        className="text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {q}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "reflect" && (
            <div className="space-y-2">
              {reflectionNotes.map((n: string, i: number) => (
                <div
                  key={i}
                  className="p-4 rounded-lg"
                  style={{
                    background: "var(--color-surface)",
                    borderColor: "var(--color-border-primary)",
                  }}
                >
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {n}
                  </span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "challenges" && (
            <div className="space-y-2">
              {challenges.map((c: string, i: number) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 rounded-lg"
                  style={{
                    background: "var(--color-surface)",
                    borderColor: "var(--color-border-primary)",
                  }}
                >
                  <Wrench
                    size={14}
                    className="mt-0.5 flex-shrink-0"
                    style={{ color: "var(--color-accent-earth)" }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {c}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
