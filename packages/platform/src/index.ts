/**
 * @bhavya/platform — Core Platform Utilities
 *
 * Re-exports all platform utilities for convenient single-import usage.
 */

export {
  generateId,
  compactId,
  uuid,
  extractPrefix,
  extractTimestamp,
} from "./id.js";
export {
  readJSON,
  writeJSON,
  readMD,
  listDir,
  ensureDir,
  fileExists,
} from "./fs.js";
export {
  isValidId,
  isValidEmail,
  isValidPassword,
  sanitizeFilename,
  isValidFileExtension,
  isNonEmptyString,
  isValidUrl,
  validateRequired,
} from "./validation.js";
export { createLogger, logger } from "./logging.js";
export type { LogLevel, LogEntry, LoggerOptions } from "./logging.js";
export { loadConfig, getConfigValue } from "./config.js";
export type { PlatformConfig } from "./config.js";
