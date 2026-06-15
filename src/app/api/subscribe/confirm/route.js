import { NextResponse } from "next/server";
import { confirmSubscription } from "@/lib/subscribers";

export async function GET(request) {
  try {
    const token = request.nextUrl.searchParams.get("token");
    const result = await confirmSubscription(token);
    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: result.status });
    }
    return NextResponse.json({ message: result.message });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Confirmation failed." }, { status: 500 });
  }
}
