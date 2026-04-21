"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function DayTile({ month, day, title, isToday }) {
  return (
    <Box
      component={Link}
      href={`/reflections/${month}/${day}`}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 0.75,
        p: 2,
        borderRadius: 2,
        textDecoration: "none",
        color: "#2d1b4e",
        background: isToday
          ? "linear-gradient(135deg, rgba(196,60,104,0.18) 0%, rgba(255,107,53,0.18) 100%)"
          : "rgba(255,255,255,0.65)",
        border: isToday
          ? "1px solid rgba(196,60,104,0.5)"
          : "1px solid rgba(196,60,104,0.15)",
        boxShadow: "0 4px 16px rgba(91,44,111,0.06)",
        backdropFilter: "blur(4px)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
        overflow: "hidden",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(91,44,111,0.14)",
          borderColor: "rgba(196,60,104,0.45)",
        },
      }}
    >
      <Stack direction="row" spacing={1} sx={{ alignItems: "baseline" }}>
        <Typography
          sx={{
            fontFamily: 'var(--font-serif), Georgia, serif',
            fontSize: "1.6rem",
            fontWeight: 800,
            lineHeight: 1,
            color: "#c43c68",
          }}
        >
          {day}
        </Typography>
        {isToday ? (
          <Typography
            sx={{
              fontSize: "0.62rem",
              fontWeight: 800,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#ff6b35",
            }}
          >
            Today
          </Typography>
        ) : null}
      </Stack>
      <Typography
        sx={{
          fontSize: "0.85rem",
          fontWeight: 600,
          lineHeight: 1.3,
          color: "#2c1a3d",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          minHeight: "2.2em",
        }}
      >
        {title || "—"}
      </Typography>
    </Box>
  );
}

export default function ReflectionsArchive({ reflections, today }) {
  const byMonth = React.useMemo(() => {
    const map = new Map();
    for (const r of reflections) {
      if (!map.has(r.month)) map.set(r.month, []);
      map.get(r.month).push(r);
    }
    return map;
  }, [reflections]);

  const [selected, setSelected] = React.useState(today.month);

  const days = byMonth.get(selected) || [];

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        py: { xs: 6, md: 10 },
        background:
          "linear-gradient(180deg, #fff4d6 0%, #ffe4b8 40%, #ffcfa1 100%)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "-120px",
          right: "-120px",
          width: 380,
          height: 380,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,180,80,0.45) 0%, rgba(255,107,53,0.12) 50%, transparent 75%)",
          filter: "blur(18px)",
          pointerEvents: "none",
        }}
      />
      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Stack spacing={2} sx={{ mb: { xs: 4, md: 6 }, alignItems: "center" }}>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", justifyContent: "center" }}
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
                ✦ Daily Reflections Archive ✦
              </Typography>
              <Box sx={{ width: 40, height: 1, background: "#c43c68", opacity: 0.4 }} />
            </Stack>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: "2.25rem", sm: "3rem", md: "3.75rem" },
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                color: "#2d1b4e",
                textAlign: "center",
                fontFamily: 'var(--font-serif), Georgia, serif',
              }}
            >
              A reflection for every day
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
                maxWidth: 640,
                color: "#4a3560",
                fontSize: { xs: "1rem", md: "1.08rem" },
                lineHeight: 1.65,
              }}
            >
              Browse the year. Pick any day to read that morning&rsquo;s quote, its source,
              and a short reflection written by a member of the Fellowship.
            </Typography>
            <Button
              component={Link}
              href={`/reflections/${today.month}/${today.day}`}
              startIcon={<AutoStoriesIcon />}
              sx={{
                mt: 1,
                px: 3,
                py: 1.25,
                borderRadius: 8,
                background: "linear-gradient(135deg, #c43c68 0%, #ff6b35 100%)",
                color: "#fff",
                fontWeight: 700,
                letterSpacing: "0.04em",
                boxShadow: "0 4px 16px rgba(196,60,104,0.3)",
                "&:hover": {
                  background: "linear-gradient(135deg, #b32f5a 0%, #ef5e2a 100%)",
                  boxShadow: "0 6px 20px rgba(196,60,104,0.4)",
                },
              }}
            >
              Today&rsquo;s reflection
            </Button>
          </Stack>
        </motion.div>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 1,
            mb: { xs: 4, md: 5 },
          }}
        >
          {MONTH_NAMES.map((name, idx) => {
            const m = idx + 1;
            const isActive = m === selected;
            return (
              <Button
                key={name}
                onClick={() => setSelected(m)}
                sx={{
                  minWidth: 0,
                  px: 2,
                  py: 0.75,
                  borderRadius: 999,
                  fontSize: { xs: "0.78rem", md: "0.85rem" },
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  color: isActive ? "#fff" : "#5b2c6f",
                  background: isActive
                    ? "linear-gradient(135deg, #5b2c6f 0%, #c43c68 100%)"
                    : "rgba(255,255,255,0.55)",
                  border: isActive
                    ? "1px solid transparent"
                    : "1px solid rgba(91,44,111,0.18)",
                  boxShadow: isActive ? "0 4px 14px rgba(91,44,111,0.3)" : "none",
                  "&:hover": {
                    background: isActive
                      ? "linear-gradient(135deg, #4a2359 0%, #b32f5a 100%)"
                      : "rgba(255,255,255,0.85)",
                  },
                }}
              >
                {name}
              </Button>
            );
          })}
        </Box>

        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {days.length === 0 ? (
            <Typography
              sx={{
                textAlign: "center",
                color: "#5b2c6f",
                fontStyle: "italic",
                py: 6,
              }}
            >
              No reflections loaded for {MONTH_NAMES[selected - 1]} yet.
            </Typography>
          ) : (
            <Box
              sx={{
                display: "grid",
                gap: 1.5,
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                  md: "repeat(5, 1fr)",
                  lg: "repeat(7, 1fr)",
                },
              }}
            >
              {days.map((d) => (
                <DayTile
                  key={`${d.month}-${d.day}`}
                  month={d.month}
                  day={d.day}
                  title={d.title}
                  isToday={d.month === today.month && d.day === today.day}
                />
              ))}
            </Box>
          )}
        </motion.div>
      </Container>
    </Box>
  );
}
