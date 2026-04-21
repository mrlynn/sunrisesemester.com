import { notFound } from "next/navigation";
import StoryDetail from "@/components/StoryDetail";
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
  const raw = await getStoryBySlug(slug);
  if (!raw) {
    notFound();
  }
  const story = {
    _id: String(raw._id),
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt || "",
    body: raw.body || "",
    author: raw.author || "",
    coverImage: raw.coverImage || "",
    coverImageCredit: raw.coverImageCredit || "",
    coverImageCreditUrl: raw.coverImageCreditUrl || "",
    updatedAt: raw.updatedAt ? new Date(raw.updatedAt).toISOString() : null,
  };
  return <StoryDetail story={story} />;
}
