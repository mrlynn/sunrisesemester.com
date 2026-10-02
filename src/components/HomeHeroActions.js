"use client";

import Link from "next/link";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

function scrollToDailyReflection(e) {
  e.preventDefault();
  const el = document.getElementById("daily-reflection");
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  if (typeof window !== "undefined") {
    window.history.replaceState(null, "", "#daily-reflection");
  }
}

export default function HomeHeroActions({ showDailyReflectionLink = false }) {
  return (
    <Stack spacing={2} sx={{ pt: 2, alignItems: { xs: "stretch", md: "flex-start" } }}>
      {showDailyReflectionLink ? (
        <Button
          component="a"
          href="#daily-reflection"
          onClick={scrollToDailyReflection}
          variant="contained"
          size="large"
          sx={{
            alignSelf: { xs: "stretch", sm: "flex-start" },
            py: 1,
            px: 3.5,
            fontSize: "0.95rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "none",
            borderRadius: 999,
            color: "#2d1b4e",
            background: "linear-gradient(135deg, #fff4d6 0%, #ffd89b 100%)",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
            "&:hover": {
              background: "linear-gradient(135deg, #ffe4b8 0%, #ffcfa1 100%)",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.28)",
            },
          }}
        >
          Today&rsquo;s reflection ↓
        </Button>
      ) : null}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button
          component={Link}
          href="/newcomer"
          variant="contained"
          size="large"
          sx={{
            py: 1.25,
            px: 4,
            fontSize: "1rem",
            fontWeight: 700,
            minWidth: { xs: "100%", sm: "auto" },
            color: "#2d1b4e",
            background: "#ffffff",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.2)",
            borderRadius: 8,
            "&:hover": {
              background: "#fff4d6",
              boxShadow: "0 6px 20px rgba(0, 0, 0, 0.28)",
            },
          }}
        >
          New here? Start here
        </Button>
        <Button
          component={Link}
          href="/meetings"
          variant="contained"
          color="secondary"
          size="large"
          sx={{
            py: 1.25,
            px: 4,
            fontSize: "1rem",
            fontWeight: 600,
            minWidth: { xs: "100%", sm: "auto" },
            background: "linear-gradient(135deg, #ff6b35 0%, #ff8555 100%)",
            boxShadow: "0 4px 12px rgba(255, 107, 53, 0.25)",
            borderRadius: 8,
          }}
        >
          Meeting Details
        </Button>
        <Button
          component={Link}
          href="/stories"
          variant="outlined"
          size="large"
          sx={{
            py: 1.25,
            px: 4,
            fontSize: "1rem",
            fontWeight: 600,
            minWidth: { xs: "100%", sm: "auto" },
            color: "#ffffff",
            borderColor: "rgba(255, 255, 255, 0.7)",
            borderWidth: "2px",
            borderRadius: 8,
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            textShadow: "0 1px 8px rgba(0,0,0,0.3)",
            "&:hover": {
              borderColor: "#ffffff",
              backgroundColor: "rgba(255, 255, 255, 0.2)",
            },
          }}
        >
          Member Stories
        </Button>
      </Stack>
    </Stack>
  );
}
