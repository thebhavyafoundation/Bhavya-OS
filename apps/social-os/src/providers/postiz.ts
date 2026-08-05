import type {
  PublishingProvider,
  SocialAccount,
  CreatePostRequest,
  Post,
  MediaAsset,
  PlatformMetrics,
  AccountMetrics,
  PlatformConstraints,
  PlatformType,
  MediaType,
} from "../lib/types.js";

export interface PostizConfig {
  apiUrl: string;
  apiKey: string;
}

export class PostizProvider implements PublishingProvider {
  private config: PostizConfig;

  constructor(config: PostizConfig) {
    this.config = config;
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${this.config.apiUrl}${path}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Postiz API error (${response.status}): ${error}`);
    }

    return response.json();
  }

  async listAccounts(): Promise<SocialAccount[]> {
    const data = await this.request<any[]>("/integrations");
    return data.map((i) => ({
      id: i.id,
      platform: i.type as PlatformType,
      name: i.name,
      isActive: i.active,
      avatarUrl: i.avatar_url,
      profileUrl: i.profile_url,
    }));
  }

  async getAccount(id: string): Promise<SocialAccount> {
    const data = await this.request<any>(`/integrations/${id}`);
    return {
      id: data.id,
      platform: data.type as PlatformType,
      name: data.name,
      isActive: data.active,
      avatarUrl: data.avatar_url,
      profileUrl: data.profile_url,
    };
  }

  async createPost(post: CreatePostRequest): Promise<Post> {
    const data = await this.request<any>("/posts", {
      method: "POST",
      body: JSON.stringify({
        content: post.text,
        integration_ids: post.platformAccountIds,
        media: post.media?.map((m) => ({ id: m.url, path: m.url })),
      }),
    });
    return this.mapPost(data);
  }

  async schedulePost(
    post: CreatePostRequest,
    scheduledAt: string,
  ): Promise<Post> {
    const data = await this.request<any>("/posts", {
      method: "POST",
      body: JSON.stringify({
        content: post.text,
        integration_ids: post.platformAccountIds,
        scheduled_date: scheduledAt,
        media: post.media?.map((m) => ({ id: m.url, path: m.url })),
      }),
    });
    return this.mapPost(data);
  }

  async publishPost(post: CreatePostRequest): Promise<Post> {
    const data = await this.request<any>("/posts/publish", {
      method: "POST",
      body: JSON.stringify({
        content: post.text,
        integration_ids: post.platformAccountIds,
        media: post.media?.map((m) => ({ id: m.url, path: m.url })),
      }),
    });
    return this.mapPost(data);
  }

  async getPost(id: string): Promise<Post> {
    const data = await this.request<any>(`/posts/${id}`);
    return this.mapPost(data);
  }

  async deletePost(id: string): Promise<void> {
    await this.request(`/posts/${id}`, { method: "DELETE" });
  }

  async uploadMedia(file: Buffer, type: MediaType): Promise<MediaAsset> {
    const formData = new FormData();
    formData.append("file", new Blob([file]), `upload.${type}`);
    const data = await this.request<any>("/media", {
      method: "POST",
      body: formData,
      headers: {},
    });
    return {
      url: data.url,
      type,
    };
  }

  async getPostMetrics(postId: string): Promise<PlatformMetrics> {
    const data = await this.request<any>(`/posts/${postId}/analytics`);
    return {
      impressions: data.impressions || 0,
      reach: data.reach || 0,
      engagement: data.engagement || 0,
      clicks: data.clicks || 0,
      shares: data.shares || 0,
      comments: data.comments || 0,
      likes: data.likes || 0,
    };
  }

  async getAccountMetrics(accountId: string): Promise<AccountMetrics> {
    const data = await this.request<any>(
      `/integrations/${accountId}/analytics`,
    );
    return {
      followers: data.followers || 0,
      following: data.following || 0,
      posts: data.posts || 0,
      engagementRate: data.engagement_rate || 0,
      growthRate: data.growth_rate || 0,
    };
  }

  async getPlatformLimits(
    platform: PlatformType,
  ): Promise<PlatformConstraints> {
    const limits: Record<PlatformType, PlatformConstraints> = {
      linkedin: {
        maxCharacters: 3000,
        maxMedia: 20,
        supportedMediaTypes: ["image", "video", "document"],
        hashtagLimit: 30,
      },
      x: {
        maxCharacters: 280,
        maxMedia: 4,
        supportedMediaTypes: ["image", "video"],
        hashtagLimit: 10,
      },
      github: {
        maxCharacters: 65536,
        maxMedia: 10,
        supportedMediaTypes: ["image", "video", "document"],
      },
      youtube: {
        maxCharacters: 5000,
        maxMedia: 1,
        supportedMediaTypes: ["video"],
      },
      instagram: {
        maxCharacters: 2200,
        maxMedia: 10,
        supportedMediaTypes: ["image", "video"],
        hashtagLimit: 30,
      },
    };
    return limits[platform];
  }

  private mapPost(data: any): Post {
    return {
      id: data.id,
      platform: data.integration?.type || "linkedin",
      content: data.content || "",
      scheduledAt: data.scheduled_date,
      publishedAt: data.published_date,
      status: data.status || "draft",
    };
  }
}

export function createPostizProvider(): PostizProvider | null {
  const apiUrl = process.env.POSTIZ_API_URL;
  const apiKey = process.env.POSTIZ_API_KEY;

  if (!apiUrl || !apiKey) {
    return null;
  }

  return new PostizProvider({ apiUrl, apiKey });
}
