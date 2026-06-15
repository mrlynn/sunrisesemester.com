import connectDB from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import { sendConfirmationEmail, isEmailConfigured } from "@/lib/email";
import {
  confirmTokenExpiresAt,
  generateToken,
  isValidEmail,
  normalizeEmail,
  siteBaseUrl,
} from "@/lib/subscriberTokens";

const RESEND_COOLDOWN_MS = 5 * 60 * 1000;

export async function requestSubscription(email, { source = "subscribe-page" } = {}) {
  const normalized = normalizeEmail(email);
  if (!isValidEmail(normalized)) {
    return { ok: false, status: 400, message: "Please enter a valid email address." };
  }

  if (!isEmailConfigured()) {
    return { ok: false, status: 503, message: "Email is not configured yet. Please try again later." };
  }

  await connectDB();
  let subscriber = await Subscriber.findOne({ email: normalized });

  if (subscriber?.status === "confirmed") {
    return {
      ok: true,
      status: 200,
      message: "If this address is on our list, it is already confirmed. Check your inbox for past updates.",
    };
  }

  const now = new Date();
  const confirmToken = generateToken();
  const confirmUrl = `${siteBaseUrl()}/subscribe/confirm?token=${confirmToken}`;

  if (!subscriber) {
    subscriber = await Subscriber.create({
      email: normalized,
      status: "pending",
      confirmToken,
      confirmTokenExpiresAt: confirmTokenExpiresAt(),
      confirmSentAt: now,
      unsubscribeToken: generateToken(),
      source,
    });
  } else {
    if (
      subscriber.status === "pending" &&
      subscriber.confirmSentAt &&
      now.getTime() - subscriber.confirmSentAt.getTime() < RESEND_COOLDOWN_MS
    ) {
      return {
        ok: true,
        status: 200,
        message: "Check your inbox for a confirmation link. You can request another in a few minutes.",
      };
    }

    subscriber.status = "pending";
    subscriber.confirmToken = confirmToken;
    subscriber.confirmTokenExpiresAt = confirmTokenExpiresAt();
    subscriber.confirmSentAt = now;
    subscriber.confirmedAt = null;
    subscriber.unsubscribedAt = null;
    if (!subscriber.unsubscribeToken) {
      subscriber.unsubscribeToken = generateToken();
    }
    await subscriber.save();
  }

  await sendConfirmationEmail({ email: normalized, confirmUrl });

  return {
    ok: true,
    status: 200,
    message: "Check your inbox for a confirmation link to complete your subscription.",
  };
}

export async function confirmSubscription(token) {
  const trimmed = String(token ?? "").trim();
  if (!trimmed) {
    return { ok: false, status: 400, message: "Invalid confirmation link." };
  }

  await connectDB();
  const subscriber = await Subscriber.findOne({ confirmToken: trimmed });
  if (!subscriber) {
    return { ok: false, status: 400, message: "This confirmation link is invalid or has already been used." };
  }

  if (subscriber.confirmTokenExpiresAt && subscriber.confirmTokenExpiresAt < new Date()) {
    return { ok: false, status: 400, message: "This confirmation link has expired. Please subscribe again." };
  }

  subscriber.status = "confirmed";
  subscriber.confirmedAt = new Date();
  subscriber.confirmToken = null;
  subscriber.confirmTokenExpiresAt = null;
  await subscriber.save();

  return { ok: true, status: 200, message: "You're subscribed. You'll receive group updates at this address." };
}

export async function unsubscribeByToken(token) {
  const trimmed = String(token ?? "").trim();
  if (!trimmed) {
    return { ok: false, status: 400, message: "Invalid unsubscribe link." };
  }

  await connectDB();
  const subscriber = await Subscriber.findOne({ unsubscribeToken: trimmed });
  if (!subscriber) {
    return { ok: false, status: 400, message: "This unsubscribe link is invalid." };
  }

  if (subscriber.status === "unsubscribed") {
    return { ok: true, status: 200, message: "You are already unsubscribed." };
  }

  subscriber.status = "unsubscribed";
  subscriber.unsubscribedAt = new Date();
  await subscriber.save();

  return { ok: true, status: 200, message: "You have been unsubscribed. You won't receive further emails." };
}
