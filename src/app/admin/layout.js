import AdminShell from "./AdminShell";
import { getAuthSession } from "@/lib/requireAdmin";

export default async function AdminLayout({ children }) {
  const session = await getAuthSession();
  return <AdminShell session={session}>{children}</AdminShell>;
}
