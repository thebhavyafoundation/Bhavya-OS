import { put } from "@vercel/blob";

export async function uploadVideo(file: File, courseId: string) {
  const blob = await put(`videos/${courseId}/preview.mp4`, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN!,
  });

  return blob.url;
}

export async function uploadLargeTexture(file: File, textureId: string) {
  const blob = await put(`textures-large/${textureId}`, file, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN!,
  });

  return blob.url;
}

export async function uploadGeneratedImage(file: File, prompt: string) {
  const blob = await put(
    `generated/${prompt.slice(0, 50).replace(/[^a-z0-9]/gi, "-")}.png`,
    file,
    {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    },
  );

  return blob.url;
}

export async function listVideos(courseId: string) {
  // Note: Vercel Blob doesn't have a native list API in the same way
  // This would typically be handled via a database index
  return [];
}
