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
  },
  { timestamps: true },
);

export default mongoose.models.EditorUser ||
  mongoose.model("EditorUser", EditorUserSchema);
