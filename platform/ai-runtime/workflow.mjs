/**
 * Bhavya OS — Workflow Module
 * Workflow orchestration.
 */

export class Workflow {
  constructor() {
    this.workflows = new Map();
    this.instances = new Map();
  }

  registerWorkflow(workflow) {
    this.workflows.set(workflow.id, workflow);
    return workflow;
  }

  async startInstance(workflowId, context) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error(`Workflow ${workflowId} not found`);
    
    const instance = {
      id: `instance-${Date.now()}`,
      workflowId,
      context,
      status: "running",
      currentStep: 0,
      results: [],
      createdAt: new Date().toISOString(),
    };
    this.instances.set(instance.id, instance);
    return instance;
  }

  async advanceStep(instanceId, result) {
    const instance = this.instances.get(instanceId);
    if (!instance) throw new Error(`Instance ${instanceId} not found`);
    
    instance.results.push(result);
    instance.currentStep++;
    
    const workflow = this.workflows.get(instance.workflowId);
    if (instance.currentStep >= workflow.steps.length) {
      instance.status = "completed";
      instance.completedAt = new Date().toISOString();
    }
    
    return instance;
  }

  async cancelInstance(instanceId) {
    const instance = this.instances.get(instanceId);
    if (!instance) throw new Error(`Instance ${instanceId} not found`);
    instance.status = "cancelled";
    instance.cancelledAt = new Date().toISOString();
    return instance;
  }

  getInstance(instanceId) {
    return this.instances.get(instanceId);
  }

  listInstances(filter) {
    const instances = [...this.instances.values()];
    if (!filter) return instances;
    return instances.filter(filter);
  }
}
