"use client";

import * as React from "react";
import { motion } from "motion/react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";

function displayName(value) {
  const v = String(value || "").trim();
  return v || "—";
}

export default function WeeklyServiceSection({ schedule }) {
  const days = schedule?.days || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Typography
        component="h2"
        sx={{
          fontSize: { xs: "2rem", md: "2.75rem" },
          fontWeight: 800,
          lineHeight: 1.1,
          color: "#1d1d1d",
          fontFamily: 'var(--font-serif), Georgia, serif',
          mb: 1,
        }}
      >
        This week&apos;s service.
      </Typography>
      <Typography sx={{ fontSize: "1.05rem", color: "#666666", mb: 3, maxWidth: 560 }}>
        Daily Sunrise chair and sherpa assignments (Monday–Friday 7:15 AM, Sunday 8:00 AM).
      </Typography>
      <Box
        sx={{
          overflowX: "auto",
          borderRadius: 3,
          border: "1px solid rgba(196,60,104,0.2)",
          background: "rgba(255,255,255,0.85)",
        }}
      >
        <Table size="medium" sx={{ minWidth: 420 }}>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, width: "28%" }}>Day</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Chair</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Sherpa</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {days.map((row) => (
              <TableRow key={row.key}>
                <TableCell sx={{ fontWeight: 600 }}>{row.label}</TableCell>
                {row.openChair ? (
                  <TableCell colSpan={2}>
                    <Chip
                      label="Open Chair"
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor: "rgba(91,44,111,0.08)",
                        color: "#5b2c6f",
                      }}
                    />
                  </TableCell>
                ) : (
                  <>
                    <TableCell>{displayName(row.chair)}</TableCell>
                    <TableCell>{displayName(row.sherpa)}</TableCell>
                  </>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      {schedule?.notes?.trim() ? (
        <Typography sx={{ mt: 2, color: "text.secondary", fontSize: "0.95rem" }}>
          {schedule.notes}
        </Typography>
      ) : null}
    </motion.div>
  );
}
