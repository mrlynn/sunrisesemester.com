"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  defaultAgendaSections,
  defaultAppliesToMonth,
  emptyCommitmentSchedule,
  emptyScheduleRow,
  formatMonthLabel,
  meetingSlugFromDate,
  STANDARD_SCHEDULE_DAYS,
} from "@/lib/businessMeetingShared";
import { parseBusinessMeetingNotes } from "@/lib/parseBusinessMeetingNotes";

function toDateInputValue(date) {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function normalizeInitial(initial) {
  if (!initial) {
    return {
      meetingDate: "",
      slug: "",
      published: false,
      chair: "",
      openedAt: "",
      openingNotes: "",
      sections: defaultAgendaSections(),
      oldBusiness: "",
      newBusiness: "",
      adjournment: { movedBy: "", time: "", closingNotes: "" },
      signOff: "",
      attachedReports: [],
      commitmentSchedules: [],
    };
  }
  return {
    meetingDate: toDateInputValue(initial.meetingDate),
    slug: initial.slug || "",
    published: Boolean(initial.published),
    chair: initial.chair || "",
    openedAt: initial.openedAt || "",
    openingNotes: initial.openingNotes || "",
    sections:
      Array.isArray(initial.sections) && initial.sections.length > 0
        ? initial.sections.map((s) => ({
            key: s.key || "",
            title: s.title || "",
            content: s.content || "",
            motion: {
              movedBy: s.motion?.movedBy || "",
              secondedBy: s.motion?.secondedBy || "",
              outcome: s.motion?.outcome || "",
            },
          }))
        : defaultAgendaSections(),
    oldBusiness: initial.oldBusiness || "",
    newBusiness: initial.newBusiness || "",
    adjournment: {
      movedBy: initial.adjournment?.movedBy || "",
      time: initial.adjournment?.time || "",
      closingNotes: initial.adjournment?.closingNotes || "",
    },
    signOff: initial.signOff || "",
    attachedReports: Array.isArray(initial.attachedReports)
      ? initial.attachedReports.map((r) => ({
          label: r.label || "",
          title: r.title || "",
          content: r.content || "",
        }))
      : [],
    commitmentSchedules: Array.isArray(initial.commitmentSchedules)
      ? initial.commitmentSchedules.map((s) => ({
          title: s.title || "",
          appliesToMonth:
            s.appliesToMonth ||
            (initial.meetingDate ? defaultAppliesToMonth(initial.meetingDate) : ""),
          columns: [...(s.columns || [])],
          rows: (s.rows || []).map((row) => ({
            day: row.day || "",
            cells: [...(row.cells || [])],
          })),
        }))
      : [],
  };
}

function MotionFields({ motion, onChange }) {
  return (
    <Stack spacing={1.5} sx={{ mt: 1.5, pt: 1.5, borderTop: 1, borderColor: "divider" }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
        Motion (optional)
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <TextField
          label="Moved by"
          size="small"
          fullWidth
          value={motion.movedBy}
          onChange={(e) => onChange({ ...motion, movedBy: e.target.value })}
        />
        <TextField
          label="Seconded by"
          size="small"
          fullWidth
          value={motion.secondedBy}
          onChange={(e) => onChange({ ...motion, secondedBy: e.target.value })}
        />
        <TextField
          label="Outcome"
          size="small"
          fullWidth
          placeholder="e.g. Carried — all in favor"
          value={motion.outcome}
          onChange={(e) => onChange({ ...motion, outcome: e.target.value })}
        />
      </Stack>
    </Stack>
  );
}

export default function BusinessMeetingForm({ initial, mode }) {
  const router = useRouter();
  const [state, setState] = React.useState(() => normalizeInitial(initial));
  const [slugTouched, setSlugTouched] = React.useState(Boolean(initial?.slug));
  const [message, setMessage] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const [pasteNotes, setPasteNotes] = React.useState("");
  const [pasteWarnings, setPasteWarnings] = React.useState([]);

  function set(patch) {
    setState((s) => ({ ...s, ...patch }));
  }

  function onMeetingDateChange(e) {
    const meetingDate = e.target.value;
    setState((s) => {
      const oldDefault = s.meetingDate ? defaultAppliesToMonth(s.meetingDate) : "";
      const newDefault = meetingDate ? defaultAppliesToMonth(meetingDate) : "";
      const patch = { meetingDate };
      if (!slugTouched && meetingDate) {
        patch.slug = meetingSlugFromDate(meetingDate);
      }
      return {
        ...s,
        ...patch,
        commitmentSchedules: s.commitmentSchedules.map((sched) => ({
          ...sched,
          appliesToMonth:
            !sched.appliesToMonth || sched.appliesToMonth === oldDefault
              ? newDefault
              : sched.appliesToMonth,
        })),
      };
    });
  }

  function applyPastedNotes() {
    setError(null);
    setMessage(null);
    setPasteWarnings([]);
    const result = parseBusinessMeetingNotes(pasteNotes, {
      meetingDate: state.meetingDate || undefined,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }

    const parsed = result.value;
    setState((s) => {
      const meetingDate = s.meetingDate || parsed.meetingDate;
      const slug = slugTouched
        ? s.slug
        : parsed.slug || (meetingDate ? meetingSlugFromDate(meetingDate) : s.slug);
      return {
        ...s,
        meetingDate,
        slug,
        openingNotes: parsed.openingNotes || s.openingNotes,
        sections: parsed.sections.length > 0 ? parsed.sections : s.sections,
        oldBusiness: parsed.oldBusiness,
        newBusiness: parsed.newBusiness,
        adjournment: {
          movedBy: parsed.adjournment.movedBy || s.adjournment.movedBy,
          time: parsed.adjournment.time || s.adjournment.time,
          closingNotes: parsed.adjournment.closingNotes || s.adjournment.closingNotes,
        },
        commitmentSchedules:
          parsed.commitmentSchedules.length > 0
            ? parsed.commitmentSchedules
            : s.commitmentSchedules,
      };
    });
    setPasteWarnings(result.warnings || []);
    setMessage(
      "Notes parsed into the form. Review the fields below, then save. Nothing is published until you save.",
    );
  }

  function updateSection(index, patch) {
    setState((s) => ({
      ...s,
      sections: s.sections.map((sec, i) => (i === index ? { ...sec, ...patch } : sec)),
    }));
  }

  function moveSection(index, dir) {
    setState((s) => {
      const next = [...s.sections];
      const j = index + dir;
      if (j < 0 || j >= next.length) return s;
      [next[index], next[j]] = [next[j], next[index]];
      return { ...s, sections: next };
    });
  }

  function addSection() {
    setState((s) => ({
      ...s,
      sections: [
        ...s.sections,
        { key: `custom-${Date.now()}`, title: "Custom section", content: "", motion: { movedBy: "", secondedBy: "", outcome: "" } },
      ],
    }));
  }

  function removeSection(index) {
    setState((s) => ({
      ...s,
      sections: s.sections.filter((_, i) => i !== index),
    }));
  }

  function updateReport(index, patch) {
    setState((s) => ({
      ...s,
      attachedReports: s.attachedReports.map((r, i) => (i === index ? { ...r, ...patch } : r)),
    }));
  }

  function addReport() {
    setState((s) => ({
      ...s,
      attachedReports: [...s.attachedReports, { label: "", title: "", content: "" }],
    }));
  }

  function removeReport(index) {
    setState((s) => ({
      ...s,
      attachedReports: s.attachedReports.filter((_, i) => i !== index),
    }));
  }

  function updateSchedule(schedIndex, patch) {
    setState((s) => ({
      ...s,
      commitmentSchedules: s.commitmentSchedules.map((sched, i) =>
        i === schedIndex ? { ...sched, ...patch } : sched,
      ),
    }));
  }

  function addSchedule() {
    setState((s) => ({
      ...s,
      commitmentSchedules: [
        ...s.commitmentSchedules,
        emptyCommitmentSchedule(4, s.meetingDate ? defaultAppliesToMonth(s.meetingDate) : ""),
      ],
    }));
  }

  function removeSchedule(schedIndex) {
    setState((s) => ({
      ...s,
      commitmentSchedules: s.commitmentSchedules.filter((_, i) => i !== schedIndex),
    }));
  }

  function addScheduleColumn(schedIndex) {
    setState((s) => ({
      ...s,
      commitmentSchedules: s.commitmentSchedules.map((sched, i) => {
        if (i !== schedIndex) return sched;
        const columns = [...sched.columns, ""];
        const rows = sched.rows.map((row) => ({
          ...row,
          cells: [...row.cells, ""],
        }));
        return { ...sched, columns, rows };
      }),
    }));
  }

  function removeScheduleColumn(schedIndex, colIndex) {
    setState((s) => ({
      ...s,
      commitmentSchedules: s.commitmentSchedules.map((sched, i) => {
        if (i !== schedIndex || sched.columns.length <= 1) return sched;
        return {
          ...sched,
          columns: sched.columns.filter((_, ci) => ci !== colIndex),
          rows: sched.rows.map((row) => ({
            ...row,
            cells: row.cells.filter((_, ci) => ci !== colIndex),
          })),
        };
      }),
    }));
  }

  function updateScheduleColumn(schedIndex, colIndex, value) {
    setState((s) => ({
      ...s,
      commitmentSchedules: s.commitmentSchedules.map((sched, i) => {
        if (i !== schedIndex) return sched;
        const columns = sched.columns.map((c, ci) => (ci === colIndex ? value : c));
        return { ...sched, columns };
      }),
    }));
  }

  function updateScheduleCell(schedIndex, rowIndex, colIndex, value) {
    setState((s) => ({
      ...s,
      commitmentSchedules: s.commitmentSchedules.map((sched, i) => {
        if (i !== schedIndex) return sched;
        const rows = sched.rows.map((row, ri) => {
          if (ri !== rowIndex) return row;
          const cells = row.cells.map((c, ci) => (ci === colIndex ? value : c));
          return { ...row, cells };
        });
        return { ...sched, rows };
      }),
    }));
  }

  function updateScheduleDay(schedIndex, rowIndex, value) {
    setState((s) => ({
      ...s,
      commitmentSchedules: s.commitmentSchedules.map((sched, i) => {
        if (i !== schedIndex) return sched;
        const rows = sched.rows.map((row, ri) => (ri === rowIndex ? { ...row, day: value } : row));
        return { ...sched, rows };
      }),
    }));
  }

  function addScheduleRow(schedIndex) {
    setState((s) => ({
      ...s,
      commitmentSchedules: s.commitmentSchedules.map((sched, i) => {
        if (i !== schedIndex) return sched;
        return {
          ...sched,
          rows: [...sched.rows, emptyScheduleRow("", sched.columns.length)],
        };
      }),
    }));
  }

  function fillStandardDays(schedIndex) {
    setState((s) => ({
      ...s,
      commitmentSchedules: s.commitmentSchedules.map((sched, i) => {
        if (i !== schedIndex) return sched;
        return {
          ...sched,
          rows: STANDARD_SCHEDULE_DAYS.map((day) => emptyScheduleRow(day, sched.columns.length)),
        };
      }),
    }));
  }

  function buildPayload() {
    return {
      meetingDate: state.meetingDate,
      slug: state.slug,
      published: state.published,
      chair: state.chair,
      openedAt: state.openedAt,
      openingNotes: state.openingNotes,
      sections: state.sections,
      oldBusiness: state.oldBusiness,
      newBusiness: state.newBusiness,
      adjournment: state.adjournment,
      signOff: state.signOff,
      attachedReports: state.attachedReports,
      commitmentSchedules: state.commitmentSchedules,
    };
  }

  async function save() {
    setMessage(null);
    setError(null);
    setBusy(true);
    try {
      const url =
        mode === "create"
          ? "/api/admin/business-meetings"
          : `/api/admin/business-meetings/${initial._id}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Save failed.");
        return;
      }
      setMessage("Saved.");
      if (mode === "create") {
        router.push(`/admin/business-meetings/${data._id}`);
        router.refresh();
      } else {
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (mode !== "edit") return;
    if (!window.confirm("Delete these minutes permanently?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/business-meetings/${initial._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Delete failed.");
        return;
      }
      router.push("/admin/business-meetings");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={2}>
          <Typography variant="h6">Paste notes to import</Typography>
          <Typography variant="body2" color="text.secondary">
            Paste a secretary write-up with headings like <em>Chair Rotation</em>,{" "}
            <em>Treasurer&apos;s Report</em>, <em>Old Business</em>, <em>New Business</em>,{" "}
            <em>Action Items</em>, and <em>Adjournment</em>. Lines such as{" "}
            <code>Motion:</code> / <code>Second:</code> / <code>Result:</code> are picked up
            automatically. Review everything below before saving.
          </Typography>
          <TextField
            label="Meeting notes"
            fullWidth
            multiline
            minRows={8}
            value={pasteNotes}
            onChange={(e) => setPasteNotes(e.target.value)}
            placeholder="Paste the full meeting notes here…"
          />
          <Button
            variant="outlined"
            onClick={applyPastedNotes}
            disabled={!pasteNotes.trim()}
            sx={{ alignSelf: "flex-start" }}
          >
            Parse into form
          </Button>
          {pasteWarnings.length > 0 ? (
            <Alert severity="warning">
              {pasteWarnings.map((w) => (
                <div key={w}>{w}</div>
              ))}
            </Alert>
          ) : null}
          {error ? <Alert severity="error">{error}</Alert> : null}
          {message ? <Alert severity="success">{message}</Alert> : null}
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={2}>
          <Typography variant="h6">Meeting details</Typography>
          <Typography variant="body2" color="text.secondary">
            Sign in at <strong>/admin</strong> to edit. One record per monthly business meeting.
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Meeting date"
              type="date"
              required
              fullWidth
              value={state.meetingDate}
              onChange={onMeetingDateChange}
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <TextField
              label="URL slug"
              fullWidth
              value={state.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set({ slug: e.target.value });
              }}
              helperText="Used in the public link, e.g. 2022-12"
            />
          </Stack>
          <FormControlLabel
            control={
              <Switch
                checked={state.published}
                onChange={(e) => set({ published: e.target.checked })}
              />
            }
            label="Published (visible on the public site)"
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Chair"
              fullWidth
              value={state.chair}
              onChange={(e) => set({ chair: e.target.value })}
            />
            <TextField
              label="Opened at"
              fullWidth
              placeholder="8:03 AM"
              value={state.openedAt}
              onChange={(e) => set({ openedAt: e.target.value })}
            />
          </Stack>
          <TextField
            label="Opening notes"
            fullWidth
            multiline
            minRows={2}
            placeholder="Traditions read, Declaration of Unity, etc."
            value={state.openingNotes}
            onChange={(e) => set({ openingNotes: e.target.value })}
          />
          <TextField
            label="Sign-off"
            fullWidth
            placeholder="Yours in Service, Name"
            value={state.signOff}
            onChange={(e) => set({ signOff: e.target.value })}
          />
        </Stack>
      </Paper>

      <Typography variant="h6">Agenda reports</Typography>
      {state.sections.map((section, index) => (
        <Accordion key={section.key || index} defaultExpanded={index < 3} disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexGrow: 1, pr: 1 }}>
              <Typography sx={{ fontWeight: 600, flexGrow: 1 }}>
                {section.title || `Section ${index + 1}`}
              </Typography>
              <IconButton
                size="small"
                aria-label="Move up"
                onClick={(e) => {
                  e.stopPropagation();
                  moveSection(index, -1);
                }}
                disabled={index === 0}
              >
                <ArrowUpwardIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                aria-label="Move down"
                onClick={(e) => {
                  e.stopPropagation();
                  moveSection(index, 1);
                }}
                disabled={index === state.sections.length - 1}
              >
                <ArrowDownwardIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                aria-label="Remove section"
                onClick={(e) => {
                  e.stopPropagation();
                  removeSection(index);
                }}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Stack>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <TextField
                label="Section title"
                fullWidth
                value={section.title}
                onChange={(e) => updateSection(index, { title: e.target.value })}
              />
              <TextField
                label="Notes"
                fullWidth
                multiline
                minRows={3}
                value={section.content}
                onChange={(e) => updateSection(index, { content: e.target.value })}
              />
              <MotionFields
                motion={section.motion}
                onChange={(motion) => updateSection(index, { motion })}
              />
            </Stack>
          </AccordionDetails>
        </Accordion>
      ))}
      <Button startIcon={<AddIcon />} onClick={addSection} sx={{ alignSelf: "flex-start" }}>
        Add agenda section
      </Button>

      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={2}>
          <Typography variant="h6">Old & new business</Typography>
          <TextField
            label="Old business"
            fullWidth
            multiline
            minRows={3}
            value={state.oldBusiness}
            onChange={(e) => set({ oldBusiness: e.target.value })}
          />
          <TextField
            label="New business"
            fullWidth
            multiline
            minRows={3}
            value={state.newBusiness}
            onChange={(e) => set({ newBusiness: e.target.value })}
          />
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
        <Stack spacing={2}>
          <Typography variant="h6">Adjournment</Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Moved by"
              fullWidth
              value={state.adjournment.movedBy}
              onChange={(e) =>
                set({ adjournment: { ...state.adjournment, movedBy: e.target.value } })
              }
            />
            <TextField
              label="Time"
              fullWidth
              placeholder="8:35 AM"
              value={state.adjournment.time}
              onChange={(e) =>
                set({ adjournment: { ...state.adjournment, time: e.target.value } })
              }
            />
          </Stack>
          <TextField
            label="Closing"
            fullWidth
            placeholder="Responsibility Declaration"
            value={state.adjournment.closingNotes}
            onChange={(e) =>
              set({ adjournment: { ...state.adjournment, closingNotes: e.target.value } })
            }
          />
        </Stack>
      </Paper>

      <Typography variant="h6">Attached reports</Typography>
      {state.attachedReports.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Optional full-text reports referenced in the minutes (GSR, Grapevine, elections, etc.).
        </Typography>
      ) : null}
      {state.attachedReports.map((report, index) => (
        <Paper key={index} variant="outlined" sx={{ p: 2 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography sx={{ fontWeight: 600, flexGrow: 1 }}>
                Report {index + 1}
              </Typography>
              <IconButton color="error" onClick={() => removeReport(index)} aria-label="Remove report">
                <DeleteOutlineIcon />
              </IconButton>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Label"
                placeholder="#4"
                value={report.label}
                onChange={(e) => updateReport(index, { label: e.target.value })}
                sx={{ maxWidth: 160 }}
              />
              <TextField
                label="Title"
                fullWidth
                value={report.title}
                onChange={(e) => updateReport(index, { title: e.target.value })}
              />
            </Stack>
            <TextField
              label="Content"
              fullWidth
              multiline
              minRows={4}
              value={report.content}
              onChange={(e) => updateReport(index, { content: e.target.value })}
            />
          </Stack>
        </Paper>
      ))}
      <Button startIcon={<AddIcon />} onClick={addReport} sx={{ alignSelf: "flex-start" }}>
        Add attached report
      </Button>

      <Typography variant="h6">Commitment schedules</Typography>
      <Typography variant="body2" color="text.secondary">
        Add one or more tables (monthly chair, sherpa, greeter, etc.). These apply to the month
        after the business meeting by default (second Tuesday sets next month’s commitments).
      </Typography>
      {state.commitmentSchedules.map((sched, schedIndex) => (
        <Paper key={schedIndex} variant="outlined" sx={{ p: 2, overflow: "auto" }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography sx={{ fontWeight: 600, flexGrow: 1 }}>
                Schedule {schedIndex + 1}
              </Typography>
              <Button size="small" onClick={() => fillStandardDays(schedIndex)}>
                Fill Sun–Fri
              </Button>
              <IconButton
                color="error"
                onClick={() => removeSchedule(schedIndex)}
                aria-label="Remove schedule"
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField
                label="Schedule title"
                fullWidth
                placeholder="JANUARY 2023 SCHEDULE"
                value={sched.title}
                onChange={(e) => updateSchedule(schedIndex, { title: e.target.value })}
              />
              <TextField
                label="Applies to month"
                type="month"
                value={sched.appliesToMonth || ""}
                onChange={(e) =>
                  updateSchedule(schedIndex, { appliesToMonth: e.target.value })
                }
                InputLabelProps={{ shrink: true }}
                helperText={
                  sched.appliesToMonth
                    ? `Shown as the ${formatMonthLabel(sched.appliesToMonth)} schedule`
                    : state.meetingDate
                      ? `Defaults to ${formatMonthLabel(defaultAppliesToMonth(state.meetingDate))}`
                      : "Set the meeting date to default this"
                }
                sx={{ minWidth: { sm: 200 } }}
              />
            </Stack>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              <Button size="small" startIcon={<AddIcon />} onClick={() => addScheduleColumn(schedIndex)}>
                Add column
              </Button>
            </Stack>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, minWidth: 72 }}>Day</TableCell>
                  {sched.columns.map((col, colIndex) => (
                    <TableCell key={colIndex}>
                      <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
                        <TextField
                          size="small"
                          value={col}
                          placeholder="Role"
                          onChange={(e) =>
                            updateScheduleColumn(schedIndex, colIndex, e.target.value)
                          }
                          sx={{ minWidth: 100 }}
                        />
                        <IconButton
                          size="small"
                          onClick={() => removeScheduleColumn(schedIndex, colIndex)}
                          disabled={sched.columns.length <= 1}
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sched.rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell>
                      <TextField
                        size="small"
                        value={row.day}
                        onChange={(e) =>
                          updateScheduleDay(schedIndex, rowIndex, e.target.value)
                        }
                        sx={{ width: 72 }}
                      />
                    </TableCell>
                    {sched.columns.map((_, colIndex) => (
                      <TableCell key={colIndex}>
                        <TextField
                          size="small"
                          fullWidth
                          value={row.cells[colIndex] || ""}
                          onChange={(e) =>
                            updateScheduleCell(schedIndex, rowIndex, colIndex, e.target.value)
                          }
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button size="small" onClick={() => addScheduleRow(schedIndex)}>
              Add row
            </Button>
          </Stack>
        </Paper>
      ))}
      <Button startIcon={<AddIcon />} onClick={addSchedule} sx={{ alignSelf: "flex-start" }}>
        Add commitment schedule
      </Button>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {message ? <Alert severity="success">{message}</Alert> : null}

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button variant="contained" onClick={save} disabled={busy}>
          {busy ? "Saving…" : "Save minutes"}
        </Button>
        {mode === "edit" ? (
          <Button color="error" variant="outlined" onClick={remove} disabled={busy}>
            Delete
          </Button>
        ) : null}
      </Stack>
    </Stack>
  );
}
