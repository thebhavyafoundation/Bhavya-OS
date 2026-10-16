/**
 * @bhavya/providers — Storage Module
 *
 * Exports the storage providers and initialization functions.
 * Provides a unified interface for B2/S3 storage integration
 * and the provider factory pattern.
 */

import {
  B2StorageProvider,
  initB2Storage,
  createStorageProvider,
  getStorageConfig,
  uploadFile,
  downloadFile,
} from "./b2-strategy";
import type {
  StorageProvider,
  StorageFile,
  StorageResult,
  StorageListResult,
  StorageItem,
} from "@bhavya/providers";

/**
 * Initialize the B2 storage provider
 *
 * Reads configuration from environment variables:
 * - S3_ENDPOINT: B2 endpoint (https://backblazeb2.com or custom)
 * - S3_ACCESS_KEY_ID: B2 account ID / application key
 * - S3_SECRET_ACCESS_KEY: B2 application key
 * - S3_BUCKET_NAME: Your B2 bucket name
 * - STORAGE_TYPE: Should be "s3" (B2 is S3-compatible)
 *
 * @returns A configured B2StorageProvider instance
 */
export function initStorage(): B2StorageProvider {
  return initB2Storage({
    endpoint: process.env.S3_ENDPOINT || "https://backblazeb2.com",
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "your_b2_account_id",
    secretAccessKey:
      process.env.S3_SECRET_ACCESS_KEY || "your_b2_application_key",
    bucket: process.env.S3_BUCKET_NAME || "your-b2-bucket-name",
  });
}

/**
 * Get the current storage configuration
 *
 * Returns config details safe for logging/display (redacts secrets).
 *
 * @returns Object with storage config type, endpoint, and bucket name
 */
export function getStorageConfigOutput() {
  return getStorageConfig();
}

/**
 * Type for storage initialization options
 */
export type InitStorageOptions = {
  /** Override the bucket name */
  bucket?: string;
  /** Override the endpoint URL */
  endpoint?: string;
  /** Override the access key ID */
  accessKeyId?: string;
  /** Override the secret access key */
  secretAccessKey?: string;
  /** Override the region */
  region?: string;
};

/**
 * Initialize storage with custom options
 *
 * @param options - Optional config overrides
 * @returns Configured B2StorageProvider instance
 */
export function initStorageWithOptions(
  options: InitStorageOptions,
): B2StorageProvider {
  return initB2Storage({
    endpoint:
      options.endpoint || process.env.S3_ENDPOINT || "https://backblazeb2.com",
    accessKeyId:
      options.accessKeyId ||
      process.env.S3_ACCESS_KEY_ID ||
      "your_b2_account_id",
    secretAccessKey:
      options.secretAccessKey ||
      process.env.S3_SECRET_ACCESS_KEY ||
      "your_b2_application_key",
    bucket:
      options.bucket || process.env.S3_BUCKET_NAME || "your-b2-bucket-name",
  });
}

/**
 * Create a storage provider of the specified type
 *
 * @param type - Storage type: "s3" or "b2" (B2 is S3-compatible)
 * @param options - Optional config overrides
 * @returns The appropriate storage provider instance
 */
export function createProvider(
  type: string = process.env.STORAGE_TYPE || "s3",
  options?: InitStorageOptions,
): B2StorageProvider {
  return createStorageProvider(type, options);
}

/**
 * Convenience: Upload a file to storage
 *
 * @param file - StorageFile to upload
 * @param options - Optional config overrides
 * @returns Promise resolving to StorageResult
 */
export async function upload(
  file: StorageFile,
  options?: InitStorageOptions,
): Promise<StorageResult> {
  const storage = initB2Storage({
    endpoint: options?.endpoint || process.env.S3_ENDPOINT,
    accessKeyId: options?.accessKeyId || process.env.S3_ACCESS_KEY_ID,
    secretAccessKey:
      options?.secretAccessKey || process.env.S3_SECRET_ACCESS_KEY,
    bucket: options?.bucket || process.env.S3_BUCKET_NAME,
  });
  return storage.upload(file);
}

/**
 * Convenience: Download a file from storage
 *
 * @param path - Path/key of the file to download
 * @param options - Optional config overrides
 * @returns Promise resolving to StorageFile
 */
export async function download(
  path: string,
  options?: InitStorageOptions,
): Promise<StorageFile> {
  const storage = initB2Storage({
    endpoint: options?.endpoint || process.env.S3_ENDPOINT,
    accessKeyId: options?.accessKeyId || process.env.S3_ACCESS_KEY_ID,
    secretAccessKey:
      options?.secretAccessKey || process.env.S3_SECRET_ACCESS_KEY,
    bucket: options?.bucket || process.env.S3_BUCKET_NAME,
  });
  return storage.download(path);
}

/**
 * Convenience: List files in storage
 *
 * @param prefix - Optional prefix to filter files
 * @param options - Optional limit and marker
 * @returns Promise resolving to StorageListResult
 */
export async function list(
  prefix: string = "",
  options?: { limit?: number; marker?: string },
): Promise<StorageListResult> {
  const storage = initB2Storage({
    endpoint: process.env.S3_ENDPOINT || "https://backblazeb2.com",
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "your_b2_account_id",
    secretAccessKey:
      process.env.S3_SECRET_ACCESS_KEY || "your_b2_application_key",
    bucket: process.env.S3_BUCKET_NAME || "your-b2-bucket-name",
  });
  return storage.list(prefix, options);
}

/**
 * Convenience: Get a signed URL for a file
 *
 * @param path - Path/key of the file
 * @param options - Expiration time in seconds (default: 3600 = 1 hour)
 * @returns Promise resolving to signed URL string
 */
export async function getSignedUrl(
  path: string,
  options?: { expiresIn?: number },
): Promise<string> {
  const storage = initB2Storage({
    endpoint: process.env.S3_ENDPOINT || "https://backblazeb2.com",
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "your_b2_account_id",
    secretAccessKey:
      process.env.S3_SECRET_ACCESS_KEY || "your_b2_application_key",
    bucket: process.env.S3_BUCKET_NAME || "your-b2-bucket-name",
  });
  return storage.getSignedUrl(path, options);
}

/**
 * Convenience: Check storage health
 *
 * @returns Promise resolving to { status: string; latencyMs: number }
 */
export async function health(): Promise<{ status: string; latencyMs: number }> {
  const storage = initB2Storage({
    endpoint: process.env.S3_ENDPOINT || "https://backblazeb2.com",
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "your_b2_account_id",
    secretAccessKey:
      process.env.S3_SECRET_ACCESS_KEY || "your_b2_application_key",
    bucket: process.env.S3_BUCKET_NAME || "your-b2-bucket-name",
  });
  return storage.health();
}

/**
 * Factory function for the complete storage setup
 *
 * Sets up the storage provider based on environment configuration.
 * Currently defaults to B2/S3, but the factory pattern allows
 * switching between different storage backends.
 *
 * @returns Object with storage utilities
 */
export function useStorage() {
  const provider = initStorage();

  return {
    provider,
    config: getStorageConfig(),
    upload: (file: StorageFile) => upload(file),
    download: (path: string) => download(path),
    list: (prefix?: string, options?: { limit?: number }) =>
      list(prefix, options),
    getSignedUrl: (path: string, expiresIn?: number) =>
      getSignedUrl(path, { expiresIn }),
    health: () => health(),
    bucket: provider.getBucketName(),
    endpoint: provider.getEndpoint(),
  };
}

export default initStorage;
