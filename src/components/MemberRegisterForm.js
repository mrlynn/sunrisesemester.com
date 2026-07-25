"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

export default function MemberRegisterForm() {
  const router = useRouter();
  const [error, setError] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const fd = new FormData(e.currentTarget);
      const res = await fetch("/api/member/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: String(fd.get("email") ?? "").trim(),
          password: String(fd.get("password") ?? ""),
          confirmPassword: String(fd.get("confirmPassword") ?? ""),
          firstName: String(fd.get("firstName") ?? "").trim(),
          lastName: String(fd.get("lastName") ?? "").trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Registration failed.");
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
              Member registration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
              Create an account to share your contact details and sobriety anniversary with the
              home group. Browsing the site does not require registration.
            </Typography>
            {error ? <Alert severity="error">{error}</Alert> : null}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                name="firstName"
                label="First name"
                required
                fullWidth
                autoComplete="given-name"
              />
              <TextField
                name="lastName"
                label="Last name"
                required
                fullWidth
                autoComplete="family-name"
              />
            </Stack>
            <TextField
              name="email"
              label="Email"
              type="email"
              required
              fullWidth
              autoComplete="email"
            />
            <TextField
              name="password"
              label="Password"
              type="password"
              required
              fullWidth
              autoComplete="new-password"
              helperText="At least 8 characters."
            />
            <TextField
              name="confirmPassword"
              label="Confirm password"
              type="password"
              required
              fullWidth
              autoComplete="new-password"
            />
            <Button type="submit" variant="contained" disabled={busy} size="large">
              {busy ? "Creating account…" : "Create account"}
            </Button>
            <Typography variant="body2" color="text.secondary">
              Already registered?{" "}
              <Link href="/member/login" style={{ color: "#ff6b35", fontWeight: 600 }}>
                Sign in
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
