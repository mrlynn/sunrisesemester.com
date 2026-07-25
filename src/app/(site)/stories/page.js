import StoriesIndex from "@/components/StoriesIndex";
import { listPublishedStories } from "@/lib/stories";
import { pageSocialMetadata } from "@/lib/ogMetadata";

export const dynamic = "force-dynamic";

export const metadata = pageSocialMetadata({
  title: "Stories",
  description:
    "Reflections and shares from members of the Sunrise Semester home group of Alcoholics Anonymous.",
  path: "/stories",
});

export default async function StoriesIndexPage() {
  const raw = await listPublishedStories();
  const stories = raw.map((s) => ({
    _id: String(s._id),
    slug: s.slug,
    title: s.title,
    excerpt: s.excerpt || "",
    author: s.author || "",
    coverImage: s.coverImage || "",
    coverImageCredit: s.coverImageCredit || "",
    coverImageCreditUrl: s.coverImageCreditUrl || "",
    updatedAt: s.updatedAt ? new Date(s.updatedAt).toISOString() : null,
  }));
  return <StoriesIndex stories={stories} />;
}
