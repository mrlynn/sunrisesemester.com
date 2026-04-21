"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import VideocamIcon from "@mui/icons-material/Videocam";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const ZOOM_ID = "917964988";
const ZOOM_URL = `https://zoom.us/j/${ZOOM_ID}`;

const SELF_TEST = [
  "Have you ever decided to stop drinking for a week or so, but only lasted for a couple of days?",
  "Do you wish people would mind their own business about your drinking — stop telling you what to do?",
  "Have you ever switched from one kind of drink to another in the hope that this would keep you from getting drunk?",
  "Have you had to have an eye-opener upon awakening during the past year?",
  "Do you envy people who can drink without getting into trouble?",
  "Have you had problems connected with drinking during the past year?",
  "Has your drinking caused trouble at home?",
  "Do you ever try to get extra drinks at a party because you do not get enough?",
  "Do you tell yourself you can stop drinking any time you want to, even though you keep getting drunk when you don't mean to?",
  "Have you missed days of work or school because of drinking?",
  "Do you have blackouts?",
  "Have you ever felt that your life would be better if you did not drink?",
];

const EXPECTATIONS = [
  {
    title: "You can stay muted, camera off",
    body: "No one will call on you. The first time most of us showed up, we did exactly that. Just listen for as long as you need.",
  },
  {
    title: "There's no fee, no pledge, no commitment",
    body: "The only requirement for membership is a desire to stop drinking. Come once. Come for a week. Come for the rest of your life. All of it is welcome.",
  },
  {
    title: "What happens in the meeting",
    body: "Someone opens with a reading. Members take turns sharing for a minute or two about their own experience — not giving advice. The meeting closes with a moment of reflection.",
  },
  {
    title: "If you'd like to share",
    body: `You can unmute when you're ready and say your first name. You don't have to say you're an alcoholic. You don't have to have a "story." You just have to be honest about today.`,
  },
];

function SectionEyebrow({ children }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{ alignItems: "center", justifyContent: "center", mb: 2 }}
    >
      <Box sx={{ width: 40, height: 1, background: "#c43c68", opacity: 0.4 }} />
      <Typography
        sx={{
          fontWeight: 700,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          fontSize: { xs: "0.72rem", md: "0.82rem" },
          color: "#c43c68",
        }}
      >
        {children}
      </Typography>
      <Box sx={{ width: 40, height: 1, background: "#c43c68", opacity: 0.4 }} />
    </Stack>
  );
}

