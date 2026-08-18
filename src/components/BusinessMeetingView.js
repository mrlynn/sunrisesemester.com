"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import CommitmentScheduleTable from "@/components/CommitmentScheduleTable";
import { formatMeetingDateLabel } from "@/lib/businessMeetingShared";

function hasMotion(motion) {
  return Boolean(motion?.movedBy || motion?.secondedBy || motion?.outcome);
}

function MotionBlock({ motion }) {
  if (!hasMotion(motion)) return null;
  const parts = [];
  if (motion.movedBy) parts.push(`Moved by ${motion.movedBy}`);
  if (motion.secondedBy) parts.push(`2nd by ${motion.secondedBy}`);
  if (motion.outcome) parts.push(motion.outcome);
  return (
    <Typography
      variant="body2"
      sx={{ mt: 1.5, fontStyle: "italic", color: "text.secondary" }}
    >
      {parts.join(". ")}
      {parts.length ? "." : ""}
    </Typography>
  );
}

function Paragraphs({ text }) {
  if (!text?.trim()) return null;
  return text.split(/\n\n+/).map((block, i) => (
    <Typography key={i} variant="body1" sx={{ mt: i === 0 ? 0 : 1.5, lineHeight: 1.75 }}>
      {block.trim()}
    </Typography>
  ));
}

export function BusinessMeetingMinutes({ meeting }) {
  const dateLabel = formatMeetingDateLabel(meeting.meetingDate);
  const openingLine = [
    meeting.chair ? `${meeting.chair} was chairing` : null,
    meeting.openedAt ? `and opened the meeting at ${meeting.openedAt}` : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.5, md: 4 },
        borderRadius: 3,
        border: "1px solid rgba(196,60,104,0.18)",
        background: "rgba(255,255,255,0.9)",
      }}
    >
      <Typography
        variant="overline"
        sx={{ color: "#c43c68", fontWeight: 700, letterSpacing: "0.2em" }}
      >
        Sunrise Semester
      </Typography>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mt: 0.5 }}>
        {dateLabel} Business Meeting Minutes
      </Typography>
      {openingLine || meeting.openingNotes ? (
        <Box sx={{ mt: 2 }}>
          {openingLine ? (
            <Typography variant="body1" sx={{ lineHeight: 1.75 }}>
              {openingLine}.
            </Typography>
          ) : null}
          <Paragraphs text={meeting.openingNotes} />
        </Box>
      ) : null}

      {(meeting.sections || []).map((section) => {
        if (!section.title && !section.content && !hasMotion(section.motion)) {
          return null;
        }
        return (
          <Box key={section.key || section.title} sx={{ mt: 3 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 700, color: "#5b2c6f" }}>
              {section.title}
            </Typography>
            <Paragraphs text={section.content} />
            <MotionBlock motion={section.motion} />
          </Box>
        );
      })}

      {meeting.oldBusiness?.trim() ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, color: "#5b2c6f" }}>
            Old Business
          </Typography>
          <Paragraphs text={meeting.oldBusiness} />
        </Box>
      ) : null}

      {meeting.newBusiness?.trim() ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, color: "#5b2c6f" }}>
            New Business
          </Typography>
          <Paragraphs text={meeting.newBusiness} />
        </Box>
      ) : null}

      {meeting.adjournment &&
      (meeting.adjournment.movedBy ||
        meeting.adjournment.time ||
        meeting.adjournment.closingNotes) ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" sx={{ lineHeight: 1.75 }}>
            {[
              meeting.adjournment.movedBy
                ? `Moved by ${meeting.adjournment.movedBy}`
                : null,
              meeting.adjournment.time
                ? `to adjourn at ${meeting.adjournment.time}`
                : null,
              meeting.adjournment.closingNotes
                ? `with the ${meeting.adjournment.closingNotes}`
                : null,
            ]
              .filter(Boolean)
              .join(" ")}
            .
          </Typography>
        </Box>
      ) : null}

      {(meeting.attachedReports || []).length > 0 ? (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 3 }} />
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, color: "#5b2c6f" }}>
            Reports attached
          </Typography>
          {meeting.attachedReports.map((report, i) => (
            <Box key={i} sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {[report.label, report.title].filter(Boolean).join(" — ") || `Report ${i + 1}`}
              </Typography>
              <Paragraphs text={report.content} />
            </Box>
          ))}
        </Box>
      ) : null}

      {(meeting.commitmentSchedules || []).length > 0 ? (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" component="h2" sx={{ fontWeight: 700, color: "#5b2c6f", mb: 1 }}>
            Commitment schedules
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Voted at this meeting for the following month’s service slots.
          </Typography>
          {(meeting.commitmentSchedules || []).map((sched, i) => (
            <Box key={i} sx={{ mt: 2 }}>
              <CommitmentScheduleTable schedule={sched} />
            </Box>
          ))}
        </Box>
      ) : null}

      {meeting.signOff ? (
        <Typography variant="body1" sx={{ mt: 4, fontStyle: "italic" }}>
          {meeting.signOff}
        </Typography>
      ) : null}
    </Paper>
  );
}

