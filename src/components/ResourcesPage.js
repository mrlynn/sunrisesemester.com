"use client";

import * as React from "react";
import { motion } from "motion/react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import MapIcon from "@mui/icons-material/Map";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import PublicIcon from "@mui/icons-material/Public";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import LinkIcon from "@mui/icons-material/Link";

const CATEGORY_META = {
  "meeting-format": {
    id: "meeting-formats",
    label: "Meeting formats",
    headline: "Meeting formats.",
    blurb: "Scripts and formats used in Sunrise Semester meetings.",
    Icon: MenuBookIcon,
    accent: "#ff6b35",
    gradient: "linear-gradient(135deg, #ff6b35 0%, #ffa751 55%, #ffd89b 100%)",
    layout: "feature",
  },
  guide: {
    id: "guides",
    label: "Guides",
    headline: "Guides.",
    blurb: "How we run the room — Zoom, hosting, and group practice.",
    Icon: MapIcon,
    accent: "#c43c68",
    gradient: "linear-gradient(135deg, #5b2c6f 0%, #c43c68 55%, #ff6b35 100%)",
    layout: "feature",
  },
  service: {
    id: "service",
    label: "Service",
    headline: "Service.",
    blurb: "Materials for trusted servants and group service work.",
    Icon: VolunteerActivismIcon,
    accent: "#5b2c6f",
    gradient: "linear-gradient(135deg, #2d1b4e 0%, #5b2c6f 60%, #c43c68 100%)",
    layout: "feature",
  },
  link: {
    id: "aa-links",
    label: "AA links",
    headline: "AA on the web.",
    blurb: "Official Alcoholics Anonymous resources.",
    Icon: PublicIcon,
    accent: "#2d1b4e",
    gradient: "linear-gradient(135deg, #1a1a3e 0%, #2d1b4e 50%, #5b2c6f 100%)",
    layout: "compact",
  },
  other: {
    id: "more",
    label: "More",
    headline: "More resources.",
    blurb: "Everything else worth keeping close.",
    Icon: FolderOpenIcon,
    accent: "#ff8c5a",
    gradient: "linear-gradient(135deg, #ff8c5a 0%, #ff6b35 50%, #c43c68 100%)",
    layout: "compact",
  },
};

const CATEGORY_ORDER = ["meeting-format", "guide", "service", "link", "other"];

function groupByCategory(resources) {
  const map = new Map();
  for (const key of CATEGORY_ORDER) {
    map.set(key, []);
  }
  for (const item of resources) {
    const key = CATEGORY_META[item.category] ? item.category : "other";
    map.get(key).push(item);
  }
  return CATEGORY_ORDER.filter((key) => map.get(key).length > 0).map((key) => ({
    key,
    meta: CATEGORY_META[key],
    items: map.get(key),
  }));
}

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
            background:
              "radial-gradient(circle at 85% 20%, rgba(255,215,125,0.3) 0%, transparent 55%)",
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
                fontFamily: "var(--font-serif), Georgia, serif",
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
                &ldquo;Every AA group ought to be fully self-supporting, declining outside
                contributions.&rdquo;
              </Box>{" "}
              The money collected helps pay for this account and carry the message to the
              still-suffering alcoholic. It is crucial to the survival of this group, as well as
              the District, the Area, and the General Service Office. Please consider donating what
              you can.
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
              <Typography
                sx={{ fontWeight: 700, fontSize: "0.95rem", color: "#ffd89b", mb: 0.25 }}
              >
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

function resourceHref(item) {
  if (item.kind === "pdf") {
    return item.file?.url || "#";
  }
  return item.externalUrl || "#";
}

function isInternalHref(href) {
  return typeof href === "string" && href.startsWith("/");
}

function CategoryJump({ sections }) {
  if (sections.length < 2) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          pb: 1,
        }}
      >
        {sections.map(({ key, meta, items }) => {
          const Icon = meta.Icon;
          return (
            <Box
              key={key}
              component="a"
              href={`#${meta.id}`}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                px: 1.75,
                py: 1,
                borderRadius: 999,
                textDecoration: "none",
                color: "#2d1b4e",
                background: "rgba(45, 27, 78, 0.06)",
                border: "1px solid rgba(45, 27, 78, 0.08)",
                fontWeight: 600,
                fontSize: "0.875rem",
                transition: "background 0.2s ease, transform 0.2s ease",
                "&:hover": {
                  background: "rgba(255, 107, 53, 0.12)",
                  borderColor: "rgba(255, 107, 53, 0.35)",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <Icon sx={{ fontSize: 18, color: meta.accent }} />
              {meta.label}
              <Box
                component="span"
                sx={{
                  ml: 0.25,
                  minWidth: 22,
                  height: 22,
                  borderRadius: "50%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  background: meta.accent,
                  color: "#fff",
                }}
              >
                {items.length}
              </Box>
            </Box>
          );
        })}
      </Box>
    </motion.div>
  );
}

