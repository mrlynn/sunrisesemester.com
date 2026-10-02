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

export default function MemberLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/member/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not sign in.");
        return;
      }
      const target =
        next && next.startsWith("/member") ? next : "/member/settings";
      router.push(target);
      router.refresh();
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
              Member sign-in
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              Sign in to update your group profile, contact details, and anniversary settings.
              You can browse the whole site without an account.
            </Typography>
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
            <TextField
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />
            <Button type="submit" variant="contained" disabled={busy} size="large">
              {busy ? "Signing in…" : "Sign in"}
            </Button>
            <Typography variant="body2" color="text.secondary">
              <Link href="/member/forgot-password" style={{ color: "#ff6b35", fontWeight: 600 }}>
                Forgot your password?
              </Link>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              New here?{" "}
              <Link href="/member/register" style={{ color: "#ff6b35", fontWeight: 600 }}>
                Create an account
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
