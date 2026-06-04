import { NextResponse } from "next/server";
import { assertUserAdmin } from "@/lib/requireAdmin";
import { createEditorUser, listEditorUsers } from "@/lib/editorUsers";

export async function GET() {
  const denied = await assertUserAdmin();
  if (denied) return denied;
  try {
    const users = await listEditorUsers();
    return NextResponse.json(users);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  const denied = await assertUserAdmin();
  if (denied) return denied;
  try {
    const body = await request.json();
    const user = await createEditorUser(body);
    return NextResponse.json(user);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
