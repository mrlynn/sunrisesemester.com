"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MemberAccountButton from "@/components/MemberAccountButton";
import {
  SITE_NAV_GROUPS,
  SITE_NAV_MORE,
  SITE_NAV_PRIMARY,
  isSiteNavActive,
} from "@/lib/siteNav";

function NavLinkButton({ item, pathname }) {
  const active = isSiteNavActive(pathname, item.href);
  const emphasis = Boolean(item.emphasis);
  const outline = item.accent === "outline";

  if (emphasis) {
    return (
      <Button
        component={Link}
        href={item.href}
        variant="contained"
        size="small"
        sx={{
          textTransform: "none",
          fontWeight: 700,
          px: 2,
          background: active
            ? "linear-gradient(135deg, #ff5a1f 0%, #ff6b35 100%)"
            : "linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%)",
          boxShadow: "none",
          "&:hover": {
            background: "linear-gradient(135deg, #ff5a1f 0%, #ff7a45 100%)",
            boxShadow: "0 4px 14px rgba(255,107,53,0.35)",
          },
        }}
      >
        {item.label}
      </Button>
    );
  }

  // Distinct from `emphasis` on purpose: this marks a page as important
  // without visually duplicating the primary "Meetings" pill next to it.
  if (outline) {
    return (
      <Button
        component={Link}
        href={item.href}
        variant="outlined"
        size="small"
        sx={{
          textTransform: "none",
          fontWeight: 700,
          px: 2,
          color: "#ff6b35",
          borderWidth: "1.5px",
          borderColor: active ? "#ff6b35" : "rgba(255,107,53,0.45)",
          "&:hover": {
            borderWidth: "1.5px",
            borderColor: "#ff6b35",
            backgroundColor: "rgba(255,107,53,0.06)",
          },
        }}
      >
        {item.label}
      </Button>
    );
  }

  return (
    <Button
      component={Link}
      href={item.href}
      variant="text"
      sx={{
        color: active ? "#ff6b35" : "#555555",
        fontWeight: active ? 700 : 600,
        px: 1.25,
        minWidth: 0,
        fontSize: "0.925rem",
        textTransform: "none",
        borderBottom: active ? "2px solid #ff6b35" : "2px solid transparent",
        borderRadius: 0,
        "&:hover": {
          color: "#ff6b35",
          backgroundColor: "transparent",
        },
      }}
    >
      {item.label}
    </Button>
  );
}