function FeatureTile({ item, index, accent, gradient }) {
  const href = resourceHref(item);
  const isInternal = item.kind === "link" && isInternalHref(href);
  const isPdf = item.kind === "pdf";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: Math.min(index, 5) * 0.06, ease: [0.16, 1, 0.3, 1] }}
      style={{ height: "100%" }}
    >
      <Box
        component={isInternal ? Link : "a"}
        href={href}
        target={isInternal ? undefined : "_blank"}
        rel={isInternal ? undefined : "noopener noreferrer"}
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: { xs: 0, md: 168 },
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          textDecoration: "none",
          color: "#1d1d1d",
          background: "#ffffff",
          border: "1px solid #ececec",
          overflow: "hidden",
          transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            borderColor: accent,
            boxShadow: `0 16px 40px ${accent}22`,
            "& .resource-cta": { color: accent },
          },
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 5,
            background: gradient,
          },
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", mb: 1.5 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              px: 1,
              py: 0.35,
              borderRadius: 1,
              background: `${accent}14`,
              color: accent,
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {isPdf ? (
              <PictureAsPdfIcon sx={{ fontSize: 14 }} />
            ) : (
              <LinkIcon sx={{ fontSize: 14 }} />
            )}
            {isPdf ? "PDF" : isInternal ? "On site" : "Link"}
          </Box>
        </Stack>

        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: "1.05rem", md: "1.15rem" },
            lineHeight: 1.3,
            fontFamily: "var(--font-serif), Georgia, serif",
            mb: item.description ? 1 : 0,
          }}
        >
          {item.title}
        </Typography>
        {item.description ? (
          <Typography
            sx={{
              color: "#666",
              fontSize: "0.9rem",
              lineHeight: 1.55,
              flexGrow: 1,
            }}
          >
            {item.description}
          </Typography>
        ) : (
          <Box sx={{ flexGrow: 1 }} />
        )}

        <Typography
          className="resource-cta"
          sx={{
            mt: 2,
            fontWeight: 700,
            fontSize: "0.85rem",
            color: "#888",
            display: "inline-flex",
            alignItems: "center",
            gap: 0.5,
            transition: "color 0.2s ease",
          }}
        >
          {isPdf ? "Open PDF" : "Open"}
          {!isInternal ? <OpenInNewIcon sx={{ fontSize: 14 }} /> : null}
        </Typography>
      </Box>
    </motion.div>
  );
}

function CompactRow({ item, index, accent }) {
  const href = resourceHref(item);
  const isInternal = item.kind === "link" && isInternalHref(href);
  const isPdf = item.kind === "pdf";

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: Math.min(index, 8) * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      <Box
        component={isInternal ? Link : "a"}
        href={href}
        target={isInternal ? undefined : "_blank"}
        rel={isInternal ? undefined : "noopener noreferrer"}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          px: { xs: 2, md: 2.25 },
          py: { xs: 1.75, md: 2 },
          borderRadius: 2.5,
          textDecoration: "none",
          color: "#1d1d1d",
          background: "rgba(255,255,255,0.85)",
          border: "1px solid #ececec",
          transition: "border-color 0.2s ease, transform 0.2s ease, background 0.2s ease",
          "&:hover": {
            borderColor: accent,
            background: "#fff",
            transform: "translateX(3px)",
            "& .row-icon": { color: accent },
          },
        }}
      >
        <Stack direction="row" spacing={1.75} sx={{ alignItems: "center", minWidth: 0 }}>
          <Box
            className="row-icon"
            sx={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: `${accent}12`,
              color: accent,
              flexShrink: 0,
              transition: "color 0.2s ease",
            }}
          >
            {isPdf ? (
              <PictureAsPdfIcon sx={{ fontSize: 18 }} />
            ) : (
              <LinkIcon sx={{ fontSize: 18 }} />
            )}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", lineHeight: 1.35 }}>
              {item.title}
            </Typography>
            {item.description ? (
              <Typography
                sx={{
                  color: "#777",
                  fontSize: "0.8rem",
                  mt: 0.35,
                  lineHeight: 1.4,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {item.description}
              </Typography>
            ) : null}
          </Box>
        </Stack>
        {!isInternal ? (
          <OpenInNewIcon sx={{ fontSize: 16, color: "#ccc", flexShrink: 0 }} />
        ) : null}
      </Box>
    </motion.div>
  );
}

