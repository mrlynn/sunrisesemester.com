import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import connectDB from "@/lib/mongodb";
import BusinessMeeting from "@/models/BusinessMeeting";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";
import {
  formatMeetingDateLabel,
  getCommitmentScheduleViews,
} from "@/lib/businessMeetings";
import CommitmentScheduleTable from "@/components/CommitmentScheduleTable";

export const metadata = { title: "Business meetings (editor)" };

function CurrentMonthPin({ view }) {
  const schedules = view?.schedules || [];
  const monthLabel = view?.monthLabel || "This month";
  const source = view?.source;

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        borderColor: "rgba(196,60,104,0.35)",
        bgcolor: "rgba(196,60,104,0.04)",
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ alignItems: { sm: "center" } }}
        >
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="overline"
              sx={{ color: "#c43c68", fontWeight: 700, letterSpacing: "0.14em" }}
            >
              Current month
            </Typography>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 700 }}>
              {monthLabel} commitment schedule
            </Typography>
          </Box>
          {source?._id ? (
            <Button
              component={Link}
              href={`/admin/business-meetings/${source._id}`}
              variant="outlined"
              size="small"
            >
              Edit source minutes
            </Button>
          ) : null}
          <Button
            component={Link}
            href="/business-meetings#monthly"
            variant="text"
            size="small"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on site
          </Button>
        </Stack>

        {schedules.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No published schedule for {monthLabel} yet. After the prior month’s business meeting,
            publish minutes that include the commitment tables (they default to the following
            month).
          </Typography>
        ) : (
          <Stack spacing={3}>
            {source ? (
              <Typography variant="body2" color="text.secondary">
                From {source.label} business meeting minutes.
              </Typography>
            ) : null}
            {schedules.map((sched, i) => (
              <Box key={i} sx={{ overflowX: "auto" }}>
                <CommitmentScheduleTable schedule={sched} />
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

export default async function AdminBusinessMeetingsPage() {
  const store = await cookies();
  if (!(await verifyAdminToken(store.get(COOKIE_NAME)?.value))) {
    redirect("/admin");
  }
  if (!process.env.MONGODB_URI) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Set <code>MONGODB_URI</code> in <code>.env.local</code> to manage business meeting minutes.
        </Alert>
      </Box>
    );
  }
  await connectDB();
  const [meetings, commitment] = await Promise.all([
    BusinessMeeting.find({}).sort({ meetingDate: -1 }).lean(),
    getCommitmentScheduleViews().catch(() => ({ current: null, next: null })),
  ]);

  const next = commitment?.next;
  const showNext = Boolean(next?.schedules?.length);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ alignItems: { sm: "center" } }}
        >
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Business meeting minutes
          </Typography>
          <Button component="a" href="/admin/business-meetings/new" variant="contained">
            New minutes
          </Button>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          For the group secretary — monthly AA business meeting notes, motions, and commitment
          schedules. Commitments voted at the second-Tuesday meeting apply to the following month.
        </Typography>

        <CurrentMonthPin view={commitment?.current} />

        {showNext ? (
          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
            <Stack spacing={2}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                sx={{ alignItems: { sm: "center" } }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 700 }}>
                    Next month
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {next.monthLabel} (already set)
                  </Typography>
                </Box>
                {next.source?._id ? (
                  <Button
                    component={Link}
                    href={`/admin/business-meetings/${next.source._id}`}
                    size="small"
                  >
                    Edit source minutes
                  </Button>
                ) : null}
              </Stack>
              {next.schedules.map((sched, i) => (
                <Box key={i} sx={{ overflowX: "auto" }}>
                  <CommitmentScheduleTable schedule={sched} />
                </Box>
              ))}
            </Stack>
          </Paper>
        ) : null}

        <Divider />

        <Typography variant="h6" component="h2">
          All minutes
        </Typography>
        {meetings.length === 0 ? (
          <Typography color="text.secondary">No minutes yet.</Typography>
        ) : (
          <List disablePadding>
            {meetings.map((m) => (
              <ListItem
                key={String(m._id)}
                disablePadding
                sx={{ borderBottom: 1, borderColor: "divider", py: 1.5 }}
              >
                <ListItemText
                  primary={
                    <Button
                      component="a"
                      href={`/admin/business-meetings/${String(m._id)}`}
                      color="inherit"
                      sx={{ justifyContent: "flex-start", textAlign: "left", p: 0, fontWeight: 600 }}
                    >
                      {formatMeetingDateLabel(m.meetingDate)}
                    </Button>
                  }
                  secondary={m.chair ? `Chair: ${m.chair}` : undefined}
                />
                <Chip
                  size="small"
                  label={m.published ? "Published" : "Draft"}
                  color={m.published ? "success" : "default"}
                  sx={{ ml: 1 }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Stack>
    </Container>
  );
}
