"use client";

import { useState } from "react";

interface Project {
  id: string;
  title: string;
  difficulty:
    | "guided"
    | "independent"
    | "production"
    | "client"
    | "opensource"
    | "capstone";
  description: string;
  skills: string[];
  estimatedHours: number;
  status: "not-started" | "in-progress" | "completed";
  milestones: { id: string; title: string; completed: boolean }[];
  portfolioArtifact?: string;
}

const projects: Project[] = [
  {
    id: "chatbot",
    title: "Build a Chatbot",
    difficulty: "guided",
    description:
      "Create a conversational AI assistant with context memory and tool calling.",
    skills: ["Prompt Engineering", "API Integration", "Conversation Design"],
    estimatedHours: 8,
    status: "completed",
    milestones: [
      { id: "m1", title: "Set up API connection", completed: true },
      { id: "m2", title: "Implement basic chat", completed: true },
      { id: "m3", title: "Add context memory", completed: true },
      { id: "m4", title: "Add tool calling", completed: true },
      { id: "m5", title: "Write README", completed: true },
    ],
    portfolioArtifact: "chatbot-demo.md",
  },
  {
    id: "rag-system",
    title: "Document Q&A System",
    difficulty: "independent",
    description:
      "Build a RAG system that answers questions about uploaded documents.",
    skills: ["RAG", "Vector Databases", "Embeddings", "Chunking"],
    estimatedHours: 15,
    status: "in-progress",
    milestones: [
      { id: "m1", title: "Implement document ingestion", completed: true },
      { id: "m2", title: "Set up vector database", completed: true },
      { id: "m3", title: "Build retrieval pipeline", completed: false },
      { id: "m4", title: "Implement generation", completed: false },
      { id: "m5", title: "Add evaluation metrics", completed: false },
      { id: "m6", title: "Deploy to production", completed: false },
    ],
  },
  {
    id: "agent",
    title: "Task Automation Agent",
    difficulty: "production",
    description:
      "Create an agent that can research topics, write reports, and cite sources.",
    skills: ["Agent Architecture", "Tool Calling", "Planning", "Memory"],
    estimatedHours: 25,
    status: "not-started",
    milestones: [
      { id: "m1", title: "Design agent architecture", completed: false },
      { id: "m2", title: "Implement web search tool", completed: false },
      { id: "m3", title: "Implement file operations", completed: false },
      { id: "m4", title: "Add planning module", completed: false },
      { id: "m5", title: "Implement memory system", completed: false },
      { id: "m6", title: "Test with real research task", completed: false },
      { id: "m7", title: "Write documentation", completed: false },
    ],
  },
  {
    id: "ai-product",
    title: "AI Product MVP",
    difficulty: "client",
    description:
      "Design and build an AI product for a simulated client with real requirements.",
    skills: [
      "Product Design",
      "AI Architecture",
      "User Research",
      "Deployment",
    ],
    estimatedHours: 40,
    status: "not-started",
    milestones: [
      { id: "m1", title: "Client brief analysis", completed: false },
      { id: "m2", title: "User research", completed: false },
      { id: "m3", title: "AI architecture design", completed: false },
      { id: "m4", title: "MVP build", completed: false },
      { id: "m5", title: "User testing", completed: false },
      { id: "m6", title: "Iteration", completed: false },
      { id: "m7", title: "Deployment", completed: false },
      { id: "m8", title: "Client presentation", completed: false },
    ],
  },
  {
    id: "open-source",
    title: "Open Source Contribution",
    difficulty: "opensource",
    description:
      "Contribute a meaningful feature or fix to an open-source AI project.",
    skills: ["Open Source", "Code Review", "Documentation", "Community"],
    estimatedHours: 20,
    status: "not-started",
    milestones: [
      { id: "m1", title: "Find suitable project", completed: false },
      { id: "m2", title: "Understand codebase", completed: false },
      { id: "m3", title: "Identify contribution", completed: false },
      { id: "m4", title: "Implement change", completed: false },
      { id: "m5", title: "Submit PR", completed: false },
      { id: "m6", title: "Address review feedback", completed: false },
    ],
  },
  {
    id: "capstone",
    title: "Capstone Project",
    difficulty: "capstone",
    description:
      "Complete AI system that solves a real problem, documented as a portfolio piece.",
    skills: [
      "System Design",
      "AI Engineering",
      "Project Management",
      "Presentation",
    ],
    estimatedHours: 60,
    status: "not-started",
    milestones: [
      { id: "m1", title: "Problem selection", completed: false },
      { id: "m2", title: "Research & planning", completed: false },
      { id: "m3", title: "Architecture design", completed: false },
      { id: "m4", title: "Implementation", completed: false },
      { id: "m5", title: "Testing & evaluation", completed: false },
      { id: "m6", title: "Documentation", completed: false },
      { id: "m7", title: "Presentation", completed: false },
    ],
  },
];

