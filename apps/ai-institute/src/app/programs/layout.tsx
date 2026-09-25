import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programs | Bhavya Foundation",
  description: "Institutional programs and learning pathways.",
};

export default function ProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
