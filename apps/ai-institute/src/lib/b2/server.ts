import "server-only";

/**
 * @bhavya/providers — B2 Storage Server Operations
 *
 * Server-side B2 operations using canonical configuration.
 * All operations require valid server execution context.
 */

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  HeadObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { B2_CONFIG, validateEndpoint } from "./config";

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
      forcePathStyle: true,
    } as any); // Type assertion due to @smithy/types version mismatch in monorepo
  }
  return _s3Client;
}

export interface B2UploadOptions {
  key: string;
  body: Buffer | Uint8Array | ReadableStream | Blob | File;
  contentType?: string;
  metadata?: Record<string, string>;
  cacheControl?: string;
}

export interface B2UploadResult {
  key: string;
  url: string;
  publicUrl: string;
  size: number;
  etag: string;
}

export async function uploadToB2Server(options: B2UploadOptions): Promise<B2UploadResult> {
  const client = getS3Client();
  const bucket = B2_CONFIG.bucket;

  const body = options.body instanceof File
    ? Buffer.from(await options.body.arrayBuffer())
    : options.body instanceof Blob
      ? Buffer.from(await options.body.arrayBuffer())
      : options.body instanceof ReadableStream
        ? Buffer.from(await new Response(options.body).arrayBuffer())
        : Buffer.isBuffer(options.body)
          ? options.body
          : Buffer.from(options.body);

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: options.key,
    Body: body,
    ContentType: options.contentType,
    Metadata: options.metadata,
    CacheControl: options.cacheControl,
  });

  const result = await client.send(command);

  const publicBaseUrl = B2_CONFIG.publicBaseUrl
    ?? `${B2_CONFIG.endpoint.replace(/\/$/, "")}/${B2_CONFIG.bucket}`;

  return {
    key: options.key,
    url: publicBaseUrl,
    publicUrl: `${publicBaseUrl}/${options.key}`,
    size: body.length,
    etag: result.ETag?.replace(/"/g, "") || "",
  };
}

export async function deleteFromB2Server(key: string): Promise<void> {
  const client = getS3Client();
  await client.send(new DeleteObjectCommand({
    Bucket: B2_CONFIG.bucket,
    Key: key,
  }));
}

