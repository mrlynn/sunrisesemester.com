import mongoose from "mongoose";

const PuzzleRunSchema = new mongoose.Schema(
  {
    puzzleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Puzzle",
      required: true,
      index: true,
    },
    userId: { type: String, required: true, index: true },
    displayName: { type: String, default: "Anonymous" },

    startedAt: { type: Date, required: true },
    lastSavedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null, index: true },

    elapsedMs: { type: Number, default: null, index: true },
    checksUsed: { type: Number, default: 0 },
    revealsUsed: { type: Number, default: 0 },

    // Client state from the crossword component; treated as an opaque blob.
    gridState: { type: mongoose.Schema.Types.Mixed, default: null },
  },
  { timestamps: true },
);

PuzzleRunSchema.index({ puzzleId: 1, userId: 1 }, { unique: true });
PuzzleRunSchema.index({ puzzleId: 1, completedAt: 1, elapsedMs: 1 });

export default mongoose.models.PuzzleRun ||
  mongoose.model("PuzzleRun", PuzzleRunSchema);

