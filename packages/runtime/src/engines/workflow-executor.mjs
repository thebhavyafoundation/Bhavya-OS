/**
 * Workflow Executor — executes workflows defined in BAR.
 * Each workflow is a sequence of steps, each mapped to a skill.
 */
export class WorkflowExecutor {
  #registry;
  #eventDispatcher;
  #provenance;
  #executions = new Map();

  /**
   * @param {import('../registry-loader.mjs').RegistryLoader} registry
   * @param {import('./event-dispatcher.mjs').EventDispatcher} [events]
   * @param {import('./provenance-engine.mjs').ProvenanceEngine} [provenance]
   */
  constructor(registry, events, provenance) {
    this.#registry = registry;
    this.#eventDispatcher = events;
    this.#provenance = provenance;
  }

  /**
   * Execute a workflow.
   * @param {string} workflowId - e.g., 'WF-001'
   * @param {Record<string, any>} input - Input data
   * @param {{ actor?: string, dryRun?: boolean }} [opts]
   * @returns {Promise<Object>} Execution result
   */
  async execute(workflowId, input = {}, opts = {}) {
    const workflow = this.#registry.get(workflowId);
    if (!workflow || workflow.kind !== 'workflow') {
      return { success: false, error: `Workflow not found: ${workflowId}` };
    }

    const executionId = `${workflowId}-${Date.now()}`;
    const execution = {
      id: executionId,
      workflowId,
      workflow: workflow.name,
      input,
      status: 'running',
      startedAt: new Date().toISOString(),
      steps: [],
      output: null,
      actor: opts.actor || 'system',
    };

    this.#executions.set(executionId, execution);

    // Dispatch started event
    if (this.#eventDispatcher) {
      await this.#eventDispatcher.workflow('started', workflowId, { executionId });
    }

    try {
      // Resolve the workflow's skill chain
      const skillChain = this.#resolveSkillChain(workflow);
      execution.steps = skillChain.map(s => ({
        skillId: s.id,
        skillName: s.name,
        status: 'pending',
        input: null,
        output: null,
      }));

      // Execute each step
      let currentInput = input;
      for (let i = 0; i < skillChain.length; i++) {
        const skill = skillChain[i];
        const step = execution.steps[i];

        step.status = 'running';
        step.input = currentInput;
        step.startedAt = new Date().toISOString();

        if (opts.dryRun) {
          step.status = 'dry-run';
          step.output = { dryRun: true, skill: skill.name };
        } else {
          // In a real implementation, this would invoke the skill's handler
          step.output = { skill: skill.name, status: 'simulated' };
          step.status = 'completed';
        }

        step.completedAt = new Date().toISOString();
        currentInput = { ...currentInput, ...step.output };
      }

      execution.status = 'completed';
      execution.output = currentInput;
      execution.completedAt = new Date().toISOString();

      // Record provenance
      if (this.#provenance) {
        this.#provenance.record(executionId, {
          capabilityId: workflow.related?.[0],
          workflowId,
          skillId: skillChain[0]?.id,
          actor: execution.actor,
          source: `workflow:${workflowId}`,
        });
      }

      // Dispatch completed event
      if (this.#eventDispatcher) {
        await this.#eventDispatcher.workflow('completed', workflowId, { executionId });
      }

    } catch (error) {
      execution.status = 'failed';
      execution.error = error.message;
      execution.completedAt = new Date().toISOString();

      if (this.#eventDispatcher) {
        await this.#eventDispatcher.workflow('failed', workflowId, {
          executionId,
          error: error.message,
        });
      }
    }

    return execution;
  }

  /**
   * Simulate a workflow execution (dry run).
   * @param {string} workflowId
   * @param {Record<string, any>} input
   */
  async simulate(workflowId, input = {}) {
    return this.execute(workflowId, input, { dryRun: true });
  }

  /**
   * Get execution history.
   * @param {number} [limit=20]
   */
  history(limit = 20) {
    return [...this.#executions.values()].slice(-limit);
  }

  /**
   * Get a specific execution.
   * @param {string} executionId
   */
  getExecution(executionId) {
    return this.#executions.get(executionId) || null;
  }

  /**
   * List all available workflows from BAR.
   */
  listWorkflows() {
    return this.#registry.getByKind('workflow').map(w => ({
      id: w.id,
      name: w.name,
      domain: w.domain,
      description: w.description,
      status: w.status,
      impl: w.implementation?.status,
    }));
  }

  /**
   * Get workflow stats.
   */
  stats() {
    const executions = [...this.#executions.values()];
    return {
      totalWorkflows: this.#registry.getByKind('workflow').length,
      totalExecutions: executions.length,
      byStatus: {
        completed: executions.filter(e => e.status === 'completed').length,
        failed: executions.filter(e => e.status === 'failed').length,
        running: executions.filter(e => e.status === 'running').length,
      },
    };
  }

  // ─── Private ────────────────────────────────────

  /**
   * Resolve the skill chain for a workflow.
   * @param {Object} workflow
   * @returns {Object[]} Ordered list of skills
   */
  #resolveSkillChain(workflow) {
    // Find skills related to this workflow
    const relatedSkills = (workflow.related || [])
      .map(id => this.#registry.get(id))
      .filter(e => e && e.kind === 'skill');

    if (relatedSkills.length > 0) return relatedSkills;

    // Fallback: find skills in the same domain
    const domainSkills = this.#registry.getByKind('skill')
      .filter(s => s.domain === workflow.domain);

    return domainSkills.slice(0, 5); // Limit to 5 steps
  }
}
