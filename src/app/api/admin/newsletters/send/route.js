import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import NewsletterSend from "@/models/NewsletterSend";
import { assertAdmin, getAuthSession } from "@/lib/requireAdmin";
import { sendNewsletterUpdate } from "@/lib/newsletters";

export async function POST(request) {
  const denied = await assertAdmin();
  if (denied) {
    return denied;
  }

  try {
    const body = await request.json();
    const session = await getAuthSession();
    const result = await sendNewsletterUpdate({
      subject: body.subject,
      body: body.body,
      sentBy: session?.email || session?.name || "",
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: result.status });
    }

    return NextResponse.json({
      message: result.message,
      sent: result.sent,
      failed: result.failed,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Send failed." }, { status: 500 });
  }
}

export async function GET() {
  const denied = await assertAdmin();
  if (denied) {
    return denied;
  }

  try {
    await connectDB();
    const sends = await NewsletterSend.find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .select("subject recipientCount sentBy createdAt")
      .lean();
    return NextResponse.json(sends);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
