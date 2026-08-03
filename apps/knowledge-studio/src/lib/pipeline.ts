import { join } from "path";
import { createRegistry } from "../../../packages/runtime/src/registry-loader.mjs";
import { parseGoal } from "../../../packages/bee/src/planners/goal-planner.mjs";
import { CapabilityResolver } from "../../../packages/bee/src/planners/capability-resolver.mjs";
import { WorkflowPlanner } from "../../../packages/bee/src/planners/workflow-planner.mjs";
import { DependencyScheduler } from "../../../packages/scheduler/dependency-scheduler.mjs";
import { AgentOrchestrator } from "../../../packages/bee/src/orchestrator/agent-orchestrator.mjs";
import { EventBus } from "../../../packages/bee/src/engines/event-bus.mjs";
import { StateManager } from "../../../packages/bee/src/engines/state-manager.mjs";
import { ObservabilityEngine } from "../../../packages/bee/src/engines/observability-engine.mjs";
import { MetricsEngine } from "../../../packages/bee/src/engines/metrics-engine.mjs";
import { KnowledgePackage } from "../../../packages/bee/src/knowledge-package.mjs";
import { WebsiteBuilder } from "../../../packages/bee/src/engines/website-builder.mjs";
import { PublicationManager } from "../../../packages/bee/src/engines/publication-manager.mjs";
import { VersionManager } from "../../../packages/bee/src/engines/version-manager.mjs";
import { SearchEngine } from "../../../packages/bee/src/engines/search-engine.mjs";
import { MetricsDashboard } from "../../../packages/bee/src/engines/metrics-dashboard.mjs";
import { saveArtifact, type Artifact } from "./artifacts";

const ROOT = join(process.cwd(), "..", "..");

// Lazy-loaded builders
let builders: Record<string, any> = {};

async function loadBuilders() {
  if (Object.keys(builders).length > 0) return builders;

  const builderDir = join(ROOT, "packages", "runtime", "builders");

  const [
    lessonMod,
    assessmentMod,
    teacherMod,
    workbookMod,
    visualMod,
    videoMod,
    websiteMod,
  ] = await Promise.all([
    import(join(builderDir, "lesson.mjs")),
    import(join(builderDir, "assessment.mjs")),
    import(join(builderDir, "teacher-guide.mjs")),
    import(join(builderDir, "workbook.mjs")),
    import(join(builderDir, "visual-spec.mjs")),
    import(join(builderDir, "video.mjs")),
    import(join(builderDir, "website.mjs")),
  ]);

  builders = {
    lesson: lessonMod,
    assessment: assessmentMod,
    "teacher-guide": teacherMod,
    workbook: workbookMod,
    "visual-spec": visualMod,
    video: videoMod,
    website: websiteMod,
  };

  return builders;
}

export interface PipelineExecution {
  planId: string;
  goal: string;
  status: "planning" | "running" | "completed" | "failed" | "cancelled";
  startedAt: string;
  completedAt: string | null;
  ko: any;
  artifacts: Artifact[];
  nodeResults: {
    nodeId: string;
    capabilityId: string;
    status: string;
    artifactId?: string;
    error?: string;
  }[];
  events: any[];
  metrics: any;
  trace: any[];
  graph: string;
  knowledgePackage?: any;
  publication?: any;
  version?: any;
}

const activePipelines = new Map<string, PipelineExecution>();

// Export engines for external use
export const websiteBuilder = new WebsiteBuilder();
export const publicationManager = new PublicationManager();
export const versionManager = new VersionManager();
export const searchEngine = new SearchEngine();
export const metricsDashboard = new MetricsDashboard();

/**
 * Execute the full Knowledge Studio pipeline through BEE.
 * Extended stages: website → review → publish → version → search index.
 */
