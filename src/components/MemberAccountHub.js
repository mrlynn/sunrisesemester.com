"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";

export default function MemberAccountHub() {
  const router = useRouter();
  const [session, setSession] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/member/session");
        const data = await res.json();
        if (!cancelled) setSession(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function signOut() {
    await fetch("/api/member/logout", { method: "POST" });
    setSession({ authenticated: false });
    router.refresh();
  }

  const signedIn = session?.authenticated;

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack spacing={3}>
        <Box>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontSize: { xs: "2.25rem", md: "3rem" },
              fontWeight: 800,
              fontFamily: 'var(--font-serif), Georgia, serif',
              mb: 2,
              color: "#1d1d1d",
            }}
          >
            Member account
          </Typography>
          <Typography sx={{ color: "#555", fontSize: "1.05rem", lineHeight: 1.7 }}>
            Everything on this site is open to read without signing in. Create a free account
            only if you want to share your contact details and sobriety anniversary with the
            home group.
          </Typography>
        </Box>

        {loading ? (
          <Typography color="text.secondary">Loading…</Typography>
        ) : signedIn ? (
          <Paper sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={2.5}>
              <Alert severity="success">
                Signed in as {session.firstName || session.email}.
              </Alert>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                Update your phone, mailing address, and anniversary. You choose what is public
                on the site versus visible only to group editors.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button
                  component={Link}
                  href="/member/settings"
                  variant="contained"
                  size="large"
                >
                  My profile
                </Button>
                <Button variant="outlined" size="large" onClick={signOut}>
                  Sign out
                </Button>
              </Stack>
            </Stack>
          </Paper>
        ) : (
          <Paper sx={{ p: { xs: 3, md: 4 } }}>
            <Stack spacing={2.5}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                New to the group roster?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                Register once, then add your details in your profile. No account is needed to
                attend meetings, read stories, or use any other part of the site.
              </Typography>
              <Button
                component={Link}
                href="/member/register"
                variant="contained"
                size="large"
                sx={{
                  alignSelf: "flex-start",
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #ff5a1f 0%, #ff7a45 100%)",
                  },
                }}
              >
                Create account
              </Button>
              <Typography variant="body2" color="text.secondary">
                Already registered?{" "}
                <Link href="/member/login" style={{ color: "#ff6b35", fontWeight: 600 }}>
                  Sign in
                </Link>
              </Typography>
            </Stack>
          </Paper>
        )}

        <Paper variant="outlined" sx={{ p: { xs: 2.5, md: 3 }, bgcolor: "#fafafa" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
            Related (no account required)
          </Typography>
          <Stack spacing={1}>
            <Link href="/our-group" style={{ color: "#ff6b35", fontWeight: 600, fontSize: "0.95rem" }}>
              Our group — anniversaries &amp; service roster
            </Link>
            <Link href="/subscribe" style={{ color: "#ff6b35", fontWeight: 600, fontSize: "0.95rem" }}>
              Get email updates
            </Link>
            <Link href="/meetings" style={{ color: "#ff6b35", fontWeight: 600, fontSize: "0.95rem" }}>
              Meeting schedule
            </Link>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
