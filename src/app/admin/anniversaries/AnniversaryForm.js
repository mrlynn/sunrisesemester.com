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

function toDateInput(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function AnniversaryForm({ initial, mode }) {
  const router = useRouter();
  const [name, setName] = React.useState(initial?.name ?? "");
  const [sobrietyDate, setSobrietyDate] = React.useState(
    toDateInput(initial?.sobrietyDate),
  );
  const [note, setNote] = React.useState(initial?.note ?? "");
  const [published, setPublished] = React.useState(initial?.published ?? true);
  const [message, setMessage] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  async function save() {
    setMessage(null);
    setError(null);
    setBusy(true);
    try {
      const payload = { name, sobrietyDate, note, published };
      const url =
        mode === "create"
          ? "/api/admin/anniversaries"
          : `/api/admin/anniversaries/${initial._id}`;
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
        router.push(`/admin/anniversaries/${data._id}`);
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
    if (!window.confirm("Remove this anniversary?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/anniversaries/${initial._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Delete failed.");
        return;
      }
      router.push("/admin/anniversaries");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Stack
      spacing={3}
      component={Paper}
      variant="outlined"
      sx={{ p: { xs: 2, sm: 3 } }}
    >
      <Typography variant="h4" component="h1">
        {mode === "create" ? "New anniversary" : "Edit anniversary"}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Use a first name and last initial (e.g. &ldquo;Sarah K.&rdquo;). Sobriety date
        is the day counted — years are computed automatically.
      </Typography>
      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Sobriety date"
        type="date"
        value={sobrietyDate}
        onChange={(e) => setSobrietyDate(e.target.value)}
        fullWidth
        required
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        fullWidth
        multiline
        minRows={2}
        helperText="A short message shown with this anniversary (e.g. a gratitude line)."
      />
      <FormControlLabel
        control={
          <Switch
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
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
