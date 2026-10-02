"use client";

import * as React from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Link from "next/link";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import KeyIcon from "@mui/icons-material/Key";
import SecurityIcon from "@mui/icons-material/Security";
import ScheduleIcon from "@mui/icons-material/Schedule";
import GroupsIcon from "@mui/icons-material/Groups";
import ChatIcon from "@mui/icons-material/Chat";
import HelpOutlineIcon from "@mui/icons-material/HelpOutlineOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DownloadIcon from "@mui/icons-material/Download";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const ZOOM_ID = "901 964 988";
const ZOOM_PASSWORD = "417417";
const ZOOM_URL_EMBEDDED =
  "https://us02web.zoom.us/j/901964988?pwd=QkhEY1FFOUF2b1AzMmRwZ0VtejdVQT09";
const ZOOM_URL_PLAIN = "https://zoom.us/j/901964988";
const PAYPAL_URL = "https://paypal.me/sunrisesemester";
const DAILY_REFLECTION_URL = "https://www.aa.org/daily-reflections";
const ZOOM_DOWNLOAD_URL = "https://zoom.us/download";
const HOST_KEY_EMAIL = "sunrisesemesteraa@gmail.com";
const TRAINING_DECK_EMBED =
  "https://docs.google.com/presentation/d/e/2PACX-1vSM9yuyuOYfxKln4PihpeYctuLWwtIVADp2gjSchva_a7vRbmvobyEpbR4p4hEfwCIAZt0BgieVyUtG/pubembed?start=false&loop=false&delayms=3000";
const TRAINING_DECK_PUB =
  "https://docs.google.com/presentation/d/e/2PACX-1vSM9yuyuOYfxKln4PihpeYctuLWwtIVADp2gjSchva_a7vRbmvobyEpbR4p4hEfwCIAZt0BgieVyUtG/pub?start=false&loop=false&delayms=3000";

const toc = [
  { id: "what-a-sherpa-does", label: "What a Sherpa Does" },
  { id: "becoming-a-sherpa", label: "Becoming a Sherpa" },
  { id: "training-deck", label: "Training Deck" },
  { id: "before-you-start", label: "What You Need Before You Start" },
  { id: "installing-zoom", label: "Installing Zoom" },
  { id: "claiming-host", label: "Claiming Host with the Host Key" },
  { id: "meeting-timeline", label: "Running the Meeting — Timeline" },
  { id: "host-tools", label: "The Host Tools Panel" },
  { id: "disruptors", label: "Handling Disruptors" },
  { id: "meeting-details", label: "Sharing Meeting Details" },
  { id: "speaker-tape", label: "Speaker Tape Sessions" },
  { id: "meeting-formats", label: "Meeting Format by Day" },
  { id: "collateral", label: "Meeting Collateral" },
  { id: "faq", label: "FAQ" },
];

const timeline = [
  {
    when: "~7:00 AM",
    title: "Start & secure",
    body: "Claim host. Open Host Tools and immediately: keep Waiting Room as your group uses it, ensure Share Screen is host-only, and turn off “Allow participants to rename themselves.” Locking rename stops bad actors from changing their name to dodge removal.",
  },
  {
    when: "~7:05 AM",
    title: "Check in with the chair",
    body: "Confirm the chairperson is present and has their collateral. Send the meeting format link in chat if needed. Promote them to Co-Host.",
  },
  {
    when: "~7:05 AM",
    title: "Line up a backup Co-Host (optional)",
    body: "Identify a second person — ideally your assigned backup Sherpa — and promote them to Co-Host too. Two people with controls means the meeting is never left unprotected if one drops.",
  },
  {
    when: "~7:10 AM",
    title: "Help with volunteers if needed",
    body: "The chair selects readers, but you may assist if they ask for help.",
  },
  {
    when: "7:15 AM",
    title: "Hand off to the chair",
    body: "Turn the meeting over to the chairperson to begin.",
  },
  {
    when: "Ongoing",
    title: "Moderate audio & the hand queue",
    body: "Mute open mics with background noise. As people finish sharing, lower their hand so the chair can see who’s next. Watch chat and the waiting room. Request names from incoming attendees only once, with courtesy. If someone declines or does not respond, respect that and do not pursue it further.",
  },
  {
    when: "~7:35 AM",
    title: "7th Tradition",
    body: "When the chair announces the 7th Tradition, paste the donation link into chat.",
  },
  {
    when: "End",
    title: "Close out",
    body: "After the Serenity Prayer, thank folks. You can leave the room open briefly for fellowship or end it for all.",
  },
];

const hostToolSettings = [
  { label: "Share Screen", value: "OFF for participants (host/co-host only)" },
  { label: "Chat", value: "ON (links and newcomer questions)" },
  { label: "Rename Themselves", value: "OFF (prevents evasion after a removal)" },
  { label: "Unmute Themselves", value: "ON (attendees need to share)" },
  { label: "Start Video", value: "ON (attendees may show their face)" },
];

