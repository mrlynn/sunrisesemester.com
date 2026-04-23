"use client";

import * as React from "react";
import { motion } from "motion/react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import SecurityIcon from "@mui/icons-material/Security";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import PeopleIcon from "@mui/icons-material/People";
import WarningIcon from "@mui/icons-material/Warning";

const sections = [
  {
    title: "Pre-Meeting Setup",
    icon: <SecurityIcon />,
    color: "#5b2c6f",
    items: [
      { label: "Enable Waiting Room", detail: "Settings > In Meeting (Basic) > Waiting Room = ON" },
      { label: "Require Meeting Password", detail: "Always use passwords for scheduled meetings" },
      { label: "Disable Join Before Host", detail: "Prevent early entry and unsupervised access" },
      { label: "Lock Meeting After Start", detail: "Security icon > Lock Meeting once everyone arrives" },
      { label: "Enable Screen Share Controls", detail: "Only Host can share by default" },
    ]
  },
  {
    title: "Preventing Zoom Bombers",
    icon: <WarningIcon />,
    color: "#c43c68",
    items: [
      { label: "Never Share Links Publicly", detail: "Use email or private channels only" },
      { label: "Use Waiting Room", detail: "Admit participants individually" },
      { label: "Authenticate Users", detail: "Require Zoom sign-in when possible" },
      { label: "Disable File Transfer", detail: "Settings > In Meeting (Basic) > File Transfer = OFF" },
      { label: "Disable Annotations", detail: "Prevents drawing/writing over shared content" },
      { label: "Remove Disruptive Participants", detail: "Hover > More > Remove (they cannot rejoin)" },
      { label: "Report to Zoom", detail: "Security icon > Report a User for severe violations" },
    ]
  },
  {
    title: "Managing Audio (Mute/Unmute)",
    icon: <MicIcon />,
    color: "#ff6b35",
    items: [
      { label: "Mute All on Entry", detail: "More > Meeting Options > Mute participants upon entry" },
      { label: "Mute Individual", detail: "Hover over participant > Mute" },
      { label: "Mute All", detail: "Participants panel > Mute All button" },
      { label: "Allow Unmute", detail: "Check 'Allow participants to unmute themselves'" },
      { label: "Ask to Unmute", detail: "Right-click participant > Ask to Unmute" },
      { label: "Keyboard Shortcut", detail: "Hold SPACEBAR for push-to-talk (Host & Participants)" },
    ]
  },
  {
    title: "Managing Video",
    icon: <VideocamIcon />,
    color: "#2d1b4e",
    items: [
      { label: "Stop Video", detail: "Hover > More > Stop Video (host can stop anyone's video)" },
      { label: "Ask to Start Video", detail: "Right-click participant > Ask to Start Video" },
      { label: "Disable HD Video", detail: "Reduces bandwidth for unstable connections" },
      { label: "Spotlight Video", detail: "Highlight speaker for all participants" },
    ]
  },
  {
    title: "Participant Management",
    icon: <PeopleIcon />,
    color: "#5b2c6f",
    items: [
      { label: "Rename Participant", detail: "More > Rename (keeps meetings organized)" },
      { label: "Make Co-Host", detail: "More > Make Co-Host (gives host controls)" },
      { label: "Put in Waiting Room", detail: "More > Put in Waiting Room (temporary removal)" },
      { label: "Remove Participant", detail: "More > Remove (permanent for this session)" },
      { label: "Enable Breakout Rooms", detail: "Pre-assign or auto-assign for smaller discussions" },
    ]
  },
  {
    title: "Troubleshooting Common Issues",
    icon: <WarningIcon />,
    color: "#c43c68",
    items: [
      { label: "Can't Hear Participants", detail: "Check 'Join Audio' button, test speaker/mic settings" },
      { label: "Participants Can't Hear Host", detail: "Ensure not muted, check audio device selection" },
      { label: "Poor Video Quality", detail: "Ask to turn off video, check bandwidth, reduce HD settings" },
      { label: "Screen Share Not Working", detail: "Close other apps, check permissions, restart Zoom" },
      { label: "Dropped Connection", detail: "Use 'Rejoin' link, have backup phone number ready" },
      { label: "Background Noise", detail: "Mute all except speaker, enable 'Original Sound' for music" },
    ]
  },
];

function Section({ section, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          border: "1px solid #eee",
          background: "#ffffff",
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: section.color,
              color: "#fff",
            }}
          >
            {section.icon}
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#1d1d1d",
              fontFamily: 'var(--font-serif), Georgia, serif',
            }}
          >
            {section.title}
          </Typography>
        </Stack>
        <Stack spacing={2}>
          {section.items.map((item, i) => (
            <Box key={i} sx={{ pl: 2, borderLeft: "3px solid #f0f0f0" }}>
              <Typography sx={{ fontWeight: 600, fontSize: "0.95rem", color: "#1d1d1d", mb: 0.5 }}>
                {item.label}
              </Typography>
              <Typography sx={{ fontSize: "0.9rem", color: "#666" }}>
                {item.detail}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Paper>
    </motion.div>
  );
}

export default function SherpaGuidePage() {
  return (
    <Box>
      <Box
        sx={{
          background: "linear-gradient(180deg, #1a1a3e 0%, #2d1b4e 30%, #5b2c6f 60%, #c43c68 85%, #ff6b35 100%)",
          minHeight: { xs: 280, md: 360 },
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >
            <Chip
              label="For Sherpas"
              sx={{
                mb: 2,
                background: "rgba(255,255,255,0.15)",
                color: "#ffd89b",
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
              }}
            />
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                background: "linear-gradient(180deg, #ffffff 0%, #ffd89b 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                mb: 2,
              }}
            >
              Zoom Administration Guide
            </Typography>
            <Typography
              sx={{
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                color: "rgba(255,255,255,0.9)",
                maxWidth: 640,
                lineHeight: 1.6,
              }}
            >
              Essential guide for Sherpas to manage Zoom meetings, prevent disruptions, and ensure a smooth, secure experience for all participants.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Stack spacing={4}>
          {sections.map((section, i) => (
            <Section key={section.title} section={section} index={i} />
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 3,
                background: "linear-gradient(135deg, #2d1b4e 0%, #5b2c6f 100%)",
                color: "#fff",
                "& .MuiTypography-root": { color: "inherit" },
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Quick Reference: Host Controls
              </Typography>
              <Stack spacing={1} sx={{ fontSize: "0.9rem" }}>
                <Typography>• <strong>Security Icon:</strong> Lock meeting, enable waiting room, remove participants</Typography>
                <Typography>• <strong>Participants Panel:</strong> Mute/unmute, rename, make co-host, remove</Typography>
                <Typography>• <strong>Share Screen:</strong> Control who can share (Host Only recommended)</Typography>
                <Typography>• <strong>Chat:</strong> Disable private chat to prevent side conversations</Typography>
                <Typography>• <strong>Reactions:</strong> Can be disabled if distracting</Typography>
                <Typography>• <strong>Record:</strong> Always announce if recording the meeting</Typography>
              </Stack>
            </Paper>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
}
