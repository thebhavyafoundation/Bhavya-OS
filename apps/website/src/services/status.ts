import { RegistryReader } from "@bhavya/mission-runtime";

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
  try {
    const registry = new RegistryReader();
    const services = registry.read<{ items: ServiceStatus[] }>("services.json");
    const releases = registry.read<{ records: { payload: { version: string; status: string } }[] }>("../memory/releases/_meta.json");

    const activeRelease = releases?.records
      ? [...releases.records].reverse().find(r => r.payload.status === "CERTIFIED" || r.payload.status === "RELEASED")
      : null;

    return {
      release: activeRelease?.payload.version ?? "v0.6",
      services: services?.items ?? [],
      generatedAt: new Date().toISOString(),
    };
  } catch (e) {
    console.error("StatusService: failed to load platform status", e);
    return { release: "unknown", services: [], generatedAt: new Date().toISOString() };
  }
}
