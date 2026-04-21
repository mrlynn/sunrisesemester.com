import { cookies } from "next/headers";
import { COOKIE_NAME, verifyAdminToken } from "@/lib/auth";

export async function assertAdmin() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  const ok = await verifyAdminToken(token);
  if (!ok) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  return null;
}
