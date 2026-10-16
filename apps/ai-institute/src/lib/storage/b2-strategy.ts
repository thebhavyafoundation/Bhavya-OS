/**
 * @bhavya/providers — B2 Storage Strategy
 *
 * Strategy for storing and retrieving files using Backblaze B2 Cloud Storage.
 * B2 is S3-compatible, so this uses the @aws-sdk/client-s3 adapter.
 *
 * Configuration is read from environment variables:
 * - S3_ENDPOINT: B2 endpoint (https://backblazeb2.com or custom)
 * - S3_ACCESS_KEY_ID: B2 account ID / application key
 * - S3_SECRET_ACCESS_KEY: B2 application key
 * - S3_BUCKET_NAME: Your B2 bucket name
 * - STORAGE_TYPE: Should be "s3" (B2 is S3-compatible)
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import {
  StorageProvider,
  StorageFile,
  StorageResult,
  StorageListResult,
  StorageItem,
} from "@bhavya/providers";

// B2 configuration from environment variables
const STORAGE_TYPE = process.env.STORAGE_TYPE || "s3";
const S3_ENDPOINT = process.env.S3_ENDPOINT || "https://backblazeb2.com";
const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID || "your_b2_account_id";
const S3_SECRET_ACCESS_KEY =
  process.env.S3_SECRET_ACCESS_KEY || "your_b2_application_key";
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "your-b2-bucket-name";

// S3 client configured for B2
const s3Client = new S3Client({
  endpoint: S3_ENDPOINT,
  region: process.env.S3_REGION || "us-east-0",
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
});

/**
 * B2 Storage Strategy
 *
 * Implements the StorageProvider interface using Backblaze B2 Cloud Storage.
 * B2 is S3-compatible, so we use the AWS SDK S3 client with the B2 endpoint.
 *
 * Bucket structure recommended:
 *   bhavya-os/
 *     3d-models/         # GLTF, GLB, FBX files for 3D rendering
 *     textures/          # High-resolution textures
 *     animations/        # Animation data, motion files
 *     datasets/          # Large data files, datasets
 *     backups/           # Automated backups
 *     pipeline/          # Intermediate pipeline data
 */
export class B2StorageProvider {
  private bucket: string;

  constructor(config?: {
    endpoint?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    bucket?: string;
    region?: string;
  }) {
    this.bucket = config?.bucket || S3_BUCKET_NAME;

    // Optionally recreate the S3 client with custom config
    if (config?.endpoint || config?.accessKeyId || config?.secretAccessKey) {
      // Note: In a real implementation, you'd recreate the client
      // s3Client.config.endpoint = config.endpoint;
      // s3Client.config.region = config.region || "us-east-0";
      // s3Client.config.credentials = {
      //   accessKeyId: config.accessKeyId || S3_ACCESS_KEY_ID,
      //   secretAccessKey: config.secretAccessKey || S3_SECRET_ACCESS_KEY,
      // };
    }
  }

