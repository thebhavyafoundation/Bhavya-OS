# Bhavya CLI

**Version:** 1.0
**Status:** Active

---

## Purpose

Make extending Bhavya OS effortless. Every command generates real, working code.

## Commands

### Create

```
bhavya create agent <name>        # Create a new agent definition
bhavya create workflow <name>     # Create a new workflow
bhavya create service <name>      # Create a new institution service
bhavya create event <name>        # Create a new event type
bhavya create memory <name>       # Create a new memory type
```

### Test

```
bhavya test workflow <name>       # Test a workflow end-to-end
bhavya test agent <name>          # Test an agent
bhavya test service <name>        # Test a service
bhavya test all                   # Run all tests
```

### Inspect

```
bhavya inspect execution <id>     # Inspect an execution
bhavya inspect agent <id>         # Inspect an agent
bhavya inspect memory <id>        # Inspect a memory entry
bhavya inspect event <id>         # Inspect an event
```

### Replay

```
bhavya replay execution <id>      # Replay a failed execution
bhavya replay workflow <name>     # Replay a workflow from start
```

### Debug

```
bhavya doctor                     # Check system health
bhavya logs                       # View recent logs
bhavya metrics                    # View metrics dashboard
```

## Examples

### Create an Agent

```
$ bhavya create agent knowledge-curator

Created: .agents/knowledge-curator.md

Next steps:
  1. Edit .agents/knowledge-curator.md
  2. Define capabilities and permissions
  3. Test with: bhavya test agent knowledge-curator
```

### Test a Workflow

```
$ bhavya test workflow publish-release

Testing: publish-release
  OK Load configuration
  OK Initialize kernel
  OK Execute workflow
  OK Verify artifacts

Results: 4/4 passed (120ms)
```

### Inspect an Execution

```
$ bhavya inspect execution exec-123

Execution: exec-123
  Status: completed
  Agent: knowledge-curator
  Duration: 2.3s
  Artifacts: 5
  Events: 3
```

### Doctor

```
$ bhavya doctor

System Health:
  OK Kernel: v3.0.0
  OK Memory: connected
  OK Events: connected
  OK Registry: loaded (18 agents, 11 workflows)
  OK Auth: configured
  OK Monitoring: active

All systems operational.
```

## Implementation

The CLI is implemented as:

```
packages/cli/
  src/
    commands/
      create.ts
      test.ts
      inspect.ts
      replay.ts
      doctor.ts
    utils/
      scaffold.ts
      loader.ts
      reporter.ts
    index.ts
  package.json
  tsconfig.json
```

---

**If extending the platform feels effortless, future development accelerates.**