const difficultyConfig = {
  guided: { color: "#22c55e", label: "Guided", icon: "📋" },
  independent: { color: "#3b82f6", label: "Independent", icon: "🔧" },
  production: { color: "#8b5cf6", label: "Production", icon: "🚀" },
  client: { color: "#f59e0b", label: "Client", icon: "🤝" },
  opensource: { color: "#06b6d4", label: "Open Source", icon: "🌐" },
  capstone: { color: "#ef4444", label: "Capstone", icon: "🏆" },
};

export function ProjectStudio() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const filteredProjects =
    filter === "all"
      ? projects
      : projects.filter((p) => p.difficulty === filter);

  const completedMilestones = (p: Project) =>
    p.milestones.filter((m) => m.completed).length;
  const progress = (p: Project) =>
    Math.round((completedMilestones(p) / p.milestones.length) * 100);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-bold mb-4">Project Studio</h3>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 text-xs rounded-lg ${filter === "all" ? "bg-white text-black" : "bg-white/10 text-white/60"}`}
        >
          All Projects
        </button>
        {Object.entries(difficultyConfig).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-3 py-1 text-xs rounded-lg ${filter === key ? "text-black" : "bg-white/10 text-white/60"}`}
            style={
              filter === key ? { backgroundColor: config.color } : undefined
            }
          >
            {config.icon} {config.label}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((project) => {
          const config = difficultyConfig[project.difficulty];
          const prog = progress(project);

          return (
            <button
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className={`text-left p-4 rounded-xl border transition-all ${
                selectedProject?.id === project.id
                  ? "border-[#22c55e]/50 bg-[#22c55e]/10"
                  : "border-white/10 bg-white/5 hover:border-white/20"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-2xl">{config.icon}</span>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={{
                    backgroundColor: config.color + "20",
                    color: config.color,
                  }}
                >
                  {config.label}
                </span>
              </div>
              <h4 className="font-semibold mb-1">{project.title}</h4>
              <p className="text-xs text-white/50 mb-3 line-clamp-2">
                {project.description}
              </p>

              {/* Progress Bar */}
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${prog}%`, backgroundColor: config.color }}
                  />
                </div>
                <span className="text-[10px] text-white/40">{prog}%</span>
              </div>

              <div className="flex items-center justify-between text-[10px] text-white/40">
                <span>
                  {completedMilestones(project)}/{project.milestones.length}{" "}
                  milestones
                </span>
                <span>{project.estimatedHours}h estimated</span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1 mt-2">
                {project.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/50"
                  >
                    {skill}
                  </span>
                ))}
                {project.skills.length > 3 && (
                  <span className="text-[10px] text-white/30">
                    +{project.skills.length - 3}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Project Detail */}
      {selectedProject && (
        <div className="mt-6 bg-black/30 rounded-xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-xl font-bold mb-1">
                {selectedProject.title}
              </h4>
              <p className="text-sm text-white/60">
                {selectedProject.description}
              </p>
            </div>
            <span
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{
                backgroundColor:
                  difficultyConfig[selectedProject.difficulty].color + "20",
                color: difficultyConfig[selectedProject.difficulty].color,
              }}
            >
              {difficultyConfig[selectedProject.difficulty].label}
            </span>
          </div>

          {/* Milestones */}
          <div className="mb-4">
            <h5 className="text-sm font-semibold mb-2">Milestones</h5>
            <div className="space-y-2">
              {selectedProject.milestones.map((milestone, i) => (
                <div key={milestone.id} className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                      milestone.completed
                        ? "bg-[#22c55e] text-black"
                        : "bg-white/10 text-white/40"
                    }`}
                  >
                    {milestone.completed ? "✓" : i + 1}
                  </span>
                  <span
                    className={`text-sm ${milestone.completed ? "text-white/60 line-through" : "text-white/80"}`}
                  >
                    {milestone.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="mb-4">
            <h5 className="text-sm font-semibold mb-2">Skills</h5>
            <div className="flex flex-wrap gap-2">
              {selectedProject.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/60"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Portfolio */}
          {selectedProject.portfolioArtifact && (
            <div className="bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <span className="text-[#22c55e]">📁</span>
                <span className="text-sm text-[#22c55e]">
                  Portfolio Artifact: {selectedProject.portfolioArtifact}
                </span>
              </div>
            </div>
          )}

          <button className="mt-4 w-full py-3 bg-[#22c55e] text-black font-semibold rounded-lg hover:bg-[#16a34a]">
            {selectedProject.status === "not-started"
              ? "Start Project"
              : selectedProject.status === "in-progress"
                ? "Continue Project"
                : "View Portfolio"}
          </button>
        </div>
      )}
    </div>
  );
}
