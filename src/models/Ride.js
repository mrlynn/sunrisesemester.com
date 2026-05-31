import mongoose from "mongoose";

// Carpool coordination entry. `type` distinguishes someone offering a ride
// from someone who needs one. `contact` is PRIVATE: it is only ever returned
// to the organizer (admin) and is never exposed on the public board.
const RideSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    type: { type: String, enum: ["offer", "request"], required: true },
    firstName: { type: String, required: true },
    lastInitial: { type: String, required: true },
    area: { type: String, default: "" },
    seats: { type: Number, default: 1, min: 0, max: 20 },
    time: { type: String, default: "" },
    contact: { type: String, default: "" },
    note: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.Ride || mongoose.model("Ride", RideSchema);
