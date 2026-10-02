# Anonymous Reports Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a public anonymous report form at `/report` that stores reports in MongoDB, emails `sunrisesemesteraa@gmail.com`, and exposes an admin-only triage inbox at `/admin/reports`.

**Architecture:** Public MUI form posts JSON to `POST /api/reports`, which rate-limits by IP, validates via a pure helper, persists a `Report` document, then sends email through Resend. Admins list and update reports through `/admin/reports` and admin APIs gated like user management.

**Tech Stack:** Next.js App Router, React 19, MUI, MongoDB/Mongoose, Resend, existing `checkRateLimit` / `assertUserAdmin` / `siteNav` patterns. Validation unit tests use Node’s built-in `node --test` (no new test framework).

## Global Constraints

- Spec: `docs/superpowers/specs/2026-07-25-anonymous-reports-design.md`
- Categories: `safety` | `issue` | `technology` | `question`
- Statuses: `new` | `reviewed` | `closed` (default `new`)
- Anonymous by default; optional `contactEmail` and `contactPhone`
- Admin inbox and APIs: **admin role only** (`canManageUsers` / `assertUserAdmin`)
- Store IP on report; rate-limit 5 / hour / IP
- Email failure after save must not drop the report or fail the submitter response
- Recipient: `process.env.REPORTS_TO_EMAIL` or default `sunrisesemesteraa@gmail.com`
- No delete in v1; no attachments; no public ticket IDs
- Follow existing JS (not TS) conventions under `src/`
- Avoid Tailwind; use MUI `sx`

## File structure

| File | Responsibility |
|---|---|
| `src/lib/reports.js` | Pure validation + serialization helpers (testable) |
| `src/models/Report.js` | Mongoose schema |
| `src/lib/email.js` | `sendReportNotificationEmail` |
| `src/lib/roles.js` | Admin nav item + path gate for `/admin/reports` |
| `src/lib/siteNav.js` | Public More + footer group link |
| `src/components/SiteFooter.js` | Explicit footer “Report an issue” link (bottom bar) |
| `src/components/ReportForm.js` | Public client form |
| `src/app/(site)/report/page.js` | Public page shell + metadata |
| `src/app/api/reports/route.js` | Public POST |
| `src/app/api/admin/reports/route.js` | Admin GET list |
| `src/app/api/admin/reports/[id]/route.js` | Admin PATCH |
| `src/app/admin/reports/page.js` | Admin page (server) |
| `src/app/admin/reports/AdminReportsManager.js` | Admin client UI |
| `src/lib/reports.test.js` | Node test for validation helpers |
| `package.json` | Add `test` script |
| `memory-bank/techContext.md` | Note report feature + env |

---

### Task 1: Report helpers + model + email helper

**Files:**
- Create: `src/lib/reports.js`
- Create: `src/lib/reports.test.js`
- Create: `src/models/Report.js`
- Modify: `src/lib/email.js`
- Modify: `package.json`

**Interfaces:**
- Produces:
  - `REPORT_CATEGORIES` = `["safety","issue","technology","question"]`
  - `REPORT_STATUSES` = `["new","reviewed","closed"]`
  - `parseReportInput(body)` → `{ ok: true, value }` or `{ ok: false, error, status }`
  - `reportsToEmail()` → string
  - `sendReportNotificationEmail({ report, adminUrl })` in email.js
  - Mongoose model `Report`

- [ ] **Step 1: Write failing validation tests**

Create `src/lib/reports.test.js`:

