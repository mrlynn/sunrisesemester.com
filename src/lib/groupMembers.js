import connectDB from "@/lib/mongodb";
import GroupMember, { MEMBER_VISIBILITY } from "@/models/GroupMember";
import { hashPassword, verifyPassword } from "@/lib/password";
import { serializeAnniversary } from "@/lib/anniversaries";
import { isValidObjectIdString } from "@/lib/objectId";

const DEFAULT_VISIBILITY = {
  name: "public",
  phone: "group",
  email: "group",
  address: "group",
  sobrietyDate: "public",
  anniversaryNote: "public",
};

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase()
    .slice(0, 320);
}

function normalizeVisibility(raw) {
  const out = { ...DEFAULT_VISIBILITY };
  if (!raw || typeof raw !== "object") return out;
  for (const key of Object.keys(DEFAULT_VISIBILITY)) {
    const value = raw[key];
    if (MEMBER_VISIBILITY.includes(value)) {
      out[key] = value;
    }
  }
  return out;
}

export function publicDisplayName(member) {
  if (!member || member.visibility?.name !== "public") return "";
  const initial = member.lastName ? `${member.lastName.charAt(0).toUpperCase()}.` : "";
  return `${member.firstName} ${initial}`.trim();
}

function serializeMember(doc, { forAdmin = false, forSelf = false } = {}) {
  const visibility = normalizeVisibility(doc.visibility);
  const base = {
    _id: String(doc._id),
    email: doc.email,
    firstName: doc.firstName,
    lastName: doc.lastName,
    phone: doc.phone || "",
    mailingAddress: doc.mailingAddress || "",
    cityStateZip: doc.cityStateZip || "",
    sobrietyDate: doc.sobrietyDate ? new Date(doc.sobrietyDate).toISOString() : null,
    anniversaryNote: doc.anniversaryNote || "",
    visibility,
    active: Boolean(doc.active),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };

  if (forSelf || forAdmin) {
    return base;
  }

  const publicProfile = { _id: base._id };
  if (visibility.name === "public") {
    publicProfile.displayName = publicDisplayName({ ...doc, visibility });
  }
  if (visibility.email === "public") publicProfile.email = base.email;
  if (visibility.phone === "public") publicProfile.phone = base.phone;
  if (visibility.address === "public") {
    publicProfile.mailingAddress = base.mailingAddress;
    publicProfile.cityStateZip = base.cityStateZip;
  }
  if (visibility.sobrietyDate === "public" && base.sobrietyDate) {
    publicProfile.sobrietyDate = base.sobrietyDate;
  }
  if (visibility.anniversaryNote === "public" && base.anniversaryNote) {
    publicProfile.anniversaryNote = base.anniversaryNote;
  }
  return publicProfile;
}

export async function findGroupMemberByEmail(email) {
  await connectDB();
  return GroupMember.findOne({ email: normalizeEmail(email) }).lean();
}

export async function getGroupMemberById(id) {
  if (!isValidObjectIdString(id)) return null;
  await connectDB();
  const doc = await GroupMember.findById(id).lean();
  if (!doc) return null;
  return serializeMember(doc, { forSelf: true });
}

export async function registerGroupMember({ email, password, firstName, lastName }) {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail.includes("@")) {
    throw new Error("A valid email address is required.");
  }
  if (String(password).length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }
  const fn = String(firstName ?? "").trim().slice(0, 80);
  const ln = String(lastName ?? "").trim().slice(0, 80);
  if (!fn || !ln) {
    throw new Error("First and last name are required.");
  }

  await connectDB();
  const exists = await GroupMember.exists({ email: normalizedEmail });
  if (exists) {
    throw new Error("An account with this email already exists.");
  }

  const doc = await GroupMember.create({
    email: normalizedEmail,
    passwordHash: hashPassword(password),
    firstName: fn,
    lastName: ln,
    visibility: DEFAULT_VISIBILITY,
  });
  return serializeMember(doc.toObject(), { forSelf: true });
}

export async function authenticateGroupMember(email, password) {
  const doc = await findGroupMemberByEmail(email);
  if (!doc || !doc.active) {
    return null;
  }
  if (!verifyPassword(password, doc.passwordHash)) {
    return null;
  }
  return serializeMember(doc, { forSelf: true });
}

