# Anonymous safety / issue / technology reporting

Date: 2026-07-25  
Status: approved for implementation planning

## Goal

Add an anonymous reporting system so visitors can submit safety concerns, general issues, technology bugs, or questions. Reports are stored in the site database, emailed to `sunrisesemesteraa@gmail.com`, and triaged in a private admin inbox.

## Decisions

| Decision | Choice |
|---|---|
| Approach | Mirror existing submission stack (MongoDB + Resend + admin UI) |
| Anonymity | Anonymous by default; optional email and phone for follow-up |
| Admin access | Administrators only (same gate as `/admin/users`) |
| Public entry | Dedicated page `/report`, linked from footer and More menu |
| Abuse control | Rate-limit by IP and store IP on the report (admin-only) |

## Architecture

```
Public /report form
    → POST /api/reports
        → rate limit (IP)
        → validate + create Report in MongoDB
        → email sunrisesemesteraa@gmail.com (Resend)
Admin /admin/reports
    → list / detail / status + notes (admin only)
```

Reuse existing patterns:

- Mongoose models via `connectDB` (`@/lib/mongodb`)
- Rate limiting (`@/lib/rateLimit`)
- Resend helpers (`@/lib/email`)
- Admin auth (`assertUserAdmin` / `canManageUsers`)
- Public nav (`siteNav.js`) and footer links

## Data model

New model: `Report` (`src/models/Report.js`)

| Field | Type | Notes |
|---|---|---|
| `category` | enum | `safety` \| `issue` \| `technology` \| `question` |
| `subject` | string | required, length-capped |
| `body` | string | required, length-capped |
| `contactEmail` | string | optional |
| `contactPhone` | string | optional |
| `status` | enum | `new` \| `reviewed` \| `closed` (default `new`) |
| `adminNotes` | string | private, admin-only |
| `ip` | string | stored for abuse tracing; never shown publicly |
| `userAgent` | string | optional; helpful for technology reports |
| timestamps | | `createdAt`, `updatedAt` |

No delete in v1. Closing a report is the audit-friendly end state.

## Public surface

### Page: `/report`

- Short intro explaining anonymity and optional contact
- Fields: category, subject, details, optional email, optional phone
- Client form component (MUI, matching site style)
- Success confirmation after submit (no public ticket ID)

### Navigation

- Footer link to `/report`
- More menu entry (not primary nav)

## API

### `POST /api/reports` (public)

1. Resolve client IP; enforce rate limit (5 submissions / hour / IP)
2. Validate required fields and enum category
3. Cap string lengths; treat body as plain text (escape for email HTML)
4. Create `Report` with `ip` and `userAgent`
5. Send notification email
6. If email fails after a successful save: keep the DB record, log the error, still return success to the submitter so reports are not lost
7. Return `{ ok: true }` or validation / rate-limit errors

### Admin APIs (admin role only)

- `GET /api/admin/reports` — list newest first; optional filters for status and category
- `PATCH /api/admin/reports/[id]` — update `status` and/or `adminNotes`

Use the same admin-only auth path as user management (`canManageUsers` / `assertUserAdmin`). Extend `canAccessAdminPath` so `/admin/reports` is admin-only.

## Email

Recipient: `sunrisesemesteraa@gmail.com` (configurable via env e.g. `REPORTS_TO_EMAIL`, defaulting to that address).

- From: `FROM_EMAIL` via Gmail SMTP (Google App Password; not Resend)
- Subject: `[Report] {category}: {subject}`
- Body: category, subject, details, optional contact fields, submitted time, link to `/admin/reports`
- Add `sendReportNotificationEmail` in `@/lib/email.js` (nodemailer)

## Admin inbox

### Page: `/admin/reports`

- Listed under System nav group as “Reports”
- Visible only to `admin` role
- List: category, subject, status, created time, contact present (yes/no)
- Filters: status, category
- Detail: full body, optional contact, IP, user agent, admin notes
- Actions: change status (`new` → `reviewed` → `closed`), edit admin notes

Editors and secretaries must not access the page or APIs.

## Error handling

| Case | Behavior |
|---|---|
| Missing / invalid fields | 400 with clear message; form shows inline error |
| Rate limited | 429 with “try again later” |
| DB failure | 500; nothing emailed |
| Email failure after save | Report kept; success returned; error logged |

## Out of scope (v1)

- File attachments
- Public ticket tracking / status lookup
- Reporter replies or threaded conversation
- Deleting reports
- Notifications to multiple recipients beyond the configured address
- Member login requirement

## Smoke checklist

1. Submit anonymous report → appears in admin list as `new`; email arrives
2. Submit with optional contact → contact visible in admin + email
3. Editor cannot open `/admin/reports` or call admin report APIs
4. Fifth rapid submit from same IP within the hour is rate-limited
5. Mark report reviewed/closed and add notes; persists on reload
6. With Resend misconfigured: report still saved; submitter sees success

## File touch list (expected)

- `src/models/Report.js`
- `src/lib/email.js` (report notification helper)
- `src/lib/roles.js` (nav + path access)
- `src/lib/siteNav.js` (+ footer if needed)
- `src/components/ReportForm.js` (or similar)
- `src/app/(site)/report/page.js`
- `src/app/api/reports/route.js`
- `src/app/api/admin/reports/route.js`
- `src/app/api/admin/reports/[id]/route.js`
- `src/app/admin/reports/page.js` (+ manager component)
- `memory-bank` notes if project convention expects it