```js
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseReportInput, REPORT_CATEGORIES } from "./reports.js";

describe("parseReportInput", () => {
  it("accepts a minimal anonymous report", () => {
    const result = parseReportInput({
      category: "safety",
      subject: "Unsafe behavior",
      body: "Details here.",
    });
    assert.equal(result.ok, true);
    assert.equal(result.value.category, "safety");
    assert.equal(result.value.contactEmail, "");
    assert.equal(result.value.contactPhone, "");
  });

  it("rejects missing subject", () => {
    const result = parseReportInput({
      category: "issue",
      subject: "  ",
      body: "Something broke",
    });
    assert.equal(result.ok, false);
    assert.equal(result.status, 400);
  });

  it("rejects invalid category", () => {
    const result = parseReportInput({
      category: "spam",
      subject: "Hi",
      body: "Hello",
    });
    assert.equal(result.ok, false);
    assert.ok(!REPORT_CATEGORIES.includes("spam"));
  });

  it("keeps optional contact fields", () => {
    const result = parseReportInput({
      category: "question",
      subject: "Zoom link?",
      body: "Where do I find it?",
      contactEmail: "friend@example.com",
      contactPhone: "555-0100",
    });
    assert.equal(result.ok, true);
    assert.equal(result.value.contactEmail, "friend@example.com");
    assert.equal(result.value.contactPhone, "555-0100");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test src/lib/reports.test.js`  
Expected: FAIL (module not found / export missing)

- [ ] **Step 3: Implement `src/lib/reports.js`**

```js
export const REPORT_CATEGORIES = ["safety", "issue", "technology", "question"];
export const REPORT_STATUSES = ["new", "reviewed", "closed"];

const LIMITS = {
  subject: 200,
  body: 10000,
  contactEmail: 200,
  contactPhone: 40,
  adminNotes: 5000,
};

function trimStr(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

export function reportsToEmail() {
  return (
    process.env.REPORTS_TO_EMAIL?.trim() || "sunrisesemesteraa@gmail.com"
  );
}

/**
 * @param {unknown} body
 * @returns {{ ok: true, value: object } | { ok: false, error: string, status: number }}
 */
export function parseReportInput(body) {
  const input = body && typeof body === "object" ? body : {};
  const category = trimStr(input.category, 40);
  const subject = trimStr(input.subject, LIMITS.subject);
  const details = trimStr(input.body, LIMITS.body);
  const contactEmail = trimStr(input.contactEmail, LIMITS.contactEmail);
  const contactPhone = trimStr(input.contactPhone, LIMITS.contactPhone);

  if (!REPORT_CATEGORIES.includes(category)) {
    return { ok: false, error: "Please choose a report category.", status: 400 };
  }
  if (!subject) {
    return { ok: false, error: "Please enter a short subject.", status: 400 };
  }
  if (!details) {
    return { ok: false, error: "Please describe the issue or question.", status: 400 };
  }
  if (contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return { ok: false, error: "Optional email looks invalid.", status: 400 };
  }

  return {
    ok: true,
    value: {
      category,
      subject,
      body: details,
      contactEmail,
      contactPhone,
    },
  };
}

export function parseAdminReportPatch(body) {
  const input = body && typeof body === "object" ? body : {};
  const patch = {};

  if (input.status !== undefined) {
    const status = trimStr(input.status, 40);
    if (!REPORT_STATUSES.includes(status)) {
      return { ok: false, error: "Invalid status.", status: 400 };
    }
    patch.status = status;
  }

  if (input.adminNotes !== undefined) {
    patch.adminNotes = trimStr(input.adminNotes, LIMITS.adminNotes);
  }

  if (Object.keys(patch).length === 0) {
    return { ok: false, error: "Nothing to update.", status: 400 };
  }

  return { ok: true, value: patch };
}
```

- [ ] **Step 4: Create `src/models/Report.js`**

```js
import mongoose from "mongoose";
import { REPORT_CATEGORIES, REPORT_STATUSES } from "@/lib/reports";

const ReportSchema = new mongoose.Schema(
  {
    category: { type: String, enum: REPORT_CATEGORIES, required: true },
    subject: { type: String, required: true },
    body: { type: String, required: true },
    contactEmail: { type: String, default: "" },
    contactPhone: { type: String, default: "" },
    status: { type: String, enum: REPORT_STATUSES, default: "new" },
    adminNotes: { type: String, default: "" },
    ip: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.Report || mongoose.model("Report", ReportSchema);
```

- [ ] **Step 5: Add email helper to `src/lib/email.js`**