function parseProfileInput(body) {
  const firstName = String(body?.firstName ?? "").trim().slice(0, 80);
  const lastName = String(body?.lastName ?? "").trim().slice(0, 80);
  if (!firstName || !lastName) {
    throw new Error("First and last name are required.");
  }

  let sobrietyDate = null;
  const rawDate = String(body?.sobrietyDate ?? "").trim();
  if (rawDate) {
    const parsed = new Date(rawDate);
    if (Number.isNaN(parsed.getTime())) {
      throw new Error("Sobriety date is invalid.");
    }
    sobrietyDate = parsed;
  }

  const newPassword = String(body?.newPassword ?? "");
  const currentPassword = String(body?.currentPassword ?? "");
  if (newPassword && newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters.");
  }
  if (newPassword && !currentPassword) {
    throw new Error("Current password is required to set a new password.");
  }

  return {
    firstName,
    lastName,
    phone: String(body?.phone ?? "").trim().slice(0, 40),
    mailingAddress: String(body?.mailingAddress ?? "").trim().slice(0, 300),
    cityStateZip: String(body?.cityStateZip ?? "").trim().slice(0, 200),
    sobrietyDate,
    anniversaryNote: String(body?.anniversaryNote ?? "").trim().slice(0, 500),
    visibility: normalizeVisibility(body?.visibility),
    newPassword,
    currentPassword,
  };
}

export async function updateGroupMemberProfile(memberId, body) {
  if (!isValidObjectIdString(memberId)) {
    throw new Error("Member not found.");
  }
  const parsed = parseProfileInput(body);
  await connectDB();
  const member = await GroupMember.findById(memberId);
  if (!member || !member.active) {
    throw new Error("Member not found.");
  }

  if (parsed.newPassword) {
    if (!verifyPassword(parsed.currentPassword, member.passwordHash)) {
      throw new Error("Current password is incorrect.");
    }
    member.passwordHash = hashPassword(parsed.newPassword);
  }

  member.firstName = parsed.firstName;
  member.lastName = parsed.lastName;
  member.phone = parsed.phone;
  member.mailingAddress = parsed.mailingAddress;
  member.cityStateZip = parsed.cityStateZip;
  member.sobrietyDate = parsed.sobrietyDate;
  member.anniversaryNote = parsed.anniversaryNote;
  member.visibility = parsed.visibility;
  await member.save();
  return serializeMember(member.toObject(), { forSelf: true });
}

export async function listGroupMembersForAdmin() {
  await connectDB();
  const docs = await GroupMember.find({ active: true })
    .sort({ lastName: 1, firstName: 1 })
    .lean();
  return docs.map((d) => serializeMember(d, { forAdmin: true }));
}

/** Public anniversary cards sourced from member profiles. */
export async function listPublicMemberAnniversaries(now = new Date()) {
  if (!process.env.MONGODB_URI) {
    return [];
  }
  await connectDB();
  const docs = await GroupMember.find({
    active: true,
    sobrietyDate: { $ne: null },
    "visibility.sobrietyDate": "public",
    "visibility.name": "public",
  })
    .sort({ sobrietyDate: 1 })
    .lean();

  return docs
    .map((doc) => {
      const name = publicDisplayName({ ...doc, visibility: normalizeVisibility(doc.visibility) });
      if (!name) return null;
      const serialized = serializeAnniversary(
        {
          _id: doc._id,
          name,
          note:
            doc.visibility?.anniversaryNote === "public" ? doc.anniversaryNote || "" : "",
          sobrietyDate: doc.sobrietyDate,
        },
        now,
      );
      return { ...serialized, source: "member" };
    })
    .filter(Boolean);
}

export function applyVisibilityForAdmin(member) {
  return {
    _id: member._id,
    displayName: `${member.firstName} ${member.lastName}`.trim(),
    email: member.email,
    phone: member.phone || "",
    mailingAddress: member.mailingAddress || "",
    cityStateZip: member.cityStateZip || "",
    sobrietyDate: member.sobrietyDate || null,
    anniversaryNote: member.anniversaryNote || "",
    visibility: member.visibility,
  };
}
