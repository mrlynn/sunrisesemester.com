"use client";

import Link from "next/link";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function HomeHeroActions() {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ pt: 2 }}>
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
  );
}
