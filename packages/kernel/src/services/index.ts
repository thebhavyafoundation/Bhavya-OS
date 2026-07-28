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

export { WebsiteContentService } from './website-content.js';
export { TransparencyService } from './transparency.js';
export { VolunteerService } from './volunteer.js';
export { ResearchService } from './research.js';
export { GovernanceService } from './governance.js';
export { KnowledgePlatformService } from './knowledge-platform.js';
