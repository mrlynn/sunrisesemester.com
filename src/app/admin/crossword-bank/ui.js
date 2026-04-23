"use client";

import * as React from "react";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import MenuItem from "@mui/material/MenuItem";

function parseTags(value) {
  return String(value || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 12);
}

export default function CrosswordBankClient({ initialData }) {
  const [items, setItems] = React.useState(Array.isArray(initialData?.items) ? initialData.items : []);
  const [total, setTotal] = React.useState(Number(initialData?.total || items.length));
  const [page, setPage] = React.useState(Number(initialData?.page || 1));
  const [pages, setPages] = React.useState(Number(initialData?.pages || 1));
  const [limit, setLimit] = React.useState(Number(initialData?.limit || 25));

  const [q, setQ] = React.useState("");
  const [tagFilter, setTagFilter] = React.useState("");
  const [enabledFilter, setEnabledFilter] = React.useState("all"); // all | true | false
  const [loading, setLoading] = React.useState(false);

  const [answer, setAnswer] = React.useState("");
  const [clue, setClue] = React.useState("");
  const [tags, setTags] = React.useState("recovery");
  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  const queryRef = React.useRef({ q: "", tag: "", enabled: "all", page: 1, limit: 25 });

  async function fetchPage(next) {
    setError("");
    setLoading(true);
    try {
      const sp = new URLSearchParams();
      if (next.q) sp.set("q", next.q);
      if (next.tag) sp.set("tag", next.tag);
      if (next.enabled === "true") sp.set("enabled", "true");
      if (next.enabled === "false") sp.set("enabled", "false");
      sp.set("page", String(next.page));
      sp.set("limit", String(next.limit));

      const res = await fetch(`/api/admin/crossword-entries?${sp.toString()}`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not load entries.");

      setItems(Array.isArray(data.items) ? data.items : []);
      setTotal(Number(data.total || 0));
      setPage(Number(data.page || 1));
      setPages(Number(data.pages || 1));
      setLimit(Number(data.limit || next.limit));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  // Debounced fetch when filters/search change.
  React.useEffect(() => {
    const t = setTimeout(() => {
      const next = { q: q.trim(), tag: tagFilter.trim(), enabled: enabledFilter, page: 1, limit };
      queryRef.current = next;
      fetchPage(next);
    }, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, tagFilter, enabledFilter, limit]);

  async function addEntry() {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/crossword-entries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ answer, clue, tags: parseTags(tags) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not add entry.");
      // Refresh current view to keep paging accurate.
      fetchPage(queryRef.current);
      setAnswer("");
      setClue("");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function toggleEnabled(id, enabled) {
    setError("");
    try {
      const res = await fetch(`/api/admin/crossword-entries/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ enabled }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not update.");
      setItems((prev) => prev.map((x) => (String(x._id) === String(id) ? data : x)));
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          Crossword entry library
        </Typography>
        <Typography color="text.secondary">
          Add answers + clues here. The puzzle generator uses enabled entries.
        </Typography>

        {error ? <Alert severity="error">{error}</Alert> : null}
        {loading ? <Alert severity="info">Loading…</Alert> : null}

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <Stack spacing={2}>
            <Typography sx={{ fontWeight: 800 }}>Add entry</Typography>
            <TextField
              label="Answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="HONESTY"
              fullWidth
            />
            <TextField
              label="Clue"
              value={clue}
              onChange={(e) => setClue(e.target.value)}
              placeholder="A spiritual principle (Step 1)"
              fullWidth
            />
            <TextField
              label="Tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="recovery,steps"
              fullWidth
            />
            <Button onClick={addEntry} disabled={busy} variant="contained" sx={{ fontWeight: 800, alignSelf: "flex-start" }}>
              {busy ? "Adding…" : "Add"}
            </Button>
          </Stack>
        </Paper>

        <Divider />

        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, borderColor: "#eee" }}>
          <Stack spacing={1.5}>
            <Typography sx={{ fontWeight: 900 }}>Search & filter</Typography>
            <TextField
              label="Search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="answer or clue…"
              fullWidth
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField
                label="Tag"
                value={tagFilter}
                onChange={(e) => setTagFilter(e.target.value)}
                placeholder="recovery"
                fullWidth
              />
              <TextField
                label="Enabled"
                value={enabledFilter}
                onChange={(e) => setEnabledFilter(e.target.value)}
                select
                fullWidth
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="true">Enabled</MenuItem>
                <MenuItem value="false">Disabled</MenuItem>
              </TextField>
              <TextField
                label="Per page"
                value={String(limit)}
                onChange={(e) => setLimit(Number(e.target.value) || 25)}
                select
                fullWidth
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </TextField>
            </Stack>
            <Typography sx={{ color: "#666", fontSize: "0.9rem" }}>
              Showing <strong>{items.length}</strong> of <strong>{total}</strong>
            </Typography>
            <Pagination
              count={pages}
              page={page}
              onChange={(_e, nextPage) => {
                const next = { ...queryRef.current, page: nextPage, limit };
                queryRef.current = next;
                fetchPage(next);
              }}
              shape="rounded"
            />
          </Stack>
        </Paper>

        <Typography sx={{ fontWeight: 900 }}>Entries</Typography>
        <Stack spacing={1.25}>
          {items.map((it) => (
            <Paper key={String(it._id)} variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Stack spacing={1}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                  <Typography sx={{ fontWeight: 900 }}>{it.answerNormalized || it.answer}</Typography>
                  <Chip size="small" label={it.enabled === false ? "Disabled" : "Enabled"} color={it.enabled === false ? "default" : "success"} />
                  <Box sx={{ flexGrow: 1 }} />
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => toggleEnabled(it._id, it.enabled === false)}
                  >
                    {it.enabled === false ? "Enable" : "Disable"}
                  </Button>
                </Stack>
                <Typography sx={{ color: "#555" }}>{it.clue}</Typography>
                {Array.isArray(it.tags) && it.tags.length ? (
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                    {it.tags.map((t) => (
                      <Chip key={t} size="small" label={t} />
                    ))}
                  </Stack>
                ) : null}
              </Stack>
            </Paper>
          ))}
          {items.length === 0 ? <Typography color="text.secondary">No entries yet.</Typography> : null}
        </Stack>
      </Stack>
    </Container>
  );
}

