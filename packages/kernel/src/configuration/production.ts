// Production Configuration Engine
// Environment-aware configuration with validation.
// Supports development, staging, production.

export type Environment = "development" | "staging" | "production";

export interface ConfigSchema {
  [key: string]: {
    type: "string" | "number" | "boolean" | "object" | "array";
    required?: boolean;
    default?: unknown;
    env?: string; // Environment variable name
    sensitive?: boolean; // Mask in logs
    validate?: (value: unknown) => boolean;
  };
}

export interface ProductionConfig {
  environment: Environment;
  version: string;
  region: string;
  debug: boolean;
  logLevel: "error" | "warn" | "info" | "debug";
  database: {
    host: string;
    port: number;
    name: string;
    ssl: boolean;
  };
  cache: {
    host: string;
    port: number;
    ttl: number;
  };
  auth: {
    secret: string;
    tokenExpiry: number;
    refreshExpiry: number;
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  monitoring: {
    enabled: boolean;
    sampleRate: number;
  };
}

export class ProductionConfiguration {
  private config: ProductionConfig;
  private schema: ConfigSchema;

  constructor(schema?: ConfigSchema) {
    this.schema = schema ?? this.getDefaultSchema();
    this.config = this.getDefaultConfig();
  }

  async initialize(): Promise<void> {
    // Load from environment
    this.loadFromEnv();

    // Validate
    const errors = this.validate();
    if (errors.length > 0) {
      throw new Error(`Configuration validation failed: ${errors.join(", ")}`);
    }
  }

  // Get config value
  get<K extends keyof ProductionConfig>(key: K): ProductionConfig[K] {
    return this.config[key];
  }

  // Set config value
  set<K extends keyof ProductionConfig>(
    key: K,
    value: ProductionConfig[K],
  ): void {
    this.config[key] = value;
  }

  // Load from environment variables
  private loadFromEnv(): void {
    const env = process.env;

    if (env.NODE_ENV) this.config.environment = env.NODE_ENV as Environment;
    if (env.APP_VERSION) this.config.version = env.APP_VERSION;
    if (env.AWS_REGION) this.config.region = env.AWS_REGION;
    if (env.DEBUG) this.config.debug = env.DEBUG === "true";
    if (env.LOG_LEVEL)
      this.config.logLevel = env.LOG_LEVEL as
        "error" | "warn" | "info" | "debug";

    if (env.DB_HOST) this.config.database.host = env.DB_HOST;
    if (env.DB_PORT) this.config.database.port = parseInt(env.DB_PORT);
    if (env.DB_NAME) this.config.database.name = env.DB_NAME;
    if (env.DB_SSL) this.config.database.ssl = env.DB_SSL === "true";

    if (env.REDIS_HOST) this.config.cache.host = env.REDIS_HOST;
    if (env.REDIS_PORT) this.config.cache.port = parseInt(env.REDIS_PORT);
    if (env.CACHE_TTL) this.config.cache.ttl = parseInt(env.CACHE_TTL);

    if (env.AUTH_SECRET) this.config.auth.secret = env.AUTH_SECRET;
    if (env.TOKEN_EXPIRY)
      this.config.auth.tokenExpiry = parseInt(env.TOKEN_EXPIRY);
    if (env.REFRESH_EXPIRY)
      this.config.auth.refreshExpiry = parseInt(env.REFRESH_EXPIRY);

    if (env.RATE_LIMIT_WINDOW)
      this.config.rateLimit.windowMs = parseInt(env.RATE_LIMIT_WINDOW);
    if (env.RATE_LIMIT_MAX)
      this.config.rateLimit.maxRequests = parseInt(env.RATE_LIMIT_MAX);

    if (env.MONITORING_ENABLED)
      this.config.monitoring.enabled = env.MONITORING_ENABLED === "true";
    if (env.MONITORING_SAMPLE_RATE)
      this.config.monitoring.sampleRate = parseFloat(
        env.MONITORING_SAMPLE_RATE,
      );
  }

  // Validate configuration
  validate(): string[] {
    const errors: string[] = [];

    if (!this.config.auth.secret || this.config.auth.secret.length < 32) {
      errors.push("AUTH_SECRET must be at least 32 characters");
    }

    if (this.config.rateLimit.maxRequests <= 0) {
      errors.push("RATE_LIMIT_MAX must be positive");
    }

    if (
      this.config.monitoring.sampleRate < 0 ||
      this.config.monitoring.sampleRate > 1
    ) {
      errors.push("MONITORING_SAMPLE_RATE must be between 0 and 1");
    }

    return errors;
  }

  // Get safe config for logging (masks sensitive values)
  toSafeLog(): Record<string, unknown> {
    return {
      environment: this.config.environment,
      version: this.config.version,
      region: this.config.region,
      debug: this.config.debug,
      logLevel: this.config.logLevel,
      database: {
        host: this.config.database.host,
        port: this.config.database.port,
        ssl: this.config.database.ssl,
      },
      cache: { host: this.config.cache.host, port: this.config.cache.port },
      auth: { secret: "***", tokenExpiry: this.config.auth.tokenExpiry },
      rateLimit: this.config.rateLimit,
      monitoring: this.config.monitoring,
    };
  }

  private getDefaultSchema(): ConfigSchema {
    return {};
  }

  private getDefaultConfig(): ProductionConfig {
    return {
      environment: "development",
      version: "1.0.0",
      region: "us-east-1",
      debug: false,
      logLevel: "info",
      database: { host: "localhost", port: 5432, name: "bhavya", ssl: false },
      cache: { host: "localhost", port: 6379, ttl: 3600 },
      auth: { secret: "", tokenExpiry: 3600, refreshExpiry: 86400 },
      rateLimit: { windowMs: 60000, maxRequests: 100 },
      monitoring: { enabled: true, sampleRate: 0.1 },
    };
  }

  async shutdown(): Promise<void> {
    // Nothing to clean up
  }
}
