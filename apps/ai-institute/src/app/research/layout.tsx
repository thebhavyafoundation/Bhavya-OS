import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research | Bhavya Foundation",
  description: "Research papers and scholarly work from Bhavya Foundation.",
};

export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
