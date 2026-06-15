## Tech context

### Stack
- Next.js 16 (Turbopack)
- React 19
- Material UI (MUI)
- MongoDB Atlas + Mongoose

### Conventions
- Prefer JavaScript over TypeScript.
- Use `connectDB` from `@/lib/mongodb` in server routes/components before DB operations.
- Avoid Tailwind; use MUI `sx` styling.

### Member accounts
- Registration: `/member/register` (email + password).
- Profile settings: `/member/settings` (contact details, sobriety date, per-field visibility).
- Admin roster: `/admin/members` (full details for editors).
- Public anniversaries from member profiles appear on `/our-group` when name and sobriety date are set to public.
- Public signup: `/subscribe` (double opt-in via `/subscribe/confirm`).
- Unsubscribe: `/unsubscribe?token=...` (token from each email).
- Admin: `/admin/subscribers` (list, CSV export, send updates).
- Required env: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `MONGODB_URI`, `NEXT_PUBLIC_BASE_URL`.
- Before production sends: verify the sending domain in [Resend](https://resend.com/domains) and add DNS records (SPF/DKIM).

