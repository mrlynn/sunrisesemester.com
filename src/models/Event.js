import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    eventDate: { type: Date, required: true },
    location: { type: String, default: "" },
    body: { type: String, default: "" },
    flyerImage: { type: String, default: "" },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
