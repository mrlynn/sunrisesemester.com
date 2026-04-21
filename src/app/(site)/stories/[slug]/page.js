import { notFound } from "next/navigation";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MarkdownContent from "@/components/MarkdownContent";
import { getStoryBySlug } from "@/lib/stories";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) {
    return { title: "Story" };
  }
  return {
    title: story.title,
    description: story.excerpt || undefined,
  };
}

export default async function StoryPage({ params }) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) {
    notFound();
  }
  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Stack spacing={2}>
        <Typography variant="h3" component="h1">
          {story.title}
        </Typography>
        {story.excerpt ? (
          <Typography variant="subtitle1" color="text.secondary">
            {story.excerpt}
          </Typography>
        ) : null}
        <MarkdownContent markdown={story.body} />
      </Stack>
    </Container>
  );
}
