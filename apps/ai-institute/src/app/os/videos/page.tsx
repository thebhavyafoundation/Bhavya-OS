"use client";

import { useAuth } from "@/components/AuthProvider";
import { OsSidebar } from "@/components/OsSidebar";

export default function OsVideosPage() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-bg-primary">
      <OsSidebar />
      <main className="flex-1 lg:ml-64 p-6">
        <div className="max-w-4xl mx-auto">
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "var(--text-3xl)",
              fontWeight: 600,
              marginBottom: "var(--space-4)",
            }}
          >
            Videos
          </h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              marginBottom: "var(--space-8)",
            }}
          >
            Video content management and media library.
          </p>

          <div
            style={{
              padding: "var(--space-8)",
              background: "var(--color-surface)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border-primary)",
              textAlign: "center",
            }}
          >
            <p
              style={{
                color: "var(--color-text-muted)",
                fontSize: "var(--text-sm)",
              }}
            >
              Video management capabilities will be available here once connected
              to the media pipeline.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
