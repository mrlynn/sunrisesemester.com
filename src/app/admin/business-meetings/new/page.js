import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";
import BusinessMeetingForm from "../BusinessMeetingForm";

export const metadata = { title: "New business meeting minutes" };

export default async function NewBusinessMeetingPage() {
  const store = await cookies();
  if (!(await verifyAdminToken(store.get(COOKIE_NAME)?.value))) {
    redirect("/admin");
  }
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          New business meeting minutes
        </Typography>
        <BusinessMeetingForm mode="create" />
      </Stack>
    </Container>
  );
}
