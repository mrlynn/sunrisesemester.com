import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "ss_admin";

function getSecret() {
  const raw = process.env.AUTH_SECRET;
  if (!raw) {
    throw new Error("AUTH_SECRET is not set.");
  }
  return new TextEncoder().encode(raw);
}

export { COOKIE_NAME };

export async function signAdminToken() {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(getSecret());
}

export async function verifyAdminToken(token) {
  if (!token) {
    return false;
  }
  const raw = process.env.AUTH_SECRET;
  if (!raw) {
    return false;
  }
  try {
    await jwtVerify(token, new TextEncoder().encode(raw));
    return true;
  } catch {
    return false;
  }
}
