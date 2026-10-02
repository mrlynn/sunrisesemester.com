"use client";

import * as React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { REPORT_CATEGORIES, REPORT_STATUSES } from "@/lib/reports";

function formatDate(value) {
  if (!value) return "Unknown";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "Unknown";
  }
}

function statusColor(status) {
  switch (status) {
    case "new":
      return "warning";
    case "reviewed":
      return "info";
    case "closed":
      return "success";
    default:
      return "default";
  }
}

function hasContact(item) {
  return Boolean(item?.contactEmail || item?.contactPhone);
}

function DetailLine({ label, value, preserveWhitespace = false }) {
  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={preserveWhitespace ? { whiteSpace: "pre-wrap", wordBreak: "break-word" } : undefined}
      >
        {value || "None"}
      </Typography>
    </Box>
  );
}

export default function AdminReportsManager({ initialItems, initialStatusCounts }) {
  const [items, setItems] = React.useState(initialItems);
  const [statusCounts, setStatusCounts] = React.useState(initialStatusCounts);
  const [statusFilter, setStatusFilter] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("");
  const [selectedId, setSelectedId] = React.useState(
    initialItems[0] ? String(initialItems[0]._id) : "",
  );
  const [selectedItem, setSelectedItem] = React.useState(initialItems[0] || null);
  const [selectedStatus, setSelectedStatus] = React.useState(initialItems[0]?.status || "new");
  const [adminNotes, setAdminNotes] = React.useState(initialItems[0]?.adminNotes || "");
  const [loading, setLoading] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  function applySelectedItem(item) {
    setSelectedId(item ? String(item._id) : "");
    setSelectedItem(item);
    setSelectedStatus(item?.status || "new");
    setAdminNotes(item?.adminNotes || "");
  }

  async function reloadList({ keepMessage = false } = {}) {
    setLoading(true);
    setError("");
    if (!keepMessage) {
      setMessage("");
    }

    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (categoryFilter) params.set("category", categoryFilter);
      const query = params.toString();
      const res = await fetch(query ? `/api/admin/reports?${query}` : "/api/admin/reports");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to load reports.");
      }

      setItems(data.items);
      setStatusCounts(data.statusCounts);

      const match = data.items.find((item) => String(item._id) === selectedId);
      if (match) {
        applySelectedItem(match);
      } else if (data.items[0]) {
        applySelectedItem(data.items[0]);
      } else {
        applySelectedItem(null);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!selectedItem) return;

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(`/api/admin/reports/${selectedId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          status: selectedStatus,
          adminNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save report.");
      }

      setItems((list) =>
        list.map((item) => (String(item._id) === String(data.item._id) ? data.item : item)),
      );
      applySelectedItem(data.item);
      setMessage("Report saved.");
      await reloadList({ keepMessage: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ mb: 2, alignItems: { md: "center" } }}
        >
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Reports inbox
          </Typography>
          <Button variant="contained" onClick={reloadList} disabled={loading}>
            {loading ? "Loading..." : "Reload"}
          </Button>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
          <TextField
            select
            label="Status"
            size="small"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All</MenuItem>
            {REPORT_STATUSES.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Category"
            size="small"
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            sx={{ minWidth: 180 }}
          >
            <MenuItem value="">All</MenuItem>
            {REPORT_CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          New: {statusCounts.new || 0} · Reviewed: {statusCounts.reviewed || 0} · Closed:{" "}
          {statusCounts.closed || 0}
        </Typography>

        {items.length === 0 ? (
          <Typography color="text.secondary">No reports match this filter.</Typography>
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Created</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Contact</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => {
                  const isSelected = String(item._id) === selectedId;
                  return (
                    <TableRow
                      key={String(item._id)}
                      hover
                      onClick={() => applySelectedItem(item)}
                      selected={isSelected}
                      sx={{
                        cursor: "pointer",
                        "&:last-child td": { borderBottom: 0 },
                      }}
                    >
                      <TableCell>{formatDate(item.createdAt)}</TableCell>
                      <TableCell sx={{ textTransform: "capitalize" }}>{item.category}</TableCell>
                      <TableCell>{item.subject}</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={item.status}
                          color={statusColor(item.status)}
                          variant={item.status === "closed" ? "outlined" : "filled"}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={hasContact(item) ? "Yes" : "No"}
                          color={hasContact(item) ? "success" : "default"}
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Report detail
        </Typography>

        {!selectedItem ? (
          <Typography color="text.secondary">Select a report to view its details.</Typography>
        ) : (
          <Stack spacing={2.5}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <DetailLine label="Created" value={formatDate(selectedItem.createdAt)} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <DetailLine label="Category" value={selectedItem.category} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <DetailLine label="Subject" value={selectedItem.subject} />
              </Box>
            </Stack>

            <DetailLine label="Body" value={selectedItem.body} preserveWhitespace />

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <DetailLine label="Contact email" value={selectedItem.contactEmail} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <DetailLine label="Contact phone" value={selectedItem.contactPhone} />
              </Box>
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <Box sx={{ flex: 1 }}>
                <DetailLine label="IP" value={selectedItem.ip} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <DetailLine
                  label="User agent"
                  value={selectedItem.userAgent}
                  preserveWhitespace
                />
              </Box>
            </Stack>

            <Divider />

            <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
              <TextField
                select
                label="Status"
                size="small"
                value={selectedStatus}
                onChange={(event) => setSelectedStatus(event.target.value)}
                sx={{ minWidth: 180 }}
              >
                {REPORT_STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
              <Box sx={{ flexGrow: 1 }} />
              <Button variant="contained" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            </Stack>

            <TextField
              label="Admin notes"
              value={adminNotes}
              onChange={(event) => setAdminNotes(event.target.value)}
              multiline
              minRows={6}
              fullWidth
              inputProps={{ maxLength: 5000 }}
            />
          </Stack>
        )}
      </Paper>

      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
    </Stack>
  );
}
