import { cookies } from "next/headers";
import { redirect, notFound } from "next/navigation";
import mongoose from "mongoose";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";
import Rsvp from "@/models/Rsvp";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";
import { getEventCoordination } from "@/lib/events";
import EventForm from "../EventForm";
import AdminCoordinationManager from "../AdminCoordinationManager";

function formatDateTime(d) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export const metadata = { title: "Edit event" };

export default async function EditEventPage({ params }) {
  const store = await cookies();
  if (!(await verifyAdminToken(store.get(COOKIE_NAME)?.value))) {
    redirect("/admin");
  }
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) notFound();
  if (!process.env.MONGODB_URI) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Set <code>MONGODB_URI</code> in <code>.env.local</code> to edit events.
        </Alert>
      </Box>
    );
  }
  await connectDB();
  const doc = await Event.findById(id).select({ "flyer.data": 0 }).lean();
  if (!doc) notFound();
  const initial = JSON.parse(JSON.stringify(doc));

  const rsvps = await Rsvp.find({ event: id }).sort({ createdAt: -1 }).lean();
  const headcount = rsvps.reduce((sum, r) => sum + (r.partySize || 1), 0);
  const coordination = doc.coordinationEnabled
    ? await getEventCoordination(id, { includeContact: true })
    : null;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={4}>
        <EventForm mode="edit" initial={initial} />

        {doc.rsvpEnabled ? (
          <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ alignItems: { sm: "center" }, mb: 2 }}
            >
              <Typography variant="h5" component="h2" sx={{ flexGrow: 1 }}>
                RSVPs
              </Typography>
              <Chip color="primary" label={`${headcount} attending`} />
              <Chip
                variant="outlined"
                label={
                  doc.rsvpCapacity > 0
                    ? `Capacity: ${doc.rsvpCapacity}`
                    : "Capacity: unlimited"
                }
              />
            </Stack>
            {rsvps.length === 0 ? (
              <Typography color="text.secondary">No RSVPs yet.</Typography>
            ) : (
              <List disablePadding>
                {rsvps.map((r) => (
                  <ListItem
                    key={String(r._id)}
                    disablePadding
                    sx={{ borderBottom: 1, borderColor: "divider", py: 1.25 }}
                  >
                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: 600 }}>
                          {r.firstName} {r.lastInitial}.
                          {r.partySize > 1 ? ` (party of ${r.partySize})` : ""}
                        </Typography>
                      }
                      secondary={
                        <>
                          {r.note ? `${r.note} — ` : ""}
                          {formatDateTime(r.createdAt)}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        ) : null}

        {coordination ? (
          <AdminCoordinationManager eventId={String(doc._id)} initial={coordination} />
        ) : null}
      </Stack>
    </Container>
  );
}
