export interface ValidationStep {
  id: string;
  action: string;
  expectedOutcome: string;
  page: string;
  status: "pass" | "fail" | "partial" | "not-tested";
  notes?: string;
}

export interface PersonaValidation {
  persona: string;
  description: string;
  goal: string;
  steps: ValidationStep[];
  overallStatus: "pass" | "fail" | "partial";
  completionRate: number;
}

export const beginnerValidation: PersonaValidation = {
  persona: "Beginner",
  description: "New learner with no AI background",
  goal: "I want to learn AI from scratch",
  steps: [
    {
      id: "b1",
      action: "Visit homepage",
      expectedOutcome:
        "Landing page loads with clear value proposition and school listings",
      page: "/",
      status: "not-tested",
    },
    {
      id: "b2",
      action: "Browse schools",
      expectedOutcome:
        "School catalog displays available learning schools with descriptions",
      page: "/schools",
      status: "not-tested",
    },
    {
      id: "b3",
      action: "Start AI Foundations",
      expectedOutcome:
        "AI Foundations school page opens with curriculum overview and enrollment option",
      page: "/schools/ai-foundations",
      status: "not-tested",
    },
    {
      id: "b4",
      action: "Complete Lesson 1",
      expectedOutcome:
        "Lesson content loads, progress saves, and lesson marks complete",
      page: "/learn/ai-foundations/lesson-1",
      status: "not-tested",
    },
    {
      id: "b5",
      action: "Take Quiz",
      expectedOutcome:
        "Quiz renders with questions, accepts answers, and scores result",
      page: "/learn/ai-foundations/lesson-1/quiz",
      status: "not-tested",
    },
    {
      id: "b6",
      action: "Open Lab",
      expectedOutcome:
        "Lab environment initializes with workspace and instructions",
      page: "/labs/ai-foundations-intro",
      status: "not-tested",
    },
    {
      id: "b7",
      action: "View Progress",
      expectedOutcome:
        "Dashboard shows completed lesson, quiz score, and lab status",
      page: "/dashboard",
      status: "not-tested",
    },
    {
      id: "b8",
      action: "Verify persistence",
      expectedOutcome:
        "Progress remains after page refresh and session restore",
      page: "/dashboard",
      status: "not-tested",
    },
  ],
  overallStatus: "partial",
  completionRate: 0,
};

export const intermediateValidation: PersonaValidation = {
  persona: "Intermediate",
  description: "Developer with basic ML knowledge",
  goal: "I want to improve my ML skills",
  steps: [
    {
      id: "i1",
      action: "Login",
      expectedOutcome:
        "Authentication flow completes and redirects to dashboard",
      page: "/auth/login",
      status: "not-tested",
    },
    {
      id: "i2",
      action: "View Dashboard",
      expectedOutcome:
        "Dashboard displays enrolled courses, progress metrics, and recommendations",
      page: "/dashboard",
      status: "not-tested",
    },
    {
      id: "i3",
      action: "Continue ML Course",
      expectedOutcome:
        "ML course page opens at last completed lesson with resume prompt",
      page: "/learn/ml-engineering",
      status: "not-tested",
    },
    {
      id: "i4",
      action: "Complete Module",
      expectedOutcome:
        "Module content plays, exercises submit, and module marks complete",
      page: "/learn/ml-engineering/module-3",
      status: "not-tested",
    },
    {
      id: "i5",
      action: "Review Knowledge Graph",
      expectedOutcome:
        "Knowledge graph visualizes concepts, connections, and mastery levels",
      page: "/knowledge-graph",
      status: "not-tested",
    },
    {
      id: "i6",
      action: "Access Research Library",
      expectedOutcome:
        "Research library loads with searchable papers and resource listings",
      page: "/research",
      status: "not-tested",
    },
    {
      id: "i7",
      action: "Verify cross-module progress",
      expectedOutcome:
        "Progress syncs across dashboard, knowledge graph, and research library",
      page: "/dashboard",
      status: "not-tested",
    },
  ],
  overallStatus: "partial",
  completionRate: 0,
};

