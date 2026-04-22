"use client";

import * as React from "react";
import { motion } from "motion/react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LinkIcon from "@mui/icons-material/Link";

const resources = [
  {
    label: "Alcoholics Anonymous World Services",
    url: "https://www.aa.org/",
  },
  {
    label: "The Big Book (online)",
    url: "https://www.aa.org/the-big-book",
  },
  {
    label: "The Twelve Steps",
    url: "https://www.aa.org/12-steps-of-alcoholics-anonymous",
  },
  {
    label: "The Twelve Traditions",
    url: "https://www.aa.org/12-traditions-of-alcoholics-anonymous",
  },
];

function TraditionCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
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
          <Box>
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#ffd89b",
                mb: 1.5,
              }}
            >
              ✦ 7th Tradition ✦
            </Typography>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "1.6rem", md: "2rem" },
                fontWeight: 800,
                lineHeight: 1.15,
                fontFamily: 'var(--font-serif), Georgia, serif',
                color: "#ffffff",
                mb: 2.5,
              }}
            >
              Self-Supporting Through Our Own Contributions
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "1rem", md: "1.1rem" },
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.92)",
                maxWidth: 680,
              }}
            >
              We have no dues or fees; we do have expenses. Our 7th Tradition states,{" "}
              <Box component="em" sx={{ color: "#ffd89b", fontStyle: "italic" }}>
                &ldquo;Every AA group ought to be fully self-supporting, declining outside contributions.&rdquo;
              </Box>{" "}
              The money collected helps pay for this account and carry the message to the still-suffering
              alcoholic. It is crucial to the survival of this group, as well as the District, the Area,
              and the General Service Office. Please consider donating what you can.
            </Typography>
          </Box>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.2)" }} />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              href="https://www.paypal.me/sunrisesemester"
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              size="large"
              startIcon={<FavoriteIcon />}
              sx={{
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
              Donate via PayPal
            </Button>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                px: { xs: 0, sm: 2 },
                py: { xs: 1, sm: 0 },
              }}
            >
              <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#ffd89b", mb: 0.25 }}>
                Venmo
              </Typography>
              <Typography sx={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.85)" }}>
                @Michael-lynn-3
              </Typography>
              <Typography sx={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>
                Last four of phone: 6036
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>
    </motion.div>
  );
}

function ResourceLink({ item, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <Box
        component="a"
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: { xs: 2, md: 2.5 },
          borderRadius: 3,
          background: "#ffffff",
          border: "1px solid #eeeeee",
          boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
          textDecoration: "none",
          color: "#1d1d1d",
          transition: "all 0.25s ease",
          "&:hover": {
            borderColor: "#ff6b35",
            boxShadow: "0 6px 24px rgba(255,107,53,0.12)",
            transform: "translateX(4px)",
            "& .link-icon": { color: "#ff6b35" },
          },
        }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <LinkIcon className="link-icon" sx={{ fontSize: 20, color: "#aaaaaa", transition: "color 0.25s ease" }} />
          <Typography sx={{ fontWeight: 600, fontSize: "0.95rem" }}>{item.label}</Typography>
        </Stack>
        <OpenInNewIcon sx={{ fontSize: 16, color: "#cccccc", flexShrink: 0 }} />
      </Box>
    </motion.div>
  );
}

export default function ResourcesPage() {
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
              ✦ Group Resources ✦
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
              Resources.
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "1.05rem", md: "1.25rem" },
                color: "rgba(255,255,255,0.92)",
                maxWidth: 520,
                textShadow: "0 2px 12px rgba(0,0,0,0.35)",
              }}
            >
              Support the group and find helpful links for newcomers and members.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={6}>
          <TraditionCard />

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
                  fontSize: { xs: "1.75rem", md: "2.25rem" },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: "#1d1d1d",
                  fontFamily: 'var(--font-serif), Georgia, serif',
                  mb: 1,
                }}
              >
                Helpful links.
              </Typography>
              <Typography sx={{ color: "#666666", fontSize: "1rem", mb: 3 }}>
                Official AA resources for newcomers and members.
              </Typography>
            </motion.div>
            <Stack spacing={1.5}>
              {resources.map((item, i) => (
                <ResourceLink key={item.url} item={item} index={i} />
              ))}
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
