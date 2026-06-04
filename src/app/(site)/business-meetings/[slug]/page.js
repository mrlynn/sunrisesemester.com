import { notFound } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { BusinessMeetingMinutes } from "@/components/BusinessMeetingView";
import {
  formatMeetingDateLabel,
  getPublishedBusinessMeetingBySlug,
} from "@/lib/businessMeetings";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const meeting = await getPublishedBusinessMeetingBySlug(slug);
  if (!meeting) {
    return { title: "Minutes not found" };
  }
  const label = formatMeetingDateLabel(meeting.meetingDate);
  return {
    title: `${label} business meeting — Sunrise Semester`,
    description: `Business meeting minutes for ${label}, Sunrise Semester home group.`,
  };
}

export default async function BusinessMeetingDetailPage({ params }) {
  const { slug } = await params;
  const meeting = await getPublishedBusinessMeetingBySlug(slug);
  if (!meeting) notFound();

  return (
    <Box sx={{ bgcolor: "#faf8f6", minHeight: "60vh", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Button
            component={Link}
            href="/business-meetings"
            size="small"
            sx={{ alignSelf: "flex-start" }}
          >
            ← Group service hub
          </Button>
          <BusinessMeetingMinutes meeting={meeting} />
        </Stack>
      </Container>
    </Box>
  );
}
