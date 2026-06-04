import connectDB from "@/lib/mongodb";
import EditorUser from "@/models/EditorUser";
import { hashPassword } from "@/lib/password";
import { isValidObjectIdString } from "@/lib/objectId";
import { isRole } from "@/lib/roles";

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase()
    .slice(0, 320);
}

export function serializeEditorUser(doc) {
  return {
    _id: String(doc._id),
    email: doc.email,
    role: doc.role,
    name: doc.name || "",
    active: Boolean(doc.active),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function findEditorUserByEmail(email) {
  await connectDB();
  return EditorUser.findOne({ email: normalizeEmail(email) }).lean();
}

export async function listEditorUsers() {
  await connectDB();
  const docs = await EditorUser.find({}).sort({ email: 1 }).lean();
  return docs.map(serializeEditorUser);
}

export async function getEditorUserById(id) {
  if (!isValidObjectIdString(id)) return null;
  await connectDB();
  const doc = await EditorUser.findById(id).lean();
  if (!doc) return null;
  return serializeEditorUser(doc);
}

export async function countActiveAdmins(excludeId) {
  await connectDB();
  const query = { role: "admin", active: true };
  if (excludeId) query._id = { $ne: excludeId };
  return EditorUser.countDocuments(query);
}

export function parseEditorUserInput(body, { requirePassword }) {
  const email = normalizeEmail(body?.email);
  if (!email || !email.includes("@")) {
    throw new Error("A valid email address is required.");
  }
  const role = body?.role;
  if (!isRole(role)) {
    throw new Error("Select a valid role.");
  }
  const name = String(body?.name ?? "").trim().slice(0, 120);
  const active = body?.active !== false;
  const password = String(body?.password ?? "");
  if (requirePassword && password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }
  if (!requirePassword && password && password.length < 8) {
    throw new Error("New password must be at least 8 characters.");
  }
  return { email, role, name, active, password };
}

export async function createEditorUser(input) {
  const parsed = parseEditorUserInput(input, { requirePassword: true });
  await connectDB();
  const exists = await EditorUser.exists({ email: parsed.email });
  if (exists) {
    throw new Error("An account with this email already exists.");
  }
  const doc = await EditorUser.create({
    email: parsed.email,
    role: parsed.role,
    name: parsed.name,
    active: parsed.active,
    passwordHash: hashPassword(parsed.password),
  });
  return serializeEditorUser(doc.toObject());
}

export async function updateEditorUser(id, input) {
  const parsed = parseEditorUserInput(input, { requirePassword: false });
  await connectDB();
  const existing = await EditorUser.findById(id);
  if (!existing) {
    throw new Error("User not found.");
  }
  const emailTaken = await EditorUser.exists({
    email: parsed.email,
    _id: { $ne: id },
  });
  if (emailTaken) {
    throw new Error("An account with this email already exists.");
  }
  if (existing.role === "admin" && parsed.role !== "admin" && parsed.active) {
    const admins = await countActiveAdmins(id);
    if (admins === 0) {
      throw new Error("Cannot remove the last active administrator.");
    }
  }
  if (existing.role === "admin" && !parsed.active) {
    const admins = await countActiveAdmins(id);
    if (admins === 0) {
      throw new Error("Cannot deactivate the last active administrator.");
    }
  }

  existing.email = parsed.email;
  existing.role = parsed.role;
  existing.name = parsed.name;
  existing.active = parsed.active;
  if (parsed.password) {
    existing.passwordHash = hashPassword(parsed.password);
  }
  await existing.save();
  return serializeEditorUser(existing.toObject());
}

export async function deleteEditorUser(id) {
  await connectDB();
  const existing = await EditorUser.findById(id);
  if (!existing) {
    throw new Error("User not found.");
  }
  if (existing.role === "admin" && existing.active) {
    const admins = await countActiveAdmins(id);
    if (admins === 0) {
      throw new Error("Cannot delete the last active administrator.");
    }
  }
  await EditorUser.findByIdAndDelete(id);
  return { ok: true };
}
