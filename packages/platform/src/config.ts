/**
 * @bhavya/platform — Configuration
 *
 * Environment-aware configuration loading with defaults.
 */

export interface PlatformConfig {
  /** Application name */
  appName: string;
  /** Environment (development, production, test) */
  env: "development" | "production" | "test";
  /** Base directory for file operations */
  baseDir: string;
  /** API base URL */
  apiUrl: string;
  /** Enable debug mode */
  debug: boolean;
}

const defaults: PlatformConfig = {
  appName: "bhavya-os",
  env: "development",
  baseDir: process.cwd(),
  apiUrl: "http://localhost:3100",
  debug: false,
};

/**
 * Load platform configuration from environment.
 */
export function loadConfig(
  overrides: Partial<PlatformConfig> = {},
): PlatformConfig {
  return {
    ...defaults,
    ...overrides,
    env:
      (process.env.NODE_ENV as PlatformConfig["env"]) ||
      overrides.env ||
      defaults.env,
    apiUrl: process.env.BHAVYA_API_URL || overrides.apiUrl || defaults.apiUrl,
    debug:
      process.env.BHAVYA_DEBUG === "true" || overrides.debug || defaults.debug,
  };
}

/**
 * Get a single config value with environment variable fallback.
 */
export function getConfigValue<T>(key: string, defaultValue: T): T {
  const envKey = `BHAVYA_${key.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`;
  const envVal = process.env[envKey];
  if (envVal === undefined) return defaultValue;
  return envVal as T;
}
