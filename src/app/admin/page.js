import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";
import AdminLoginForm from "./AdminLoginForm";

export const metadata = {
  title: "Editor sign-in",
};

export default async function AdminLoginPage() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (await verifyAdminToken(token)) {
    redirect("/admin/landing");
  }
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}
