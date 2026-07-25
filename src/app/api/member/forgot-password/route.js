import { NextResponse } from "next/server";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";
import { requestPasswordReset } from "@/lib/passwordReset";

export async function POST(request) {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
    }

    const ip = clientIp(request);
    const limited = await checkRateLimit(`forgot-password:${ip}`, {
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
    const result = await requestPasswordReset(body?.email);
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: result.status });
    }
    return NextResponse.json({ message: result.message });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Request failed." }, { status: 500 });
  }
}
