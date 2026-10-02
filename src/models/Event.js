import mongoose from "mongoose";
import { BRING_CATEGORIES } from "../lib/coordination.js";

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, index: { unique: true, sparse: true } },
    eventDate: { type: Date, required: true },
    location: { type: String, default: "" },
    body: { type: String, default: "" },
    flyerImage: { type: String, default: "" },
    flyer: {
      name: { type: String, default: "" },
      size: { type: Number, default: 0 },
      type: { type: String, default: "" },
      data: { type: Buffer },
    },
    published: { type: Boolean, default: true },
    rsvpEnabled: { type: Boolean, default: false },
    rsvpCapacity: { type: Number, default: 0 },
    coordinationEnabled: { type: Boolean, default: false },
    bringSlots: [
      {
        category: { type: String, enum: BRING_CATEGORIES, default: "food" },
        label: { type: String, default: "" },
        quantity: { type: Number, default: 1, min: 1, max: 99 },
      },
    ],
  },
  { timestamps: true },
);

EventSchema.pre("validate", function preValidate() {
  if (!this.slug && this.title) {
    this.slug = slugify(this.title);
  } else if (this.slug) {
    this.slug = slugify(this.slug);
  }
});

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
