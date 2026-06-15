import { NextResponse } from "next/server";
import { assertAdmin } from "@/lib/requireAdmin";
import { listGroupMembersForAdmin, applyVisibilityForAdmin } from "@/lib/groupMembers";

export async function GET() {
  const denied = await assertAdmin();
  if (denied) return denied;

  try {
    const members = await listGroupMembersForAdmin();
    return NextResponse.json(members.map(applyVisibilityForAdmin));
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