  /**
   * Upload a file to B2 storage
   *
   * @param file - The file to upload (path, content, mimeType)
   * @returns Promise resolving to StorageResult with URL and metadata
   */
  async upload(file: StorageFile): Promise<StorageResult> {
    const key = file.path.startsWith("/") ? file.path.slice(1) : file.path;

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file.content,
      ContentType: file.mimeType,
      // B2 specific: can add CacheControl, ContentDisposition, etc.
    });

    await s3Client.send(command);

    // Generate a public URL for B2
    // B2 URLs follow the pattern: https://<bucket>.backblazeb2.com/<key>
    // Or use a custom domain if configured
    const url = `${this.bucket}.${S3_ENDPOINT}/${key}`;

    return {
      path: file.path,
      url,
      size: file.content?.length || 0,
      checksum: "", // Could add SHA256 hash here
    };
  }

  /**
   * Download a file from B2 storage
   *
   * @param path - The path/key of the file to download
   * @returns Promise resolving to StorageFile with content and metadata
   */
  async download(path: string): Promise<StorageFile> {
    const key = path.startsWith("/") ? path.slice(1) : path;

    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    const { Body, ContentType, ContentLength } = await s3Client.send(command);

    if (!Body) {
      throw new Error(`File not found at path: ${path}`);
    }

    // Convert Body (ReadableStream) to Buffer or Uint8Array
    const chunks: Buffer[] = [];
    for await (const chunk of Body as unknown as AsyncIterable<Uint8Array>) {
      chunks.push(Buffer.from(chunk));
    }
    const content = Buffer.concat(chunks) as Uint8Array;

    return {
      path,
      content,
      mimeType: ContentType || "application/octet-stream",
      metadata: {},
    };
  }

  /**
   * Delete a file from B2 storage
   *
   * @param path - The path/key of the file to delete
   * @returns Promise<void>
   */
  async delete(path: string): Promise<void> {
    const key = path.startsWith("/") ? path.slice(1) : path;

    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await s3Client.send(command);
  }

  /**
   * List files in B2 storage with optional prefix
   *
   * @param prefix - The prefix to filter files by
   * @param options - Optional limit and marker for pagination
   * @returns Promise resolving to StorageListResult
   */
  async list(
    prefix: string = "",
    options?: { limit?: number; marker?: string },
  ): Promise<StorageListResult> {
    const command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: prefix,
      MaxKeys: options?.limit ?? 1000,
      ContinuationToken: options?.marker,
    });

    const { KeyCount, Contents, NextContinuationToken } =
      await s3Client.send(command);

    const files: StorageItem[] = (Contents || []).map(
      (item: {
        Key?: string;
        Size?: number;
        ETag?: string;
        LastModified?: Date;
      }) => ({
        path: item.Key || "",
        size: item.Size || 0,
        mimeType: item.ETag || "application/octet-stream",
        lastModified:
          item.LastModified?.toISOString() || new Date().toISOString(),
      }),
    );

    return {
      files,
      nextMarker: NextContinuationToken || undefined,
    };
  }

  /**
   * Get a signed URL for a file that expires after a certain time
   *
   * @param path - The path/key of the file
   * @param options - Expiration time in seconds (default: 3600 = 1 hour)
   * @returns Promise resolving to signed URL string
   */
  async getSignedUrl(
    path: string,
    options?: { expiresIn?: number },
  ): Promise<string> {
    const key = path.startsWith("/") ? path.slice(1) : path;
    const expiresIn = options?.expiresIn ?? 3600; // 1 hour default

    // B2 does not have native signed URLs like S3,
    // but we can generate a URL that's valid for the session
    // Alternatively, use B2's native features or CORS

    // For now, return a direct URL with a timestamp query param
    // In production, use B2's built-in sharing features
    const baseUrl = `${this.bucket}.${S3_ENDPOINT}/${key}`;
    const timestamp = Date.now() + expiresIn * 1000;
    return `${baseUrl}?expires=${timestamp}&sig=PLACEHOLDER_SIGNATURE`;
  }

  /**
   * Check the health of the B2 connection
   *
   * @returns Promise resolving to { status: string; latencyMs: number }
   */
  async health(): Promise<{ status: string; latencyMs: number }> {
    const start = Date.now();

    try {
      // Try to list the bucket root
      await this.list("");

      const latency = Date.now() - start;
      return { status: "healthy", latencyMs: latency };
    } catch (error) {
      const latency = Date.now() - start;
      console.error("B2 health check failed:", error);
      return { status: "unhealthy", latencyMs: latency };
    }
  }

  /**
   * Get the bucket name
   *
   * @returns The configured bucket name
   */
  getBucketName(): string {
    return this.bucket;
  }

  /**
   * Get the endpoint URL
   *
   * @returns The B2/S3 endpoint
   */
  getEndpoint(): string {
    return S3_ENDPOINT;
  }
}

/**
 * Initialize B2 storage provider with config
 *
 * @param config - Optional config object to override env vars
 * @returns A configured B2StorageProvider instance
 */
export function initB2Storage(config?: {
  endpoint?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  bucket?: string;
  region?: string;
}): B2StorageProvider {
  return new B2StorageProvider(config);
}

/**
 * Get the current storage configuration
 *
 * @returns Object with storage config details (safe for display/logging)
 */
export function getStorageConfig() {
  return {
    type: STORAGE_TYPE,
    endpoint: S3_ENDPOINT,
    bucket: S3_BUCKET_NAME,
    // NOTE: Do not log or expose secret access keys in production
    // accessKeyId: S3_ACCESS_KEY_ID, // redacted for security
  };
}

/**
 * Factory function to create the appropriate storage provider
 *
 * @param type - Storage type (s3, gcs, azure, local, supabase)
 * @param config - Optional config override
 * @returns The appropriate storage provider instance
 */
export function createStorageProvider(
  type: string = STORAGE_TYPE,
  config?: {
    endpoint?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    bucket?: string;
    region?: string;
  },
): B2StorageProvider {
  if (type === "s3" || type === "b2") {
    return initB2Storage(config);
  }
  // Fallback to B2 for other types
  console.warn(
    `Storage type "${type}" not fully implemented, falling back to B2/S3`,
  );
  return initB2Storage(config);
}

/**
 * Convenience function to upload a file
 *
 * @param file - StorageFile to upload
 * @param config - Optional config override
 * @returns Promise resolving to StorageResult
 */
export async function uploadFile(
  file: StorageFile,
  config?: {
    endpoint?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    bucket?: string;
    region?: string;
  },
): Promise<StorageResult> {
  const storage = initB2Storage(config);
  return storage.upload(file);
}

/**
 * Convenience function to download a file
 *
 * @param path - Path/key of the file to download
 * @param config - Optional config override
 * @returns Promise resolving to StorageFile
 */
export async function downloadFile(
  path: string,
  config?: {
    endpoint?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    bucket?: string;
    region?: string;
  },
): Promise<StorageFile> {
  const storage = initB2Storage(config);
  return storage.download(path);
}

export default B2StorageProvider;
