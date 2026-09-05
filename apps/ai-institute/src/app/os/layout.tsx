import type { Metadata } from "next";
import { OsSidebar } from "@/components/OsSidebar";

export const metadata: Metadata = {
  title: "Bhavya OS | Bhavya Foundation",
  description: "Institutional operating system for Bhavya Foundation",
};

export default function OsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-bg-primary text-text-primary">
      <OsSidebar />
      <main className="flex-1 ml-0 lg:ml-64 pt-14">
        {children}
      </main>
    </div>
  );
}
