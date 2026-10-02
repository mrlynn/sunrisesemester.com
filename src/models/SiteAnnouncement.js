import mongoose from "mongoose";

const SiteAnnouncementSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    enabled: { type: Boolean, default: false },
    message: { type: String, default: "" },
    href: { type: String, default: "" },
    linkLabel: { type: String, default: "Read more" },
    dismissible: { type: Boolean, default: true },
    startsAt: { type: Date, default: null },
    endsAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export default mongoose.models.SiteAnnouncement ||
  mongoose.model("SiteAnnouncement", SiteAnnouncementSchema);
