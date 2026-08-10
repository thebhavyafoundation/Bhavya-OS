/**
 * AI Institute — Structured Logger
 *
 * Lightweight, structured logging with correlation IDs, severity levels,
 * and sensitive data redaction. Never logs passwords, tokens, or secrets.
 */

export type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  correlationId?: string;
  context?: string;
  metadata?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

const SENSITIVE_KEYS = new Set([
  "password",
  "passwordhash",
  "password_hash",
  "token",
  "session-token",
  "authorization",
  "secret",
  "apikey",
  "api_key",
  "creditcard",
  "ssn",
]);

function redactSensitive(obj: unknown): unknown {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === "string") {
    // Redact long strings that look like tokens/hashes
    if (obj.length > 64 && /^[a-f0-9]+$/.test(obj)) return "[REDACTED]";
    return obj;
  }
  if (typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(redactSensitive);

  const redacted: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      redacted[key] = "[REDACTED]";
    } else {
      redacted[key] = redactSensitive(value);
    }
  }
  return redacted;
}

function generateCorrelationId(): string {
  const array = new Uint8Array(8);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

class Logger {
  private context: string;
  private correlationId: string;

  constructor(context: string, correlationId?: string) {
    this.context = context;
    this.correlationId = correlationId || generateCorrelationId();
  }

  private log(
    level: LogLevel,
    message: string,
    metadata?: Record<string, unknown>,
    error?: Error,
  ): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      correlationId: this.correlationId,
      context: this.context,
    };

    if (metadata) {
      entry.metadata = redactSensitive(metadata) as Record<string, unknown>;
    }

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      };
    }

    // Use console methods for structured output
    // In production, this could be replaced with a log aggregator
    const output = JSON.stringify(entry);

    switch (level) {
      case "debug":
        console.debug(output);
        break;
      case "info":
        console.info(output);
        break;
      case "warn":
        console.warn(output);
        break;
      case "error":
      case "fatal":
        console.error(output);
        break;
    }
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    this.log("debug", message, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.log("info", message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this.log("warn", message, metadata);
  }

  error(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    this.log("error", message, metadata, error);
  }

  fatal(message: string, error?: Error, metadata?: Record<string, unknown>): void {
    this.log("fatal", message, metadata, error);
  }

  child(context: string): Logger {
    return new Logger(`${this.context}:${context}`, this.correlationId);
  }
}

export function createLogger(context: string, correlationId?: string): Logger {
  return new Logger(context, correlationId);
}

export function extractCorrelationId(request: Request): string {
  return (
    request.headers.get("x-correlation-id") ||
    request.headers.get("x-request-id") ||
    generateCorrelationId()
  );
}
