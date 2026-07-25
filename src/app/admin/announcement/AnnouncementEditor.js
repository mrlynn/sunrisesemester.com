"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

function toDatetimeLocalValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function fromDatetimeLocalValue(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

export default function AnnouncementEditor({ initial, stories = [] }) {
  const router = useRouter();
  const [enabled, setEnabled] = React.useState(Boolean(initial.enabled));
  const [message, setMessage] = React.useState(initial.message ?? "");
  const [href, setHref] = React.useState(initial.href ?? "");
  const [linkLabel, setLinkLabel] = React.useState(initial.linkLabel ?? "Read more");
  const [dismissible, setDismissible] = React.useState(initial.dismissible !== false);
  const [startsAt, setStartsAt] = React.useState(toDatetimeLocalValue(initial.startsAt));
  const [endsAt, setEndsAt] = React.useState(toDatetimeLocalValue(initial.endsAt));
  const [messageStatus, setMessageStatus] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  const storyOptions = stories
    .filter((s) => s.slug)
    .map((s) => ({
      value: `/stories/${s.slug}`,
      label: s.published === false ? `${s.title} (draft)` : s.title,
    }));

  const selectedStory = storyOptions.some((s) => s.value === href) ? href : "";

  async function save() {
    setMessageStatus(null);
    setError(null);

    const trimmedMessage = message.trim();
    const trimmedHref = href.trim();
    if (enabled && (!trimmedMessage || !trimmedHref)) {
      setError("When the banner is on, message and link URL are required.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch("/api/admin/announcement", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          enabled,
          message: trimmedMessage,
          href: trimmedHref,
          linkLabel: linkLabel.trim() || "Read more",
          dismissible,
          startsAt: fromDatetimeLocalValue(startsAt),
          endsAt: fromDatetimeLocalValue(endsAt),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Save failed.");
        return;
      }
      setMessageStatus(enabled ? "Saved. Banner is live (within any schedule you set)." : "Saved. Banner is off.");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3} component={Paper} variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack spacing={1}>
          <Typography variant="h4" component="h1">
            Announcement banner
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Thin sitewide bar above the navigation. Link it to a member story or any URL.
          </Typography>
        </Stack>

        {messageStatus ? <Alert severity="success">{messageStatus}</Alert> : null}
        {error ? <Alert severity="error">{error}</Alert> : null}

        <FormControlLabel
          control={<Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />}
          label="Show banner on the site"
        />

        <TextField
          label="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          required={enabled}
          helperText="Short line of text (about 240 characters max)."
          slotProps={{ htmlInput: { maxLength: 240 } }}
        />

        <TextField
          select
          label="Link to a story"
          value={selectedStory}
          onChange={(e) => setHref(e.target.value)}
          fullWidth
          helperText="Pick a published story, or leave blank and set a custom URL below."
        >
          <MenuItem value="">
            <em>Custom URL / none</em>
          </MenuItem>
          {storyOptions.map((s) => (
            <MenuItem key={s.value} value={s.value}>
              {s.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Link URL"
          value={href}
          onChange={(e) => setHref(e.target.value)}
          fullWidth
          required={enabled}
          placeholder="/stories/your-story-slug or https://…"
          helperText="Internal paths (starting with /) or full external URLs."
        />

        <TextField
          label="Link label"
          value={linkLabel}
          onChange={(e) => setLinkLabel(e.target.value)}
          fullWidth
          helperText='Shown after the message, e.g. "Read more".'
          slotProps={{ htmlInput: { maxLength: 40 } }}
        />

        <FormControlLabel
          control={
            <Switch checked={dismissible} onChange={(e) => setDismissible(e.target.checked)} />
          }
          label="Allow visitors to dismiss the banner"
        />

        <Divider />

        <Typography variant="subtitle2" color="text.secondary">
          Optional schedule (leave blank to show whenever enabled)
        </Typography>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            label="Starts"
            type="datetime-local"
            value={startsAt}
            onChange={(e) => setStartsAt(e.target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="Ends"
            type="datetime-local"
            value={endsAt}
            onChange={(e) => setEndsAt(e.target.value)}
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
        </Stack>

        <Button variant="contained" onClick={save} disabled={busy} size="large">
          {busy ? "Saving…" : "Save announcement"}
        </Button>
      </Stack>
    </Container>
  );
}
