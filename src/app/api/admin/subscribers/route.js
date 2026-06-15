import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import { assertAdmin } from "@/lib/requireAdmin";

export async function GET(request) {
  const denied = await assertAdmin();
  if (denied) {
    return denied;
  }

  try {
    const status = request.nextUrl.searchParams.get("status");
    const q = request.nextUrl.searchParams.get("q");

    const filter = {};
    if (status && ["pending", "confirmed", "unsubscribed"].includes(status)) {
      filter.status = status;
    }
    if (q) {
      filter.email = { $regex: String(q).trim().slice(0, 100), $options: "i" };
    }

    await connectDB();
    const items = await Subscriber.find(filter)
      .select("email status confirmedAt unsubscribedAt createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .lean();

    const counts = await Subscriber.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);
    const statusCounts = Object.fromEntries(counts.map((c) => [c._id, c.count]));

    return NextResponse.json({ items, statusCounts });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
