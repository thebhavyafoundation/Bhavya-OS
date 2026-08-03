/**
 * Observability Engine — tracks execution flow for debugging and analysis.
 * Provides real-time execution tracing and post-execution analysis.
 */
export class ObservabilityEngine {
  #traces = new Map(); // planId -> TraceEntry[]
  #spans = new Map(); // spanId -> Span

  /**
   * Start a trace span.
   * @param {string} planId
   * @param {string} nodeId
   * @param {string} operation - e.g., 'resolve', 'execute', 'approve'
   */
  startSpan(planId, nodeId, operation) {
    const spanId = `${planId}-${nodeId}-${operation}-${Date.now()}`;
    const span = {
      spanId,
      planId,
      nodeId,
      operation,
      startedAt: new Date().toISOString(),
      completedAt: null,
      status: 'active',
      attributes: {},
    };

    this.#spans.set(spanId, span);

    if (!this.#traces.has(planId)) this.#traces.set(planId, []);
    this.#traces.get(planId).push(span);

    return spanId;
  }

  /**
   * End a trace span.
   * @param {string} spanId
   * @param {'ok'|'error'|'cancelled'} status
   * @param {Record<string, any>} [attributes]
   */
  endSpan(spanId, status = 'ok', attributes = {}) {
    const span = this.#spans.get(spanId);
    if (!span) return;

    span.completedAt = new Date().toISOString();
    span.status = status;
    Object.assign(span.attributes, attributes);
  }

  /**
   * Add an attribute to a span.
   * @param {string} spanId
   * @param {string} key
   * @param {any} value
   */
  setAttribute(spanId, key, value) {
    const span = this.#spans.get(spanId);
    if (span) span.attributes[key] = value;
  }

  /**
   * Get the full trace for a plan.
   * @param {string} planId
   */
  getTrace(planId) {
    return this.#traces.get(planId) || [];
  }

  /**
   * Get execution timeline for a plan (nodes ordered by start time).
   * @param {string} planId
   */
  getTimeline(planId) {
    const traces = this.getTrace(planId);
    return traces
      .sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt))
      .map(span => ({
        nodeId: span.nodeId,
        operation: span.operation,
        status: span.status,
        startedAt: span.startedAt,
        completedAt: span.completedAt,
        durationMs: span.completedAt
          ? new Date(span.completedAt).getTime() - new Date(span.startedAt).getTime()
          : null,
        attributes: span.attributes,
      }));
  }

  /**
   * Get a waterfall view (shows parallelism).
   * @param {string} planId
   */
  getWaterfall(planId) {
    const timeline = this.getTimeline(planId);
    if (timeline.length === 0) return [];

    const start = new Date(timeline[0].startedAt).getTime();
    return timeline.map(entry => ({
      ...entry,
      offsetMs: new Date(entry.startedAt).getTime() - start,
      barWidthMs: entry.durationMs || 0,
    }));
  }

  /**
   * Get performance summary for a plan.
   * @param {string} planId
   */
  getPerformance(planId) {
    const timeline = this.getTimeline(planId);
    const completed = timeline.filter(t => t.status === 'ok');
    const failed = timeline.filter(t => t.status === 'error');

    const durations = completed
      .filter(t => t.durationMs != null)
      .map(t => t.durationMs);

    return {
      totalSpans: timeline.length,
      completed: completed.length,
      failed: failed.length,
      totalDurationMs: timeline.length > 0
        ? new Date(timeline[timeline.length - 1].completedAt || Date.now()).getTime()
          - new Date(timeline[0].startedAt).getTime()
        : 0,
      avgDurationMs: durations.length > 0
        ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
        : 0,
      maxDurationMs: durations.length > 0 ? Math.max(...durations) : 0,
      minDurationMs: durations.length > 0 ? Math.min(...durations) : 0,
    };
  }
}
