import nodemailer from "nodemailer";

function smtpConfig() {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const port = Number(process.env.SMTP_PORT || 465);
  if (!host || !user || !pass) {
    return null;
  }
  const secure = port === 465;
  return { host, port, secure, auth: { user, pass } };
}

function fromAddress() {
  const from =
    process.env.FROM_EMAIL?.trim() ||
    process.env.EMAIL_FROM?.trim() ||
    process.env.SMTP_USER?.trim();
  if (!from) {
    throw new Error("FROM_EMAIL (or EMAIL_FROM / SMTP_USER) is not configured.");
  }
  return from;
}

function getTransport() {
  const config = smtpConfig();
  if (!config) {
    throw new Error("SMTP is not configured (need SMTP_HOST, SMTP_USER, SMTP_PASS).");
  }
  return nodemailer.createTransport(config);
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function plainTextToHtml(text) {
  return escapeHtml(text).replace(/\n/g, "<br />");
}

async function sendMail({ to, subject, html, text }) {
  const transport = getTransport();
  await transport.sendMail({
    from: fromAddress(),
    to,
    subject,
    html,
    text,
  });
}

export async function sendConfirmationEmail({ email, confirmUrl }) {
  await sendMail({
    to: email,
    subject: "Confirm your Sunrise Semester updates subscription",
    html: `
      <p>Thanks for signing up for Sunrise Semester group updates.</p>
      <p>Please confirm your subscription by clicking the link below:</p>
      <p><a href="${escapeHtml(confirmUrl)}">Confirm subscription</a></p>
      <p>If you did not request this, you can ignore this email.</p>
      <p style="color:#666;font-size:12px;">Sunrise Semester — Alcoholics Anonymous home group</p>
    `,
    text: `Thanks for signing up for Sunrise Semester group updates.\n\nConfirm your subscription:\n${confirmUrl}\n\nIf you did not request this, you can ignore this email.`,
  });
}

export async function sendBroadcastEmail({ to, subject, body, unsubscribeUrl }) {
  const htmlBody = plainTextToHtml(body);
  await sendMail({
    to,
    subject,
    html: `
      <div>${htmlBody}</div>
      <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;" />
      <p style="color:#666;font-size:12px;">
        You received this because you subscribed to Sunrise Semester group updates.
        <a href="${escapeHtml(unsubscribeUrl)}">Unsubscribe</a>
      </p>
    `,
    text: `${body}\n\n---\nUnsubscribe: ${unsubscribeUrl}`,
  });
}

export function isEmailConfigured() {
  return Boolean(smtpConfig() && (process.env.FROM_EMAIL || process.env.EMAIL_FROM || process.env.SMTP_USER));
}

export async function sendReportNotificationEmail({ report, adminUrl }) {
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

  await sendMail({
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
}
