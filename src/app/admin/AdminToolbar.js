"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import { navItemsForRole, ROLE_LABELS } from "@/lib/roles";

export default function AdminToolbar({ session }) {
  const pathname = usePathname();
  const [busy, setBusy] = React.useState(false);

  if (pathname === "/admin") {
    return null;
  }

  const role = session?.role || "admin";
  const navItems = navItemsForRole(role);
  const identity = session?.email || session?.name || ROLE_LABELS[role] || "Editor";

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      window.location.assign("/admin");
    } catch {
      setBusy(false);
    }
  }

  return (
    <AppBar position="sticky" color="inherit" elevation={1} sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Toolbar sx={{ flexWrap: "wrap", gap: 1 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, flexGrow: 1, minWidth: 120 }}>
          Editor
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "none", md: "block" }, mr: 1 }}>
          {identity}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
          {navItems.map((item) => (
            <Button key={item.href} component={Link} href={item.href} color="inherit" size="small">
              {item.label}
            </Button>
          ))}
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