export default function SiteHeader() {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [moreAnchor, setMoreAnchor] = React.useState(null);
  const moreOpen = Boolean(moreAnchor);
  const moreActive = SITE_NAV_MORE.some((item) => isSiteNavActive(pathname, item.href));

  return (
    <AppBar
      position="sticky"
      color="default"
      elevation={0}
      sx={{ borderBottom: "1px solid #eeeeee", bgcolor: "rgba(255,255,255,0.96)", backdropFilter: "blur(8px)" }}
    >
      <Toolbar
        sx={{
          gap: { xs: 1, md: 2 },
          py: 1.25,
          px: { xs: 2, md: 3 },
          minHeight: { xs: 56, md: 64 },
        }}
      >
        <Typography
          variant="h6"
          component={Link}
          href="/"
          sx={{
            flexGrow: { xs: 1, lg: 0 },
            fontWeight: 700,
            color: "#2c2c2c",
            textDecoration: "none",
            fontSize: { xs: "1.05rem", md: "1.15rem" },
            letterSpacing: "-0.01em",
            fontFamily: "var(--font-serif), Georgia, serif",
            transition: "color 0.2s ease",
            "&:hover": { color: "#ff6b35" },
          }}
        >
          Sunrise Semester
        </Typography>

        <Box
          component="nav"
          aria-label="Primary"
          sx={{
            display: { xs: "none", lg: "flex" },
            alignItems: "center",
            gap: 0.5,
            ml: 2,
            flexGrow: 1,
          }}
        >
          {SITE_NAV_PRIMARY.map((item) => (
            <NavLinkButton key={item.href} item={item} pathname={pathname} />
          ))}

          <Button
            id="site-nav-more-button"
            aria-controls={moreOpen ? "site-nav-more-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={moreOpen ? "true" : undefined}
            onClick={(e) => setMoreAnchor(e.currentTarget)}
            endIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
            sx={{
              color: moreActive || moreOpen ? "#ff6b35" : "#555555",
              fontWeight: moreActive ? 700 : 600,
              px: 1.25,
              minWidth: 0,
              fontSize: "0.925rem",
              textTransform: "none",
              borderBottom:
                moreActive || moreOpen ? "2px solid #ff6b35" : "2px solid transparent",
              borderRadius: 0,
              "&:hover": {
                color: "#ff6b35",
                backgroundColor: "transparent",
              },
            }}
          >
            More
          </Button>
          <Menu
            id="site-nav-more-menu"
            anchorEl={moreAnchor}
            open={moreOpen}
            onClose={() => setMoreAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            slotProps={{
              list: { "aria-labelledby": "site-nav-more-button" },
              paper: {
                sx: {
                  mt: 1,
                  minWidth: 200,
                  borderRadius: 2,
                  border: "1px solid #eeeeee",
                  boxShadow: "0 12px 32px rgba(0,0,0,0.08)",
                },
              },
            }}
          >
            {SITE_NAV_MORE.map((item) => {
              const active = isSiteNavActive(pathname, item.href);
              return (
                <MenuItem
                  key={item.href}
                  component={Link}
                  href={item.href}
                  selected={active}
                  onClick={() => setMoreAnchor(null)}
                  sx={{
                    fontWeight: active ? 700 : 500,
                    fontSize: "0.925rem",
                    py: 1.25,
                    "&.Mui-selected": {
                      bgcolor: "rgba(255,107,53,0.1)",
                      color: "#ff6b35",
                    },
                  }}
                >
                  {item.label}
                </MenuItem>
              );
            })}
          </Menu>
        </Box>

        <Box sx={{ display: { xs: "none", lg: "flex" }, alignItems: "center", ml: "auto" }}>
          <MemberAccountButton />
        </Box>

        {/* Tablet: Meetings CTA + menu (full primary is lg+) */}
        <Box sx={{ display: { xs: "none", md: "flex", lg: "none" }, alignItems: "center", gap: 1, ml: "auto" }}>
          <Button
            component={Link}
            href="/meetings"
            variant="contained"
            size="small"
            sx={{
              textTransform: "none",
              fontWeight: 700,
              background: "linear-gradient(135deg, #ff6b35 0%, #ff8c5a 100%)",
              boxShadow: "none",
            }}
          >
            Meetings
          </Button>
          <MemberAccountButton />
        </Box>

        <IconButton
          color="inherit"
          edge="end"
          onClick={() => setDrawerOpen(true)}
          sx={{
            display: { lg: "none" },
            color: "#2c2c2c",
            ml: { xs: 0, md: 0.5 },
          }}
          aria-label="Open menu"
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: { width: { xs: "min(100vw, 320px)", sm: 320 } },
          },
        }}
      >
        <Box sx={{ pt: 2, pb: 3, height: "100%", display: "flex", flexDirection: "column" }} role="presentation">
          <Box sx={{ px: 2.5, pb: 2 }}>
            <Typography
              sx={{
                fontWeight: 800,
                fontSize: "1.15rem",
                color: "#2c2c2c",
                fontFamily: "var(--font-serif), Georgia, serif",
              }}
            >
              Sunrise Semester
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Find a meeting, read, and connect with the group.
            </Typography>
          </Box>
          <Divider />

          <Box sx={{ flex: 1, overflowY: "auto", py: 1 }}>
            {SITE_NAV_GROUPS.map((group) => (
              <List
                key={group.id}
                dense
                subheader={
                  <ListSubheader
                    component="div"
                    sx={{
                      bgcolor: "transparent",
                      lineHeight: 2.4,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "text.secondary",
                    }}
                  >
                    {group.label}
                  </ListSubheader>
                }
              >
                {group.items.map((item) => {
                  const active = isSiteNavActive(pathname, item.href);
                  return (
                    <ListItemButton
                      key={item.href}
                      component={Link}
                      href={item.href}
                      selected={active}
                      onClick={() => setDrawerOpen(false)}
                      sx={{
                        mx: 1,
                        borderRadius: 1.5,
                        py: 1.15,
                        "&.Mui-selected": {
                          backgroundColor: "rgba(255, 107, 53, 0.1)",
                          color: "#ff6b35",
                          "&:hover": { backgroundColor: "rgba(255, 107, 53, 0.15)" },
                        },
                      }}
                    >
                      <ListItemText
                        primary={item.label}
                        slotProps={{
                          primary: { fontWeight: active ? 700 : 600 },
                        }}
                      />
                    </ListItemButton>
                  );
                })}
              </List>
            ))}
          </Box>

          <Divider />
          <Box sx={{ pt: 1.5 }}>
            <MemberAccountButton mobile onNavigate={() => setDrawerOpen(false)} />
          </Box>
        </Box>
      </Drawer>
    </AppBar>
  );
}
