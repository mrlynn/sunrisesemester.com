"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Alert from "@mui/material/Alert";

export default function SubscribeForm() {
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");
  const [agreed, setAgreed] = React.useState(false);
  const formRef = React.useRef(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      const email = String(fd.get("email") ?? "").trim();
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          agreed,
          website: String(fd.get("website") ?? ""),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Subscription failed.");
      setSuccess(data.message);
      formRef.current?.reset();
      setAgreed(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: { xs: 5, md: 8 } }}>
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
        Get group updates
      </Typography>
      <Typography sx={{ color: "#555", mb: 4, fontSize: "1.05rem", lineHeight: 1.7 }}>
        Optional email list for meeting changes, upcoming events, and occasional group news.
        We send only a few messages per month. Your email is separate from RSVP and other
        site features that do not require it.
      </Typography>

      {success ? (
        <Alert severity="success" sx={{ fontSize: "1rem", p: 3, mb: 3 }}>
          {success}
        </Alert>
      ) : null}
      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : null}

      <Box
        component="form"
        ref={formRef}
        onSubmit={handleSubmit}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 4,
          background: "#fff",
          border: "1px solid #eee",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
        }}
      >
        <Stack spacing={3}>
          <TextField
            name="email"
            type="email"
            label="Email address"
            required
            fullWidth
            autoComplete="email"
            inputProps={{ maxLength: 254 }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={agreed}
                onChange={(ev) => setAgreed(ev.target.checked)}
                required
              />
            }
            label="I want to receive Sunrise Semester group updates at this address."
          />

          <Box
            aria-hidden="true"
            sx={{
              position: "absolute",
              left: -9999,
              width: 1,
              height: 1,
              overflow: "hidden",
            }}
          >
            <TextField name="website" tabIndex={-1} autoComplete="off" />
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={submitting || !agreed}
            sx={{
              alignSelf: "flex-start",
              fontWeight: 700,
              px: 4,
              py: 1.25,
              background: "linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #ff5a1f 0%, #ff7a45 100%)",
              },
            }}
          >
            {submitting ? "Sending…" : "Subscribe"}
          </Button>

          <Typography sx={{ color: "#777", fontSize: "0.9rem", lineHeight: 1.6 }}>
            After you submit, we&apos;ll send a confirmation link. You must confirm before
            any updates are sent. You can unsubscribe from any message.
          </Typography>
        </Stack>
      </Box>
    </Container>
  );
}
