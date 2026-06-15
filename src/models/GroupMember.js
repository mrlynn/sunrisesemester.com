import mongoose from "mongoose";

const VISIBILITY = ["public", "group"];

const VisibilitySchema = new mongoose.Schema(
  {
    name: { type: String, enum: VISIBILITY, default: "public" },
    phone: { type: String, enum: VISIBILITY, default: "group" },
    email: { type: String, enum: VISIBILITY, default: "group" },
    address: { type: String, enum: VISIBILITY, default: "group" },
    sobrietyDate: { type: String, enum: VISIBILITY, default: "public" },
    anniversaryNote: { type: String, enum: VISIBILITY, default: "public" },
  },
  { _id: false },
);

const GroupMemberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, default: "" },
    mailingAddress: { type: String, default: "" },
    cityStateZip: { type: String, default: "" },
    sobrietyDate: { type: Date, default: null },
    anniversaryNote: { type: String, default: "" },
    visibility: { type: VisibilitySchema, default: () => ({}) },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const MEMBER_VISIBILITY = VISIBILITY;

export default mongoose.models.GroupMember ||
  mongoose.model("GroupMember", GroupMemberSchema);
