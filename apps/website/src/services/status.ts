export interface ServiceStatus {
  id: string;
  name: string;
  endpoint: string;
  status: "active" | "degraded" | "offline" | "configured";
}

export interface PlatformStatus {
  release: string;
  services: ServiceStatus[];
  generatedAt: string;
}

export function getPlatformStatus(): PlatformStatus {
  return {
    release: "v3.0",
    services: [],
    generatedAt: new Date().toISOString(),
  };
}
