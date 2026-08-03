import { join } from 'path';
import { createRegistry } from '../../runtime/src/registry-loader.mjs';
import { parseGoal } from './planners/goal-planner.mjs';
import { CapabilityResolver } from './planners/capability-resolver.mjs';
import { WorkflowPlanner } from './planners/workflow-planner.mjs';
import { DependencyScheduler } from './scheduler/dependency-scheduler.mjs';
import { AgentOrchestrator } from './orchestrator/agent-orchestrator.mjs';
import { SkillExecutor } from './orchestrator/skill-executor.mjs';
import { EventBus } from './engines/event-bus.mjs';
import { StateManager } from './engines/state-manager.mjs';
import { ApprovalEngine } from './engines/approval-engine.mjs';
import { RecoveryEngine } from './engines/recovery-engine.mjs';
import { ObservabilityEngine } from './engines/observability-engine.mjs';
import { MetricsEngine } from './engines/metrics-engine.mjs';

/**
 * Bhavya Execution Engine (BEE) — the autonomous brain.
 *
 * Accepts a natural language goal, discovers capabilities from BAR,
 * constructs a DAG execution plan, resolves dependencies, assigns agents,
 * and executes the plan with retries, approvals, provenance, and observability.
 */
export class ExecutionEngine {
  #registry;
  #goalPlanner;
  #capabilityResolver;
  #workflowPlanner;
  #scheduler;
  #orchestrator;
  #skillExecutor;
  #eventBus;
  #stateManager;
  #approvalEngine;
  #recoveryEngine;
  #observability;
  #metrics;
  #activePlans = new Map();

  /**
   * @param {{ barPath?: string, stateDir?: string, log?: (msg: string) => void }} [opts]
   */
  constructor(opts = {}) {
    const barPath = opts.barPath || join(process.cwd(), 'bar');
    const stateDir = opts.stateDir || join(barPath, 'bee-state');
    const log = opts.log || (() => {});

    // Load BAR
    this.#registry = createRegistry({ barPath, log });
    this.#registry.load();

    // Initialize all engines
    this.#capabilityResolver = new CapabilityResolver(this.#registry);
    this.#workflowPlanner = new WorkflowPlanner(this.#registry, this.#capabilityResolver);
    this.#scheduler = new DependencyScheduler();
    this.#orchestrator = new AgentOrchestrator(this.#registry);
    this.#skillExecutor = new SkillExecutor(this.#registry);
    this.#eventBus = new EventBus();
    this.#stateManager = new StateManager(stateDir);
    this.#approvalEngine = new ApprovalEngine();
    this.#recoveryEngine = new RecoveryEngine();
    this.#observability = new ObservabilityEngine();
    this.#metrics = new MetricsEngine();
  }

  // ═══════════════════════════════════════════════════
  // Public API
  // ═══════════════════════════════════════════════════

  /**
   * Plan a goal — parse, resolve capabilities, build DAG.
   * Does NOT execute, just returns the plan.
   * @param {string} goalText - natural language goal
   * @returns {import('../types.mjs').ExecutionPlan}
   */
  plan(goalText) {
    // 1. Parse the goal
    const goal = parseGoal(goalText);

    // 2. Resolve capabilities from BAR
    const resolvedGoal = this.#capabilityResolver.resolve(goal);

    // 3. Resolve best workflow
    const workflow = this.#capabilityResolver.resolveWorkflow(resolvedGoal);
    if (workflow) {
      resolvedGoal.capabilities = [
        ...new Set([...resolvedGoal.capabilities, ...(workflow.related || [])]),
      ];
    }

    // 4. Build the execution plan as DAG
    const plan = this.#workflowPlanner.buildPlan(resolvedGoal);

    // 5. Assign agents
    this.#orchestrator.assignAgents(plan.nodes);

    // 6. Persist
    this.#stateManager.save(plan);

    return plan;
  }

  /**
   * Execute a plan — run all nodes in dependency order.
   * @param {string} planId
   * @param {{ dryRun?: boolean, maxParallel?: number }} [opts]
   */
  async execute(planId, opts = {}) {
    const state = this.#stateManager.load(planId);
    if (!state) throw new Error(`Plan not found: ${planId}`);

    // Reconstruct plan from state
    const plan = this.#reconstructPlan(state);
    plan.status = 'running';
    plan.startedAt = new Date().toISOString();

    this.#activePlans.set(planId, plan);
    this.#metrics.startPlan(planId, plan.goal);
    await this.#eventBus.planStarted(planId, plan.goal);

    try {
      await this.#executePlan(plan, opts);
    } catch (err) {
      plan.status = 'failed';
      plan.error = err.message;
      await this.#eventBus.planFailed(planId, err.message);
      this.#metrics.completePlan(planId, 'failed');
    }

    this.#stateManager.save(plan);
    return plan;
  }

