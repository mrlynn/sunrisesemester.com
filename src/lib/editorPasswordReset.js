import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import EditorUser from "@/models/EditorUser";
import { hashPassword } from "@/lib/password";
import { sendEditorPasswordResetEmail, isEmailConfigured } from "@/lib/email";
import { generateToken, isValidEmail, normalizeEmail } from "@/lib/subscriberTokens";
import { SITE_URL } from "@/lib/siteUrl";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const RESEND_COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

// Same reasoning as passwordReset.js: hash the token at rest since a leaked
// editor/admin reset token is a full account takeover of a content-management
// or site-admin account.
function hashToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

const GENERIC_MESSAGE =
  "If that email has an editor account, we've sent a link to reset the password. It expires in 1 hour.";

/**
 * Always returns the same generic message whether or not the email is on
 * file, so this endpoint can't be used to check which emails have accounts.
 */
export async function requestEditorPasswordReset(email) {
  const normalized = normalizeEmail(email);
  if (!isValidEmail(normalized)) {
    return { ok: false, status: 400, message: "Please enter a valid email address." };
  }

  if (!isEmailConfigured()) {
    return { ok: false, status: 503, message: "Email is not configured yet. Please try again later." };
  }

  await connectDB();
  const user = await EditorUser.findOne({ email: normalized, active: true });

  if (!user) {
    return { ok: true, status: 200, message: GENERIC_MESSAGE };
  }

  const now = new Date();
  if (
    user.resetRequestedAt &&
    now.getTime() - user.resetRequestedAt.getTime() < RESEND_COOLDOWN_MS
  ) {
    return { ok: true, status: 200, message: GENERIC_MESSAGE };
  }

  const token = generateToken();
  user.resetTokenHash = hashToken(token);
  user.resetTokenExpiresAt = new Date(now.getTime() + RESET_TOKEN_TTL_MS);
  user.resetRequestedAt = now;
  await user.save();

  const resetUrl = `${SITE_URL}/admin/reset-password?token=${token}`;
  await sendEditorPasswordResetEmail({ email: normalized, resetUrl });

  return { ok: true, status: 200, message: GENERIC_MESSAGE };
}

export async function resetEditorPasswordWithToken(token, newPassword) {
  const trimmed = String(token ?? "").trim();
  if (!trimmed) {
    return { ok: false, status: 400, message: "This reset link is invalid." };
  }
  if (String(newPassword ?? "").length < 8) {
    return { ok: false, status: 400, message: "Password must be at least 8 characters." };
  }

  await connectDB();
  const user = await EditorUser.findOne({ resetTokenHash: hashToken(trimmed) });
  if (!user) {
    return { ok: false, status: 400, message: "This reset link is invalid or has already been used." };
  }
  if (!user.resetTokenExpiresAt || user.resetTokenExpiresAt < new Date()) {
    return { ok: false, status: 400, message: "This reset link has expired. Please request a new one." };
  }
  if (!user.active) {
    return { ok: false, status: 400, message: "This account is no longer active." };
  }

  user.passwordHash = hashPassword(newPassword);
  user.resetTokenHash = null;
  user.resetTokenExpiresAt = null;
  user.resetRequestedAt = null;
  await user.save();

  return {
    ok: true,
    status: 200,
    message: "Your password has been reset.",
    user: { _id: String(user._id), email: user.email, role: user.role },
  };
}
