import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MarkdownContent from "@/components/MarkdownContent";
import SunriseHero from "@/components/SunriseHero";
import DailyReflection from "@/components/DailyReflection";
import { getLanding } from "@/lib/landing";
import { getTodaysReflection, serializeReflection } from "@/lib/reflections";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const landing = await getLanding();
  const now = new Date();
  const reflectionDoc = await getTodaysReflection().catch(() => null);
  const reflection = serializeReflection(reflectionDoc, now);

  return (
    <Box>
      <SunriseHero title={landing.heroTitle} subtitle={landing.heroSubtitle} />

      {reflection ? <DailyReflection reflection={reflection} /> : null}

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
