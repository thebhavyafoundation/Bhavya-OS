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
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="ml-[240px] flex-1 p-8">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-8 bg-[#27272a] rounded w-1/3 mb-8" />
            <div className="h-64 bg-[#111111] rounded-lg" />
          </div>
        </main>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex min-h-screen bg-[#0a0a0a]">
        <Sidebar />
        <main className="ml-[240px] flex-1 p-8">
          <div className="max-w-4xl mx-auto text-center py-20">
            <GraduationCap size={24} className="mx-auto text-[#52525b] mb-3" />
            <p className="text-sm text-[#71717a]">
              No student mode available for this repository
            </p>
            <Link
              href={`/repositories/${id}`}
              className="text-sm text-[#3b82f6] hover:text-[#60a5fa] mt-2 inline-block"
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
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="ml-[240px] flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/repositories/${id}`}
            className="inline-flex items-center gap-2 text-sm text-[#71717a] hover:text-[#fafafa] transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            Back to repository
          </Link>

          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-[#fafafa]">
                Student Mode
              </h1>
              <p className="text-sm text-[#71717a] mt-1">
                Study guide, exercises, and engineering challenges
              </p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold text-[#fafafa]">
                {student.difficulty_score}
              </span>
              <p className="text-[10px] text-[#52525b]">Difficulty</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 border-b border-[#27272a] pb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-t transition-colors ${
                  activeTab === tab.id
                    ? "text-[#fafafa] bg-[#111111] border border-[#27272a] border-b-transparent -mb-px"
                    : "text-[#71717a] hover:text-[#a1a1aa]"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "guide" && (
            <div className="space-y-4">
              <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                  Study Guide
                </h3>
                <p className="text-sm text-[#a1a1aa] leading-relaxed">
                  {student.study_guide}
                </p>
              </div>
              {prerequisites.length > 0 && (
                <div className="bg-[#111111] border border-[#27272a] rounded-lg p-5">
                  <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                    Prerequisites
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {prerequisites.map((p: string, i: number) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-[#27272a] text-[#a1a1aa] text-xs rounded-full"
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
                  className="flex items-center gap-3 p-4 bg-[#111111] border border-[#27272a] rounded-lg"
                >
                  <span className="text-[#3b82f6] font-mono text-sm">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm text-[#a1a1aa]">{r}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "exercises" && (
            <div className="space-y-2">
              {exercises.map((e: string, i: number) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 bg-[#111111] border border-[#27272a] rounded-lg"
                >
                  <Code
                    size={14}
                    className="text-emerald-400 mt-0.5 flex-shrink-0"
                  />
                  <span className="text-sm text-[#a1a1aa]">{e}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "projects" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                  Mini Projects
                </h3>
                <div className="space-y-2">
                  {miniProjects.map((p: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 bg-[#111111] border border-[#27272a] rounded-lg"
                    >
                      <FolderOpen
                        size={14}
                        className="text-[#3b82f6] mt-0.5 flex-shrink-0"
                      />
                      <span className="text-sm text-[#a1a1aa]">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                  Capstone Projects
                </h3>
                <div className="space-y-2">
                  {capstoneProjects.map((p: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 bg-[#111111] border border-[#27272a] rounded-lg"
                    >
                      <Target
                        size={14}
                        className="text-[#f59e0b] mt-0.5 flex-shrink-0"
                      />
                      <span className="text-sm text-[#a1a1aa]">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "interview" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                  Interview Questions
                </h3>
                <div className="space-y-2">
                  {interviewQuestions.map((q: string, i: number) => (
                    <div
                      key={i}
                      className="p-4 bg-[#111111] border border-[#27272a] rounded-lg"
                    >
                      <span className="text-sm text-[#a1a1aa]">{q}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#fafafa] mb-3">
                  Discussion Questions
                </h3>
                <div className="space-y-2">
                  {discussionQuestions.map((q: string, i: number) => (
                    <div
                      key={i}
                      className="p-4 bg-[#111111] border border-[#27272a] rounded-lg"
                    >
                      <span className="text-sm text-[#a1a1aa]">{q}</span>
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
                  className="p-4 bg-[#111111] border border-[#27272a] rounded-lg"
                >
                  <span className="text-sm text-[#a1a1aa]">{n}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === "challenges" && (
            <div className="space-y-2">
              {challenges.map((c: string, i: number) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-4 bg-[#111111] border border-[#27272a] rounded-lg"
                >
                  <Wrench
                    size={14}
                    className="text-[#f59e0b] mt-0.5 flex-shrink-0"
                  />
                  <span className="text-sm text-[#a1a1aa]">{c}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