  /**
   * Resume a paused or failed plan.
   * @param {string} planId
   */
  async resume(planId) {
    const state = this.#stateManager.load(planId);
    if (!state) throw new Error(`Plan not found: ${planId}`);

    // Reset failed/paused nodes to pending
    for (const node of state.nodes) {
      if (node.status === 'paused' || node.status === 'failed') {
        node.status = 'pending';
      }
    }

    const plan = this.#reconstructPlan(state);
    plan.status = 'running';

    await this.#executePlan(plan);
    return plan;
  }

  /**
   * Cancel a running plan.
   * @param {string} planId
   */
  async cancel(planId) {
    const plan = this.#activePlans.get(planId);
    if (plan) {
      plan.status = 'cancelled';
      for (const node of plan.nodes) {
        if (node.status === 'running' || node.status === 'pending') {
          node.status = 'cancelled';
        }
      }
      this.#metrics.completePlan(planId, 'cancelled');
      await this.#eventBus.emit('plan.cancelled', planId);
    }
    return plan;
  }

  /**
   * Get the execution graph as text.
   * @param {string} planId
   */
  graph(planId) {
    const state = this.#stateManager.load(planId);
    if (!state) return null;
    const plan = this.#reconstructPlan(state);
    return this.#workflowPlanner.getGraphText(plan);
  }

  /**
   * Get the trace (observability timeline) for a plan.
   * @param {string} planId
   */
  trace(planId) {
    return this.#observability.getTimeline(planId);
  }

  /**
   * Get waterfall view.
   * @param {string} planId
   */
  waterfall(planId) {
    return this.#observability.getWaterfall(planId);
  }

  /**
   * Get execution metrics.
   * @param {string} planId
   */
  metrics(planId) {
    return this.#metrics.getPlanSummary(planId);
  }

  /**
   * Inspect a plan's full state.
   * @param {string} planId
   */
  inspect(planId) {
    const state = this.#stateManager.load(planId);
    if (!state) return null;

    return {
      planId: state.planId,
      goal: state.goal,
      status: state.status,
      totalNodes: state.nodes.length,
      completed: state.nodes.filter(n => n.status === 'completed').length,
      failed: state.nodes.filter(n => n.status === 'failed').length,
      pending: state.nodes.filter(n => n.status === 'pending').length,
      running: state.nodes.filter(n => n.status === 'running').length,
      nodes: state.nodes.map(n => ({
        id: n.id,
        capabilityId: n.capabilityId,
        agentId: n.agentId,
        status: n.status,
        error: n.error,
      })),
      events: this.#eventBus.history({ planId, limit: 20 }),
      pendingApprovals: this.#approvalEngine.getPending(),
    };
  }

  /**
   * List all plans.
   * @param {{ status?: string }} [opts]
   */
  listPlans(opts) {
    return this.#stateManager.list(opts);
  }

