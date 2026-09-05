import { ContentList } from "../components/ContentList";

export const metadata = {
  title: "Content Management | Bhavya Foundation",
  description: "Manage platform content and documents",
};

export default function ContentPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary tracking-tight">
          Content Management
        </h1>
        <p className="text-sm text-text-tertiary mt-2">
          Manage platform content and documents
        </p>
      </div>
      <ContentList />
    </div>
  );
}
