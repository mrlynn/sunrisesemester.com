import { cookies } from "next/headers";
import { MEMBER_COOKIE_NAME, getMemberSessionFromToken } from "@/lib/memberAuth";

function unauthorized() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "content-type": "application/json" },
  });
}

export async function getMemberSession() {
  const store = await cookies();
  const token = store.get(MEMBER_COOKIE_NAME)?.value;
  return getMemberSessionFromToken(token);
}

export async function assertMember() {
  const session = await getMemberSession();
  if (!session?.memberId) {
    return unauthorized();
  }
  return null;
}
