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
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import AddIcon from "@mui/icons-material/Add";
import { BRING_CATEGORIES, CATEGORY_META } from "@/lib/coordination";

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function EventForm({ initial, mode }) {
  const router = useRouter();
  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [slug, setSlug] = React.useState(initial?.slug ?? "");
  // Once the admin edits the slug by hand (or it came from an existing event),
  // stop auto-syncing it from the title.
  const [slugTouched, setSlugTouched] = React.useState(Boolean(initial?.slug));
  const [eventDate, setEventDate] = React.useState(
    initial?.eventDate ? new Date(initial.eventDate).toISOString().slice(0, 16) : "",
  );
  const [location, setLocation] = React.useState(initial?.location ?? "");
  const [body, setBody] = React.useState(initial?.body ?? "");
  const [flyerImage, setFlyerImage] = React.useState(initial?.flyerImage ?? "");
  const [published, setPublished] = React.useState(initial?.published ?? true);
  const [rsvpEnabled, setRsvpEnabled] = React.useState(initial?.rsvpEnabled ?? false);
  const [rsvpCapacity, setRsvpCapacity] = React.useState(
    initial?.rsvpCapacity != null ? String(initial.rsvpCapacity) : "0",
  );
  const [coordinationEnabled, setCoordinationEnabled] = React.useState(
    initial?.coordinationEnabled ?? false,
  );
  const [bringSlots, setBringSlots] = React.useState(
    Array.isArray(initial?.bringSlots)
      ? initial.bringSlots.map((s) => ({
          id: s._id ? String(s._id) : undefined,
          category: s.category || "food",
          label: s.label || "",
          quantity: s.quantity || 1,
        }))
      : [],
  );
  const [existingFlyer, setExistingFlyer] = React.useState(initial?.flyer?.name ?? "");
  const [flyerFile, setFlyerFile] = React.useState(null);
  const [removeFlyer, setRemoveFlyer] = React.useState(false);
  const [message, setMessage] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  function updateSlot(index, patch) {
    setBringSlots((slots) =>
      slots.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    );
  }
  function addSlot() {
    setBringSlots((slots) => [...slots, { category: "food", label: "", quantity: 1 }]);
  }
  function removeSlot(index) {
    setBringSlots((slots) => slots.filter((_, i) => i !== index));
  }

  async function save() {
    setMessage(null);
    setError(null);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.set("title", title);
      fd.set("slug", slug);
      fd.set("eventDate", eventDate);
      fd.set("location", location);
      fd.set("body", body);
      fd.set("flyerImage", flyerImage);
      fd.set("published", String(published));
      fd.set("rsvpEnabled", String(rsvpEnabled));
      fd.set("rsvpCapacity", String(Number.parseInt(rsvpCapacity, 10) || 0));
      fd.set("coordinationEnabled", String(coordinationEnabled));
      fd.set(
        "bringSlots",
        JSON.stringify(
          bringSlots
            .filter((s) => s.label.trim())
            .map((s) => ({
              id: s.id,
              category: s.category,
              label: s.label.trim(),
              quantity: Number.parseInt(s.quantity, 10) || 1,
            })),
        ),
      );
      if (flyerFile) fd.set("flyer", flyerFile);
      if (removeFlyer) fd.set("removeFlyer", "true");

      const url =
        mode === "create" ? "/api/admin/events" : `/api/admin/events/${initial._id}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        body: fd,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Save failed.");
        return;
      }
      setMessage("Saved.");
      setFlyerFile(null);
      setRemoveFlyer(false);
      setExistingFlyer(data?.flyer?.name ?? "");
      if (Array.isArray(data?.bringSlots)) {
        setBringSlots(
          data.bringSlots.map((s) => ({
            id: s._id ? String(s._id) : undefined,
            category: s.category || "food",
            label: s.label || "",
            quantity: s.quantity || 1,
          })),
        );
      }
      if (data?.slug) {
        setSlug(data.slug);
        setSlugTouched(true);
      }
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
        onChange={(e) => {
          const next = e.target.value;
          setTitle(next);
          if (!slugTouched) setSlug(slugify(next));
        }}
        fullWidth
        required
      />
      <TextField
        label="Slug"
        value={slug}
        onChange={(e) => {
          setSlug(e.target.value);
          setSlugTouched(true);
        }}
        onBlur={() => setSlug((s) => slugify(s))}
        fullWidth
        required
        helperText={`Event URL: /events/${slug || "your-event"}`}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">/events/</InputAdornment>
            ),
            endAdornment:
              slugTouched && title ? (
                <Button
                  size="small"
                  onClick={() => {
                    setSlug(slugify(title));
                    setSlugTouched(false);
                  }}
                >
                  Reset
                </Button>
              ) : null,
          },
        }}
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
        label="Header image URL (optional)"
        value={flyerImage}
        onChange={(e) => setFlyerImage(e.target.value)}
        fullWidth
        helperText="Full URL to a banner/header image shown at the top of the event."
      />
      <Box>
        <Typography sx={{ fontWeight: 600, mb: 1 }}>
          Downloadable flyer (optional)
        </Typography>
        {existingFlyer && !removeFlyer ? (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ alignItems: { sm: "center" }, mb: 1.5 }}
          >
            <Button
              component="a"
              href={`/api/events/${initial?._id}/flyer`}
              target="_blank"
              rel="noopener"
              variant="outlined"
              size="small"
            >
              View current: {existingFlyer}
            </Button>
            <Button color="error" size="small" onClick={() => setRemoveFlyer(true)}>
              Remove flyer
            </Button>
          </Stack>
        ) : null}
        {removeFlyer ? (
          <Alert
            severity="info"
            sx={{ mb: 1.5 }}
            action={
              <Button color="inherit" size="small" onClick={() => setRemoveFlyer(false)}>
                Undo
              </Button>
            }
          >
            Current flyer will be removed on save.
          </Alert>
        ) : null}
        <Button variant="outlined" component="label">
          {flyerFile ? flyerFile.name : "Choose flyer (PDF or image)"}
          <input
            type="file"
            hidden
            accept=".pdf,.png,.jpg,.jpeg,.gif,.webp,application/pdf,image/*"
            onChange={(e) => {
              setFlyerFile(e.target.files?.[0] ?? null);
              setRemoveFlyer(false);
            }}
          />
        </Button>
        <Typography sx={{ mt: 1, fontSize: "0.8rem", color: "text.secondary" }}>
          PDF or image, up to 25 MB. Visitors can download this from the event page.
        </Typography>
      </Box>
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
      <FormControlLabel
        control={
          <Switch
            checked={rsvpEnabled}
            onChange={(e) => setRsvpEnabled(e.target.checked)}
          />
        }
        label="Enable RSVP"
      />
      {rsvpEnabled ? (
        <TextField
          label="Capacity"
          type="number"
          value={rsvpCapacity}
          onChange={(e) => setRsvpCapacity(e.target.value)}
          fullWidth
          slotProps={{ htmlInput: { min: 0 } }}
          helperText="Maximum total headcount. Use 0 for unlimited."
        />
      ) : null}
      <FormControlLabel
        control={
          <Switch
            checked={coordinationEnabled}
            onChange={(e) => setCoordinationEnabled(e.target.checked)}
          />
        }
        label="Enable potluck & rides board"
      />
      {coordinationEnabled ? (
        <Box sx={{ pl: { sm: 1 } }}>
          <Typography sx={{ fontWeight: 600, mb: 0.5 }}>Things to bring</Typography>
          <Typography sx={{ fontSize: "0.85rem", color: "text.secondary", mb: 2 }}>
            List what you&rsquo;d like people to bring. Attendees claim these on the event
            page, and can also add their own extras. Leave empty to let people add freely.
          </Typography>
          <Stack spacing={1.5}>
            {bringSlots.map((slot, i) => (
              <Stack
                key={slot.id || `new-${i}`}
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{ alignItems: { sm: "center" } }}
              >
                <TextField
                  select
                  label="Category"
                  value={slot.category}
                  onChange={(e) => updateSlot(i, { category: e.target.value })}
                  sx={{ minWidth: 150 }}
                >
                  {BRING_CATEGORIES.map((c) => (
                    <MenuItem key={c} value={c}>
                      {CATEGORY_META[c].emoji} {CATEGORY_META[c].label}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Item"
                  value={slot.label}
                  onChange={(e) => updateSlot(i, { label: e.target.value })}
                  fullWidth
                  placeholder="e.g. Dessert, Folding chairs, Ice"
                />
                <TextField
                  label="Qty"
                  type="number"
                  value={slot.quantity}
                  onChange={(e) => updateSlot(i, { quantity: e.target.value })}
                  sx={{ width: 90 }}
                  slotProps={{ htmlInput: { min: 1, max: 99 } }}
                />
                <IconButton
                  aria-label="Remove item"
                  color="error"
                  onClick={() => removeSlot(i)}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Stack>
            ))}
            <Box>
              <Button startIcon={<AddIcon />} onClick={addSlot} variant="outlined" size="small">
                Add item
              </Button>
            </Box>
          </Stack>
        </Box>
      ) : null}
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
