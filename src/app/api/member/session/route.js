import { NextResponse } from "next/server";
import { getMemberSession } from "@/lib/requireMember";
import { getGroupMemberById } from "@/lib/groupMembers";

export async function GET() {
  try {
    const session = await getMemberSession();
    if (!session?.memberId) {
      return NextResponse.json({ authenticated: false });
    }
    const member = await getGroupMemberById(session.memberId);
    if (!member) {
      return NextResponse.json({ authenticated: false });
    }
    return NextResponse.json({
      authenticated: true,
      email: member.email,
      firstName: member.firstName,
    });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}
