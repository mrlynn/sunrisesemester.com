import ReflectionsArchive from "@/components/ReflectionsArchive";
import { listReflectionSummaries } from "@/lib/reflections";
import { pageSocialMetadata } from "@/lib/ogMetadata";

export const dynamic = "force-dynamic";

export const metadata = pageSocialMetadata({
  title: "Daily Reflections — Archive",
  description:
    "Browse every day of the year and read that morning's AA Daily Reflection.",
  path: "/reflections",
});

export default async function ReflectionsArchivePage() {
  const reflections = await listReflectionSummaries().catch(() => []);
  const now = new Date();
  const today = { month: now.getMonth() + 1, day: now.getDate() };
  return <ReflectionsArchive reflections={reflections} today={today} />;
}
