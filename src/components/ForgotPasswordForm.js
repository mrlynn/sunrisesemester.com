"use client";

import * as React from "react";
import Link from "next/link";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

export default function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("");
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setBusy(true);
    try {
      const res = await fetch("/api/member/forgot-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not process that request.");
        return;
      }
      setSuccess(data.message || "Check your email for a reset link.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 5, md: 8 } }}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <form onSubmit={onSubmit}>
          <Stack spacing={2.5}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontFamily: 'var(--font-serif), Georgia, serif',
                fontWeight: 800,
              }}
            >
              Reset your password
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              Enter the email address on your member account and we&rsquo;ll send you a link
              to set a new password.
            </Typography>
            {success ? (
              <Alert severity="success" sx={{ lineHeight: 1.6 }}>
                {success}
              </Alert>
            ) : (
              <>
                {error ? <Alert severity="error">{error}</Alert> : null}
                <TextField
                  label="Email"
                  type="email"
                  name="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                  required
                />
                <Button type="submit" variant="contained" disabled={busy} size="large">
                  {busy ? "Sending…" : "Send reset link"}
                </Button>
              </>
            )}
            <Typography variant="body2" color="text.secondary">
              <Link href="/member/login" style={{ color: "#ff6b35", fontWeight: 600 }}>
                Back to sign in
              </Link>
              {" · "}
              <Link href="/member" style={{ color: "#ff6b35", fontWeight: 600 }}>
                Member account home
              </Link>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
