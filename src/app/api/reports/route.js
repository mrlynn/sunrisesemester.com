import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Report from "@/models/Report";
import { checkRateLimit, clientIp } from "@/lib/rateLimit";
import { parseReportInput } from "@/lib/reports";
import { isEmailConfigured, sendReportNotificationEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const ip = clientIp(request);
    const limited = await checkRateLimit(`reports:${ip}`, {
      limit: 5,
      windowMs: 60 * 60 * 1000,
    });
    if (!limited.allowed) {
      return NextResponse.json(
        { error: "Too many reports from this network. Please try again later." },
        { status: 429 },
      );
    }

    const body = await request.json();
    const parsed = parseReportInput(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    }

    await connectDB();
    const report = await Report.create({
      ...parsed.value,
      ip,
      userAgent: String(request.headers.get("user-agent") || "").slice(0, 500),
      status: "new",
    });

    if (isEmailConfigured()) {
      try {
        const base = (process.env.NEXT_PUBLIC_BASE_URL || "").replace(/\/$/, "");
        await sendReportNotificationEmail({
          report,
          adminUrl: `${base}/admin/reports`,
        });
      } catch (emailErr) {
        console.error("Report saved but notification email failed:", emailErr);
      }
    } else {
      console.error("Report saved but email is not configured.");
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Could not submit report." },
      { status: 500 },
    );
  }
}
