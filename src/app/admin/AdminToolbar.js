"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Link from "next/link";

export default function AdminToolbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [busy, setBusy] = React.useState(false);

  if (pathname === "/admin") {
    return null;
  }

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppBar position="sticky" color="inherit" elevation={1} sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, flexGrow: 1 }}>
          Editor
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button component={Link} href="/admin/landing" color="inherit" size="small">
            Landing
          </Button>
          <Button component={Link} href="/admin/stories" color="inherit" size="small">
            Stories
          </Button>
          <Button component={Link} href="/admin/anniversaries" color="inherit" size="small">
            Anniversaries
          </Button>
          <Button component={Link} href="/admin/events" color="inherit" size="small">
            Events
          </Button>
          <Button component={Link} href="/admin/service-roles" color="inherit" size="small">
            Service
          </Button>
          <Button component={Link} href="/" color="inherit" size="small">
            View site
          </Button>
          <Button onClick={logout} disabled={busy} color="inherit" size="small">
            Sign out
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
