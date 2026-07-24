export type LogLevel = "info" | "warn" | "error" | "debug";

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: string;
  timestamp: string;
}

export function log(level: LogLevel, message: string, context?: string): LogEntry {
  const entry: LogEntry = { level, message, context, timestamp: new Date().toISOString() };
  if (process.env.NODE_ENV !== "test") {
    console[level === "debug" ? "log" : level](`[${entry.timestamp}] [${level.toUpperCase()}] ${context ? `[${context}] ` : ""}${message}`);
  }
  return entry;
}
