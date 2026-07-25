## Tech context

### Stack
- Next.js 16 (Turbopack)
- React 19
- Material UI (MUI)
- MongoDB Atlas + Mongoose

### Conventions
- Use `connectDB` from `@/lib/mongodb` in server routes/components before DB operations.
- Avoid Tailwind; use MUI `sx` styling.

### Admin chrome
- Shell: `src/app/admin/AdminShell.js` — left sidebar (grouped nav) on desktop, temporary drawer on mobile; top bar with identity / view site / sign out.
- Nav groups defined in `src/lib/roles.js` via `ADMIN_NAV` + `navGroupsForRole(role)` (Content, Group life, Outreach, System).

### Site resources (CMS + Blob)
- Public page: `/resources` lists published `SiteResource` docs (links and PDFs).
- Admin: `/admin/resources` (admin + editor). Create/edit/delete metadata; PDF binary files live in Vercel Blob.
- Model: `src/models/SiteResource.js`. Helpers: `src/lib/siteResources.js`.
- PDF client upload: `@vercel/blob/client` → `POST /api/admin/resources/upload` (token via `handleUpload`). Path prefix `resources/`, PDF only, max 25 MB.
- Required env for PDF uploads: `BLOB_READ_WRITE_TOKEN` (from a Vercel Blob store). Link-only resources work without it.
- Seed previous hardcoded links: `npm run seed:site-resources`.
- `/literature` remains a separate curated aa.org readings page (not CMS-driven).
- `/meetings` format buttons resolve to published `meeting-format` resources via optional `meetingKey` (weekday-mon…sunday), with title/filename heuristics as fallback. Unmatched slots link to `/resources#meeting-formats`.

### Smoke checklist (resources)
- Create a link resource → appears on `/resources` when published.
- Upload a PDF → save → opens from `/resources`.
- Replace PDF → old Blob removed; new file opens.
- Unpublish → disappears from public page, still in admin.
- Delete PDF resource → Mongo doc gone and Blob deleted.

### Member accounts
- Registration: `/member/register` (email + password).
- Public hub: `/member` (no sign-in required; explains optional account).
- Profile settings: `/member/settings` (requires sign-in).
- Admin roster: `/admin/members` (full details for editors).
- Public anniversaries from member profiles appear on `/our-group` when name and sobriety date are set to public.
- Public signup: `/subscribe` (double opt-in via `/subscribe/confirm`).
- Unsubscribe: `/unsubscribe?token=...` (token from each email).
- Admin: `/admin/subscribers` (list, CSV export, send updates).
- Required env: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `FROM_EMAIL`, `MONGODB_URI`, `NEXT_PUBLIC_BASE_URL`.
- Mail uses Gmail SMTP + Google App Password via nodemailer (not Resend).

### Anonymous reports
- Public form: `/report`
- Admin inbox: `/admin/reports` (admin role only)
- Model: `src/models/Report.js`
- Email: SMTP -> `REPORTS_TO_EMAIL` (default `sunrisesemesteraa@gmail.com`)
- Required env for email: `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `FROM_EMAIL`, `NEXT_PUBLIC_BASE_URL`

