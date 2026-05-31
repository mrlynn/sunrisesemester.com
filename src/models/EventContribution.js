import mongoose from "mongoose";
import { BRING_CATEGORIES } from "../lib/coordination.js";

// A single "I'm bringing X" entry. Either claims an admin-defined bring slot
// (slot points at an Event.bringSlots subdocument _id) or is an open extra
// (slot is null). Anonymity-light, matching the RSVP model.
const EventContributionSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    slot: { type: mongoose.Schema.Types.ObjectId, default: null },
    category: { type: String, enum: BRING_CATEGORIES, default: "other" },
    item: { type: String, default: "" },
    quantity: { type: Number, default: 1, min: 1, max: 50 },
    firstName: { type: String, required: true },
    lastInitial: { type: String, required: true },
    note: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.EventContribution ||
  mongoose.model("EventContribution", EventContributionSchema);
