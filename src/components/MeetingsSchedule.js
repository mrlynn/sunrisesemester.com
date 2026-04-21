"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Snackbar from "@mui/material/Snackbar";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import VideocamIcon from "@mui/icons-material/Videocam";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CheckIcon from "@mui/icons-material/Check";

const ZOOM_ID = "917964988";
const ZOOM_URL = `https://zoom.us/j/${ZOOM_ID}`;

const meetings = [
  {
    id: "weekdays",
    label: "Monday – Friday",
    shortLabel: "M–F",
    title: "Daily Sunrise",
    time: "7:15 – 8:15 AM",
    blurb: "Start every weekday in fellowship. One hour of open discussion to set the tone of the day.",
    gradient: "linear-gradient(135deg, #ff6b35 0%, #ffa751 60%, #ffd89b 100%)",
    accent: "#ff6b35",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  },
  {
    id: "saturday-men",
    label: "Saturday",
    shortLabel: "Sat",
    title: "Men's Meeting",
    time: "8:00 – 9:15 AM",
    blurb: "Men of the group gather to share experience, strength, and hope.",
    gradient: "linear-gradient(135deg, #5b2c6f 0%, #c43c68 60%, #ff6b35 100%)",
    accent: "#c43c68",
    days: ["Sat"],
  },
  {
    id: "saturday-women",
    label: "Saturday",
    shortLabel: "Sat",
    title: "Women's Meeting",
    time: "9:30 AM",
    blurb: "Women of the group meet immediately after the men's meeting.",
    gradient: "linear-gradient(135deg, #2d1b4e 0%, #5b2c6f 50%, #c43c68 100%)",
    accent: "#5b2c6f",
    days: ["Sat"],
  },
  {
    id: "sunday",
    label: "Sunday",
    shortLabel: "Sun",
    title: "Sunday Morning",
    time: "8:00 – 9:00 AM",
    blurb: "Close the week the way we started it — together, in the light.",
    gradient: "linear-gradient(135deg, #c43c68 0%, #ff6b35 50%, #ffa751 100%)",
    accent: "#ff8555",
    days: ["Sun"],
  },
];

function useCopy() {
  const [copied, setCopied] = React.useState(false);
  const copy = React.useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, []);
  return { copied, copy, reset: () => setCopied(false) };
}

function HeaderBanner() {
  const { scrollY } = useScroll();
  const sunY = useTransform(scrollY, [0, 400], [0, -120]);
  const skyFade = useTransform(scrollY, [0, 300], [1, 0.6]);

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: { xs: 280, md: 360 },
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
            "linear-gradient(180deg, #1a1a3e 0%, #2d1b4e 20%, #5b2c6f 40%, #c43c68 65%, #ff6b35 85%, #ffa751 100%)",
          zIndex: -3,
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
      <motion.div
        style={{
          position: "absolute",
          right: { xs: "-80px", md: "-40px" },
          top: "50%",
          y: sunY,
          transform: "translateY(-50%)",
          zIndex: -1,
        }}
      >
        <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          style={{ filter: "drop-shadow(0 0 60px rgba(255, 180, 80, 0.7))" }}
        >
          <defs>
            <radialGradient id="meetingSun" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff4d6" />
              <stop offset="50%" stopColor="#ffd89b" />
              <stop offset="100%" stopColor="#ff6b35" />
            </radialGradient>
          </defs>
          <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 140, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "160px 160px" }}
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <rect
                key={i}
                x="158"
                y="20"
                width="4"
                height="40"
                fill="#fff4d6"
                opacity="0.55"
                transform={`rotate(${i * 36} 160 160)`}
              />
            ))}
          </motion.g>
          <circle cx="160" cy="160" r="80" fill="url(#meetingSun)" />
          <motion.circle
            cx="160"
            cy="160"
            fill="#fff4d6"
            initial={{ r: 60, opacity: 0.85 }}
            animate={{ r: [55, 65, 55], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
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
              fontFamily: '"Inter", sans-serif',
              fontWeight: 700,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontSize: { xs: "0.75rem", md: "0.9rem" },
              color: "#ffd89b",
              mb: 2,
              textShadow: "0 2px 12px rgba(0,0,0,0.5)",
            }}
          >
            ✦ Meeting Schedule ✦
          </Typography>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: "2.75rem", sm: "4rem", md: "5rem" },
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              color: "#ffffff",
              textShadow: "0 4px 30px rgba(0,0,0,0.4)",
              background: "linear-gradient(180deg, #ffffff 0%, #ffd89b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mb: 2,
            }}
          >
            When we meet.
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "1.05rem", md: "1.25rem" },
              color: "rgba(255,255,255,0.92)",
              maxWidth: 560,
              textShadow: "0 2px 12px rgba(0,0,0,0.35)",
            }}
          >
            Every meeting is held on Zoom. Join from anywhere — coffee in hand, sunrise
            optional.
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
}

