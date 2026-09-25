import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Bhavya Foundation",
  description:
    "A multi-decade mission to build one of the world's most trusted public institutions.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
