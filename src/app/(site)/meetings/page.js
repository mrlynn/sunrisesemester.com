import MeetingsSchedule from "@/components/MeetingsSchedule";
import { getWeeklyServiceSchedule } from "@/lib/weeklyService";
import connectDB from "@/lib/mongodb";
import { getMeetingFormatUrlMap } from "@/lib/siteResources";
import { pageSocialMetadata } from "@/lib/ogMetadata";
import { meetings, ZOOM_URL } from "@/lib/meetingsSchedule";
import { buildMeetingsScheduleJsonLd, JsonLd } from "@/lib/structuredData";

export const dynamic = "force-dynamic";

export const metadata = pageSocialMetadata({
  title: "Meetings",
  description:
    "Sunrise Semester meeting schedule — Monday through Sunday on Zoom, including Saturday men's and women's meetings.",
  path: "/meetings",
});

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

  return (
    <>
      <JsonLd data={buildMeetingsScheduleJsonLd(meetings, ZOOM_URL)} />
      <MeetingsSchedule weeklyService={weeklyService} formatUrls={formatUrls} />
    </>
  );
}
