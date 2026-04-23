import mongoose from "mongoose";

const PuzzleUserSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    displayName: { type: String, default: "Anonymous" },
  },
  { timestamps: true },
);

export default mongoose.models.PuzzleUser ||
  mongoose.model("PuzzleUser", PuzzleUserSchema);

