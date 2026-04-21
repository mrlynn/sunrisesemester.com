"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";

export default function LandingEditor({ initial }) {
  const router = useRouter();
  const [heroTitle, setHeroTitle] = React.useState(initial.heroTitle ?? "");
  const [heroSubtitle, setHeroSubtitle] = React.useState(initial.heroSubtitle ?? "");
  const [body, setBody] = React.useState(initial.body ?? "");
  const [message, setMessage] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  async function save() {
    setMessage(null);
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/landing", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ heroTitle, heroSubtitle, body }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Save failed.");
        return;
      }
      setMessage("Saved.");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={3} component={Paper} variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography variant="h4" component="h1">
          Landing page
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Hero text appears at the top of the home page. The main area supports Markdown
          (headings, lists, links, emphasis).
        </Typography>
        {message ? <Alert severity="success">{message}</Alert> : null}
        {error ? <Alert severity="error">{error}</Alert> : null}
        <TextField
          label="Hero title"
          value={heroTitle}
          onChange={(e) => setHeroTitle(e.target.value)}
          fullWidth
        />
        <TextField
          label="Hero subtitle"
          value={heroSubtitle}
          onChange={(e) => setHeroSubtitle(e.target.value)}
          fullWidth
          multiline
          minRows={2}
        />
        <TextField
          label="Body (Markdown)"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          fullWidth
          multiline
          minRows={14}
        />
        <Button variant="contained" onClick={save} disabled={busy} size="large">
          {busy ? "Saving…" : "Save landing page"}
        </Button>
      </Stack>
    </Container>
  );
}
