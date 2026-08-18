"use client";

import * as React from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckIcon from "@mui/icons-material/Check";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import RefreshIcon from "@mui/icons-material/Refresh";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import MarkdownContent from "@/components/MarkdownContent";
import {
  MEETING_TYPE_OPTIONS,
  THEME_OPTIONS,
  TONE_OPTIONS,
} from "@/lib/meetingTopics";

const INITIAL_FORM = {
  meetingType: "general",
  theme: "surprise",
  tone: "newcomer-friendly",
  notes: "",
};

function messageText(message) {
  return (message?.parts || [])
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function topicMetadata(message) {
  return (message?.parts || []).find((part) => part.type === "data-topic")?.data || null;
}

function OptionSelect({ id, label, value, options, onChange, disabled }) {
  return (
    <FormControl fullWidth disabled={disabled}>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        value={value}
        label={label}
        onChange={(event) => onChange(event.target.value)}
        sx={{ bgcolor: "#ffffff", borderRadius: 2 }}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default function MeetingTopicChooser() {
  const [form, setForm] = React.useState(INITIAL_FORM);
  const [copied, setCopied] = React.useState(false);
  const [copyFailed, setCopyFailed] = React.useState(false);

  const transport = React.useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/meeting-topics",
      }),
    [],
  );

  const { messages, sendMessage, status, error, setMessages, stop, clearError } = useChat({
    transport,
  });

  const busy = status === "submitted" || status === "streaming";
  const assistantMessage = [...messages].reverse().find((message) => message.role === "assistant");
  const result = messageText(assistantMessage);
  const metadata = topicMetadata(assistantMessage);

  function updateForm(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function generateTopic(excludeTopicId = "") {
    if (busy) return;
    clearError();
    setMessages([]);
    await sendMessage(
      { text: "Prepare a chair-ready meeting topic." },
      {
        body: {
          topicRequest: {
            ...form,
            excludeTopicId,
          },
        },
      },
    );
  }

  async function copyResult() {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
    } catch {
      setCopyFailed(true);
    }
  }

  function startOver() {
    stop();
    clearError();
    setMessages([]);
    setForm(INITIAL_FORM);
  }

  return (
    <Box sx={{ bgcolor: "#fffaf4", minHeight: "70vh" }}>
      <Box
        component="header"
        sx={{
          color: "#ffffff",
          background:
            "radial-gradient(circle at 80% 15%, rgba(255,215,125,0.38), transparent 35%), linear-gradient(145deg, #2d1b4e 0%, #7b326f 52%, #c43c68 76%, #ff6b35 100%)",
        }}
      >
        <Container maxWidth="md" sx={{ py: { xs: 7, md: 10 }, textAlign: "center" }}>
          <AutoAwesomeIcon sx={{ color: "#ffd89b", fontSize: 34, mb: 1.5 }} />
          <Typography
            component="h1"
            sx={{
              fontFamily: "var(--font-serif), Georgia, serif",
              fontWeight: 800,
              fontSize: { xs: "2.5rem", md: "4.25rem" },
              lineHeight: 1.05,
              mb: 2,
            }}
          >
            Find a meeting topic.
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.9)",
              fontSize: { xs: "1rem", md: "1.2rem" },
              lineHeight: 1.7,
              maxWidth: 660,
              mx: "auto",
            }}
          >
            Choose a little context and get a welcoming opening you can read aloud, plus
            questions to begin the discussion.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 4, md: 7 } }}>
        {!result && !busy ? (
          <Paper
            component="form"
            onSubmit={(event) => {
              event.preventDefault();
              generateTopic();
            }}
            elevation={0}
            sx={{
              p: { xs: 2.5, sm: 4, md: 5 },
              borderRadius: 4,
              border: "1px solid #f0e2d7",
              boxShadow: "0 18px 50px rgba(45,27,78,0.08)",
            }}
          >
            <Typography
              component="h2"
              sx={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontWeight: 800,
                fontSize: { xs: "1.8rem", md: "2.25rem" },
                color: "#2d1b4e",
                mb: 1,
              }}
            >
              Shape the suggestion
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4, lineHeight: 1.7 }}>
              These choices guide the suggestion. You can adapt any wording to fit your
              meeting and your own experience.
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2.5,
              }}
            >
              <OptionSelect
                id="meeting-type"
                label="Meeting type"
                value={form.meetingType}
                options={MEETING_TYPE_OPTIONS}
                onChange={(value) => updateForm("meetingType", value)}
                disabled={busy}
              />
              <OptionSelect
                id="topic-theme"
                label="Theme"
                value={form.theme}
                options={THEME_OPTIONS}
                onChange={(value) => updateForm("theme", value)}
                disabled={busy}
              />
              <OptionSelect
                id="topic-tone"
                label="Tone"
                value={form.tone}
                options={TONE_OPTIONS}
                onChange={(value) => updateForm("tone", value)}
                disabled={busy}
              />
              <TextField
                id="chair-notes"
                label="Optional context"
                value={form.notes}
                onChange={(event) => updateForm("notes", event.target.value)}
                inputProps={{ maxLength: 500 }}
                helperText={`${form.notes.length}/500 · Avoid names or personal details`}
                placeholder="For example: a small meeting with several newcomers"
                disabled={busy}
                multiline
                minRows={2}
                sx={{ gridColumn: { sm: "1 / -1" } }}
              />
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{ mt: 4, alignItems: { sm: "center" }, justifyContent: "space-between" }}
            >
              <Typography variant="caption" color="text.secondary" sx={{ maxWidth: 440 }}>
                Suggestions are starting points, not AA authority, medical advice, or crisis
                support.
              </Typography>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<AutoAwesomeIcon />}
                disabled={busy}
                sx={{
                  px: 3,
                  py: 1.35,
                  borderRadius: 8,
                  textTransform: "none",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #c43c68 0%, #ff6b35 100%)",
                  boxShadow: "0 8px 24px rgba(196,60,104,0.25)",
                }}
              >
                Prepare my topic
              </Button>
            </Stack>
          </Paper>
        ) : (
          <Paper
            elevation={0}
            aria-live="polite"
            aria-busy={busy}
            sx={{
              p: { xs: 2.5, sm: 4, md: 5 },
              borderRadius: 4,
              border: "1px solid #f0e2d7",
              boxShadow: "0 18px 50px rgba(45,27,78,0.08)",
            }}
          >
            {busy && !result ? (
              <Stack alignItems="center" spacing={2} sx={{ py: { xs: 6, md: 9 } }}>
                <CircularProgress sx={{ color: "#c43c68" }} />
                <Typography
                  sx={{
                    fontFamily: "var(--font-serif), Georgia, serif",
                    fontSize: "1.35rem",
                    fontWeight: 700,
                    color: "#2d1b4e",
                  }}
                >
                  Preparing a topic for your meeting…
                </Typography>
              </Stack>
            ) : null}

            {result ? (
              <>
                {metadata?.fallback ? (
                  <Box
                    role="status"
                    sx={{
                      mb: 3,
                      px: 2,
                      py: 1.5,
                      borderRadius: 2,
                      bgcolor: "#fff4e5",
                      color: "#6b4515",
                    }}
                  >
                    The AI helper is unavailable, so this is an approved ready-to-use
                    suggestion from our topic library.
                  </Box>
                ) : null}
                <Box
                  sx={{
                    "& h2": { fontSize: { xs: "1.6rem", md: "2rem" }, mt: 3 },
                    "& h2:first-of-type": { mt: 0 },
                    "& p, & li": { fontSize: { xs: "1rem", md: "1.08rem" } },
                  }}
                >
                  <MarkdownContent markdown={result} />
                </Box>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  sx={{ mt: 4, pt: 3, borderTop: "1px solid #eee3da" }}
                >
                  <Button
                    variant="contained"
                    startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                    onClick={copyResult}
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      bgcolor: "#2d1b4e",
                      "&:hover": { bgcolor: "#442763" },
                    }}
                  >
                    {copied ? "Copied" : "Copy opening"}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    onClick={() => generateTopic(metadata?.id || "")}
                    disabled={busy}
                    sx={{ textTransform: "none", fontWeight: 700 }}
                  >
                    Try another
                  </Button>
                  <Button
                    startIcon={<RestartAltIcon />}
                    onClick={startOver}
                    disabled={busy}
                    sx={{ textTransform: "none", fontWeight: 700, ml: { sm: "auto" } }}
                  >
                    Start over
                  </Button>
                </Stack>
              </>
            ) : null}
          </Paper>
        )}

        {error ? (
          <Paper
            role="alert"
            elevation={0}
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: "#fff1f0",
              color: "#8a2b25",
              border: "1px solid #ffd1cc",
            }}
          >
            We couldn’t prepare a topic right now. Please wait a moment and try again.
          </Paper>
        ) : null}
      </Container>

      <Snackbar
        open={copied}
        autoHideDuration={2200}
        onClose={() => setCopied(false)}
        message="Meeting opening copied"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
      <Snackbar
        open={copyFailed}
        autoHideDuration={3000}
        onClose={() => setCopyFailed(false)}
        message="Copy failed. Select the text and copy it manually."
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  );
}
