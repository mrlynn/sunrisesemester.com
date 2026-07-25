import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Report from "@/models/Report";
import { assertUserAdmin } from "@/lib/requireAdmin";
import { parseAdminReportPatch } from "@/lib/reports";
import { isValidObjectIdString } from "@/lib/objectId";

export async function PATCH(request, { params }) {
  const denied = await assertUserAdmin();
  if (denied) return denied;

  try {
    const { id } = await params;
    if (!isValidObjectIdString(id)) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    const body = await request.json();
    const parsed = parseAdminReportPatch(body);
    if (!parsed.ok) {
      return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    }

    await connectDB();
    const report = await Report.findByIdAndUpdate(id, parsed.value, {
      new: true,
      runValidators: true,
    }).lean();
    if (!report) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }

    return NextResponse.json({ item: report });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