export async function getB2ObjectServer(key: string): Promise<{ body: Uint8Array; contentType: string; metadata: Record<string, string> } | null> {
  const client = getS3Client();
  try {
    const result = await client.send(new GetObjectCommand({
      Bucket: B2_CONFIG.bucket,
      Key: key,
    }));
    const chunks: Uint8Array[] = [];
    if (result.Body) {
      for await (const chunk of result.Body as any) {
        chunks.push(chunk);
      }
    }
    return {
      body: Buffer.concat(chunks),
      contentType: result.ContentType || "application/octet-stream",
      metadata: result.Metadata || {},
    };
  } catch (error: any) {
    if (error.name === "NoSuchKey" || error.$metadata?.httpStatusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function headB2ObjectServer(key: string): Promise<{ size: number; contentType: string; etag: string; metadata: Record<string, string> } | null> {
  const client = getS3Client();
  try {
    const result = await client.send(new HeadObjectCommand({
      Bucket: B2_CONFIG.bucket,
      Key: key,
    }));
    return {
      size: result.ContentLength || 0,
      contentType: result.ContentType || "application/octet-stream",
      etag: result.ETag?.replace(/"/g, "") || "",
      metadata: result.Metadata || {},
    };
  } catch (error: any) {
    if (error.name === "NoSuchKey" || error.$metadata?.httpStatusCode === 404) {
      return null;
    }
    throw error;
  }
}

export async function listB2ObjectsServer(prefix: string, maxKeys = 1000): Promise<Array<{ key: string; size: number; lastModified: Date; etag: string }>> {
  const client = getS3Client();
  const result = await client.send(new ListObjectsV2Command({
    Bucket: B2_CONFIG.bucket,
    Prefix: prefix,
    MaxKeys: maxKeys,
  }));
  return (result.Contents || []).map(obj => ({
    key: obj.Key!,
    size: obj.Size || 0,
    lastModified: obj.LastModified!,
    etag: obj.ETag?.replace(/"/g, "") || "",
  }));
}

export async function getB2SignedUrlServer(key: string, expiresIn = 3600): Promise<string> {
  const client = getS3Client();
  const command = new GetObjectCommand({
    Bucket: B2_CONFIG.bucket,
    Key: key,
  });
  return getSignedUrl(client, command, { expiresIn });
}

export function getB2PublicUrlServer(key: string): string {
  const publicBaseUrl = B2_CONFIG.publicBaseUrl
    ?? `${B2_CONFIG.endpoint.replace(/\/$/, "")}/${B2_CONFIG.bucket}`;
  return `${publicBaseUrl}/${key}`;
}

export function getB2KeyForModelServer(filename: string): string {
  return `models/${filename}`;
}

export function getB2KeyForTextureServer(filename: string): string {
  return `textures/${filename}`;
}

export function getB2KeyForHDRI(filename: string): string {
  return `hdris/${filename}`;
}

export function getB2KeyForVideo(filename: string): string {
  return `videos/${filename}`;
}

export function getB2KeyForGLB(filename: string): string {
  return `models/glb/${filename}`;
}

export function getB2KeyForGLTF(filename: string): string {
  return `models/gltf/${filename}`;
}

export async function uploadModelServer(
  file: File | Buffer | Uint8Array,
  filename: string,
  options?: {
    metadata?: Record<string, string>;
    cacheControl?: string;
  }
) {
  const key = `models/${filename}`;
  const contentType = "model/gltf-binary";

  const result = await uploadToB2Server({
    key,
    body: file,
    contentType,
    metadata: options?.metadata,
    cacheControl: options?.cacheControl || "public, max-age=31536000, immutable",
  });

  return {
    key: result.key,
    url: result.publicUrl,
    size: result.size,
    etag: result.etag,
  };
}

export async function uploadGLBServer(
  file: File | Buffer | Uint8Array,
  filename: string,
  options?: {
    metadata?: Record<string, string>;
  }
) {
  const key = `models/glb/${filename}`;
  return uploadToB2Server({
    key,
    body: file,
    contentType: "model/gltf-binary",
    metadata: options?.metadata,
    cacheControl: "public, max-age=31536000, immutable",
  });
}

export async function uploadGLTFServer(
  file: File | Buffer | Uint8Array,
  filename: string,
  options?: {
    metadata?: Record<string, string>;
  }
) {
  const key = `models/gltf/${filename}`;
  return uploadToB2Server({
    key,
    body: file,
    contentType: "model/gltf+json",
    metadata: options?.metadata,
    cacheControl: "public, max-age=31536000, immutable",
  });
}

export async function uploadTextureServer(
  file: File | Buffer | Uint8Array,
  filename: string,
  options?: {
    metadata?: Record<string, string>;
  }
) {
  const key = `textures/${filename}`;
  const contentType = "image/png";

  return uploadToB2Server({
    key,
    body: file,
    contentType,
    metadata: options?.metadata,
    cacheControl: "public, max-age=31536000, immutable",
  });
}

export async function uploadHDRI(
  file: File | Buffer | Uint8Array,
  filename: string,
  options?: {
    metadata?: Record<string, string>;
  }
) {
  const key = `hdris/${filename}`;
  const contentType = "image/x.exr";

  return uploadToB2Server({
    key,
    body: file,
    contentType,
    metadata: options?.metadata,
    cacheControl: "public, max-age=31536000, immutable",
  });
}

export async function uploadVideoServer(
  file: File | Buffer | Uint8Array,
  filename: string,
  options?: {
    metadata?: Record<string, string>;
  }
) {
  const key = `videos/${filename}`;
  const contentType = "video/mp4";

  return uploadToB2Server({
    key,
    body: file,
    contentType,
    metadata: options?.metadata,
    cacheControl: "public, max-age=31536000, immutable",
  });
}

export async function deleteModelServer(filename: string) {
  const key = `models/${filename}`;
  await deleteFromB2Server(key);
}

export async function deleteTextureServer(filename: string) {
  const key = `textures/${filename}`;
  await deleteFromB2Server(key);
}

export async function deleteGLBServer(filename: string) {
  const key = `models/glb/${filename}`;
  await deleteFromB2Server(key);
}

export async function getModelInfoServer(filename: string) {
  const key = `models/${filename}`;
  return headB2ObjectServer(key);
}

export async function getTextureInfoServer(filename: string) {
  const key = `textures/${filename}`;
  return headB2ObjectServer(key);
}

export async function getGLBInfoServer(filename: string) {
  const key = `models/glb/${filename}`;
  return headB2ObjectServer(key);
}

export async function listModelsServer(prefix = "models/") {
  return listB2ObjectsServer(prefix);
}

export async function listTexturesServer(prefix = "textures/") {
  return listB2ObjectsServer(prefix);
}

export async function listGLBsServer(prefix = "models/glb/") {
  return listB2ObjectsServer(prefix);
}

export function getModelPublicUrlServer(filename: string): string {
  return `${getB2PublicUrlBase()}/models/${filename}`;
}

export function getGLBPublicUrlServer(filename: string): string {
  return `${getB2PublicUrlBase()}/models/glb/${filename}`;
}

export function getTexturePublicUrlServer(filename: string): string {
  return `${getB2PublicUrlBase()}/textures/${filename}`;
}

export async function getModelSignedUrlServer(filename: string, expiresIn = 3600): Promise<string> {
  const key = `models/${filename}`;
  return getB2SignedUrlServer(key, expiresIn);
}

export async function getGLBSignedUrlServer(filename: string, expiresIn = 3600): Promise<string> {
  const key = `models/glb/${filename}`;
  return getB2SignedUrlServer(key, expiresIn);
}

export async function downloadModelServer(filename: string) {
  const key = `models/${filename}`;
  return getB2ObjectServer(key);
}

export async function downloadGLBServer(filename: string) {
  const key = `models/glb/${filename}`;
  return getB2ObjectServer(key);
}

export async function downloadTextureServer(filename: string) {
  const key = `textures/${filename}`;
  return getB2ObjectServer(key);
}

export function getB2PublicUrlBase(): string {
  const publicBaseUrl = B2_CONFIG.publicBaseUrl
    ?? `${B2_CONFIG.endpoint.replace(/\/$/, "")}/${B2_CONFIG.bucket}`;
  return publicBaseUrl;
}

export type {
  B2UploadOptions,
  B2UploadResult,
} from "./client";