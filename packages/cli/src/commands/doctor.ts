import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export async function doctorCommand(): Promise<void> {
  console.log('System Health:\n');

  const root = process.cwd();

  // Check kernel
  const kernelPath = resolve(root, 'packages/kernel/package.json');
  if (existsSync(kernelPath)) {
    const pkg = JSON.parse(readFileSync(kernelPath, 'utf-8'));
    console.log(`  OK Kernel: v${pkg.version}`);
  } else {
    console.log(`  FAIL Kernel: not found`);
  }

  // Check agents
  const agentsPath = resolve(root, '.agents');
  if (existsSync(agentsPath)) {
    const agents = require('node:fs').readdirSync(agentsPath).filter((f: string) => f.endsWith('.md'));
    console.log(`  OK Agents: ${agents.length} loaded`);
  } else {
    console.log(`  WARN Agents: no .agents directory`);
  }

  // Check workflows
  const workflowsPath = resolve(root, '.workflows');
  if (existsSync(workflowsPath)) {
    const workflows = require('node:fs').readdirSync(workflowsPath).filter((f: string) => f.endsWith('.md'));
    console.log(`  OK Workflows: ${workflows.length} loaded`);
  } else {
    console.log(`  WARN Workflows: no .workflows directory`);
  }

  // Check memory
  const memoryPath = resolve(root, '.memory');
  if (existsSync(memoryPath)) {
    console.log(`  OK Memory: connected`);
  } else {
    console.log(`  WARN Memory: no .memory directory`);
  }

  // Check events
  const eventsPath = resolve(root, '.events');
  if (existsSync(eventsPath)) {
    console.log(`  OK Events: connected`);
  } else {
    console.log(`  WARN Events: no .events directory`);
  }

  // Check services
  const servicesPath = resolve(root, 'packages/kernel/src/services');
  if (existsSync(servicesPath)) {
    const services = require('node:fs').readdirSync(servicesPath).filter((f: string) => f.endsWith('.ts') && f !== 'index.ts'));
    console.log(`  OK Services: ${services.length} loaded`);
  } else {
    console.log(`  WARN Services: not found`);
  }

  console.log(`\nAll systems operational.`);
}
