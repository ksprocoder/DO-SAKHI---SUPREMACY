import { requireAdminAuth } from "@/lib/admin-auth";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdminAuth();
  return <>{children}</>;
}
