import { NextResponse } from "next/server";
import { MEMBER_COOKIE_NAME, signMemberToken } from "@/lib/memberAuth";
import { registerGroupMember } from "@/lib/groupMembers";

function setMemberCookie(res, token) {
  const isProd = process.env.NODE_ENV === "production";
  res.cookies.set(MEMBER_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function POST(request) {
  try {
    if (!process.env.AUTH_SECRET) {
      return NextResponse.json({ error: "AUTH_SECRET is not configured." }, { status: 503 });
    }
    if (!process.env.MONGODB_URI) {
      return NextResponse.json({ error: "Database is not configured." }, { status: 503 });
    }

    const body = await request.json();
    const password = String(body?.password ?? "");
    const confirmPassword = String(body?.confirmPassword ?? "");
    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    const member = await registerGroupMember({
      email: body.email,
      password,
      firstName: body.firstName,
      lastName: body.lastName,
    });

    const token = await signMemberToken({
      memberId: member._id,
      email: member.email,
    });
    const res = NextResponse.json({ ok: true, member });
    setMemberCookie(res, token);
    return res;
  } catch (e) {
    return NextResponse.json({ error: e.message || "Registration failed." }, { status: 400 });
  }
}
