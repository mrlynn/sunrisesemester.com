"use client";

import * as React from "react";
import { motion } from "motion/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

const GRADIENTS = [
  "linear-gradient(135deg, #ff6b35 0%, #c43c68 100%)",
  "linear-gradient(135deg, #c43c68 0%, #5b2c6f 100%)",
  "linear-gradient(135deg, #ff8555 0%, #ffa751 100%)",
  "linear-gradient(135deg, #5b2c6f 0%, #2d1b4e 100%)",
  "linear-gradient(135deg, #ffa751 0%, #ff6b35 100%)",
  "linear-gradient(135deg, #d4556f 0%, #ff8555 100%)",
  "linear-gradient(135deg, #2d1b4e 0%, #c43c68 100%)",
  "linear-gradient(135deg, #ffd89b 0%, #ff6b35 100%)",
];

function gradientFor(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return GRADIENTS[hash % GRADIENTS.length];
}

function Avatar({ attendee, index }) {
  const initials = `${(attendee.firstName || "?").charAt(0)}${attendee.lastInitial || ""}`.toUpperCase();
  const label = `${attendee.firstName} ${attendee.lastInitial}.`;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index, 12) * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      <Stack spacing={0.75} sx={{ alignItems: "center", width: 76 }}>
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: gradientFor(label),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: 800,
              fontSize: "1.05rem",
              letterSpacing: "0.02em",
              boxShadow: "0 6px 18px rgba(196,60,104,0.28)",
              border: "2px solid #fff",
            }}
          >
            {initials}
          </Box>
          {attendee.partySize > 1 ? (
            <Box
              sx={{
                position: "absolute",
                bottom: -4,
                right: -6,
                minWidth: 22,
                height: 22,
                px: 0.5,
                borderRadius: 11,
                background: "#1d1d1d",
                color: "#ffd89b",
                fontSize: "0.7rem",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #fff",
              }}
            >
              +{attendee.partySize - 1}
            </Box>
          ) : null}
        </Box>
        <Typography
          sx={{
            fontSize: "0.78rem",
            fontWeight: 600,
            color: "#444",
            textAlign: "center",
            lineHeight: 1.1,
            maxWidth: 76,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </Typography>
      </Stack>
    </motion.div>
  );
}

export default function WhosComing({ attendees = [], embedded = false }) {
  const count = attendees.length;
  const headcount = attendees.reduce((sum, a) => sum + (a.partySize || 1), 0);
  const extraGuests = headcount - count;

  const titleSx = embedded
    ? {
        fontSize: "1.1rem",
        fontWeight: 800,
        color: "#1d1d1d",
        letterSpacing: "0.02em",
      }
    : {
        fontFamily: "var(--font-serif), Georgia, serif",
        fontSize: { xs: "1.5rem", md: "1.85rem" },
        fontWeight: 800,
        color: "#1d1d1d",
      };

  return (
    <Box
      sx={
        embedded
          ? {}
          : {
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              background:
                "linear-gradient(135deg, rgba(255,107,53,0.06) 0%, rgba(255,215,125,0.12) 100%)",
              border: "1px solid #ffe3c4",
            }
      }
    >
      <Stack
        direction="row"
        spacing={1.5}
        sx={{ alignItems: "baseline", flexWrap: "wrap", mb: count ? 3 : 1 }}
      >
        <Typography sx={titleSx}>Who&rsquo;s coming</Typography>
        {count ? (
          <Typography sx={{ fontWeight: 700, color: "#c43c68" }}>
            {headcount} {headcount === 1 ? "person" : "people"}
            {extraGuests > 0
              ? ` · ${count} ${count === 1 ? "RSVP" : "RSVPs"} +${extraGuests} guest${extraGuests === 1 ? "" : "s"}`
              : ""}
          </Typography>
        ) : null}
      </Stack>

      {count === 0 ? (
        <Typography sx={{ color: "#777" }}>
          No one has RSVP&rsquo;d yet — be the first to say you&rsquo;re coming.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: { xs: 1.5, md: 2 },
          }}
        >
          {attendees.map((a, i) => (
            <Avatar key={a.id || `${a.firstName}-${i}`} attendee={a} index={i} />
          ))}
        </Box>
      )}
    </Box>
  );
}
