"use client";

import * as React from "react";
import Link from "next/link";
import Crossword, { ThemeProvider } from "@jaredreisinger/react-crossword";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";

function formatDuration(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function formatWeekOf(value) {
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

function keyFor(row, col) {
  return `${row},${col}`;
}

export default function PuzzleSolvePage({ slug }) {
  const crosswordRef = React.useRef(null);
  const saveTimer = React.useRef(null);
  const [loading, setLoading] = React.useState(true);
  const [puzzle, setPuzzle] = React.useState(null);
  const [run, setRun] = React.useState(null);
  const [me, setMe] = React.useState(null);
  const [guesses, setGuesses] = React.useState({});
  const [leaderboard, setLeaderboard] = React.useState([]);
  const [error, setError] = React.useState("");
  const [info, setInfo] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  async function loadAll() {
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const res = await fetch(`/api/puzzles/${encodeURIComponent(slug)}`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPuzzle(null);
        setMe(null);
        setRun(null);
        setGuesses({});
        throw new Error(
          data.error ||
            "Could not load puzzle. (If you just created it in the editor, make sure it is Published.)",
        );
      }
      setPuzzle(data.puzzle);
      setMe(data.me);
      setRun(data.run);

      const state = data.run?.gridState && typeof data.run.gridState === "object" ? data.run.gridState : {};
      setGuesses(state);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadLeaderboard() {
    try {
      const res = await fetch(`/api/puzzles/${encodeURIComponent(slug)}/leaderboard`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setLeaderboard(Array.isArray(data.leaderboard) ? data.leaderboard : []);
    } catch {
      // ignore
    }
  }

  React.useEffect(() => {
    loadAll();
    loadLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  // Rehydrate guesses into the crossword after it mounts.
  React.useEffect(() => {
    if (!crosswordRef.current) return;
    const entries = Object.entries(guesses || {});
    for (const [k, v] of entries) {
      const [rowStr, colStr] = String(k).split(",");
      const row = Number(rowStr);
      const col = Number(colStr);
      const guess = String(v || "").slice(0, 1);
      if (Number.isFinite(row) && Number.isFinite(col) && guess) {
        try {
          crosswordRef.current.setGuess(row, col, guess);
        } catch {
          // ignore
        }
      }
    }
  }, [guesses]);

  function scheduleSave(nextGuesses) {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }
    saveTimer.current = setTimeout(async () => {
      try {
        await fetch(`/api/puzzles/${encodeURIComponent(slug)}/save`, {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ gridState: nextGuesses, checksUsed: run?.checksUsed || 0, revealsUsed: run?.revealsUsed || 0 }),
        });
      } catch {
        // ignore
      }
    }, 800);
  }

  async function ensureStarted() {
    if (run?.startedAt) return;
    const res = await fetch(`/api/puzzles/${encodeURIComponent(slug)}/start`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setRun(data.run);
    }
  }

  async function onCellChange(row, col, char) {
    if (run?.completedAt) return;
    await ensureStarted();
    setGuesses((prev) => {
      const next = { ...(prev || {}) };
      const k = keyFor(row, col);
      const val = String(char || "").toUpperCase().slice(0, 1);
      if (!val) {
        delete next[k];
      } else {
        next[k] = val;
      }
      scheduleSave(next);
      return next;
    });
  }

  async function submitIfCorrect() {
    setError("");
    setInfo("");
    setSubmitting(true);
    try {
      await ensureStarted();
      const correct = Boolean(crosswordRef.current?.isCrosswordCorrect?.());
      if (!correct) {
        setInfo("Not quite yet. Keep going.");
        return;
      }
      const res = await fetch(`/api/puzzles/${encodeURIComponent(slug)}/complete`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ gridState: guesses, checksUsed: run?.checksUsed || 0, revealsUsed: run?.revealsUsed || 0 }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not submit.");
      setRun((prev) => ({ ...(prev || {}), ...data.run }));
      await loadLeaderboard();
      setInfo("Completed. Nice work.");
    } catch (e) {
      setError(e.message);
    } finally {
      setSubmitting(false);
    }
  }

  const theme = {
    gridBackground: "transparent",
    cellBackground: "#ffffff",
    cellBorder: "rgba(0,0,0,0.18)",
    textColor: "#1d1d1d",
    numberColor: "rgba(0,0,0,0.28)",
    focusBackground: "rgba(255,107,53,0.35)",
    highlightBackground: "rgba(255,215,125,0.35)",
  };

  return (
    <Box>
      <Box
        sx={{
          background:
            "linear-gradient(180deg, #1a1a3e 0%, #2d1b4e 30%, #5b2c6f 60%, #c43c68 85%, #ff6b35 100%)",
          minHeight: { xs: 180, md: 220 },
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
          <Stack spacing={1.25}>
            <Typography
              sx={{
                fontWeight: 700,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontSize: { xs: "0.75rem", md: "0.9rem" },
                color: "#ffd89b",
                textShadow: "0 2px 12px rgba(0,0,0,0.5)",
              }}
            >
              ✦ Weekly crossword ✦
            </Typography>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.1rem", sm: "3rem", md: "3.6rem" },
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                background: "linear-gradient(180deg, #ffffff 0%, #ffd89b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                mb: 0.5,
              }}
            >
              {puzzle?.title || "Crossword"}
            </Typography>
            {puzzle?.weekOf ? (
              <Typography sx={{ color: "rgba(255,255,255,0.9)" }}>
                Week of {formatWeekOf(puzzle.weekOf)}
              </Typography>
            ) : null}
            <Typography sx={{ color: "rgba(255,255,255,0.75)", fontSize: "0.95rem" }}>
              <Box component={Link} href="/puzzles" sx={{ color: "#ffd89b" }}>
                Back to puzzles
              </Box>
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 7 } }}>
        <Stack spacing={3.5}>
          {error ? <Alert severity="error">{error}</Alert> : null}
          {info ? <Alert severity="info">{info}</Alert> : null}

          {loading ? (
            <Alert severity="info">Loading…</Alert>
          ) : !puzzle ? (
            error ? null : <Alert severity="warning">Puzzle not found.</Alert>
          ) : (
            <>
              <Paper
                variant="outlined"
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: 3,
                  borderColor: "#eee",
                }}
              >
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={2}
                  sx={{ alignItems: { xs: "stretch", md: "center" }, justifyContent: "space-between" }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 800, color: "#1d1d1d" }}>
                      Leaderboard name:{" "}
                      <span style={{ fontWeight: 900 }}>{me?.displayName || "Anonymous"}</span>
                    </Typography>
                    {run?.completedAt && Number.isFinite(run.elapsedMs) ? (
                      <Typography sx={{ color: "#666", mt: 0.5 }}>
                        Completed in <strong>{formatDuration(run.elapsedMs)}</strong>
                      </Typography>
                    ) : (
                      <Typography sx={{ color: "#666", mt: 0.5 }}>
                        Your progress saves automatically.
                      </Typography>
                    )}
                  </Box>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                    <Button
                      onClick={() => crosswordRef.current?.reset?.()}
                      variant="outlined"
                      disabled={Boolean(run?.completedAt)}
                      sx={{ fontWeight: 800 }}
                    >
                      Reset
                    </Button>
                    <Button
                      onClick={submitIfCorrect}
                      variant="contained"
                      disabled={Boolean(run?.completedAt) || submitting}
                      sx={{
                        fontWeight: 900,
                        background: "linear-gradient(135deg, #ff6b35 0%, #c43c68 100%)",
                        "&:hover": { background: "linear-gradient(135deg, #ff8555 0%, #d4556f 100%)" },
                      }}
                    >
                      {submitting ? "Submitting…" : run?.completedAt ? "Completed" : "Submit"}
                    </Button>
                  </Stack>
                </Stack>
              </Paper>

              <Paper
                variant="outlined"
                sx={{
                  p: { xs: 2, md: 3 },
                  borderRadius: 3,
                  borderColor: "#eee",
                }}
              >
                <ThemeProvider theme={theme}>
                  <Crossword
                    ref={crosswordRef}
                    data={puzzle.crosswordData}
                    useStorage={false}
                    onCellChange={onCellChange}
                    onCrosswordCorrect={(isCorrect) => {
                      if (isCorrect && !run?.completedAt) {
                        submitIfCorrect();
                      }
                    }}
                  />
                </ThemeProvider>
              </Paper>

              <Divider />

              <Box>
                <Typography
                  component="h2"
                  sx={{
                    fontSize: { xs: "1.5rem", md: "1.9rem" },
                    fontWeight: 900,
                    color: "#1d1d1d",
                    fontFamily: "var(--font-serif), Georgia, serif",
                    mb: 1.5,
                  }}
                >
                  Leaderboard.
                </Typography>
                <Stack spacing={1.25}>
                  {leaderboard.map((row, i) => (
                    <Box
                      key={`${row.displayName}-${row.completedAt}-${i}`}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        border: "1px solid #eee",
                        borderRadius: 2,
                        p: 1.75,
                      }}
                    >
                      <Typography sx={{ fontWeight: 800, color: "#1d1d1d" }}>
                        {i + 1}. {row.displayName || "Anonymous"}
                      </Typography>
                      <Typography sx={{ color: "#666", fontWeight: 800 }}>
                        {Number.isFinite(row.elapsedMs) ? formatDuration(row.elapsedMs) : "—"}
                      </Typography>
                    </Box>
                  ))}
                  {leaderboard.length === 0 ? (
                    <Typography sx={{ color: "#888" }}>No completions yet.</Typography>
                  ) : null}
                </Stack>
              </Box>
            </>
          )}
        </Stack>
      </Container>
    </Box>
  );
}

