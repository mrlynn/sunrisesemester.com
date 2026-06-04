import MeetingsSchedule from "@/components/MeetingsSchedule";
import { getWeeklyServiceSchedule } from "@/lib/weeklyService";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Meetings",
  description:
    "Sunrise Semester meeting schedule — Monday through Sunday on Zoom, including Saturday men's and women's meetings.",
};

export default async function MeetingsPage() {
  const weeklyService = await getWeeklyServiceSchedule().catch(() => null);
  return <MeetingsSchedule weeklyService={weeklyService} />;
}
