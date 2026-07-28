// Institution Services
// Each service solves a real operational need while exercising the runtime.

export interface InstitutionService {
  name: string;
  description: string;
  capabilities: string[];
  initialize(): Promise<void>;
  execute(input: unknown): Promise<unknown>;
  shutdown(): Promise<void>;
}

// Core Services (v1.3.0)
export { WebsiteContentService } from './website-content.js';
export { TransparencyService } from './transparency.js';
export { VolunteerService } from './volunteer.js';
export { ResearchService } from './research.js';
export { GovernanceService } from './governance.js';

// Knowledge Platform (v3.0.0)
export { KnowledgePlatformService } from './knowledge-platform.js';

// Transparency & Governance Platform (v3.1.0)
export { GovernanceService as GovernanceServiceV2 } from './governance-service.js';
export { FinanceService } from './finance-service.js';
export { ProjectsService } from './projects-service.js';
export { AuditService } from './audit-service.js';
export { PublicAPI } from './public-api.js';

// Mission Operations Platform (v3.3.0)
export { MissionService } from './mission-service.js';
export { ResourceRegistry } from './resource-registry.js';
export { ImpactRegistry } from './impact-registry.js';
