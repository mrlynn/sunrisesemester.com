import GroupServiceHub from "@/components/GroupServiceHub";
import {
  getLatestPublishedCommitmentSchedules,
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
    getLatestPublishedCommitmentSchedules().catch(() => ({ schedules: [], source: null })),
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
