"use client";

import * as React from "react";
import { motion } from "motion/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
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
  const [firstName, setFirstName] = React.useState("");
  const [lastInitial, setLastInitial] = React.useState("");
  const [category, setCategory] = React.useState(slot?.category || "food");
  const [item, setItem] = React.useState(slot ? slot.label : "");
  const [quantity, setQuantity] = React.useState(1);
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
          kind: "contribution",
          slot: slot?.id || null,
          category,
          item,
          quantity,
          firstName,
          lastInitial,
          note,
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
        {slot ? `Bring: ${slot.label}` : "Add what you're bringing"}
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
            {!slot ? (
              <TextField
                select
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                fullWidth
              >
                {BRING_CATEGORIES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {CATEGORY_META[c].emoji} {CATEGORY_META[c].label}
                  </MenuItem>
                ))}
              </TextField>
            ) : null}
            <TextField
              label={slot ? "What exactly? (optional)" : "What are you bringing?"}
              value={item}
              onChange={(e) => setItem(e.target.value)}
              fullWidth
              required={!slot}
              placeholder={slot ? slot.label : "e.g. Potato salad"}
              slotProps={{ htmlInput: { maxLength: 120 } }}
            />
            <TextField
              label="How many / how much"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              fullWidth
              slotProps={{ htmlInput: { min: 1, max: 50 } }}
              helperText="e.g. 2 dozen, 1 tray — round to a number"
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
            {submitting ? "Saving…" : "I'll bring it"}
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

const sectionTitleSx = {
  fontFamily: "var(--font-serif), Georgia, serif",
  fontSize: { xs: "1.5rem", md: "1.85rem" },
  fontWeight: 800,
  color: "#1d1d1d",
};

function PersonChip({ children }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.75,
        px: 1.25,
        py: 0.5,
        borderRadius: 999,
        background: "#fff",
        border: "1px solid #ffd9b8",
        fontSize: "0.85rem",
        fontWeight: 600,
        color: "#444",
      }}
    >
      {children}
    </Box>
  );
}

function SlotRow({ slot, claims, onClaim, disabled }) {
  const claimed = claims.reduce((sum, c) => sum + (c.quantity || 1), 0);
  const pct = slot.quantity > 0 ? Math.min((claimed / slot.quantity) * 100, 100) : 0;
  const filled = claimed >= slot.quantity;
  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        background: "rgba(255,255,255,0.65)",
        border: "1px solid #ffe3c4",
      }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1 }}>
        <Typography sx={{ fontWeight: 700, color: "#1d1d1d", flexGrow: 1 }}>
          {slot.label}
        </Typography>
        <Chip
          size="small"
          label={`${claimed} / ${slot.quantity}`}
          sx={{
            fontWeight: 700,
            color: filled ? "#fff" : "#c43c68",
            background: filled ? "#2e9e6b" : "rgba(196,60,104,0.1)",
          }}
        />
        {!disabled ? (
          <Button size="small" onClick={() => onClaim(slot)} sx={{ fontWeight: 700, color: "#c43c68" }}>
            {filled ? "Add more" : "I'll bring this"}
          </Button>
        ) : null}
      </Stack>
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{
          height: 6,
          borderRadius: 3,
          mb: claims.length ? 1.5 : 0,
          backgroundColor: "rgba(0,0,0,0.06)",
          "& .MuiLinearProgress-bar": {
            background: "linear-gradient(90deg, #ff6b35, #c43c68)",
          },
        }}
      />
      {claims.length ? (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {claims.map((c) => (
            <PersonChip key={c.id}>
              {nameLabel(c)}
              {c.item && c.item !== slot.label ? ` · ${c.item}` : ""}
              {c.quantity > 1 ? ` ×${c.quantity}` : ""}
            </PersonChip>
          ))}
        </Box>
      ) : null}
    </Box>
  );
}

