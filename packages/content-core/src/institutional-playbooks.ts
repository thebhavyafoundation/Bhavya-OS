import {
  DecisionContext,
  LessonLearned,
  InstitutionalPattern,
  Mission,
  ActionItem,
  BoardMeeting,
  Resolution,
  Policy,
  TraceabilityChain,
} from "./models";
import {
  getDecisionContexts,
  getLessons,
  getPatterns,
} from "./institutional-memory";
import {
  analyzePatterns,
  generateLearningReport,
} from "./organizational-learning";
import {
  generatePredictions,
  assessRisks,
} from "./predictive-intelligence";
import {
  getMissions,
} from "./forest";
import {
  getResolutions,
} from "./governance";
import {
  getActionItems,
} from "./action-items";

// ── Playbook Types ─────────────────────────────────────────

export interface Playbook {
  id: string;
  name: string;
  description: string;
  missionType: string;
  domain: "forest" | "heritage" | "research" | "volunteer" | "governance" | "knowledge" | "cross-domain";
  version: string;
  lastUpdated: string;
  confidence: number;
  sourceCount: number;
  tags: string[];
  phases: PlaybookPhase[];
  lessons: string[];
  patterns: string[];
  risks: string[];
  successCriteria: string[];
}

export interface PlaybookPhase {
  id: string;
  name: string;
  description: string;
  order: number;
  duration?: string;
  tasks: PlaybookTask[];
  decisions: string[];
  evidence: string[];
}

export interface PlaybookTask {
  id: string;
  name: string;
  description: string;
  responsible: string;
  duration?: string;
  dependencies: string[];
  successIndicators: string[];
}

// ── Playbook Generation ────────────────────────────────────