  /**
   * Get available capabilities from BAR.
   */
  capabilities() {
    return this.#registry.getByKind('capability').map(c => ({
      id: c.id,
      name: c.name,
      domain: c.domain,
      status: c.implementation?.status || 'not-started',
    }));
  }

  /**
   * Get available agents from BAR.
   */
  agents() {
    return this.#orchestrator.getUtilization();
  }

  // ═══════════════════════════════════════════════════
  // Execution Engine Internals
  // ═══════════════════════════════════════════════════

  async #executePlan(plan, opts = {}) {
    const maxParallel = opts.maxParallel || 3;

    while (plan.status === 'running') {
      // Get nodes ready to execute
      const ready = this.#scheduler.getReadyNodes(plan);

      if (ready.length === 0) {
        // Check if all nodes are done
        const allDone = plan.nodes.every(n =>
          ['completed', 'failed', 'cancelled'].includes(n.status)
        );

        if (allDone) {
          const anyFailed = plan.nodes.some(n => n.status === 'failed');
          plan.status = anyFailed ? 'failed' : 'completed';
          plan.completedAt = new Date().toISOString();
          plan.metrics.completed = plan.nodes.filter(n => n.status === 'completed').length;
          plan.metrics.failed = plan.nodes.filter(n => n.status === 'failed').length;
          plan.metrics.totalDurationMs = new Date(plan.completedAt).getTime() - new Date(plan.startedAt).getTime();

          await this.#eventBus.planCompleted(plan.id, plan.metrics);
          this.#metrics.completePlan(plan.id, plan.status);
        }
        break;
      }

      // Execute ready nodes (up to maxParallel)
      const batch = ready.slice(0, maxParallel);
      const promises = batch.map(node => this.#executeNode(plan, node, opts));
      await Promise.allSettled(promises);
    }
  }

  async #executeNode(plan, node, opts = {}) {
    const spanId = this.#observability.startSpan(plan.id, node.id, 'execute');

    try {
      // Check approval requirement
      if (node.approval?.required) {
        node.status = 'waiting-approval';
        await this.#eventBus.nodeWaitingApproval(plan.id, node.id, node.approval.approvers);
        this.#observability.setAttribute(spanId, 'awaitingApproval', true);

        const decision = await this.#approvalEngine.request(node.id, node.approval);
        if (!decision.approved) {
          node.status = 'failed';
          node.error = `Approval denied by ${decision.approver}: ${decision.reason || 'denied'}`;
          this.#observability.endSpan(spanId, 'error', { decision });
          return;
        }
        await this.#eventBus.nodeApproved(plan.id, node.id, decision.approver);
      }

      // Execute the node
      node.status = 'running';
      node.attempt = (node.attempt || 0) + 1;
      node.startedAt = new Date().toISOString();
      await this.#eventBus.nodeStarted(plan.id, node.id, node.capabilityId);
      this.#observability.setAttribute(spanId, 'attempt', node.attempt);

      if (opts.dryRun) {
        node.status = 'completed';
        node.outputs = { dryRun: true, capabilityId: node.capabilityId };
        node.completedAt = new Date().toISOString();
      } else {
        this.#orchestrator.acquire(node.agentId);
        try {
          const result = await this.#skillExecutor.execute(node, plan.context);
          if (result.success) {
            node.status = 'completed';
            node.outputs = result.outputs;
            node.completedAt = new Date().toISOString();
            await this.#eventBus.nodeCompleted(plan.id, node.id, result.outputs);
            this.#observability.endSpan(plan.id, 'ok', { outputs: result.outputs });
          } else {
            throw new Error(result.error);
          }
        } finally {
          this.#orchestrator.release(node.agentId);
        }
      }

      // Record metrics
      const duration = new Date(node.completedAt).getTime() - new Date(node.startedAt).getTime();
      this.#metrics.recordNode(plan.id, {
        nodeId: node.id,
        capabilityId: node.capabilityId,
        agentId: node.agentId,
        status: node.status,
        durationMs: duration,
        attempts: node.attempt,
      });

      // Record provenance
      if (node.provenance) {
        node.provenance.executedAt = node.completedAt;
        node.provenance.durationMs = duration;
      }

    } catch (err) {
      node.status = 'failed';
      node.error = err.message;
      node.completedAt = new Date().toISOString();
      await this.#eventBus.nodeFailed(plan.id, node.id, err.message, node.attempt);
      this.#observability.endSpan(spanId, 'error', { error: err.message });

      // Handle recovery
      const recovery = await this.#recoveryEngine.handleFailure(node, plan.context);
      this.#metrics.recordEvent(plan.id, { type: 'recovery', nodeId: node.id, data: recovery });

      if (recovery.action === 'retry') {
        node.status = 'pending';
        node.attempt = recovery.attempt;
        await this.#eventBus.nodeRetrying(plan.id, node.id, recovery.attempt, node.retryPolicy?.maxAttempts);
        // The node will be picked up in the next scheduling round
      } else if (recovery.action === 'compensate') {
        node.status = 'compensating';
        await this.#eventBus.nodeCompensating(plan.id, node.id, recovery.reason);
        const completed = plan.nodes.filter(n => n.status === 'completed');
        await this.#recoveryEngine.compensateAll(completed, plan.context);
        node.status = 'compensated';
      }
      // action === 'fail': node stays failed
    }

    this.#stateManager.save(plan);
  }

  #reconstructPlan(state) {
    return {
      id: state.planId,
      goal: state.goal,
      status: state.status,
      nodes: state.nodes.map(n => ({ ...n })),
      layers: state.layers || [],
      context: state.context || {},
      startedAt: state.startedAt,
      completedAt: state.completedAt,
      metrics: state.metrics || { totalNodes: state.nodes.length, completed: 0, failed: 0, parallelized: 0, totalDurationMs: 0 },
    };
  }

  // ═══════════════════════════════════════════════════
  // Accessors for component interaction
  // ═══════════════════════════════════════════════════

  get events() { return this.#eventBus; }
  get approvals() { return this.#approvalEngine; }
  get observability() { return this.#observability; }
  get metricsEngine() { return this.#metrics; }
  get registry() { return this.#registry; }
}
