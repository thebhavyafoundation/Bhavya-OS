import type { BhavyaEvent } from "@bhavya/shared";

export type { BhavyaEvent };

export function createEvent<T>(
  name: string,
  producer: string,
  payload: T,
  version = 1
): BhavyaEvent<T> {
  return {
    id: crypto.randomUUID(),
    name,
    version,
    producer,
    timestamp: new Date().toISOString(),
    payload,
    priority: "medium",
    status: "pending",
    retryCount: 0,
    maxRetries: 3,
  };
}
