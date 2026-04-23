## System patterns

### Framework
- Next.js App Router (`src/app`)
- Public pages under `src/app/(site)/...`
- Admin pages under `src/app/admin/...`

### Data / persistence
- MongoDB Atlas via Mongoose
- Shared connection helper: `import connectDB from "@/lib/mongodb"`
- Models in `src/models/*.js`

### Admin auth
- Password-based sign-in at `/admin`
- Cookie `ss_admin` signed via `jose` (`src/lib/auth.js`)
- Admin routes enforce auth via `assertAdmin()` (`src/lib/requireAdmin.js`)
- Middleware protects `/admin/:path+` (`src/middleware.js`)

