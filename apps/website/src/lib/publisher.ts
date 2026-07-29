// Content Publishing Workflow
// Publishing content requires no website edits.
// Upload -> Approval -> Audit -> API -> Cache Refresh -> Live Website

export interface PublishingWorkflowConfig {
  cache: {
    invalidate: (pattern: string) => Promise<void>;
    invalidateAll: () => Promise<void>;
  };
  audit: {
    record: (entry: unknown) => Promise<void>;
  };
  notifications: {
    send: (channel: string, message: string) => Promise<void>;
  };
}

export interface PublishingEvent {
  type: 'project-created' | 'project-updated' | 'policy-approved' | 'report-published' | 'trustee-updated' | 'research-published';
  entityId: string;
  entity: Record<string, unknown>;
  timestamp: Date;
}

export class ContentPublisher {
  private config: PublishingWorkflowConfig;

  constructor(config: PublishingWorkflowConfig) {
    this.config = config;
  }

  // Handle a publishing event
  async publish(event: PublishingEvent): Promise<void> {
    // 1. Record audit
    await this.config.audit.record({
      action: 'content-published',
      type: event.type,
      entityId: event.entityId,
      timestamp: event.timestamp,
    });

    // 2. Invalidate relevant cache
    await this.invalidateCache(event);

    // 3. Notify website to refresh
    await this.config.notifications.send('website', `Content updated: ${event.type}`);

    // 4. Log
    console.log(`Published: ${event.type} for ${event.entityId}`);
  }

  // Invalidate cache based on event type
  private async invalidateCache(event: PublishingEvent): Promise<void> {
    switch (event.type) {
      case 'project-created':
      case 'project-updated':
        await this.config.cache.invalidate('projects:*');
        break;
      case 'policy-approved':
        await this.config.cache.invalidate('governance:*');
        break;
      case 'report-published':
        await this.config.cache.invalidate('finance:*');
        break;
      case 'trustee-updated':
        await this.config.cache.invalidate('governance:trustees');
        break;
      case 'research-published':
        await this.config.cache.invalidate('knowledge:*');
        break;
    }
  }
}
