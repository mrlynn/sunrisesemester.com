import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Report from "@/models/Report";
import { assertUserAdmin } from "@/lib/requireAdmin";
import { REPORT_CATEGORIES, REPORT_STATUSES } from "@/lib/reports";

export async function GET(request) {
  const denied = await assertUserAdmin();
  if (denied) return denied;

  try {
    const status = request.nextUrl.searchParams.get("status");
    const category = request.nextUrl.searchParams.get("category");
    const filter = {};

    if (status && REPORT_STATUSES.includes(status)) filter.status = status;
    if (category && REPORT_CATEGORIES.includes(category)) filter.category = category;

    await connectDB();
    const [items, counts] = await Promise.all([
      Report.find(filter).sort({ createdAt: -1 }).lean(),
      Report.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);
    const statusCounts = Object.fromEntries(counts.map((count) => [count._id, count.count]));

    return NextResponse.json({ items, statusCounts });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
