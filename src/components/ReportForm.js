"use client";

import * as React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const labelSx = { fontWeight: 700, color: "#1d1d1d", mb: 1, fontSize: "0.95rem" };

export default function ReportForm() {
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const form = new FormData(event.currentTarget);
      const payload = {
        category: String(form.get("category") ?? "").trim(),
        subject: String(form.get("subject") ?? "").trim(),
        body: String(form.get("body") ?? "").trim(),
        contactEmail: String(form.get("contactEmail") ?? "").trim(),
        contactPhone: String(form.get("contactPhone") ?? "").trim(),
      };

      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Could not submit report.");
      }

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Could not submit report.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 5, md: 8 } }}>
        <Alert severity="success" sx={{ fontSize: "1rem", p: 3 }}>
          Thank you. Your report was received.
        </Alert>
      </Container>
    );
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
        Report a concern
      </Typography>
      <Typography sx={{ color: "#555", mb: 4, fontSize: "1.05rem", lineHeight: 1.7 }}>
        Reports are anonymous by default. You can include an email address or phone number if
        you want a reply. Use this form for a safety concern, general issue, technology bug, or
        question.
      </Typography>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : null}

      <Box
        component="form"
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
          <FormControl required>
            <FormLabel sx={labelSx}>Category</FormLabel>
            <RadioGroup name="category" defaultValue="safety">
              <FormControlLabel value="safety" control={<Radio />} label="Safety concern" />
              <FormControlLabel value="issue" control={<Radio />} label="General issue" />
              <FormControlLabel
                value="technology"
                control={<Radio />}
                label="Technology bug"
              />
              <FormControlLabel value="question" control={<Radio />} label="Question" />
            </RadioGroup>
          </FormControl>

          <TextField
            name="subject"
            label="Subject"
            required
            fullWidth
            inputProps={{ maxLength: 200 }}
          />

          <TextField
            name="body"
            label="Details"
            required
            fullWidth
            multiline
            minRows={6}
            inputProps={{ maxLength: 10000 }}
          />

          <TextField
            name="contactEmail"
            type="email"
            label="Email address (optional)"
            fullWidth
            autoComplete="email"
            inputProps={{ maxLength: 200 }}
          />

          <TextField
            name="contactPhone"
            label="Phone number (optional)"
            fullWidth
            autoComplete="tel"
            inputProps={{ maxLength: 40 }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={submitting}
            sx={{
              alignSelf: "flex-start",
              fontWeight: 700,
              px: 4,
              py: 1.25,
              background: "linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #ff5a1f 0%, #ff7a45 100%)",
              },
              "&:disabled": { color: "#fff", opacity: 0.6 },
            }}
          >
            {submitting ? "Submitting..." : "Submit report"}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
