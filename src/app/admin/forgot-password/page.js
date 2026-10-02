import AdminForgotPasswordForm from "@/components/AdminForgotPasswordForm";

export const metadata = {
  title: "Reset editor password",
  robots: { index: false, follow: false },
};

export default function AdminForgotPasswordPage() {
  return <AdminForgotPasswordForm />;
}