const formatDays = [
  { day: "Monday", type: "Big Book Meeting" },
  { day: "Tuesday", type: "Topic Discussion (first 10 min reserved for newcomers)" },
  { day: "Wednesday", type: "Speaker" },
  { day: "Thursday", type: "Beginner Meeting (first 10 min reserved for newcomers)" },
  {
    day: "Friday",
    type: "1st: Step (12&12) · 2nd: Big Book · 3rd: Tradition of the Month · 4th: Speaker on Step/Tradition · 5th: Topic on Step of the Month",
  },
  { day: "Saturday Men’s", type: "8:00–9:15 AM · any volunteer can chair" },
  { day: "Saturday Women’s", type: "9:30–10:30 AM" },
  { day: "Sunday", type: "Topic Discussion" },
];

const faqs = [
  {
    q: "Where do I get the meeting ID and password?",
    a: "See the General Chair of the group; they provision access. Current standing details are also listed in this guide and on the Meetings page.",
  },
  {
    q: "How do I become a Sherpa?",
    a: "Attend the Sunrise Semester business meeting (confirm the date with the General Chair — historically the 2nd Tuesday of the month) and volunteer. You’ll shadow an experienced Sherpa first.",
  },
  {
    q: "We were Zoom-bombed — what do I do?",
    a: "Hit Suspend Participant Activities in Host Tools, remove the offender, then resume. See Handling Disruptors below.",
  },
  {
    q: "How do I log in and become the host?",
    a: "Join the meeting normally, open Participants, click Claim Host at the bottom, and enter the 6-digit host key.",
  },
  {
    q: "Where do I find the host key?",
    a: `The host key is provided by a group officer. Contact Michael Lynn (${HOST_KEY_EMAIL}) or the current General Chair. Keep it private.`,
  },
  {
    q: "I only have a phone/tablet — can I still Sherpa?",
    a: "You can in a pinch, but the desktop app gives you the full Host Tools set and is strongly recommended. If you must use mobile, tap More (⋯) to find host controls.",
  },
  {
    q: "What if I have to leave before the meeting ends?",
    a: "Before you drop, make sure a Co-Host is in place, or reassign host: Participants → hover the person → ⋯ More → Make Host. Never leave without an active host or co-host.",
  },
];

const sectionMotion = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.5 },
};

function SectionTitle({ id, icon, children }) {
  return (
    <Stack
      id={id}
      direction="row"
      spacing={1.5}
      sx={{ mb: 2, scrollMarginTop: 96, alignItems: "center" }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          bgcolor: "rgba(255,107,53,0.12)",
          color: "#ff6b35",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Typography
        component="h2"
        sx={{
          fontFamily: "var(--font-playfair), Georgia, serif",
          fontSize: { xs: "1.5rem", md: "1.85rem" },
          fontWeight: 700,
          color: "#1a1a2e",
          letterSpacing: "-0.02em",
        }}
      >
        {children}
      </Typography>
    </Stack>
  );
}

function Callout({ tone = "info", children }) {
  const styles =
    tone === "warn"
      ? {
          border: "1px solid rgba(211,47,47,0.25)",
          bgcolor: "rgba(211,47,47,0.05)",
          color: "#5c1a1a",
        }
      : tone === "success"
        ? {
            border: "1px solid rgba(46,125,50,0.25)",
            bgcolor: "rgba(46,125,50,0.05)",
            color: "#1b3d1e",
          }
        : {
            border: "1px solid rgba(255,107,53,0.25)",
            bgcolor: "rgba(255,107,53,0.05)",
            color: "#3d2415",
          };

  return (
    <Box
      sx={{
        ...styles,
        borderRadius: 2,
        px: 2.5,
        py: 2,
        my: 2.5,
        fontSize: "0.95rem",
        lineHeight: 1.65,
        "& a": { color: "#ff6b35", fontWeight: 600 },
      }}
    >
      {children}
    </Box>
  );
}

function CopyRow({ label, value }) {
  const [copied, setCopied] = React.useState(false);

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1}
      sx={{
        py: 1.25,
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        "&:last-child": { borderBottom: "none" },
        alignItems: { xs: "stretch", sm: "center" },
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: "0.78rem", fontWeight: 700, color: "rgba(0,0,0,0.45)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          {label}
        </Typography>
        <Typography
          sx={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: { xs: "0.85rem", md: "0.92rem" },
            color: "#1a1a2e",
            wordBreak: "break-all",
          }}
        >
          {value}
        </Typography>
      </Box>
      <Button
        size="small"
        variant="outlined"
        startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1600);
          } catch {
            /* ignore */
          }
        }}
        sx={{
          alignSelf: { xs: "flex-start", sm: "center" },
          borderColor: "rgba(255,107,53,0.4)",
          color: "#ff6b35",
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        {copied ? "Copied" : "Copy"}
      </Button>
    </Stack>
  );
}

