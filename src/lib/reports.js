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
