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

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function StoryForm({ initial, mode }) {
  const router = useRouter();
  const [title, setTitle] = React.useState(initial?.title ?? "");
  const [slug, setSlug] = React.useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(
    mode === "edit" || Boolean(initial?.slug),
  );
  const [excerpt, setExcerpt] = React.useState(initial?.excerpt ?? "");
  const [body, setBody] = React.useState(initial?.body ?? "");
  const [author, setAuthor] = React.useState(initial?.author ?? "");
  const [coverImage, setCoverImage] = React.useState(initial?.coverImage ?? "");
  const [coverImageCredit, setCoverImageCredit] = React.useState(
    initial?.coverImageCredit ?? "",
  );
  const [coverImageCreditUrl, setCoverImageCreditUrl] = React.useState(
    initial?.coverImageCreditUrl ?? "",
  );
  const [published, setPublished] = React.useState(initial?.published ?? true);
  const [message, setMessage] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [busy, setBusy] = React.useState(false);

  function onTitleChange(e) {
    const v = e.target.value;
    setTitle(v);
    if (!slugTouched) {
      setSlug(slugify(v));
    }
  }

  async function save() {
    setMessage(null);
    setError(null);
    setBusy(true);
    try {
      const payload = {
        title,
        slug,
        excerpt,
        body,
        author,
        coverImage,
        coverImageCredit,
        coverImageCreditUrl,
        published,
      };
      const url =
        mode === "create" ? "/api/admin/stories" : `/api/admin/stories/${initial._id}`;
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
        router.push(`/admin/stories/${data._id}`);
        router.refresh();
      } else {
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (mode !== "edit") {
      return;
    }
    if (!window.confirm("Delete this story permanently?")) {
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/stories/${initial._id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Delete failed.");
        return;
      }
      router.push("/admin/stories");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Stack spacing={3} component={Paper} variant="outlined" sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" component="h1">
        {mode === "create" ? "New story" : "Edit story"}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Slug becomes the URL segment (<code>/stories/your-slug</code>). Leave it tied to
        the title until you are happy with the link, then you can lock it by editing the
        slug field directly.
      </Typography>
      {message ? <Alert severity="success">{message}</Alert> : null}
      {error ? <Alert severity="error">{error}</Alert> : null}
      <TextField label="Title" value={title} onChange={onTitleChange} fullWidth required />
      <TextField
        label="Slug"
        value={slug}
        onChange={(e) => {
          setSlugTouched(true);
          setSlug(e.target.value);
        }}
        fullWidth
        required
        helperText="Lowercase letters, numbers, and hyphens."
      />
      <TextField
        label="Author (optional)"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        fullWidth
        helperText="Shown under the title on the story page (first name or initials only is fine)."
      />
      <TextField
        label="Excerpt (optional)"
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        fullWidth
        multiline
        minRows={2}
      />
      <TextField
        label="Cover image URL (optional)"
        value={coverImage}
        onChange={(e) => setCoverImage(e.target.value)}
        fullWidth
        helperText="Full URL to a hero image — e.g. an Unsplash https://images.unsplash.com/... link."
      />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField
          label="Image credit (optional)"
          value={coverImageCredit}
          onChange={(e) => setCoverImageCredit(e.target.value)}
          fullWidth
          helperText="Photographer name — e.g. 'Jane Doe on Unsplash'."
        />
        <TextField
          label="Image credit link (optional)"
          value={coverImageCreditUrl}
          onChange={(e) => setCoverImageCreditUrl(e.target.value)}
          fullWidth
          helperText="Photographer profile URL."
        />
      </Stack>
      <TextField
        label="Body (Markdown)"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        fullWidth
        multiline
        minRows={14}
      />
      <FormControlLabel
        control={
          <Switch checked={published} onChange={(e) => setPublished(e.target.checked)} />
        }
        label="Published (visible on public site)"
      />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Button variant="contained" onClick={save} disabled={busy} size="large">
          {busy ? "Saving…" : "Save"}
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
