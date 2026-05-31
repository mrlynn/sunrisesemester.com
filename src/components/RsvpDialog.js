"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

export const rsvpButtonSx = {
  px: 4,
  py: 1.25,
  fontWeight: 800,
  fontSize: "0.95rem",
  letterSpacing: "0.02em",
  color: "#fff",
  background: "linear-gradient(135deg, #ff6b35 0%, #c43c68 100%)",
  "&:hover": { background: "linear-gradient(135deg, #ff8555 0%, #d4556f 100%)" },
  "&:disabled": { opacity: 0.6, color: "#fff" },
};

export default function RsvpDialog({ onClose, event, onSuccess }) {
  const [firstName, setFirstName] = React.useState("");
  const [lastInitial, setLastInitial] = React.useState("");
  const [partySize, setPartySize] = React.useState(1);
  const [note, setNote] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/events/${event._id}/rsvp`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ firstName, lastInitial, partySize, note }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "RSVP failed.");
      setSuccess(true);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 800, fontFamily: "var(--font-serif), Georgia, serif" }}>
        RSVP — {event.title}
      </DialogTitle>
      {success ? (
        <DialogContent>
          <Alert severity="success" sx={{ "& .MuiAlert-message": { lineHeight: 1.6 } }}>
            <Typography sx={{ fontWeight: 700, mb: 0.5 }}>You&rsquo;re on the list.</Typography>
            Thanks for letting us know you&rsquo;re coming. We look forward to seeing you.
          </Alert>
        </DialogContent>
      ) : (
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <Typography sx={{ color: "#666", fontSize: "0.9rem" }}>
                No email required — just your first name and last initial.
              </Typography>
              <Stack direction="row" spacing={2}>
                <TextField
                  label="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  fullWidth
                  slotProps={{ htmlInput: { maxLength: 80 } }}
                />
                <TextField
                  label="Last initial"
                  value={lastInitial}
                  onChange={(e) => setLastInitial(e.target.value)}
                  required
                  sx={{ width: 120 }}
                  slotProps={{ htmlInput: { maxLength: 1 } }}
                />
              </Stack>
              <TextField
                label="Party size"
                type="number"
                value={partySize}
                onChange={(e) => setPartySize(e.target.value)}
                fullWidth
                slotProps={{ htmlInput: { min: 1, max: 10 } }}
              />
              <TextField
                label="Note (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                fullWidth
                multiline
                minRows={2}
                slotProps={{ htmlInput: { maxLength: 500 } }}
              />
              {error ? <Alert severity="error">{error}</Alert> : null}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={onClose} color="inherit" disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} sx={rsvpButtonSx}>
              {submitting ? "Sending…" : "Confirm RSVP"}
            </Button>
          </DialogActions>
        </Box>
      )}
    </Dialog>
  );
}
