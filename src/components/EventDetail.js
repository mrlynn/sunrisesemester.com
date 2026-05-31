"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MarkdownContent from "@/components/MarkdownContent";
import RsvpDialog, { rsvpButtonSx } from "@/components/RsvpDialog";
import WhosComing from "@/components/WhosComing";
import CoordinationBoard from "@/components/CoordinationBoard";

function formatEventDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function DetailHeader({ event }) {
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 600], [0, 120]);
  const imgScale = useTransform(scrollY, [0, 600], [1, 1.12]);
  const hasImage = Boolean(event.flyerImage);

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: { xs: 360, md: 480 },
        display: "flex",
        alignItems: "flex-end",
        isolation: "isolate",
      }}
    >
      {hasImage ? (
        <motion.div style={{ position: "absolute", inset: 0, y: imgY, scale: imgScale, zIndex: -2 }}>
          <Box
            component="img"
            src={event.flyerImage}
            alt=""
            sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.35) 55%, rgba(0,0,0,0.72) 100%)",
            }}
          />
        </motion.div>
      ) : (
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: -2,
            background:
              "linear-gradient(180deg, #1a1a3e 0%, #2d1b4e 20%, #5b2c6f 40%, #c43c68 65%, #ff6b35 85%, #ffa751 100%)",
          }}
          animate={{
            background: [
              "linear-gradient(180deg, #1a1a3e 0%, #2d1b4e 20%, #5b2c6f 40%, #c43c68 65%, #ff6b35 85%, #ffa751 100%)",
              "linear-gradient(180deg, #2d1b4e 0%, #5b2c6f 20%, #c43c68 40%, #ff6b35 65%, #ffa751 85%, #ffd89b 100%)",
              "linear-gradient(180deg, #1a1a3e 0%, #2d1b4e 20%, #5b2c6f 40%, #c43c68 65%, #ff6b35 85%, #ffa751 100%)",
            ],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 2, py: { xs: 5, md: 7 } }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Button
            component={Link}
            href="/events"
            startIcon={<ArrowBackIcon />}
            sx={{ color: "rgba(255,255,255,0.92)", mb: 2, fontWeight: 600 }}
          >
            All events
          </Button>
          <Typography
            sx={{
              fontSize: { xs: "0.8rem", md: "0.92rem" },
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#ffd89b",
              textShadow: "0 2px 12px rgba(0,0,0,0.5)",
              mb: 1.5,
            }}
          >
            {formatEventDate(event.eventDate)}
            {event.location ? ` · ${event.location}` : ""}
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.4rem", sm: "3.2rem", md: "4rem" },
              fontWeight: 800,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              color: "#fff",
              textShadow: "0 2px 24px rgba(0,0,0,0.45)",
              fontFamily: "var(--font-serif), Georgia, serif",
            }}
          >
            {event.title}
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
}

export default function EventDetail({ event, initialAttendees = [], initialCoordination = null }) {
  const [rsvpOpen, setRsvpOpen] = React.useState(false);
  const [attendees, setAttendees] = React.useState(initialAttendees);
  const isPast = new Date(event.eventDate) < new Date();
  const headcount = attendees.reduce((sum, a) => sum + (a.partySize || 1), 0);
  const spotsRemaining =
    event.rsvpCapacity > 0 ? Math.max(event.rsvpCapacity - headcount, 0) : null;
  const isFull = spotsRemaining === 0;
  const showRsvp = !isPast && event.rsvpEnabled;
  const showWhosComing = event.rsvpEnabled;

  const refreshAttendees = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/events/${event._id}/rsvp`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setAttendees(Array.isArray(data.attendees) ? data.attendees : []);
    } catch {
      /* ignore transient fetch errors */
    }
  }, [event._id]);

  return (
    <Box>
      <DetailHeader event={event} />
      <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
        <Stack spacing={4}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "wrap", rowGap: 1.5 }}>
            {showRsvp ? (
              <Button onClick={() => setRsvpOpen(true)} disabled={isFull} sx={rsvpButtonSx}>
                {isFull ? "Event full" : "RSVP to this event"}
              </Button>
            ) : null}
            {showRsvp && spotsRemaining !== null ? (
              <Typography sx={{ fontSize: "0.9rem", color: "#888", fontWeight: 600 }}>
                {isFull
                  ? "No spots remaining"
                  : `${spotsRemaining} spot${spotsRemaining === 1 ? "" : "s"} remaining`}
              </Typography>
            ) : null}
            {event.hasFlyer ? (
              <Button
                component="a"
                href={`/api/events/${event._id}/flyer?download=1`}
                variant="outlined"
                sx={{
                  borderColor: "#ffa751",
                  color: "#c43c68",
                  fontWeight: 700,
                  "&:hover": { borderColor: "#ff6b35", background: "rgba(255,107,53,0.05)" },
                }}
              >
                Download flyer
              </Button>
            ) : null}
          </Stack>

          {event.body ? (
            <MarkdownContent markdown={event.body} />
          ) : (
            <Typography color="text.secondary">More details coming soon.</Typography>
          )}

          {showWhosComing ? <WhosComing attendees={attendees} /> : null}

          {event.coordinationEnabled ? (
            <CoordinationBoard event={event} initial={initialCoordination} />
          ) : null}
        </Stack>
      </Container>
      {showRsvp && rsvpOpen ? (
        <RsvpDialog
          onClose={() => setRsvpOpen(false)}
          event={event}
          onSuccess={refreshAttendees}
        />
      ) : null}
    </Box>
  );
}
