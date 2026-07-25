import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export const metadata = {
  title: "Reset your password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
