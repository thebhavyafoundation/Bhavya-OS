export interface MediaAsset {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt: string;
  url: string;
  thumbnailUrl?: string;
  uploadedAt: string;
  tags: string[];
}

export interface MediaProvider {
  get(id: string): Promise<MediaAsset | null>;
  list(type?: string): Promise<MediaAsset[]>;
  register(asset: Omit<MediaAsset, "id" | "uploadedAt">): Promise<MediaAsset>;
  delete(id: string): Promise<boolean>;
}

export class MediaService implements MediaProvider {
  private assets: Map<string, MediaAsset> = new Map();

  async get(id: string): Promise<MediaAsset | null> {
    return this.assets.get(id) ?? null;
  }

  async list(type?: string): Promise<MediaAsset[]> {
    let results = [...this.assets.values()];
    if (type) results = results.filter(a => a.mimeType.startsWith(type));
    return results.sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
  }

  async register(asset: Omit<MediaAsset, "id" | "uploadedAt">): Promise<MediaAsset> {
    const entry: MediaAsset = {
      ...asset,
      id: `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      uploadedAt: new Date().toISOString(),
    };
    this.assets.set(entry.id, entry);
    return entry;
  }

  async delete(id: string): Promise<boolean> {
    return this.assets.delete(id);
  }
}
