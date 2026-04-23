"use client";

import * as React from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";

function formatWeekOf(value) {
  const d = new Date(value);
  if (!Number.isFinite(d.getTime())) return "";
  return d.toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
}

export default function PuzzlesPage() {
  const [current, setCurrent] = React.useState(null);
  const [archive, setArchive] = React.useState([]);
  const [me, setMe] = React.useState(null);
  const [name, setName] = React.useState("");
  const [savingName, setSavingName] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [curRes, archRes, meRes] = await Promise.all([
          fetch("/api/puzzles/current", { cache: "no-store" }),
          fetch("/api/puzzles/archive", { cache: "no-store" }),
          fetch("/api/puzzles/me", { cache: "no-store" }),
        ]);
        const cur = await curRes.json();
        const arch = await archRes.json();
        const meJson = await meRes.json();
        if (cancelled) return;
        setCurrent(cur.puzzle || null);
        setArchive(Array.isArray(arch.puzzles) ? arch.puzzles : []);
        setMe(meJson.user || null);
        setName(meJson.user?.displayName || "");
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function saveName() {
    setError("");
    setSavingName(true);
    try {
      const res = await fetch("/api/puzzles/me", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ displayName: name }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not save name.");
      setMe(data.user);
    } catch (e) {
      setError(e.message);
    } finally {
      setSavingName(false);
    }
  }

  return (
    <Box>
      <Box
        sx={{
          background:
            "linear-gradient(180deg, #1a1a3e 0%, #2d1b4e 30%, #5b2c6f 60%, #c43c68 85%, #ff6b35 100%)",
          minHeight: { xs: 220, md: 280 },
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
          <Typography
            sx={{
              fontWeight: 700,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontSize: { xs: "0.75rem", md: "0.9rem" },
              color: "#ffd89b",
              mb: 2,
              textShadow: "0 2px 12px rgba(0,0,0,0.5)",
            }}
          >
            ✦ Weekly puzzle ✦
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "2.75rem", sm: "3.75rem", md: "4.5rem" },
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-0.03em",
              background: "linear-gradient(180deg, #ffffff 0%, #ffd89b 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              mb: 2,
            }}
          >
            Crossword.
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "1.05rem", md: "1.2rem" },
              color: "rgba(255,255,255,0.92)",
              maxWidth: 560,
              textShadow: "0 2px 12px rgba(0,0,0,0.35)",
            }}
          >
            A gentle, recovery-themed crossword each week. Save your progress and see how you did on
            the community board.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
        <Stack spacing={4}>
          {error ? <Alert severity="error">{error}</Alert> : null}

          <Paper
            variant="outlined"
            sx={{ p: { xs: 2.5, md: 3 }, borderRadius: 3, borderColor: "#eee" }}
          >
            <Stack spacing={1.5}>
              <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: "#1d1d1d" }}>
                Your leaderboard name
              </Typography>
              <Typography sx={{ color: "#666", fontSize: "0.95rem" }}>
                Optional. If you leave this blank, you’ll appear as “Anonymous”.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <TextField
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Anonymous"
                  fullWidth
                />
                <Button
                  onClick={saveName}
                  disabled={savingName}
                  variant="contained"
                  sx={{ fontWeight: 800, px: 3, whiteSpace: "nowrap" }}
                >
                  {savingName ? "Saving…" : "Save"}
                </Button>
              </Stack>
              {me?.displayName ? (
                <Typography sx={{ color: "#888", fontSize: "0.85rem" }}>
                  Current: <strong>{me.displayName}</strong>
                </Typography>
              ) : null}
            </Stack>
          </Paper>

          <Box>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "1.75rem", md: "2.25rem" },
                fontWeight: 800,
                lineHeight: 1.1,
                color: "#1d1d1d",
                fontFamily: "var(--font-serif), Georgia, serif",
                mb: 1,
              }}
            >
              This week.
            </Typography>
            <Typography sx={{ color: "#666", fontSize: "1rem", mb: 3 }}>
              Pick up where you left off at any time.
            </Typography>

            {current ? (
              <Paper
                variant="outlined"
                sx={{
                  p: { xs: 2.5, md: 3 },
                  borderRadius: 3,
                  borderColor: "#eee",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  flexWrap: "wrap",
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: "#1d1d1d" }}>
                    {current.title || "Weekly Crossword"}
                  </Typography>
                  <Typography sx={{ color: "#666", mt: 0.5 }}>
                    Week of {formatWeekOf(current.weekOf)}
                  </Typography>
                </Box>
                <Button
                  component={Link}
                  href={`/puzzles/${current.slug}`}
                  variant="contained"
                  sx={{
                    fontWeight: 900,
                    px: 3,
                    background: "linear-gradient(135deg, #ff6b35 0%, #c43c68 100%)",
                    "&:hover": { background: "linear-gradient(135deg, #ff8555 0%, #d4556f 100%)" },
                  }}
                >
                  Solve
                </Button>
              </Paper>
            ) : (
              <Alert severity="info">No puzzle is published yet.</Alert>
            )}
          </Box>

          <Divider />

          <Box>
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: "1.5rem", md: "1.9rem" },
                fontWeight: 800,
                color: "#1d1d1d",
                fontFamily: "var(--font-serif), Georgia, serif",
                mb: 1,
              }}
            >
              Archive.
            </Typography>
            <Typography sx={{ color: "#666", fontSize: "1rem", mb: 2.5 }}>
              Previous weekly crosswords.
            </Typography>
            <Stack spacing={1.25}>
              {archive.map((p) => (
                <Box
                  key={p.slug}
                  component={Link}
                  href={`/puzzles/${p.slug}`}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 2,
                    borderRadius: 2,
                    border: "1px solid #eee",
                    textDecoration: "none",
                    color: "#1d1d1d",
                    "&:hover": { borderColor: "#ff6b35", background: "rgba(255,107,53,0.04)" },
                  }}
                >
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{p.title || "Weekly Crossword"}</Typography>
                    <Typography sx={{ color: "#777", fontSize: "0.9rem" }}>
                      Week of {formatWeekOf(p.weekOf)}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: "#999", fontSize: "0.9rem" }}>Open</Typography>
                </Box>
              ))}
              {archive.length === 0 ? (
                <Typography sx={{ color: "#888", fontSize: "0.95rem" }}>No archive yet.</Typography>
              ) : null}
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