function RideColumn({ title, accent, rides, onAdd, addLabel, disabled, emptyText }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        p: 2.5,
        borderRadius: 3,
        background: "rgba(255,255,255,0.65)",
        border: "1px solid #ffe3c4",
      }}
    >
      <Stack direction="row" sx={{ alignItems: "center", mb: 1.5 }} spacing={1}>
        <Typography sx={{ fontWeight: 800, color: accent, flexGrow: 1 }}>{title}</Typography>
        {!disabled ? (
          <Button size="small" onClick={onAdd} sx={{ fontWeight: 700, color: "#c43c68" }}>
            {addLabel}
          </Button>
        ) : null}
      </Stack>
      {rides.length === 0 ? (
        <Typography sx={{ color: "#888", fontSize: "0.9rem" }}>{emptyText}</Typography>
      ) : (
        <Stack spacing={1.25}>
          {rides.map((r) => (
            <Box key={r.id} sx={{ borderBottom: "1px solid #ffe3c4", pb: 1.25 }}>
              <Typography sx={{ fontWeight: 700, color: "#1d1d1d" }}>
                {nameLabel(r)}
                <Box component="span" sx={{ color: "#c43c68", fontWeight: 700 }}>
                  {" "}
                  · {r.seats} seat{r.seats === 1 ? "" : "s"}
                </Box>
              </Typography>
              <Typography sx={{ fontSize: "0.85rem", color: "#666" }}>
                {[r.area, r.time].filter(Boolean).join(" · ")}
                {r.note ? `${r.area || r.time ? " — " : ""}${r.note}` : ""}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default function CoordinationBoard({ event, initial }) {
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
  const extrasByCategory = (cat) =>
    contributions.filter((c) => !c.slot && c.category === cat);
  const claimsForSlot = (slotId) => contributions.filter((c) => c.slot === slotId);

  const activeCategories = BRING_CATEGORIES.filter(
    (cat) =>
      bringSlots.some((s) => s.category === cat) || extrasByCategory(cat).length > 0,
  );
  const hasAnyBring = bringSlots.length > 0 || contributions.length > 0;

  return (
    <Box sx={panelSx}>
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: "baseline", flexWrap: "wrap", rowGap: 1, mb: 2.5 }}
      >
        <Typography sx={sectionTitleSx}>Bring something</Typography>
        {!isPast ? (
          <Button onClick={() => setBringDialog({ slot: null })} sx={{ fontWeight: 700, color: "#c43c68" }}>
            + Add what you&rsquo;re bringing
          </Button>
        ) : null}
      </Stack>

      {!hasAnyBring ? (
        <Typography sx={{ color: "#777", mb: 1 }}>
          Nothing on the list yet
          {isPast ? "." : " — be the first to add what you'll bring."}
        </Typography>
      ) : (
        <Stack spacing={3}>
          {activeCategories.map((cat) => {
            const slots = bringSlots.filter((s) => s.category === cat);
            const extras = extrasByCategory(cat);
            return (
              <Box key={cat}>
                <Typography
                  sx={{
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontSize: "0.8rem",
                    color: "#a85",
                    mb: 1.25,
                  }}
                >
                  {CATEGORY_META[cat].emoji} {CATEGORY_META[cat].label}
                </Typography>
                <Stack spacing={1.5}>
                  {slots.map((slot) => (
                    <SlotRow
                      key={slot.id}
                      slot={slot}
                      claims={claimsForSlot(slot.id)}
                      onClaim={(s) => setBringDialog({ slot: s })}
                      disabled={isPast}
                    />
                  ))}
                  {extras.length ? (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {extras.map((c) => (
                        <PersonChip key={c.id}>
                          {c.item || "Something"}
                          {c.quantity > 1 ? ` ×${c.quantity}` : ""} · {nameLabel(c)}
                        </PersonChip>
                      ))}
                    </Box>
                  ) : null}
                </Stack>
              </Box>
            );
          })}
        </Stack>
      )}

      <Box sx={{ mt: 4 }}>
        <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", mb: 2.5 }}>
          <DirectionsCarIcon sx={{ color: "#c43c68" }} />
          <Typography sx={sectionTitleSx}>Rides</Typography>
        </Stack>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <RideColumn
            title="Can offer a ride"
            accent="#2e9e6b"
            rides={rides.offers}
            onAdd={() => setRideDialog("offer")}
            addLabel="+ Offer"
            disabled={isPast}
            emptyText="No drivers yet — offer a ride if you have room."
          />
          <RideColumn
            title="Need a ride"
            accent="#c43c68"
            rides={rides.requests}
            onAdd={() => setRideDialog("request")}
            addLabel="+ Request"
            disabled={isPast}
            emptyText="No one needs a ride yet."
          />
        </Stack>
        {!isPast && (rides.offers.length > 0 || rides.requests.length > 0) ? (
          <Typography sx={{ mt: 1.5, fontSize: "0.82rem", color: "#999" }}>
            Contact details stay private with the organizer, who&rsquo;ll connect drivers and
            riders.
          </Typography>
        ) : null}
      </Box>

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
