"use client";

import * as React from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import MarkdownContent from "@/components/MarkdownContent";

const SUGGESTIONS = [
  "When are the meetings?",
  "I'm new — what should I expect?",
  "What is AA?",
  "Where can I find meeting formats?",
  "How do I share a story?",
];

function extractText(message) {
  if (!message?.parts) return "";
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function extractMatches(message) {
  if (!message?.parts) return [];
  for (const part of message.parts) {
    if (part.type === "data-matches" && Array.isArray(part.data?.items)) {
      return part.data.items;
    }
  }
  return [];
}

function isInternalHref(href) {
  return typeof href === "string" && href.startsWith("/");
}

export default function SiteSearch() {
  const [open, setOpen] = React.useState(false);
  const [input, setInput] = React.useState("");
  const inputRef = React.useRef(null);
  const listRef = React.useRef(null);

  const transport = React.useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/ask",
      }),
    [],
  );

  const { messages, sendMessage, status, error, setMessages, stop } = useChat({
    transport,
  });

  const busy = status === "submitted" || status === "streaming";

  React.useEffect(() => {
    function onKeyDown(event) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [open]);

  React.useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, status]);

  function handleClose() {
    if (busy) stop();
    setOpen(false);
  }

  function ask(question) {
    const text = String(question || "").trim();
    if (!text || busy) return;
    setInput("");
    sendMessage({ text });
  }

  function onSubmit(event) {
    event.preventDefault();
    ask(input);
  }

  function startFresh() {
    stop();
    setMessages([]);
    setInput("");
    inputRef.current?.focus();
  }

  return (
    <>
      <IconButton
        color="inherit"
        onClick={() => setOpen(true)}
        aria-label="Search the site"
        sx={{
          color: "#555555",
          "&:hover": { color: "#ff6b35", backgroundColor: "rgba(255,107,53,0.08)" },
        }}
      >
        <SearchIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        slotProps={{
          paper: {
            sx: {
              borderRadius: 3,
              overflow: "hidden",
              border: "1px solid #eeeeee",
              boxShadow: "0 24px 64px rgba(0,0,0,0.14)",
              background:
                "linear-gradient(180deg, #fffaf4 0%, #ffffff 28%, #ffffff 100%)",
            },
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2.5,
            pt: 2,
            pb: 1.5,
            borderBottom: "1px solid #f0e6dc",
          }}
        >
          <AutoAwesomeIcon sx={{ color: "#ff6b35", fontSize: 22 }} />
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontFamily: "var(--font-serif), Georgia, serif",
                color: "#2c2c2c",
                lineHeight: 1.2,
              }}
            >
              Ask Sunrise Semester
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Sunrise Semester, AA, and recovery questions only
            </Typography>
          </Box>
          <IconButton aria-label="Close search" onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <DialogContent sx={{ p: 0 }}>
          <Box
            ref={listRef}
            sx={{
              maxHeight: { xs: "50vh", sm: 360 },
              overflowY: "auto",
              px: 2.5,
              py: 2,
            }}
          >
            {messages.length === 0 && (
              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                  Try a question, or pick a starting point:
                </Typography>
                <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1}>
                  {SUGGESTIONS.map((suggestion) => (
                    <Chip
                      key={suggestion}
                      label={suggestion}
                      onClick={() => ask(suggestion)}
                      clickable
                      sx={{
                        bgcolor: "rgba(255,107,53,0.08)",
                        color: "#2c2c2c",
                        fontWeight: 600,
                        "&:hover": { bgcolor: "rgba(255,107,53,0.16)" },
                      }}
                    />
                  ))}
                </Stack>
              </Box>
            )}

            <Stack spacing={2}>
              {messages.map((message) => {
                const text = extractText(message);
                const matches = extractMatches(message);
                const isUser = message.role === "user";
                return (
                  <Box key={message.id}>
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: isUser ? "#ff6b35" : "text.secondary",
                        mb: 0.5,
                        display: "block",
                      }}
                    >
                      {isUser ? "You" : "Assistant"}
                    </Typography>
                    {isUser ? (
                      <Typography sx={{ color: "#2c2c2c", whiteSpace: "pre-wrap" }}>
                        {text}
                      </Typography>
                    ) : (
                      <Box
                        sx={{
                          "& p:last-child": { mb: 0 },
                          "& p": { fontSize: "1rem", lineHeight: 1.65 },
                        }}
                      >
                        {text ? (
                          <MarkdownContent markdown={text} />
                        ) : busy ? (
                          <Stack direction="row" spacing={1} alignItems="center">
                            <CircularProgress size={16} sx={{ color: "#ff6b35" }} />
                            <Typography variant="body2" color="text.secondary">
                              Looking through the site…
                            </Typography>
                          </Stack>
                        ) : null}
                        {matches.length > 0 && (
                          <Stack
                            direction="row"
                            flexWrap="wrap"
                            useFlexGap
                            spacing={1}
                            sx={{ mt: 1.5 }}
                          >
                            {matches.map((match) => (
                              <Chip
                                key={`${match.href}-${match.title}`}
                                component={isInternalHref(match.href) ? Link : "a"}
                                href={match.href}
                                {...(isInternalHref(match.href)
                                  ? { onClick: handleClose }
                                  : {
                                      target: "_blank",
                                      rel: "noopener noreferrer",
                                    })}
                                clickable
                                size="small"
                                label={match.title}
                                sx={{
                                  fontWeight: 600,
                                  border: "1px solid #ffe0d0",
                                  bgcolor: "#fff7f2",
                                }}
                              />
                            ))}
                          </Stack>
                        )}
                      </Box>
                    )}
                  </Box>
                );
              })}
            </Stack>

            {error && (
              <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                {error.message || "Something went wrong. Please try again."}
              </Typography>
            )}
          </Box>

          <Box
            component="form"
            onSubmit={onSubmit}
            sx={{
              px: 2.5,
              py: 2,
              borderTop: "1px solid #f0e6dc",
              bgcolor: "rgba(255,255,255,0.9)",
            }}
          >
            <TextField
              inputRef={inputRef}
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about meetings, AA, or recovery…"
              disabled={busy}
              size="small"
              slotProps={{
                input: {
                  endAdornment: busy ? (
                    <CircularProgress size={18} sx={{ color: "#ff6b35", mr: 1 }} />
                  ) : null,
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "#ffffff",
                },
              }}
            />
            <Stack
              direction="row"
              spacing={1}
              sx={{ mt: 1.25, alignItems: "center", justifyContent: "space-between" }}
            >
              <Typography variant="caption" color="text.secondary">
                Shortcut: ⌘K / Ctrl+K · Not a crisis line or medical advice
              </Typography>
              <Stack direction="row" spacing={1}>
                {messages.length > 0 && (
                  <Button size="small" onClick={startFresh} sx={{ textTransform: "none" }}>
                    Clear
                  </Button>
                )}
                <Button
                  type="submit"
                  size="small"
                  variant="contained"
                  disabled={busy || !input.trim()}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%)",
                    boxShadow: "none",
                  }}
                >
                  Ask
                </Button>
              </Stack>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
