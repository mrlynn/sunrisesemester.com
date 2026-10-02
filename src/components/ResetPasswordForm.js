"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/member/reset-password", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not reset your password.");
        return;
      }
      router.push("/member/settings");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 5, md: 8 } }}>
      <Paper sx={{ p: { xs: 3, md: 4 } }}>
        <Stack spacing={2.5}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontFamily: 'var(--font-serif), Georgia, serif',
              fontWeight: 800,
            }}
          >
            Set a new password
          </Typography>

          {!token ? (
            <>
              <Alert severity="error">
                This reset link is missing or invalid.
              </Alert>
              <Typography variant="body2" color="text.secondary">
                <Link
                  href="/member/forgot-password"
                  style={{ color: "#ff6b35", fontWeight: 600 }}
                >
                  Request a new reset link
                </Link>
              </Typography>
            </>
          ) : (
            <form onSubmit={onSubmit}>
              <Stack spacing={2.5}>
                {error ? <Alert severity="error">{error}</Alert> : null}
                <TextField
                  label="New password"
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  required
                  helperText="At least 8 characters."
                />
                <TextField
                  label="Confirm new password"
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  fullWidth
                  required
                />
                <Button type="submit" variant="contained" disabled={busy} size="large">
                  {busy ? "Saving…" : "Save new password"}
                </Button>
              </Stack>
            </form>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
