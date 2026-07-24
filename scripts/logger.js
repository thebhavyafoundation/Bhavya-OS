#!/usr/bin/env node
// ============================================================
// Bhavya Foundation — Structured Logger
// JSON logging with request IDs and context
// ============================================================

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
};

const currentLevel = LOG_LEVELS[process.env.LOG_LEVEL || 'info'] || 1;

function generateRequestId() {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function sanitize(obj, sensitiveKeys = ['password', 'secret', 'token', 'key', 'authorization']) {
  if (typeof obj !== 'object' || obj === null) return obj;

  const sanitized = { ...obj };
  for (const key of Object.keys(sanitized)) {
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk))) {
      sanitized[key] = '***';
    } else if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitize(sanitized[key], sensitiveKeys);
    }
  }
  return sanitized;
}

function formatLogEntry(level, message, context = {}) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...sanitize(context),
    pid: process.pid,
    hostname: require('os').hostname(),
  });
}

function log(level, message, context) {
  if (LOG_LEVELS[level] < currentLevel) return;

  const entry = formatLogEntry(level, message, context);

  if (level === 'error' || level === 'fatal') {
    process.stderr.write(entry + '\n');
  } else {
    process.stdout.write(entry + '\n');
  }
}

// Request logging middleware
function requestLogger(req, res, next) {
  if (process.env.ENABLE_REQUEST_LOGGING === 'false') {
    return next();
  }

  const requestId = req.headers['x-request-id'] || generateRequestId();
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    log('info', 'HTTP Request', {
      requestId,
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection?.remoteAddress,
    });
  });

  next();
}

// Health check handler
function healthHandler(req, res) {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.APP_VERSION || '0.9.0',
    environment: process.env.NODE_ENV || 'development',
  };

  res.json(health);
}

// Readiness check handler
function readinessHandler(req, res) {
  // Check critical dependencies
  const checks = {
    filesystem: checkFilesystem(),
    memory: checkMemory(),
  };

  const ready = Object.values(checks).every(c => c.status === 'ok');

  res.status(ready ? 200 : 503).json({
    status: ready ? 'ready' : 'not_ready',
    checks,
    timestamp: new Date().toISOString(),
  });
}

function checkFilesystem() {
  const paths = ['/app/config', '/app/registry', '/app/content'];
  const missing = paths.filter(p => !require('fs').existsSync(p));

  return {
    status: missing.length === 0 ? 'ok' : 'error',
    missing,
  };
}

function checkMemory() {
  const usage = process.memoryUsage();
  const maxHeap = usage.heapSizeLimit || 1500 * 1024 * 1024;
  const ratio = usage.heapUsed / maxHeap;

  return {
    status: ratio < 0.9 ? 'ok' : 'warning',
    heapUsed: Math.round(usage.heapUsed / 1024 / 1024),
    heapTotal: Math.round(usage.heapTotal / 1024 / 1024),
    ratio: Math.round(ratio * 100),
  };
}

// Metrics endpoint
function metricsHandler(req, res) {
  const usage = process.memoryUsage();
  const metrics = [
    '# HELP process_memory_heap_used_bytes Process heap memory used',
    '# TYPE process_memory_heap_used_bytes gauge',
    `process_memory_heap_used_bytes ${usage.heapUsed}`,
    '',
    '# HELP process_memory_heap_total_bytes Process heap memory total',
    '# TYPE process_memory_heap_total_bytes gauge',
    `process_memory_heap_total_bytes ${usage.heapTotal}`,
    '',
    '# HELP process_uptime_seconds Process uptime',
    '# TYPE process_uptime_seconds gauge',
    `process_uptime_seconds ${process.uptime()}`,
    '',
    '# HELP process_pid Process ID',
    '# TYPE process_pid gauge',
    `process_pid ${process.pid}`,
  ].join('\n');

  res.setHeader('Content-Type', 'text/plain');
  res.send(metrics);
}

module.exports = {
  log,
  generateRequestId,
  requestLogger,
  healthHandler,
  readinessHandler,
  metricsHandler,
  sanitize,
};
