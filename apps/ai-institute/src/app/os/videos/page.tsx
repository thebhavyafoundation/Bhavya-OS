import { requirePolicy } from "@/lib/require-role";
import { Video } from "lucide-react";

export const metadata = {
  title: "Video Operations | Bhavya Foundation",
  description:
    "Video production, media management, and content operations",
};

export default async function VideosPage() {
  await requirePolicy("/os/videos");
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Video Operations
        </h1>
        <p className="text-sm text-text-tertiary mt-2">
          Video production, media management, and content operations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Video className="w-4 h-4 text-green-400" />
            <span className="text-xs text-text-tertiary">Published</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">—</div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Video className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-text-tertiary">In Production</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">—</div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Video className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-text-tertiary">Total Views</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">—</div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Video className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-text-tertiary">Channels</span>
          </div>
          <div className="text-2xl font-bold text-text-primary">—</div>
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Video Pipeline
        </h2>
        <p className="text-sm text-text-secondary mb-6">
          Video content production and distribution pipeline. Connect a video
          hosting service to populate this workspace with real data.
        </p>

        <div className="space-y-4">
          {[
            { label: "Script writing", status: "available" },
            { label: "Recording & capture", status: "available" },
            { label: "Editing & post-production", status: "available" },
            { label: "Thumbnail generation", status: "available" },
            { label: "Publishing & distribution", status: "available" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-2 border-b border-border-primary last:border-0"
            >
              <span className="text-sm text-text-primary">{item.label}</span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-bg-secondary text-text-tertiary">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