export default function NewcomerWelcome() {
  const [copied, setCopied] = React.useState(false);

  async function copyId() {
    try {
      await navigator.clipboard.writeText(ZOOM_ID);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          py: { xs: 10, md: 14 },
          background:
            "linear-gradient(180deg, #fff4d6 0%, #ffe4b8 50%, #ffcfa1 100%)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "-140px",
            right: "-140px",
            width: 440,
            height: 440,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,180,80,0.55) 0%, rgba(255,107,53,0.15) 45%, transparent 75%)",
            filter: "blur(22px)",
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "-200px",
            left: "-140px",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(196,60,104,0.35) 0%, rgba(91,44,111,0.15) 45%, transparent 75%)",
            filter: "blur(22px)",
            pointerEvents: "none",
          }}
        />
        <Container maxWidth="md" sx={{ position: "relative" }}>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionEyebrow>✦ New here? Start here ✦</SectionEyebrow>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "#2d1b4e",
                textAlign: "center",
                fontFamily: 'var(--font-serif), Georgia, serif',
                mb: 3,
              }}
            >
              Welcome.
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
                maxWidth: 640,
                mx: "auto",
                color: "#3a2752",
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                lineHeight: 1.7,
                mb: 5,
              }}
            >
              If you&rsquo;re reading this page, something brought you here. You don&rsquo;t
              have to know what to do next. You don&rsquo;t have to decide anything today.
              You just have to keep reading.
            </Typography>

            <Box
              sx={{
                maxWidth: 560,
                mx: "auto",
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                background:
                  "linear-gradient(135deg, rgba(91,44,111,0.95) 0%, rgba(45,27,78,0.95) 100%)",
                color: "#fff",
                boxShadow: "0 12px 40px rgba(45,27,78,0.25)",
              }}
            >
              <Typography
                sx={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.8)",
                  mb: 1,
                }}
              >
                Tomorrow morning · 7:15 AM Eastern
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "1.5rem", md: "1.8rem" },
                  fontWeight: 800,
                  fontFamily: 'var(--font-serif), Georgia, serif',
                  mb: 1,
                }}
              >
                Join us on Zoom.
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: { xs: "1.6rem", md: "2rem" },
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#ffcfa1",
                  mb: 2.5,
                }}
              >
                {ZOOM_ID.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3")}
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button
                  component="a"
                  href={ZOOM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<VideocamIcon />}
                  sx={{
                    flex: 1,
                    py: 1.25,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #ff6b35 0%, #ff8555 100%)",
                    color: "#fff",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    "&:hover": {
                      background: "linear-gradient(135deg, #ef5e2a 0%, #f3764a 100%)",
                    },
                  }}
                >
                  Open Zoom
                </Button>
                <Button
                  onClick={copyId}
                  startIcon={<ContentCopyIcon />}
                  sx={{
                    flex: 1,
                    py: 1.25,
                    borderRadius: 2,
                    color: "#fff",
                    border: "1px solid rgba(255,255,255,0.4)",
                    background: "rgba(255,255,255,0.06)",
                    "&:hover": {
                      background: "rgba(255,255,255,0.14)",
                    },
                  }}
                >
                  Copy ID
                </Button>
              </Stack>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 }, background: "#fff" }}>
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionEyebrow>✦ Is AA for me? ✦</SectionEyebrow>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "2rem", md: "2.75rem" },
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "#2d1b4e",
                textAlign: "center",
                fontFamily: 'var(--font-serif), Georgia, serif',
                mb: 3,
              }}
            >
              Twelve quiet questions
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
                maxWidth: 620,
                mx: "auto",
                color: "#4a3560",
                fontSize: "1.02rem",
                lineHeight: 1.65,
                mb: 6,
              }}
            >
              Only you can decide whether you&rsquo;re an alcoholic. If you answer yes to
              four or more of these, you might want to come to a meeting and find out what
              we heard when we asked ourselves the same things.
            </Typography>

            <Stack spacing={1.5}>
              {SELF_TEST.map((q, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.03 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      p: 2.5,
                      borderRadius: 2,
                      background: "rgba(91,44,111,0.03)",
                      border: "1px solid rgba(91,44,111,0.08)",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'var(--font-serif), Georgia, serif',
                        fontSize: "1.25rem",
                        fontWeight: 700,
                        color: "#c43c68",
                        minWidth: 32,
                        lineHeight: 1.4,
                      }}
                    >
                      {i + 1}.
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: "0.98rem", md: "1.05rem" },
                        lineHeight: 1.55,
                        color: "#2c1a3d",
                      }}
                    >
                      {q}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Stack>
            <Typography
              sx={{
                mt: 4,
                textAlign: "center",
                fontSize: "0.85rem",
                color: "#6b5478",
                fontStyle: "italic",
              }}
            >
              Adapted from &ldquo;Is A.A. For You?&rdquo; — Alcoholics Anonymous World
              Services.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background:
            "linear-gradient(180deg, #fff9ec 0%, #ffe9c8 100%)",
        }}
      >
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionEyebrow>✦ What to expect ✦</SectionEyebrow>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "2rem", md: "2.75rem" },
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "#2d1b4e",
                textAlign: "center",
                fontFamily: 'var(--font-serif), Georgia, serif',
                mb: 6,
              }}
            >
              Your first meeting
            </Typography>

            <Stack spacing={2.5}>
              {EXPECTATIONS.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2.5,
                      p: { xs: 3, md: 3.5 },
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.75)",
                      backdropFilter: "blur(6px)",
                      border: "1px solid rgba(196,60,104,0.14)",
                      boxShadow: "0 6px 20px rgba(91,44,111,0.06)",
                    }}
                  >
                    <CheckCircleOutlinedIcon
                      sx={{ color: "#c43c68", fontSize: 32, mt: 0.25, flexShrink: 0 }}
                    />
                    <Box>
                      <Typography
                        sx={{
                          fontSize: { xs: "1.15rem", md: "1.3rem" },
                          fontWeight: 700,
                          color: "#2d1b4e",
                          fontFamily: 'var(--font-serif), Georgia, serif',
                          mb: 0.75,
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "1rem",
                          lineHeight: 1.65,
                          color: "#3a2752",
                        }}
                      >
                        {item.body}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </Stack>
          </motion.div>
        </Container>
      </Box>

      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background:
            "linear-gradient(135deg, #2d1b4e 0%, #5b2c6f 50%, #c43c68 100%)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <Container maxWidth="sm">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <FavoriteBorderIcon sx={{ fontSize: 48, mb: 2, color: "#ffcfa1" }} />
            <Typography
              component="p"
              sx={{
                fontSize: { xs: "1.4rem", md: "1.8rem" },
                fontWeight: 600,
                lineHeight: 1.4,
                fontFamily: 'var(--font-serif), Georgia, serif',
                mb: 3,
                fontStyle: "italic",
                color: "#fff8ec",
                textShadow: "0 2px 16px rgba(0,0,0,0.25)",
              }}
            >
              &ldquo;Just come to one meeting. Don&rsquo;t turn your camera on. Don&rsquo;t
              say a word. Just listen. If you hate it, you&rsquo;ve lost one hour. If you
              don&rsquo;t, you&rsquo;ve found something some of us spent a long time looking
              for.&rdquo;
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ justifyContent: "center" }}
            >
              <Button
                component="a"
                href={ZOOM_URL}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<VideocamIcon />}
                sx={{
                  px: 3.5,
                  py: 1.4,
                  borderRadius: 999,
                  background: "linear-gradient(135deg, #ff6b35 0%, #ff8555 100%)",
                  color: "#fff",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  boxShadow: "0 6px 20px rgba(255,107,53,0.4)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #ef5e2a 0%, #f3764a 100%)",
                  },
                }}
              >
                Join tomorrow at 7:15 AM
              </Button>
              <Button
                component={Link}
                href="/stories"
                sx={{
                  px: 3.5,
                  py: 1.4,
                  borderRadius: 999,
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.5)",
                  background: "rgba(255,255,255,0.06)",
                  backdropFilter: "blur(6px)",
                  "&:hover": {
                    background: "rgba(255,255,255,0.14)",
                  },
                }}
              >
                Read a member&rsquo;s story
              </Button>
            </Stack>
          </motion.div>
        </Container>
      </Box>

      <Snackbar
        open={copied}
        autoHideDuration={2400}
        onClose={() => setCopied(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" onClose={() => setCopied(false)}>
          Meeting ID copied.
        </Alert>
      </Snackbar>
    </Box>
  );
}
