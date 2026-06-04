import { NextResponse } from "next/server";
import { assertMinutesEditor } from "@/lib/requireAdmin";
import { getWeeklyServiceSchedule, saveWeeklyServiceSchedule } from "@/lib/weeklyService";

export async function GET() {
  const denied = await assertMinutesEditor();
  if (denied) return denied;
  try {
    const schedule = await getWeeklyServiceSchedule();
    return NextResponse.json(schedule);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const denied = await assertMinutesEditor();
  if (denied) return denied;
  try {
    const body = await request.json();
    const schedule = await saveWeeklyServiceSchedule(body);
    return NextResponse.json(schedule);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
