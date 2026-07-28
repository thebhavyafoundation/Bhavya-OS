// API Layer
// Three categories: Public (read-only, anonymous), Partner (authenticated), Internal (full)

export interface APILayerConfig {
  publicApi: {
    baseUrl: string;
    rateLimit: number;
  };
  partnerApi: {
    baseUrl: string;
    authRequired: boolean;
  };
  internalApi: {
    baseUrl: string;
    authRequired: boolean;
  };
}

// Public API — Read-only, anonymous
// The website consumes from this.
export class PublicAPILayer {
  name = 'public-api';
  description = 'Read-only API for public consumption';
  rateLimit: number;

  constructor(config: { rateLimit: number }) {
    this.rateLimit = config.rateLimit;
  }

  async get(endpoint: string): Promise<unknown> {
    // Rate limiting
    // Fetch from public API
    return null;
  }
}

// Partner API — Authenticated, external integrations
export class PartnerAPILayer {
  name = 'partner-api';
  description = 'Authenticated API for partner integrations';

  async get(endpoint: string, token: string): Promise<unknown> {
    // Validate token
    // Fetch from partner API
    return null;
  }

  async post(endpoint: string, token: string, data: unknown): Promise<unknown> {
    // Validate token
    // Post to partner API
    return null;
  }
}

// Internal API — Full Bhavya OS capabilities
export class InternalAPILayer {
  name = 'internal-api';
  description = 'Full API for internal use';

  async execute(service: string, action: string, params: unknown): Promise<unknown> {
    // Full access to all services
    return null;
  }
}
