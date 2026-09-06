import { requirePolicy } from "@/lib/require-role";

export default async function OsForestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requirePolicy("/os/forest");
  return <>{children}</>;
}