export async function executePipeline(
  ko: any,
  goal?: string,
): Promise<PipelineExecution> {
  const b = await loadBuilders();

  // Create BEE components
  const barPath = join(ROOT, "bar");
  const registry = createRegistry({ barPath, log: () => {} });
  registry.load();

  const capabilityResolver = new CapabilityResolver(registry);
  const workflowPlanner = new WorkflowPlanner(registry, capabilityResolver);
  const scheduler = new DependencyScheduler();
  const orchestrator = new AgentOrchestrator(registry);
  const eventBus = new EventBus();
  const stateManager = new StateManager(join(ROOT, "bar", "bee-state"));
  const observability = new ObservabilityEngine();
  const metrics = new MetricsEngine();

  // Parse goal
  const goalText =
    goal || `Create complete educational package for: ${ko.title}`;
  const parsedGoal = parseGoal(goalText);
  parsedGoal.capabilities = [
    "D03-C02",
    "D03-C04",
    "D03-C05",
    "D03-C01",
    "D08-C01",
    "D03-C06",
    "D03-C07",
    "D03-C08",
  ];

  // Build plan — create a custom DAG for the pipeline
  const plan = buildPipelinePlan(parsedGoal, ko.id);

  // Assign agents
  orchestrator.assignAgents(plan.nodes);

  const execution: PipelineExecution = {
    planId: plan.id,
    goal: goalText,
    status: "running",
    startedAt: new Date().toISOString(),
    completedAt: null,
    ko,
    artifacts: [],
    nodeResults: [],
    events: [],
    metrics: null,
    trace: [],
    graph: workflowPlanner.getGraphText(plan),
  };

  activePipelines.set(plan.id, execution);

  // Register event listener
  eventBus.on("*", (event: any) => {
    execution.events.push(event);
  });

  metrics.startPlan(plan.id, goalText);

  try {
    // Execute nodes in dependency order
    const layers = plan.layers;
    for (const layer of layers) {
      const readyNodes = layer
        .map((nodeId) => plan.nodes.find((n) => n.id === nodeId))
        .filter(Boolean);

      // Execute all nodes in this layer (they're independent)
      const results = await Promise.all(
        readyNodes.map((node) =>
          executeNode(node!, ko, b, {
            planId: plan.id,
            execution,
            eventBus,
            observability,
            metrics,
            stateManager,
          }),
        ),
      );

      execution.nodeResults.push(...results);
    }

    // Check if any node failed
    const anyFailed = execution.nodeResults.some((r) => r.status === "failed");
    execution.status = anyFailed ? "failed" : "completed";

    // ─── Post-pipeline: Knowledge Package + Website + Publish + Version ───
    if (!anyFailed) {
      const pkg = buildKnowledgePackage(ko, execution);
      execution.knowledgePackage = pkg.toJSON();

      // Website generation
      const website = websiteBuilder.build(pkg);
      pkg.website = website;
      saveArtifact({
        id: `art-website-${Date.now()}`,
        planId: execution.planId,
        type: "website",
        nodeId: "post-pipeline",
        capabilityId: "D03-C06",
        data: website,
        provenance: {
          capabilityId: "D03-C06",
          skillId: "SK-WEB-001",
          agentId: "system",
          sourceKoId: ko.id,
        },
        createdAt: new Date().toISOString(),
      });
      execution.artifacts.push({
        id: `art-website-${Date.now()}`,
        planId: execution.planId,
        type: "website",
        nodeId: "post-pipeline",
        capabilityId: "D03-C06",
        data: website,
        provenance: {
          capabilityId: "D03-C06",
          skillId: "SK-WEB-001",
          agentId: "system",
          sourceKoId: ko.id,
        },
        createdAt: new Date().toISOString(),
      });

      // Search indexing
      searchEngine.indexPackage(pkg);

      // Publication workflow
      pkg.status = "in_review";
      pkg.publication = {
        status: "in_review",
        submittedAt: new Date().toISOString(),
      };
      const approval = publicationManager.approve(pkg, "bee-system");
      execution.publication = pkg.publication;

      // Versioning
      if (approval.success) {
        const pubResult = publicationManager.publish(pkg);
        if (pubResult.success) {
          const verResult = versionManager.createVersion(
            pkg,
            "Initial release",
          );
          execution.version = {
            version: pkg.version,
            hash: pubResult.hash,
            versionId: verResult.versionId,
          };
          pkg.versionMeta = {
            createdAt: new Date().toISOString(),
            immutableHash: pubResult.hash,
            previousVersion: "1.0.0",
          };
        }
      }

      // Save package
      pkg.save();

      // Record in metrics dashboard
      metricsDashboard.recordPlan({
        id: plan.id,
        goal: parsedGoal,
        totalNodes: plan.nodes.length,
        parallelLayers: plan.layers.length,
        criticalPath: plan.criticalPath || [],
        estimatedDuration: plan.estimatedDuration || 0,
        agentCount: new Set(plan.nodes.map((n) => n.agentId)).size,
      });
      metricsDashboard.completePlan(plan.id, true);
    }

    execution.completedAt = new Date().toISOString();

    const totalDuration =
      new Date(execution.completedAt).getTime() -
      new Date(execution.startedAt).getTime();
    metrics.completePlan(plan.id, execution.status);

    execution.metrics = {
      ...metrics.getPlanSummary(plan.id),
      dashboard: metricsDashboard.getGlobalMetrics(),
    };
    execution.trace = observability.getTimeline(plan.id);

    // Save pipeline result
    const { savePipelineResult } = await import("./artifacts");
    savePipelineResult({
      planId: plan.id,
      goal: goalText,
      status: execution.status,
      artifacts: execution.artifacts,
      startedAt: execution.startedAt,
      completedAt: execution.completedAt,
      totalDurationMs: totalDuration,
      nodeResults: execution.nodeResults,
    });
  } catch (err: any) {
    execution.status = "failed";
    execution.completedAt = new Date().toISOString();
  }

  return execution;
}

