import { notFound } from "next/navigation";
import StoryDetail from "@/components/StoryDetail";
import { getStoryBySlug } from "@/lib/stories";
import { pageSocialMetadata } from "@/lib/ogMetadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story) {
    return { title: "Story" };
  }
  const description =
    story.excerpt ||
    `A story from the Sunrise Semester home group of Alcoholics Anonymous.`;
  return pageSocialMetadata({
    title: story.title,
    description,
    image: story.coverImage,
    imageAlt: story.title,
    type: "article",
    path: `/stories/${story.slug}`,
  });
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
