import { cookies } from "next/headers";
import { redirect } from "next/navigation";
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
import connectDB from "@/lib/mongodb";
import BusinessMeeting from "@/models/BusinessMeeting";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";
import { formatMeetingDateLabel } from "@/lib/businessMeetings";

export const metadata = { title: "Business meetings (editor)" };

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
  const meetings = await BusinessMeeting.find({}).sort({ meetingDate: -1 }).lean();

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
          schedules.
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
