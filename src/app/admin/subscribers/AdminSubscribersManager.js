"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
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
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";

function formatDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString();
  } catch {
    return "—";
  }
}

const STATUS_COLORS = {
  pending: "warning",
  confirmed: "success",
  unsubscribed: "default",
};

export default function AdminSubscribersManager({
  initialItems,
  initialStatusCounts,
  initialSends,
  emailConfigured,
}) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [items, setItems] = React.useState(initialItems);
  const [statusCounts, setStatusCounts] = React.useState(initialStatusCounts);
  const [sends, setSends] = React.useState(initialSends);
  const [loading, setLoading] = React.useState(false);
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");
  const [sendBusy, setSendBusy] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  const confirmedCount = statusCounts.confirmed || 0;

  async function reloadList() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (search.trim()) params.set("q", search.trim());
      const res = await fetch(`/api/admin/subscribers?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load subscribers.");
      setItems(data.items);
      setStatusCounts(data.statusCounts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!window.confirm(`Send this update to ${confirmedCount} confirmed subscriber${confirmedCount === 1 ? "" : "s"}?`)) {
      return;
    }
    setSendBusy(true);
    setMessage("");
    setError("");
    try {
      const res = await fetch("/api/admin/newsletters/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed.");
      setMessage(data.message);
      setSubject("");
      setBody("");
      const historyRes = await fetch("/api/admin/newsletters/send");
      const history = await historyRes.json();
      if (historyRes.ok) setSends(history);
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setSendBusy(false);
    }
  }

  return (
    <Stack spacing={4}>
      {!emailConfigured ? (
        <Alert severity="warning">
          Set <code>SMTP_HOST</code>, <code>SMTP_USER</code>, <code>SMTP_PASS</code>, and{" "}
          <code>FROM_EMAIL</code> (Google App Password) to send confirmation and update emails.
        </Alert>
      ) : null}

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2, alignItems: { sm: "center" } }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Subscribers
          </Typography>
          <Button
            component="a"
            href="/api/admin/subscribers/export"
            variant="outlined"
            size="small"
          >
            Export confirmed CSV
          </Button>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
          <TextField
            select
            label="Status"
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="confirmed">Confirmed</MenuItem>
            <MenuItem value="unsubscribed">Unsubscribed</MenuItem>
          </TextField>
          <TextField
            label="Search email"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <Button variant="contained" onClick={reloadList} disabled={loading}>
            {loading ? "Loading…" : "Apply"}
          </Button>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Pending: {statusCounts.pending || 0} · Confirmed: {statusCounts.confirmed || 0} ·
          Unsubscribed: {statusCounts.unsubscribed || 0}
        </Typography>

        {items.length === 0 ? (
          <Typography color="text.secondary">No subscribers match this filter.</Typography>
        ) : (
          <Box sx={{ overflowX: "auto" }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Email</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Confirmed</TableCell>
                  <TableCell>Unsubscribed</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={String(item._id)}>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={item.status}
                        color={STATUS_COLORS[item.status] || "default"}
                      />
                    </TableCell>
                    <TableCell>{formatDate(item.confirmedAt)}</TableCell>
                    <TableCell>{formatDate(item.unsubscribedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Send update
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Sends to {confirmedCount} confirmed subscriber{confirmedCount === 1 ? "" : "s"}. Each
          email includes an unsubscribe link.
        </Typography>

        <Box component="form" onSubmit={handleSend}>
          <Stack spacing={2}>
            <TextField
              label="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              fullWidth
              inputProps={{ maxLength: 200 }}
            />
            <TextField
              label="Message"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              fullWidth
              multiline
              minRows={8}
              inputProps={{ maxLength: 50000 }}
              helperText="Plain text. Line breaks are preserved in the email."
            />
            <Button
              type="submit"
              variant="contained"
              disabled={sendBusy || !emailConfigured || confirmedCount === 0}
            >
              {sendBusy ? "Sending…" : "Send update"}
            </Button>
          </Stack>
        </Box>
      </Paper>

      {sends.length > 0 ? (
        <Paper variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Recent sends
          </Typography>
          <Stack spacing={2} divider={<Divider />}>
            {sends.map((send) => (
              <Box key={String(send._id)}>
                <Typography fontWeight={600}>{send.subject}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {formatDate(send.createdAt)} · {send.recipientCount} recipient
                  {send.recipientCount === 1 ? "" : "s"}
                  {send.sentBy ? ` · ${send.sentBy}` : ""}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      ) : null}

      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
    </Stack>
  );
}
