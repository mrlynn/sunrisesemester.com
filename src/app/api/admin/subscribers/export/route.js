import connectDB from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import { assertAdmin } from "@/lib/requireAdmin";

function csvEscape(value) {
  const text = String(value ?? "");
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export async function GET() {
  const denied = await assertAdmin();
  if (denied) {
    return denied;
  }

  try {
    await connectDB();
    const items = await Subscriber.find({ status: "confirmed" })
      .select("email confirmedAt createdAt")
      .sort({ email: 1 })
      .lean();

    const header = "email,confirmedAt,subscribedAt";
    const rows = items.map((item) =>
      [
        csvEscape(item.email),
        csvEscape(item.confirmedAt?.toISOString() || ""),
        csvEscape(item.createdAt?.toISOString() || ""),
      ].join(","),
    );
    const csv = [header, ...rows].join("\n");

    return new Response(csv, {
      status: 200,
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="subscribers-confirmed.csv"',
      },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
