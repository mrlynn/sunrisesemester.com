"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { formatMonthLabel } from "@/lib/businessMeetingShared";

export default function CommitmentScheduleTable({ schedule }) {
  if (!schedule?.columns?.length) return null;
  const monthLabel = formatMonthLabel(schedule.appliesToMonth);
  return (
    <Box sx={{ overflowX: "auto" }}>
      {schedule.title ? (
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{
            fontWeight: 800,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            mb: monthLabel ? 0.5 : 1.5,
            color: "#5b2c6f",
          }}
        >
          {schedule.title}
        </Typography>
      ) : null}
      {monthLabel ? (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Applies to {monthLabel}
        </Typography>
      ) : null}
      <Table
        size="small"
        sx={{
          minWidth: 400,
          "& th, & td": { border: "1px solid rgba(0,0,0,0.12)" },
          "& th": { fontWeight: 700, bgcolor: "rgba(91,44,111,0.06)" },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>Day</TableCell>
            {schedule.columns.map((col, i) => (
              <TableCell key={i}>{col}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {(schedule.rows || []).map((row, ri) => (
            <TableRow key={ri}>
              <TableCell sx={{ fontWeight: 600 }}>{row.day}</TableCell>
              {schedule.columns.map((_, ci) => (
                <TableCell key={ci}>{row.cells?.[ci] || "—"}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
