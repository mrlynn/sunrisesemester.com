"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import WeeklyServiceSection from "@/components/WeeklyServiceSection";
import CommitmentScheduleTable from "@/components/CommitmentScheduleTable";

function SectionNav() {
  const items = [
    { href: "#weekly", label: "This week" },
    { href: "#monthly", label: "Monthly schedule" },
    { href: "#minutes", label: "Meeting minutes" },
  ];
  return (
    <Stack direction="row" spacing={1} useFlexGap sx={{ mb: 4, flexWrap: "wrap" }}>
      {items.map((item) => (
        <Chip
          key={item.href}
          component="a"
          href={item.href}
          clickable
          label={item.label}
          variant="outlined"
          sx={{
            fontWeight: 600,
            borderColor: "rgba(196,60,104,0.35)",
            "&:hover": { borderColor: "#c43c68", bgcolor: "rgba(196,60,104,0.06)" },
          }}
        />
      ))}
    </Stack>
  );
}

function MinutesList({ meetings }) {
  if (meetings.length === 0) {
    return (
      <Typography color="text.secondary">
        No published minutes yet. After the monthly business meeting, the secretary will post
        them here.
      </Typography>
    );
  }
  return (
    <Stack spacing={1.5}>
      {meetings.map((m) => (
        <Paper
          key={m._id}
          component={Link}
          href={`/business-meetings/${m.slug}`}
          variant="outlined"
          sx={{
            p: 2,
            textDecoration: "none",
            color: "inherit",
            borderRadius: 2,
            transition: "border-color 0.2s, box-shadow 0.2s",
            "&:hover": {
              borderColor: "#c43c68",
              boxShadow: "0 4px 16px rgba(91,44,111,0.08)",
            },
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {m.label}
          </Typography>
          {m.chair ? (
            <Typography variant="body2" color="text.secondary">
              Chair: {m.chair}
            </Typography>
          ) : null}
        </Paper>
      ))}
    </Stack>
  );
}

function ScheduleBlock({ view, emptyCopy }) {
  const schedules = view?.schedules || [];
  const source = view?.source;

  if (schedules.length === 0) {
    return (
      <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
        <Typography color="text.secondary">{emptyCopy}</Typography>
      </Paper>
    );
  }

  return (
    <Stack spacing={3}>
      {source ? (
        <Typography variant="body2" color="text.secondary">
          From the {source.label} business meeting{" "}
          <Link
            href={`/business-meetings/${source.slug}`}
            style={{ color: "#c43c68", fontWeight: 600 }}
          >
            (view full minutes)
          </Link>
          .
        </Typography>
      ) : null}
      {schedules.map((sched, i) => (
        <Paper
          key={i}
          variant="outlined"
          sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, bgcolor: "rgba(255,255,255,0.9)" }}
        >
          <CommitmentScheduleTable schedule={sched} />
        </Paper>
      ))}
    </Stack>
  );
}

export default function GroupServiceHub({ weeklyService, commitment, meetings }) {
  const current = commitment?.current || {
    schedules: commitment?.schedules || [],
    source: commitment?.source || null,
    monthLabel: commitment?.monthLabel || "",
  };
  const next = commitment?.next || null;
  const showNext = Boolean(next?.schedules?.length);

  return (
    <Box sx={{ bgcolor: "#faf8f6", minHeight: "60vh", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="md">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="overline"
            sx={{ color: "#c43c68", fontWeight: 700, letterSpacing: "0.28em" }}
          >
            Group service
          </Typography>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 800, mt: 1 }}>
            Business meetings &amp; service assignments
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1.5, maxWidth: 600 }}>
            Who is chairing and sherpaing this week, the monthly commitment schedule voted on
            at business meeting, and archived minutes for the home group.
          </Typography>

          <SectionNav />

          <Stack spacing={{ xs: 6, md: 8 }}>
            <Box id="weekly" component="section">
              <WeeklyServiceSection schedule={weeklyService} />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                Also on the{" "}
                <Link href="/meetings" style={{ color: "#c43c68", fontWeight: 600 }}>
                  Meetings
                </Link>{" "}
                page for newcomers checking the daily schedule.
              </Typography>
            </Box>

            <Box id="monthly" component="section">
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "2.75rem" },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: "#1d1d1d",
                  fontFamily: "var(--font-serif), Georgia, serif",
                  mb: 1,
                }}
              >
                {current.monthLabel
                  ? `${current.monthLabel} commitment schedule`
                  : "Monthly commitment schedule"}
              </Typography>
              <Typography sx={{ fontSize: "1.05rem", color: "#666666", mb: 3, maxWidth: 560 }}>
                Chair, sherpa, and other service slots for this month — set at the previous
                business meeting (second Tuesday) for the month ahead.
              </Typography>
              <ScheduleBlock
                view={current}
                emptyCopy="No schedule has been published for this month yet. It appears when the prior month’s business meeting minutes include the commitment tables."
              />

              {showNext ? (
                <Box sx={{ mt: 5 }}>
                  <Typography
                    component="h3"
                    sx={{
                      fontSize: { xs: "1.35rem", md: "1.6rem" },
                      fontWeight: 800,
                      color: "#1d1d1d",
                      fontFamily: "var(--font-serif), Georgia, serif",
                      mb: 1,
                    }}
                  >
                    Coming up: {next.monthLabel}
                  </Typography>
                  <Typography sx={{ fontSize: "1rem", color: "#666666", mb: 2, maxWidth: 560 }}>
                    Already voted at this month’s business meeting — takes effect next month.
                  </Typography>
                  <ScheduleBlock view={next} emptyCopy="" />
                </Box>
              ) : null}
            </Box>

            <Box id="minutes" component="section">
              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: "2rem", md: "2.75rem" },
                  fontWeight: 800,
                  lineHeight: 1.1,
                  color: "#1d1d1d",
                  fontFamily: "var(--font-serif), Georgia, serif",
                  mb: 1,
                }}
              >
                Business meeting minutes
              </Typography>
              <Typography sx={{ fontSize: "1.05rem", color: "#666666", mb: 3, maxWidth: 560 }}>
                Full notes from each monthly business meeting — treasurer, GSR, motions, and
                attached reports.
              </Typography>
              <MinutesList meetings={meetings} />
            </Box>
          </Stack>

          <Box sx={{ mt: 6, textAlign: "center" }}>
            <Button component={Link} href="/meetings" variant="outlined" color="inherit">
              Back to meeting schedule
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
