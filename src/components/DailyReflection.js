"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import TodayIcon from "@mui/icons-material/Today";

function smartQuote(text) {
  if (!text) return "";
  return text.replace(/^"|"$/g, "").trim();
}

function reflectionHref(month, day) {
  return `/reflections/${month}/${day}`;
}

function NavLink({ href, label, subLabel, direction }) {
  const isBack = direction === "back";
  return (
    <Box
      component={Link}
      href={href}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        textDecoration: "none",
        color: "#5b2c6f",
        px: 2.5,
        py: 1.5,
        borderRadius: 8,
        transition: "all 0.25s ease",
        flexDirection: isBack ? "row" : "row-reverse",
        textAlign: isBack ? "left" : "right",
        "&:hover": {
          backgroundColor: "rgba(91, 44, 111, 0.08)",
          transform: isBack ? "translateX(-2px)" : "translateX(2px)",
        },
      }}
    >
      {isBack ? (
        <ArrowBackIcon sx={{ fontSize: 20, color: "#c43c68" }} />
      ) : (
        <ArrowForwardIcon sx={{ fontSize: 20, color: "#c43c68" }} />
      )}
      <Stack spacing={0.25}>
        <Typography
          sx={{
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#8a3a52",
          }}
        >
          {label}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "0.95rem", md: "1rem" },
            fontWeight: 700,
            color: "#2d1b4e",
            fontFamily: 'var(--font-serif), Georgia, serif',
          }}
        >
          {subLabel}
        </Typography>
      </Stack>
    </Box>
  );
}

export default function DailyReflection({ reflection, variant = "section" }) {
  if (!reflection) return null;

  const cleanedQuote = smartQuote(reflection.quote);
  const isStandalone = variant === "standalone";

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        py: { xs: 8, md: 12 },
        background:
          "linear-gradient(180deg, #fff4d6 0%, #ffe4b8 50%, #ffcfa1 100%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-120px",
          right: "-140px",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255, 180, 80, 0.55) 0%, rgba(255, 107, 53, 0.15) 45%, transparent 75%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "-180px",
          left: "-120px",
          width: 360,
          height: 360,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(196, 60, 104, 0.35) 0%, rgba(91, 44, 111, 0.15) 45%, transparent 75%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />
      <Container maxWidth="md" sx={{ position: "relative" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", justifyContent: "center", mb: 3 }}
          >
            <Box sx={{ width: 40, height: 1, background: "#c43c68", opacity: 0.4 }} />
            <Typography
              sx={{
                fontFamily: '"Inter", sans-serif',
                fontWeight: 700,
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                fontSize: { xs: "0.72rem", md: "0.82rem" },
                color: "#c43c68",
              }}
            >
              ✦ {reflection.isToday ? "Today's" : "Daily"} Reflection ·{" "}
              {reflection.dateLabel} ✦
            </Typography>
            <Box sx={{ width: 40, height: 1, background: "#c43c68", opacity: 0.4 }} />
          </Stack>

          <Typography
            component={isStandalone ? "h1" : "h2"}
            sx={{
              fontSize: { xs: "2.25rem", sm: "3rem", md: "4rem" },
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#2d1b4e",
              textAlign: "center",
              fontFamily: 'var(--font-serif), Georgia, serif',
              mb: { xs: 4, md: 6 },
            }}
          >
            {reflection.title}
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Box
            sx={{
              position: "relative",
              px: { xs: 2, md: 6 },
              mb: { xs: 5, md: 6 },
            }}
          >
            <Box
              component="span"
              aria-hidden
              sx={{
                position: "absolute",
                top: { xs: -30, md: -60 },
                left: { xs: -6, md: -10 },
                fontSize: { xs: "6rem", md: "10rem" },
                lineHeight: 1,
                color: "rgba(196, 60, 104, 0.22)",
                fontFamily: 'var(--font-serif), Georgia, serif',
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              ❝
            </Box>
            <Typography
              component="blockquote"
              sx={{
                fontFamily: 'var(--font-serif), Georgia, serif',
                fontStyle: "italic",
                fontSize: { xs: "1.2rem", sm: "1.35rem", md: "1.6rem" },
                lineHeight: 1.55,
                color: "#2c1a3d",
                textAlign: "center",
                m: 0,
                position: "relative",
              }}
            >
              {cleanedQuote}
            </Typography>
            <Box
              component="span"
              aria-hidden
              sx={{
                position: "absolute",
                bottom: { xs: -60, md: -90 },
                right: { xs: -6, md: -10 },
                fontSize: { xs: "6rem", md: "10rem" },
                lineHeight: 1,
                color: "rgba(196, 60, 104, 0.22)",
                fontFamily: 'var(--font-serif), Georgia, serif',
                pointerEvents: "none",
                userSelect: "none",
              }}
            >
              ❞
            </Box>
          </Box>

          <Typography
            sx={{
              textAlign: "center",
              fontSize: { xs: "0.82rem", md: "0.9rem" },
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#8a3a52",
              mb: { xs: 5, md: 7 },
            }}
          >
            {reflection.reference}
          </Typography>
        </motion.div>

        {reflection.comment ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Box
              sx={{
                maxWidth: 680,
                mx: "auto",
                p: { xs: 3, md: 4.5 },
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.7)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(196, 60, 104, 0.15)",
                boxShadow: "0 8px 32px rgba(91, 44, 111, 0.08)",
              }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "1.02rem", md: "1.15rem" },
                  lineHeight: 1.8,
                  color: "#2c1a3d",
                  whiteSpace: "pre-line",
                }}
              >
                {reflection.comment}
              </Typography>
            </Box>
          </motion.div>
        ) : null}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2 }}
            sx={{
              mt: { xs: 5, md: 7 },
              pt: 4,
              borderTop: "1px solid rgba(196, 60, 104, 0.2)",
              alignItems: { xs: "stretch", sm: "center" },
              justifyContent: "space-between",
            }}
          >
            <NavLink
              href={reflectionHref(reflection.prev.month, reflection.prev.day)}
              direction="back"
              label="Previous"
              subLabel={reflection.prev.label}
            />
            {!reflection.isToday ? (
              <Box
                component={Link}
                href="/"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  textDecoration: "none",
                  px: 3,
                  py: 1.25,
                  borderRadius: 8,
                  background: "linear-gradient(135deg, #c43c68 0%, #ff6b35 100%)",
                  color: "#ffffff",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  letterSpacing: "0.04em",
                  boxShadow: "0 4px 16px rgba(196, 60, 104, 0.3)",
                  transition: "all 0.25s ease",
                  alignSelf: { xs: "center", sm: "auto" },
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: "0 6px 20px rgba(196, 60, 104, 0.4)",
                  },
                }}
              >
                <TodayIcon sx={{ fontSize: 18 }} />
                <Box component="span">Today&rsquo;s reflection</Box>
              </Box>
            ) : null}
            <NavLink
              href={reflectionHref(reflection.next.month, reflection.next.day)}
              direction="forward"
              label="Next"
              subLabel={reflection.next.label}
            />
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
}
