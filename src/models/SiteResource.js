import mongoose from "mongoose";

export const SITE_RESOURCE_CATEGORIES = [
  "meeting-format",
  "guide",
  "service",
  "link",
  "other",
];

export const SITE_RESOURCE_KINDS = ["pdf", "link"];

export const SITE_RESOURCE_MEETING_KEYS = [
  "weekday-mon",
  "weekday-tue",
  "weekday-wed",
  "weekday-thu",
  "weekday-fri",
  "saturday-men",
  "sunday",
];

const FileSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    pathname: { type: String, required: true },
    name: { type: String, default: "" },
    size: { type: Number, default: 0 },
    contentType: { type: String, default: "application/pdf" },
  },
  { _id: false },
);

const SiteResourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: SITE_RESOURCE_CATEGORIES,
      default: "link",
    },
    kind: {
      type: String,
      enum: SITE_RESOURCE_KINDS,
      required: true,
    },
    externalUrl: { type: String, default: "" },
    file: { type: FileSchema, default: undefined },
    sourceNote: { type: String, default: "" },
    /** Optional link to a /meetings format button (see src/lib/meetingFormats.js). */
    meetingKey: { type: String, default: "" },
    sortOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
  },
  { timestamps: true },
);

SiteResourceSchema.index({ published: 1, sortOrder: 1, title: 1 });

export default mongoose.models.SiteResource ||
  mongoose.model("SiteResource", SiteResourceSchema);
