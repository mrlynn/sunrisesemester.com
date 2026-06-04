import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import connectDB from "@/lib/mongodb";
import BusinessMeeting from "@/models/BusinessMeeting";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";
import { formatMeetingDateLabel } from "@/lib/businessMeetings";
import BusinessMeetingForm from "../BusinessMeetingForm";

export const metadata = { title: "Edit business meeting minutes" };

export default async function EditBusinessMeetingPage({ params }) {
  const store = await cookies();
  if (!(await verifyAdminToken(store.get(COOKIE_NAME)?.value))) {
    redirect("/admin");
  }
  const { id } = await params;
  if (!process.env.MONGODB_URI) {
    redirect("/admin/business-meetings");
  }
  await connectDB();
  const doc = await BusinessMeeting.findById(id).lean();
  if (!doc) notFound();

  const initial = {
    ...doc,
    _id: String(doc._id),
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" } }}>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            {formatMeetingDateLabel(doc.meetingDate)}
          </Typography>
          {doc.published ? (
            <Button component="a" href={`/business-meetings/${doc.slug}`} size="small">
              View public page
            </Button>
          ) : null}
        </Stack>
        <BusinessMeetingForm mode="edit" initial={initial} />
      </Stack>
    </Container>
  );
}
