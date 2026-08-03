/**
 * @bhavya/platform — Structured Logging
 *
 * Level-filtered, structured logging for all Bhavya OS packages.
 */

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  fatal: 4,
};

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  data?: unknown;
  error?: string;
}

export interface LoggerOptions {
  level?: LogLevel;
  context?: string;
  transport?: (entry: LogEntry) => void;
}

/**
 * Create a structured logger.
 */
export function createLogger(options: LoggerOptions = {}) {
  const minLevel = LEVEL_PRIORITY[options.level || "info"];
  const context = options.context;
  const transport = options.transport || defaultTransport;

  function log(level: LogLevel, message: string, data?: unknown) {
    if (LEVEL_PRIORITY[level] < minLevel) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    };
    if (data !== undefined) entry.data = data;
    if (level === "error" && data instanceof Error) {
      entry.error = data.message;
    }

    transport(entry);
  }

  return {
    debug: (msg: string, data?: unknown) => log("debug", msg, data),
    info: (msg: string, data?: unknown) => log("info", msg, data),
    warn: (msg: string, data?: unknown) => log("warn", msg, data),
    error: (msg: string, data?: unknown) => log("error", msg, data),
    fatal: (msg: string, data?: unknown) => log("fatal", msg, data),
    child: (subContext: string) =>
      createLogger({
        ...options,
        context: context ? `${context}:${subContext}` : subContext,
      }),
  };
}

function defaultTransport(entry: LogEntry) {
  const prefix = entry.context ? `[${entry.context}]` : "";
  const msg = `${entry.timestamp} ${entry.level.toUpperCase()} ${prefix} ${entry.message}`;

  switch (entry.level) {
    case "debug":
      console.debug(msg, entry.data || "");
      break;
    case "info":
      console.info(msg, entry.data || "");
      break;
    case "warn":
      console.warn(msg, entry.data || "");
      break;
    case "error":
    case "fatal":
      console.error(msg, entry.data || "");
      break;
  }
}

/**
 * Default logger instance.
 */
export const logger = createLogger();
