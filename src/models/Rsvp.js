import mongoose from "mongoose";

const RsvpSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    firstName: { type: String, required: true },
    lastInitial: { type: String, required: true },
    partySize: { type: Number, default: 1, min: 1, max: 10 },
    note: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.Rsvp || mongoose.model("Rsvp", RsvpSchema);
