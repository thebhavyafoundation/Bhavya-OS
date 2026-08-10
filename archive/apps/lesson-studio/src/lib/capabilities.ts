import type { BuilderResult, BuildStatus, QualityGateResult } from './types';

const RUNTIME_URL = process.env.NEXT_PUBLIC_RUNTIME_URL || '/api';
const REGISTRY_PATH = '../../../_config/skills/registry.json';
const BUILDERS_PATH = '../../../builders';
const KNOWLEDGE_PATH = '../../../knowledge/objects';

export interface CapabilityInfo {
  capability: string;
  builder: string | null;
  skills: string[];
  workspace: string;
}

export async function resolveCapability(name: string): Promise<CapabilityInfo | null> {
  try {
    const registry = await fetch(`${RUNTIME_URL}/registry`).then(r => r.json());
    const capabilities = registry.capabilities || {};
    return capabilities[name] || null;
  } catch {
    return null;
  }
}

export async function listCapabilities(): Promise<CapabilityInfo[]> {
  try {
    const registry = await fetch(`${RUNTIME_URL}/registry`).then(r => r.json());
    const caps = registry.capabilities || {};
    return Object.entries(caps).map(([name, info]) => ({
      capability: name,
      ...info as Omit<CapabilityInfo, 'capability'>,
    }));
  } catch {
    return [];
  }
}

export async function invokeBuilder(
  builderName: string,
  input: Record<string, unknown>,
): Promise<BuildStatus> {
  const response = await fetch(`${RUNTIME_URL}/build`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ builder: builderName, input }),
  });
  return response.json();
}

export async function invokeCapability(
  capabilityName: string,
  input: Record<string, unknown>,
): Promise<BuildStatus> {
  const capability = await resolveCapability(capabilityName);
  if (!capability || !capability.builder) {
    return {
      id: 'error',
      capability: capabilityName,
      builder: 'unknown',
      status: 'failed',
      progress: 0,
      steps: [],
      qualityGates: [],
    };
  }
  return invokeBuilder(capability.builder, { ...input, capability: capabilityName });
}

export async function getBuildStatus(buildId: string): Promise<BuildStatus | null> {
  try {
    const response = await fetch(`${RUNTIME_URL}/build/${buildId}`);
    return response.json();
  } catch {
    return null;
  }
}

export async function validateLesson(
  lesson: Record<string, unknown>,
): Promise<QualityGateResult[]> {
  const response = await fetch(`${RUNTIME_URL}/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'lesson', data: lesson }),
  });
  return response.json();
}

export async function listKnowledgeObjects(): Promise<{ id: string; title: string }[]> {
  try {
    const response = await fetch(`${RUNTIME_URL}/knowledge`);
    return response.json();
  } catch {
    return [];
  }
}

export async function getKnowledgeObject(id: string): Promise<Record<string, unknown> | null> {
  try {
    const response = await fetch(`${RUNTIME_URL}/knowledge/${id}`);
    return response.json();
  } catch {
    return null;
  }
}

export async function publishContent(
  lessonId: string,
  target: 'website' | 'offline',
): Promise<{ success: boolean; path: string; url?: string }> {
  const response = await fetch(`${RUNTIME_URL}/publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lessonId, target }),
  });
  return response.json();
}
