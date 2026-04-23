"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import { validateCrosswordData } from "@/lib/crosswordValidation";
import Crossword, { ThemeProvider } from "@jaredreisinger/react-crossword";
import Box from "@mui/material/Box";

function toIsoDateOnly(value) {
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function defaultCrosswordData() {
  return {
    across: {
      1: { clue: "A spiritual principle (Step 1)", answer: "HONESTY", row: 0, col: 0 },
    },
    down: {
      1: { clue: "Headwear", answer: "HAT", row: 0, col: 0 },
      2: { clue: "A quick nap", answer: "NOD", row: 0, col: 2 },
    },
  };
}

export default function PuzzleEditorForm({ mode, initialPuzzle }) {
  const router = useRouter();
  const [error, setError] = React.useState("");
  const [jsonError, setJsonError] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [previewData, setPreviewData] = React.useState(null);

  const [slug, setSlug] = React.useState(initialPuzzle?.slug || "");
  const [title, setTitle] = React.useState(initialPuzzle?.title || "");
  const [status, setStatus] = React.useState(initialPuzzle?.status || "draft");
  const [weekOf, setWeekOf] = React.useState(
    initialPuzzle?.weekOf ? toIsoDateOnly(initialPuzzle.weekOf) : toIsoDateOnly(new Date()),
  );
  const [publishedAt, setPublishedAt] = React.useState(
    initialPuzzle?.publishedAt ? new Date(initialPuzzle.publishedAt).toISOString().slice(0, 16) : "",
  );
  const [jsonText, setJsonText] = React.useState(() => {
    const data = initialPuzzle?.crosswordData || defaultCrosswordData();
    return JSON.stringify(data, null, 2);
  });

  React.useEffect(() => {
    // Light debounce validation for nicer UX.
    const t = setTimeout(() => {
      try {
        const parsed = JSON.parse(jsonText);
        const valid = validateCrosswordData(parsed);
        setJsonError(valid.ok ? "" : valid.error);
        setPreviewData(valid.ok ? parsed : null);
      } catch {
        setJsonError("Crossword JSON is not valid.");
        setPreviewData(null);
      }
    }, 250);
    return () => clearTimeout(t);
  }, [jsonText]);

  React.useEffect(() => {
    if (status !== "published") {
      return;
    }
    if (publishedAt) {
      return;
    }
    const d = new Date();
    d.setSeconds(0, 0);
    setPublishedAt(d.toISOString().slice(0, 16));
  }, [status, publishedAt]);

  async function onSave(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      let crosswordData;
      try {
        crosswordData = JSON.parse(jsonText);
      } catch {
        throw new Error("Crossword JSON is not valid.");
      }
      const valid = validateCrosswordData(crosswordData);
      if (!valid.ok) {
        throw new Error(valid.error);
      }

      const body = {
        slug: slug || undefined,
        title,
        status,
        weekOf: weekOf ? new Date(`${weekOf}T00:00:00`) : undefined,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        crosswordData,
      };

      const url =
        mode === "edit"
          ? `/api/admin/puzzles/${encodeURIComponent(String(initialPuzzle._id))}`
          : "/api/admin/puzzles";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save puzzle.");

      if (mode === "new") {
        router.push(`/admin/puzzles/${String(data._id)}`);
      } else {
        router.refresh();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function generateFromBank() {
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/puzzles/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ targetWords: 10, tag: "recovery" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not generate puzzle.");
      setJsonText(JSON.stringify(data.crosswordData, null, 2));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  const previewTheme = {
    gridBackground: "transparent",
    cellBackground: "#ffffff",
    cellBorder: "rgba(0,0,0,0.18)",
    textColor: "#1d1d1d",
    numberColor: "rgba(0,0,0,0.28)",
    focusBackground: "rgba(255,107,53,0.25)",
    highlightBackground: "rgba(255,215,125,0.35)",
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          {mode === "new" ? "New puzzle" : "Edit puzzle"}
        </Typography>

        {error ? <Alert severity="error">{error}</Alert> : null}
        {jsonError ? <Alert severity="warning">{jsonError}</Alert> : null}

        <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
          <form onSubmit={onSave}>
            <Stack spacing={2.5}>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
              />
              <TextField
                label="Slug (optional)"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                helperText="Defaults to YYYY-MM-DD based on weekOf if empty."
                fullWidth
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Week of"
                  type="date"
                  value={weekOf}
                  onChange={(e) => setWeekOf(e.target.value)}
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                />
                <TextField
                  label="Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  select
                  fullWidth
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </TextField>
              </Stack>
              <TextField
                label="Published at (optional)"
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
                helperText="If published, this controls ordering for “current puzzle”."
              />

              <TextField
                label="Crossword JSON"
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                multiline
                minRows={18}
                fullWidth
                helperText="Format matches @jaredreisinger/react-crossword data: { across: { 1: { clue, answer, row, col } }, down: { ... } }"
              />
              <Button
                onClick={generateFromBank}
                disabled={busy}
                variant="outlined"
                sx={{ alignSelf: "flex-start", fontWeight: 900 }}
              >
                Generate from crossword bank
              </Button>

              <Box>
                <Typography sx={{ fontWeight: 800, mb: 1, color: "#1d1d1d" }}>
                  Live preview
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    borderColor: "#eee",
                    background: previewData ? "#fff" : "#fafafa",
                  }}
                >
                  {previewData ? (
                    <ThemeProvider theme={previewTheme}>
                      <Crossword data={previewData} useStorage={false} />
                    </ThemeProvider>
                  ) : (
                    <Typography sx={{ color: "#777", fontSize: "0.95rem" }}>
                      Fix the JSON/overlaps above to see a live preview.
                    </Typography>
                  )}
                </Paper>
              </Box>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button type="submit" variant="contained" disabled={busy}>
                  {busy ? "Saving…" : "Save"}
                </Button>
                <Button variant="outlined" onClick={() => router.push("/admin/puzzles")} disabled={busy}>
                  Back
                </Button>
                {mode === "edit" ? (
                  <Button
                    variant="text"
                    href={`/puzzles/${encodeURIComponent(String(initialPuzzle.slug))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    disabled={busy}
                  >
                    View puzzle
                  </Button>
                ) : null}
              </Stack>
            </Stack>
          </form>
        </Paper>
      </Stack>
    </Container>
  );
}

