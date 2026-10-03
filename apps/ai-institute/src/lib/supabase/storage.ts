import { createClient } from "./client";

export async function uploadAvatar(file: File, userId: string) {
  const supabase = createClient();
  const { error } = await supabase.storage
    .from("avatars")
    .upload(`${userId}/avatar.png`, file, { upsert: true });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(`${userId}/avatar.png`);

  return publicUrl;
}

export async function uploadSubmission(
  file: File,
  userId: string,
  lessonId: string,
) {
  const supabase = createClient();
  const filename = `${userId}/${lessonId}-${Date.now()}.json`;

  const { error } = await supabase.storage
    .from("submissions")
    .upload(filename, file);

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("submissions").getPublicUrl(filename);

  return publicUrl;
}

export async function getAvatarUrl(userId: string) {
  const supabase = createClient();
  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(`${userId}/avatar.png`);
  return publicUrl;
}

export async function listSubmissions(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from("submissions")
    .list(userId);

  if (error) throw error;
  return data;
}

export async function uploadTexture(file: File, textureId: string) {
  const supabase = createClient();
  const { error } = await supabase.storage
    .from("textures")
    .upload(`${textureId}`, file, { upsert: true });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from("textures").getPublicUrl(`${textureId}`);

  return publicUrl;
}
