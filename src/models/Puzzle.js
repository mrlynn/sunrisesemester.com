import mongoose from "mongoose";

const PuzzleSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, default: "" },
    weekOf: { type: Date, required: true },
    publishedAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    crosswordData: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true },
);

PuzzleSchema.index({ status: 1, publishedAt: -1 });
PuzzleSchema.index({ weekOf: -1 });

export default mongoose.models.Puzzle || mongoose.model("Puzzle", PuzzleSchema);

