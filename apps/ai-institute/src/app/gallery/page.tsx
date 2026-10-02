import type { Metadata } from "next";
import { listGalleryPhotos } from "@/lib/gallery-store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photographs from Bhavya Foundation's work, published by the institution.",
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function GalleryPage() {
  const photos = await listGalleryPhotos();

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[7fr_5fr] lg:items-end">
          <div>
            <p className="editorial-label">Photography</p>
            <h1 className="editorial-heading mt-3 text-4xl text-text-primary lg:text-5xl">
              The gallery
            </h1>
            <p className="editorial-lead mt-4 max-w-xl">
              Photographs published by Bhavya Foundation. Every image here was
              uploaded by a member of the content team — nothing is sourced from
              outside the institution.
            </p>
          </div>
          <p className="text-sm text-text-tertiary lg:text-right">
            {photos.length === 0
              ? "No photographs published yet."
              : `${photos.length} ${photos.length === 1 ? "photograph" : "photographs"}`}
          </p>
        </div>

        {photos.length === 0 ? (
          <div className="mt-12 border border-border-primary bg-surface p-8">
            <p className="text-base leading-relaxed text-text-secondary">
              Photographs will appear here as they are published from the
              studio. There are no placeholders to show in the meantime.
            </p>
          </div>
        ) : (
          <div className="gallery-grid mt-12">
            {photos.map((photo, index) => (
              <figure
                key={photo.id}
                className={
                  index === 0
                    ? "gallery-tile gallery-tile--feature"
                    : "gallery-tile"
                }
              >
                <div className="gallery-tile__frame">
                  <img
                    src={`/api/gallery/${photo.id}`}
                    alt={photo.title}
                    loading={index === 0 ? "eager" : "lazy"}
                    className="gallery-tile__image"
                  />
                </div>
                <figcaption className="gallery-tile__caption">
                  <h2 className="font-display text-xl text-text-primary">
                    {photo.title}
                  </h2>
                  {photo.description && (
                    <p className="mt-1 text-sm text-text-secondary">
                      {photo.description}
                    </p>
                  )}
                  <p className="mt-2 font-mono text-[0.7rem] text-text-muted">
                    {formatDate(photo.createdAt)}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
