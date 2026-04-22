"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";

const links = [
  { href: "/", label: "Home" },
  { href: "/newcomer", label: "Newcomer" },
  { href: "/meetings", label: "Meetings" },
  { href: "/reflections", label: "Reflections" },
  { href: "/stories", label: "Stories" },
  { href: "/literature", label: "Literature" },
  // { href: "/our-group", label: "Our Group" },
  { href: "/resources", label: "Resources" },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  return (
    <AppBar position="sticky" color="default" elevation={0}>
      <Toolbar
        sx={{
          gap: 3,
          py: 1.5,
          px: { xs: 2, md: 3 },
        }}
      >
        <Typography
          variant="h6"
          component="a"
          href="/"
          sx={{
            flexGrow: { xs: 1, md: 0 },
            fontWeight: 700,
            color: "#2c2c2c",
            textDecoration: "none",
            fontSize: "1.2rem",
            letterSpacing: "-0.01em",
            transition: "color 0.2s ease",
            "&:hover": {
              color: "#ff6b35",
            },
          }}
        >
          Sunrise Semester
        </Typography>
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2, ml: 3 }}>
          {links.map((item) => (
            <Button
              key={item.href}
              component="a"
              href={item.href}
              variant="text"
              sx={{
                color: pathname === item.href ? "#ff6b35" : "#666666",
                fontWeight: 600,
                padding: "8px 12px",
                fontSize: "0.95rem",
                borderBottom: pathname === item.href ? "2px solid #ff6b35" : "2px solid transparent",
                transition: "all 0.2s ease",
                "&:hover": {
                  color: "#ff6b35",
                  backgroundColor: "transparent",
                },
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton
          color="inherit"
          edge="end"
          onClick={() => setOpen(true)}
          sx={{
            display: { xs: "inline-flex", md: "none" },
            color: "#2c2c2c",
          }}
          aria-label="Open menu"
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 280, pt: 2 }} role="presentation">
          <Typography
            sx={{
              px: 2,
              pb: 2,
              fontWeight: 700,
              fontSize: "1.1rem",
              color: "#2c2c2c",
            }}
          >
            Menu
          </Typography>
          <Divider />
          <List>
            {links.map((item) => (
              <ListItemButton
                key={item.href}
                component="a"
                href={item.href}
                selected={pathname === item.href}
                onClick={() => setOpen(false)}
                sx={{
                  py: 1.5,
                  "&.Mui-selected": {
                    backgroundColor: "rgba(255, 107, 53, 0.1)",
                    color: "#ff6b35",
                    fontWeight: 700,
                    "&:hover": {
                      backgroundColor: "rgba(255, 107, 53, 0.15)",
                    },
                  },
                  "&:hover": {
                    backgroundColor: "#f5f5f5",
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}
