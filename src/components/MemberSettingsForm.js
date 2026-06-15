"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

function toDateInput(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function VisibilitySelect({ label, value, onChange }) {
  return (
    <TextField
      select
      label={label}
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      sx={{ minWidth: 200 }}
    >
      <MenuItem value="public">Public (on the site)</MenuItem>
      <MenuItem value="group">Group only (editors)</MenuItem>
    </TextField>
  );
}

export default function MemberSettingsForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [profile, setProfile] = React.useState(null);
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/member/profile");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not load profile.");
        if (!cancelled) setProfile(data);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function updateField(key, value) {
    setProfile((p) => ({ ...p, [key]: value }));
  }

  function updateVisibility(key, value) {
    setProfile((p) => ({
      ...p,
      visibility: { ...p.visibility, [key]: value },
    }));
  }

  async function save(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const res = await fetch("/api/member/profile", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...profile,
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed.");
      setProfile(data);
      setCurrentPassword("");
      setNewPassword("");
      setMessage("Your profile has been saved.");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/member/logout", { method: "POST" });
    router.push("/member/login");
    router.refresh();
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
        <Typography color="text.secondary">Loading your profile…</Typography>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
        <Alert severity="error">{error || "Profile not found."}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <form onSubmit={save}>
          <Stack spacing={3}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ alignItems: { sm: "center" } }}
            >
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  flexGrow: 1,
                  fontFamily: 'var(--font-serif), Georgia, serif',
                  fontWeight: 800,
                }}
              >
                My group profile
              </Typography>
              <Button type="button" variant="outlined" onClick={logout} size="small">
                Sign out
              </Button>
            </Stack>

            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              Update your contact details and sobriety anniversary. For each field, choose
              whether it appears on the public site or is visible only to group editors.
            </Typography>

            {message ? <Alert severity="success">{message}</Alert> : null}
            {error ? <Alert severity="error">{error}</Alert> : null}

            <Divider />
            <Typography variant="h6">Contact</Typography>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="First name"
                value={profile.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Last name"
                value={profile.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                fullWidth
                required
              />
            </Stack>

            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
                alignItems: "center",
              }}
            >
              <TextField
                label="Phone"
                value={profile.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                fullWidth
              />
              <VisibilitySelect
                label="Phone visibility"
                value={profile.visibility.phone}
                onChange={(v) => updateVisibility("phone", v)}
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
                alignItems: "center",
              }}
            >
              <TextField label="Account email" value={profile.email} fullWidth disabled />
              <VisibilitySelect
                label="Email visibility"
                value={profile.visibility.email}
                onChange={(v) => updateVisibility("email", v)}
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
                alignItems: "start",
              }}
            >
              <Stack spacing={2}>
                <TextField
                  label="Mailing address"
                  value={profile.mailingAddress}
                  onChange={(e) => updateField("mailingAddress", e.target.value)}
                  fullWidth
                />
                <TextField
                  label="City, state, ZIP"
                  value={profile.cityStateZip}
                  onChange={(e) => updateField("cityStateZip", e.target.value)}
                  fullWidth
                />
              </Stack>
              <VisibilitySelect
                label="Address visibility"
                value={profile.visibility.address}
                onChange={(v) => updateVisibility("address", v)}
              />
            </Box>

            <Divider />
            <Typography variant="h6">Sobriety anniversary</Typography>

            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
                alignItems: "center",
              }}
            >
              <TextField
                label="Sobriety date"
                type="date"
                value={toDateInput(profile.sobrietyDate)}
                onChange={(e) => updateField("sobrietyDate", e.target.value || null)}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <VisibilitySelect
                label="Anniversary visibility"
                value={profile.visibility.sobrietyDate}
                onChange={(v) => updateVisibility("sobrietyDate", v)}
              />
            </Box>

            <Box
              sx={{
                display: "grid",
                gap: 2,
                gridTemplateColumns: { xs: "1fr", md: "1fr auto" },
                alignItems: "start",
              }}
            >
              <TextField
                label="Anniversary note (optional)"
                value={profile.anniversaryNote}
                onChange={(e) => updateField("anniversaryNote", e.target.value)}
                fullWidth
                multiline
                minRows={2}
                helperText="Shown on the public anniversaries page when set to public."
              />
              <VisibilitySelect
                label="Note visibility"
                value={profile.visibility.anniversaryNote}
                onChange={(v) => updateVisibility("anniversaryNote", v)}
              />
            </Box>

            <VisibilitySelect
              label="Name on public anniversaries"
              value={profile.visibility.name}
              onChange={(v) => updateVisibility("name", v)}
            />

            <Divider />
            <Typography variant="h6">Change password</Typography>
            <TextField
              label="Current password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              fullWidth
              autoComplete="current-password"
            />
            <TextField
              label="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              autoComplete="new-password"
              helperText="Leave blank to keep your current password."
            />

            <Button type="submit" variant="contained" disabled={busy} size="large">
              {busy ? "Saving…" : "Save profile"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
