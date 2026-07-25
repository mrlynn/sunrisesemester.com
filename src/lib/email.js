import { Resend } from "resend";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }
  return new Resend(apiKey);
}

function fromAddress() {
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) {
    throw new Error("RESEND_FROM_EMAIL is not configured.");
  }
  return from;
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

export async function sendConfirmationEmail({ email, confirmUrl }) {
  const resend = getResend();
  const { error } = await resend.emails.send({
    from: fromAddress(),
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
  if (error) {
    throw new Error(error.message || "Failed to send confirmation email.");
  }
}

export async function sendBroadcastEmail({ to, subject, body, unsubscribeUrl }) {
  const resend = getResend();
  const htmlBody = plainTextToHtml(body);
  const { error } = await resend.emails.send({
    from: fromAddress(),
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
  if (error) {
    throw new Error(error.message || "Failed to send email.");
  }
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL);
}

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
