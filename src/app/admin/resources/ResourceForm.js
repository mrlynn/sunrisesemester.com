"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import MenuItem from "@mui/material/MenuItem";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Box from "@mui/material/Box";
import { MEETING_FORMAT_SLOTS } from "@/lib/meetingFormats";

const CATEGORIES = [
  { value: "meeting-format", label: "Meeting format" },
  { value: "guide", label: "Guide" },
  { value: "service", label: "Service" },
  { value: "link", label: "Link" },
  { value: "other", label: "Other" },
];

const MAX_PDF_BYTES = 25 * 1024 * 1024;

function formatBytes(n) {
  if (!n) return "";
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ResourceForm({ initial, mode }) {
  const router = useRouter();
  const fileInputRef = React.useRef(null);

  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [description, setDescription] = React.useState(initial?.description ?? "");
  const [category, setCategory] = React.useState(initial?.category ?? "link");
  const [kind, setKind] = React.useState(initial?.kind ?? "link");
  const [externalUrl, setExternalUrl] = React.useState(initial?.externalUrl ?? "");
  const [fileMeta, setFileMeta] = React.useState(initial?.file ?? null);
  const [sourceNote, setSourceNote] = React.useState(initial?.sourceNote ?? "");
  const [meetingKey, setMeetingKey] = React.useState(initial?.meetingKey ?? "");
  const [sortOrder, setSortOrder] = React.useState(
    initial?.sortOrder !== undefined ? String(initial.sortOrder) : "0",
  );
  const [published, setPublished] = React.useState(initial?.published ?? true);
  const [message, setMessage] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  async function uploadPdf(file) {
    setError(null);
    setMessage(null);
    if (!file) return;
    if (file.type && file.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      setError("PDF must be 25 MB or smaller.");
      return;
    }
    setUploading(true);
    try {
      const safeName = file.name.replace(/[^\w.\-]+/g, "_") || "document.pdf";
      const blob = await upload(`resources/${safeName}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/resources/upload",
        contentType: "application/pdf",
      });
      setFileMeta({
        url: blob.url,
        pathname: blob.pathname,
        name: file.name,
        size: file.size,
        contentType: blob.contentType || "application/pdf",
      });
      setMessage("PDF uploaded. Save to attach it to this resource.");
    } catch (err) {
      setError(err?.message || "PDF upload failed. Check BLOB_READ_WRITE_TOKEN.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  async function save() {
    setMessage(null);
    setError(null);
    setBusy(true);
    try {
      const payload = {
        title,
        description,
        category,
        kind,
        externalUrl: kind === "link" ? externalUrl : "",
        file: kind === "pdf" ? fileMeta : null,
        sourceNote,
        meetingKey: category === "meeting-format" ? meetingKey : "",
        sortOrder: Number(sortOrder) || 0,
        published,
      };
      const url =
        mode === "create"
          ? "/api/admin/resources"
          : `/api/admin/resources/${initial._id}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Save failed.");
        return;
      }
      setMessage("Saved.");
      if (mode === "create") {
        router.push(`/admin/resources/${data._id}`);
        router.refresh();
      } else {
        setFileMeta(data.file ?? null);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (mode !== "edit") return;
    if (!window.confirm("Delete this resource permanently?")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/resources/${initial._id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Delete failed.");
        return;
      }
      router.push("/admin/resources");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Stack spacing={3} component={Paper} variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" component="h1">
        {mode === "create" ? "New resource" : "Edit resource"}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Published resources appear on the public Resources page. PDFs are stored in Vercel Blob
        (not in git).
      </Typography>

      {error ? <Alert severity="error">{error}</Alert> : null}
      {message ? <Alert severity="success">{message}</Alert> : null}

      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        minRows={2}
        helperText="Optional short note shown on the public page."
      />
      <TextField
        select
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        fullWidth
      >
        {CATEGORIES.map((c) => (
          <MenuItem key={c.value} value={c.value}>
            {c.label}
          </MenuItem>
        ))}
      </TextField>

      {category === "meeting-format" ? (
        <TextField
          select
          label="Meetings page slot"
          value={meetingKey}
          onChange={(e) => setMeetingKey(e.target.value)}
          fullWidth
          helperText="Links this PDF to the matching format button on /meetings. Leave blank to match by title (e.g. “Monday”)."
        >
          <MenuItem value="">None / infer from title</MenuItem>
          {MEETING_FORMAT_SLOTS.map((s) => (
            <MenuItem key={s.key} value={s.key}>
              {s.label}
            </MenuItem>
          ))}
        </TextField>
      ) : null}

      <Box>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          Type
        </Typography>
        <ToggleButtonGroup
          exclusive
          value={kind}
          onChange={(_e, v) => {
            if (v) setKind(v);
          }}
          size="small"
        >
          <ToggleButton value="link">External / site link</ToggleButton>
          <ToggleButton value="pdf">PDF upload</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {kind === "link" ? (
        <TextField
          label="URL"
          value={externalUrl}
          onChange={(e) => setExternalUrl(e.target.value)}
          required
          fullWidth
          helperText="https://… or a site path like /sherpa-guide"
        />
      ) : (
        <Stack spacing={1.5}>
          {fileMeta?.url ? (
            <Alert severity="info">
              Current file:{" "}
              <Box
                component="a"
                href={fileMeta.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ fontWeight: 600 }}
              >
                {fileMeta.name || fileMeta.pathname}
              </Box>
              {fileMeta.size ? ` (${formatBytes(fileMeta.size)})` : null}
            </Alert>
          ) : (
            <Alert severity="warning">No PDF attached yet.</Alert>
          )}
          <Button variant="outlined" component="label" disabled={uploading || busy}>
            {uploading ? "Uploading…" : fileMeta ? "Replace PDF" : "Upload PDF"}
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              hidden
              onChange={(e) => uploadPdf(e.target.files?.[0])}
            />
          </Button>
        </Stack>
      )}

      <TextField
        label="Source note (admin only)"
        value={sourceNote}
        onChange={(e) => setSourceNote(e.target.value)}
        fullWidth
        helperText="Optional — e.g. Google Doc name or edit URL. Not shown publicly."
      />
      <TextField
        label="Sort order"
        type="number"
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        fullWidth
        helperText="Lower numbers appear first."
      />
      <FormControlLabel
        control={
          <Switch checked={published} onChange={(e) => setPublished(e.target.checked)} />
        }
        label="Published"
      />

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button variant="contained" onClick={save} disabled={busy || uploading}>
          {busy ? "Saving…" : "Save"}
        </Button>
        <Button
          component="a"
          variant="outlined"
          href="/admin/resources"
          disabled={busy || uploading}
        >
          Back to list
        </Button>
        {mode === "edit" ? (
          <Button color="error" onClick={remove} disabled={busy || uploading}>
            Delete
          </Button>
        ) : null}
      </Stack>
    </Stack>
  );
}
