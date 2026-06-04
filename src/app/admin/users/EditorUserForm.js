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
import MenuItem from "@mui/material/MenuItem";
import { ROLE_DESCRIPTIONS, ROLE_LABELS, ROLES } from "@/lib/roles";

export default function EditorUserForm({ initial, mode }) {
  const router = useRouter();
  const [email, setEmail] = React.useState(initial?.email ?? "");
  const [name, setName] = React.useState(initial?.name ?? "");
  const [role, setRole] = React.useState(initial?.role ?? "secretary");
  const [password, setPassword] = React.useState("");
  const [active, setActive] = React.useState(initial?.active !== false);
  const [message, setMessage] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  async function save() {
    setMessage(null);
    setError(null);
    setBusy(true);
    try {
      const payload = { email, name, role, active };
      if (password) payload.password = password;
      const url = mode === "create" ? "/api/admin/users" : `/api/admin/users/${initial._id}`;
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
        router.push(`/admin/users/${data._id}`);
        router.refresh();
      } else {
        setPassword("");
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (mode !== "edit") return;
    if (!window.confirm(`Remove ${email}? They will no longer be able to sign in.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/users/${initial._id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Delete failed.");
        return;
      }
      router.push("/admin/users");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Stack spacing={2}>
      <TextField
        label="Email"
        type="email"
        autoComplete="email"
        required
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Display name (optional)"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
        helperText="Shown in the toolbar after sign-in."
      />
      <TextField
        select
        label="Role"
        fullWidth
        value={role}
        onChange={(e) => setRole(e.target.value)}
        helperText={ROLE_DESCRIPTIONS[role]}
      >
        {ROLES.map((r) => (
          <MenuItem key={r} value={r}>
            {ROLE_LABELS[r]}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label={mode === "create" ? "Password" : "New password"}
        type="password"
        autoComplete={mode === "create" ? "new-password" : "new-password"}
        fullWidth
        required={mode === "create"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        helperText={
          mode === "create"
            ? "At least 8 characters."
            : "Leave blank to keep the current password."
        }
      />
      <FormControlLabel
        control={<Switch checked={active} onChange={(e) => setActive(e.target.checked)} />}
        label="Account active"
      />
      {error ? <Alert severity="error">{error}</Alert> : null}
      {message ? <Alert severity="success">{message}</Alert> : null}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button variant="contained" onClick={save} disabled={busy}>
          {busy ? "Saving…" : "Save user"}
        </Button>
        {mode === "edit" ? (
          <Button color="error" variant="outlined" onClick={remove} disabled={busy}>
            Delete user
          </Button>
        ) : null}
      </Stack>
    </Stack>
  );
}
