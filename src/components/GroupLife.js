"use client";

import * as React from "react";
import { motion } from "motion/react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutlined";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";

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

function AnniversaryCard({ item, index }) {
  const { name, years, sobrietyDateLabel, note, isWithinWeek, daysToNext } = item;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.04 }}
    >
      <Box
        sx={{
          position: "relative",
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          background: "rgba(255,255,255,0.78)",
          backdropFilter: "blur(6px)",
          border: isWithinWeek
            ? "1px solid rgba(255,107,53,0.55)"
            : "1px solid rgba(196,60,104,0.18)",
          boxShadow: isWithinWeek
            ? "0 8px 28px rgba(255,107,53,0.18)"
            : "0 6px 20px rgba(91,44,111,0.06)",
          overflow: "hidden",
        }}
      >
        {isWithinWeek ? (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              px: 1.25,
              py: 0.25,
              borderRadius: 999,
              background: "linear-gradient(135deg, #ff6b35 0%, #c43c68 100%)",
              color: "#fff",
              fontSize: "0.68rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {daysToNext === 0 ? "Today" : `in ${daysToNext}d`}
          </Box>
        ) : null}
        <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, #c43c68 0%, #ff6b35 100%)",
              boxShadow: "0 4px 16px rgba(196,60,104,0.28)",
            }}
          >
            <Typography
              sx={{
                fontFamily: 'var(--font-serif), Georgia, serif',
                fontWeight: 800,
                color: "#fff",
                fontSize: "1.5rem",
                lineHeight: 1,
              }}
            >
              {years}
            </Typography>
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Typography
              sx={{
                fontSize: { xs: "1.15rem", md: "1.3rem" },
                fontWeight: 700,
                color: "#2d1b4e",
                fontFamily: 'var(--font-serif), Georgia, serif',
                lineHeight: 1.25,
              }}
            >
              {name}
            </Typography>
            <Typography
              sx={{
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "#8a3a52",
                mt: 0.25,
              }}
            >
              {years === 1 ? "1 year" : `${years} years`} · since{" "}
              {sobrietyDateLabel}
            </Typography>
            {note ? (
              <Typography
                sx={{
                  mt: 1.25,
                  fontSize: "0.98rem",
                  lineHeight: 1.6,
                  color: "#3a2752",
                  fontStyle: "italic",
                }}
              >
                &ldquo;{note}&rdquo;
              </Typography>
            ) : null}
          </Box>
        </Stack>
      </Box>
    </motion.div>
  );
}

function ServiceRoleCard({ item, index }) {
  const { title, holder, email, termLabel, description } = item;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: index * 0.04 }}
    >
      <Box
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 3,
          background: "#fff",
          border: "1px solid rgba(91,44,111,0.12)",
          boxShadow: "0 4px 14px rgba(91,44,111,0.05)",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <WorkspacePremiumIcon sx={{ color: "#c43c68", fontSize: 22 }} />
          <Typography
            sx={{
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#c43c68",
            }}
          >
            {title}
          </Typography>
        </Stack>
        <Typography
          sx={{
            fontSize: { xs: "1.2rem", md: "1.35rem" },
            fontWeight: 700,
            color: "#2d1b4e",
            fontFamily: 'var(--font-serif), Georgia, serif',
            lineHeight: 1.25,
          }}
        >
          {holder || "Open — ask a member"}
        </Typography>
        {termLabel ? (
          <Typography sx={{ fontSize: "0.85rem", color: "#6b5478" }}>
            {termLabel}
          </Typography>
        ) : null}
        {description ? (
          <Typography sx={{ fontSize: "0.95rem", color: "#3a2752", lineHeight: 1.55 }}>
            {description}
          </Typography>
        ) : null}
        {email ? (
          <Stack
            direction="row"
            spacing={0.75}
            sx={{ alignItems: "center", mt: "auto", pt: 1 }}
          >
            <MailOutlineIcon sx={{ fontSize: 16, color: "#c43c68" }} />
            <Typography
              component="a"
              href={`mailto:${email}`}
              sx={{
                fontSize: "0.88rem",
                color: "#c43c68",
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {email}
            </Typography>
          </Stack>
        ) : null}
      </Box>
    </motion.div>
  );
}

