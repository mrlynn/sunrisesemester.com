import mongoose from "mongoose";

const LandingSchema = new mongoose.Schema(
  {
    key: { type: String, default: "main", unique: true },
    heroTitle: { type: String, default: "Sunrise Semester" },
    heroSubtitle: { type: String, default: "A home group of Alcoholics Anonymous" },
    body: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.Landing || mongoose.model("Landing", LandingSchema);
