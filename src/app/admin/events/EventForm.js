"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";

export default function EventForm({ initial, mode }) {
  const router = useRouter();
  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [eventDate, setEventDate] = React.useState(
    initial?.eventDate ? new Date(initial.eventDate).toISOString().slice(0, 16) : "",
  );
  const [location, setLocation] = React.useState(initial?.location ?? "");
  const [body, setBody] = React.useState(initial?.body ?? "");
  const [flyerImage, setFlyerImage] = React.useState(initial?.flyerImage ?? "");
  const [published, setPublished] = React.useState(initial?.published ?? true);
  const [message, setMessage] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  async function save() {
    setMessage(null);
    setError(null);
    setBusy(true);
    try {
      const payload = { title, eventDate, location, body, flyerImage, published };
      const url =
        mode === "create" ? "/api/admin/events" : `/api/admin/events/${initial._id}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Save failed.");
        return;
      }
      setMessage("Saved.");
      if (mode === "create") {
        router.push(`/admin/events/${data._id}`);
        router.refresh();
      } else {
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (mode !== "edit") return;
    if (!window.confirm("Delete this event permanently?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/events/${initial._id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Delete failed.");
        return;
      }
      router.push("/admin/events");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Stack spacing={3} component={Paper} variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" component="h1">
        {mode === "create" ? "New event" : "Edit event"}
      </Typography>
      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Date & time"
        type="datetime-local"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
        fullWidth
        required
        slotProps={{ inputLabel: { shrink: true } }}
      />
      <TextField
        label="Location (optional)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        fullWidth
        helperText="E.g. Riverside Park, Shelter B"
      />
      <TextField
        label="Flyer image URL (optional)"
        value={flyerImage}
        onChange={(e) => setFlyerImage(e.target.value)}
        fullWidth
        helperText="Full URL to a flyer or event image."
      />
      <TextField
        label="Details (Markdown, optional)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        fullWidth
        multiline
        minRows={8}
      />
      <FormControlLabel
        control={
          <Switch checked={published} onChange={(e) => setPublished(e.target.checked)} />
        }
        label="Published (visible on public site)"
      />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button variant="contained" onClick={save} disabled={busy} size="large">
          {busy ? "Saving…" : "Save"}
        </Button>
        {mode === "edit" ? (
          <Button color="error" variant="outlined" onClick={remove} disabled={busy}>
            Delete
          </Button>
        ) : null}
      </Stack>
    </Stack>
  );
}
