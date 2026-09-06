import type { Metadata } from "next";
import { OsSidebar } from "@/components/OsSidebar";

export const metadata: Metadata = {
  title: "Bhavya OS | Bhavya Foundation",
  description:
    "The institutional operating system for Nature, Knowledge, Heritage and Community.",
};

export default function OsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="dark min-h-screen flex"
      style={{
        background: "var(--color-forest-950, #0a1f1a)",
        color: "var(--color-text-inverse, #f7f4ec)",
      }}
    >
      <OsSidebar />
      <main className="flex-1 ml-0 lg:ml-64 pt-14 min-h-screen">
        {children}
      </main>
    </div>
  );
}
