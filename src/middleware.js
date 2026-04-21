import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV !== "development") {
      return new NextResponse("AUTH_SECRET is not configured", { status: 503 });
    }
    return NextResponse.next();
  }
  const token = request.cookies.get("ss_admin")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path+"],
};
