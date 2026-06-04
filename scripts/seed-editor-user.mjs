/**
 * Create or update the first administrator account.
 * Run: node --env-file=.env.local scripts/seed-editor-user.mjs
 *
 * Env:
 *   ADMIN_EMAIL  (required) e.g. you@example.com
 *   ADMIN_PASSWORD (required, min 8 chars)
 *   ADMIN_NAME (optional)
 */
import connectDB from "../src/lib/mongodb.js";
import EditorUser from "../src/models/EditorUser.js";
import { hashPassword } from "../src/lib/password.js";

const email = String(process.env.ADMIN_EMAIL || "")
  .trim()
  .toLowerCase();
const password = String(process.env.ADMIN_PASSWORD || "");
const name = String(process.env.ADMIN_NAME || "").trim();

if (!email || !email.includes("@")) {
  console.error("Set ADMIN_EMAIL to a valid email address.");
  process.exit(1);
}
if (password.length < 8) {
  console.error("Set ADMIN_PASSWORD (at least 8 characters).");
  process.exit(1);
}

await connectDB();

const doc = await EditorUser.findOneAndUpdate(
  { email },
  {
    $set: {
      email,
      passwordHash: hashPassword(password),
      role: "admin",
      name,
      active: true,
    },
  },
  { upsert: true, new: true },
);

console.log(`Administrator ready: ${doc.email} (${doc.role})`);
process.exit(0);