export default function GroupLife({ anniversaries, serviceRoles }) {
  const upcoming = anniversaries
    .slice()
    .sort((a, b) => a.daysToNext - b.daysToNext)
    .filter((a) => a.daysToNext >= 0)
    .slice(0, 3);
  const upcomingIds = new Set(upcoming.map((a) => a._id));
  const rest = anniversaries.filter((a) => !upcomingIds.has(a._id));

  return (
    <Box>
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
              "radial-gradient(circle, rgba(255,180,80,0.55) 0%, rgba(255,107,53,0.15) 45%, transparent 75%)",
            filter: "blur(20px)",
            pointerEvents: "none",
          }}
        />
        <Container maxWidth="lg" sx={{ position: "relative" }}>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionEyebrow>✦ Our group ✦</SectionEyebrow>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.25rem" },
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "#2d1b4e",
                textAlign: "center",
                fontFamily: 'var(--font-serif), Georgia, serif',
                mb: 3,
              }}
            >
              The people who keep the lights on.
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
                maxWidth: 640,
                mx: "auto",
                color: "#4a3560",
                fontSize: { xs: "1rem", md: "1.1rem" },
                lineHeight: 1.7,
              }}
            >
              Sunrise Semester runs on service. These are the members who&rsquo;ve
              volunteered to hold positions this year, and these are the anniversaries
              we&rsquo;re celebrating.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Box sx={{ py: { xs: 8, md: 12 }, background: "#fff" }}>
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionEyebrow>✦ Trusted servants ✦</SectionEyebrow>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "1.9rem", md: "2.5rem" },
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "#2d1b4e",
                textAlign: "center",
                fontFamily: 'var(--font-serif), Georgia, serif',
                mb: 6,
              }}
            >
              Service roster
            </Typography>

            {serviceRoles.length === 0 ? (
              <Typography
                sx={{
                  textAlign: "center",
                  color: "#6b5478",
                  fontStyle: "italic",
                  py: 6,
                }}
              >
                The service roster is being updated. Check back soon.
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gap: 2,
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                  },
                }}
              >
                {serviceRoles.map((role, i) => (
                  <ServiceRoleCard key={role._id} item={role} index={i} />
                ))}
              </Box>
            )}
          </motion.div>
        </Container>
      </Box>

      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background:
            "linear-gradient(180deg, #fff9ec 0%, #ffe4b8 100%)",
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <SectionEyebrow>✦ Celebrations ✦</SectionEyebrow>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "1.9rem", md: "2.5rem" },
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                color: "#2d1b4e",
                textAlign: "center",
                fontFamily: 'var(--font-serif), Georgia, serif',
                mb: 1,
              }}
            >
              <CakeOutlinedIcon
                sx={{ fontSize: 32, color: "#c43c68", verticalAlign: "middle", mr: 1 }}
              />
              Anniversaries
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
                maxWidth: 560,
                mx: "auto",
                color: "#4a3560",
                mb: 6,
              }}
            >
              A day at a time. Every one of these is a small miracle.
            </Typography>

            {anniversaries.length === 0 ? (
              <Typography
                sx={{
                  textAlign: "center",
                  color: "#6b5478",
                  fontStyle: "italic",
                  py: 6,
                }}
              >
                No anniversaries posted yet.
              </Typography>
            ) : (
              <Stack spacing={5}>
                {upcoming.length > 0 ? (
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "0.78rem",
                        fontWeight: 800,
                        letterSpacing: "0.22em",
                        textTransform: "uppercase",
                        color: "#ff6b35",
                        textAlign: "center",
                        mb: 2,
                      }}
                    >
                      Coming up
                    </Typography>
                    <Box
                      sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(2, 1fr)",
                          md: "repeat(3, 1fr)",
                        },
                      }}
                    >
                      {upcoming.map((a, i) => (
                        <AnniversaryCard key={a._id} item={a} index={i} />
                      ))}
                    </Box>
                  </Box>
                ) : null}

                {rest.length > 0 ? (
                  <Box>
                    {upcoming.length > 0 ? (
                      <Typography
                        sx={{
                          fontSize: "0.78rem",
                          fontWeight: 800,
                          letterSpacing: "0.22em",
                          textTransform: "uppercase",
                          color: "#8a3a52",
                          textAlign: "center",
                          mb: 2,
                        }}
                      >
                        All our group&rsquo;s anniversaries
                      </Typography>
                    ) : null}
                    <Box
                      sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: {
                          xs: "1fr",
                          sm: "repeat(2, 1fr)",
                          md: "repeat(3, 1fr)",
                        },
                      }}
                    >
                      {rest.map((a, i) => (
                        <AnniversaryCard key={a._id} item={a} index={i} />
                      ))}
                    </Box>
                  </Box>
                ) : null}
              </Stack>
            )}
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
}
