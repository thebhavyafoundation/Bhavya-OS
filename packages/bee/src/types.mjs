// ───────────────────────────────────────────────────
// Bhavya Execution Engine — Core Types
// ───────────────────────────────────────────────────

/**
 * @typedef {'pending'|'queued'|'running'|'paused'|'waiting-approval'|'completed'|'failed'|'cancelled'|'compensating'|'compensated'} NodeStatus
 */

/**
 * @typedef {'pending'|'planning'|'running'|'paused'|'completed'|'failed'|'cancelled'} PlanStatus
 */

/**
 * @typedef {Object} RetryPolicy
 * @property {number} maxAttempts
 * @property {number} backoffMs
 * @property {'linear'|'exponential'} strategy
 */

/**
 * @typedef {Object} CompensationAction
 * @property {string} type - 'rollback' | 'notify' | 'cleanup' | 'custom'
 * @property {string} handler - handler name or ID
 * @property {Record<string, any>} params
 */

/**
 * @typedef {Object} ApprovalConfig
 * @property {boolean} required
 * @property {string[]} approvers - role or agent IDs
 * @property {number} timeoutMs - max wait before auto-decline
 * @property {string} message
 */

/**
 * @typedef {Object} ExecutionNode
 * @property {string} id - unique node ID (e.g., 'node-001')
 * @property {string} capabilityId - BAR capability ID
 * @property {string} [workflowId] - resolved workflow ID
 * @property {string} [skillId] - resolved skill ID
 * @property {string} [agentId] - assigned agent ID
 * @property {Record<string, any>} inputs - node inputs
 * @property {Record<string, any>} [outputs] - node outputs after execution
 * @property {string[]} preconditions - node IDs that must complete first
 * @property {string[]} dependencies - node IDs this depends on
 * @property {number} [timeoutMs] - execution timeout
 * @property {RetryPolicy} [retryPolicy]
 * @property {CompensationAction} [compensation]
 * @property {ApprovalConfig} [approval]
 * @property {NodeStatus} status
 * @property {string} [error]
 * @property {number} [attempt] - current attempt number
 * @property {string} [startedAt]
 * @property {string} [completedAt]
 * @property {Object} [provenance]
 * @property {string} provenance.capabilityId
 * @property {string} [provenance.workflowId]
 * @property {string} [provenance.skillId]
 * @property {string} [provenance.agentId]
 * @property {string} provenance.actor
 * @property {string} provenance.source
 */

/**
 * @typedef {Object} ExecutionPlan
 * @property {string} id - unique plan ID
 * @property {string} goal - original natural language goal
 * @property {PlanStatus} status
 * @property {ExecutionNode[]} nodes - all nodes in the DAG
 * @property {string[][]} layers - parallel execution layers (each layer is a set of independent nodes)
 * @property {Record<string, any>} context - shared execution context
 * @property {string} [startedAt]
 * @property {string} [completedAt]
 * @property {string} [error]
 * @property {Object} [metrics]
 * @property {number} metrics.totalNodes
 * @property {number} metrics.completed
 * @property {number} metrics.failed
 * @property {number} metrics.parallelized
 * @property {number} metrics.totalDurationMs
 */

/**
 * @typedef {Object} Goal
 * @property {string} text - original natural language goal
 * @property {string} intent - classified intent (create, update, publish, analyze, etc.)
 * @property {string} domain - target domain (academics, knowledge, media, etc.)
 * @property {string} [subject] - subject area (biology, math, etc.)
 * @property {string} [gradeLevel] - grade level if applicable
 * @property {Record<string, any>} params - extracted parameters
 * @property {string[]} capabilities - resolved capability IDs
 */

/**
 * @typedef {Object} ExecutionEvent
 * @property {string} type - 'node.started' | 'node.completed' | 'node.failed' | 'plan.started' | etc.
 * @property {string} planId
 * @property {string} [nodeId]
 * @property {string} timestamp
 * @property {Record<string, any>} data
 */

/**
 * @typedef {Object} ExecutionState
 * @property {string} planId
 * @property {PlanStatus} status
 * @property {Map<string, NodeStatus>} nodeStatuses
 * @property {Record<string, any>} context
 * @property {ExecutionEvent[]} events
 * @property {string} lastCheckpoint
 */
