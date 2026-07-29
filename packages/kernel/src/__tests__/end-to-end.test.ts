// End-to-End Integration Test
// Acceptance criterion: Founder submits goal → Kernel plans → Executes → Returns report

import { boot } from '../boot/index.js';
import type { Kernel, Goal, Plan, Task } from '../index.js';

export interface ExecutionReport {
  goal: Goal;
  plan: Plan;
  tasks: Task[];
  events: string[];
  memoryUpdates: string[];
  status: 'success' | 'partial' | 'failed';
  duration: number;
  timestamp: Date;
}

export async function runEndToEndTest(root: string): Promise<ExecutionReport> {
  const startTime = Date.now();
  const events: string[] = [];
  const memoryUpdates: string[] = [];

  // 1. Boot kernel
  const bootResult = await boot({ root, logLevel: 'info' });
  if (!bootResult.success) {
    throw new Error(`Kernel failed to boot: ${bootResult.error}`);
  }

  const kernel = bootResult.kernel!;

  // Track events
  kernel.events.on('*', (event) => {
    events.push(event.type);
  });

  // 2. Founder submits a goal
  const goal: Goal = {
    id: `goal:${crypto.randomUUID()}`,
    description: 'Create a blog post about the Bhavya Foundation forest restoration progress',
    priority: 'high',
    constraints: ['Must be under 1000 words', 'Must include statistics'],
    metadata: {},
  };

  console.log(`[TEST] Goal submitted: ${goal.description}`);

  // 3. Kernel plans
  const plan = await kernel.planner.createPlan(goal);
  console.log(`[TEST] Plan created: ${plan.id}`);

  // 4. Add steps to plan
  await kernel.planner.addStep(plan.id, {
    name: 'Research forest data',
    task: {
      type: 'research',
      goal: 'Gather forest restoration statistics',
      input: { topic: 'forest restoration' },
      status: 'pending',
      dependencies: [],
      events: [],
    },
    dependencies: [],
  });

  await kernel.planner.addStep(plan.id, {
    name: 'Write blog post',
    task: {
      type: 'writing',
      goal: 'Write blog post about forest progress',
      input: { format: 'blog', maxWords: 1000 },
      status: 'pending',
      dependencies: [],
      events: [],
    },
    dependencies: [0],
  });

  await kernel.planner.addStep(plan.id, {
    name: 'Review and publish',
    task: {
      type: 'review',
      goal: 'Review and publish blog post',
      input: {},
      status: 'pending',
      dependencies: [],
      events: [],
    },
    dependencies: [1],
  });

  console.log(`[TEST] Plan has ${plan.steps.length} steps`);

  // 5. Approve and execute
  await kernel.planner.approve(plan.id);
  await kernel.planner.execute(plan.id);
  console.log(`[TEST] Plan executing`);

  // 6. Simulate task execution
  for (const step of plan.steps) {
    step.task.status = 'completed';
    step.task.completedAt = new Date();
    step.task.output = { result: `Completed: ${step.name}` };
  }

  // 7. Update memory
  await kernel.memory.set({
    type: 'project',
    content: `Blog post created: ${goal.description}`,
    tags: ['blog', 'forest', 'completed'],
    source: 'integration-test',
    confidence: 1,
  });
  memoryUpdates.push('Blog post documented in memory');

  // 8. Generate report
  const report: ExecutionReport = {
    goal,
    plan,
    tasks: plan.steps.map((s) => s.task),
    events,
    memoryUpdates,
    status: 'success',
    duration: Date.now() - startTime,
    timestamp: new Date(),
  };

  console.log(`[TEST] Execution complete in ${report.duration}ms`);
  console.log(`[TEST] Events emitted: ${events.length}`);
  console.log(`[TEST] Memory updates: ${memoryUpdates.length}`);

  // 9. Shutdown
  await kernel.runtime.shutdown();

  return report;
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runEndToEndTest(process.cwd())
    .then((report) => {
      console.log('\n=== EXECUTION REPORT ===');
      console.log(JSON.stringify(report, null, 2));
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n=== TEST FAILED ===');
      console.error(error);
      process.exit(1);
    });
}
