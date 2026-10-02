"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ImagePlus, Check, ExternalLink } from "lucide-react";

const MAX_BYTES = 750_000;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface GalleryPhotoSummary {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${Math.round(bytes / 1024)} KB`;
}

/**
 * Studio gallery upload screen: pick a file, add a title, publish.
 *
 * The browser-side size/type checks are convenience only — the route handler
 * re-validates every payload before anything is stored.
 */
export function StudioGalleryUpload() {
  const [photos, setPhotos] = useState<GalleryPhotoSummary[]>([]);
  const [listing, setListing] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<{
    dataUrl: string;
    name: string;
    size: number;
  } | null>(null);
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPhotos = useCallback(async () => {
    try {
      const res = await fetch("/api/studio/gallery");
      if (!res.ok) return;
      const payload = (await res.json()) as { photos?: GalleryPhotoSummary[] };
      setPhotos(payload.photos ?? []);
    } catch {
      // listing is non-critical; the form stays usable
    } finally {
      setListing(false);
    }
  }, []);

  useEffect(() => {
    void loadPhotos();
  }, [loadPhotos]);

  function handleFile(file: File | undefined) {
    setError(null);
    setImage(null);
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError("Only JPEG, PNG and WebP images are accepted.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(
        `Images must be 750 KB or smaller (this file is ${formatBytes(file.size)}).`,
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImage({ dataUrl: reader.result, name: file.name, size: file.size });
      }
    };
    reader.onerror = () => setError("The file could not be read.");
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!image) {
      setError("Choose an image first.");
      return;
    }
    if (!title.trim()) {
      setError("A title is required.");
      return;
    }

    setStatus("saving");
    setError(null);
    try {
      const res = await fetch("/api/studio/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          image: image.dataUrl,
        }),
      });
      const payload = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(payload.error ?? "The photo could not be uploaded.");
        setStatus("idle");
        return;
      }
      setStatus("saved");
      setTitle("");
      setDescription("");
      setImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      await loadPhotos();
      window.setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setError("The upload failed. Check your connection and try again.");
      setStatus("idle");
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <section aria-labelledby="gallery-upload-heading">
        <h2
          id="gallery-upload-heading"
          className="editorial-heading text-2xl text-text-primary"
        >
          Publish a photograph
        </h2>
        <p className="mt-2 text-sm text-text-tertiary">
          Photos appear on the public gallery as soon as they are uploaded.
          JPEG, PNG or WebP, up to 750&nbsp;KB.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="gallery-title"
              className="block text-xs font-medium uppercase tracking-wider text-text-tertiary"
            >
              Title
            </label>
            <input
              id="gallery-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={120}
              required
              placeholder="Seedling beds after the monsoon"
              className="mt-2 w-full border border-border-primary bg-bg-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-gold focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="gallery-description"
              className="block text-xs font-medium uppercase tracking-wider text-text-tertiary"
            >
              Description <span className="normal-case">(optional)</span>
            </label>
            <textarea
              id="gallery-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="One line of context for the photo."
              className="mt-2 w-full border border-border-primary bg-bg-secondary px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-gold focus:outline-none"
            />
          </div>

          <div>
            <span className="block text-xs font-medium uppercase tracking-wider text-text-tertiary">
              Image
            </span>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                onChange={(e) => handleFile(e.target.files?.[0])}
                className="block w-full text-sm text-text-secondary file:mr-4 file:border file:border-border-primary file:bg-bg-secondary file:px-4 file:py-2 file:text-sm file:text-text-primary hover:file:border-accent-gold"
              />
              {image && (
                <div className="flex items-center gap-3">
                  <img
                    src={image.dataUrl}
                    alt="Selected upload preview"
                    className="h-16 w-16 border border-border-primary object-cover"
                  />
                  <span className="text-xs text-text-tertiary">
                    {image.name} · {formatBytes(image.size)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-status-error">
              {error}
            </p>
          )}
          {status === "saved" && (
            <p
              role="status"
              className="flex items-center gap-2 text-sm text-forest-700"
            >
              <Check className="h-4 w-4" /> Photo published to the gallery.
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === "saving"}
              className="btn-primary inline-flex items-center gap-2 disabled:cursor-wait disabled:opacity-70"
            >
              <ImagePlus className="h-4 w-4" />
              {status === "saving" ? "Publishing..." : "Publish photo"}
            </button>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1 text-sm text-accent-gold hover:underline"
            >
              View public gallery <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </form>
      </section>

      <section aria-labelledby="gallery-recent-heading" className="min-w-0">
        <h2
          id="gallery-recent-heading"
          className="editorial-heading text-2xl text-text-primary"
        >
          Published
        </h2>
        {listing ? (
          <p className="mt-4 text-sm text-text-tertiary">Loading photos…</p>
        ) : photos.length === 0 ? (
          <p className="mt-4 text-sm text-text-tertiary">
            No photos yet. The first upload appears here.
          </p>
        ) : (
          <ul className="mt-4 space-y-3">
            {photos.map((photo) => (
              <li
                key={photo.id}
                className="border border-border-primary bg-bg-secondary px-4 py-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-primary">
                      {photo.title}
                    </p>
                    {photo.description && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-text-tertiary">
                        {photo.description}
                      </p>
                    )}
                  </div>

                  <img
                    src={`/api/gallery/${photo.id}`}
                    alt=""
                    className="h-12 w-12 shrink-0 border border-border-primary object-cover"
                  />
                </div>
                <p className="mt-2 font-mono text-[0.7rem] text-text-muted">
                  {photo.createdAt.slice(0, 10)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