Append (keep existing helpers). Reuse existing `escapeHtml` / `plainTextToHtml` / `fromAddress` / `getResend`:

```js
export async function sendReportNotificationEmail({ report, adminUrl }) {
  const resend = getResend();
  const to = process.env.REPORTS_TO_EMAIL?.trim() || "sunrisesemesteraa@gmail.com";
  const category = String(report.category || "");
  const subject = String(report.subject || "");
  const contactLines = [];
  if (report.contactEmail) contactLines.push(`Email: ${report.contactEmail}`);
  if (report.contactPhone) contactLines.push(`Phone: ${report.contactPhone}`);
  const contactBlock = contactLines.length
    ? contactLines.join("\n")
    : "No contact provided (anonymous).";

  const text = [
    `New report (${category})`,
    "",
    `Subject: ${subject}`,
    "",
    String(report.body || ""),
    "",
    contactBlock,
    "",
    `Submitted: ${report.createdAt ? new Date(report.createdAt).toISOString() : "just now"}`,
    `Admin: ${adminUrl}`,
  ].join("\n");

  const { error } = await resend.emails.send({
    from: fromAddress(),
    to,
    subject: `[Report] ${category}: ${subject}`.slice(0, 200),
    html: `
      <p><strong>New report</strong> (${escapeHtml(category)})</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <div>${plainTextToHtml(String(report.body || ""))}</div>
      <p>${plainTextToHtml(contactBlock)}</p>
      <p style="color:#666;font-size:12px;">
        Submitted: ${escapeHtml(
          report.createdAt ? new Date(report.createdAt).toISOString() : "just now",
        )}<br />
        <a href="${escapeHtml(adminUrl)}">Open admin reports</a>
      </p>
    `,
    text,
  });
  if (error) {
    throw new Error(error.message || "Failed to send report notification.");
  }
}
```

- [ ] **Step 6: Add test script to `package.json`**

Add under `scripts`:

```json
"test": "node --test src/lib/reports.test.js"
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `npm test`  
Expected: PASS (all 4 tests)

- [ ] **Step 8: Commit**

```bash
git add src/lib/reports.js src/lib/reports.test.js src/models/Report.js src/lib/email.js package.json
git commit -m "$(cat <<'EOF'
Add report model, validation helpers, and notification email.

