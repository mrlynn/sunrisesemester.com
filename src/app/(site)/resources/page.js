import ResourcesPage from "@/components/ResourcesPage";
import connectDB from "@/lib/mongodb";
import { listPublishedSiteResources } from "@/lib/siteResources";
import { pageSocialMetadata } from "@/lib/ogMetadata";

export const dynamic = "force-dynamic";

export const metadata = pageSocialMetadata({
  title: "Resources",
  description:
    "Support Sunrise Semester through the 7th Tradition and find helpful AA links for newcomers and members.",
  path: "/resources",
});

export default async function Resources() {
  let resources = [];
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
      const docs = await listPublishedSiteResources();
      resources = JSON.parse(JSON.stringify(docs));
    } catch (err) {
      console.error("Failed to load site resources:", err?.message || err);
    }
  }
  return <ResourcesPage resources={resources} />;
}
