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

export default function AdminForgotPasswordForm() {
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
      const res = await fetch("/api/admin/forgot-password", {
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
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper sx={{ p: 4 }}>
        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            <Typography variant="h5" component="h1">
              Reset editor password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter the email address on your editor/admin account and we&rsquo;ll send you a
              link to set a new password.
            </Typography>
            {success ? (
              <Alert severity="success">{success}</Alert>
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
              <Link href="/admin" style={{ color: "inherit" }}>
                Back to sign in
              </Link>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
