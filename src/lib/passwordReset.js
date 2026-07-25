import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import GroupMember from "@/models/GroupMember";
import { hashPassword } from "@/lib/password";
import { sendPasswordResetEmail, isEmailConfigured } from "@/lib/email";
import { generateToken, isValidEmail, normalizeEmail } from "@/lib/subscriberTokens";
import { SITE_URL } from "@/lib/siteUrl";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const RESEND_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

// Reset tokens are hashed at rest (unlike the subscribe-confirm token) since a
// leaked password-reset token is a full account takeover, not just a mailing
// list confirmation — worth the extra step for this one.
function hashToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

const GENERIC_MESSAGE =
  "If that email has an account, we've sent a link to reset the password. It expires in 1 hour.";

/**
 * Always returns the same generic message whether or not the email is on file,
 * so this endpoint can't be used to check which emails have accounts.
 */
export async function requestPasswordReset(email) {
  const normalized = normalizeEmail(email);
  if (!isValidEmail(normalized)) {
    return { ok: false, status: 400, message: "Please enter a valid email address." };
  }

  if (!isEmailConfigured()) {
    return { ok: false, status: 503, message: "Email is not configured yet. Please try again later." };
  }

  await connectDB();
  const member = await GroupMember.findOne({ email: normalized, active: true });

  if (!member) {
    return { ok: true, status: 200, message: GENERIC_MESSAGE };
  }

  const now = new Date();
  if (
    member.resetRequestedAt &&
    now.getTime() - member.resetRequestedAt.getTime() < RESEND_COOLDOWN_MS
  ) {
    return { ok: true, status: 200, message: GENERIC_MESSAGE };
  }

  const token = generateToken();
  member.resetTokenHash = hashToken(token);
  member.resetTokenExpiresAt = new Date(now.getTime() + RESET_TOKEN_TTL_MS);
  member.resetRequestedAt = now;
  await member.save();

  const resetUrl = `${SITE_URL}/member/reset-password?token=${token}`;
  await sendPasswordResetEmail({ email: normalized, resetUrl });

  return { ok: true, status: 200, message: GENERIC_MESSAGE };
}

export async function resetPasswordWithToken(token, newPassword) {
  const trimmed = String(token ?? "").trim();
  if (!trimmed) {
    return { ok: false, status: 400, message: "This reset link is invalid." };
  }
  if (String(newPassword ?? "").length < 8) {
    return { ok: false, status: 400, message: "Password must be at least 8 characters." };
  }

  await connectDB();
  const member = await GroupMember.findOne({ resetTokenHash: hashToken(trimmed) });
  if (!member) {
    return { ok: false, status: 400, message: "This reset link is invalid or has already been used." };
  }
  if (!member.resetTokenExpiresAt || member.resetTokenExpiresAt < new Date()) {
    return { ok: false, status: 400, message: "This reset link has expired. Please request a new one." };
  }

  member.passwordHash = hashPassword(newPassword);
  member.resetTokenHash = null;
  member.resetTokenExpiresAt = null;
  member.resetRequestedAt = null;
  await member.save();

  return {
    ok: true,
    status: 200,
    message: "Your password has been reset.",
    member: { _id: String(member._id), email: member.email },
  };
}
