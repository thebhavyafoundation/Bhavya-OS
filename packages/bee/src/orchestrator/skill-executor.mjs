/**
 * Skill Executor — executes individual skills within execution nodes.
 * Handles skill invocation, input preparation, and output capture.
 */
export class SkillExecutor {
  #registry;
  #handlers = new Map();

  /** @param {import('../../runtime/src/registry-loader.mjs').RegistryLoader} registry */
  constructor(registry) {
    this.#registry = registry;
  }

  /**
   * Register a skill handler.
   * @param {string} skillId
   * @param {(input: Record<string, any>, context: Record<string, any>) => Promise<Record<string, any>>} handler
   */
  registerHandler(skillId, handler) {
    this.#handlers.set(skillId, handler);
  }

  /**
   * Execute a skill.
   * @param {import('../types.mjs').ExecutionNode} node
   * @param {Record<string, any>} context
   * @returns {Promise<{ success: boolean, outputs?: Record<string, any>, error?: string }>}
   */
  async execute(node, context) {
    const skill = this.#registry.get(node.skillId);

    // If no skill, simulate execution based on capability
    if (!skill) {
      return this.#simulateByCapability(node, context);
    }

    // Check for registered handler
    const handler = this.#handlers.get(node.skillId);
    if (handler) {
      try {
        const outputs = await handler(node.inputs, context);
        return { success: true, outputs };
      } catch (err) {
        return { success: false, error: err.message };
      }
    }

    // Default: simulate the skill execution
    return this.#simulateSkill(skill, node, context);
  }

  /**
   * Get available skills for a capability.
   * @param {string} capabilityId
   */
  getSkillsForCapability(capabilityId) {
    return this.#registry.getByKind('skill')
      .filter(s => (s.related || []).includes(capabilityId));
  }

  // ─── Private ────────────────────────────────────

  async #simulateSkill(skill, node, context) {
    // Simulate skill execution — produces structured output
    await new Promise(r => setTimeout(r, 50)); // simulate work

    return {
      success: true,
      outputs: {
        skillId: skill.id,
        skillName: skill.name,
        capabilityId: node.capabilityId,
        status: 'completed',
        simulatedAt: new Date().toISOString(),
        data: {},
      },
    };
  }

  async #simulateByCapability(node, context) {
    await new Promise(r => setTimeout(r, 50));

    return {
      success: true,
      outputs: {
        capabilityId: node.capabilityId,
        status: 'completed',
        simulatedAt: new Date().toISOString(),
        data: {},
      },
    };
  }
}
