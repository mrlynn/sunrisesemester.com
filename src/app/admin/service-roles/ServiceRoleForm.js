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

export default function ServiceRoleForm({ initial, mode }) {
  const router = useRouter();
  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [holder, setHolder] = React.useState(initial?.holder ?? "");
  const [email, setEmail] = React.useState(initial?.email ?? "");
  const [description, setDescription] = React.useState(initial?.description ?? "");
  const [termLabel, setTermLabel] = React.useState(initial?.termLabel ?? "");
  const [order, setOrder] = React.useState(
    initial?.order !== undefined && initial?.order !== null ? String(initial.order) : "0",
  );
  const [published, setPublished] = React.useState(initial?.published ?? true);
  const [message, setMessage] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  async function save() {
    setMessage(null);
    setError(null);
    setBusy(true);
    try {
      const payload = {
        title,
        holder,
        email,
        description,
        termLabel,
        order: Number(order) || 0,
        published,
      };
      const url =
        mode === "create"
          ? "/api/admin/service-roles"
          : `/api/admin/service-roles/${initial._id}`;
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
        router.push(`/admin/service-roles/${data._id}`);
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
    if (!window.confirm("Remove this service role?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/service-roles/${initial._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Delete failed.");
        return;
      }
      router.push("/admin/service-roles");
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
        {mode === "create" ? "New service role" : "Edit service role"}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Lower &ldquo;order&rdquo; values appear first on the public page.
      </Typography>
      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
      <TextField
        label="Role title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        required
        helperText="E.g. Secretary, Treasurer, GSR, Group Conscience chair."
      />
      <TextField
        label="Holder (first name + last initial)"
        value={holder}
        onChange={(e) => setHolder(e.target.value)}
        fullWidth
        helperText="Leave blank if the position is open."
      />
      <TextField
        label="Contact email (optional)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        fullWidth
        helperText="Shown as a mailto link on the public page."
      />
      <TextField
        label="Term (optional)"
        value={termLabel}
        onChange={(e) => setTermLabel(e.target.value)}
        fullWidth
        helperText="E.g. 'Jan–Dec 2026' or 'Rotates July'."
      />
      <TextField
        label="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        minRows={2}
        helperText="A short line explaining what this role does."
      />
      <TextField
        label="Display order"
        type="number"
        value={order}
        onChange={(e) => setOrder(e.target.value)}
        helperText="Lower numbers appear first. Defaults to 0."
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
