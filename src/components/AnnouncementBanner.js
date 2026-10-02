"use client";

import * as React from "react";
import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

function dismissStorageKey(updatedAt) {
  return `ss-announcement-dismissed:${updatedAt || "current"}`;
}

function isExternalHref(href) {
  return /^https?:\/\//i.test(href);
}

export default function AnnouncementBanner({ announcement }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (!announcement) {
      setVisible(false);
      return;
    }
    try {
      const dismissed = window.localStorage.getItem(dismissStorageKey(announcement.updatedAt));
      setVisible(dismissed !== "1");
    } catch {
      setVisible(true);
    }
  }, [announcement]);

  if (!announcement || !visible) return null;

  const external = isExternalHref(announcement.href);
  const linkProps = external
    ? {
        component: "a",
        href: announcement.href,
        target: "_blank",
        rel: "noopener noreferrer",
      }
    : {
        component: Link,
        href: announcement.href,
      };

  function dismiss(e) {
    e.preventDefault();
    e.stopPropagation();
    try {
      window.localStorage.setItem(dismissStorageKey(announcement.updatedAt), "1");
    } catch {
      // ignore storage failures
    }
    setVisible(false);
  }

  return (
    <Box
      component="aside"
      aria-label="Site announcement"
      sx={{
        bgcolor: "#ff6b35",
        color: "#ffffff",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: { xs: 1.5, sm: 2.5 },
          py: { xs: 1.15, sm: 1.25 },
          display: "flex",
          alignItems: "center",
          gap: 1,
          minHeight: 48,
        }}
      >
        <Box
          {...linkProps}
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: { xs: 0.75, sm: 1.5 },
            flexWrap: "wrap",
            textAlign: "center",
            textDecoration: "none",
            color: "inherit",
            "&:hover .announcement-cta": {
              textDecoration: "underline",
              textUnderlineOffset: 3,
            },
          }}
        >
          <Typography
            component="span"
            sx={{
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
              fontWeight: 700,
              lineHeight: 1.35,
              letterSpacing: "0.01em",
              color: "#ffffff",
            }}
          >
            {announcement.message}
          </Typography>
          <Box
            className="announcement-cta"
            component="span"
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.4,
              color: "#fff7ed",
              fontWeight: 800,
              fontSize: { xs: "0.95rem", sm: "1.05rem" },
              whiteSpace: "nowrap",
              borderBottom: "2px solid rgba(255,247,237,0.85)",
              pb: "1px",
            }}
          >
            {announcement.linkLabel || "Read more"}
            <ArrowForwardIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>

        {announcement.dismissible ? (
          <IconButton
            size="small"
            aria-label="Dismiss announcement"
            onClick={dismiss}
            sx={{
              color: "rgba(255,255,255,0.9)",
              flexShrink: 0,
              "&:hover": { color: "#fff", bgcolor: "rgba(0,0,0,0.12)" },
            }}
          >
            <CloseIcon sx={{ fontSize: 20 }} />
          </IconButton>
        ) : null}
      </Box>
    </Box>
  );
}
