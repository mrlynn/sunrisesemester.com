import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getAuthSession } from "@/lib/requireAdmin";
import { defaultAdminPath } from "@/lib/roles";
import AdminLoginForm from "./AdminLoginForm";

export const metadata = {
  title: "Editor sign-in",
};

export default async function AdminLoginPage() {
  const session = await getAuthSession();
  if (session) {
    redirect(defaultAdminPath(session.role));
  }
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}
