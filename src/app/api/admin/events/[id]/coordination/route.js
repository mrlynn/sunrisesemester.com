import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import EventContribution from "@/models/EventContribution";
import Ride from "@/models/Ride";
import { assertAdmin } from "@/lib/requireAdmin";

export async function DELETE(request, context) {
  const denied = await assertAdmin();
  if (denied) return denied;
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind");
  const itemId = searchParams.get("itemId");
  if (!mongoose.isValidObjectId(itemId)) {
    return NextResponse.json({ error: "Invalid item id" }, { status: 400 });
  }
  try {
    await connectDB();
    if (kind === "contribution") {
      await EventContribution.deleteOne({ _id: itemId, event: id });
    } else if (kind === "ride") {
      await Ride.deleteOne({ _id: itemId, event: id });
    } else {
      return NextResponse.json({ error: "Unknown kind" }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
