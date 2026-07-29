// Bhavya Kernel — Logging Module
// Structured logging.

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  level: LogLevel;
  module: string;
  message: string;
  timestamp: Date;
  data?: Record<string, unknown>;
}

export interface LoggingConfig {
  level: LogLevel;
  outputs?: ('console' | 'file' | 'remote')[];
}

export class Logging {
  private level: LogLevel;
  private entries: LogEntry[] = [];

  constructor(config: LoggingConfig) {
    this.level = config.level;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error'];
    return levels.indexOf(level) >= levels.indexOf(this.level);
  }

  private log(level: LogLevel, module: string, message: string, data?: Record<string, unknown>): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      module,
      message,
      timestamp: new Date(),
      data,
    };

    this.entries.push(entry);

    // Console output
    const prefix = `[${entry.timestamp.toISOString()}] [${level.toUpperCase()}] [${module}]`;
    switch (level) {
      case 'debug':
        console.debug(prefix, message);
        break;
      case 'info':
        console.info(prefix, message);
        break;
      case 'warn':
        console.warn(prefix, message);
        break;
      case 'error':
        console.error(prefix, message);
        break;
    }
  }

  debug(module: string, message: string, data?: Record<string, unknown>): void {
    this.log('debug', module, message, data);
  }

  info(module: string, message: string, data?: Record<string, unknown>): void {
    this.log('info', module, message, data);
  }

  warn(module: string, message: string, data?: Record<string, unknown>): void {
    this.log('warn', module, message, data);
  }

  error(module: string, message: string, data?: Record<string, unknown>): void {
    this.log('error', module, message, data);
  }

  getEntries(): LogEntry[] {
    return [...this.entries];
  }

  async shutdown(): Promise<void> {
    this.entries = [];
  }
}
