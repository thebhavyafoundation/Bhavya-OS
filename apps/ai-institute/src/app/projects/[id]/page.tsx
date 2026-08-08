"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getProgress } from "@/data/progress";
import { firstProject } from "@/data/projects";
import {
  ProjectEngine,
  AIProjectCoach,
  PortfolioExporter,
} from "@bhavya/project-runtime";
import type {
  Project,
  Milestone,
  Task,
  AIProjectCoachResponse,
} from "@bhavya/project-runtime";

type Tab = "overview" | "milestones" | "mentor" | "journal" | "portfolio";

const engine = new ProjectEngine();
const coach = new AIProjectCoach();
const exporter = new PortfolioExporter(engine);

export default function ProjectWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(
    null,
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [coachResponse, setCoachResponse] =
    useState<AIProjectCoachResponse | null>(null);
  const [reflectionData, setReflectionData] = useState({
    whatDifficult: "",
    whatChanged: "",
    whatRedesign: "",
    whichSuggestionHelped: "",
    whichSuggestionRejected: "",
  });
  const [taskOutput, setTaskOutput] = useState("");
  const [portfolioMarkdown, setPortfolioMarkdown] = useState("");

  useEffect(() => {
    const p = getProgress();
    if (!p.enrolled) {
      router.push("/assessment");
      return;
    }

    engine.loadFromStorage();
    let proj = engine.getProject(projectId);
    if (!proj) {
      proj = engine.createProject(firstProject);
      engine.startProject(proj.id);
    }
    setProject(proj);
    if (proj.milestones.length > 0) {
      const firstAvailable =
        proj.milestones.find((m) => m.status === "available") ||
        proj.milestones[0];
      setSelectedMilestone(firstAvailable);
    }
  }, [projectId, router]);

  const getCoach = useCallback(async () => {
    if (!project || !selectedMilestone) return;
    const response = await coach.coach(
      project,
      selectedMilestone,
      selectedTask || undefined,
    );
    setCoachResponse(response);
  }, [project, selectedMilestone, selectedTask]);

  useEffect(() => {
    getCoach();
  }, [getCoach]);

  const handleCompleteTask = (taskId: string) => {
    if (!project || !selectedMilestone) return;
    engine.completeTask(project.id, selectedMilestone.id, taskId, taskOutput);
    setProject(engine.getProject(project.id) || null);
    setTaskOutput("");
  };

  const handleCompleteMilestone = () => {
    if (!project || !selectedMilestone) return;
    engine.completeMilestone(project.id, selectedMilestone.id);
    setProject(engine.getProject(project.id) || null);
    const nextMilestone = project.milestones.find(
      (m) => m.order === selectedMilestone.order + 1,
    );
    if (nextMilestone) setSelectedMilestone(nextMilestone);
  };

  const handleSubmitReflection = () => {
    if (!project || !selectedMilestone) return;
    engine.addReflection(project.id, selectedMilestone.id, reflectionData);
    setProject(engine.getProject(project.id) || null);
    setReflectionData({
      whatDifficult: "",
      whatChanged: "",
      whatRedesign: "",
      whichSuggestionHelped: "",
      whichSuggestionRejected: "",
    });
  };

  const handleExport = () => {
    if (!project) return;
    const md = exporter.exportAsMarkdown(project.id);
    if (md) setPortfolioMarkdown(md);
  };

  if (!project) return null;

  const progress = engine.getProgress(project.id);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/projects"
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          ← Back to Projects
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs text-text-muted">
            {progress?.completed || 0}/{progress?.total || 6} milestones
          </span>
          <div className="w-24 h-1.5 bg-bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-blue rounded-full transition-all"
              style={{ width: `${progress?.percentage || 0}%` }}
            />
          </div>
        </div>
      </div>
      {/* Header */}
      <div className="mb-6 animate-fade-in">
        <p className="text-[10px] text-accent-blue uppercase tracking-wider mb-1">
          Project
        </p>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          {project.title}
        </h1>
        <p className="text-sm text-text-secondary">{project.problem}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border-primary mb-6 overflow-x-auto">
        {(
          ["overview", "milestones", "mentor", "journal", "portfolio"] as const
        ).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "text-text-primary border-b-2 border-accent-blue"
                : "text-text-tertiary hover:text-text-primary"
            }`}
          >
            {tab === "overview" && "Overview"}
            {tab === "milestones" && "Milestones"}
            {tab === "mentor" && "AI Coach"}
            {tab === "journal" && "Learning Journal"}
            {tab === "portfolio" && "Portfolio"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Objectives
              </h3>
              <div className="space-y-2">
                {project.objectives.map((obj, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-sm text-text-secondary"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-blue flex-shrink-0" />
                    {obj}
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Milestones
              </h3>
              <div className="space-y-3">
                {project.milestones.map((m) => (
                  <div
                    key={m.id}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      m.status === "completed"
                        ? "border-accent-green/30 bg-accent-green/5"
                        : m.status === "available"
                          ? "border-accent-blue/30 bg-accent-blue/5"
                          : m.status === "in-progress"
                            ? "border-accent-yellow/30 bg-accent-yellow/5"
                            : "border-border-primary bg-bg-primary"
                    }`}
                    onClick={() => {
                      setSelectedMilestone(m);
                      setActiveTab("milestones");
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-text-primary">
                        {m.order}. {m.title}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[10px] rounded ${
                          m.status === "completed"
                            ? "bg-accent-green/10 text-accent-green"
                            : m.status === "available"
                              ? "bg-accent-blue/10 text-accent-blue"
                              : m.status === "in-progress"
                                ? "bg-accent-yellow/10 text-accent-yellow"
                                : "bg-bg-secondary text-text-muted"
                        }`}
                      >
                        {m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Knowledge Packages
              </h3>
              <div className="space-y-2">
                {project.knowledgePackages.map((kp) => (
                  <div
                    key={kp.id}
                    className="flex items-center justify-between p-2 bg-bg-primary border border-border-primary rounded"
                  >
                    <div>
                      <span className="text-sm text-text-primary">
                        {kp.title}
                      </span>
                      <span className="text-[10px] text-text-muted ml-2">
                        ({kp.type})
                      </span>
                    </div>
                    <span className="text-[10px] text-text-muted">
                      {kp.relevance}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Milestones */}
        {activeTab === "milestones" && selectedMilestone && (
          <div className="space-y-6">
            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-text-primary">
                  Milestone {selectedMilestone.order}: {selectedMilestone.title}
                </h3>
                <span
                  className={`px-2 py-0.5 text-[10px] rounded ${
                    selectedMilestone.status === "completed"
                      ? "bg-accent-green/10 text-accent-green"
                      : selectedMilestone.status === "available"
                        ? "bg-accent-blue/10 text-accent-blue"
                        : "bg-bg-secondary text-text-muted"
                  }`}
                >
                  {selectedMilestone.status}
                </span>
              </div>
              <p className="text-sm text-text-secondary mb-4">
                {selectedMilestone.description}
              </p>

              <div className="space-y-3">
                {selectedMilestone.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`p-3 border rounded-md ${
                      task.status === "completed"
                        ? "border-accent-green/30 bg-accent-green/5"
                        : "border-border-primary"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-text-primary">
                        {task.title}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-[10px] rounded ${
                          task.status === "completed"
                            ? "bg-accent-green/10 text-accent-green"
                            : "bg-bg-secondary text-text-muted"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mb-2">
                      {task.description}
                    </p>
                    {task.status !== "completed" && (
                      <div className="space-y-2">
                        <textarea
                          value={selectedTask?.id === task.id ? taskOutput : ""}
                          onChange={(e) => {
                            setSelectedTask(task);
                            setTaskOutput(e.target.value);
                          }}
                          className="w-full h-20 p-2 bg-bg-primary border border-border-primary rounded text-sm text-text-primary placeholder-text-muted focus:outline-none resize-none"
                          placeholder="Your work here..."
                        />
                        <button
                          onClick={() => handleCompleteTask(task.id)}
                          className="px-3 py-1 text-xs font-medium bg-accent-green text-white rounded hover:bg-accent-green-hover transition-colors"
                        >
                          Complete Task
                        </button>
                      </div>
                    )}
                    {task.output && (
                      <div className="mt-2 p-2 bg-bg-primary border border-border-primary rounded">
                        <p className="text-xs text-text-secondary font-mono whitespace-pre-wrap">
                          {task.output}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selectedMilestone.tasks.every((t) => t.status === "completed") &&
                selectedMilestone.status !== "completed" && (
                  <div className="mt-4 pt-4 border-t border-border-primary">
                    <button
                      onClick={handleCompleteMilestone}
                      className="w-full py-2 text-sm font-medium bg-accent-blue text-white rounded-md hover:bg-accent-blue-hover transition-colors"
                    >
                      Complete Milestone →
                    </button>
                  </div>
                )}
            </div>
          </div>
        )}

        {/* AI Coach */}
        {activeTab === "mentor" && (
          <div className="space-y-6">
            <div className="border border-accent-blue/30 rounded-lg bg-accent-blue/5 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-accent-blue/20 flex items-center justify-center">
                  <span className="text-sm">🤖</span>
                </div>
                <h3 className="text-sm font-medium text-accent-blue">
                  AI Project Coach
                </h3>
              </div>
              {coachResponse && (
                <div>
                  <span className="px-2 py-0.5 text-[10px] bg-accent-blue/10 text-accent-blue rounded mb-2 inline-block">
                    {coachResponse.type}
                  </span>
                  <p className="text-sm text-text-secondary leading-relaxed mt-2">
                    {coachResponse.content}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={getCoach}
              className="w-full py-2 text-sm font-medium border border-border-primary rounded-md text-text-secondary hover:text-text-primary transition-colors"
            >
              Ask Coach for Advice
            </button>
          </div>
        )}

        {/* Learning Journal */}
        {activeTab === "journal" && (
          <div className="space-y-6">
            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Reflection — {selectedMilestone?.title || "Select a milestone"}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-text-primary mb-1 block">
                    What was difficult?
                  </label>
                  <textarea
                    value={reflectionData.whatDifficult}
                    onChange={(e) =>
                      setReflectionData({
                        ...reflectionData,
                        whatDifficult: e.target.value,
                      })
                    }
                    className="w-full h-20 p-3 bg-bg-primary border border-border-primary rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none resize-none"
                    placeholder="What challenges did you face?"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-primary mb-1 block">
                    What changed?
                  </label>
                  <textarea
                    value={reflectionData.whatChanged}
                    onChange={(e) =>
                      setReflectionData({
                        ...reflectionData,
                        whatChanged: e.target.value,
                      })
                    }
                    className="w-full h-20 p-3 bg-bg-primary border border-border-primary rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none resize-none"
                    placeholder="How did your understanding change?"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-primary mb-1 block">
                    What would you redesign?
                  </label>
                  <textarea
                    value={reflectionData.whatRedesign}
                    onChange={(e) =>
                      setReflectionData({
                        ...reflectionData,
                        whatRedesign: e.target.value,
                      })
                    }
                    className="w-full h-20 p-3 bg-bg-primary border border-border-primary rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none resize-none"
                    placeholder="If you did this again, what would you do differently?"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-primary mb-1 block">
                    Which AI suggestion helped?
                  </label>
                  <textarea
                    value={reflectionData.whichSuggestionHelped}
                    onChange={(e) =>
                      setReflectionData({
                        ...reflectionData,
                        whichSuggestionHelped: e.target.value,
                      })
                    }
                    className="w-full h-20 p-3 bg-bg-primary border border-border-primary rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none resize-none"
                    placeholder="What advice from the AI coach was useful?"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-primary mb-1 block">
                    Which suggestion did you reject?
                  </label>
                  <textarea
                    value={reflectionData.whichSuggestionRejected}
                    onChange={(e) =>
                      setReflectionData({
                        ...reflectionData,
                        whichSuggestionRejected: e.target.value,
                      })
                    }
                    className="w-full h-20 p-3 bg-bg-primary border border-border-primary rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none resize-none"
                    placeholder="What advice did you disagree with and why?"
                  />
                </div>
                <button
                  onClick={handleSubmitReflection}
                  className="px-4 py-2 text-sm font-medium bg-accent-green text-white rounded-md hover:bg-accent-green-hover transition-colors"
                >
                  Save Reflection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Portfolio */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Portfolio Export
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Export your project as a portfolio artifact. This includes your
                architecture, reflection, and skills demonstrated.
              </p>
              <div className="flex gap-2 mb-4">
                <button
                  onClick={handleExport}
                  className="px-4 py-2 text-sm font-medium bg-accent-blue text-white rounded-md hover:bg-accent-blue-hover transition-colors"
                >
                  Generate Portfolio
                </button>
                {portfolioMarkdown && (
                  <>
                    <button className="px-4 py-2 text-sm font-medium border border-border-primary rounded-md text-text-secondary hover:text-text-primary transition-colors">
                      Copy to Clipboard
                    </button>
                    <button className="px-4 py-2 text-sm font-medium border border-border-primary rounded-md text-text-secondary hover:text-text-primary transition-colors">
                      Download as Markdown
                    </button>
                  </>
                )}
              </div>
              {portfolioMarkdown && (
                <div className="p-4 bg-bg-primary border border-border-primary rounded-md">
                  <pre className="text-xs text-text-secondary font-mono whitespace-pre-wrap overflow-x-auto">
                    {portfolioMarkdown}
                  </pre>
                </div>
              )}
            </div>

            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                GitHub Repository
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Generate a GitHub-ready project structure with README,
                architecture docs, and learning journal.
              </p>
              <button className="px-4 py-2 text-sm font-medium border border-border-primary rounded-md text-text-secondary hover:text-text-primary transition-colors">
                Generate Repository Structure
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
