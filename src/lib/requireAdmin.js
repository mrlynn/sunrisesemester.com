import { cookies } from "next/headers";
import { COOKIE_NAME, getSessionFromToken } from "@/lib/auth";
import {
  canEditContent,
  canEditMinutes,
  canManageUsers,
  isRole,
} from "@/lib/roles";

function unauthorized() {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "content-type": "application/json" },
  });
}

function forbidden() {
  return new Response(JSON.stringify({ error: "Forbidden" }), {
    status: 403,
    headers: { "content-type": "application/json" },
  });
}

export async function getAuthSession() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  return getSessionFromToken(token);
}

export async function assertAuth(check) {
  const session = await getAuthSession();
  if (!session || !isRole(session.role)) {
    return unauthorized();
  }
  if (check === "users" && !canManageUsers(session.role)) {
    return forbidden();
  }
  if (check === "content" && !canEditContent(session.role)) {
    return forbidden();
  }
  if (check === "minutes" && !canEditMinutes(session.role)) {
    return forbidden();
  }
  return null;
}

/** Any signed-in editor (all roles). */
export async function assertSignedIn() {
  return assertAuth("minutes");
}

/** Site content — admin and editor. */
export async function assertAdmin() {
  return assertAuth("content");
}

/** Business meeting minutes — admin, editor, secretary. */
export async function assertMinutesEditor() {
  return assertAuth("minutes");
}

/** User management — admin only. */
export async function assertUserAdmin() {
  return assertAuth("users");
}