export default function SherpaGuidePage() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 60]);

  return (
    <Box sx={{ bgcolor: "#fffaf5", minHeight: "100vh" }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          pt: { xs: 10, md: 14 },
          pb: { xs: 8, md: 12 },
          background:
            "linear-gradient(160deg, #1a1a2e 0%, #2d1b4e 45%, #4a1942 75%, #ff6b35 140%)",
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,107,53,0.18) 0%, transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,167,81,0.12) 0%, transparent 40%)",
            pointerEvents: "none",
          }}
        />
        <motion.div style={{ y: heroY }}>
          <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Typography
                sx={{
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "rgba(255,167,81,0.9)",
                  mb: 2,
                }}
              >
                Service · Version 3.0
              </Typography>
              <Typography
                component="h1"
                sx={{
                  fontFamily: "var(--font-playfair), Georgia, serif",
                  fontSize: { xs: "2.4rem", md: "3.4rem" },
                  fontWeight: 700,
                  color: "#fff",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.15,
                  mb: 2.5,
                }}
              >
                Sunrise Semester
                <br />
                Sherpa Guide
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: "1.05rem", md: "1.2rem" },
                  color: "rgba(255,255,255,0.78)",
                  lineHeight: 1.7,
                  maxWidth: 560,
                  mb: 4,
                }}
              >
                How to serve as technical moderator for Sunrise Semester AA meetings
                on Zoom Workplace — claim host with the host key, set safety controls,
                and keep the room running smoothly.
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button
                  component="a"
                  href="#claiming-host"
                  variant="contained"
                  sx={{
                    bgcolor: "#ff6b35",
                    color: "#fff",
                    fontWeight: 700,
                    px: 3,
                    py: 1.25,
                    borderRadius: 2,
                    textTransform: "none",
                    boxShadow: "0 8px 24px rgba(255,107,53,0.35)",
                    "&:hover": { bgcolor: "#e55a28" },
                  }}
                >
                  Jump to claiming host
                </Button>
                <Button
                  component={Link}
                  href="/meetings"
                  variant="outlined"
                  sx={{
                    borderColor: "rgba(255,255,255,0.35)",
                    color: "#fff",
                    fontWeight: 600,
                    px: 3,
                    py: 1.25,
                    borderRadius: 2,
                    textTransform: "none",
                    "&:hover": {
                      borderColor: "#fff",
                      bgcolor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  Meeting formats
                </Button>
              </Stack>
            </motion.div>
          </Container>
        </motion.div>
      </Box>

      <Container maxWidth="md" sx={{ py: { xs: 6, md: 8 } }}>
        <motion.div {...sectionMotion}>
          <Box
            sx={{
              mb: 6,
              p: { xs: 2.5, md: 3 },
              borderRadius: 3,
              bgcolor: "#fff",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 8px 32px rgba(26,26,46,0.04)",
            }}
          >
            <Typography
              sx={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "#1a1a2e",
                mb: 2,
              }}
            >
              Contents
            </Typography>
            <Box
              component="ol"
              sx={{
                m: 0,
                pl: 2.5,
                display: "grid",
                gap: 0.75,
                "& a": {
                  color: "#ff6b35",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  "&:hover": { textDecoration: "underline" },
                },
              }}
            >
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.label}</a>
                </li>
              ))}
            </Box>
            <Typography sx={{ mt: 2.5, fontSize: "0.85rem", color: "rgba(0,0,0,0.5)", lineHeight: 1.55 }}>
              Full rewrite for Zoom Workplace (Host Tools panel, Suspend Participant Activities)
              and expanded volunteer guidance — July 2026.
            </Typography>
          </Box>
        </motion.div>

        <motion.div {...sectionMotion}>
          <SectionTitle id="what-a-sherpa-does" icon={<GroupsIcon fontSize="small" />}>
            What a Sherpa Does
          </SectionTitle>
          <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.75, mb: 2, fontSize: "1.02rem" }}>
            A <strong>Sherpa</strong> is the technical moderator of a Sunrise Semester meeting.
            You are <em>not</em> the chairperson and you do not run the recovery content of the
            meeting. Your job is to make sure the meeting <strong>starts on time, runs smoothly
            and safely, and ends on time</strong> — so the chair and the fellowship can focus on
            the meeting itself.
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.75, mb: 1.5, fontSize: "1.02rem" }}>
            Concretely, a Sherpa:
          </Typography>
          <Box component="ul" sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.8, pl: 2.5, mb: 2.5, fontSize: "1.02rem" }}>
            <li>Starts the Zoom meeting and claims the host role using the host key.</li>
            <li>Sets the safety controls (waiting room behavior, screen-share lock, rename lock).</li>
            <li>Promotes the chairperson and a backup to Co-Host.</li>
            <li>Manages audio: mutes disruptive background noise, helps newcomers unmute.</li>
            <li>Manages the “raise hand” queue so the chair can see who wants to share.</li>
            <li>Posts key links in chat (meeting format, Daily Reflection, 7th Tradition).</li>
            <li>Responds immediately to any disruption or “Zoom-bombing.”</li>
            <li>Hands host/co-host off cleanly if they need to leave early.</li>
          </Box>
          <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.75, mb: 5, fontSize: "1.02rem" }}>
            You do <strong>not</strong> need to be an AA member with any particular length of
            sobriety to be a Sherpa — this is a service position focused on the technology.
            Familiarity with the meeting flow still makes you far more effective.
          </Typography>
        </motion.div>

        <motion.div {...sectionMotion}>
          <SectionTitle id="becoming-a-sherpa" icon={<VideoCameraFrontIcon fontSize="small" />}>
            Becoming a Sherpa
          </SectionTitle>
          <Box component="ol" sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.85, pl: 2.5, mb: 2, fontSize: "1.02rem" }}>
            <li>
              Attend the <strong>Sunrise Semester business meeting</strong> (held monthly —
              confirm the current date and time with the General Chair; historically the 2nd Tuesday).
            </li>
            <li>Let the group know you’d like to serve as a Sherpa.</li>
            <li>You’ll be paired with an experienced Sherpa for your first one or two meetings so you can shadow before flying solo.</li>
            <li>
              Get the <strong>host key</strong> from a group officer. Do <strong>not</strong> share it.
            </li>
            <li>
              Watch the Facebook group for the post listing chairs and Sherpas for the current
              two-month rotation — the secretary posts this after the business meeting.
            </li>
          </Box>
          <Callout>
            New volunteers: watch the{" "}
            <Box component="a" href="#training-deck" sx={{ color: "#ff6b35", fontWeight: 700 }}>
              training deck
            </Box>{" "}
            below, read this entire guide once before your first shift, then keep it open on a
            second device or a printout during the meeting.
          </Callout>
        </motion.div>

        <motion.div {...sectionMotion}>
          <SectionTitle id="training-deck" icon={<SlideshowIcon fontSize="small" />}>
            Training Deck
          </SectionTitle>
          <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.75, mb: 2, fontSize: "1.02rem" }}>
            The Sunrise Semester Sherpa Training slide deck (v3.0) — same material as this written
            guide, in presentation form. Use the arrows to step through, or open it full-screen.
          </Typography>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              aspectRatio: "16 / 9",
              borderRadius: 2,
              overflow: "hidden",
              border: "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 12px 40px rgba(26,26,46,0.08)",
              bgcolor: "#1a1a2e",
              mb: 2,
            }}
          >
            <Box
              component="iframe"
              title="Sunrise Semester Sherpa Training deck"
              src={TRAINING_DECK_EMBED}
              allowFullScreen
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
            />
          </Box>
          <Button
            href={TRAINING_DECK_PUB}
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            startIcon={<SlideshowIcon />}
            sx={{
              mb: 5,
              borderColor: "rgba(255,107,53,0.45)",
              color: "#ff6b35",
              fontWeight: 700,
              textTransform: "none",
              "&:hover": {
                borderColor: "#ff6b35",
                bgcolor: "rgba(255,107,53,0.06)",
              },
            }}
          >
            Open deck in a new tab
          </Button>
        </motion.div>

        <motion.div {...sectionMotion}>
          <SectionTitle id="before-you-start" icon={<KeyIcon fontSize="small" />}>
            What You Need Before You Start
          </SectionTitle>
          <Typography sx={{ fontWeight: 700, color: "#1a1a2e", mb: 1, mt: 1 }}>Equipment</Typography>
          <Box component="ul" sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.8, pl: 2.5, mb: 2.5, fontSize: "1.02rem" }}>
            <li>An internet-connected computer (strongly preferred over phone/tablet — host controls are fuller on the desktop app).</li>
            <li>The Zoom desktop app installed and updated (Zoom Workplace 6.7 or newer).</li>
            <li>Optionally a second device so you can also see the meeting the way an attendee does.</li>
          </Box>
          <Typography sx={{ fontWeight: 700, color: "#1a1a2e", mb: 1 }}>Credentials and settings</Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.75, mb: 1.5, fontSize: "1.02rem" }}>
            Get these from your Zoom administrator / General Chair ahead of time:
          </Typography>
          <Box component="ol" sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.85, pl: 2.5, mb: 2, fontSize: "1.02rem" }}>
            <li>
              <strong>Host Key</strong> — a <strong>6-digit code</strong> that lets you claim the host
              role. This is the correct and secure way to become host. It replaces sharing the
              administrator’s Zoom email and password. Never distribute the host key outside the
              Sherpa/chair team, and never post it publicly.
            </li>
            <li>
              <strong>“Join Before Host” enabled</strong> — so attendees (and you) can enter before a
              host is present, then claim host with the key. If you cannot get in early, ask the
              administrator to confirm this is on.
            </li>
            <li>
              <strong>Screen sharing restricted to host</strong> — set at the account level so
              attendees cannot share by default. You can also enforce this in-meeting via Host Tools.
            </li>
          </Box>
          <Callout tone="warn">
            <strong>Security note:</strong> If anyone offers you the administrator’s account email
            and password “to make it easier,” decline and ask for the host key instead. Sharing
            account credentials is a real security risk and is not how Sunrise Semester operates.
          </Callout>
        </motion.div>

        <motion.div {...sectionMotion}>
          <SectionTitle id="installing-zoom" icon={<DownloadIcon fontSize="small" />}>
            Installing Zoom
          </SectionTitle>
          <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.75, mb: 2, fontSize: "1.02rem" }}>
            You only need to do this once. If Zoom is already installed, make sure it’s updated to
            the latest version (Zoom Workplace 6.7 or newer) — open Zoom, click your profile picture,
            and choose <strong>Check for Updates</strong>.
          </Typography>
          <Box component="ol" sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.85, pl: 2.5, mb: 2, fontSize: "1.02rem" }}>
            <li>
              Go to{" "}
              <Box
                component="a"
                href={ZOOM_DOWNLOAD_URL}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "#ff6b35", fontWeight: 600 }}
              >
                zoom.us/download
              </Box>{" "}
              and download <strong>Zoom Workplace</strong> for your operating system.
            </li>
            <li>Open the downloaded installer and click Continue.</li>
            <li>When prompted, choose <strong>Install for me only</strong> (usually does not require admin rights).</li>
            <li>Click Install, wait for it to finish, then open Zoom.</li>
          </Box>
        </motion.div>

        <motion.div {...sectionMotion}>
          <SectionTitle id="claiming-host" icon={<KeyIcon fontSize="small" />}>
            Starting the Meeting (Claiming Host with the Host Key)
          </SectionTitle>
          <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.75, mb: 2, fontSize: "1.02rem" }}>
            Sunrise Semester uses the <strong>same meeting ID and password all week</strong>, so
            you’re not creating a new meeting — you’re joining the standing meeting and then claiming host.
          </Typography>
          <Callout>
            Begin this process <strong>at least 15–20 minutes before start time</strong> (for the
            7:15 AM meeting, that means being in the room by ~7:00 AM). If you also plan to play a
            speaker tape, start closer to 6:30 AM.
          </Callout>
          <Box
            sx={{
              borderRadius: 3,
              bgcolor: "#fff",
              border: "1px solid rgba(0,0,0,0.06)",
              overflow: "hidden",
              mb: 3,
            }}
          >
            {[
              {
                step: "1",
                title: "Join the standing meeting",
                body: "Open the Zoom app and Join using the meeting ID and password. Because “Join Before Host” is on, you’ll be let in even though no host is present yet.",
              },
              {
                step: "2",
                title: "Open Participants",
                body: "On the meeting toolbar, click Participants to open the Participants panel on the right.",
              },
              {
                step: "3",
                title: "Claim Host",
                body: "At the bottom of the Participants panel, click Claim Host. If you don’t see it, click the ⋯ More button at the bottom of the panel first.",
              },
              {
                step: "4",
                title: "Enter the host key",
                body: "In the pop-up, enter your 6-digit host key and click Claim Host. You are now the host and have full controls.",
              },
              {
                step: "5",
                title: "Set safety controls",
                body: "You’ll now see the host toolbar, including Host Tools. Proceed to set your safety controls (next sections).",
              },
            ].map((item) => (
              <Stack
                key={item.step}
                direction="row"
                spacing={2}
                sx={{
                  px: 2.5,
                  py: 2,
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  "&:last-child": { borderBottom: "none" },
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    bgcolor: "#ff6b35",
                    color: "#fff",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 800,
                    fontSize: "0.9rem",
                    flexShrink: 0,
                  }}
                >
                  {item.step}
                </Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: "#1a1a2e", mb: 0.4 }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: "rgba(0,0,0,0.65)", lineHeight: 1.65, fontSize: "0.95rem" }}>
                    {item.body}
                  </Typography>
                </Box>
              </Stack>
            ))}
          </Box>
          <Callout>
            <strong>Zoom Room device?</strong> Tap Participants on the Zoom Rooms Controller, tap
            Claim Host at the bottom of the list, enter the 6-digit host key, and tap OK. Zoom Rooms
            for Conference Room version 4.6.0 or higher is required.
          </Callout>
        </motion.div>

        <motion.div {...sectionMotion}>
          <SectionTitle id="meeting-timeline" icon={<ScheduleIcon fontSize="small" />}>
            Running the Meeting — Step-by-Step Timeline
          </SectionTitle>
          <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.75, mb: 3, fontSize: "1.02rem" }}>
            Times below assume the standard <strong>7:15 AM</strong> meeting start. Adjust for
            Saturday men’s (8:00 AM) and women’s (9:30 AM) meetings.
          </Typography>
          <Stack spacing={1.5} sx={{ mb: 4 }}>
            {timeline.map((item) => (
              <Box
                key={`${item.when}-${item.title}`}
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "130px 1fr" },
                  gap: { xs: 0.5, sm: 2 },
                  p: 2.25,
                  borderRadius: 2.5,
                  bgcolor: "#fff",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    color: "#ff6b35",
                    letterSpacing: "0.02em",
                  }}
                >
                  {item.when}
                </Typography>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: "#1a1a2e", mb: 0.4 }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: "rgba(0,0,0,0.65)", lineHeight: 1.65, fontSize: "0.95rem" }}>
                    {item.body}
                  </Typography>
                  {item.title === "7th Tradition" ? (
                    <Button
                      size="small"
                      href={PAYPAL_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ mt: 1, color: "#ff6b35", fontWeight: 700, textTransform: "none", px: 0 }}
                    >
                      {PAYPAL_URL}
                    </Button>
                  ) : null}
                </Box>
              </Box>
            ))}
          </Stack>
        </motion.div>

        <motion.div {...sectionMotion}>
          <SectionTitle id="host-tools" icon={<SecurityIcon fontSize="small" />}>
            The Host Tools Panel — Your Control Center
          </SectionTitle>
          <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.75, mb: 2, fontSize: "1.02rem" }}>
            In current Zoom (Zoom Workplace 6.7+), the safety controls that used to sit under the
            Security shield are consolidated under <strong>Host Tools</strong> in the meeting toolbar
            (and mirrored in the right-side host panel). This is the single most important control
            for a Sherpa to know. Open it as soon as you claim host.
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.75, mb: 1.5, fontSize: "1.02rem" }}>
            Recommended settings for a Sunrise meeting:
          </Typography>
          <Box
            sx={{
              borderRadius: 3,
              bgcolor: "#fff",
              border: "1px solid rgba(0,0,0,0.06)",
              mb: 2.5,
              overflow: "hidden",
            }}
          >
            {hostToolSettings.map((row) => (
              <Stack
                key={row.label}
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 0.25, sm: 2 }}
                sx={{
                  px: 2.5,
                  py: 1.5,
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  "&:last-child": { borderBottom: "none" },
                }}
              >
                <Typography sx={{ fontWeight: 700, color: "#1a1a2e", minWidth: 180, fontSize: "0.95rem" }}>
                  {row.label}
                </Typography>
                <Typography sx={{ color: "rgba(0,0,0,0.65)", fontSize: "0.95rem" }}>
                  {row.value}
                </Typography>
              </Stack>
            ))}
          </Box>
          <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.75, mb: 1.5, fontSize: "1.02rem" }}>
            Also available from Host Tools: <strong>Enable Waiting Room</strong> (optional),{" "}
            <strong>Suspend Participant Activities</strong> (emergency stop),{" "}
            <strong>Remove Participant</strong>, and <strong>Report to Zoom</strong>.
          </Typography>
          <Callout tone="success">
            Co-Hosts share most of these controls. That’s why promoting the chair and a backup
            matters — any of you can act instantly.
          </Callout>
        </motion.div>

        <motion.div {...sectionMotion}>
          <SectionTitle id="disruptors" icon={<WarningAmberIcon fontSize="small" />}>
            Handling Disruptors and Zoom-Bombers
          </SectionTitle>
          <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.75, mb: 2, fontSize: "1.02rem" }}>
            Because Sunrise Semester is an <strong>open</strong> meeting, we can never make it 100%
            closed — the newcomer must be able to get in. The goal is to make disruption{" "}
            <strong>hard</strong>, and to <strong>respond fast</strong> when it happens.
          </Typography>
          <Typography sx={{ fontWeight: 700, color: "#1a1a2e", mb: 1 }}>Prevention (set before the meeting)</Typography>
          <Box component="ul" sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.8, pl: 2.5, mb: 2.5, fontSize: "1.02rem" }}>
            <li>Password on the meeting (stops random ID-scanning bots).</li>
            <li>Screen sharing set to host-only — the most common Zoom-bomb is a hijacked screen share.</li>
            <li>Rename disabled.</li>
            <li>Waiting Room available if your group chooses to use it during a wave of disruptions.</li>
            <li>Two people with controls (host + at least one co-host) at all times.</li>
          </Box>
          <Typography sx={{ fontWeight: 700, color: "#1a1a2e", mb: 1 }}>If a disruption starts — the fast response</Typography>
          <Box component="ol" sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.85, pl: 2.5, mb: 2, fontSize: "1.02rem" }}>
            <li>
              Hit <strong>Suspend Participant Activities</strong> (Host Tools). This instantly
              disables everyone’s audio, video, chat, annotation, and screen sharing, hides profile
              pictures, ends breakout rooms, and locks the meeting so no one else can enter. It buys
              you calm to act. (Host or Co-Host required.)
            </li>
            <li>Identify the offender in the Participants list.</li>
            <li>
              Remove them: hover their name → <strong>⋯ More → Remove</strong>. Optionally{" "}
              <strong>Report to Zoom</strong> and check “Don’t allow this participant to rejoin.”
            </li>
            <li>Resume by re-enabling the features you need from Host Tools.</li>
            <li>Reassure the room briefly and hand back to the chair. No need to dwell on it.</li>
          </Box>
          <Callout tone="warn">
            Practice this once before your first solo shift. Knowing exactly where Suspend
            Participant Activities and Remove live — before you need them — is the difference
            between a 5-second recovery and a chaotic one.
          </Callout>
        </motion.div>

        <motion.div {...sectionMotion}>
          <SectionTitle id="meeting-details" icon={<ChatIcon fontSize="small" />}>
            Sharing Meeting Details
          </SectionTitle>
          <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.75, mb: 2, fontSize: "1.02rem" }}>
            Sunrise Semester uses the <strong>same meeting ID and password all week</strong>. To
            invite someone, copy and paste:
          </Typography>
          <Box
            sx={{
              borderRadius: 3,
              bgcolor: "#fff",
              border: "1px solid rgba(0,0,0,0.06)",
              px: 2.5,
              py: 1,
              mb: 2,
            }}
          >
            <CopyRow label="Join link (password embedded)" value={ZOOM_URL_EMBEDDED} />
            <CopyRow label="Join link (no password)" value={ZOOM_URL_PLAIN} />
            <CopyRow label="Meeting ID" value={ZOOM_ID} />
            <CopyRow label="Password" value={ZOOM_PASSWORD} />
          </Box>
          <Callout tone="warn">
            Verify before wide distribution: meeting IDs, passcodes, and the embedded-password link
            can change if the account is updated. Confirm current values with the General Chair
            before publishing them anywhere new.
          </Callout>
        </motion.div>

        <motion.div {...sectionMotion}>
          <SectionTitle id="speaker-tape" icon={<VideoCameraFrontIcon fontSize="small" />}>
            Running a Speaker Tape Session (Optional)
          </SectionTitle>
          <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.75, mb: 2, fontSize: "1.02rem" }}>
            Some meetings play a speaker recording. If you are the Sherpa for a speaker-tape
            session:
          </Typography>
          <Box component="ul" sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.8, pl: 2.5, mb: 2.5, fontSize: "1.02rem" }}>
            <li>Arrive earlier — closer to <strong>6:30 AM</strong> for a 7:15 meeting — so you can test audio and screen share.</li>
            <li>Only the host or co-host should share screen/audio for the tape.</li>
            <li>Confirm Share Screen remains host-only for everyone else.</li>
            <li>Have a backup plan if playback fails (chair leads discussion instead).</li>
          </Box>
        </motion.div>

        <motion.div {...sectionMotion}>
          <SectionTitle id="meeting-formats" icon={<MenuBookIcon fontSize="small" />}>
            Meeting Format by Day
          </SectionTitle>
          <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.75, mb: 2, fontSize: "1.02rem" }}>
            Sunrise Semester holds <strong>open</strong> meetings; all are welcome. Each day has a
            slightly different format. Bookmark the current formats and share the link with the
            chairperson.
          </Typography>
          <Box
            sx={{
              borderRadius: 3,
              bgcolor: "#fff",
              border: "1px solid rgba(0,0,0,0.06)",
              overflow: "hidden",
              mb: 2.5,
            }}
          >
            {formatDays.map((row) => (
              <Stack
                key={row.day}
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 0.25, sm: 2 }}
                sx={{
                  px: 2.5,
                  py: 1.5,
                  borderBottom: "1px solid rgba(0,0,0,0.06)",
                  "&:last-child": { borderBottom: "none" },
                }}
              >
                <Typography sx={{ fontWeight: 700, color: "#ff6b35", minWidth: 150, fontSize: "0.95rem" }}>
                  {row.day}
                </Typography>
                <Typography sx={{ color: "rgba(0,0,0,0.65)", fontSize: "0.95rem", lineHeight: 1.5 }}>
                  {row.type}
                </Typography>
              </Stack>
            ))}
          </Box>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 5 }}>
            <Button
              component={Link}
              href="/meeting-topics"
              variant="contained"
              startIcon={<AutoAwesomeIcon />}
              sx={{
                background: "linear-gradient(135deg, #c43c68 0%, #ff6b35 100%)",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              Prepare a discussion topic
            </Button>
            <Button
              component={Link}
              href="/meetings"
              variant="outlined"
              sx={{
                borderColor: "rgba(255,107,53,0.4)",
                color: "#ff6b35",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              Open formats on Meetings
            </Button>
            <Button
              component={Link}
              href="/resources#meeting-formats"
              variant="outlined"
              sx={{
                borderColor: "rgba(255,107,53,0.4)",
                color: "#ff6b35",
                fontWeight: 600,
                textTransform: "none",
                borderRadius: 2,
              }}
            >
              Resources · Meeting formats
            </Button>
          </Stack>
        </motion.div>

        <motion.div {...sectionMotion}>
          <SectionTitle id="collateral" icon={<MenuBookIcon fontSize="small" />}>
            Meeting Collateral
          </SectionTitle>
          <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.75, mb: 2, fontSize: "1.02rem" }}>
            Content and links the chairperson typically reads or shares. Sherpas often paste these
            into chat at the start so attendees can follow along.
          </Typography>

          <Typography sx={{ fontWeight: 700, color: "#1a1a2e", mb: 1 }}>Preamble</Typography>
          <Typography sx={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.45)", mb: 1 }}>
            Source: AA World Services
          </Typography>
          <Box
            sx={{
              p: 2.5,
              mb: 3,
              borderRadius: 2,
              bgcolor: "rgba(0,0,0,0.03)",
              borderLeft: "3px solid #ff6b35",
              color: "rgba(0,0,0,0.72)",
              lineHeight: 1.75,
              fontSize: "0.98rem",
            }}
          >
            <p style={{ marginTop: 0 }}>
              Alcoholics Anonymous is a fellowship of people who share their experience, strength
              and hope with each other that they may solve their common problem and help others to
              recover from alcoholism.
            </p>
            <p style={{ marginBottom: 0 }}>
              The only requirement for membership is a desire to stop drinking. There are no dues or
              fees for A.A. membership; we are self-supporting through our own contributions. A.A.
              is not allied with any sect, denomination, politics, organization or institution; does
              not wish to engage in any controversy, neither endorses nor opposes any causes. Our
              primary purpose is to stay sober and help other alcoholics to achieve sobriety.
            </p>
          </Box>

          <Typography sx={{ fontWeight: 700, color: "#1a1a2e", mb: 1 }}>How It Works</Typography>
          <Typography sx={{ fontSize: "0.85rem", color: "rgba(0,0,0,0.45)", mb: 1 }}>
            Source: Alcoholics Anonymous, Chapter 5
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.75, mb: 2, fontSize: "1.02rem" }}>
            Chairs commonly read from Chapter 5 (“How It Works”), including the Twelve Steps. Keep a
            Big Book or the day’s{" "}
            <Box component={Link} href="/meetings" sx={{ color: "#ff6b35", fontWeight: 600 }}>
              meeting format PDF
            </Box>{" "}
            handy rather than pasting the full reading into chat.
          </Typography>

          <Typography sx={{ fontWeight: 700, color: "#1a1a2e", mb: 1 }}>Daily Reflection</Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.72)", lineHeight: 1.75, mb: 1.5, fontSize: "1.02rem" }}>
            Read at the start of many Sunrise Semester meetings. Paste this link in chat so
            attendees can open it and volunteer to read:
          </Typography>
          <Button
            href={DAILY_REFLECTION_URL}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "#ff6b35", fontWeight: 700, textTransform: "none", px: 0, mb: 1 }}
          >
            {DAILY_REFLECTION_URL}
          </Button>
          <Typography sx={{ color: "rgba(0,0,0,0.55)", fontSize: "0.9rem", mb: 2, lineHeight: 1.6 }}>
            You can also point people to this site’s{" "}
            <Box component={Link} href="/" sx={{ color: "#ff6b35", fontWeight: 600 }}>
              Daily Reflection
            </Box>{" "}
            on the home page. If the aa.org link 404s, search “AA Daily Reflections” on aa.org and
            update it.
          </Typography>
          <Typography sx={{ fontWeight: 700, color: "#1a1a2e", mb: 1 }}>7th Tradition</Typography>
          <Button
            href={PAYPAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: "#ff6b35", fontWeight: 700, textTransform: "none", px: 0, mb: 5 }}
          >
            {PAYPAL_URL}
          </Button>
        </motion.div>

        <motion.div {...sectionMotion}>
          <SectionTitle id="faq" icon={<HelpOutlineIcon fontSize="small" />}>
            Frequently Asked Questions
          </SectionTitle>
          <Stack spacing={2} sx={{ mb: 4 }}>
            {faqs.map((item) => (
              <Box
                key={item.q}
                sx={{
                  p: 2.5,
                  borderRadius: 2.5,
                  bgcolor: "#fff",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                <Typography sx={{ fontWeight: 700, color: "#1a1a2e", mb: 0.75 }}>
                  {item.q}
                </Typography>
                <Typography sx={{ color: "rgba(0,0,0,0.65)", lineHeight: 1.7, fontSize: "0.98rem" }}>
                  {item.a}
                </Typography>
              </Box>
            ))}
          </Stack>
        </motion.div>

        <Box
          sx={{
            mt: 2,
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            background:
              "linear-gradient(135deg, rgba(255,107,53,0.08) 0%, rgba(255,167,81,0.12) 100%)",
            border: "1px solid rgba(255,107,53,0.18)",
            textAlign: "center",
          }}
        >
          <Typography
            sx={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "1.4rem",
              fontWeight: 700,
              color: "#1a1a2e",
              mb: 1,
            }}
          >
            Ready for your shift?
          </Typography>
          <Typography sx={{ color: "rgba(0,0,0,0.6)", mb: 3, lineHeight: 1.65 }}>
            Questions about the host key or volunteering? Email{" "}
            <Box
              component="a"
              href={`mailto:${HOST_KEY_EMAIL}`}
              sx={{ color: "#ff6b35", fontWeight: 600 }}
            >
              {HOST_KEY_EMAIL}
            </Box>{" "}
            or talk with the General Chair at the business meeting.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            sx={{ justifyContent: "center" }}
          >
            <Button
              component={Link}
              href="/meetings"
              variant="contained"
              sx={{
                bgcolor: "#ff6b35",
                fontWeight: 700,
                px: 3,
                borderRadius: 2,
                textTransform: "none",
                "&:hover": { bgcolor: "#e55a28" },
              }}
            >
              Meetings & formats
            </Button>
            <Button
              component={Link}
              href="/resources"
              variant="outlined"
              sx={{
                borderColor: "rgba(255,107,53,0.4)",
                color: "#ff6b35",
                fontWeight: 600,
                px: 3,
                borderRadius: 2,
                textTransform: "none",
              }}
            >
              Resources
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
