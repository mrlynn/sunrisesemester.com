"use client";

import * as React from "react";
import { motion } from "motion/react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import DownloadIcon from "@mui/icons-material/Download";

const SAFETY_CARD_URL = "/downloads/F-211_Safety_Card_ONLINE.pdf";

const additionalSharing = [
  "Safety is a topic within A.A. that groups and members can address. Developing workable solutions to help keep meetings safe can be based on the principles of A.A. In discussions about safety, keep the focus on our primary purpose, our common welfare, and placing principles before personalities.",
  "Predatory behaviors and unwanted sexual advances are in conflict with carrying the A.A. message of recovery and with A.A. principles.",
  "A.A. does not provide medical advice or detox services; it has no opinion on outside issues, including medication. Medical advice should come from a qualified physician.",
  "The only requirement for A.A. membership is a desire to stop drinking. Groups and members strive to create a safe environment for the alcoholic who still suffers.",
  "If safety concerns arise, individuals can speak with a sponsor, members of the group, a trusted friend and/or a professional to address the concern.",
  "Service entities, such as areas, districts and intergroup/central offices, are available to help provide A.A. services and shared experience. All groups and entities in A.A. are autonomous. There is no government within A.A. and no central authority to control or direct its members, but we do share our experience, strength and hope.",
];

function FadeIn({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function SafetyPage() {
  return (
    <Box>
      <Box
        sx={{
          background: "linear-gradient(180deg, #1a1a3e 0%, #2d1b4e 30%, #5b2c6f 60%, #c43c68 85%, #ff6b35 100%)",
          minHeight: { xs: 240, md: 320 },
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
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
              ✦ Safety Card for A.A. Groups ✦
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
              Safety.
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "1.05rem", md: "1.25rem" },
                color: "rgba(255,255,255,0.92)",
                maxWidth: 560,
                textShadow: "0 2px 12px rgba(0,0,0,0.35)",
              }}
            >
              Creating a safe meeting environment where alcoholics can focus on achieving sobriety.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={6}>
          <FadeIn>
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 4,
                p: { xs: 3, md: 5 },
                background: "linear-gradient(135deg, #2d1b4e 0%, #5b2c6f 40%, #c43c68 80%, #ff6b35 100%)",
                color: "#ffffff",
                boxShadow: "0 20px 60px rgba(91, 44, 111, 0.35)",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(circle at 85% 20%, rgba(255,215,125,0.3) 0%, transparent 55%)",
                  pointerEvents: "none",
                }}
              />
              <Stack spacing={3} sx={{ position: "relative" }}>
                <Typography
                  sx={{
                    fontSize: { xs: "1rem", md: "1.1rem" },
                    lineHeight: 1.75,
                    color: "rgba(255,255,255,0.92)",
                  }}
                >
                  The General Service Office has made this optional card available as an A.A. service
                  piece for in-person/online groups that wish to use it. The text below is adapted from
                  that card for our group.
                </Typography>
                <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />
                <Button
                  href={SAFETY_CARD_URL}
                  download
                  variant="contained"
                  size="large"
                  startIcon={<DownloadIcon />}
                  sx={{
                    alignSelf: "flex-start",
                    textTransform: "none",
                    fontWeight: 700,
                    fontSize: "1rem",
                    borderRadius: 8,
                    px: 4,
                    py: 1.5,
                    background: "linear-gradient(135deg, #fff4d6 0%, #ffd89b 100%)",
                    color: "#2d1b4e",
                    boxShadow: "0 6px 24px rgba(255,215,125,0.35)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #ffffff 0%, #ffd89b 100%)",
                      boxShadow: "0 8px 32px rgba(255,215,125,0.5)",
                    },
                  }}
                >
                  Download the Safety Card (PDF)
                </Button>
              </Stack>
            </Box>
          </FadeIn>

          <FadeIn delay={0.05}>
            <Stack spacing={3}>
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: "1.5rem", md: "1.9rem" },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  color: "#1d1d1d",
                  fontFamily: 'var(--font-serif), Georgia, serif',
                }}
              >
                Tradition Five states:
              </Typography>
              <Typography sx={{ fontSize: "1.05rem", lineHeight: 1.8, color: "#333333" }}>
                Each group has but one primary purpose — to carry its message to the alcoholic who
                still suffers.
              </Typography>
              <Typography sx={{ fontSize: "1.05rem", lineHeight: 1.8, color: "#333333" }}>
                Any person seeking help with a drinking problem is welcome at this group. No A.A.
                entity determines an individual&rsquo;s membership in Alcoholics Anonymous. It is this
                group&rsquo;s conscience that if any person endangers another individual or disrupts the
                group&rsquo;s efforts to carry A.A.&rsquo;s message, the group may ask that person to leave
                the meeting.
              </Typography>
              <Typography sx={{ fontSize: "1.05rem", lineHeight: 1.8, color: "#333333" }}>
                This group strives to safeguard the anonymity of A.A. members and attendees; however,
                keep in mind that anonymity in A.A. is not a cloak for unsafe and illegal behavior.
                Addressing such behavior and/or contacting the proper authorities when appropriate,
                does not go against any A.A. Traditions and is meant to ensure the safety of all in
                attendance.
              </Typography>
              <Typography sx={{ fontSize: "1.05rem", lineHeight: 1.8, color: "#333333" }}>
                The short form of Tradition One states: &ldquo;Our common welfare should come first;
                personal recovery depends upon A.A. unity.&rdquo; Recognizing the importance of group
                unity, our group strives to create a safe meeting environment in which alcoholics can
                focus on achieving sobriety.
              </Typography>
            </Stack>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Stack spacing={3}>
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: "1.5rem", md: "1.9rem" },
                  fontWeight: 800,
                  lineHeight: 1.2,
                  color: "#1d1d1d",
                  fontFamily: 'var(--font-serif), Georgia, serif',
                }}
              >
                Additional sharing.
              </Typography>
              <Stack spacing={2} component="ul" sx={{ pl: 3, m: 0 }}>
                {additionalSharing.map((item, i) => (
                  <Typography
                    key={i}
                    component="li"
                    sx={{ fontSize: "1.05rem", lineHeight: 1.8, color: "#333333" }}
                  >
                    {item}
                  </Typography>
                ))}
              </Stack>
              <Typography
                sx={{
                  fontSize: "1rem",
                  lineHeight: 1.8,
                  color: "#666666",
                  fontStyle: "italic",
                }}
              >
                For more information on this topic, see the &ldquo;A.A. Guidelines on Safety and A.A.
                Groups&rdquo; (MG-25) at{" "}
                <Box
                  component="a"
                  href="https://www.aa.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: "#ff6b35", fontWeight: 600 }}
                >
                  aa.org
                </Box>
                .
              </Typography>
              <Typography sx={{ fontSize: "0.85rem", color: "#999999" }}>
                Service Material from the General Service Office &mdash; Item F-211
              </Typography>
            </Stack>
          </FadeIn>
        </Stack>
      </Container>
    </Box>
  );
}
