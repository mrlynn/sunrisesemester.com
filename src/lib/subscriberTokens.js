import crypto from "crypto";

export function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function confirmTokenExpiresAt() {
  return new Date(Date.now() + 48 * 60 * 60 * 1000);
}

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

export function normalizeEmail(value) {
  return String(value ?? "").trim().toLowerCase();
}

export function isValidEmail(value) {
  const email = normalizeEmail(value);
  return email.length > 0 && email.length <= 254 && EMAIL_RE.test(email);
}

export function siteBaseUrl() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "https://www.sunrisesemester.com";
  return base.replace(/\/$/, "");
}