export const advancedValidation: PersonaValidation = {
  persona: "Advanced",
  description: "ML practitioner targeting transformer architectures",
  goal: "I want to master transformers and LLMs",
  steps: [
    {
      id: "a1",
      action: "Navigate to Learning Paths",
      expectedOutcome:
        "Learning paths page shows progressive stages with prerequisites",
      page: "/learning-paths",
      status: "not-tested",
    },
    {
      id: "a2",
      action: "Start Transformers Stage",
      expectedOutcome:
        "Transformers path opens with stage breakdown and time estimates",
      page: "/learning-paths/transformers",
      status: "not-tested",
    },
    {
      id: "a3",
      action: "Complete Lesson",
      expectedOutcome:
        "Advanced lesson content renders with code examples and references",
      page: "/learning-paths/transformers/attention-mechanisms",
      status: "not-tested",
    },
    {
      id: "a4",
      action: "Run Notebook",
      expectedOutcome:
        "Jupyter notebook executes cells and displays outputs in-browser",
      page: "/labs/transformers-notebook",
      status: "not-tested",
    },
    {
      id: "a5",
      action: "Build Project",
      expectedOutcome:
        "Project workspace provides templates, instructions, and submission flow",
      page: "/projects/build-transformer",
      status: "not-tested",
    },
    {
      id: "a6",
      action: "View Portfolio",
      expectedOutcome:
        "Portfolio aggregates projects, certificates, and skill endorsements",
      page: "/portfolio",
      status: "not-tested",
    },
    {
      id: "a7",
      action: "Verify portfolio update",
      expectedOutcome:
        "Newly completed project appears in portfolio with metadata",
      page: "/portfolio",
      status: "not-tested",
    },
  ],
  overallStatus: "partial",
  completionRate: 0,
};

export const researcherValidation: PersonaValidation = {
  persona: "Researcher",
  description: "Academic or industry researcher seeking papers and resources",
  goal: "I want to find research papers and resources",
  steps: [
    {
      id: "r1",
      action: "Visit Research Library",
      expectedOutcome:
        "Research library landing page loads with search bar and category filters",
      page: "/research",
      status: "not-tested",
    },
    {
      id: "r2",
      action: "Search papers",
      expectedOutcome:
        "Search returns relevant papers with titles, abstracts, and metadata",
      page: "/research/search",
      status: "not-tested",
    },
    {
      id: "r3",
      action: "Filter by topic",
      expectedOutcome:
        "Topic filters narrow results and update count in real time",
      page: "/research/search",
      status: "not-tested",
    },
    {
      id: "r4",
      action: "Save paper",
      expectedOutcome:
        "Paper saves to user library and confirmation toast appears",
      page: "/research/paper/attention-is-all-you-need",
      status: "not-tested",
    },
    {
      id: "r5",
      action: "View citations",
      expectedOutcome:
        "Citation panel shows paper references, DOI, and export options",
      page: "/research/paper/attention-is-all-you-need/citations",
      status: "not-tested",
    },
    {
      id: "r6",
      action: "Access Knowledge Graph",
      expectedOutcome:
        "Knowledge graph displays paper connections and related research nodes",
      page: "/knowledge-graph",
      status: "not-tested",
    },
  ],
  overallStatus: "partial",
  completionRate: 0,
};

export const allValidations: PersonaValidation[] = [
  beginnerValidation,
  intermediateValidation,
  advancedValidation,
  researcherValidation,
];

export function calculateCompletionRate(validation: PersonaValidation): number {
  const tested = validation.steps.filter((s) => s.status !== "not-tested");
  const passed = validation.steps.filter((s) => s.status === "pass");
  if (tested.length === 0) return 0;
  return Math.round((passed.length / validation.steps.length) * 100);
}

export function updateValidationStatus(
  validation: PersonaValidation,
  stepId: string,
  status: ValidationStep["status"],
  notes?: string,
): PersonaValidation {
  const updatedSteps = validation.steps.map((step) =>
    step.id === stepId ? { ...step, status, notes } : step,
  );
  const completionRate = Math.round(
    (updatedSteps.filter((s) => s.status === "pass").length /
      updatedSteps.length) *
      100,
  );
  const overallStatus =
    completionRate === 100 ? "pass" : completionRate > 0 ? "partial" : "fail";
  return {
    ...validation,
    steps: updatedSteps,
    overallStatus,
    completionRate,
  };
}
