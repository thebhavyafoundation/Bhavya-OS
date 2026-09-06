import { ReleaseList } from "../components/ReleaseList";
import { requirePolicy } from "@/lib/require-role";

export const metadata = {
  title: "Release Management | Bhavya Foundation",
  description: "Manage platform releases and versions",
};

export default async function ReleasesPage() {
  await requirePolicy("/os/admin/releases");
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Release Management
        </h1>
        <p className="text-sm text-text-tertiary mt-2">
          Manage platform releases and versions
        </p>
      </div>
      <ReleaseList />
    </div>
  );
}
