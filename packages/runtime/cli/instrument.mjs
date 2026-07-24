/**
 * Instrumentation — Runtime metrics collection
 *
 * Tracks:
 *   - Compile duration and count
 *   - Validation duration and count
 *   - Daemon uptime
 *   - Validation pass rate
 *   - Tasks completed per release
 *
 * Stored in .ai/state/metrics.json
 */

import fs from "fs";
import path from "path";

export function recordMetric(root, name, value) {
  const metricsFile = path.join(root, ".ai/state/metrics.json");
  let metrics = {};

  try {
    if (fs.existsSync(metricsFile)) {
      metrics = JSON.parse(fs.readFileSync(metricsFile, "utf8"));
    }
  } catch { /* reset on parse error */ }

  metrics[name] = value;
  metrics.last_updated = new Date().toISOString();

  // Track counters
  if (name === "compile.duration_ms") {
    metrics.compile_count = (metrics.compile_count || 0) + 1;
    metrics.last_compile_ms = value;
  }
  if (name === "validate.duration_ms") {
    metrics.validate_count = (metrics.validate_count || 0) + 1;
    metrics.last_validate_ms = value;
  }
  if (name === "validate.passed") {
    metrics.validation_pass_count = (metrics.validation_pass_count || 0) + 1;
    const total = metrics.validation_pass_count + (metrics.validation_fail_count || 0);
    metrics.validation_pass_rate = total > 0 ? `${Math.round(metrics.validation_pass_count / total * 100)}%` : "100%";
  }
  if (name === "validate.failed") {
    metrics.validation_fail_count = (metrics.validation_fail_count || 0) + 1;
    const total = (metrics.validation_pass_count || 0) + metrics.validation_fail_count;
    metrics.validation_pass_rate = total > 0 ? `${Math.round((metrics.validation_pass_count || 0) / total * 100)}%` : "0%";
  }

  fs.writeFileSync(metricsFile, JSON.stringify(metrics, null, 2) + "\n");
}

/**
 * Wraps an async function with duration tracking.
 * Returns [result, durationMs].
 */
export async function timed(fn) {
  const start = Date.now();
  const result = await fn();
  return [result, Date.now() - start];
}

/**
 * Returns a summary of all current metrics.
 */
export function getMetrics(root) {
  const metricsFile = path.join(root, ".ai/state/metrics.json");
  const stateFile = path.join(root, ".ai/state/repository.json");

  const metrics = fs.existsSync(metricsFile) ? JSON.parse(fs.readFileSync(metricsFile, "utf8")) : {};
  const state = fs.existsSync(stateFile) ? JSON.parse(fs.readFileSync(stateFile, "utf8")) : {};

  return {
    ...metrics,
    last_build: state.last_build || metrics.last_updated || "never",
    last_validation: state.last_validation || "never",
    release: state.release || "unknown",
  };
}
