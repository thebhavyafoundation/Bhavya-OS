import type { Metadata } from "next";
import { StudioGalleryUpload } from "@/components/StudioGalleryUpload";

export const metadata: Metadata = {
  title: "Gallery Studio",
  description: "Upload photographs to the public Bhavya Foundation gallery.",
};

export default function StudioGalleryPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10 max-w-2xl">
        <p className="editorial-label">Photography</p>
        <h1 className="editorial-heading mt-3 text-3xl text-text-primary">
          Gallery
        </h1>
        <p className="mt-3 text-sm text-text-tertiary">
          Publish photographs to the public gallery. Uploads are stored with the
          institution&apos;s own records — no third-party media service.
        </p>
      </header>
      <StudioGalleryUpload />
    </div>
  );
}
