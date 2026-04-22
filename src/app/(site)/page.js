import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MarkdownContent from "@/components/MarkdownContent";
import SunriseHero from "@/components/SunriseHero";
import DailyReflection from "@/components/DailyReflection";
import { getLanding } from "@/lib/landing";
import { getTodaysReflection, serializeReflection } from "@/lib/reflections";
import { listUpcomingEvents } from "@/lib/events";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const landing = await getLanding();
  const now = new Date();
  const reflectionDoc = await getTodaysReflection().catch(() => null);
  const reflection = serializeReflection(reflectionDoc, now);
  const upcomingEvents = await listUpcomingEvents().catch(() => []);

  return (
    <Box>
      <SunriseHero title={landing.heroTitle} subtitle={landing.heroSubtitle} />

      {reflection ? <DailyReflection reflection={reflection} /> : null}

      {upcomingEvents.length > 0 ? (
        <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
          <Card sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)", borderRadius: 2, borderLeft: "4px solid #ff6b35" }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Upcoming Events
              </Typography>
              <Stack spacing={1.5}>
                {upcomingEvents.map((ev) => (
                  <Box key={String(ev._id)}>
                    <Typography fontWeight={600}>{ev.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(ev.eventDate).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                      {ev.location ? ` · ${ev.location}` : ""}
                    </Typography>
                  </Box>
                ))}
              </Stack>
              <Button
                component="a"
                href="/events"
                variant="outlined"
                size="small"
                sx={{ mt: 2, borderColor: "#ff6b35", color: "#ff6b35", "&:hover": { borderColor: "#e55a25", color: "#e55a25" } }}
              >
                See all events
              </Button>
            </CardContent>
          </Card>
        </Container>
      ) : null}

      {landing.body ? (
        <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
          <Stack spacing={8}>
            <Card
              sx={{
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                borderRadius: 2,
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <MarkdownContent markdown={landing.body} />
              </CardContent>
            </Card>
          </Stack>
        </Container>
      ) : null}
    </Box>
  );
}
