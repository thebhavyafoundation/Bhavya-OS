import { uploadToB2, getB2PresignedUrl, existsInB2 } from "./client";
import {
  deleteFromB2Server,
  getB2ObjectServer,
  listB2ObjectsServer,
  uploadModelServer,
} from "./server";

/**
 * Generate B2 key for model files
 */
function getB2KeyForModel(filename: string): string {
  return `3d-models/${filename}`;
}

/**
 * Generate B2 key for texture files
 */
function getB2KeyForTexture(filename: string): string {
  return `textures/${filename}`;
}

/**
 * Generate B2 key for HDRI files
 */
function getB2KeyForHDRI(filename: string): string {
  return `textures/hdri/${filename}`;
}

/**
 * Generate B2 key for video files
 */
function getB2KeyForVideo(filename: string): string {
  return `videos/${filename}`;
}

/**
 * Generate B2 key for GLB files
 */
function getB2KeyForGLB(filename: string): string {
  return `3d-models/glb/${filename}`;
}

/**
 * Generate B2 key for GLTF files
 */
function getB2KeyForGLTF(filename: string): string {
  return `3d-models/gltf/${filename}`;
}

/**
 * Get public URL for a B2 object
 */
function getB2PublicUrl(key: string): string {
  const endpoint = process.env.S3_ENDPOINT || "https://backblazeb2.com";
  const bucket = process.env.S3_BUCKET_NAME || "";
  return `${endpoint.replace(/\/$/, "")}/${bucket}/${key}`;
}

/**
 * Upload a 3D model file
 */
export async function uploadModel(
  file: File | Buffer | Uint8Array,
  filename: string,
  options?: {
    metadata?: Record<string, string>;
    cacheControl?: string;
  },
) {
  const key = getB2KeyForModel(filename);
  const contentType = file instanceof File ? file.type : "model/gltf-binary";

  const result = await uploadToB2({
    key,
    body: file,
    contentType,
    metadata: options?.metadata,
    cacheControl:
      options?.cacheControl || "public, max-age=31536000, immutable",
  });

  return {
    key: result.key,
    url: result.url,
    size: result.size,
    etag: result.etag,
  };
}

/**
 * Upload a GLB file
 */
export async function uploadGLB(
  file: File | Buffer | Uint8Array,
  filename: string,
  options?: {
    metadata?: Record<string, string>;
  },
) {
  const key = getB2KeyForGLB(filename);
  return uploadToB2({
    key,
    body: file,
    contentType: "model/gltf-binary",
    metadata: options?.metadata,
    cacheControl: "public, max-age=31536000, immutable",
  });
}

/**
 * Upload a GLTF file
 */
export async function uploadGLTF(
  file: File | Buffer | Uint8Array,
  filename: string,
  options?: {
    metadata?: Record<string, string>;
  },
) {
  const key = getB2KeyForGLTF(filename);
  return uploadToB2({
    key,
    body: file,
    contentType: "model/gltf+json",
    metadata: options?.metadata,
    cacheControl: "public, max-age=31536000, immutable",
  });
}

/**
 * Upload a texture file
 */
export async function uploadTexture(
  file: File | Buffer | Uint8Array,
  filename: string,
  options?: {
    metadata?: Record<string, string>;
  },
) {
  const key = getB2KeyForTexture(filename);
  const contentType = file instanceof File ? file.type : "image/png";

  return uploadToB2({
    key,
    body: file,
    contentType,
    metadata: options?.metadata,
    cacheControl: "public, max-age=31536000, immutable",
  });
}

/**
 * Upload an HDRI file
 */
export async function uploadHDRI(
  file: File | Buffer | Uint8Array,
  filename: string,
  options?: {
    metadata?: Record<string, string>;
  },
) {
  const key = getB2KeyForHDRI(filename);
  const contentType = file instanceof File ? file.type : "image/x.exr";

  return uploadToB2({
    key,
    body: file,
    contentType,
    metadata: options?.metadata,
    cacheControl: "public, max-age=31536000, immutable",
  });
}

/**
 * Upload a video file
 */
export async function uploadVideo(
  file: File | Buffer | Uint8Array,
  filename: string,
  options?: {
    metadata?: Record<string, string>;
  },
) {
  const key = getB2KeyForVideo(filename);
  const contentType = file instanceof File ? file.type : "video/mp4";

  return uploadToB2({
    key,
    body: file,
    contentType,
    metadata: options?.metadata,
    cacheControl: "public, max-age=31536000, immutable",
  });
}

/**
 * Delete a model file
 */
export async function deleteModel(filename: string) {
  const key = getB2KeyForModel(filename);
  await deleteFromB2Server(key);
}

/**
 * Delete a texture file
 */
export async function deleteTexture(filename: string) {
  const key = getB2KeyForTexture(filename);
  await deleteFromB2Server(key);
}

/**
 * Delete a GLB file
 */
export async function deleteGLB(filename: string) {
  const key = getB2KeyForGLB(filename);
  await deleteFromB2Server(key);
}

/**
 * Get model info (head object)
 */
export async function getModelInfo(filename: string) {
  const key = getB2KeyForModel(filename);
  return existsInB2(key);
}

/**
 * Get texture info (head object)
 */
export async function getTextureInfo(filename: string) {
  const key = getB2KeyForTexture(filename);
  return existsInB2(key);
}

/**
 * Get GLB info (head object)
 */
export async function getGLBInfo(filename: string) {
  const key = getB2KeyForGLB(filename);
  return existsInB2(key);
}

/**
 * List models
 */
export async function listModels(prefix = "3d-models/") {
  return listB2ObjectsServer(prefix);
}

/**
 * List textures
 */
export async function listTextures(prefix = "textures/") {
  return listB2ObjectsServer(prefix);
}

/**
 * List GLBs
 */
export async function listGLBs(prefix = "3d-models/glb/") {
  return listB2ObjectsServer(prefix);
}

/**
 * Get model public URL
 */
export function getModelPublicUrl(filename: string): string {
  const key = getB2KeyForModel(filename);
  return getB2PublicUrl(key);
}

/**
 * Get GLB public URL
 */
export function getGLBPublicUrl(filename: string): string {
  const key = getB2KeyForGLB(filename);
  return getB2PublicUrl(key);
}

/**
 * Get texture public URL
 */
export function getTexturePublicUrl(filename: string): string {
  const key = getB2KeyForTexture(filename);
  return getB2PublicUrl(key);
}

/**
 * Get model signed URL
 */
export async function getModelSignedUrl(
  filename: string,
  expiresIn = 3600,
): Promise<string> {
  const key = getB2KeyForModel(filename);
  return getB2PresignedUrl(key, expiresIn);
}

/**
 * Get GLB signed URL
 */
export async function getGLBSignedUrl(
  filename: string,
  expiresIn = 3600,
): Promise<string> {
  const key = getB2KeyForGLB(filename);
  return getB2PresignedUrl(key, expiresIn);
}

/**
 * Download model
 */
export async function downloadModel(filename: string) {
  const key = getB2KeyForModel(filename);
  return getB2ObjectServer(key);
}

/**
 * Download GLB
 */
export async function downloadGLB(filename: string) {
  const key = getB2KeyForGLB(filename);
  return getB2ObjectServer(key);
}

/**
 * Download texture
 */
export async function downloadTexture(filename: string) {
  const key = getB2KeyForTexture(filename);
  return getB2ObjectServer(key);
}
