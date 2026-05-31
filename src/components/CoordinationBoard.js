"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Alert from "@mui/material/Alert";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import { BRING_CATEGORIES, CATEGORY_META } from "@/lib/coordination";
import { rsvpButtonSx } from "@/components/RsvpDialog";

function nameLabel(p) {
  return `${p.firstName} ${p.lastInitial}.`;
}

function NameFields({ firstName, lastInitial, setFirstName, setLastInitial }) {
  return (
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
  );
}

function BringDialog({ eventId, slot, onClose, onSuccess }) {
  const isCustom = !slot;
  const [firstName, setFirstName] = React.useState("");
  const [lastInitial, setLastInitial] = React.useState("");
  const [category, setCategory] = React.useState("food");
  const [item, setItem] = React.useState("");
  const [detail, setDetail] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/events/${eventId}/coordination`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: "contribution",
          slot: slot?.id || null,
          category: slot?.category || category,
          item: isCustom ? item.trim() : detail.trim() || slot.label,
          quantity: 1,
          firstName,
          lastInitial,
          note: "",
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save.");
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 800, fontFamily: "var(--font-serif), Georgia, serif" }}>
        {isCustom ? "I'll bring something" : `I'll bring ${slot.label}`}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {isCustom ? (
              <TextField
                label="What are you bringing?"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                required
                fullWidth
                autoFocus
                placeholder="e.g. Potato salad, ice, folding chairs"
                slotProps={{ htmlInput: { maxLength: 120 } }}
              />
            ) : null}
            <NameFields
              firstName={firstName}
              lastInitial={lastInitial}
              setFirstName={setFirstName}
              setLastInitial={setLastInitial}
            />
            {isCustom ? (
              <Box>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#666", mb: 1 }}>
                  Type
                </Typography>
                <ToggleButtonGroup
                  exclusive
                  value={category}
                  onChange={(_e, val) => val && setCategory(val)}
                  fullWidth
                  size="small"
                >
                  {BRING_CATEGORIES.map((c) => (
                    <ToggleButton
                      key={c}
                      value={c}
                      aria-label={CATEGORY_META[c].label}
                      sx={{ flex: 1, fontSize: "0.75rem", py: 1 }}
                    >
                      {CATEGORY_META[c].emoji}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Box>
            ) : (
              <TextField
                label="Details (optional)"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
                fullWidth
                placeholder={`e.g. specific type of ${slot.label.toLowerCase()}`}
                slotProps={{ htmlInput: { maxLength: 120 } }}
              />
            )}
            {error ? <Alert severity="error">{error}</Alert> : null}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} color="inherit" disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} sx={rsvpButtonSx}>
            {submitting ? "Saving…" : "Done"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

function RideDialog({ eventId, type, onClose, onSuccess }) {
  const isOffer = type === "offer";
  const [firstName, setFirstName] = React.useState("");
  const [lastInitial, setLastInitial] = React.useState("");
  const [area, setArea] = React.useState("");
  const [seats, setSeats] = React.useState(1);
  const [time, setTime] = React.useState("");
  const [contact, setContact] = React.useState("");
  const [note, setNote] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(`/api/events/${eventId}/coordination`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          kind: "ride",
          type,
          area,
          seats,
          time,
          contact,
          note,
          firstName,
          lastInitial,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save.");
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 800, fontFamily: "var(--font-serif), Georgia, serif" }}>
        {isOffer ? "Offer a ride" : "Request a ride"}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <NameFields
              firstName={firstName}
              lastInitial={lastInitial}
              setFirstName={setFirstName}
              setLastInitial={setLastInitial}
            />
            <TextField
              label={isOffer ? "Leaving from (area)" : "Your area"}
              value={area}
              onChange={(e) => setArea(e.target.value)}
              fullWidth
              placeholder="e.g. Riverside / North side"
              slotProps={{ htmlInput: { maxLength: 120 } }}
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label={isOffer ? "Seats available" : "Seats needed"}
                type="number"
                value={seats}
                onChange={(e) => setSeats(e.target.value)}
                fullWidth
                slotProps={{ htmlInput: { min: isOffer ? 1 : 1, max: 20 } }}
              />
              <TextField
                label="Time (optional)"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                fullWidth
                placeholder="e.g. 8:30 AM"
                slotProps={{ htmlInput: { maxLength: 60 } }}
              />
            </Stack>
            <TextField
              label="Contact (phone or email)"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              fullWidth
              slotProps={{ htmlInput: { maxLength: 200 } }}
              helperText="Shared privately with the organizer to connect you — never shown publicly."
            />
            <TextField
              label="Note (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              fullWidth
              multiline
              minRows={2}
              slotProps={{ htmlInput: { maxLength: 300 } }}
            />
            {error ? <Alert severity="error">{error}</Alert> : null}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} color="inherit" disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={submitting} sx={rsvpButtonSx}>
            {submitting ? "Saving…" : isOffer ? "Offer ride" : "Request ride"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

const panelSx = {
  p: { xs: 2.5, md: 3.5 },
  borderRadius: 4,
  background:
    "linear-gradient(135deg, rgba(255,107,53,0.06) 0%, rgba(255,215,125,0.12) 100%)",
  border: "1px solid #ffe3c4",
};

const embeddedTitleSx = {
  fontSize: "1.1rem",
  fontWeight: 800,
  color: "#1d1d1d",
  letterSpacing: "0.02em",
};

const sectionTitleSx = {
  fontFamily: "var(--font-serif), Georgia, serif",
  fontSize: { xs: "1.5rem", md: "1.85rem" },
  fontWeight: 800,
  color: "#1d1d1d",
};

const listSx = {
  borderRadius: 2,
  background: "#fff",
  border: "1px solid #e8e8e8",
  overflow: "hidden",
};

const rowSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2,
  px: 2,
  py: 1.5,
  borderBottom: "1px solid #f0f0f0",
  "&:last-child": { borderBottom: "none" },
};

function slotRemaining(slot, claims) {
  const claimed = claims.reduce((sum, c) => sum + (c.quantity || 1), 0);
  return Math.max((slot.quantity || 1) - claimed, 0);
}

function takenLabel(contribution, slotLabel) {
  const name = nameLabel(contribution);
  const item = slotLabel || contribution.item || "Something";
  const extra =
    contribution.item && slotLabel && contribution.item !== slotLabel
      ? ` (${contribution.item})`
      : "";
  const note = contribution.note ? ` — ${contribution.note}` : "";
  return `${item}${extra} · ${name}${note}`;
}

function buildPotluckRows(bringSlots, contributions) {
  const open = [];
  const taken = [];

  for (const slot of bringSlots) {
    const claims = contributions.filter((c) => c.slot === slot.id);
    const remaining = slotRemaining(slot, claims);
    if (remaining > 0) {
      open.push({
        key: `open-${slot.id}`,
        label: slot.label,
        hint:
          remaining > 1 ? `${remaining} spots open` : "Open",
        slot,
      });
    }
    for (const c of claims) {
      taken.push({
        key: c.id,
        label: takenLabel(c, slot.label),
      });
    }
  }

  for (const c of contributions.filter((x) => !x.slot)) {
    taken.push({
      key: c.id,
      label: takenLabel(c, null),
    });
  }

  return { open, taken };
}

function PotluckList({ bringSlots, contributions, onPickSlot, disabled }) {
  const { open, taken } = buildPotluckRows(bringSlots, contributions);

  if (open.length === 0 && taken.length === 0) {
    return (
      <Typography sx={{ color: "#777", fontSize: "0.95rem" }}>
        {disabled ? "Nothing signed up yet." : "Nothing on the list yet."}
      </Typography>
    );
  }

  return (
    <Box sx={listSx}>
      {open.map((row) => (
        <Box key={row.key} sx={rowSx}>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 700, color: "#1d1d1d" }}>{row.label}</Typography>
            <Typography sx={{ fontSize: "0.85rem", color: "#c43c68" }}>{row.hint}</Typography>
          </Box>
          {!disabled ? (
            <Button
              size="small"
              variant="contained"
              onClick={() => onPickSlot(row.slot)}
              sx={{ ...rsvpButtonSx, flexShrink: 0, px: 2, py: 0.75, fontSize: "0.8rem" }}
            >
              I&rsquo;ll bring this
            </Button>
          ) : null}
        </Box>
      ))}
      {taken.map((row) => (
        <Box key={row.key} sx={rowSx}>
          <Typography sx={{ fontSize: "0.95rem", color: "#2e9e6b", fontWeight: 600 }}>
            ✓ {row.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function RideBlock({ title, rides, actionLabel, onAction, disabled, emptyText }) {
  return (
    <Box sx={{ ...listSx, flex: 1, minWidth: 0 }}>
      <Box sx={{ ...rowSx, background: "#fafafa", borderBottom: "1px solid #eee" }}>
        <Typography sx={{ fontWeight: 800, color: "#1d1d1d" }}>{title}</Typography>
        <Typography sx={{ fontSize: "0.85rem", color: "#888", fontWeight: 600 }}>
          {rides.length} {rides.length === 1 ? "person" : "people"}
        </Typography>
      </Box>
      {rides.length === 0 ? (
        <Box sx={{ px: 2, py: 2 }}>
          <Typography sx={{ color: "#888", fontSize: "0.9rem", mb: disabled ? 0 : 1.5 }}>
            {emptyText}
          </Typography>
          {!disabled ? (
            <Button
              fullWidth
              variant="outlined"
              onClick={onAction}
              sx={{ fontWeight: 700, color: "#c43c68", borderColor: "#ffd9b8" }}
            >
              {actionLabel}
            </Button>
          ) : null}
        </Box>
      ) : (
        <>
          {rides.map((r) => (
            <Box key={r.id} sx={rowSx}>
              <Box>
                <Typography sx={{ fontWeight: 700 }}>{nameLabel(r)}</Typography>
                <Typography sx={{ fontSize: "0.85rem", color: "#666" }}>
                  {r.seats} seat{r.seats === 1 ? "" : "s"}
                  {[r.area, r.time].filter(Boolean).length
                    ? ` · ${[r.area, r.time].filter(Boolean).join(" · ")}`
                    : ""}
                  {r.note ? ` — ${r.note}` : ""}
                </Typography>
              </Box>
            </Box>
          ))}
          {!disabled ? (
            <Box sx={{ px: 2, py: 1.5, borderTop: "1px solid #f0f0f0" }}>
              <Button
                fullWidth
                size="small"
                onClick={onAction}
                sx={{ fontWeight: 700, color: "#c43c68" }}
              >
                {actionLabel}
              </Button>
            </Box>
          ) : null}
        </>
      )}
    </Box>
  );
}

export default function CoordinationBoard({ event, initial, embedded = false }) {
  const [data, setData] = React.useState(
    initial || { bringSlots: [], contributions: [], rides: { offers: [], requests: [] } },
  );
  const [bringDialog, setBringDialog] = React.useState(null); // { slot } | { slot: null }
  const [rideDialog, setRideDialog] = React.useState(null); // "offer" | "request"
  const isPast = new Date(event.eventDate) < new Date();

  const refresh = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/events/${event._id}/coordination`, { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      setData({
        bringSlots: json.bringSlots || [],
        contributions: json.contributions || [],
        rides: json.rides || { offers: [], requests: [] },
      });
    } catch {
      /* ignore transient fetch errors */
    }
  }, [event._id]);

  const { bringSlots, contributions, rides } = data;

  const titleSx = embedded ? embeddedTitleSx : sectionTitleSx;
  const outerSx = embedded ? {} : { ...panelSx };

  return (
    <Box sx={outerSx}>
      <Typography sx={{ ...titleSx, mb: 0.5 }}>What to bring</Typography>
      <Typography sx={{ color: "#666", fontSize: "0.9rem", mb: 2 }}>
        Tap <strong>I&rsquo;ll bring this</strong> on anything that&rsquo;s still open.
      </Typography>

      <PotluckList
        bringSlots={bringSlots}
        contributions={contributions}
        onPickSlot={(slot) => setBringDialog({ slot })}
        disabled={isPast}
      />

      {!isPast ? (
        <Button
          fullWidth
          variant="text"
          onClick={() => setBringDialog({ slot: null })}
          sx={{ mt: 1.5, fontWeight: 700, color: "#c43c68" }}
        >
          + Something not on the list
        </Button>
      ) : null}

      <Divider sx={{ my: 3 }} />

      <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 0.5 }}>
        <DirectionsCarIcon sx={{ color: "#c43c68", fontSize: "1.25rem" }} />
        <Typography sx={titleSx}>Carpool</Typography>
      </Stack>
      <Typography sx={{ color: "#666", fontSize: "0.9rem", mb: 2 }}>
        Need a ride or have extra seats? Sign up — the organizer will connect you privately.
      </Typography>
      <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
        <RideBlock
          title="Drivers"
          rides={rides.offers}
          actionLabel="Offer a ride"
          onAction={() => setRideDialog("offer")}
          disabled={isPast}
          emptyText="No drivers signed up yet."
        />
        <RideBlock
          title="Need a ride"
          rides={rides.requests}
          actionLabel="Request a ride"
          onAction={() => setRideDialog("request")}
          disabled={isPast}
          emptyText="No ride requests yet."
        />
      </Stack>

      {bringDialog ? (
        <BringDialog
          eventId={event._id}
          slot={bringDialog.slot}
          onClose={() => setBringDialog(null)}
          onSuccess={refresh}
        />
      ) : null}
      {rideDialog ? (
        <RideDialog
          eventId={event._id}
          type={rideDialog}
          onClose={() => setRideDialog(null)}
          onSuccess={refresh}
        />
      ) : null}
    </Box>
  );
}
