import { Suspense } from "react";
import MemberLoginForm from "@/components/MemberLoginForm";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export const metadata = {
  title: "Member sign-in",
  robots: { index: false, follow: false },
};

function LoginFallback() {
  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Typography color="text.secondary">Loading…</Typography>
    </Container>
  );
}

export default function MemberLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <MemberLoginForm />
    </Suspense>
  );
}
