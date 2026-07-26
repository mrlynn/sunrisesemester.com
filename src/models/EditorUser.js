import mongoose from "mongoose";
import { ROLES } from "../lib/roles.js";

const EditorUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ROLES, default: "editor" },
    name: { type: String, default: "" },
    active: { type: Boolean, default: true },
    resetTokenHash: { type: String, default: null },
    resetTokenExpiresAt: { type: Date, default: null },
    resetRequestedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

EditorUserSchema.index({ resetTokenHash: 1 }, { sparse: true });

export default mongoose.models.EditorUser ||
  mongoose.model("EditorUser", EditorUserSchema);
