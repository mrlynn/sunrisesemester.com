"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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
          style={{ filter: "drop-shadow(0 0 50px rgba(255, 180, 80, 0.6))" }}
        >
          <defs>
            <radialGradient id="storiesSun" cx="50%" cy="50%" r="50%">
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
          <circle cx="140" cy="140" r="70" fill="url(#storiesSun)" />
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
            ✦ Member Stories ✦
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
            Experience, strength, and hope.
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "1.05rem", md: "1.25rem" },
              color: "rgba(255,255,255,0.92)",
              maxWidth: 620,
              textShadow: "0 2px 12px rgba(0,0,0,0.35)",
            }}
          >
            Reflections from members of Sunrise Semester. One share can change everything —
            start with one.
          </Typography>
        </motion.div>
      </Container>
    </Box>
  );
}

function StoryCard({ story, index }) {
  const hasCover = Boolean(story.coverImage);
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <Box
        component={Link}
        href={`/stories/${story.slug}`}
        sx={{
          display: "block",
          textDecoration: "none",
          color: "inherit",
          borderRadius: 4,
          overflow: "hidden",
          background: "#ffffff",
          border: "1px solid #eeeeee",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          transition: "transform 0.4s ease, box-shadow 0.4s ease",
          height: "100%",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
            "& .cover": {
              transform: "scale(1.05)",
            },
            "& .arrow": {
              transform: "translateX(6px)",
              color: "#ff6b35",
            },
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 10",
            overflow: "hidden",
            background:
              "linear-gradient(135deg, #5b2c6f 0%, #c43c68 50%, #ff6b35 100%)",
          }}
        >
          {hasCover ? (
            <Box
              component="img"
              src={story.coverImage}
              alt=""
              className="cover"
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.6s ease",
              }}
            />
          ) : (
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden>
                <defs>
                  <radialGradient id={`fallback-${story.slug}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fff4d6" />
                    <stop offset="100%" stopColor="#ffa751" />
                  </radialGradient>
                </defs>
                <circle cx="60" cy="60" r="34" fill={`url(#fallback-${story.slug})`} />
              </svg>
            </Box>
          )}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.35) 100%)",
            }}
          />
        </Box>
        <Box sx={{ p: { xs: 3, md: 3.5 } }}>
          {story.author ? (
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#ff6b35",
                mb: 1,
              }}
            >
              {story.author}
            </Typography>
          ) : null}
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: "1.5rem", md: "1.75rem" },
              fontWeight: 800,
              lineHeight: 1.15,
              color: "#1d1d1d",
              fontFamily: 'var(--font-serif), Georgia, serif',
              mb: 1.5,
            }}
          >
            {story.title}
          </Typography>
          {story.excerpt ? (
            <Typography
              sx={{
                color: "#555555",
                lineHeight: 1.6,
                fontSize: "0.98rem",
                mb: 2,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {story.excerpt}
            </Typography>
          ) : null}
          <Stack direction="row" spacing={0.75} sx={{ alignItems: "center", color: "#2c2c2c" }}>
            <Typography
              sx={{
                fontSize: "0.9rem",
                fontWeight: 700,
                letterSpacing: "0.02em",
              }}
            >
              Read the story
            </Typography>
            <ArrowForwardIcon
              className="arrow"
              sx={{ fontSize: 18, transition: "all 0.3s ease", color: "#2c2c2c" }}
            />
          </Stack>
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
            "linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(255, 215, 125, 0.1) 100%)",
          border: "1px dashed #ffa751",
        }}
      >
        <Typography
          sx={{
            fontFamily: 'var(--font-serif), Georgia, serif',
            fontSize: { xs: "1.5rem", md: "1.75rem" },
            fontWeight: 700,
            color: "#2c2c2c",
            mb: 1.5,
          }}
        >
          No stories yet — but yours could be first.
        </Typography>
        <Typography sx={{ color: "#666666", maxWidth: 520, mx: "auto" }}>
          Once your database is connected, sign in as an editor to publish member
          reflections here.
        </Typography>
      </Box>
    </motion.div>
  );
}

export default function StoriesIndex({ stories }) {
  return (
    <Box>
      <HeaderBanner />
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        {stories.length === 0 ? (
          <EmptyState />
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: { xs: 3, md: 4 },
            }}
          >
            {stories.map((s, i) => (
              <StoryCard key={String(s._id)} story={s} index={i} />
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}
