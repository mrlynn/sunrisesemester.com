"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Link from "next/link";
import { defaultAdminPath } from "@/lib/roles";

export default function AdminLoginForm() {
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
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not sign in.");
        return;
      }
      const role = data.role || "admin";
      const fallback = defaultAdminPath(role);
      const target =
        next && next.startsWith("/admin") ? next : fallback;
      router.push(target);
      router.refresh();
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
              Editor sign-in
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in with the email and password your administrator set for you. This area is
              not shown in the main navigation.
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
              <Link href="/admin/forgot-password" style={{ color: "inherit" }}>
                Forgot your password?
              </Link>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
