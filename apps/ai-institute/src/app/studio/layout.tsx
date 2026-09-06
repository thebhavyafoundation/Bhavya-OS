import { requirePolicy } from "@/lib/require-role";

export default async function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePolicy("/studio");
  return <>{children}</>;
}
