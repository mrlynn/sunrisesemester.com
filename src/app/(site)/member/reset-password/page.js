import { Suspense } from "react";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export const metadata = {
  title: "Set a new password",
  robots: { index: false, follow: false },
};

function ResetPasswordFallback() {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Typography color="text.secondary">Loading…</Typography>
    </Container>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
