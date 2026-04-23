import mongoose from "mongoose";

function normalizeAnswer(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

const CrosswordEntrySchema = new mongoose.Schema(
  {
    answer: { type: String, required: true },
    answerNormalized: { type: String, required: true, unique: true, index: true },
    clue: { type: String, required: true },
    tags: [{ type: String, default: [] }],
    difficulty: { type: Number, default: 1, min: 1, max: 5 },
    enabled: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

CrosswordEntrySchema.index({ tags: 1, enabled: 1, updatedAt: -1 });

CrosswordEntrySchema.pre("validate", function preValidate(next) {
  if (this.answer) {
    this.answerNormalized = normalizeAnswer(this.answer);
  }
  next();
});

export default mongoose.models.CrosswordEntry ||
  mongoose.model("CrosswordEntry", CrosswordEntrySchema);

