"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { problemLibrary, ImpactEngine } from "@bhavya/impact-runtime";
import type { ImpactProject, OpenSourcePath } from "@bhavya/impact-runtime";

type Tab =
  | "problem"
  | "research"
  | "canvas"
  | "build"
  | "evidence"
  | "impact"
  | "portfolio";

const engine = new ImpactEngine();

export default function ImpactWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, student } = useAuth();
  const problemId = params.id as string;
  const [project, setProject] = useState<ImpactProject | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("problem");

  // Research state
  const [researchInsight, setResearchInsight] = useState("");

  // Canvas state
  const [canvasData, setCanvasData] = useState({
    problem: "",
    users: "",
    goals: "",
    nonGoals: "",
    constraints: "",
    risks: "",
    aiOpportunities: "",
    ethics: "",
    successMetrics: "",
  });
  const [designDecision, setDesignDecision] = useState({
    question: "",
    decision: "",
    rationale: "",
    alternatives: "",
  });

  // Evidence state
  const [evidenceData, setEvidenceData] = useState({
    whoBenefits: "",
    whatChanged: "",
    whatRemainsUnsolved: "",
    canBecomeOpenSource: true,
    canBeExtended: true,
    canBeDeployed: true,
  });

  // Open source state
  const [openSourceData, setOpenSourceData] = useState({
    contributionType: "new-project" as OpenSourcePath["contributionType"],
    targetRepository: "",
    description: "",
    skills: "",
    difficulty: "intermediate" as OpenSourcePath["difficulty"],
    estimatedEffort: "",
  });

  useEffect(() => {
    if (!isAuthenticated || !student) {
      router.push("/assessment");
      return;
    }

    engine.loadFromStorage();
    let existing = engine.getProject(`impact-${problemId}`);
    if (!existing) {
      const problem = problemLibrary.find((pr) => pr.id === problemId);
      if (problem) {
        existing = engine.selectProblem(problem);
      }
    }
    if (existing) setProject(existing);
  }, [problemId, router]);

  const handleSaveResearch = () => {
    if (!project) return;
    const updated = engine.addResearch(project.id, {
      problemId: project.problem.id,
      articles: [],
      knowledgePackages: [],
      repositories: [],
      documentation: [],
      datasets: [],
      mcpCapabilities: [],
      aiTools: [],
      insights: researchInsight ? [researchInsight] : [],
    });
    if (updated) setProject(updated);
    setResearchInsight("");
  };

  const handleSaveCanvas = () => {
    if (!project) return;
    const updated = engine.createCanvas(project.id, {
      problem: canvasData.problem,
      users: canvasData.users,
      goals: canvasData.goals.split("\n").filter((g) => g.trim()),
      nonGoals: canvasData.nonGoals.split("\n").filter((g) => g.trim()),
      constraints: canvasData.constraints.split("\n").filter((g) => g.trim()),
      risks: canvasData.risks.split("\n").filter((g) => g.trim()),
      aiOpportunities: canvasData.aiOpportunities
        .split("\n")
        .filter((g) => g.trim()),
      ethics: canvasData.ethics.split("\n").filter((g) => g.trim()),
      successMetrics: canvasData.successMetrics
        .split("\n")
        .filter((g) => g.trim()),
      designDecisions: [],
    });
    if (updated) setProject(updated);
  };

  const handleAddDesignDecision = () => {
    if (!project) return;
    const updated = engine.addDesignDecision(project.id, {
      question: designDecision.question,
      decision: designDecision.decision,
      rationale: designDecision.rationale,
      knowledgePackageRefs: [],
      alternatives: designDecision.alternatives
        .split("\n")
        .filter((a) => a.trim()),
    });
    if (updated) setProject(updated);
    setDesignDecision({
      question: "",
      decision: "",
      rationale: "",
      alternatives: "",
    });
  };

  const handleSaveEvidence = () => {
    if (!project) return;
    const updated = engine.addEvidence(project.id, {
      problemId: project.problem.id,
      whoBenefits: evidenceData.whoBenefits,
      whatChanged: evidenceData.whatChanged,
      whatRemainsUnsolved: evidenceData.whatRemainsUnsolved,
      canBecomeOpenSource: evidenceData.canBecomeOpenSource,
      canBeExtended: evidenceData.canBeExtended,
      canBeDeployed: evidenceData.canBeDeployed,
      evidenceItems: [],
    });
    if (updated) setProject(updated);
  };

  const handleSaveOpenSource = () => {
    if (!project) return;
    const updated = engine.defineOpenSourcePath(project.id, {
      contributionType: openSourceData.contributionType,
      targetRepository: openSourceData.targetRepository || undefined,
      description: openSourceData.description,
      skills: openSourceData.skills.split("\n").filter((s) => s.trim()),
      difficulty: openSourceData.difficulty,
      estimatedEffort: openSourceData.estimatedEffort,
    });
    if (updated) setProject(updated);
  };

  if (!project) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/impact"
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          ← Back to Problems
        </Link>
        <span className="text-xs text-text-muted capitalize">
          {project.status.replace(/-/g, " ")}
        </span>
      </div>
      {/* Header */}
      <div className="mb-6 animate-fade-in">
        <p className="text-[10px] text-accent-blue uppercase tracking-wider mb-1">
          Impact Project
        </p>
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          {project.problem.title}
        </h1>
        <p className="text-sm text-text-secondary">
          {project.problem.statement}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border-primary mb-6 overflow-x-auto">
        {(
          [
            "problem",
            "research",
            "canvas",
            "build",
            "evidence",
            "impact",
            "portfolio",
          ] as const
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
            {tab === "problem" && "Problem"}
            {tab === "research" && "Research"}
            {tab === "canvas" && "Canvas"}
            {tab === "build" && "Build"}
            {tab === "evidence" && "Evidence"}
            {tab === "impact" && "Impact"}
            {tab === "portfolio" && "Portfolio"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="animate-fade-in">
        {/* Problem Tab */}
        {activeTab === "problem" && (
          <div className="space-y-6">
            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Problem Statement
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                {project.problem.statement}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-muted mb-1">Category</p>
                  <p className="text-sm text-text-secondary capitalize">
                    {project.problem.category.replace(/-/g, " ")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">Difficulty</p>
                  <p className="text-sm text-text-secondary capitalize">
                    {project.problem.difficulty}
                  </p>
                </div>
              </div>
            </div>

            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Stakeholders
              </h3>
              <div className="space-y-2">
                {project.problem.stakeholders.map((stakeholder) => (
                  <div
                    key={stakeholder}
                    className="flex items-center gap-2 text-sm text-text-secondary"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-blue flex-shrink-0" />
                    {stakeholder}
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Background
              </h3>
              <p className="text-sm text-text-secondary">
                {project.problem.background}
              </p>
            </div>

            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Constraints
              </h3>
              <div className="space-y-2">
                {project.problem.constraints.map((constraint) => (
                  <div
                    key={constraint}
                    className="flex items-center gap-2 text-sm text-text-secondary"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-yellow flex-shrink-0" />
                    {constraint}
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Success Criteria
              </h3>
              <div className="space-y-2">
                {project.problem.successCriteria.map((criterion) => (
                  <div
                    key={criterion}
                    className="flex items-center gap-2 text-sm text-text-secondary"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-green flex-shrink-0" />
                    {criterion}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Research Tab */}
        {activeTab === "research" && (
          <div className="space-y-6">
            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Research Insights
              </h3>
              <p className="text-xs text-text-secondary mb-4">
                What did you discover about this problem? What articles,
                repositories, or knowledge packages did you find?
              </p>
              <textarea
                value={researchInsight}
                onChange={(e) => setResearchInsight(e.target.value)}
                className="w-full h-32 p-3 bg-bg-primary border border-border-primary rounded-md text-sm text-text-primary placeholder-text-muted focus:outline-none resize-none"
                placeholder="Write your research insights here..."
              />
              <button
                onClick={handleSaveResearch}
                className="mt-3 px-4 py-2 text-sm font-medium bg-accent-blue text-white rounded-md hover:bg-accent-blue-hover transition-colors"
              >
                Save Research
              </button>
            </div>

            {project.research && project.research.insights.length > 0 && (
              <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
                <h3 className="text-sm font-medium text-text-primary mb-4">
                  Saved Insights
                </h3>
                <div className="space-y-2">
                  {project.research.insights.map((insight, i) => (
                    <div
                      key={i}
                      className="p-3 bg-bg-primary border border-border-primary rounded-md"
                    >
                      <p className="text-sm text-text-secondary">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Knowledge Packages
              </h3>
              <div className="space-y-2">
                {project.problem.knowledgePackages.map((kp) => (
                  <div
                    key={kp}
                    className="flex items-center justify-between p-2 bg-bg-primary border border-border-primary rounded"
                  >
                    <span className="text-sm text-text-primary">{kp}</span>
                    <span className="text-[10px] text-text-muted">
                      Available
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Canvas Tab */}
        {activeTab === "canvas" && (
          <div className="space-y-6">
            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Solution Canvas
              </h3>
              <p className="text-xs text-text-secondary mb-4">
                Define your solution before building. What are you solving, for
                whom, and how?
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-text-primary mb-1 block">
                    Problem (one sentence)
                  </label>
                  <input
                    value={canvasData.problem}
                    onChange={(e) =>
                      setCanvasData({ ...canvasData, problem: e.target.value })
                    }
                    className="w-full p-2 bg-bg-primary border border-border-primary rounded text-sm text-text-primary placeholder-text-muted focus:outline-none"
                    placeholder="What problem are you solving?"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-primary mb-1 block">
                    Users (who benefits?)
                  </label>
                  <input
                    value={canvasData.users}
                    onChange={(e) =>
                      setCanvasData({ ...canvasData, users: e.target.value })
                    }
                    className="w-full p-2 bg-bg-primary border border-border-primary rounded text-sm text-text-primary placeholder-text-muted focus:outline-none"
                    placeholder="Who will use this?"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-primary mb-1 block">
                    Goals (one per line)
                  </label>
                  <textarea
                    value={canvasData.goals}
                    onChange={(e) =>
                      setCanvasData({ ...canvasData, goals: e.target.value })
                    }
                    className="w-full h-24 p-2 bg-bg-primary border border-border-primary rounded text-sm text-text-primary placeholder-text-muted focus:outline-none resize-none"
                    placeholder="What will this achieve?"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-primary mb-1 block">
                    Non-Goals (one per line)
                  </label>
                  <textarea
                    value={canvasData.nonGoals}
                    onChange={(e) =>
                      setCanvasData({ ...canvasData, nonGoals: e.target.value })
                    }
                    className="w-full h-24 p-2 bg-bg-primary border border-border-primary rounded text-sm text-text-primary placeholder-text-muted focus:outline-none resize-none"
                    placeholder="What will this NOT do?"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-primary mb-1 block">
                    Constraints (one per line)
                  </label>
                  <textarea
                    value={canvasData.constraints}
                    onChange={(e) =>
                      setCanvasData({
                        ...canvasData,
                        constraints: e.target.value,
                      })
                    }
                    className="w-full h-24 p-2 bg-bg-primary border border-border-primary rounded text-sm text-text-primary placeholder-text-muted focus:outline-none resize-none"
                    placeholder="What are the limitations?"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-primary mb-1 block">
                    AI Opportunities (one per line)
                  </label>
                  <textarea
                    value={canvasData.aiOpportunities}
                    onChange={(e) =>
                      setCanvasData({
                        ...canvasData,
                        aiOpportunities: e.target.value,
                      })
                    }
                    className="w-full h-24 p-2 bg-bg-primary border border-border-primary rounded text-sm text-text-primary placeholder-text-muted focus:outline-none resize-none"
                    placeholder="How can AI help solve this?"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-primary mb-1 block">
                    Ethics (one per line)
                  </label>
                  <textarea
                    value={canvasData.ethics}
                    onChange={(e) =>
                      setCanvasData({ ...canvasData, ethics: e.target.value })
                    }
                    className="w-full h-24 p-2 bg-bg-primary border border-border-primary rounded text-sm text-text-primary placeholder-text-muted focus:outline-none resize-none"
                    placeholder="What ethical considerations exist?"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-primary mb-1 block">
                    Success Metrics (one per line)
                  </label>
                  <textarea
                    value={canvasData.successMetrics}
                    onChange={(e) =>
                      setCanvasData({
                        ...canvasData,
                        successMetrics: e.target.value,
                      })
                    }
                    className="w-full h-24 p-2 bg-bg-primary border border-border-primary rounded text-sm text-text-primary placeholder-text-muted focus:outline-none resize-none"
                    placeholder="How will you measure success?"
                  />
                </div>
                <button
                  onClick={handleSaveCanvas}
                  className="px-4 py-2 text-sm font-medium bg-accent-blue text-white rounded-md hover:bg-accent-blue-hover transition-colors"
                >
                  Save Canvas
                </button>
              </div>
            </div>

            {/* Design Decisions */}
            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Design Decisions
              </h3>
              <p className="text-xs text-text-secondary mb-4">
                Document your key design decisions. Justify why you chose this
                approach.
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-text-primary mb-1 block">
                    Question
                  </label>
                  <input
                    value={designDecision.question}
                    onChange={(e) =>
                      setDesignDecision({
                        ...designDecision,
                        question: e.target.value,
                      })
                    }
                    className="w-full p-2 bg-bg-primary border border-border-primary rounded text-sm text-text-primary placeholder-text-muted focus:outline-none"
                    placeholder="Why this model? Why this architecture?"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-primary mb-1 block">
                    Decision
                  </label>
                  <input
                    value={designDecision.decision}
                    onChange={(e) =>
                      setDesignDecision({
                        ...designDecision,
                        decision: e.target.value,
                      })
                    }
                    className="w-full p-2 bg-bg-primary border border-border-primary rounded text-sm text-text-primary placeholder-text-muted focus:outline-none"
                    placeholder="What did you decide?"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-primary mb-1 block">
                    Rationale
                  </label>
                  <textarea
                    value={designDecision.rationale}
                    onChange={(e) =>
                      setDesignDecision({
                        ...designDecision,
                        rationale: e.target.value,
                      })
                    }
                    className="w-full h-20 p-2 bg-bg-primary border border-border-primary rounded text-sm text-text-primary placeholder-text-muted focus:outline-none resize-none"
                    placeholder="Why is this the best approach?"
                  />
                </div>
                <button
                  onClick={handleAddDesignDecision}
                  className="px-4 py-2 text-sm font-medium border border-border-primary rounded-md text-text-secondary hover:text-text-primary transition-colors"
                >
                  Add Decision
                </button>
              </div>

              {project.canvas && project.canvas.designDecisions.length > 0 && (
                <div className="mt-4 space-y-2">
                  {project.canvas.designDecisions.map((dd) => (
                    <div
                      key={dd.id}
                      className="p-3 bg-bg-primary border border-border-primary rounded-md"
                    >
                      <p className="text-xs font-medium text-text-primary mb-1">
                        {dd.question}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {dd.decision}
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        {dd.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Build Tab */}
        {activeTab === "build" && (
          <div className="space-y-6">
            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Build Your Solution
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Use the Project Runtime to build your solution. Go to your
                project workspace to complete milestones, receive AI coaching,
                and capture evidence.
              </p>
              <Link
                href="/projects/proj-first-ai-assistant"
                className="inline-block px-5 py-2 text-sm font-medium bg-accent-blue text-white rounded-md hover:bg-accent-blue-hover transition-colors"
              >
                Open Project Workspace →
              </Link>
            </div>
          </div>
        )}

        {/* Evidence Tab */}
        {activeTab === "evidence" && (
          <div className="space-y-6">
            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Impact Evidence
              </h3>
              <p className="text-xs text-text-secondary mb-4">
                Document the impact of your solution. Who benefits? What
                changed? What remains unsolved?
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-text-primary mb-1 block">
                    Who benefits?
                  </label>
                  <input
                    value={evidenceData.whoBenefits}
                    onChange={(e) =>
                      setEvidenceData({
                        ...evidenceData,
                        whoBenefits: e.target.value,
                      })
                    }
                    className="w-full p-2 bg-bg-primary border border-border-primary rounded text-sm text-text-primary placeholder-text-muted focus:outline-none"
                    placeholder="Which community or group benefits?"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-primary mb-1 block">
                    What changed?
                  </label>
                  <textarea
                    value={evidenceData.whatChanged}
                    onChange={(e) =>
                      setEvidenceData({
                        ...evidenceData,
                        whatChanged: e.target.value,
                      })
                    }
                    className="w-full h-24 p-2 bg-bg-primary border border-border-primary rounded text-sm text-text-primary placeholder-text-muted focus:outline-none resize-none"
                    placeholder="What improved because of your solution?"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-primary mb-1 block">
                    What remains unsolved?
                  </label>
                  <textarea
                    value={evidenceData.whatRemainsUnsolved}
                    onChange={(e) =>
                      setEvidenceData({
                        ...evidenceData,
                        whatRemainsUnsolved: e.target.value,
                      })
                    }
                    className="w-full h-24 p-2 bg-bg-primary border border-border-primary rounded text-sm text-text-primary placeholder-text-muted focus:outline-none resize-none"
                    placeholder="What problems still exist?"
                  />
                </div>
                <button
                  onClick={handleSaveEvidence}
                  className="px-4 py-2 text-sm font-medium bg-accent-green text-white rounded-md hover:bg-accent-green-hover transition-colors"
                >
                  Save Evidence
                </button>
              </div>
            </div>

            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Open Source Path
              </h3>
              <p className="text-xs text-text-secondary mb-4">
                How can this project become an open-source contribution?
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-text-primary mb-1 block">
                    Contribution Type
                  </label>
                  <select
                    value={openSourceData.contributionType}
                    onChange={(e) =>
                      setOpenSourceData({
                        ...openSourceData,
                        contributionType: e.target
                          .value as OpenSourcePath["contributionType"],
                      })
                    }
                    className="w-full p-2 bg-bg-primary border border-border-primary rounded text-sm text-text-primary focus:outline-none"
                  >
                    <option value="improve-repo">
                      Improve an existing repository
                    </option>
                    <option value="create-plugin">Create a plugin</option>
                    <option value="submit-docs">Submit documentation</option>
                    <option value="fix-issue">Fix an issue</option>
                    <option value="publish-component">
                      Publish a reusable component
                    </option>
                    <option value="new-project">Create a new project</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-text-primary mb-1 block">
                    Description
                  </label>
                  <textarea
                    value={openSourceData.description}
                    onChange={(e) =>
                      setOpenSourceData({
                        ...openSourceData,
                        description: e.target.value,
                      })
                    }
                    className="w-full h-24 p-2 bg-bg-primary border border-border-primary rounded text-sm text-text-primary placeholder-text-muted focus:outline-none resize-none"
                    placeholder="Describe the open-source contribution"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-primary mb-1 block">
                    Skills (one per line)
                  </label>
                  <textarea
                    value={openSourceData.skills}
                    onChange={(e) =>
                      setOpenSourceData({
                        ...openSourceData,
                        skills: e.target.value,
                      })
                    }
                    className="w-full h-20 p-2 bg-bg-primary border border-border-primary rounded text-sm text-text-primary placeholder-text-muted focus:outline-none resize-none"
                    placeholder="What skills are needed?"
                  />
                </div>
                <button
                  onClick={handleSaveOpenSource}
                  className="px-4 py-2 text-sm font-medium border border-border-primary rounded-md text-text-secondary hover:text-text-primary transition-colors"
                >
                  Save Open Source Path
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Impact Tab */}
        {activeTab === "impact" && (
          <div className="space-y-6">
            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Impact Summary
              </h3>
              {project.evidence ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-text-muted mb-1">Who Benefits</p>
                    <p className="text-sm text-text-secondary">
                      {project.evidence.whoBenefits}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-1">What Changed</p>
                    <p className="text-sm text-text-secondary">
                      {project.evidence.whatChanged}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-1">
                      What Remains Unsolved
                    </p>
                    <p className="text-sm text-text-secondary">
                      {project.evidence.whatRemainsUnsolved}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-text-muted">
                  Complete the Evidence tab to see your impact summary.
                </p>
              )}
            </div>

            {project.openSourcePath && (
              <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
                <h3 className="text-sm font-medium text-text-primary mb-4">
                  Open Source Contribution
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-text-muted mb-1">Type</p>
                    <p className="text-sm text-text-secondary capitalize">
                      {project.openSourcePath.contributionType.replace(
                        /-/g,
                        " ",
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-1">Description</p>
                    <p className="text-sm text-text-secondary">
                      {project.openSourcePath.description}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-muted mb-1">Skills</p>
                    <div className="flex gap-2 flex-wrap">
                      {project.openSourcePath.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 text-[10px] bg-accent-blue/10 text-accent-blue rounded"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Portfolio Tab */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            <div className="border border-border-primary rounded-lg p-6 bg-bg-secondary">
              <h3 className="text-sm font-medium text-text-primary mb-4">
                Impact Portfolio
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                Your impact portfolio includes the problem you solved, the
                research you performed, the design decisions you made, and the
                impact you achieved.
              </p>
              <button className="px-4 py-2 text-sm font-medium bg-accent-blue text-white rounded-md hover:bg-accent-blue-hover transition-colors">
                Generate Portfolio
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