export function generatePlaybooks(): Playbook[] {
  const playbooks: Playbook[] = [];
  const patterns = getPatterns();
  const lessons = getLessons();
  const decisions = getDecisionContexts();

  // Forest Mission Playbook
  const forestPatterns = patterns.filter((p) => p.patternType === "mission");
  const forestLessons = lessons.filter((l) => l.category === "mission");

  playbooks.push({
    id: "playbook-forest-mission",
    name: "Forest Mission Playbook",
    description: "Reusable guidance for forest conservation and restoration missions",
    missionType: "forest-conservation",
    domain: "forest",
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
    confidence: forestPatterns.length > 0
      ? Math.round(forestPatterns.reduce((sum, p) => sum + p.confidence, 0) / forestPatterns.length * 100) / 100
      : 0.5,
    sourceCount: forestPatterns.length + forestLessons.length,
    tags: ["forest", "conservation", "restoration", "biodiversity"],
    phases: [
      {
        id: "phase-1",
        name: "Planning & Assessment",
        description: "Assess site conditions and plan intervention",
        order: 1,
        duration: "2-4 weeks",
        tasks: [
          {
            id: "task-1.1",
            name: "Site Assessment",
            description: "Evaluate current forest conditions and biodiversity",
            responsible: "Forest Manager",
            duration: "1 week",
            dependencies: [],
            successIndicators: ["Assessment report completed", "Baseline data collected"],
          },
          {
            id: "task-1.2",
            name: "Stakeholder Engagement",
            description: "Engage local communities and government agencies",
            responsible: "Community Lead",
            duration: "2 weeks",
            dependencies: [],
            successIndicators: ["Stakeholder map created", "MOUs signed"],
          },
        ],
        decisions: decisions.filter((d) => d.decisionType === "mission").map((d) => d.id).slice(0, 2),
        evidence: [],
      },
      {
        id: "phase-2",
        name: "Implementation",
        description: "Execute forest conservation or restoration activities",
        order: 2,
        duration: "3-6 months",
        tasks: [
          {
            id: "task-2.1",
            name: "Native Species Planting",
            description: "Plant native tree species in degraded areas",
            responsible: "Field Team",
            duration: "2-3 months",
            dependencies: ["task-1.1", "task-1.2"],
            successIndicators: ["Survival rate > 80%", "Species diversity maintained"],
          },
          {
            id: "task-2.2",
            name: "Community Training",
            description: "Train local communities in sustainable forest management",
            responsible: "Training Lead",
            duration: "1 month",
            dependencies: ["task-1.2"],
            successIndicators: ["Training sessions completed", "Participants certified"],
          },
        ],
        decisions: [],
        evidence: [],
      },
      {
        id: "phase-3",
        name: "Monitoring & Evaluation",
        description: "Track outcomes and capture learnings",
        order: 3,
        duration: "Ongoing",
        tasks: [
          {
            id: "task-3.1",
            name: "Biodiversity Monitoring",
            description: "Monitor forest health and biodiversity indicators",
            responsible: "Research Lead",
            duration: "Ongoing",
            dependencies: ["task-2.1"],
            successIndicators: ["Monitoring reports generated", "Data updated quarterly"],
          },
          {
            id: "task-3.2",
            name: "Impact Documentation",
            description: "Document outcomes and capture institutional lessons",
            responsible: "Knowledge Lead",
            duration: "Quarterly",
            dependencies: ["task-3.1"],
            successIndicators: ["Impact report published", "Lessons captured"],
          },
        ],
        decisions: [],
        evidence: forestPatterns.map((p) => p.id),
      },
    ],
    lessons: forestLessons.map((l) => l.id),
    patterns: forestPatterns.map((p) => p.id),
    risks: assessRisks().map((r) => r.id),
    successCriteria: [
      "Forest cover increased by measurable amount",
      "Biodiversity indicators improved",
      "Community engagement sustained",
      "Institutional lessons captured",
    ],
  });

  // Governance Mission Playbook
  const governancePatterns = patterns.filter((p) => p.patternType === "governance");
  const governanceLessons = lessons.filter((l) => l.category === "governance");

  playbooks.push({
    id: "playbook-governance-mission",
    name: "Governance Mission Playbook",
    description: "Reusable guidance for governance and policy operations",
    missionType: "governance-operations",
    domain: "governance",
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
    confidence: governancePatterns.length > 0
      ? Math.round(governancePatterns.reduce((sum, p) => sum + p.confidence, 0) / governancePatterns.length * 100) / 100
      : 0.5,
    sourceCount: governancePatterns.length + governanceLessons.length,
    tags: ["governance", "policy", "board", "resolutions"],
    phases: [
      {
        id: "phase-1",
        name: "Agenda & Preparation",
        description: "Prepare board meeting agenda and supporting materials",
        order: 1,
        duration: "2 weeks",
        tasks: [
          {
            id: "task-1.1",
            name: "Agenda Compilation",
            description: "Compile agenda items from stakeholders",
            responsible: "Secretary",
            duration: "1 week",
            dependencies: [],
            successIndicators: ["Agenda finalized", "Supporting documents distributed"],
          },
          {
            id: "task-1.2",
            name: "Pre-meeting Briefing",
            description: "Prepare board members with briefing materials",
            responsible: "Executive Director",
            duration: "3 days",
            dependencies: ["task-1.1"],
            successIndicators: ["Briefing materials sent", "Quorum confirmed"],
          },
        ],
        decisions: [],
        evidence: [],
      },
      {
        id: "phase-2",
        name: "Board Meeting & Resolution",
        description: "Conduct board meeting and pass resolutions",
        order: 2,
        duration: "1 day",
        tasks: [
          {
            id: "task-2.1",
            name: "Meeting Facilitation",
            description: "Facilitate board discussion and voting",
            responsible: "Chairperson",
            duration: "2-4 hours",
            dependencies: ["task-1.1", "task-1.2"],
            successIndicators: ["Minutes recorded", "Resolutions passed"],
          },
          {
            id: "task-2.2",
            name: "Resolution Drafting",
            description: "Draft approved resolutions for implementation",
            responsible: "Secretary",
            duration: "1 day",
            dependencies: ["task-2.1"],
            successIndicators: ["Resolutions documented", "Action items assigned"],
          },
        ],
        decisions: decisions.filter((d) => d.decisionType === "policy").map((d) => d.id).slice(0, 2),
        evidence: [],
      },
      {
        id: "phase-3",
        name: "Implementation & Tracking",
        description: "Implement resolutions and track progress",
        order: 3,
        duration: "1-3 months",
        tasks: [
          {
            id: "task-3.1",
            name: "Action Item Execution",
            description: "Execute assigned action items from resolutions",
            responsible: "Action Owners",
            duration: "Varies",
            dependencies: ["task-2.2"],
            successIndicators: ["Action items completed on time", "Progress reported"],
          },
          {
            id: "task-3.2",
            name: "Compliance Verification",
            description: "Verify compliance with approved policies",
            responsible: "Compliance Officer",
            duration: "Ongoing",
            dependencies: ["task-3.1"],
            successIndicators: ["Compliance audits passed", "Issues addressed"],
          },
        ],
        decisions: [],
        evidence: governancePatterns.map((p) => p.id),
      },
    ],
    lessons: governanceLessons.map((l) => l.id),
    patterns: governancePatterns.map((p) => p.id),
    risks: assessRisks().map((r) => r.id),
    successCriteria: [
      "Board meetings conducted on schedule",
      "Resolutions implemented within timelines",
      "Policy compliance maintained",
      "Institutional governance improved",
    ],
  });

  return playbooks;
}

// ── Playbook Retrieval ─────────────────────────────────────

export function getPlaybooks(): Playbook[] {
  return generatePlaybooks();
}

export function getPlaybookById(id: string): Playbook | undefined {
  return generatePlaybooks().find((p) => p.id === id);
}

export function getPlaybooksByDomain(domain: Playbook["domain"]): Playbook[] {
  return generatePlaybooks().filter((p) => p.domain === domain);
}

// ── Playbook Summary ───────────────────────────────────────

export function getPlaybookSummary(): {
  totalPlaybooks: number;
  domains: number;
  avgConfidence: number;
  totalPhases: number;
  totalTasks: number;
} {
  const playbooks = generatePlaybooks();
  const domains = new Set(playbooks.map((p) => p.domain)).size;
  const avgConfidence = playbooks.length > 0
    ? Math.round((playbooks.reduce((sum, p) => sum + p.confidence, 0) / playbooks.length) * 100) / 100
    : 0;
  const totalPhases = playbooks.reduce((sum, p) => sum + p.phases.length, 0);
  const totalTasks = playbooks.reduce((sum, p) => sum + p.phases.reduce((sum, ph) => sum + ph.tasks.length, 0), 0);

  return {
    totalPlaybooks: playbooks.length,
    domains,
    avgConfidence,
    totalPhases,
    totalTasks,
  };
}
