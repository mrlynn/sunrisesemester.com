"use client";

import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Link from "next/link";

export default function UnsubscribeClient({ token }) {
  const [loading, setLoading] = React.useState(Boolean(token));
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!token) {
      setError("Invalid unsubscribe link.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function unsubscribe() {
      try {
        const res = await fetch("/api/unsubscribe", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Unsubscribe failed.");
        if (!cancelled) setMessage(data.message);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    unsubscribe();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 5, md: 8 } }}>
      <Typography
        variant="h1"
        component="h1"
        sx={{
          fontSize: { xs: "2rem", md: "2.5rem" },
          fontWeight: 800,
          fontFamily: 'var(--font-serif), Georgia, serif',
          mb: 3,
          color: "#1d1d1d",
        }}
      >
        Unsubscribe
      </Typography>

      {loading ? (
        <Typography color="text.secondary">Processing your request…</Typography>
      ) : null}

      {message ? (
        <Stack spacing={3}>
          <Alert severity="success" sx={{ fontSize: "1rem", p: 3 }}>
            {message}
          </Alert>
          <Button component={Link} href="/" variant="outlined">
            Back to home
          </Button>
        </Stack>
      ) : null}

      {error ? (
        <Stack spacing={3}>
          <Alert severity="error" sx={{ fontSize: "1rem", p: 3 }}>
            {error}
          </Alert>
          <Button component={Link} href="/subscribe" variant="outlined">
            Subscribe page
          </Button>
        </Stack>
      ) : null}
    </Container>
  );
}
