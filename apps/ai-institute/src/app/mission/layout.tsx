import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Mission | Bhavya Foundation",
  description:
    "The purpose, pillars, and multi-decade mission of Bhavya Foundation.",
};

export default function MissionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