async function executeNode(
  node: any,
  ko: any,
  b: Record<string, any>,
  ctx: {
    planId: string;
    execution: PipelineExecution;
    eventBus: EventBus;
    observability: ObservabilityEngine;
    metrics: MetricsEngine;
    stateManager: StateManager;
  },
): Promise<{
  nodeId: string;
  capabilityId: string;
  status: string;
  artifactId?: string;
  error?: string;
}> {
  const spanId = ctx.observability.startSpan(ctx.planId, node.id, "execute");

  node.status = "running";
  node.startedAt = new Date().toISOString();

  await ctx.eventBus.nodeStarted(ctx.planId, node.id, node.capabilityId);

  try {
    // Get previous artifacts for chaining
    const prevArtifacts = ctx.execution.artifacts;
    const getArtifact = (type: string) =>
      prevArtifacts.find((a) => a.type === type)?.data;

    let result: any;

    // Route to the correct builder based on skillId
    switch (node.skillId) {
      case "SK-L1-001": {
        const koData = typeof ko === "string" ? JSON.parse(ko) : ko;
        result = await b.lesson.execute({ knowledgeObject: koData });
        break;
      }
      case "SK-L1-002": {
        const lesson = getArtifact("lesson");
        if (!lesson) throw new Error("Lesson artifact not found");
        result = await b.assessment.execute({ lesson, knowledgeObject: ko });
        break;
      }
      case "SK-L1-003": {
        const lesson = getArtifact("lesson");
        if (!lesson) throw new Error("Lesson artifact not found");
        result = await b["teacher-guide"].execute({
          lesson,
          knowledgeObject: ko,
        });
        break;
      }
      case "SK-L1-004": {
        const lesson = getArtifact("lesson");
        if (!lesson) throw new Error("Lesson artifact not found");
        result = await b.workbook.execute({ lesson, knowledgeObject: ko });
        break;
      }
      case "SK-L3-001": {
        const lesson = getArtifact("lesson");
        if (!lesson) throw new Error("Lesson artifact not found");
        result = await b["visual-spec"].execute({ lesson });
        break;
      }
      case "SK-L3-002": {
        const visualSpec = getArtifact("visual-spec");
        const lesson = getArtifact("lesson");
        if (!visualSpec || !lesson)
          throw new Error("Visual spec or lesson not found");
        result = await b.video.execute({ visualSpec, lesson });
        break;
      }
      default: {
        const builderName = node.skillId
          ?.replace("SK-L1-", "")
          .replace("SK-L3-", "");
        if (b[builderName]) {
          const lesson = getArtifact("lesson");
          result = await b[builderName].execute({
            lesson,
            knowledgeObject: ko,
          });
        } else {
          result = {
            output: {
              [node.capabilityId]: { status: "completed", simulated: true },
            },
          };
        }
      }
    }

    // Save artifact
    const artifactType = getArtifactType(node.skillId);
    const artifact: Artifact = {
      id: `art-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      planId: ctx.planId,
      type: artifactType,
      nodeId: node.id,
      capabilityId: node.capabilityId,
      data: result.output || result,
      provenance: {
        capabilityId: node.capabilityId,
        skillId: node.skillId,
        agentId: node.agentId,
        sourceKoId: ko.id || ko,
        executedAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
    };

    saveArtifact(artifact);
    ctx.execution.artifacts.push(artifact);

    node.status = "completed";
    node.completedAt = new Date().toISOString();
    node.outputs = artifact.data;

    await ctx.eventBus.nodeCompleted(ctx.planId, node.id, artifact.data);

    const duration =
      new Date(node.completedAt).getTime() - new Date(node.startedAt).getTime();
    ctx.metrics.recordNode(ctx.planId, {
      nodeId: node.id,
      capabilityId: node.capabilityId,
      agentId: node.agentId,
      status: "completed",
      durationMs: duration,
      attempts: 1,
    });

    ctx.observability.endSpan(spanId, "ok", { artifactId: artifact.id });

    return {
      nodeId: node.id,
      capabilityId: node.capabilityId,
      status: "completed",
      artifactId: artifact.id,
    };
  } catch (err: any) {
    node.status = "failed";
    node.error = err.message;
    node.completedAt = new Date().toISOString();

    await ctx.eventBus.nodeFailed(ctx.planId, node.id, err.message, 1);
    ctx.observability.endSpan(spanId, "error", { error: err.message });

    return {
      nodeId: node.id,
      capabilityId: node.capabilityId,
      status: "failed",
      error: err.message,
    };
  }
}

function getArtifactType(skillId: string): string {
  const map: Record<string, string> = {
    "SK-L1-001": "lesson",
    "SK-L1-002": "assessment",
    "SK-L1-003": "teacher-guide",
    "SK-L1-004": "workbook",
    "SK-L3-001": "visual-spec",
    "SK-L3-002": "video",
  };
  return map[skillId] || "unknown";
}

function buildKnowledgePackage(ko: any, execution: PipelineExecution) {
  const getArtifact = (type: string) =>
    execution.artifacts.find((a) => a.type === type)?.data;

  return new KnowledgePackage({
    title: ko.title || execution.ko?.title,
    description: ko.description || execution.ko?.description,
    domain: ko.domain || execution.ko?.domain,
    subject: ko.subject || execution.ko?.subject,
    gradeLevel: ko.gradeLevel || execution.ko?.gradeLevel,
    source: ko.source || {
      type: "text",
      content: ko.title,
      ingestedAt: new Date().toISOString(),
    },
    ko: ko,
    lesson: getArtifact("lesson"),
    assessment: getArtifact("assessment"),
    teacherGuide: getArtifact("teacher-guide"),
    workbook: getArtifact("workbook"),
    visualSpec: getArtifact("visual-spec"),
    video: getArtifact("video"),
    provenance: execution.artifacts.map((a) => ({
      capabilityId: a.provenance?.capabilityId,
      skillId: a.provenance?.skillId,
      agentId: a.provenance?.agentId,
      sourceKoId: a.provenance?.sourceKoId,
      executedAt: a.provenance?.executedAt,
      durationMs: 0,
    })),
    executionTrace: execution.nodeResults.map((n) => ({
      nodeId: n.nodeId,
      capabilityId: n.capabilityId,
      status: n.status,
      durationMs: 0,
    })),
  });
}

function buildPipelinePlan(goal: any, koId: string) {
  const now = Date.now();
  const id = `plan-${now}-${Math.random().toString(36).slice(2, 8)}`;

  const nodes = [
    {
      id: "n-001",
      capabilityId: "D03-C02",
      skillId: "SK-L1-001",
      agentId: "AG-EDU-001",
      dependencies: [],
      status: "pending",
      inputs: { koId },
      outputs: null,
      startedAt: null,
      completedAt: null,
      error: null,
      attempt: 0,
      timeoutMs: 300000,
      retryPolicy: { maxAttempts: 3, backoffMs: 1000, strategy: "exponential" },
      provenance: {
        capabilityId: "D03-C02",
        skillId: "SK-L1-001",
        actor: "bee-engine",
      },
    },
    {
      id: "n-002",
      capabilityId: "D03-C04",
      skillId: "SK-L1-002",
      agentId: "AG-EDU-001",
      dependencies: ["n-001"],
      status: "pending",
      inputs: { koId },
      outputs: null,
      startedAt: null,
      completedAt: null,
      error: null,
      attempt: 0,
      timeoutMs: 300000,
      retryPolicy: { maxAttempts: 3, backoffMs: 1000, strategy: "exponential" },
      provenance: {
        capabilityId: "D03-C04",
        skillId: "SK-L1-002",
        actor: "bee-engine",
      },
    },
    {
      id: "n-003",
      capabilityId: "D03-C05",
      skillId: "SK-L1-003",
      agentId: "AG-EDU-002",
      dependencies: ["n-001"],
      status: "pending",
      inputs: { koId },
      outputs: null,
      startedAt: null,
      completedAt: null,
      error: null,
      attempt: 0,
      timeoutMs: 300000,
      retryPolicy: { maxAttempts: 3, backoffMs: 1000, strategy: "exponential" },
      provenance: {
        capabilityId: "D03-C05",
        skillId: "SK-L1-003",
        actor: "bee-engine",
      },
    },
    {
      id: "n-004",
      capabilityId: "D03-C01",
      skillId: "SK-L1-004",
      agentId: "AG-EDU-001",
      dependencies: ["n-001"],
      status: "pending",
      inputs: { koId },
      outputs: null,
      startedAt: null,
      completedAt: null,
      error: null,
      attempt: 0,
      timeoutMs: 300000,
      retryPolicy: { maxAttempts: 3, backoffMs: 1000, strategy: "exponential" },
      provenance: {
        capabilityId: "D03-C01",
        skillId: "SK-L1-004",
        actor: "bee-engine",
      },
    },
    {
      id: "n-005",
      capabilityId: "D08-C01",
      skillId: "SK-L3-001",
      agentId: "AG-MEDIA-001",
      dependencies: ["n-001"],
      status: "pending",
      inputs: { koId },
      outputs: null,
      startedAt: null,
      completedAt: null,
      error: null,
      attempt: 0,
      timeoutMs: 300000,
      retryPolicy: { maxAttempts: 3, backoffMs: 1000, strategy: "exponential" },
      provenance: {
        capabilityId: "D08-C01",
        skillId: "SK-L3-001",
        actor: "bee-engine",
      },
    },
    {
      id: "n-006",
      capabilityId: "D08-C02",
      skillId: "SK-L3-002",
      agentId: "AG-MEDIA-001",
      dependencies: ["n-005"],
      status: "pending",
      inputs: { koId },
      outputs: null,
      startedAt: null,
      completedAt: null,
      error: null,
      attempt: 0,
      timeoutMs: 300000,
      retryPolicy: { maxAttempts: 3, backoffMs: 1000, strategy: "exponential" },
      provenance: {
        capabilityId: "D08-C02",
        skillId: "SK-L3-002",
        actor: "bee-engine",
      },
    },
  ];

  return {
    id,
    goal: goal.text,
    status: "pending",
    nodes,
    layers: [["n-001"], ["n-002", "n-003", "n-004", "n-005"], ["n-006"]],
    context: { goal, koId },
    metrics: {
      totalNodes: 6,
      completed: 0,
      failed: 0,
      parallelized: 3,
      totalDurationMs: 0,
    },
  };
}

export function getPipeline(planId: string): PipelineExecution | null {
  return activePipelines.get(planId) || null;
}

export function listPipelines(): PipelineExecution[] {
  return [...activePipelines.values()];
}
