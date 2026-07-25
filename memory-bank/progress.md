## Progress

### Working
- Public site pages and admin area routes.
- MongoDB Atlas connection helper `src/lib/mongodb.js`.
- Admin auth via `ss_admin` cookie and middleware protection.
- CMS-backed Resources library: `/admin/resources` + public `/resources` (Vercel Blob for PDFs).

### In progress
- Member account hub and session work.

### Known issues / notes
- Weekly crossword feature removed from the site.
- PDF uploads require `BLOB_READ_WRITE_TOKEN` on the Vercel project (and locally via `vercel env pull`).
