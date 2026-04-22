import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MarkdownContent from "@/components/MarkdownContent";
import { listAllEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Events",
  description: "Upcoming events and announcements from Sunrise Semester.",
};

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function EventsPage() {
  const raw = await listAllEvents();
  const now = new Date();
  const upcoming = raw.filter((e) => new Date(e.eventDate) >= now);
  const past = raw.filter((e) => new Date(e.eventDate) < now);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
      <Stack spacing={6}>
        <Typography variant="h3" component="h1" fontWeight={700}>
          Events & Announcements
        </Typography>

        {upcoming.length === 0 && past.length === 0 ? (
          <Typography color="text.secondary">No events posted yet — check back soon.</Typography>
        ) : null}

        {upcoming.length > 0 ? (
          <Stack spacing={5}>
            {upcoming.map((ev) => (
              <EventCard key={String(ev._id)} ev={ev} />
            ))}
          </Stack>
        ) : null}

        {past.length > 0 ? (
          <Stack spacing={3}>
            <Divider />
            <Typography variant="h5" fontWeight={600} color="text.secondary">
              Past events
            </Typography>
            <Stack spacing={4}>
              {past.map((ev) => (
                <EventCard key={String(ev._id)} ev={ev} past />
              ))}
            </Stack>
          </Stack>
        ) : null}
      </Stack>
    </Container>
  );
}

function EventCard({ ev, past }) {
  return (
    <Box
      sx={{
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        opacity: past ? 0.7 : 1,
      }}
    >
      {ev.flyerImage ? (
        <Box
          component="img"
          src={ev.flyerImage}
          alt={ev.title}
          sx={{ width: "100%", maxHeight: 420, objectFit: "cover", display: "block" }}
        />
      ) : null}
      <Box sx={{ p: { xs: 3, md: 4 } }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          {ev.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {formatDate(ev.eventDate)}
          {ev.location ? ` · ${ev.location}` : ""}
        </Typography>
        {ev.body ? (
          <Box sx={{ mt: 2 }}>
            <MarkdownContent markdown={ev.body} />
          </Box>
        ) : null}
      </Box>
    </Box>
  );
}
