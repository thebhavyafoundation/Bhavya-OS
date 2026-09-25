import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community | Bhavya Foundation",
  description:
    "Volunteers, local initiatives, and shared stewardship — the Community pillar.",
};

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
