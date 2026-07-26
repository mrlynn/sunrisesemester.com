import { Suspense } from "react";
import AdminResetPasswordForm from "@/components/AdminResetPasswordForm";

export const metadata = {
  title: "Set a new password",
  robots: { index: false, follow: false },
};

export default function AdminResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <AdminResetPasswordForm />
    </Suspense>
  );
}
