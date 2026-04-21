import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import { listPublishedStories } from "@/lib/stories";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Stories",
};

export default async function StoriesIndexPage() {
  const stories = await listPublishedStories();
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={3}>
        <Typography variant="h3" component="h1">
          Stories
        </Typography>
        <Typography color="text.secondary">
          Reflections and shares from members. New pieces appear here when published from
          the editor.
        </Typography>
        {stories.length === 0 ? (
          <Typography color="text.secondary">
            No published stories yet. When your database is connected, sign in as an
            editor and add one from the admin area.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {stories.map((s) => (
              <Card key={String(s._id)} variant="outlined">
                <CardActionArea component="a" href={`/stories/${s.slug}`}>
                  <CardContent>
                    <Typography variant="h6" component="h2">
                      {s.title}
                    </Typography>
                    {s.excerpt ? (
                      <Typography color="text.secondary" sx={{ mt: 0.5 }}>
                        {s.excerpt}
                      </Typography>
                    ) : null}
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </Container>
  );
}
