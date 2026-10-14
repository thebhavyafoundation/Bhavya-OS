import "server-only";

/**
 * @bhavya/providers — B2 Storage Client (Server-Only)
 *
 * Server-side B2 storage for heavy assets (3D models, large textures).
 * Uses @aws-sdk/client-s3 with B2 endpoint (S3-compatible).
 *
 * This module is server-only and cannot be imported by Client Components.
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { B2_CONFIG, validateEndpoint } from "./config";

export type {
  B2UploadOptions,
  B2UploadResult,
  B2ListOptions,
  B2ListResult,
} from "./server";

let _s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!_s3Client) {
    validateEndpoint(B2_CONFIG.endpoint);

    _s3Client = new S3Client({
      endpoint: B2_CONFIG.endpoint,
      region: B2_CONFIG.region,
      credentials: {
        accessKeyId: B2_CONFIG.accessKeyId,
        secretAccessKey: B2_CONFIG.secretAccessKey,
      },
    });
  }
  return _s3Client;
}

/**
 * Upload a file to B2 storage
 */
export async function uploadToB2(options: {
  key: string;
  body: Buffer | Uint8Array | ReadableStream | Blob;
  contentType: string;
  cacheControl?: string;
  metadata?: Record<string, string>;
}): Promise<{
  key: string;
  url: string;
  size: number;
  etag: string;
}> {
  const client = getS3Client();

  const command = new PutObjectCommand({
    Bucket: B2_CONFIG.bucket,
    Key: options.key,
    Body: options.body as Buffer | Uint8Array | ReadableStream | Blob,
    ContentType: options.contentType,
    CacheControl: options.cacheControl || "public, max-age=31536000, immutable",
    Metadata: options.metadata,
  });

  const response = await client.send(command);

  const publicBaseUrl = B2_CONFIG.publicBaseUrl
    ?? `${B2_CONFIG.endpoint.replace(/\/$/, "")}/${B2_CONFIG.bucket}`;

  return {
    key: options.key,
    url: `${publicBaseUrl}/${options.key}`,
    size: options.body instanceof Buffer ? options.body.length :
          options.body instanceof Uint8Array ? options.body.length : 0,
    etag: response.ETag || "",
  };
}

/**
 * Get a presigned URL for B2 file (valid for specified duration)
 */
export async function getB2PresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  const client = getS3Client();

  const command = new GetObjectCommand({
    Bucket: B2_CONFIG.bucket,
    Key: key,
  });

  return getSignedUrl(client as unknown as Parameters<typeof getSignedUrl>[0], command as unknown as Parameters<typeof getSignedUrl>[1], { expiresIn });
}

/**
 * Check if a file exists in B2
 */
export async function existsInB2(key: string): Promise<boolean> {
  const client = getS3Client();

  try {
    const command = new HeadObjectCommand({
      Bucket: B2_CONFIG.bucket,
      Key: key,
    });
    await client.send(command);
    return true;
  } catch (error) {
    if (error instanceof Error && (error.name === "NotFound" || "httpStatusCode" in error && (error as { httpStatusCode?: number }).httpStatusCode === 404)) {
      return false;
    }
    throw error;
  }
}

/**
 * Check B2 connection health
 */
export async function checkB2Health(): Promise<{ healthy: boolean; latencyMs: number; bucket: string }> {
  const start = Date.now();

  try {
    const client = getS3Client();
    const command = new ListObjectsV2Command({
      Bucket: B2_CONFIG.bucket,
      MaxKeys: 1,
    });
    await client.send(command);

    return {
      healthy: true,
      latencyMs: Date.now() - start,
      bucket: B2_CONFIG.bucket,
    };
  } catch {
    return {
      healthy: false,
      latencyMs: Date.now() - start,
      bucket: B2_CONFIG.bucket,
    };
  }
}

/**
 * Get B2 configuration status (safe for server-side display)
 */
export function getB2ConfigStatus() {
  return {
    configured: !!(B2_CONFIG.accessKeyId && B2_CONFIG.secretAccessKey && B2_CONFIG.bucket),
    endpoint: B2_CONFIG.endpoint,
    bucket: B2_CONFIG.bucket,
    region: B2_CONFIG.region,
  };
}