"use client";

import * as React from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import { CATEGORY_META } from "@/lib/coordination";

function contactHref(contact) {
  const value = String(contact || "").trim();
  if (!value) return null;
  if (value.includes("@") && !value.includes(" ")) return `mailto:${value}`;
  const digits = value.replace(/[^\d+]/g, "");
  if (digits.length >= 7) return `tel:${digits}`;
  return null;
}

export default function AdminCoordinationManager({ eventId, initial }) {
  const [contributions, setContributions] = React.useState(initial?.contributions || []);
  const [offers, setOffers] = React.useState(initial?.rides?.offers || []);
  const [requests, setRequests] = React.useState(initial?.rides?.requests || []);
  const [busyId, setBusyId] = React.useState(null);

  async function remove(kind, itemId, apply) {
    setBusyId(itemId);
    try {
      const res = await fetch(
        `/api/admin/events/${eventId}/coordination?kind=${kind}&itemId=${itemId}`,
        { method: "DELETE" },
      );
      if (res.ok) apply();
    } finally {
      setBusyId(null);
    }
  }

  function Ride({ r, kind, onRemoved }) {
    const href = contactHref(r.contact);
    return (
      <Box sx={{ borderBottom: 1, borderColor: "divider", py: 1.25 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "flex-start" }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography sx={{ fontWeight: 600 }}>
              {r.firstName} {r.lastInitial}. · {r.seats} seat{r.seats === 1 ? "" : "s"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {[r.area, r.time].filter(Boolean).join(" · ") || "—"}
              {r.note ? ` — ${r.note}` : ""}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.25 }}>
              Contact:{" "}
              {r.contact ? (
                href ? (
                  <Link href={href}>{r.contact}</Link>
                ) : (
                  <strong>{r.contact}</strong>
                )
              ) : (
                <em style={{ color: "#999" }}>none given</em>
              )}
            </Typography>
          </Box>
          <IconButton
            aria-label="Remove"
            color="error"
            size="small"
            disabled={busyId === r.id}
            onClick={() => remove("ride", r.id, onRemoved)}
          >
            <DeleteOutlineIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Box>
    );
  }

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
        Potluck &amp; rides
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
        Who&rsquo;s bringing what
      </Typography>
      {contributions.length === 0 ? (
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Nothing claimed yet.
        </Typography>
      ) : (
        <Stack spacing={1} sx={{ mb: 3 }}>
          {contributions.map((c) => (
            <Stack
              key={c.id}
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", borderBottom: 1, borderColor: "divider", py: 1 }}
            >
              <Chip
                size="small"
                label={`${CATEGORY_META[c.category]?.emoji || ""} ${
                  CATEGORY_META[c.category]?.label || c.category
                }`}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={{ fontWeight: 600 }}>
                  {c.item || "Something"}
                  {c.quantity > 1 ? ` ×${c.quantity}` : ""}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {c.firstName} {c.lastInitial}.{c.note ? ` — ${c.note}` : ""}
                </Typography>
              </Box>
              <IconButton
                aria-label="Remove"
                color="error"
                size="small"
                disabled={busyId === c.id}
                onClick={() =>
                  remove("contribution", c.id, () =>
                    setContributions((list) => list.filter((x) => x.id !== c.id)),
                  )
                }
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      )}

      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            Offering rides ({offers.length})
          </Typography>
          {offers.length === 0 ? (
            <Typography color="text.secondary">No drivers yet.</Typography>
          ) : (
            offers.map((r) => (
              <Ride
                key={r.id}
                r={r}
                kind="offer"
                onRemoved={() => setOffers((list) => list.filter((x) => x.id !== r.id))}
              />
            ))
          )}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
            Needing rides ({requests.length})
          </Typography>
          {requests.length === 0 ? (
            <Typography color="text.secondary">No requests yet.</Typography>
          ) : (
            requests.map((r) => (
              <Ride
                key={r.id}
                r={r}
                kind="request"
                onRemoved={() => setRequests((list) => list.filter((x) => x.id !== r.id))}
              />
            ))
          )}
        </Box>
      </Stack>
    </Paper>
  );
}
