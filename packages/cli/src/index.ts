#!/usr/bin/env node

import { Command } from 'commander';
import { createAgent } from './commands/create.js';
import { testCommand } from './commands/test.js';
import { inspectCommand } from './commands/inspect.js';
import { replayCommand } from './commands/replay.js';
import { doctorCommand } from './commands/doctor.js';

const program = new Command();

program
  .name('bhavya')
  .description('Bhavya OS CLI - Make extending the platform effortless')
  .version('3.0.0');

// Create commands
program
  .command('create')
  .description('Create new components')
  .argument('<type>', 'agent, workflow, service, event, memory')
  .argument('<name>', 'Name of the component')
  .action(async (type: string, name: string) => {
    await createAgent(type, name);
  });

// Test commands
program
  .command('test')
  .description('Test components')
  .argument('<type>', 'agent, workflow, service, all')
  .argument('[name]', 'Name of the component')
  .action(async (type: string, name?: string) => {
    await testCommand(type, name);
  });

// Inspect commands
program
  .command('inspect')
  .description('Inspect runtime state')
  .argument('<type>', 'execution, agent, memory, event')
  .argument('<id>', 'ID to inspect')
  .action(async (type: string, id: string) => {
    await inspectCommand(type, id);
  });

// Replay commands
program
  .command('replay')
  .description('Replay executions')
  .argument('<type>', 'execution, workflow')
  .argument('<id>', 'ID or name to replay')
  .action(async (type: string, id: string) => {
    await replayCommand(type, id);
  });

// Doctor
program
  .command('doctor')
  .description('Check system health')
  .action(async () => {
    await doctorCommand();
  });

program.parse();
