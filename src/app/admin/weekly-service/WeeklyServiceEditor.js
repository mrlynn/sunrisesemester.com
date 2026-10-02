"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { defaultWeeklyServiceDays } from "@/lib/weeklyServiceShared";

function normalizeInitial(initial) {
  const days =
    Array.isArray(initial?.days) && initial.days.length > 0
      ? initial.days.map((d) => ({
          key: d.key,
          label: d.label,
          chair: d.chair || "",
          sherpa: d.sherpa || "",
          openChair: Boolean(d.openChair),
        }))
      : defaultWeeklyServiceDays();
  return {
    notes: initial?.notes || "",
    days,
  };
}

export default function WeeklyServiceEditor({ initial }) {
  const router = useRouter();
  const [notes, setNotes] = React.useState(() => normalizeInitial(initial).notes);
  const [days, setDays] = React.useState(() => normalizeInitial(initial).days);
  const [message, setMessage] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  function updateDay(index, patch) {
    setDays((list) => list.map((d, i) => (i === index ? { ...d, ...patch } : d)));
  }

  async function save() {
    setMessage(null);
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/weekly-service", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ notes, days }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Save failed.");
        return;
      }
      setMessage("Saved.");
      setDays(data.days || days);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3} component={Paper} variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" component="h1">
          Weekly chair &amp; sherpa
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Assign who chairs and sherpas each day for Daily Sunrise. Saturday is typically an
          open chair with no sherpa — turn that on below.
        </Typography>
        {message ? <Alert severity="success">{message}</Alert> : null}
        {error ? <Alert severity="error">{error}</Alert> : null}
        <Box sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Day</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Chair</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Sherpa</TableCell>
                <TableCell sx={{ fontWeight: 700 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {days.map((row, index) => {
                const isSaturday = row.key === "sat";
                const disabled = row.openChair;
                return (
                  <TableRow key={row.key}>
                    <TableCell sx={{ fontWeight: 600, verticalAlign: "top", pt: 2 }}>
                      {row.label}
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Name"
                        value={row.chair}
                        disabled={disabled}
                        onChange={(e) => updateDay(index, { chair: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Name"
                        value={row.sherpa}
                        disabled={disabled}
                        onChange={(e) => updateDay(index, { sherpa: e.target.value })}
                      />
                    </TableCell>
                    <TableCell>
                      {isSaturday ? (
                        <FormControlLabel
                          control={
                            <Switch
                              checked={row.openChair}
                              onChange={(e) => {
                                const openChair = e.target.checked;
                                updateDay(index, {
                                  openChair,
                                  chair: openChair ? "" : row.chair,
                                  sherpa: openChair ? "" : row.sherpa,
                                });
                              }}
                            />
                          }
                          label="Open Chair"
                        />
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
        <TextField
          label="Notes (optional)"
          fullWidth
          multiline
          minRows={2}
          placeholder="e.g. Updated after the December business meeting"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
        <Button variant="contained" onClick={save} disabled={busy} size="large">
          {busy ? "Saving…" : "Save weekly schedule"}
        </Button>
      </Stack>
    </Container>
  );
}
