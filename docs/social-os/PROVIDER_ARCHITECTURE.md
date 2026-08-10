# Social OS — Provider Architecture

## Provider Interface

Social OS abstracts publishing behind a provider interface. Postiz is the default provider. The interface is designed for swappability.

```typescript
interface PublishingProvider {
  // Account management
  listAccounts(): Promise<SocialAccount[]>;
  getAccount(id: string): Promise<SocialAccount>;

  // Post management
  createPost(post: CreatePostRequest): Promise<Post>;
  schedulePost(post: CreatePostRequest, scheduledAt: DateTime): Promise<Post>;
  publishPost(post: CreatePostRequest): Promise<Post>;
  getPost(id: string): Promise<Post>;
  deletePost(id: string): Promise<void>;

  // Media
  uploadMedia(file: Buffer, type: MediaType): Promise<MediaAsset>;

  // Analytics
  getPostMetrics(postId: string): Promise<PlatformMetrics>;
  getAccountMetrics(accountId: string): Promise<AccountMetrics>;

  // Platform info
  getPlatformLimits(platform: string): Promise<PlatformLimits>;
}
```

## Postiz Provider Implementation

```typescript
class PostizProvider implements PublishingProvider {
  private client: PostizClient;

  constructor(config: PostizConfig) {
    this.client = new PostizClient({
      baseUrl: config.apiUrl,
      apiKey: config.apiKey,
    });
  }

  async listAccounts(): Promise<SocialAccount[]> {
    const integrations = await this.client.getIntegrations();
    return integrations.map((i) => ({
      id: i.id,
      platform: i.type,
      name: i.name,
      isActive: i.active,
    }));
  }

  async createPost(post: CreatePostRequest): Promise<Post> {
    const result = await this.client.createPost({
      content: post.text,
      integrationIds: post.platformAccountIds,
      scheduledDate: post.scheduledAt?.toISOString(),
      media: post.media?.map((m) => ({ id: m.id, path: m.url })),
    });
    return this.mapPost(result);
  }

  async getPostMetrics(postId: string): Promise<PlatformMetrics> {
    const analytics = await this.client.getPostAnalytics(postId);
    return {
      impressions: analytics.impressions,
      reach: analytics.reach,
      engagement: analytics.engagement,
      clicks: analytics.clicks,
      shares: analytics.shares,
      comments: analytics.comments,
      likes: analytics.likes,
    };
  }
}
```

## Provider Selection

| Provider    | Type      | Platforms | MCP | Self-hosted  | Status      |
| ----------- | --------- | --------- | --- | ------------ | ----------- |
| **Postiz**  | Scheduler | 30+       | Yes | Yes (Docker) | **Default** |
| TryPost     | Scheduler | 12        | Yes | Yes (Docker) | Fallback    |
| Upload-Post | MCP Proxy | 13+       | Yes | Partial      | Future      |
| Direct API  | Custom    | Varies    | No  | Yes          | Emergency   |

## Postiz Integration Details

### Authentication

Postiz uses OAuth for platform connections. Users authenticate directly with each social platform through Postiz's UI. Social OS never handles raw OAuth tokens.

### API Access

```typescript
// Postiz API configuration
const postizConfig = {
  apiUrl: process.env.POSTIZ_API_URL, // e.g., "https://postiz.bhavya.org/api"
  apiKey: process.env.POSTIZ_API_KEY, // Postiz API key
};
```

### MCP Access (Alternative)

Postiz also exposes an MCP server. Social OS can use either the REST API or MCP protocol:

```typescript
// MCP configuration (alternative to REST)
const mcpConfig = {
  url: process.env.POSTIZ_MCP_URL, // e.g., "https://postiz.bhavya.org/mcp/xxx/sse"
};
```

### Deployment

Postiz deploys alongside Social OS in the Bhavya infrastructure:

```yaml
services:
  postiz:
    image: ghcr.io/gitroomhq/postiz-app:latest
    environment:
      MAIN_URL: "https://postiz.bhavya.org"
      DATABASE_URL: "postgresql://..."
      REDIS_URL: "redis://..."
      JWT_SECRET: "..."
    volumes:
      - postiz-data:/uploads

  social-os:
    build: ./apps/social-os
    environment:
      POSTIZ_API_URL: "http://postiz:3000/api"
      POSTIZ_API_KEY: "..."
    depends_on:
      - postiz
```
