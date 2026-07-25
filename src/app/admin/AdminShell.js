"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import MenuIcon from "@mui/icons-material/Menu";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { navGroupsForRole, ROLE_LABELS } from "@/lib/roles";

const DRAWER_WIDTH = 260;

function isNavActive(pathname, href) {
  if (!pathname) return false;
  if (pathname === href) return true;
  return pathname.startsWith(`${href}/`);
}

function NavList({ groups, pathname, onNavigate }) {
  return (
    <Box sx={{ py: 1, flex: 1, overflowY: "auto" }}>
      {groups.map((group, groupIndex) => (
        <List
          key={group.id}
          dense
          subheader={
            <ListSubheader
              component="div"
              sx={{
                bgcolor: "transparent",
                lineHeight: 2.2,
                fontSize: "0.7rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "text.secondary",
                mt: groupIndex === 0 ? 0 : 1,
              }}
            >
              {group.label}
            </ListSubheader>
          }
        >
          {group.items.map((item) => {
            const active = isNavActive(pathname, item.href);
            return (
              <ListItemButton
                key={item.href}
                component={Link}
                href={item.href}
                selected={active}
                onClick={onNavigate}
                sx={{
                  mx: 1,
                  borderRadius: 1.5,
                  mb: 0.25,
                  "&.Mui-selected": {
                    bgcolor: "rgba(255, 107, 53, 0.12)",
                    color: "#c2410c",
                    "&:hover": { bgcolor: "rgba(255, 107, 53, 0.18)" },
                  },
                }}
              >
                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      fontWeight: active ? 700 : 500,
                      fontSize: "0.925rem",
                    },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      ))}
    </Box>
  );
}

export default function AdminShell({ session, children }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const isLogin = pathname === "/admin";
  const role = session?.role || "admin";
  const groups = navGroupsForRole(role);
  const identity = session?.email || session?.name || ROLE_LABELS[role] || "Editor";
  const roleLabel = ROLE_LABELS[role] || role;

  async function logout() {
    setBusy(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      window.location.assign("/admin");
    } catch {
      setBusy(false);
    }
  }

  if (isLogin) {
    return children;
  }

  const drawer = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box sx={{ px: 2.5, py: 2.25 }}>
        <Typography
          sx={{
            fontWeight: 800,
            fontSize: "1.1rem",
            letterSpacing: "-0.02em",
            fontFamily: "var(--font-serif), Georgia, serif",
          }}
        >
          Sunrise Editor
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.5 }}>
          {roleLabel}
        </Typography>
      </Box>
      <Divider />
      <NavList
        groups={groups}
        pathname={pathname}
        onNavigate={() => setMobileOpen(false)}
      />
      <Divider />
      <Stack spacing={0.5} sx={{ p: 1.5 }}>
        <Button
          component={Link}
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          size="small"
          color="inherit"
          endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
          sx={{ justifyContent: "flex-start", textTransform: "none", fontWeight: 600 }}
        >
          View site
        </Button>
        <Button
          onClick={logout}
          disabled={busy}
          size="small"
          color="inherit"
          sx={{ justifyContent: "flex-start", textTransform: "none" }}
        >
          Sign out
        </Button>
      </Stack>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: "background.paper",
        }}
      >
        <Toolbar sx={{ gap: 1.5, minHeight: { xs: 56, md: 64 } }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="Open navigation"
            onClick={() => setMobileOpen(true)}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 700, lineHeight: 1.2, display: { xs: "none", sm: "block" } }}
            >
              Admin
            </Typography>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {identity}
            </Typography>
          </Box>
          <Button
            component={Link}
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            size="small"
            color="inherit"
            sx={{ display: { xs: "none", sm: "inline-flex" }, textTransform: "none" }}
          >
            View site
          </Button>
          <Button
            onClick={logout}
            disabled={busy}
            size="small"
            variant="outlined"
            sx={{ textTransform: "none" }}
          >
            Sign out
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
        aria-label="Admin sections"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              borderRight: 1,
              borderColor: "divider",
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: DRAWER_WIDTH,
              boxSizing: "border-box",
              borderRight: 1,
              borderColor: "divider",
              bgcolor: "#faf8f5",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minWidth: 0,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