function ZoomCard({ onCopy, copied }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          p: { xs: 3, md: 5 },
          background:
            "linear-gradient(135deg, #2d1b4e 0%, #5b2c6f 40%, #c43c68 80%, #ff6b35 100%)",
          color: "#ffffff",
          boxShadow: "0 20px 60px rgba(91, 44, 111, 0.35)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 85% 20%, rgba(255, 215, 125, 0.35) 0%, transparent 55%)",
            pointerEvents: "none",
          }}
        />
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 3, md: 4 }}
          sx={{
            position: "relative",
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: "center" }}>
              <VideocamIcon sx={{ color: "#ffd89b" }} />
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: "#ffd89b",
                }}
              >
                Join on Zoom
              </Typography>
            </Stack>
            <Typography
              sx={{
                fontSize: { xs: "0.9rem", md: "1rem" },
                color: "rgba(255,255,255,0.8)",
                mb: 0.5,
              }}
            >
              Meeting ID
            </Typography>
            <Typography
              component="div"
              sx={{
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                fontSize: { xs: "2.5rem", md: "3.25rem" },
                fontWeight: 800,
                letterSpacing: "0.05em",
                lineHeight: 1,
                color: "#ffffff",
                textShadow: "0 2px 20px rgba(0,0,0,0.3)",
              }}
            >
              917 964 988
            </Typography>
          </Box>
          <Stack spacing={1.5} sx={{ width: { xs: "100%", md: "auto" } }}>
            <Button
              href={ZOOM_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              size="large"
              startIcon={<VideocamIcon />}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 8,
                fontWeight: 700,
                fontSize: "1rem",
                textTransform: "none",
                background: "linear-gradient(135deg, #fff4d6 0%, #ffd89b 100%)",
                color: "#2d1b4e",
                boxShadow: "0 6px 24px rgba(255, 215, 125, 0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #ffffff 0%, #ffd89b 100%)",
                  boxShadow: "0 8px 32px rgba(255, 215, 125, 0.55)",
                },
              }}
            >
              Open Zoom
            </Button>
            <Button
              onClick={() => onCopy(ZOOM_ID)}
              variant="outlined"
              size="large"
              startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
              sx={{
                py: 1.5,
                px: 4,
                borderRadius: 8,
                fontWeight: 700,
                fontSize: "0.95rem",
                textTransform: "none",
                color: "#ffffff",
                borderColor: "rgba(255,255,255,0.5)",
                borderWidth: "2px",
                "&:hover": {
                  borderColor: "#ffffff",
                  borderWidth: "2px",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              {copied ? "Copied!" : "Copy ID"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </motion.div>
  );
}

function MeetingCard({ meeting, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: 4,
          p: { xs: 3, md: 4 },
          minHeight: { xs: "auto", md: 220 },
          background: "#ffffff",
          border: "1px solid #eeeeee",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
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
            background: meeting.gradient,
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: meeting.gradient,
            opacity: 0.1,
            filter: "blur(30px)",
          }}
        />
        <Stack spacing={2.5} sx={{ position: "relative" }}>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {meeting.days.map((d) => (
              <Chip
                key={d}
                label={d}
                size="small"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  background: meeting.gradient,
                  color: "#ffffff",
                  border: "none",
                }}
              />
            ))}
          </Stack>
          <Box>
            <Typography
              sx={{
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: meeting.accent,
                mb: 0.5,
              }}
            >
              {meeting.label}
            </Typography>
            <Typography
              component="h3"
              sx={{
                fontSize: { xs: "1.75rem", md: "2rem" },
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#1d1d1d",
                fontFamily: 'var(--font-serif), Georgia, serif',
                mb: 1.5,
              }}
            >
              {meeting.title}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: "center" }}>
              <ScheduleIcon sx={{ fontSize: 20, color: meeting.accent }} />
              <Typography
                sx={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#2c2c2c",
                  letterSpacing: "0.02em",
                }}
              >
                {meeting.time}
              </Typography>
            </Stack>
            <Typography sx={{ color: "#555555", lineHeight: 1.6, fontSize: "0.95rem" }}>
              {meeting.blurb}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </motion.div>
  );
}

export default function MeetingsSchedule() {
  const { copied, copy, reset } = useCopy();

  return (
    <Box>
      <HeaderBanner />
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={{ xs: 5, md: 7 }}>
          <ZoomCard onCopy={copy} copied={copied} />
          <Box>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "2.75rem" },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: "#1d1d1d",
                  fontFamily: 'var(--font-serif), Georgia, serif',
                  mb: 1,
                }}
              >
                Weekly rhythm.
              </Typography>
              <Typography
                sx={{
                  fontSize: "1.05rem",
                  color: "#666666",
                  mb: 4,
                  maxWidth: 520,
                }}
              >
                Four meetings that shape the week. All times are Eastern; all meetings use
                the same Zoom.
              </Typography>
            </motion.div>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                gap: { xs: 2.5, md: 3 },
              }}
            >
              {meetings.map((m, i) => (
                <MeetingCard key={m.id} meeting={m} index={i} />
              ))}
            </Box>
          </Box>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box
              sx={{
                textAlign: "center",
                py: 4,
                borderTop: "1px solid #eeeeee",
                borderBottom: "1px solid #eeeeee",
              }}
            >
              <Typography
                sx={{
                  fontFamily: 'var(--font-serif), Georgia, serif',
                  fontStyle: "italic",
                  fontSize: { xs: "1.1rem", md: "1.35rem" },
                  color: "#2c2c2c",
                  lineHeight: 1.6,
                  maxWidth: 620,
                  mx: "auto",
                }}
              >
                &ldquo;Newcomers are the lifeblood of this program. If you&rsquo;re thinking
                about coming — just come. The link is right above.&rdquo;
              </Typography>
            </Box>
          </motion.div>
        </Stack>
      </Container>
      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={reset}
        message="Zoom ID copied to clipboard"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
