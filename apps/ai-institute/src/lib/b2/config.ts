import "server-only";

/**
 * B2 Storage — Server-Only Configuration
 *
 * Canonical environment variable names with temporary S3_* fallbacks.
 * Validates required variables at instantiation time, not at import.
 */

function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getOptionalEnv(name: string, fallback?: string): string | undefined {
  return process.env[name] ?? fallback;
}

export interface B2Config {
  readonly endpoint: string;
  readonly region: string;
  readonly bucket: string;
  readonly accessKeyId: string;
  readonly secretAccessKey: string;
  readonly publicBaseUrl?: string;
}

/**
 * Non-throwing read, for status/health surfaces that must report "not
 * configured" rather than blow up when the build has no B2 secrets.
 */
export function readB2Config(): {
  endpoint?: string;
  region?: string;
  bucket?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  publicBaseUrl?: string;
} {
  return {
    endpoint: getOptionalEnv("B2_S3_ENDPOINT", process.env.S3_ENDPOINT),
    region: getOptionalEnv("B2_S3_REGION", process.env.S3_REGION),
    bucket: getOptionalEnv("B2_BUCKET", process.env.S3_BUCKET_NAME),
    accessKeyId: getOptionalEnv(
      "B2_ACCESS_KEY_ID",
      process.env.S3_ACCESS_KEY_ID,
    ),
    secretAccessKey: getOptionalEnv(
      "B2_SECRET_ACCESS_KEY",
      process.env.S3_SECRET_ACCESS_KEY,
    ),
    publicBaseUrl: getOptionalEnv(
      "B2_PUBLIC_BASE_URL",
      process.env.B2_PUBLIC_URL_BASE,
    ),
  };
}

/**
 * Resolved lazily via getters. Importing this module must never throw —
 * `next build` evaluates route modules to collect page data, and a top-level
 * `getEnv()` would abort the build whenever B2 secrets are absent (as they
 * are in CI). Validation now happens when a value is first read, i.e. when a
 * client is actually constructed.
 */
export const B2_CONFIG: B2Config = {
  get endpoint() {
    return getEnv("B2_S3_ENDPOINT", process.env.S3_ENDPOINT);
  },
  get region() {
    return getEnv("B2_S3_REGION", process.env.S3_REGION);
  },
  get bucket() {
    return getEnv("B2_BUCKET", process.env.S3_BUCKET_NAME);
  },
  get accessKeyId() {
    return getEnv("B2_ACCESS_KEY_ID", process.env.S3_ACCESS_KEY_ID);
  },
  get secretAccessKey() {
    return getEnv("B2_SECRET_ACCESS_KEY", process.env.S3_SECRET_ACCESS_KEY);
  },
  get publicBaseUrl() {
    return getOptionalEnv("B2_PUBLIC_BASE_URL", process.env.B2_PUBLIC_URL_BASE);
  },
};

/**
 * Validates that the endpoint is a regional S3 API endpoint, not a generic website URL.
 * Regional endpoints follow the pattern: https://s3.<region>.backblazeb2.com
 */
export function validateEndpoint(endpoint: string): void {
  try {
    const url = new URL(endpoint);
    if (url.protocol !== "https:") {
      throw new Error("B2 endpoint must use HTTPS");
    }
    if (!url.hostname.includes("backblazeb2.com")) {
      throw new Error(
        "B2 endpoint must be a Backblaze regional S3 endpoint (e.g., s3.us-east-005.backblazeb2.com)",
      );
    }
    if (!/^s3\./.test(url.hostname)) {
      throw new Error(
        "B2 endpoint must be a regional S3 API endpoint (e.g., s3.us-east-005.backblazeb2.com), not a generic website URL",
      );
    }
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("B2 endpoint must be a valid URL");
    }
    throw error;
  }
}
