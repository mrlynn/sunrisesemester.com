import { redirect } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import { getAuthSession } from "@/lib/requireAdmin";
import { canEditMinutes } from "@/lib/roles";
import { getWeeklyServiceSchedule } from "@/lib/weeklyService";
import WeeklyServiceEditor from "./WeeklyServiceEditor";

export const metadata = { title: "Weekly chair & sherpa" };

export default async function AdminWeeklyServicePage() {
  const session = await getAuthSession();
  if (!session) redirect("/admin");
  if (!canEditMinutes(session.role)) redirect("/admin");

  if (!process.env.MONGODB_URI) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Set <code>MONGODB_URI</code> in <code>.env.local</code> to edit the weekly schedule.
        </Alert>
      </Box>
    );
  }

  const initial = await getWeeklyServiceSchedule();
  return <WeeklyServiceEditor initial={initial} />;
}
