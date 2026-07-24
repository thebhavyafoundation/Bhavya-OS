export interface BhavyaEvent<T = unknown> {
  name: string;
  version: number;
  producer: string;
  timestamp: string;
  payload: T;
}

export function createEvent<T>(
  name: string,
  producer: string,
  payload: T,
  version = 1
): BhavyaEvent<T> {
  return { name, version, producer, timestamp: new Date().toISOString(), payload };
}
