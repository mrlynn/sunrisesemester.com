import { NextResponse } from "next/server";
import { assertMember, getMemberSession } from "@/lib/requireMember";
import { getGroupMemberById, updateGroupMemberProfile } from "@/lib/groupMembers";

export async function GET() {
  const denied = await assertMember();
  if (denied) return denied;

  try {
    const session = await getMemberSession();
    const member = await getGroupMemberById(session.memberId);
    if (!member) {
      return NextResponse.json({ error: "Member not found." }, { status: 404 });
    }
    return NextResponse.json(member);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(request) {
  const denied = await assertMember();
  if (denied) return denied;

  try {
    const session = await getMemberSession();
    const body = await request.json();
    const member = await updateGroupMemberProfile(session.memberId, body);
    return NextResponse.json(member);
  } catch (e) {
    return NextResponse.json({ error: e.message || "Update failed." }, { status: 400 });
  }
}
