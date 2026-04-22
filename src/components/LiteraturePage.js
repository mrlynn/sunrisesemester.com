"use client";

import * as React from "react";
import { motion } from "motion/react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const literature = [
  {
    id: "how-it-works",
    title: "How It Works",
    source: "Alcoholics Anonymous (The Big Book), Chapter 5",
    description:
      "Read at the opening of most meetings. Contains the foundation of the program — the Steps and the path of recovery.",
    url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_chapt5.pdf",
    gradient: "linear-gradient(135deg, #ff6b35 0%, #ffa751 60%, #ffd89b 100%)",
    accent: "#ff6b35",
  },
  {
    id: "the-promises",
    title: "The Promises",
    source: "Alcoholics Anonymous (The Big Book), Chapter 6 — pp. 83–84",
    description:
      "Twelve promises of recovery read toward the end of many meetings. Begin at page 83 and read through \"Are these extravagant promises? We think not.\"",
    url: "https://www.aa.org/sites/default/files/2021-11/en_bigbook_chapt6.pdf#page=83",
    gradient: "linear-gradient(135deg, #2d1b4e 0%, #5b2c6f 50%, #c43c68 100%)",
    accent: "#c43c68",
  },
];

function LiteratureCard({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
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
            background: item.gradient,
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -40,
            right: -40,
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: item.gradient,
            opacity: 0.08,
            filter: "blur(30px)",
          }}
        />
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 3, sm: 4 }}
          sx={{ position: "relative", alignItems: { sm: "center" }, justifyContent: "space-between" }}
        >
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: "center" }}>
              <MenuBookIcon sx={{ fontSize: 18, color: item.accent }} />
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: item.accent,
                }}
              >
                {item.source}
              </Typography>
            </Stack>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "1.6rem", md: "2rem" },
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#1d1d1d",
                fontFamily: 'var(--font-serif), Georgia, serif',
                mb: 1.5,
              }}
            >
              {item.title}
            </Typography>
            <Typography sx={{ color: "#555555", lineHeight: 1.7, fontSize: "0.95rem", maxWidth: 560 }}>
              {item.description}
            </Typography>
          </Box>
          <Box sx={{ flexShrink: 0 }}>
            <Button
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              size="large"
              endIcon={<OpenInNewIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.95rem",
                borderRadius: 8,
                px: 3,
                py: 1.5,
                background: item.gradient,
                color: "#ffffff",
                boxShadow: "0 6px 20px rgba(255,107,53,0.3)",
                whiteSpace: "nowrap",
                "&:hover": {
                  boxShadow: "0 8px 28px rgba(255,107,53,0.45)",
                  filter: "brightness(1.05)",
                },
              }}
            >
              Read PDF
            </Button>
          </Box>
        </Stack>
      </Box>
    </motion.div>
  );
}

export default function LiteraturePage() {
  return (
    <Box>
      {/* Header */}
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
              ✦ Reading List ✦
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
              Literature.
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "1.05rem", md: "1.25rem" },
                color: "rgba(255,255,255,0.92)",
                maxWidth: 520,
                textShadow: "0 2px 12px rgba(0,0,0,0.35)",
              }}
            >
              The readings and texts that anchor our meetings.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* Cards */}
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={3}>
          {literature.map((item, i) => (
            <LiteratureCard key={item.id} item={item} index={i} />
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
