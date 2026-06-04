import GroupServiceHub from "@/components/GroupServiceHub";
import {
  getLatestPublishedCommitmentSchedules,
  listPublishedBusinessMeetings,
} from "@/lib/businessMeetings";
import { getWeeklyServiceSchedule } from "@/lib/weeklyService";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Group service — Sunrise Semester",
  description:
    "Weekly chair and sherpa assignments, monthly commitment schedules, and business meeting minutes for the Sunrise Semester home group.",
};

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
