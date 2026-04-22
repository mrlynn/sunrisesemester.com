"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import MarkdownContent from "@/components/MarkdownContent";

function HeaderBanner() {
  const { scrollY } = useScroll();
  const sunY = useTransform(scrollY, [0, 400], [0, -120]);
  const skyFade = useTransform(scrollY, [0, 300], [1, 0.6]);

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: { xs: 300, md: 380 },
        display: "flex",
        alignItems: "center",
        isolation: "isolate",
      }}
    >
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          opacity: skyFade,
          background:
            "linear-gradient(180deg, #1a1a3e 0%, #2d1b4e 18%, #5b2c6f 38%, #c43c68 60%, #ff6b35 82%, #ffa751 100%)",
          zIndex: -3,
        }}
        animate={{
          background: [
            "linear-gradient(180deg, #1a1a3e 0%, #2d1b4e 18%, #5b2c6f 38%, #c43c68 60%, #ff6b35 82%, #ffa751 100%)",
            "linear-gradient(180deg, #2d1b4e 0%, #5b2c6f 18%, #c43c68 38%, #ff6b35 60%, #ffa751 82%, #ffd89b 100%)",
            "linear-gradient(180deg, #1a1a3e 0%, #2d1b4e 18%, #5b2c6f 38%, #c43c68 60%, #ff6b35 82%, #ffa751 100%)",
          ],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Radial glow */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 15% 60%, rgba(255,215,125,0.35) 0%, rgba(255,107,53,0.15) 30%, transparent 55%)",
          zIndex: -2,
        }}
      />

      {/* Sun */}
      <motion.div
        style={{
          position: "absolute",
          left: "-60px",
          top: "60%",
          y: sunY,
          transform: "translateY(-50%)",
          zIndex: -1,
          opacity: 0.85,
        }}
      >
        <svg
          width="280"
          height="280"
          viewBox="0 0 280 280"
          style={{ filter: "drop-shadow(0 0 50px rgba(255,180,80,0.6))" }}
        >
          <defs>
            <radialGradient id="eventsSun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff4d6" />
              <stop offset="55%" stopColor="#ffd89b" />
              <stop offset="100%" stopColor="#ff6b35" />
            </radialGradient>
          </defs>
          <motion.g
            animate={{ rotate: -360 }}
            transition={{ duration: 160, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "140px 140px" }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <rect
                key={i}
                x="138"
                y="18"
                width="4"
                height="34"
                fill="#fff4d6"
                opacity="0.5"
                transform={`rotate(${i * 45} 140 140)`}
              />
            ))}
          </motion.g>
          <circle cx="140" cy="140" r="70" fill="url(#eventsSun)" />
        </svg>
      </motion.div>

      <Container maxWidth="md" sx={{ position: "relative", zIndex: 2, py: { xs: 6, md: 8 } }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontSize: { xs: "0.75rem", md: "0.9rem" },
              color: "#ffd89b",
              mb: 2,
              textShadow: "0 2px 12px rgba(0,0,0,0.5)",
            }}
          >
            ✦ Announcements ✦
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.75rem", sm: "4rem", md: "5rem" },
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              background: "linear-gradient(180deg, #ffffff 0%, #ffd89b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mb: 2,
            }}
          >
            Events.
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "1.05rem", md: "1.25rem" },
              color: "rgba(255,255,255,0.92)",
              maxWidth: 520,
              textShadow: "0 2px 12px rgba(0,0,0,0.35)",
            }}
          >
            What&rsquo;s coming up in the Sunrise Semester community.
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
}

function EventCard({ ev, index, past }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          background: "#ffffff",
          border: "1px solid #eeeeee",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          opacity: past ? 0.65 : 1,
          transition: "transform 0.4s ease, box-shadow 0.4s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: past
              ? "linear-gradient(90deg, #aaaaaa, #cccccc)"
              : "linear-gradient(90deg, #ff6b35 0%, #ffa751 60%, #ffd89b 100%)",
          },
        }}
      >
        {ev.flyerImage ? (
          <Box
            component="img"
            src={ev.flyerImage}
            alt={ev.title}
            sx={{
              width: "100%",
              maxHeight: 400,
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : null}

        <Box sx={{ p: { xs: 3, md: 4 } }}>
          {/* Date badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 1.5,
              py: 0.5,
              borderRadius: 8,
              background: past
                ? "rgba(0,0,0,0.06)"
                : "linear-gradient(90deg, rgba(255,107,53,0.12), rgba(255,167,81,0.12))",
              mb: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: past ? "#888888" : "#ff6b35",
              }}
            >
              {new Date(ev.eventDate).toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
              {ev.location ? ` · ${ev.location}` : ""}
            </Typography>
          </Box>

          <Typography
            component="h2"
            sx={{
              fontSize: { xs: "1.6rem", md: "2rem" },
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#1d1d1d",
              fontFamily: "var(--font-serif), Georgia, serif",
              mb: ev.body ? 2 : 0,
            }}
          >
            {ev.title}
          </Typography>

          {ev.body ? (
            <Box sx={{ mt: 1 }}>
              <MarkdownContent markdown={ev.body} />
            </Box>
          ) : null}
        </Box>
      </Box>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box
        sx={{
          p: { xs: 4, md: 6 },
          textAlign: "center",
          borderRadius: 4,
          background:
            "linear-gradient(135deg, rgba(255,107,53,0.05) 0%, rgba(255,215,125,0.1) 100%)",
          border: "1px dashed #ffa751",
        }}
      >
        <Typography
          sx={{
            fontFamily: "var(--font-serif), Georgia, serif",
            fontSize: { xs: "1.5rem", md: "1.75rem" },
            fontWeight: 700,
            color: "#2c2c2c",
            mb: 1.5,
          }}
        >
          Nothing scheduled yet — check back soon.
        </Typography>
        <Typography sx={{ color: "#666666", maxWidth: 480, mx: "auto" }}>
          Events and announcements will be posted here when available.
        </Typography>
      </Box>
    </motion.div>
  );
}

export default function EventsPage({ events }) {
  const now = new Date();
  const upcoming = events.filter((e) => new Date(e.eventDate) >= now);
  const past = events.filter((e) => new Date(e.eventDate) < now);

  return (
    <Box>
      <HeaderBanner />
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        {events.length === 0 ? (
          <EmptyState />
        ) : (
          <Stack spacing={4}>
            {upcoming.map((ev, i) => (
              <EventCard key={String(ev._id)} ev={ev} index={i} />
            ))}

            {past.length > 0 ? (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography
                  variant="h5"
                  fontWeight={700}
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Past events
                </Typography>
                {past.map((ev, i) => (
                  <EventCard key={String(ev._id)} ev={ev} index={i} past />
                ))}
              </>
            ) : null}
          </Stack>
        )}
      </Container>
    </Box>
  );
}
