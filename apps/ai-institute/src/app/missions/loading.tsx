import { Skeleton } from "@bhavya/platform-ui";

export default function Loading() {
  return (
    <div
      className="min-h-screen bg-bg-primary px-6 py-8"
      role="status"
      aria-label="Loading missions"
    >
      <div className="max-w-[1600px] mx-auto space-y-8">
        <Skeleton width="16rem" height="2rem" rounded="lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="border border-border-primary rounded-xl p-8 space-y-4"
            >
              <Skeleton width="3.5rem" height="3.5rem" rounded="lg" />
              <Skeleton width="45%" height="1.5rem" />
              <Skeleton width="100%" height="0.875rem" />
              <Skeleton width="75%" height="0.875rem" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
