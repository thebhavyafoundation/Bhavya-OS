import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Knowledge | Bhavya Foundation",
  description:
    "Academy, courses, library, and research — the Knowledge pillar.",
};

export default function KnowledgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
