/**
 * @bhavya/types — Event Types
 *
 * Canonical event system types for the event bus.
 */

/** An event in the Bhavya OS event system */
export interface BhavyaEvent<T = unknown> {
  id: string;
  type: string;
  name: string;
  version: string;
  source: string;
  producer: string;
  payload: T;
  timestamp: string;
  metadata: Record<string, unknown>;
  priority: EventPriority;
  status: EventStatus;
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
  processedAt?: Date;
  failedAt?: Date;
  error?: string;
}

/** Event handler function */
export type EventHandler<T = unknown> = (
  event: BhavyaEvent<T>,
) => Promise<void> | void;

/** Event subscription */
export interface EventSubscription {
  id: string;
  eventType: string;
  handler: EventHandler;
  priority: EventPriority;
  active: boolean;
}

/** Event filter for querying events */
export interface EventFilter {
  types?: string[];
  source?: string[];
  since?: Date;
  until?: Date;
  status?: EventPriority;
  limit?: number;
}

// ─── Enums ────────────────────────────────────────

export type EventPriority = "critical" | "high" | "medium" | "low";
export type EventStatus =
  "pending" | "processing" | "completed" | "failed" | "retrying";

// ─── Common Event Types ───────────────────────────

export interface KnowledgeCreatedPayload {
  koId: string;
  title: string;
  domain: string;
  userId: string;
}

export interface PackageBuiltPayload {
  packageId: string;
  koId: string;
  title: string;
  status: string;
}

export interface PipelineCompletedPayload {
  executionId: string;
  packageId: string;
  duration: number;
  artifacts: string[];
}

export interface UserRegisteredPayload {
  userId: string;
  email: string;
  name?: string;
}

export interface NotificationSentPayload {
  notificationId: string;
  channel: string;
  recipient: string;
  success: boolean;
}
