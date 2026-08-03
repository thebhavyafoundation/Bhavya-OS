/**
 * @bhavya/types — Provider Types
 *
 * Canonical provider interfaces for external integrations.
 */

/** Base provider interface */
export interface Provider {
  id: string;
  name: string;
  type: ProviderType;
  status: ProviderStatus;
  config: Record<string, unknown>;
}

/** Provider type */
export type ProviderType =
  | "git"
  | "social"
  | "storage"
  | "search"
  | "maps"
  | "email"
  | "calendar"
  | "ocr"
  | "speech"
  | "video"
  | "image"
  | "browser"
  | "crawler"
  | "ai"
  | "analytics";

/** Provider status */
export type ProviderStatus = "active" | "inactive" | "error" | "configured";

/** Provider capability */
export interface ProviderCapability {
  name: string;
  supported: boolean;
  config?: Record<string, unknown>;
}

/** Provider health check */
export interface ProviderHealth {
  providerId: string;
  status: "healthy" | "degraded" | "unhealthy";
  latencyMs?: number;
  lastChecked: string;
  error?: string;
}
