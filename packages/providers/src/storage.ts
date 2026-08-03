/**
 * @bhavya/providers — Storage Provider Interface
 *
 * Abstract interface for file/object storage (S3, GCS, Azure Blob, local).
 */

export interface StorageProvider {
  id: string;
  name: string;
  type: "s3" | "gcs" | "azure" | "local" | "supabase";

  upload(file: StorageFile): Promise<StorageResult>;
  download(path: string): Promise<StorageFile>;
  delete(path: string): Promise<void>;
  list(
    prefix: string,
    options?: { limit?: number; marker?: string },
  ): Promise<StorageListResult>;
  getSignedUrl(path: string, options?: { expiresIn?: number }): Promise<string>;
  health(): Promise<{ status: string; latencyMs: number }>;
}

export interface StorageFile {
  path: string;
  content: Buffer | Uint8Array;
  mimeType: string;
  metadata?: Record<string, string>;
}

export interface StorageResult {
  path: string;
  url: string;
  size: number;
  checksum: string;
}

export interface StorageListResult {
  files: StorageItem[];
  nextMarker?: string;
}

export interface StorageItem {
  path: string;
  size: number;
  mimeType: string;
  lastModified: string;
}
