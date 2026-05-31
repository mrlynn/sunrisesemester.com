import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";

export async function GET(request, context) {
  const { id } = await context.params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: "Invalid event." }, { status: 400 });
  }
  await connectDB();
  const ev = await Event.findOne({ _id: id, published: true })
    .select({ flyer: 1 })
    .lean();
  if (!ev || !ev.flyer?.data) {
    return NextResponse.json({ error: "No flyer available." }, { status: 404 });
  }

  const { name, type, data } = ev.flyer;
  const bytes = Buffer.isBuffer(data) ? data : Buffer.from(data.buffer ?? data);
  const fallbackName = (name || "flyer").replace(/"/g, "");
  const disposition =
    request.nextUrl.searchParams.get("download") === "1" ? "attachment" : "inline";

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "Content-Type": type || "application/octet-stream",
      "Content-Disposition": `${disposition}; filename="${fallbackName}"`,
      "Content-Length": String(bytes.length),
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
