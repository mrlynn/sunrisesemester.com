import { NextResponse } from "next/server";
import { unsubscribeByToken } from "@/lib/subscribers";

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await unsubscribeByToken(body.token);
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: result.status });
    }
    return NextResponse.json({ message: result.message });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Unsubscribe failed." }, { status: 500 });
  }
}