EOF
)"
```

---

### Task 2: Public API + report form page + nav links

**Files:**
- Create: `src/app/api/reports/route.js`
- Create: `src/components/ReportForm.js`
- Create: `src/app/(site)/report/page.js`
- Modify: `src/lib/siteNav.js`
- Modify: `src/components/SiteFooter.js`

**Interfaces:**
- Consumes: `parseReportInput`, `Report`, `checkRateLimit`, `clientIp`, `sendReportNotificationEmail`, `isEmailConfigured`
- Produces: public `POST /api/reports` → `{ ok: true }` or `{ error }`; page at `/report`

- [ ] **Step 1: Create `src/app/api/reports/route.js`**

```js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Report from "@/models/Report";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";
import { parseReportInput } from "@/lib/reports";
import { isEmailConfigured, sendReportNotificationEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const ip = clientIp(request);
    const limited = await checkRateLimit(`reports:${ip}`, {
      limit: 5,
      windowMs: 60 * 60 * 1000,
    });
    if (!limited.allowed) {
      return NextResponse.json(
        { error: "Too many reports from this network. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = parseReportInput(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    }

    await connectDB();
    const report = await Report.create({
      ...parsed.value,
      ip,
      userAgent: String(request.headers.get("user-agent") || "").slice(0, 500),
      status: "new",
    });

    if (isEmailConfigured()) {
      try {
        const base = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");
        await sendReportNotificationEmail({
          report,
          adminUrl: `${base}/admin/reports`,
        });
      } catch (emailErr) {
        console.error("Report saved but notification email failed:", emailErr);
      }
    } else {
      console.error("Report saved but email is not configured.");
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Could not submit report." },
      { status: 500 },
    );
  }
}
```

- [ ] **Step 2: Create `src/components/ReportForm.js`**

Client component modeled on `SubscribeForm` / `ShareStoryForm`:

- Title: “Report a concern”
- Intro: anonymous by default; optional contact if they want a reply; categories for safety, general issue, technology bug, or question
- Fields:
  - `category` select / radio: Safety concern, General issue, Technology bug, Question
  - `subject` text
  - `body` multiline
  - `contactEmail` optional
  - `contactPhone` optional
- POST JSON to `/api/reports`
- Success: replace form with success Alert (“Thank you. Your report was received.”)
- Show error Alert on failure
- Use serif h1 + existing site colors (`#1d1d1d`, `#555`, orange button style from SubscribeForm)

Include values exactly: `safety`, `issue`, `technology`, `question`.

- [ ] **Step 3: Create `src/app/(site)/report/page.js`**

```js
import ReportForm from "@/components/ReportForm";

export const metadata = {
  title: "Report a concern",
  description:
    "Anonymously report a safety concern, issue, technology bug, or question to Sunrise Semester.",
};

export default function ReportPage() {
  return <ReportForm />;
}
```

- [ ] **Step 4: Update nav**

In `src/lib/siteNav.js`:

1. Add to `SITE_NAV_MORE` (after Group service is fine):

```js
{ href: "/report", label: "Report a concern" },
```

2. Add to the `group` items in `SITE_NAV_GROUPS` (so footer picks it up):

```js
{ href: "/report", label: "Report a concern" },
```

In `src/components/SiteFooter.js`, also add next to Editor Sign-in:

```jsx
<FooterLink href="/report">Report a concern</FooterLink>
```

- [ ] **Step 5: Manual smoke (dev server)**

Run: `npm run dev`  
Open `/report`  
Expected: form renders; More menu and footer show “Report a concern”

Submit a test report with Mongo + Resend configured (or accept console email warning if Resend unset).  
Expected: success UI; document in Mongo `reports` collection with `status: "new"` and `ip` set.

- [ ] **Step 6: Commit**

```bash
git add src/app/api/reports/route.js src/components/ReportForm.js src/app/\(site\)/report/page.js src/lib/siteNav.js src/components/SiteFooter.js
git commit -m "$(cat <<'EOF'
Add public anonymous report form and API.

EOF
)"
```

---

### Task 3: Admin reports inbox (APIs + UI + role gates)

**Files:**
- Modify: `src/lib/roles.js`
- Create: `src/app/api/admin/reports/route.js`
- Create: `src/app/api/admin/reports/[id]/route.js`
- Create: `src/app/admin/reports/page.js`
- Create: `src/app/admin/reports/AdminReportsManager.js`
- Modify: `memory-bank/techContext.md`

**Interfaces:**
- Consumes: `assertUserAdmin`, `parseAdminReportPatch`, `Report`, `canManageUsers`
- Produces: admin list/detail UI; `GET /api/admin/reports`; `PATCH /api/admin/reports/[id]`

- [ ] **Step 1: Gate path + nav in `src/lib/roles.js`**

1. In `canAccessAdminPath`, before the content fallback, add:

```js
if (pathname.startsWith("/admin/reports")) {
  return canManageUsers(role);
}
```

2. Add to `ADMIN_NAV` (System group, near Users):

```js
{
  href: "/admin/reports",
  label: "Reports",
  group: "system",
  roles: ["admin"],
},
```

- [ ] **Step 2: Create `GET` list API `src/app/api/admin/reports/route.js`**

```js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Report from "@/models/Report";
import { assertUserAdmin } from "@/lib/requireAdmin";
import { REPORT_CATEGORIES, REPORT_STATUSES } from "@/lib/reports";

export async function GET(request) {
  const denied = await assertUserAdmin();
  if (denied) return denied;

  try {
    const status = request.nextUrl.searchParams.get("status");
    const category = request.nextUrl.searchParams.get("category");
    const filter = {};
    if (status && REPORT_STATUSES.includes(status)) filter.status = status;
    if (category && REPORT_CATEGORIES.includes(category)) filter.category = category;

    await connectDB();
    const items = await Report.find(filter).sort({ createdAt: -1 }).lean();
    const counts = await Report.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const statusCounts = Object.fromEntries(counts.map((c) => [c._id, c.count]));

    return NextResponse.json({ items, statusCounts });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
```

- [ ] **Step 3: Create PATCH API `src/app/api/admin/reports/[id]/route.js`**

```js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Report from "@/models/Report";
import { assertUserAdmin } from "@/lib/requireAdmin";
import { parseAdminReportPatch } from "@/lib/reports";
import { isValidObjectIdString } from "@/lib/objectId";

export async function PATCH(request, { params }) {
  const denied = await assertUserAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    if (!isValidObjectIdString(id)) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const body = await request.json();
    const parsed = parseAdminReportPatch(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    }

    await connectDB();
    const report = await Report.findByIdAndUpdate(id, parsed.value, {
      new: true,
      runValidators: true,
    }).lean();
    if (!report) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ item: report });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
```

- [ ] **Step 4: Create admin page + manager**

`src/app/admin/reports/page.js`:

- Verify session with `getSessionFromToken` / cookies
- If not admin role (`canManageUsers`), `redirect("/admin")` or landing
- Load reports with `Report.find({}).sort({ createdAt: -1 }).lean()`
- Render `AdminReportsManager` with `initialItems` and status counts
- Metadata title: `Reports (admin)`

`src/app/admin/reports/AdminReportsManager.js` (client):

- Table columns: created, category, subject, status chip, contact (Yes/No)
- Filters: status select, category select, Reload button (fetch `GET /api/admin/reports?...`)
- Clicking a row expands a detail panel (or side stack) showing: body, contactEmail, contactPhone, ip, userAgent, adminNotes
- Detail actions: status `Select`, adminNotes `TextField`, Save button → `PATCH /api/admin/reports/:id` with `{ status, adminNotes }`
- Match MUI Paper/Table patterns from `AdminSubscribersManager.js`

- [ ] **Step 5: Document env in `memory-bank/techContext.md`**

Add a short subsection:

```md
### Anonymous reports
- Public form: `/report`
- Admin inbox: `/admin/reports` (admin role only)
- Model: `src/models/Report.js`
- Email: Resend → `REPORTS_TO_EMAIL` (default `sunrisesemesteraa@gmail.com`)
- Required env for email: `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `NEXT_PUBLIC_BASE_URL`
```

- [ ] **Step 6: Smoke checklist**

1. As admin: `/admin/reports` lists the Task 2 submission; IP visible in detail
2. Change status to `reviewed`, add notes, Save → persists after reload
3. As editor (or secretary): `/admin/reports` redirects / forbidden; `GET /api/admin/reports` returns 403
4. Submit report with optional email → contact shows in admin + notification email (if Resend configured)
5. `npm test` still passes
6. `npm run build` succeeds

- [ ] **Step 7: Commit**

```bash
git add src/lib/roles.js src/app/api/admin/reports src/app/admin/reports memory-bank/techContext.md
git commit -m "$(cat <<'EOF'
Add admin-only reports inbox for triage.

EOF
)"
```

---

## Spec coverage check

| Spec requirement | Task |
|---|---|
| `/report` public form | Task 2 |
| Categories + optional contact | Tasks 1–2 |
| MongoDB `Report` log | Task 1–2 |
| Email to group address | Tasks 1–2 |
| Rate limit + store IP | Task 2 |
| Admin inbox + status/notes | Task 3 |
| Admin-only access | Task 3 |
| Footer + More links | Task 2 |
| Email failure keeps report | Task 2 API |
| No delete / no attachments | Out of scope (not implemented) |

## Placeholder / consistency check

- Field name for details is `body` in model, API, and form JSON (not `details`).
- Admin gate uses `assertUserAdmin` / `canManageUsers` consistently.
- Email default address matches spec exactly.
