import connectDB from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import NewsletterSend from "@/models/NewsletterSend";
import { sendBroadcastEmail, isEmailConfigured } from "@/lib/email";
import { siteBaseUrl } from "@/lib/subscriberTokens";

const BATCH_SIZE = 10;

export async function sendNewsletterUpdate({ subject, body, sentBy = "" }) {
  const trimmedSubject = String(subject ?? "").trim();
  const trimmedBody = String(body ?? "").trim();

  if (!trimmedSubject) {
    return { ok: false, status: 400, message: "Subject is required." };
  }
  if (!trimmedBody) {
    return { ok: false, status: 400, message: "Message body is required." };
  }
  if (!isEmailConfigured()) {
    return { ok: false, status: 503, message: "Email is not configured." };
  }

  await connectDB();
  const subscribers = await Subscriber.find({ status: "confirmed" })
    .select("email unsubscribeToken")
    .lean();

  if (subscribers.length === 0) {
    return { ok: false, status: 400, message: "No confirmed subscribers to send to." };
  }

  const baseUrl = siteBaseUrl();
  let sent = 0;
  const failures = [];

  for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
    const batch = subscribers.slice(i, i + BATCH_SIZE);
    await Promise.all(
      batch.map(async (sub) => {
        const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${sub.unsubscribeToken}`;
        try {
          await sendBroadcastEmail({
            to: sub.email,
            subject: trimmedSubject.slice(0, 200),
            body: trimmedBody.slice(0, 50000),
            unsubscribeUrl,
          });
          sent += 1;
        } catch (err) {
          failures.push({ email: sub.email, error: err.message });
        }
      }),
    );
  }

  await NewsletterSend.create({
    subject: trimmedSubject.slice(0, 200),
    body: trimmedBody.slice(0, 50000),
    recipientCount: sent,
    sentBy: String(sentBy).slice(0, 200),
  });

  if (sent === 0) {
    return {
      ok: false,
      status: 500,
      message: failures[0]?.error || "Failed to send to any subscribers.",
    };
  }

  return {
    ok: true,
    status: 200,
    message: `Sent to ${sent} subscriber${sent === 1 ? "" : "s"}.${failures.length ? ` ${failures.length} failed.` : ""}`,
    sent,
    failed: failures.length,
  };
}