function CategorySection({ section, index }) {
  const { meta, items } = section;
  const Icon = meta.Icon;
  const isFeature = meta.layout === "feature";

  return (
    <Box
      id={meta.id}
      component="section"
      sx={{
        scrollMarginTop: 96,
        position: "relative",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, delay: Math.min(index, 3) * 0.05 }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ alignItems: { sm: "flex-end" }, justifyContent: "space-between", mb: 3 }}
        >
          <Box sx={{ maxWidth: 560 }}>
            <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", mb: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: meta.gradient,
                  color: "#fff",
                  boxShadow: `0 8px 20px ${meta.accent}33`,
                }}
              >
                <Icon sx={{ fontSize: 22 }} />
              </Box>
              <Typography
                sx={{
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: meta.accent,
                }}
              >
                {meta.label}
              </Typography>
            </Stack>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "1.85rem", md: "2.4rem" },
                fontWeight: 800,
                lineHeight: 1.05,
                color: "#1d1d1d",
                fontFamily: "var(--font-serif), Georgia, serif",
                mb: 0.75,
              }}
            >
              {meta.headline}
            </Typography>
            <Typography sx={{ color: "#666", fontSize: "1rem", lineHeight: 1.6 }}>
              {meta.blurb}
            </Typography>
          </Box>
          <Typography
            sx={{
              display: { xs: "none", sm: "block" },
              fontWeight: 700,
              fontSize: "0.8rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#aaaaaa",
              pb: 0.5,
            }}
          >
            {items.length} {items.length === 1 ? "item" : "items"}
          </Typography>
        </Stack>
      </motion.div>

      {isFeature ? (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: items.length === 1 ? "1fr" : "repeat(2, 1fr)",
            },
            gap: 2,
          }}
        >
          {items.map((item, i) => (
            <FeatureTile
              key={item._id || `${item.title}-${i}`}
              item={item}
              index={i}
              accent={meta.accent}
              gradient={meta.gradient}
            />
          ))}
        </Box>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
            gap: 1.25,
            p: { xs: 1.5, md: 2 },
            borderRadius: 3,
            background:
              "linear-gradient(180deg, rgba(45,27,78,0.03) 0%, rgba(255,107,53,0.04) 100%)",
            border: "1px solid rgba(45,27,78,0.06)",
          }}
        >
          {items.map((item, i) => (
            <CompactRow
              key={item._id || `${item.title}-${i}`}
              item={item}
              index={i}
              accent={meta.accent}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}

export default function ResourcesPage({ resources = [] }) {
  const sections = React.useMemo(() => groupByCategory(resources), [resources]);

  return (
    <Box>
      <Box
        sx={{
          background:
            "linear-gradient(180deg, #1a1a3e 0%, #2d1b4e 30%, #5b2c6f 60%, #c43c68 85%, #ff6b35 100%)",
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
              Support the group and find formats, guides, and AA links — organized for how you use
              them.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Box
        sx={{
          background:
            "radial-gradient(ellipse at top, rgba(255,216,155,0.12) 0%, transparent 45%), linear-gradient(180deg, #faf8f5 0%, #ffffff 40%)",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <Stack spacing={{ xs: 6, md: 8 }}>
            <TraditionCard />

            {resources.length === 0 ? (
              <Typography sx={{ color: "#666666" }}>
                No resources published yet. Check back soon.
              </Typography>
            ) : (
              <>
                <Box>
                  <Typography
                    component="h2"
                    sx={{
                      fontSize: { xs: "1.75rem", md: "2.25rem" },
                      fontWeight: 800,
                      lineHeight: 1.1,
                      color: "#1d1d1d",
                      fontFamily: "var(--font-serif), Georgia, serif",
                      mb: 1,
                    }}
                  >
                    Browse by type.
                  </Typography>
                  <Typography sx={{ color: "#666666", fontSize: "1rem", mb: 2.5 }}>
                    Jump to a category, or scroll — formats and guides first, AA links below.
                  </Typography>
                  <CategoryJump sections={sections} />
                </Box>

                {sections.map((section, i) => (
                  <CategorySection key={section.key} section={section} index={i} />
                ))}
              </>
            )}
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
