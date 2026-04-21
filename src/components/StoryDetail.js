"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MarkdownContent from "@/components/MarkdownContent";

function formatDate(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

function CoverHeader({ story }) {
  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 600], [0, 120]);
  const imgScale = useTransform(scrollY, [0, 600], [1, 1.12]);
  const contentY = useTransform(scrollY, [0, 400], [0, 60]);

  const hasCover = Boolean(story.coverImage);

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        minHeight: { xs: 460, md: 620 },
        display: "flex",
        alignItems: "flex-end",
        isolation: "isolate",
      }}
    >
      {hasCover ? (
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            y: imgY,
            scale: imgScale,
            zIndex: -2,
          }}
        >
          <Box
            component="img"
            src={story.coverImage}
            alt=""
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
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
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.65) 100%)",
          zIndex: -1,
        }}
      />
      <Container
        maxWidth="md"
        sx={{ position: "relative", zIndex: 2, pt: { xs: 10, md: 14 }, pb: { xs: 5, md: 7 } }}
      >
        <motion.div style={{ y: contentY }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Stack
              component={Link}
              href="/stories"
              direction="row"
              spacing={0.75}
              sx={{
                alignItems: "center",
                textDecoration: "none",
                color: "#ffd89b",
                mb: 3,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                fontSize: "0.78rem",
                transition: "color 0.2s ease",
                "&:hover": { color: "#ffffff" },
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 16 }} />
              <Box component="span">All stories</Box>
            </Stack>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <Typography
              variant="h1"
              component="h1"
              sx={{
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "5rem" },
                fontWeight: 800,
                lineHeight: 1.02,
                letterSpacing: "-0.03em",
                color: "#ffffff",
                mb: 2.5,
                textShadow: "0 4px 40px rgba(0,0,0,0.5)",
                fontFamily: 'var(--font-serif), Georgia, serif',
              }}
            >
              {story.title}
            </Typography>
          </motion.div>

          {story.excerpt ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Typography
                sx={{
                  fontSize: { xs: "1.1rem", md: "1.35rem" },
                  color: "rgba(255,255,255,0.92)",
                  maxWidth: 680,
                  lineHeight: 1.5,
                  mb: 3,
                  textShadow: "0 2px 16px rgba(0,0,0,0.4)",
                }}
              >
                {story.excerpt}
              </Typography>
            </motion.div>
          ) : null}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <Stack
              direction="row"
              spacing={2}
              divider={
                <Box
                  component="span"
                  sx={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}
                >
                  ·
                </Box>
              }
              sx={{ alignItems: "center", flexWrap: "wrap", rowGap: 1 }}
            >
              {story.author ? (
                <Typography
                  sx={{
                    color: "#ffd89b",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    letterSpacing: "0.04em",
                  }}
                >
                  {story.author}
                </Typography>
              ) : null}
              {story.updatedAt ? (
                <Typography
                  sx={{
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "0.9rem",
                    letterSpacing: "0.02em",
                  }}
                >
                  {formatDate(story.updatedAt)}
                </Typography>
              ) : null}
            </Stack>
          </motion.div>
        </motion.div>
      </Container>
    </Box>
  );
}

function PhotoCredit({ story }) {
  if (!story.coverImage || !story.coverImageCredit) return null;
  return (
    <Box
      sx={{
        borderBottom: "1px solid #eeeeee",
        py: 1.5,
      }}
    >
      <Container maxWidth="md">
        <Typography
          sx={{
            fontSize: "0.78rem",
            color: "#888888",
            letterSpacing: "0.03em",
          }}
        >
          Photo:{" "}
          {story.coverImageCreditUrl ? (
            <Box
              component="a"
              href={story.coverImageCreditUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#ff6b35",
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {story.coverImageCredit}
            </Box>
          ) : (
            <Box component="span" sx={{ color: "#666", fontWeight: 600 }}>
              {story.coverImageCredit}
            </Box>
          )}
        </Typography>
      </Container>
    </Box>
  );
}

export default function StoryDetail({ story }) {
  return (
    <Box>
      <CoverHeader story={story} />
      <PhotoCredit story={story} />
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Box
            sx={{
              position: "relative",
              "&::before": {
                content: '"❝"',
                position: "absolute",
                top: -40,
                left: -8,
                fontSize: { xs: "5rem", md: "7rem" },
                lineHeight: 1,
                color: "rgba(255, 107, 53, 0.12)",
                fontFamily: 'var(--font-serif), Georgia, serif',
                pointerEvents: "none",
              },
            }}
          >
            <MarkdownContent markdown={story.body} />
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mt: { xs: 6, md: 10 }, pt: 5, borderTop: "1px solid #eeeeee" }}>
            <Stack
              direction="row"
              spacing={1}
              component={Link}
              href="/stories"
              sx={{
                alignItems: "center",
                color: "#ff6b35",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "0.95rem",
                letterSpacing: "0.02em",
                "&:hover": { color: "#ff5a1f" },
              }}
            >
              <ArrowBackIcon sx={{ fontSize: 18 }} />
              <Box component="span">Back to all stories</Box>
            </Stack>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
