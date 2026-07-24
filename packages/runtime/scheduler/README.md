# Task Scheduler

Task graph scheduling and dependency resolution.

## Data
- Nodes: TASK-001..NNN with priority and status
- Edges: depends on other tasks or entities

## Algorithm
1. Load .ai/tasks/graph.json
2. Find all tasks with no uncompleted dependencies
3. Sort by priority (high → low)
4. Assign to available agent by capability
5. Mark in-progress, then completed when done
