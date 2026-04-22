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
import Event from "@/models/Event";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";

export const metadata = { title: "Events (editor)" };

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminEventsPage() {
  const store = await cookies();
  if (!(await verifyAdminToken(store.get(COOKIE_NAME)?.value))) {
    redirect("/admin");
  }
  if (!process.env.MONGODB_URI) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Set <code>MONGODB_URI</code> in <code>.env.local</code> to manage events.
        </Alert>
      </Box>
    );
  }
  await connectDB();
  const events = await Event.find({}).sort({ eventDate: 1 }).lean();
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Events
          </Typography>
          <Button component="a" href="/admin/events/new" variant="contained">
            New event
          </Button>
        </Stack>
        {events.length === 0 ? (
          <Typography color="text.secondary">No events yet. Create one to get started.</Typography>
        ) : (
          <List disablePadding>
            {events.map((ev) => (
              <ListItem
                key={String(ev._id)}
                disablePadding
                sx={{ borderBottom: 1, borderColor: "divider", py: 1.5 }}
              >
                <ListItemText
                  primary={
                    <Button
                      component="a"
                      href={`/admin/events/${String(ev._id)}`}
                      color="inherit"
                      sx={{ justifyContent: "flex-start", textAlign: "left", p: 0, fontWeight: 600 }}
                    >
                      {ev.title}
                    </Button>
                  }
                  secondary={formatDate(ev.eventDate)}
                />
                <Chip
                  size="small"
                  label={ev.published ? "Published" : "Draft"}
                  color={ev.published ? "success" : "default"}
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
