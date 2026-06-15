"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString();
  } catch {
    return "—";
  }
}

function visibilityChip(value) {
  return (
    <Chip
      size="small"
      label={value === "public" ? "Public" : "Group"}
      color={value === "public" ? "success" : "default"}
      variant="outlined"
    />
  );
}

export default function AdminMembersManager({ initialMembers }) {
  const [members] = React.useState(initialMembers);

  return (
    <Stack spacing={3}>
      <Typography variant="body2" color="text.secondary">
        Self-registered home group members. Editors see the full roster; public visibility is
        controlled by each member in their profile settings.
      </Typography>

      {members.length === 0 ? (
        <Typography color="text.secondary">No member accounts yet.</Typography>
      ) : (
        <Box sx={{ overflowX: "auto" }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Sobriety date</TableCell>
                <TableCell>Visibility</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((m) => (
                <TableRow key={m._id}>
                  <TableCell>{m.displayName}</TableCell>
                  <TableCell>{m.email || "—"}</TableCell>
                  <TableCell>{m.phone || "—"}</TableCell>
                  <TableCell>{formatDate(m.sobrietyDate)}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5} sx={{ flexWrap: "wrap", gap: 0.5 }}>
                      {m.visibility?.name ? visibilityChip(m.visibility.name) : null}
                      {m.visibility?.sobrietyDate
                        ? visibilityChip(m.visibility.sobrietyDate)
                        : null}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Mailing addresses
        </Typography>
        {members.filter((m) => m.mailingAddress).length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No addresses on file.
          </Typography>
        ) : (
          <Stack spacing={2}>
            {members
              .filter((m) => m.mailingAddress)
              .map((m) => (
                <Box key={`addr-${m._id}`}>
                  <Typography fontWeight={600}>{m.displayName}</Typography>
                  <Typography variant="body2">{m.mailingAddress}</Typography>
                  {m.cityStateZip ? (
                    <Typography variant="body2" color="text.secondary">
                      {m.cityStateZip}
                    </Typography>
                  ) : null}
                </Box>
              ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
