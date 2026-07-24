import { ContentList } from "../../components/ContentList";

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold" style={{ color: "var(--admin-text)" }}>
          Content Management
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--admin-text-secondary)" }}>
          Edit registry documents, manage drafts, and publish content
        </p>
      </div>
      <ContentList />
    </div>
  );
}
