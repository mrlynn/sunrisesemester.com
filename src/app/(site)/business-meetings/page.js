import GroupServiceHub from "@/components/GroupServiceHub";
import {
  getCommitmentScheduleViews,
  listPublishedBusinessMeetings,
} from "@/lib/businessMeetings";
import { getWeeklyServiceSchedule } from "@/lib/weeklyService";
import { pageSocialMetadata } from "@/lib/ogMetadata";

export const dynamic = "force-dynamic";

export const metadata = pageSocialMetadata({
  title: "Group service",
  description:
    "Weekly chair and sherpa assignments, monthly commitment schedules, and business meeting minutes for the Sunrise Semester home group.",
  path: "/business-meetings",
});

export default async function BusinessMeetingsPage() {
  const [weeklyService, commitment, meetings] = await Promise.all([
    getWeeklyServiceSchedule().catch(() => null),
    getCommitmentScheduleViews().catch(() => ({ current: null, next: null })),
    listPublishedBusinessMeetings().catch(() => []),
  ]);

  return (
    <GroupServiceHub
      weeklyService={weeklyService}
      commitment={commitment}
      meetings={meetings}
    />
  );
}
