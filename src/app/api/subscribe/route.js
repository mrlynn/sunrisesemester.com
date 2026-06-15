import { NextResponse } from "next/server";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";
import { requestSubscription } from "@/lib/subscribers";

export async function POST(request) {
  try {
    const ip = clientIp(request);
    const limited = await checkRateLimit(`subscribe:${ip}`, {
      limit: 10,
      windowMs: 60 * 60 * 1000,
    });
    if (!limited.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const honeypot = String(body.website ?? "").trim();
    if (honeypot) {
      return NextResponse.json({
        message: "Check your inbox for a confirmation link to complete your subscription.",
      });
    }

    const agreed = body.agreed === true || body.agreed === "true";
    if (!agreed) {
      return NextResponse.json(
        { error: "Please confirm that you want to receive group updates." },
        { status: 400 },
      );
    }

    const result = await requestSubscription(body.email, { source: "subscribe-page" });
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: result.status });
    }
    return NextResponse.json({ message: result.message });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Subscription failed." }, { status: 500 });
  }
}
