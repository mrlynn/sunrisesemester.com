import MeetingsSchedule from "@/components/MeetingsSchedule";
import { getWeeklyServiceSchedule } from "@/lib/weeklyService";
import connectDB from "@/lib/mongodb";
import { getMeetingFormatUrlMap } from "@/lib/siteResources";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Meetings",
  description:
    "Sunrise Semester meeting schedule — Monday through Sunday on Zoom, including Saturday men's and women's meetings.",
};

export default async function MeetingsPage() {
  const weeklyService = await getWeeklyServiceSchedule().catch(() => null);

  let formatUrls = {};
  if (process.env.MONGODB_URI) {
    try {
      await connectDB();
      formatUrls = await getMeetingFormatUrlMap();
    } catch (err) {
      console.error("Failed to load meeting format URLs:", err?.message || err);
    }
  }

  return <MeetingsSchedule weeklyService={weeklyService} formatUrls={formatUrls} />;
}
